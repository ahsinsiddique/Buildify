import { MarketingHeader } from "@/components/marketing/header";
import { Cta } from "@/components/marketing/cta";
import { Features } from "@/components/marketing/features";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { Pricing } from "@/components/marketing/pricing";

export default function HomePage() {
  return (
    <div className="bg-[#131313] min-h-screen">
      <MarketingHeader />
      <main>
        <Hero />
        <section id="features">
          <Features />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
