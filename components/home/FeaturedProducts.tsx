import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  featured: boolean;
}

async function getFeaturedProducts(): Promise<Product[]> {
  const baseUrl =
    process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/products?featured=true`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return [];
  return res.json();
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-canvas">
      <div className="max-w-screen-xl mx-auto px-6">
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

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
