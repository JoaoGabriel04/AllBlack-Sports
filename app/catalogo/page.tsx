import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductGrid } from "@/components/catalog/ProductGrid";

export const metadata = {
  title: "Catálogo — AllBlack Sports",
  description: "Explore nossa coleção de camisas tailandesas premium.",
};

export default function CatalogoPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-24 min-h-screen bg-canvas">
        <div className="max-w-screen-xl mx-auto px-6 mb-10">
          <h1
            className="text-ink uppercase leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
            }}
          >
            Catálogo
          </h1>
          <p className="text-mute text-sm mt-2">
            Todos os nossos produtos disponíveis
          </p>
        </div>
        <ProductGrid />
      </main>
      <Footer />
    </>
  );
}
