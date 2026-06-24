import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ModelsSection } from "@/components/home/ModelsSection";
import { ContactSection } from "@/components/home/ContactSection";
import { TrophyScrollController } from "@/components/home/TrophyScrollController";
import { PageLoader } from "@/components/home/PageLoader";

export default function HomePage() {
  return (
    <>
      <div
        id="loader-bg"
        style={{
          position: 'fixed',
          inset: 0,
          background: '#0a0a0a',
          zIndex: 9998,
        }}
      />
      <Header />
      <main className="pt-16">
        <HeroSection />
        <AboutSection />
        <FeaturedProducts />
        <ModelsSection />
        <ContactSection />
      </main>
      <Footer />
      <TrophyScrollController />
      <PageLoader />
    </>
  );
}
