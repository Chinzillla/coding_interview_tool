import { randomBytes, createHash, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "coding-study-session";
const SESSION_DAYS = 30;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest();
}

export function isSetupTokenRequired() {
  return process.env.NODE_ENV === "production" || Boolean(process.env.SETUP_TOKEN);
}

export function isTwoFactorRequired() {
  const value = process.env.TWO_FACTOR_REQUIRED;
  if (typeof value === "string") {
    return ["1", "true", "yes", "on"].includes(value.toLowerCase());
  }

  return process.env.NODE_ENV === "production";
}

export function allowedEmail() {
  return process.env.ALLOWED_EMAIL?.trim().toLowerCase() || null;
}

export function isAllowedEmail(email: string) {
  const allowed = allowedEmail();
  if (!allowed) return process.env.NODE_ENV !== "production";

  return normalizeEmail(email) === allowed;
}

export function validateSetupToken(token: string | null | undefined) {
  if (!isSetupTokenRequired()) return true;

  const expected = process.env.SETUP_TOKEN;
  if (!expected || !token) return false;

  const expectedHash = hashValue(expected);
  const actualHash = hashValue(token);
  return timingSafeEqual(expectedHash, actualHash);
}

export async function hasUsers() {
  return (await prisma.user.count()) > 0;
}

export async function createFirstUser(email: string, password: string, twoFactorSecret?: string) {
  if (!isAllowedEmail(email)) {
    throw new Error("This email is not allowed to create an account.");
  }

  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    throw new Error("The first account already exists.");
  }

  return prisma.user.create({
    data: {
      email: normalizeEmail(email),
      name: "Study Admin",
      passwordHash: await bcrypt.hash(password, 12),
      twoFactorSecret: twoFactorSecret ?? null,
      twoFactorEnabled: false
    }
  });
}

export async function verifyUser(email: string, password: string) {
  if (!isAllowedEmail(email)) return null;

  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) }
  });

  if (!user) return null;
  const validPassword = await bcrypt.compare(password, user.passwordHash);
  return validPassword ? user : null;
}

export async function setUserTwoFactorSecret(userId: string, secret: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorSecret: secret,
      twoFactorEnabled: false
    }
  });
}

export async function enableUserTwoFactor(userId: string) {
  await prisma.session.deleteMany({
    where: { userId }
  });

  return prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: true }
  });
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt
    }
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/"
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true }
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => null);
    return null;
  }
  if (!isAllowedEmail(session.user.email)) return null;
  if (isTwoFactorRequired() && !session.user.twoFactorEnabled) return null;

  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session
      .delete({ where: { tokenHash: hashToken(token) } })
      .catch(() => null);
  }

  cookieStore.delete(SESSION_COOKIE);
}
