import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { TrophySection } from "@/components/home/TrophySection";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ModelsSection } from "@/components/home/ModelsSection";
import { ContactSection } from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <HeroSection />
        <TrophySection />
        <AboutSection />
        <FeaturedProducts />
        <ModelsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
