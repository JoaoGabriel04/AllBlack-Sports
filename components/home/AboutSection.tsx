export function AboutSection() {
  return (
    <section className="py-24 md:py-32 bg-soft-cloud">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Texto */}
        <div className="flex flex-col gap-6">
          <span className="text-gold text-xs font-medium uppercase tracking-[0.2em]">
            Nossa história
          </span>
          <h2
            className="text-ink uppercase leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
            }}
          >
            Joabe Araújo
            <br />
            <span className="text-gold">AllBlack Sports</span>
          </h2>

          <div className="flex flex-col gap-4 text-stone text-sm leading-relaxed max-w-md">
            <p>
              A AllBlack Sports nasceu da paixão de Joabe Araújo pelo futebol e
              pela moda esportiva. Em Grajaú-MA, onde o amor pelo jogo pulsa nas
              ruas, Joabe viu a oportunidade de levar camisas tailandesas de
              qualidade premium para os torcedores da região.
            </p>
            <p>
              Cada peça é cuidadosamente selecionada para garantir o melhor
              acabamento — tecido respirável, cores vibrantes e fidelidade ao
              design original dos times. Do Brasil ao PSG, da Argentina ao Real
              Madrid, você encontra tudo aqui.
            </p>
            <p>
              Venha nos visitar na Avenida Brasil, Bairro Canoeiro, e escolha a
              camisa do seu clube com a confiança de quem entende de qualidade.
            </p>
          </div>
        </div>

        {/* Cards de diferenciais */}
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: "⚽",
              title: "50+ Times",
              desc: "Os principais clubes nacionais e internacionais",
            },
            {
              icon: "✨",
              title: "Qualidade Thai",
              desc: "Tecido premium, costura impecável",
            },
            {
              icon: "📦",
              title: "Pronta Entrega",
              desc: "Estoque local em Grajaú-MA",
            },
            {
              icon: "💬",
              title: "Atendimento",
              desc: "WhatsApp rápido e presencial",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 p-6 bg-canvas border border-hairline"
            >
              <span className="text-2xl" aria-hidden="true">
                {item.icon}
              </span>
              <p className="text-ink text-sm font-semibold">{item.title}</p>
              <p className="text-mute text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
