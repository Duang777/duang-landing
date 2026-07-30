"use client";

import { useEffect, useState } from "react";
import { subscribeScrollFrame } from "@/lib/scroll-frame";

export function HeroBottleDetail() {
  const [level, setLevel] = useState(18);
  const [tip, setTip] = useState("单击摇一下 · 双击去文章");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let renderedLevel = 18;
    return subscribeScrollFrame(({ scrollY, maxScroll }) => {
      const ratio = Math.min(1, Math.max(0, scrollY / maxScroll));
      const nextLevel = Math.round(18 + ratio * 74);
      if (nextLevel === renderedLevel) return;
      renderedLevel = nextLevel;
      setLevel(nextLevel);
    });
  }, []);

  useEffect(() => {
    if (!busy) return;
    const timer = window.setTimeout(() => setBusy(false), 900);
    return () => window.clearTimeout(timer);
  }, [busy]);

  return (
    <button
      type="button"
      className={`group absolute bottom-[34px] right-[132px] z-[2] flex items-end gap-[9px] border-0 bg-transparent p-0 text-left text-[var(--paper)] hero-enter hero-enter-delay ${busy ? "is-bottle-busy" : ""}`}
      aria-label="念头瓶，单击摇一下，双击去文章选读"
      title={tip}
      onClick={() => {
        setBusy(true);
        setTip(`液位 ${level}% · 继续往下看`);
      }}
      onDoubleClick={() => {
        setBusy(true);
        setTip("倒出一篇，去文章选读");
        window.location.hash = "articles";
      }}
    >
      <svg
        viewBox="0 0 42 64"
        className="hero-mini-bottle h-[64px] w-[42px] overflow-visible transition-transform duration-300 group-hover:-translate-y-px"
        aria-hidden
      >
        <defs>
          <clipPath id="hero-mini-bottle-clip">
            <path d="M13 22C11 23 10 25 10 28V51C10 57 14 60 21 60C28 60 32 57 32 51V28C32 25 31 23 29 22C28 18 25 16 21 16C17 16 14 18 13 22Z" />
          </clipPath>
          <linearGradient id="hero-mini-liquid" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#141413" stopOpacity=".7" />
            <stop offset="1" stopColor="#faf9f5" stopOpacity=".68" />
          </linearGradient>
        </defs>
        <ellipse cx="21" cy="62" rx="13" ry="2" fill="currentColor" opacity=".13" />
        <rect x="15" y="6" width="12" height="5" rx="1" fill="currentColor" opacity=".65" />
        <rect x="13" y="10" width="16" height="4" rx="1" fill="currentColor" opacity=".9" />
        <path
          d="M13 22C11 23 10 25 10 28V51C10 57 14 60 21 60C28 60 32 57 32 51V28C32 25 31 23 29 22C28 18 25 16 21 16C17 16 14 18 13 22Z"
          fill="currentColor"
          fillOpacity=".07"
          stroke="currentColor"
          strokeOpacity=".55"
          strokeWidth=".7"
        />
        <g clipPath="url(#hero-mini-bottle-clip)">
          <rect
            className="hero-mini-liquid"
            x="9"
            y={56 - Math.round(level * 0.28)}
            width="24"
            height={Math.round(level * 0.28) + 6}
            fill="url(#hero-mini-liquid)"
          />
          <ellipse
            cx="21"
            cy={56 - Math.round(level * 0.28)}
            rx="11"
            ry="2"
            fill="currentColor"
            opacity=".65"
          />
          <circle className="hero-mini-bubble" cx="17" cy="49" r="1.2" fill="currentColor" opacity=".75" />
          <circle className="hero-mini-bubble hero-mini-bubble-late" cx="25" cy="52" r=".9" fill="currentColor" opacity=".65" />
        </g>
        <path d="M14 27V48" stroke="currentColor" strokeOpacity=".48" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="14" y="34" width="14" height="8" rx=".6" fill="currentColor" opacity=".86" />
        <text x="21" y="39.5" textAnchor="middle" fontSize="3.4" fill="var(--brand)" fontFamily="ui-monospace, monospace">
          念头
        </text>
      </svg>
      <span className="pb-[5px] font-mono text-[8px] uppercase leading-[12px] tracking-[0.11em] text-[color-mix(in_oklab,var(--paper)_66%,transparent)]">
        idea jar
        <br />
        level {level}%
      </span>
    </button>
  );
}
