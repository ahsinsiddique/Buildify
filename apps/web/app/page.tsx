import { Cta } from "@/components/marketing/cta";
import { Features } from "@/components/marketing/features";
import { Hero } from "@/components/marketing/hero";
import { Pricing } from "@/components/marketing/pricing";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <Pricing />
      <Cta />
    </main>
  );
}
