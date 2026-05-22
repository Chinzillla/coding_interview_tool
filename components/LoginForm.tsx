"use client";

import { useActionState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { loginAction, type LoginState } from "@/app/login/actions";

const initialState: LoginState = {};

export function LoginForm({ setupMode }: { setupMode: boolean }) {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form className="login-form" action={action}>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete={setupMode ? "new-password" : "current-password"}
          minLength={8}
          required
        />
      </label>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      <button className="primary-button" type="submit" disabled={pending}>
        {setupMode ? <UserPlus size={18} /> : <LogIn size={18} />}
        {pending ? "Working..." : setupMode ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}
