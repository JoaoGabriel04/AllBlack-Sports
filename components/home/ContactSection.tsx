import { MapPin, Clock } from "lucide-react";
import { buildWhatsAppUrl, buildCatalogMessage } from "@/lib/whatsapp";

export function ContactSection() {
  const whatsappUrl = buildWhatsAppUrl(buildCatalogMessage());

  return (
    <section className="py-24 md:py-32 bg-soft-cloud">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex flex-col items-center gap-3 mb-14 text-center">
          <span className="text-gold text-xs font-medium uppercase tracking-[0.2em]">
            Fale conosco
          </span>
          <h2
            className="text-ink uppercase leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
            }}
          >
            Venha nos Visitar
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {/* Localização */}
          <div className="bg-canvas border border-hairline p-6 flex flex-col gap-4">
            <MapPin size={20} className="text-gold" />
            <div>
              <p className="text-ink text-sm font-semibold mb-1">Endereço</p>
              <p className="text-mute text-sm leading-relaxed">
                Avenida Brasil, Bairro Canoeiro
                <br />
                Grajaú — MA
              </p>
            </div>
          </div>

          {/* Horário */}
          <div className="bg-canvas border border-hairline p-6 flex flex-col gap-4">
            <Clock size={20} className="text-gold" />
            <div>
              <p className="text-ink text-sm font-semibold mb-1">Horário</p>
              <p className="text-mute text-sm leading-relaxed">
                Seg – Sex: 08h às 19h
                <br />
                Sábado: 08h às 17h
              </p>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="bg-canvas border border-hairline p-6 flex flex-col gap-4 justify-between">
            <div>
              <p className="text-ink text-sm font-semibold mb-1">WhatsApp</p>
              <p className="text-mute text-sm">(99) 9 8407-8478</p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-11 w-full rounded-full bg-gold text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              <WhatsAppIcon />
              Chamar agora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
