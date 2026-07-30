"use client";

import { useEffect, useRef } from "react";

const TOP_MAIN =
  "M2010.5 943.5H1366.5C1355.45 943.5 1346.5 934.546 1346.5 923.5V513C1346.5 501.954 1337.55 493 1326.5 493H1065.5C1054.45 493 1045.5 484.046 1045.5 473V258C1045.5 246.954 1036.55 238 1025.5 238H427C415.954 238 407 246.954 407 258V356C407 367.046 398.046 376 387 376H266C254.954 376 246 367.046 246 356V51C246 39.9543 237.046 31 226 31H-92";
const TOP_SUB =
  "M2037.5 926.5H1393.5C1382.45 926.5 1373.5 917.546 1373.5 906.5V496C1373.5 484.954 1364.55 476 1353.5 476H1092.5C1081.45 476 1072.5 467.046 1072.5 456V241C1072.5 229.954 1063.55 221 1052.5 221H454C442.954 221 434 229.954 434 241V339C434 350.046 425.046 359 414 359H293C281.954 359 273 350.046 273 339V34C273 22.9543 264.046 14 253 14H-65";
const BOT_MAIN =
  "M2010.5 20H1366.5C1355.45 20 1346.5 28.9543 1346.5 40V450.5C1346.5 461.546 1337.55 470.5 1326.5 470.5H1065.5C1054.45 470.5 1045.5 479.454 1045.5 490.5V705.5C1045.5 716.546 1036.55 725.5 1025.5 725.5H427C415.954 725.5 407 716.546 407 705.5V607.5C407 596.454 398.046 587.5 387 587.5H266C254.954 587.5 246 596.454 246 607.5V912.5C246 923.546 237.046 932.5 226 932.5H-92";
const BOT_SUB =
  "M1983.5 37H1339.5C1328.45 37 1319.5 45.9543 1319.5 57V467.5C1319.5 478.546 1310.55 487.5 1299.5 487.5H1038.5C1027.45 487.5 1018.5 496.454 1018.5 507.5V722.5C1018.5 733.546 1009.55 742.5 998.5 742.5H400C388.954 742.5 380 733.546 380 722.5V624.5C380 613.454 371.046 604.5 360 604.5H239C227.954 604.5 219 613.454 219 624.5V929.5C219 940.546 210.046 949.5 199 949.5H-119";

const SCROLL_STRETCH = 6;
const SCROLL_SLOW_PAD = 1200;
const MOTION_DELAY = 0.15;
const PULSE_EDGE = 0.25;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function motionProg(prog: number) {
  if (MOTION_DELAY <= 0) return prog;
  return clamp((prog - MOTION_DELAY) / (1 - MOTION_DELAY), 0, 1);
}

function pulseOpacity(p: number, dashDir: 1 | -1) {
  const k = Math.min(PULSE_EDGE, 0.499);
  if (k <= 0) return 1;
  if (dashDir === 1) {
    if (p < k) return clamp(p / k, 0, 1);
    if (p > 1 - k) return clamp((1 - p) / k, 0, 1);
    return 1;
  }
  if (p > 1 - k) return clamp((1 - p) / k, 0, 1);
  if (p < k) return clamp(p / k, 0, 1);
  return 1;
}

function progressFor(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const h = Math.max(1, rect.height || el.clientHeight || 1);
  const start = window.innerHeight;
  const end = -(h * SCROLL_STRETCH + SCROLL_SLOW_PAD);
  return clamp((start - rect.top) / (start - end), 0, 1);
}

/**
 * Cantor8 cutting-edge flow lines: top + bottom path pairs with scroll pulses.
 */
