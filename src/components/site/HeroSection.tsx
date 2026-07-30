import { ArrowButton } from "./ArrowButton";
import { HeroBottleDetail } from "./HeroBottleDetail";
import { HeroNetwork } from "./HeroNetwork";
import { HeroPointerGlow } from "./HeroPointerGlow";

export function HeroSection() {
  return (
    <main
      id="top"
      data-header-theme="dark"
      className="hero-stage relative h-[813px] w-[1440px] overflow-hidden bg-[var(--brand)] text-[var(--paper)]"
    >
      <HeroNetwork className="pointer-events-none absolute left-[259px] top-0 h-[813px] w-[922px]" />
      <HeroPointerGlow />
      <HeroBottleDetail />

      <div className="relative z-10 flex h-full flex-col justify-end px-7 pb-[36px]">
        <div className="flex w-full items-end justify-between">
          <div className="hero-enter max-w-[579px]">
            <h1 className="sr-only">Duang 的博客</h1>
            <ArrowButton href="#articles" size="lg">
              文章
            </ArrowButton>
          </div>
          <a
            href="#about"
            className="hero-enter hero-enter-delay hero-scroll-cue group flex items-end gap-[12px] text-[11.808px] font-medium leading-[12px] tracking-[0.08em] text-[color-mix(in_oklab,var(--paper)_82%,transparent)]"
          >
            <span>向下</span>
            <span className="hero-scroll-line block h-[34px] w-px origin-top bg-[color-mix(in_oklab,var(--paper)_55%,transparent)] transition-[height] duration-300 group-hover:h-[46px]" />
          </a>
        </div>
      </div>
    </main>
  );
}
