"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Image
              src="/images/logo-allblack.png"
              alt="AllBlack Sports"
              width={130}
              height={36}
              style={{ height: "auto" }}
            />
          </Link>
        </div>

        <h1
          className="text-4xl text-ink text-center uppercase mb-2 tracking-wide"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Entrar
        </h1>
        <p className="text-mute text-sm text-center mb-8">
          Acesse sua conta AllBlack Sports
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="text-sale text-sm text-center bg-sale/10 rounded-2xl py-2 px-4">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-stone text-xs font-medium uppercase tracking-wider">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="seu@email.com"
              className="h-12 rounded-full bg-soft-cloud border border-hairline px-5 text-ink text-sm outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-stone text-xs font-medium uppercase tracking-wider">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-12 rounded-full bg-soft-cloud border border-hairline px-5 text-ink text-sm outline-none focus:border-gold transition-colors"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-hairline" />
          <span className="text-mute text-xs">ou</span>
          <div className="flex-1 h-px bg-hairline" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full h-12 rounded-full bg-soft-cloud border border-hairline text-ink text-sm font-semibold hover:bg-surface-raised transition-colors flex items-center justify-center gap-3"
        >
          <GoogleIcon />
          Entrar com Google
        </button>

        <p className="text-mute text-xs text-center mt-8">
          Não tem conta?{" "}
          <Link href="/registro" className="text-gold hover:underline">
            Criar conta gratuita
          </Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.2 26.8 36 24 36c-5.2 0-9.6-3.3-11.2-8H6.5C9.9 36.8 16.4 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.1-2.2 3.9-4.1 5.2l6.2 5.2C37.4 38.2 44 32.9 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}