export function C8Flow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapTopRef = useRef<HTMLDivElement>(null);
  const wrapBotRef = useRef<HTMLDivElement>(null);
  const topMainRef = useRef<SVGPathElement>(null);
  const topSubRef = useRef<SVGPathElement>(null);
  const botMainRef = useRef<SVGPathElement>(null);
  const botSubRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const wrapTop = wrapTopRef.current;
    const wrapBot = wrapBotRef.current;
    const topMain = topMainRef.current;
    const topSub = topSubRef.current;
    const botMain = botMainRef.current;
    const botSub = botSubRef.current;
    if (!wrapTop || !wrapBot || !topMain || !topSub || !botMain || !botSub) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      [topMain, topSub, botMain, botSub].forEach((p) => {
        p.style.opacity = "0";
      });
      return;
    }

    let rafId = 0;
    const animate = () => {
      const progTop = motionProg(progressFor(wrapTop));
      const pTop = progTop;
      const fadeTop = pulseOpacity(pTop, 1);
      topMain.style.strokeDashoffset = String(-1000 + pTop * 1000);
      topSub.style.strokeDashoffset = String(-1040 + pTop * 980);
      topMain.style.opacity = String(fadeTop);
      topSub.style.opacity = String(fadeTop);

      const progBot = motionProg(progressFor(wrapBot));
      const pBot = 1 - progBot;
      const fadeBot = pulseOpacity(pBot, -1);
      botMain.style.strokeDashoffset = String(-1000 + pBot * 1000);
      botSub.style.strokeDashoffset = String(-1040 + pBot * 980);
      botMain.style.opacity = String(fadeBot);
      botSub.style.opacity = String(fadeBot);

      rafId = window.requestAnimationFrame(animate);
    };
    rafId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return (
    <div ref={sectionRef} className="c8-flow-root" aria-hidden>
      <div
        ref={wrapTopRef}
        data-scroll-layer
        data-scroll-speed="0.04"
        className="flow2-wrap scroll-layer"
      >
        <svg
          className="c8-flow c8-flow--top"
          width="100%"
          viewBox="0 0 1919 960"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <g clipPath="url(#c8clipTop)">
            <path d={TOP_MAIN} stroke="url(#c8gradTopMain)" strokeOpacity={0.35} strokeWidth={1} fill="none" />
            <path d={TOP_SUB} stroke="url(#c8gradTopSub)" strokeOpacity={0.15} fill="none" />
            <path
              ref={topMainRef}
              id="c8pulseTopMain"
              className="c8-flow-pulse"
              d={TOP_MAIN}
              pathLength={1000}
              strokeDasharray="120 880"
              strokeDashoffset={1000}
              strokeWidth={0.5}
              fill="none"
            />
            <path
              ref={topSubRef}
              id="c8pulseTopSub"
              className="c8-flow-pulse"
              d={TOP_SUB}
              pathLength={1000}
              strokeDasharray="90 910"
              strokeDashoffset={1040}
              strokeWidth={0.5}
              fill="none"
            />
          </g>
          <defs>
            <linearGradient id="c8gradTopMain" x1="74.5" y1="-16.9999" x2="1957" y2="967.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="c8gradTopSub" x1="101.5" y1="-33.9999" x2="1984" y2="950.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="c8clipTop">
              <rect width="1919" height="960" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      <div
        ref={wrapBotRef}
        data-scroll-layer
        data-scroll-speed="-0.03"
        className="flow2-wrap flow2-wrap--bottom scroll-layer"
      >
        <svg
          className="c8-flow c8-flow--bottom"
          width="100%"
          viewBox="0 0 1919 933"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <g clipPath="url(#c8clipBottom)">
            <path d={BOT_MAIN} stroke="url(#c8gradBottomMain)" strokeOpacity={0.35} strokeWidth={1} fill="none" />
            <path d={BOT_SUB} stroke="url(#c8gradBottomSub)" strokeOpacity={0.15} fill="none" />
            <path
              ref={botMainRef}
              id="c8pulseBottomMain"
              className="c8-flow-pulse"
              d={BOT_MAIN}
              pathLength={1000}
              strokeDasharray="120 880"
              strokeDashoffset={1000}
              strokeWidth={0.5}
              fill="none"
            />
            <path
              ref={botSubRef}
              id="c8pulseBottomSub"
              className="c8-flow-pulse"
              d={BOT_SUB}
              pathLength={1000}
              strokeDasharray="90 910"
              strokeDashoffset={1040}
              strokeWidth={0.5}
              fill="none"
            />
          </g>
          <defs>
            <linearGradient id="c8gradBottomMain" x1="74.5" y1="980.5" x2="1957" y2="-4.00009" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="c8gradBottomSub" x1="47.5" y1="997.5" x2="1930" y2="12.9999" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="c8clipBottom">
              <rect width="1919" height="1007" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}
