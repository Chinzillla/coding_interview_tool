"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/login/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button className="icon-button" type="submit" aria-label="Sign out" title="Sign out">
        <LogOut size={18} />
      </button>
    </form>
  );
}
