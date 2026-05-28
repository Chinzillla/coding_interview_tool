"use client";

import { useActionState, useState } from "react";
import { Check, Copy, LogIn, UserPlus } from "lucide-react";
import { loginAction, type LoginState } from "@/app/login/actions";

const initialState: LoginState = {};
type CopiedField = "secret" | "uri" | null;

export function LoginForm({
  setupMode,
  setupTokenRequired
}: {
  setupMode: boolean;
  setupTokenRequired: boolean;
}) {
  const [state, action, pending] = useActionState(loginAction, initialState);
  const [copiedField, setCopiedField] = useState<CopiedField>(null);
  const twoFactor = state.twoFactor;
  const twoFactorMode = twoFactor?.mode;
  const setupSecret =
    twoFactor?.mode === "setup" && twoFactor.formattedSecret && twoFactor.otpauthUri
      ? twoFactor
      : null;
  const setupSecretReady = Boolean(setupSecret);
  const showSetupToken =
    (setupMode && !twoFactorMode) || Boolean(twoFactor?.setupTokenRequired);
  const showConfirmPassword = setupMode && !twoFactorMode;
  const passwordLabel = setupMode && !twoFactorMode ? "Create password" : "Password";
  const copyValue = async (field: Exclude<CopiedField, null>, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 1600);
    } catch {
      setCopiedField(null);
    }
  };

  return (
    <form className="login-form" action={action}>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        {passwordLabel}
        <input
          name="password"
          type="password"
          autoComplete={setupMode && !twoFactorMode ? "new-password" : "current-password"}
          minLength={8}
          required
        />
      </label>
      {showConfirmPassword ? (
        <label>
          Confirm password
          <input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
      ) : null}
      {showSetupToken ? (
        <label>
          Setup token
          <input
            name="setupToken"
            type="password"
            autoComplete="one-time-code"
            required={setupTokenRequired || twoFactor?.setupTokenRequired}
          />
        </label>
      ) : null}
      {setupSecretReady ? (
        <div className="two-factor-setup">
          <strong>Authenticator setup</strong>
          <span>Manual key</span>
          <div className="setup-value-row">
            <code>{setupSecret?.formattedSecret}</code>
            <button
              aria-label="Copy manual key"
              className="setup-copy-button"
              onClick={() => copyValue("secret", setupSecret?.formattedSecret ?? "")}
              title="Copy manual key"
              type="button"
            >
              {copiedField === "secret" ? <Check size={17} /> : <Copy size={17} />}
            </button>
          </div>
          <details className="setup-uri-details">
            <summary>Full authenticator URI</summary>
            <div className="setup-value-row">
              <small>{setupSecret?.otpauthUri}</small>
              <button
                aria-label="Copy authenticator URI"
                className="setup-copy-button"
                onClick={() => copyValue("uri", setupSecret?.otpauthUri ?? "")}
                title="Copy authenticator URI"
                type="button"
              >
                {copiedField === "uri" ? <Check size={17} /> : <Copy size={17} />}
              </button>
            </div>
          </details>
        </div>
      ) : null}
      {twoFactorMode === "verify" || setupSecretReady ? (
        <label>
          Authenticator code
          <input
            name="totpCode"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]{6,8}"
            placeholder="123456"
            required
          />
        </label>
      ) : null}
      {state.error ? <p className="form-error">{state.error}</p> : null}
      <button className="primary-button" type="submit" disabled={pending}>
        {setupMode ? <UserPlus size={18} /> : <LogIn size={18} />}
        {pending
          ? "Working..."
          : twoFactor?.setupTokenRequired && !setupSecretReady
            ? "Unlock setup"
            : twoFactorMode
            ? "Verify and sign in"
            : setupMode
              ? "Create account"
              : "Sign in"}
      </button>
    </form>
  );
}
