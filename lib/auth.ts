import { randomBytes, createHash } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "coding-study-session";
const SESSION_DAYS = 30;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function hasUsers() {
  return (await prisma.user.count()) > 0;
}

export async function createFirstUser(email: string, password: string) {
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    throw new Error("The first account already exists.");
  }

  return prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name: "Study Admin",
      passwordHash: await bcrypt.hash(password, 12)
    }
  });
}

export async function verifyUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) return null;
  const validPassword = await bcrypt.compare(password, user.passwordHash);
  return validPassword ? user : null;
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
