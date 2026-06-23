"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

export function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="h-16 shrink-0 bg-soft-cloud border-b border-hairline flex items-center justify-between px-6">
      <span className="text-ink text-sm font-semibold">Painel Admin</span>

      <div className="flex items-center gap-4">
        <span className="text-stone text-xs hidden sm:block">
          {session?.user?.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 text-mute text-xs hover:text-sale transition-colors"
          aria-label="Sair"
        >
          <LogOut size={14} />
          <span className="hidden sm:block">Sair</span>
        </button>
      </div>
    </header>
  );
}
