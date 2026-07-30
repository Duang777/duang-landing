import { SiteHeader } from "@/components/site/SiteHeader";
import { HeroSection } from "@/components/site/HeroSection";
import { FoundationSection } from "@/components/site/FoundationSection";
import { ProductsSection } from "@/components/site/ProductsSection";
import { WorkflowsSection } from "@/components/site/WorkflowsSection";
import {
  CtaSection,
  NewsroomSection,
  SiteFooter,
} from "@/components/site/NewsCtaFooter";
import { PixelTransition } from "@/components/site/Primitives";
import { PageMotion } from "@/components/site/PageMotion";

export default function Home() {
  return (
    <div className="page-shell">
      <PageMotion />
      <SiteHeader />
      <HeroSection />
      <FoundationSection />
      <PixelTransition from="var(--brand)" to="var(--near-black)" />
      <ProductsSection />
      <PixelTransition from="var(--near-black)" to="var(--brand)" />
      <WorkflowsSection />
      <PixelTransition from="var(--brand)" to="var(--paper)" />
      <NewsroomSection />
      <CtaSection />
      <SiteFooter />
    </div>
  );
}
