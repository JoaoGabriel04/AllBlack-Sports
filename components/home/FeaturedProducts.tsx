import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ui/ProductCard";
import { ScrollReveal, ScrollRevealStagger } from "@/components/ui/ScrollReveal";

async function getFeaturedProducts() {
  return db.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-canvas">
      <div className="max-w-screen-xl mx-auto px-6">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div className="flex flex-col gap-2">
              <span className="text-gold text-xs font-medium uppercase tracking-[0.2em]">
                Seleção especial
              </span>
              <h2
                className="text-ink uppercase leading-none"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                }}
              >
                Destaques
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="text-mute text-sm hover:text-ink transition-colors hidden sm:block"
            >
              Ver todos →
            </Link>
          </div>
        </ScrollReveal>

        <ScrollRevealStagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </ScrollRevealStagger>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/catalogo"
            className="inline-flex items-center h-11 px-8 rounded-full border border-hairline text-ink text-sm font-semibold hover:bg-soft-cloud transition-colors"
          >
            Ver catálogo completo
          </Link>
        </div>
      </div>
    </section>
  );
}
