import { redirect } from "next/navigation";
import { BrainCircuit } from "lucide-react";
import { getCurrentUser, hasUsers, isSetupTokenRequired } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const setupMode = !(await hasUsers());
  const setupTokenRequired = setupMode && isSetupTokenRequired();

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="brand-lockup">
          <span className="brand-icon">
            <BrainCircuit size={26} />
          </span>
          <div>
            <p className="eyebrow">{setupMode ? "First run setup" : "Private study tool"}</p>
            <h1>Coding Interview Study Tool</h1>
          </div>
        </div>
        <p className="login-copy">
          {setupMode
            ? setupTokenRequired
              ? "Create your password with the setup token, then finish the one-time authenticator setup."
              : "Create your password, then finish the one-time authenticator setup."
            : "Sign in with your password and authenticator code to continue studying."}
        </p>
        <LoginForm setupMode={setupMode} setupTokenRequired={setupTokenRequired} />
      </section>
    </main>
  );
}
