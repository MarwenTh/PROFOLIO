import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { TemplatesShowcase } from "@/components/landing/TemplatesShowcase";
import { Testimonials } from "@/components/landing/Testimonials";
import { CallToAction } from "@/components/landing/CallToAction";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 antialiased selection:bg-indigo-500 selection:text-white">
      <Hero />
      <Features />
      <TemplatesShowcase />
      <Testimonials />
      <CallToAction />
    </main>
  );
}
