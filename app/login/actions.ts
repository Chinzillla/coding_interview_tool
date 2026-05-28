"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createFirstUser,
  createSession,
  destroySession,
  enableUserTwoFactor,
  hasUsers,
  isAllowedEmail,
  isTwoFactorRequired,
  setUserTwoFactorSecret,
  validateSetupToken,
  verifyUser
} from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rateLimit";
import {
  buildTotpUri,
  formatTotpSecret,
  generateTotpSecret,
  verifyTotpCode
} from "@/lib/totp";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8).optional(),
  setupToken: z.string().max(256).optional(),
  totpCode: z.string().max(32).optional()
});

export type LoginState = {
  error?: string;
  twoFactor?: {
    mode: "setup" | "verify";
    secret?: string;
    formattedSecret?: string;
    otpauthUri?: string;
    setupTokenRequired?: boolean;
  };
};

async function clientRateLimitKey(email: string) {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip =
    forwardedFor ||
    headerStore.get("x-real-ip") ||
    headerStore.get("x-client-ip") ||
    "unknown";

  return `login:${ip}:${email.toLowerCase()}`;
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword") ?? undefined,
    setupToken: formData.get("setupToken") ?? undefined,
    totpCode: formData.get("totpCode") ?? undefined
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and a password with at least 8 characters." };
  }

  if (!isAllowedEmail(parsed.data.email)) {
    return { error: "Email or password is incorrect." };
  }

  const rateLimitKey = await clientRateLimitKey(parsed.data.email);
  const rateLimit = checkRateLimit(rateLimitKey, 8, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    const minutes = Math.max(1, Math.ceil(rateLimit.retryAfterSeconds / 60));
    return { error: `Too many attempts. Try again in about ${minutes} minutes.` };
  }

  const setupMode = !(await hasUsers());
  if (setupMode && !validateSetupToken(parsed.data.setupToken)) {
    return { error: "Setup token is required or incorrect." };
  }

  if (setupMode) {
    if (parsed.data.password !== parsed.data.confirmPassword) {
      return { error: "Passwords do not match." };
    }

    const secret = generateTotpSecret();
    await createFirstUser(parsed.data.email, parsed.data.password, secret);

    return {
      error: "Add this account to your authenticator app, then enter the 6-digit code.",
      twoFactor: {
        mode: "setup",
        secret,
        formattedSecret: formatTotpSecret(secret),
        otpauthUri: buildTotpUri(parsed.data.email, secret)
      }
    };
  }

  const user = await verifyUser(parsed.data.email, parsed.data.password);

  if (!user) {
    return { error: "Email or password is incorrect." };
  }

  if (isTwoFactorRequired()) {
    if (user.twoFactorEnabled) {
      if (!user.twoFactorSecret) {
        return { error: "Two-step verification is not configured correctly." };
      }

      const validCode = verifyTotpCode(user.twoFactorSecret, parsed.data.totpCode);
      if (!validCode) {
        return {
          error: parsed.data.totpCode
            ? "Authenticator code is incorrect."
            : "Enter your authenticator code.",
          twoFactor: { mode: "verify" }
        };
      }
    } else {
      const validExistingCode = user.twoFactorSecret
        ? verifyTotpCode(user.twoFactorSecret, parsed.data.totpCode)
        : false;

      if (validExistingCode) {
        await enableUserTwoFactor(user.id);
      } else {
        const setupTokenValid = validateSetupToken(parsed.data.setupToken);
        if (!setupTokenValid) {
          return {
            error: "Enter the setup token to finish one-time authenticator setup.",
            twoFactor: {
              mode: "setup",
              setupTokenRequired: true
            }
          };
        }

        const secret =
          user.twoFactorSecret ??
          (await setUserTwoFactorSecret(user.id, generateTotpSecret())).twoFactorSecret;

        if (!secret) {
          return { error: "Could not prepare two-step verification." };
        }

        const validCode = verifyTotpCode(secret, parsed.data.totpCode);
        if (validCode) {
          await enableUserTwoFactor(user.id);
        } else {
          return {
            error: parsed.data.totpCode
              ? "Authenticator code is incorrect."
              : "Add this account to your authenticator app, then enter the 6-digit code.",
            twoFactor: {
              mode: "setup",
              secret,
              formattedSecret: formatTotpSecret(secret),
              otpauthUri: buildTotpUri(user.email, secret),
              setupTokenRequired: true
            }
          };
        }
      }
    }
  }

  resetRateLimit(rateLimitKey);
  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
