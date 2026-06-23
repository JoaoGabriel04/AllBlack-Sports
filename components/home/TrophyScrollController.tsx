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

export function TrophyScrollController() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rotationY = useRef(0);

  useEffect(() => {
    // Só ativa em desktop — mobile fica sem o troféu animado
    if (window.innerWidth < 1024) return;

    const wrapper = wrapperRef.current;
    const startEl = document.getElementById("trophy-start-anchor");
    const endEl = document.getElementById("trophy-end-anchor");
    if (!wrapper || !startEl || !endEl) return;

    // Inicializa o wrapper na posição do start anchor
    const snapToStart = () => {
      const r = startEl.getBoundingClientRect();
      gsap.set(wrapper, {
        position: "fixed",
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
        zIndex: 30,
        pointerEvents: "none",
        display: "block",
      });
    };
    snapToStart();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: startEl,
        endTrigger: endEl,
        // "top bottom" dispara imediatamente pois o anchor já está acima
        // do fundo da viewport no carregamento da página
        start: "top bottom",
        end: "center center",
        scrub: 1.5,
        onUpdate(self) {
          const p = self.progress;
          const sr = startEl.getBoundingClientRect();
          const er = endEl.getBoundingClientRect();

          // Interpolação linear de posição e tamanho entre os dois anchors
          gsap.set(wrapper, {
            left: gsap.utils.interpolate(sr.left, er.left, p),
            top: gsap.utils.interpolate(sr.top, er.top, p),
            width: gsap.utils.interpolate(sr.width, er.width, p),
            height: gsap.utils.interpolate(sr.height, er.height, p),
          });

          // 4 voltas completas durante o percurso
          rotationY.current = p * Math.PI * 8;
        },
      });
    });

    return () => ctx.revert();
  }, []);

  // Oculto por padrão; GSAP define display:block em desktops
  return (
    <div ref={wrapperRef} style={{ display: "none" }}>
      <TrophyCanvas rotationY={rotationY} />
    </div>
  );
}
