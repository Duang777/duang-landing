"use client";

import { useEffect, useRef } from "react";

const PATH_SUB =
  "M-10 913H634C645.046 913 654 904.046 654 893V482.5C654 471.454 662.954 462.5 674 462.5H935C946.046 462.5 955 453.546 955 442.5V227.5C955 216.454 963.954 207.5 975 207.5H1573.5C1584.55 207.5 1593.5 216.454 1593.5 227.5V325.5C1593.5 336.546 1602.45 345.5 1613.5 345.5H1734.5C1745.55 345.5 1754.5 336.546 1754.5 325.5V20.5C1754.5 9.4543 1763.45 0.5 1774.5 0.5H2092.5";

const PATH_MAIN =
  "M-40 913.5H604C615.046 913.5 624 904.546 624 893.5V483C624 471.954 632.954 463 644 463H905C916.046 463 925 454.046 925 443V228C925 216.954 933.954 208 945 208H1543.5C1554.55 208 1563.5 216.954 1563.5 228V326C1563.5 337.046 1572.45 346 1583.5 346H1704.5C1715.55 346 1724.5 337.046 1724.5 326V21C1724.5 9.9543 1733.45 1 1744.5 1H2062.5";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Cantor8 shrimp-flow: lives inside the Foundation band only (~1093px),
 * with top: 8em, and dash pulses driven by that band's scroll progress.
 */
export function ShrimpFlow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<SVGPathElement>(null);
  const subRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const flow = rootRef.current;
    const pulseMain = mainRef.current;
    const pulseSub = subRef.current;
    if (!flow || !pulseMain || !pulseSub) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      pulseMain.style.opacity = "0";
      pulseSub.style.opacity = "0";
      return;
    }

    // Cantor tracks `.wrapper_general` (the foundation band), not the full about section.
    const progressRoot =
      (flow.parentElement as HTMLElement | null) ?? flow;

    let rafId = 0;

    const animate = () => {
      const rect = progressRoot.getBoundingClientRect();
      const start = window.innerHeight;
      const end = -rect.height;
      const progress = clamp((start - rect.top) / (start - end), 0, 1);

      pulseMain.style.strokeDashoffset = String(-1000 + progress * 1000);
      pulseSub.style.strokeDashoffset = String(-1040 + progress * 980);

      const fade =
        progress > 0.82 ? String(1 - (progress - 0.82) / 0.18) : "1";
      pulseMain.style.opacity = fade;
      pulseSub.style.opacity = fade;

      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return (
    <div ref={rootRef} className="shrimp-flow shrimp-flow--rtl" aria-hidden>
      <div
        data-scroll-layer
        data-scroll-speed="0.05"
        className="scroll-layer absolute inset-0"
      >
      <svg
        className="shrimp-svg shrimp-svg--sub"
        viewBox="0 0 1920 914"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient
            id="shrimpGradSub"
            x1="1926"
            y1="-47.4999"
            x2="43.5"
            y2="937"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={PATH_SUB}
          stroke="url(#shrimpGradSub)"
          strokeOpacity="0.15"
          fill="none"
        />
        <path
          ref={subRef}
          id="shrimpPulseSub"
          className="shrimp-pulse"
          d={PATH_SUB}
          pathLength={1000}
          strokeDasharray="90 910"
          strokeDashoffset={1040}
          fill="none"
        />
      </svg>

      <svg
        className="shrimp-svg shrimp-svg--main"
        viewBox="0 0 1920 915"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient
            id="shrimpGradMain"
            x1="1896"
            y1="-46.9999"
            x2="13.5"
            y2="937.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={PATH_MAIN}
          stroke="url(#shrimpGradMain)"
          strokeOpacity="0.35"
          strokeWidth={1}
          fill="none"
        />
        <path
          ref={mainRef}
          id="shrimpPulseMain"
          className="shrimp-pulse"
          d={PATH_MAIN}
          pathLength={1000}
          strokeDasharray="120 880"
          strokeDashoffset={1000}
          fill="none"
        />
      </svg>
      </div>
    </div>
  );
}
