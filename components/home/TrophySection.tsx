"use client";

import dynamic from "next/dynamic";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TrophyCanvas = dynamic(
  () => import("./TrophyCanvas").then((m) => m.TrophyCanvas),
  { ssr: false }
);

export function TrophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rotationY = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(rotationY, {
        current: Math.PI * 2,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 overflow-hidden bg-canvas"
    >
      {/* Glow dourado de fundo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212,175,55,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Canvas 3D */}
        <div className="w-full h-[420px] md:h-[520px] order-2 lg:order-1">
          <TrophyCanvas rotationY={rotationY} />
        </div>

        {/* Texto */}
        <div className="flex flex-col gap-6 order-1 lg:order-2">
          <span className="text-gold text-xs font-medium uppercase tracking-[0.2em]">
            Temporada 2026
          </span>
          <h2
            className="text-ink uppercase leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            }}
          >
            Troféu
            <br />
            <span className="text-gold">Copa do Mundo</span>
          </h2>
          <p className="text-stone leading-relaxed text-sm max-w-sm">
            A AllBlack Sports chega junto com a maior competição do futebol
            mundial. Vista a camisa do seu time favorito e celebre cada gol com
            estilo.
          </p>
          <div className="flex gap-8 pt-4">
            <Stat value="4" label="Modelos exclusivos" />
            <Stat value="50+" label="Times disponíveis" />
            <Stat value="100%" label="Qualidade tailandesa" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-gold leading-none"
        style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem" }}
      >
        {value}
      </span>
      <span className="text-mute text-xs">{label}</span>
    </div>
  );
}
