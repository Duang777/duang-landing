"use client";

import { useEffect, useRef } from "react";
import { ArrowButton } from "./ArrowButton";
import { BottleMark } from "./BottleMark";
import { products } from "@/data/site";
import { subscribeScrollFrame } from "@/lib/scroll-frame";

const CARD_W = 460;
const OVERLAP = 48;
const STEP = CARD_W - OVERLAP;
const TRACK_LEFT = 315;
const TRACK_W = products.length * CARD_W - (products.length - 1) * OVERLAP;
const WRAPPER_H = 3415;
const STICKY_H = 813;
const SCROLL_RANGE = WRAPPER_H - STICKY_H;
/** Last card rests against the 1412px right gutter on the reference layout. */
const TRAVEL = TRACK_LEFT + TRACK_W - 1412;
const FOCUS_X = 270;
const CARD_Y = [0, 100, 0, -120, 0, 100, 0] as const;
const CARD_BOTTLES = ["round", "flask", "vial", "jar", "round", "vial", "flask"] as const;
const LIQUID_TONES = [
  ["#c98968", "#9a4f36", "#5f2c1c"],
  ["#b07a58", "#8a4630", "#552618"],
  ["#6f8794", "#4a6270", "#2c3d48"],
  ["#c4a15a", "#9a6f2e", "#5c4218"],
  ["#b07a58", "#8a4630", "#552618"],
  ["#8a7a4a", "#6a5a2e", "#3f3518"],
  ["#6f8794", "#4a6270", "#2c3d48"],
] as const;

function cardMotion(left: number) {
  const dist = left - FOCUS_X;
  const abs = Math.abs(dist);
  const scale = Math.min(1, Math.max(0.72, 1 - Math.max(0, dist) / 1800));
  const opacity = 0.42 + scale * 0.58;
  const rotateY = Math.max(-5, Math.min(5, (dist / 1000) * 5));
  return { scale, opacity, rotateY, abs };
}

/**
 * The rail starts moving as the sticky viewport approaches the top, then stays
 * pinned. Each card keeps its own vertical offset and grows toward the focus
 * lane as it crosses the viewport, matching the reference interaction.
 */
