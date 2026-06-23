import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppUrl, buildCatalogMessage } from "@/lib/whatsapp";

export function HeroSection() {
  const whatsappUrl = buildWhatsAppUrl(buildCatalogMessage());

  return (
    <section className="relative w-full h-screen min-h-150 overflow-hidden">
      {/* Background — camisa centralizada. div absolute necessário para fill */}
      <div className="absolute inset-0 bg-surface-raised">
        {/* Versão mobile (escondida em md+) */}
        <Image
          src="/images/hero-mobile.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:hidden"
        />
        {/* Versão desktop (escondida em <md) */}
        <Image
          src="/images/hero-desktop.png"
          alt="AllBlack Sports — Camisas Copa do Mundo"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center hidden md:block"
        />
      </div>

      {/* Gradiente só no canto superior-esquerdo, para não cobrir a camisa */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 0% 0%, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.4) 55%, transparent 100%)",
        }}
      />

      {/* Âncora inicial do troféu — lado esquerdo da hero, abaixo do bloco de texto.
          Invisível; define onde o troféu fixo começa antes do scroll. */}
      <div
        id="trophy-start-anchor"
        className="absolute hidden lg:block"
        style={{ left: "2%", top: "44%", width: "33%", height: "50%" }}
      />

      {/* Texto posicionado no topo-esquerdo, fora da área da camisa */}
      <div className="absolute top-0 left-0 pt-28 pl-8 md:pl-16 max-w-xs md:max-w-md flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-gold text-xs font-medium uppercase tracking-[0.2em]">
            Copa do Mundo 2026
          </span>
          <h1
            className="text-ink leading-none uppercase"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 8vw, 6rem)" }}
          >
            Veste
            <br />
            a Paixão
          </h1>
        </div>

        <p className="text-stone text-sm leading-relaxed">
          Camisas tailandesas de times do mundo inteiro.
          <br />
          Qualidade premium em Grajaú-MA.
        </p>

        <div className="flex flex-wrap gap-3 mt-2">
          <Link
            href="/catalogo"
            className="inline-flex items-center h-12 px-8 rounded-full bg-ink text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            Ver Catálogo
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center h-12 px-8 rounded-full border border-hairline text-ink text-sm font-semibold hover:bg-soft-cloud transition-colors shrink-0"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
