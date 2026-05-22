"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createFirstUser,
  createSession,
  destroySession,
  hasUsers,
  verifyUser
} from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and a password with at least 8 characters." };
  }

  const setupMode = !(await hasUsers());
  const user = setupMode
    ? await createFirstUser(parsed.data.email, parsed.data.password)
    : await verifyUser(parsed.data.email, parsed.data.password);

  if (!user) {
    return { error: "Email or password is incorrect." };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
