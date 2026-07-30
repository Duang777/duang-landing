"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeScrollFrame } from "@/lib/scroll-frame";

const CHAPTERS = [
  { id: "top", label: "首页" },
  { id: "about", label: "关于" },
  { id: "columns", label: "专栏" },
  { id: "articles", label: "文章" },
  { id: "experiments", label: "实验" },
  { id: "newsroom", label: "更新" },
  { id: "cta", label: "继续" },
] as const;

export function PageMotion() {
  const [active, setActive] = useState<(typeof CHAPTERS)[number]["id"]>("top");
  const [showTop, setShowTop] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const pixelBands = Array.from(document.querySelectorAll<HTMLElement>(".pixel-band"));
    const scrollLayers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-layer]"),
    );
    let renderedActive: (typeof CHAPTERS)[number]["id"] = "top";
    let renderedTop = false;

    if (reducedMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    const revealObserver = reducedMotion
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-visible");
              revealObserver?.unobserve(entry.target);
            });
          },
          { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
        );

    revealItems.forEach((item) => revealObserver?.observe(item));

    const pixelObserver = reducedMotion
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              entry.target.classList.toggle("is-animating", entry.isIntersecting);
            });
          },
          { rootMargin: "20% 0px", threshold: 0 },
        );
    pixelBands.forEach((band) => pixelObserver?.observe(band));

    const unsubscribe = subscribeScrollFrame(
      ({ scrollY, viewportHeight, maxScroll }) => {
      const targetY = viewportHeight * 0.42;
      let closestId: (typeof CHAPTERS)[number]["id"] = CHAPTERS[0].id;
      let distance = Number.POSITIVE_INFINITY;
      let closestSpan = Number.POSITIVE_INFINITY;

      CHAPTERS.forEach((chapter) => {
        const element = document.getElementById(chapter.id);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const inside = rect.top <= targetY && rect.bottom >= targetY;
        const nextDistance = inside
          ? 0
          : Math.min(Math.abs(rect.top - targetY), Math.abs(rect.bottom - targetY));
        const span = rect.height;
        if (
          nextDistance < distance ||
          (nextDistance === distance && span < closestSpan)
        ) {
          closestId = chapter.id;
          distance = nextDistance;
          closestSpan = span;
        }
      });

      const nextProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
      progressRef.current?.style.setProperty("transform", `scaleY(${nextProgress})`);

      const nextShowTop = scrollY > viewportHeight * 1.2;
      if (nextShowTop !== renderedTop) {
        renderedTop = nextShowTop;
        setShowTop(nextShowTop);
      }
      if (closestId !== renderedActive) {
        renderedActive = closestId;
        setActive(closestId);
      }

      pixelBands.forEach((band) => {
        const rect = band.getBoundingClientRect();
        const visible = 1 - Math.min(1, Math.max(0, rect.top / viewportHeight));
        band.style.setProperty("--pixel-wave", visible.toFixed(3));
      });

      if (!reducedMotion) {
        scrollLayers.forEach((layer) => {
          const rect = layer.getBoundingClientRect();
          if (rect.bottom < -160 || rect.top > viewportHeight + 160) return;
          const speed = Number(layer.dataset.scrollSpeed ?? "0.08");
          const distance = rect.top + rect.height / 2 - viewportHeight / 2;
          const shift = Math.max(-64, Math.min(64, -distance * speed));
          layer.style.setProperty("--scroll-shift", `${shift.toFixed(2)}px`);
        });
      }
    });

    return () => {
      revealObserver?.disconnect();
      pixelObserver?.disconnect();
      unsubscribe();
    };
  }, []);

  return (
    <>
      <nav
        className="chapter-rail fixed right-[9px] top-1/2 z-[60] -translate-y-1/2"
        aria-label="页面章节"
      >
        <span className="chapter-rail-line" aria-hidden>
          <span
            ref={progressRef}
            className="chapter-rail-fill"
            style={{ transform: "scaleY(0)" }}
          />
        </span>
        {CHAPTERS.map((chapter) => {
          const current = active === chapter.id;
          return (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              className={`chapter-rail-link ${current ? "is-active" : ""}`}
              aria-label={chapter.label}
              aria-current={current ? "location" : undefined}
            >
              <span className="chapter-rail-label">{chapter.label}</span>
              <span className="chapter-rail-dot" aria-hidden />
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className={`back-to-top ${showTop ? "is-shown" : ""}`}
        aria-label="回到顶部"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <svg viewBox="0 0 40 60" className="h-[34px] w-auto overflow-visible" aria-hidden>
          <rect x="14" y="5" width="12" height="5" rx="1" fill="currentColor" opacity=".58" />
          <rect x="12" y="9" width="16" height="4" rx="1" fill="currentColor" opacity=".84" />
          <path
            d="M12 20C10 21 9 24 9 27V47C9 54 13 57 20 57C27 57 31 54 31 47V27C31 24 30 21 28 20C27 16 24 14 20 14C16 14 13 16 12 20Z"
            fill="currentColor"
            fillOpacity=".08"
            stroke="currentColor"
            strokeOpacity=".7"
          />
          <path
            className="bottle-mark-liquid"
            d="M9.5 36H30.5V48C30.5 53 27 56 20 56C13 56 9.5 53 9.5 48Z"
            fill="currentColor"
            opacity=".55"
          />
          <path d="M13 25V43" stroke="currentColor" strokeOpacity=".4" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span className="font-mono text-[8px] uppercase tracking-[0.1em]">top</span>
      </button>
    </>
  );
}
