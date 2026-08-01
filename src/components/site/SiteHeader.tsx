"use client";

import { useEffect, useState } from "react";
import { ArrowButton } from "./ArrowButton";
import { BLOG_URL, navMain, navSide } from "@/data/site";
import { cn } from "@/lib/utils";
import { subscribeScrollFrame } from "@/lib/scroll-frame";

const NAV_SECTIONS = [
  { id: "top", label: "首页" },
  { id: "about", label: "关于" },
  { id: "columns", label: "专栏" },
  { id: "articles", label: "文章" },
  { id: "experiments", label: "实验" },
] as const;

export function SiteHeader() {
  const [light, setLight] = useState(false);
  const [activeLabel, setActiveLabel] = useState("首页");
  const activeIndex = navMain.findIndex((item) => item.label === activeLabel);
  const hasActive = activeIndex >= 0;

  useEffect(() => {
    const markers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-header-theme]"),
    );
    const sections = NAV_SECTIONS.map((section) => ({
      ...section,
      element: document.getElementById(section.id),
    }));
    let renderedLight = false;
    let renderedLabel = "首页";

    return subscribeScrollFrame(({ viewportHeight }) => {
      let nextLight = false;
      markers.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 40 && rect.bottom > 80) {
          nextLight = element.dataset.headerTheme === "light";
        }
      });
      if (nextLight !== renderedLight) {
        renderedLight = nextLight;
        setLight(nextLight);
      }

      const targetY = viewportHeight * 0.36;
      const newsroom = document.getElementById("newsroom");
      const cta = document.getElementById("cta");
      const footer = document.getElementById("footer");
      const pastNav = [newsroom, cta, footer].some((el) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= targetY && rect.bottom >= targetY;
      });

      let closestLabel = pastNav ? "" : "首页";
      let distance = Number.POSITIVE_INFINITY;
      let closestSpan = Number.POSITIVE_INFINITY;
      if (!pastNav) {
        for (const section of sections) {
          if (!section.element) continue;
          const rect = section.element.getBoundingClientRect();
          const inside = rect.top <= targetY && rect.bottom >= targetY;
          const nextDistance = inside
            ? 0
            : Math.min(Math.abs(rect.top - targetY), Math.abs(rect.bottom - targetY));
          const span = rect.height;
          if (
            nextDistance < distance ||
            (nextDistance === distance && span < closestSpan)
          ) {
            closestLabel = section.label;
            distance = nextDistance;
            closestSpan = span;
          }
        }
      }
      if (closestLabel !== renderedLabel) {
        renderedLabel = closestLabel;
        setActiveLabel(closestLabel);
      }
    });
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[66px]">
      <div className="mx-auto w-[1440px] px-7 py-[12.6px]">
        <div className="grid h-10 grid-cols-3 items-stretch">
          <a href="#top" className="flex items-center">
            <span
              className={cn(
                "flex h-[29px] w-[115px] items-center gap-[7px] font-mono text-[12px] font-semibold tracking-[0.08em] transition-colors duration-300",
                light ? "text-[var(--brand)]" : "text-[var(--paper)]",
              )}
              aria-label="Duang"
            >
              <span
                className="block size-[15px] bg-current transition-transform duration-300 hover:rotate-[-8deg]"
                aria-hidden
                style={{
                  maskImage: "url(/brand/duang-mark.svg)",
                  WebkitMaskImage: "url(/brand/duang-mark.svg)",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                }}
              />
              DUANG
            </span>
          </a>

          <nav
            className={cn(
              "relative mx-auto grid h-10 w-[336px] grid-cols-5 items-stretch gap-[3.6px] rounded-[3.6px] p-[3.6px] backdrop-blur-[7px] transition-colors duration-300",
              light
                ? "bg-[color-mix(in_oklab,var(--brand)_92%,black)] text-[var(--paper)]"
                : "bg-black/28 text-[var(--paper)]",
            )}
            style={{ ["--nav-index" as string]: Math.max(0, activeIndex) }}
          >
            <span
              className={`nav-active-pill ${hasActive ? "is-shown" : ""}`}
              aria-hidden
            />
            {navMain.map((item) => {
              const isActive = item.label === activeLabel;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative z-[1] flex items-center justify-center text-[12.096px] font-medium leading-none transition-colors duration-300",
                    isActive
                      ? "text-[var(--brand)]"
                      : "hover:text-white/72",
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div
            className={cn(
              "ml-auto flex h-10 w-[274px] items-stretch gap-[3.6px] rounded-[3.6px] py-[3.6px] pl-[3.6px] pr-[5.4px] backdrop-blur-[7px] transition-colors duration-300",
              light
                ? "bg-[color-mix(in_oklab,var(--brand)_92%,black)] text-[var(--paper)]"
                : "bg-black/28 text-[var(--paper)]",
            )}
          >
            {navSide.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center justify-center px-[13.6px] text-[12.096px] font-medium leading-none transition-colors hover:bg-white/8"
              >
                {item.label}
              </a>
            ))}
            <ArrowButton
              href={BLOG_URL}
              size="sm"
              className="self-center"
            >
              笔记
            </ArrowButton>
          </div>
        </div>
      </div>
    </header>
  );
}
