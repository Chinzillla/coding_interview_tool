import { redirect } from "next/navigation";
import { BrainCircuit } from "lucide-react";
import { getCurrentUser, hasUsers } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const setupMode = !(await hasUsers());

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
            ? "Create your single-user account. This will seed the same private dashboard and learning workflow."
            : "Sign in to continue reviewing memory, code, and complexity progress."}
        </p>
        <LoginForm setupMode={setupMode} />
      </section>
    </main>
  );
}
