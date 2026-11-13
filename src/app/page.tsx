import { GooDefs } from "@/components/site/goo/GooDefs";
import { Hero } from "@/components/site/Hero";
import { PillNav } from "@/components/site/PillNav";
import {
  ArticlesSection,
  ColumnsSection,
  IntroSection,
  LabSection,
  LogSection,
} from "@/components/site/Sections";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function Home() {
  return (
    // overflow-x: clip, not hidden: it clips drips at the screen edge without breaking the sticky pill.
    <div className="relative overflow-x-clip">
      <GooDefs />
      {/* Spans the whole page so the pill can stick to the top all the way down. */}
      <div className="pointer-events-none absolute inset-0 z-50">
        <PillNav />
      </div>
      <main>
        <Hero />
        <IntroSection />
        <ArticlesSection />
        <LabSection />
        <ColumnsSection />
        <LogSection />
      </main>
      <SiteFooter />
    </div>
  );
}