export function ProductsSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const jarLabelRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dotRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    let frame = 0;
    let current = 0;
    let target = 0;
    let renderedIndex = -1;
    let lastTime = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const paint = (value: number) => {
      railRef.current?.style.setProperty(
        "transform",
        `translate3d(${-value * TRAVEL}px, 0, 0)`,
      );
      progressBarRef.current?.style.setProperty(
        "transform",
        `scaleX(${Math.max(0.08, value)})`,
      );
      if (jarLabelRef.current) {
        jarLabelRef.current.textContent = `${Math.round(value * 100)}%`;
      }

      let bestIndex = 0;
      let bestAbs = Number.POSITIVE_INFINITY;

      itemRefs.current.forEach((item, i) => {
        if (!item) return;
        const left = TRACK_LEFT + i * STEP - value * TRAVEL;
        const { scale, opacity, rotateY, abs } = cardMotion(left);
        item.style.opacity = String(opacity);
        item.style.transform = `translate3d(0, ${CARD_Y[i]}px, 0) scale(${scale}) rotateY(${rotateY}deg)`;
        item.style.zIndex = String(Math.max(1, 1000 - Math.round(abs)));
        if (abs < bestAbs) {
          bestAbs = abs;
          bestIndex = i;
        }
      });

      itemRefs.current.forEach((item, i) => {
        item?.classList.toggle("is-focus", i === bestIndex);
        item?.classList.toggle("is-current", i === bestIndex);
      });

      if (bestIndex !== renderedIndex) {
        renderedIndex = bestIndex;
        if (counterRef.current) {
          counterRef.current.textContent = `${String(bestIndex + 1).padStart(2, "0")} / ${String(products.length).padStart(2, "0")}`;
        }
        dotRefs.current.forEach((dot, i) =>
          dot?.classList.toggle("is-active", i === bestIndex),
        );
      }
    };

    const readTarget = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      target = Math.min(1, Math.max(0, -rect.top / SCROLL_RANGE));

      if (reducedMotion) {
        current = target;
        paint(target);
        return;
      }

      if (!frame) {
        lastTime = performance.now();
        frame = window.requestAnimationFrame(animate);
      }
    };

    const animate = (time: number) => {
      frame = 0;
      const delta = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;
      const ease = 1 - Math.exp(-delta * 8.5);
      current += (target - current) * ease;

      if (Math.abs(target - current) < 0.0004) current = target;
      paint(current);

      if (current !== target) frame = window.requestAnimationFrame(animate);
    };

    const unsubscribe = subscribeScrollFrame(readTarget);
    return () => {
      unsubscribe();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      data-header-theme="dark"
      className="relative h-[4365px] w-[1440px] bg-[var(--near-black)] text-[var(--paper)]"
    >
      <div ref={wrapperRef} className="relative h-[3415px]">
        <div className="pt-[187px]">
          <div
            data-reveal="heading"
            className="c8-row flex h-[173px] items-start justify-between"
          >
            <h2 className="w-[293px] font-display text-[86.4px] font-normal leading-[86.4px] tracking-[-0.03em]">
              文章
              <br />
              选读
            </h2>
            <div className="w-[376px]">
              <div className="mb-[14px] flex justify-end">
                <span className="inline-flex h-[36px] items-end gap-[7px] text-[color-mix(in_oklab,var(--paper)_55%,transparent)]">
                  <BottleMark kind="vial" className="h-[36px]" />
                  <span
                    ref={jarLabelRef}
                    className="pb-[4px] font-mono text-[8px] uppercase leading-[11px] tracking-[0.1em] opacity-55"
                  >
                    0%
                  </span>
                </span>
              </div>
              <p className="text-[12.96px] font-medium leading-[20.2px] text-[color-mix(in_oklab,var(--paper)_78%,transparent)]">
                近作
              </p>
              <ArrowButton
                href="https://duangblog.pages.dev/posts/"
                size="lg"
                variant="light"
                className="mt-[18px]"
              >
                全部
              </ArrowButton>
            </div>
          </div>
        </div>

        <div
          id="articles"
          className="articles-rail-stage sticky top-0 mt-[72px] flex h-[813px] w-[1440px] scroll-mt-0 items-center overflow-hidden"
        >
          <div
            ref={railRef}
            className="flex will-change-transform"
            style={{
              paddingLeft: TRACK_LEFT,
            }}
          >
            {products.map((product, i) => {
              const left = TRACK_LEFT + i * STEP;
              const { scale, opacity, rotateY, abs } = cardMotion(left);

              return (
                <div
                  ref={(node) => {
                    itemRefs.current[i] = node;
                  }}
                  key={product.title}
                  className={`product-item-motion h-[535px] w-[460px] shrink-0 will-change-transform ${i === 0 ? "is-focus is-current" : ""}`}
                  style={{
                    marginLeft: i === 0 ? 0 : -OVERLAP,
                    opacity,
                    transform: `translate3d(0, ${CARD_Y[i]}px, 0) scale(${scale}) rotateY(${rotateY}deg)`,
                    zIndex: Math.max(1, 1000 - Math.round(abs)),
                  }}
                >
                  <ProductCard
                    tag={product.tag}
                    title={product.title}
                    body={product.body}
                    href={product.href}
                    index={i}
                  />
                </div>
              );
            })}
          </div>

          <div className="pointer-events-none absolute inset-x-[28px] bottom-[48px] flex items-end justify-between">
            <div
              ref={counterRef}
              className="font-mono text-[10px] tracking-[0.12em] text-white/45"
            >
              01 / {String(products.length).padStart(2, "0")}
            </div>
            <div className="h-[2px] w-[220px] overflow-hidden bg-white/15">
              <div
                ref={progressBarRef}
                className="h-full origin-left bg-[var(--brand-soft)] will-change-transform"
                style={{ transform: "scaleX(0.08)" }}
              />
            </div>
            <div className="pointer-events-auto flex gap-[6px]">
              {products.map((product, i) => (
                <button
                  type="button"
                  ref={(node) => {
                    dotRefs.current[i] = node;
                  }}
                  key={product.title}
                  aria-label={`跳到第 ${i + 1} 篇`}
                  className={`product-dot block h-[5px] w-[5px] border-0 bg-white/30 p-0 ${i === 0 ? "is-active" : ""}`}
                  onClick={() => {
                    const el = wrapperRef.current;
                    if (!el) return;
                    const progress =
                      products.length <= 1 ? 0 : i / (products.length - 1);
                    const top =
                      window.scrollY +
                      el.getBoundingClientRect().top +
                      progress * SCROLL_RANGE;
                    window.scrollTo({ top, behavior: "smooth" });
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  tag,
  title,
  body,
  href,
  index,
}: {
  tag: string;
  title: string;
  body: string;
  href: string;
  index: number;
}) {
  return (
    <a
      href={href}
      className="article-card group relative block h-[535px] w-[460px] shrink-0 overflow-hidden rounded-[5.4px] bg-[var(--brand)] transition-[transform,opacity,filter] duration-500"
    >
      <div className="flex items-start justify-between pb-[14.4px] pl-[18px] pr-[7.2px] pt-[7.2px]">
        <span className="mt-[6px] rounded-[1.62px] bg-white/15 px-[6.912px] py-[4.752px] text-[8.64px] uppercase leading-[8.64px] tracking-[0.06em]">
          {tag}
        </span>
        <span className="article-card-arrow flex size-[36px] items-center justify-center rounded-[3px] bg-[var(--paper)]">
          <span
            className="block size-[14px] bg-[var(--brand)]"
            style={{
              maskImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'%3E%3Cpath d='M3 11 11 3M4.5 3H11v6.5' stroke='black' stroke-width='1.6' fill='none'/%3E%3C/svg%3E\")",
              WebkitMaskImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'%3E%3Cpath d='M3 11 11 3M4.5 3H11v6.5' stroke='black' stroke-width='1.6' fill='none'/%3E%3C/svg%3E\")",
              maskSize: "contain",
              WebkitMaskSize: "contain",
            }}
          />
        </span>
      </div>

      <ArticleCardArt index={index} />

      <div className="px-[22px] pb-[22px] pt-[13px]">
        <h3 className="text-[22px] font-normal leading-[24px] tracking-[-0.01em]">
          {title}
        </h3>
        <p className="mt-[12px] max-w-[405px] text-[13px] font-normal leading-[18px] text-[color-mix(in_oklab,var(--paper)_82%,transparent)]">
          {body}
        </p>
      </div>
    </a>
  );
}

function ArticleCardArt({ index }: { index: number }) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <div className="article-card-visual article-specimen relative h-[345px] w-[460px] overflow-hidden">
      <div className="article-specimen-grid absolute inset-0" aria-hidden />
      <span className="article-specimen-index absolute left-[18px] top-[16px] font-mono text-[9px] tracking-[0.14em]">
        {number}
      </span>
      <span className="article-specimen-shelf absolute bottom-[49px] left-[32px] right-[32px]" aria-hidden />

      <div className="article-specimen-bottle absolute bottom-[40px] left-1/2 h-[225px] text-[var(--brand)]">
        <SpecimenBottle kind={CARD_BOTTLES[index]} index={index} />
      </div>

      <div
        className="article-specimen-scale absolute bottom-[16px] left-[32px] right-[32px] flex items-center justify-between"
        aria-hidden
      >
        <div className="flex flex-1 items-end gap-[5px]">
          {Array.from({ length: 17 }, (_, tick) => (
            <span
              key={tick}
              className={tick % 4 === 0 ? "h-[10px]" : tick % 2 === 0 ? "h-[6px]" : "h-[3px]"}
            />
          ))}
        </div>
        <span className="ml-[12px] shrink-0 font-mono text-[8px] tracking-[0.12em]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

function SpecimenBottle({
  kind,
  index,
}: {
  kind: (typeof CARD_BOTTLES)[number];
  index: number;
}) {
  const uid = `specimen-${index}`;
  const [toneA, toneB, toneC] = LIQUID_TONES[index];
  const bodyPath = {
    jar: "M31 52C27 55 25 61 25 68V137C25 151 35 158 60 158C85 158 95 151 95 137V68C95 61 93 55 89 52C85 46 76 43 60 43C44 43 35 46 31 52Z",
    flask: "M48 30H72L74 67C87 84 95 107 95 134C95 150 82 159 60 159C38 159 25 150 25 134C25 107 33 84 46 67Z",
    vial: "M36 45H84V139C84 152 76 159 64 159H56C44 159 36 152 36 139Z",
    round: "M48 34H72L74 63C89 73 98 96 98 123C98 146 83 160 60 160C37 160 22 146 22 123C22 96 31 73 46 63Z",
  }[kind];
  const liquidY = [111, 99, 119, 91, 106, 116, 96][index];
  const neck =
    kind === "jar" ? (
      <>
        <rect x="39" y="19" width="42" height="12" rx="2" className="specimen-cork" />
        <path d="M36 34H84V43H36Z" className="specimen-rim" />
      </>
    ) : kind === "vial" ? (
      <>
        <rect x="33" y="18" width="54" height="13" rx="2" className="specimen-cork" />
        <rect x="37" y="32" width="46" height="9" rx="2" className="specimen-rim" />
      </>
    ) : (
      <>
        <rect x="45" y="17" width="30" height="12" rx="2" className="specimen-cork" />
        <path d="M45 31H75V38H45Z" className="specimen-rim" />
      </>
    );

  return (
    <svg viewBox="0 0 120 180" className="h-full w-auto overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-glass`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".18" />
          <stop offset=".2" stopColor="#fff" stopOpacity=".58" />
          <stop offset=".52" stopColor="#f8eee1" stopOpacity=".1" />
          <stop offset=".84" stopColor="#fff" stopOpacity=".36" />
          <stop offset="1" stopColor="#7b4a35" stopOpacity=".16" />
        </linearGradient>
        <linearGradient id={`${uid}-liquid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={toneA} stopOpacity=".78" />
          <stop offset=".35" stopColor={toneB} stopOpacity=".88" />
          <stop offset="1" stopColor={toneC} stopOpacity=".94" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <path d={bodyPath} />
        </clipPath>
        <filter id={`${uid}-shadow`} x="-40%" y="-30%" width="180%" height="190%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#542919" floodOpacity=".18" />
        </filter>
      </defs>

      <ellipse cx="60" cy="166" rx="30" ry="5" className="specimen-ground" />
      <g filter={`url(#${uid}-shadow)`}>
        {neck}
        <g clipPath={`url(#${uid}-clip)`}>
          <rect
            x="15"
            y={liquidY}
            width="90"
            height={170 - liquidY}
            fill={`url(#${uid}-liquid)`}
            className="specimen-liquid"
          />
          <path
            d={`M18 ${liquidY + 2} Q38 ${liquidY - 4} 60 ${liquidY + 1}T102 ${liquidY}`}
            className="specimen-meniscus"
          />
          <circle cx="46" cy={liquidY + 23} r="2.2" className="specimen-bubble specimen-bubble-one" />
          <circle cx="70" cy={liquidY + 36} r="1.4" className="specimen-bubble specimen-bubble-two" />
        </g>
        <path d={bodyPath} fill={`url(#${uid}-glass)`} className="specimen-glass" />
        <path d="M39 62C34 77 34 121 38 139" className="specimen-highlight" />
        <rect x="38" y="86" width="44" height="32" rx="1.5" className="specimen-label" />
        <path d="M44 95H75M44 101H68M44 109H61" className="specimen-label-rule" />
        <text x="76" y="112" textAnchor="end" className="specimen-label-number">
          {String(index + 1).padStart(2, "0")}
        </text>
      </g>
    </svg>
  );
}
