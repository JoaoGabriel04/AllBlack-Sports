"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CartProvider } from "@/components/cart/CartContext";
import type { Session } from "next-auth";

gsap.registerPlugin(ScrollTrigger);

// THREE.Clock foi depreciado no Three.js r175+ mas @react-three/fiber ainda
// usa internamente. Filtramos esse aviso específico até o R3F ser atualizado.
if (typeof window !== "undefined") {
  const _warn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
    _warn(...args);
  };
}

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <SessionProvider session={session}>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
