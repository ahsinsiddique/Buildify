import { MarketingHeader } from "@/components/marketing/header";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Pricing } from "@/components/marketing/pricing";
import { Cta } from "@/components/marketing/cta";
import { Footer } from "@/components/marketing/footer";

export default function HomePage() {
  return (
    <div className="marketing-page overflow-x-hidden">
      <MarketingHeader />
      <main>
        <Hero />
        <section id="features">
          <Features />
        </section>
        <Pricing />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
