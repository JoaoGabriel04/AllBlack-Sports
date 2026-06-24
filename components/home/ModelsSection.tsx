import Image from "next/image";
import { ScrollReveal, ScrollRevealStagger } from "@/components/ui/ScrollReveal";

export function ModelsSection() {
  const models = [
    {
      key: "camisa-torcedor",
      label: "Camisa de Torcedor",
      desc: "Versão fan — perfeita para torcer com estilo",
      image: "/images/camisa-torcedor.webp",
    },
    {
      key: "camisa-jogador",
      label: "Camisa de Jogador",
      desc: "Versão player — a mesma usada em campo",
      image: "/images/camisa-jogador.webp",
    },
    {
      key: "conjunto",
      label: "Conjunto Camisa + Bermuda",
      desc: "Kit completo para o treino e o dia a dia",
      image: "/images/conjunto-camisa-bermuda.webp",
    },
    {
      key: "kit-treino",
      label: "Kit Treino",
      desc: "Agasalho e shorts para os treinos mais intensos",
      image: "/images/kit-treino.webp",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-canvas">
      <div className="max-w-screen-xl mx-auto px-6">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-3 mb-14 text-center">
            <span className="text-gold text-xs font-medium uppercase tracking-[0.2em]">
              Linha completa
            </span>
            <h2
              className="text-ink uppercase leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
              }}
            >
              Nossos Modelos
            </h2>
          </div>
        </ScrollReveal>

        <ScrollRevealStagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {models.map((model) => (
            <div
              key={model.key}
              className="group relative bg-soft-cloud overflow-hidden"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-surface-raised">
                <Image
                  src={model.image}
                  alt={model.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-canvas/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-stone text-xs leading-relaxed">
                    {model.desc}
                  </p>
                </div>
              </div>

              <div className="p-4">
                <p className="text-ink text-sm font-semibold">{model.label}</p>
              </div>
            </div>
          ))}
        </ScrollRevealStagger>

        <p className="text-mute text-xs text-center mt-8">
          * Imagens meramente ilustrativas. Modelos e estampas podem variar conforme o estoque disponível.
        </p>
      </div>
    </section>
  );
}
