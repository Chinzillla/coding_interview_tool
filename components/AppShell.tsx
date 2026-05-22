import Link from "next/link";
import { BrainCircuit, CalendarDays, LayoutDashboard, LibraryBig } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";

export function AppShell({
  children,
  active
}: {
  children: React.ReactNode;
  active: "dashboard" | "learn" | "schedule";
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="app-logo">
          <span className="brand-icon">
            <BrainCircuit size={24} />
          </span>
          <div>
            <strong>Interview Prep</strong>
            <span>Repetition lab</span>
          </div>
        </div>
        <nav className="nav-list" aria-label="Main navigation">
          <Link className={active === "dashboard" ? "active" : ""} href="/dashboard">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link className={active === "learn" ? "active" : ""} href="/learn">
            <LibraryBig size={18} />
            Learn
          </Link>
          <Link className={active === "schedule" ? "active" : ""} href="/schedule">
            <CalendarDays size={18} />
            Schedule
          </Link>
        </nav>
        <div className="sidebar-footer">
          <LogoutButton />
        </div>
      </aside>
      <div className="main-surface">{children}</div>
    </div>
  );
}
