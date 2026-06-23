"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/cart/CartContext";

export function Header() {
  const { data: session } = useSession();
  const { itemCount } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-canvas/95 backdrop-blur-sm border-b border-hairline">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo-allblack.png"
            alt="AllBlack Sports"
            width={130}
            height={36}
            priority
            className="w-12"
            style={{ height: "auto" }}
          />
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-3">
          <Link
            href="/catalogo"
            className="text-ink text-sm font-medium hover:text-gold transition-colors px-2 py-1"
          >
            Catálogo
          </Link>

          {/* Carrinho */}
          <Link
            href="/carrinho"
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-soft-cloud hover:bg-surface-raised transition-colors"
            aria-label="Carrinho"
          >
            <ShoppingCart size={18} className="text-ink" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-gold text-on-primary text-xs flex items-center justify-center font-bold px-1 leading-none">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          {/* Perfil */}
          <Link
            href={session ? "/perfil" : "/login"}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-soft-cloud hover:bg-surface-raised transition-colors overflow-hidden"
            aria-label={session ? "Meu perfil" : "Entrar"}
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "Usuário"}
                fill
                className="object-cover"
              />
            ) : (
              <User size={18} className="text-ink" />
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
