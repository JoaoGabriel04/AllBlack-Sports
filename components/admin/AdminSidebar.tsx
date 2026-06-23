"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  Users,
  Boxes,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/estoque", label: "Estoque", icon: Boxes },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-soft-cloud border-r border-hairline flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 shrink-0 flex items-center px-6 border-b border-hairline">
        <Link href="/admin">
          <Image
            src="/images/logo-allblack.png"
            alt="AllBlack Sports"
            width={110}
            height={30}
            style={{ height: "auto" }}
          />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 h-10 px-4 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-gold text-on-primary"
                  : "text-mute hover:text-ink hover:bg-surface-raised"
              )}
            >
              <Icon size={16} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé */}
      <div className="p-4 border-t border-hairline">
        <Link
          href="/"
          className="text-mute text-xs hover:text-ink transition-colors"
        >
          ← Voltar ao site
        </Link>
      </div>
    </aside>
  );
}
