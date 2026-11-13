"use client";

import { useEffect, useRef } from "react";
import { frameLoop, prefersReducedMotion, settled, springConfig, stepSpring, type Spring } from "@/lib/spring";

const HEAD = springConfig(0.38, 0.48);
const TAIL = springConfig(0.62, 0.7);
const THUMB = 22;
const PAD = THUMB / 2;

/**
 * Jelly slider, after goopUI's goo slider: a native range input does the dragging, keyboard and aria;
 * on top, an ink thumb chases the value on an underdamped spring, stretches with speed, drags a lagging
 * tail, and melts into the fill under the goo filter.
 */
export function GooSlider({
  count,
  value,
  onChange,
  label,
  valueText,
}: {
  count: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
  valueText: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const tail = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const goal = useRef(value);
  const wake = useRef<() => void>(() => {});

  useEffect(() => {
    const el = root.current;
    const f = fill.current;
    const h = head.current;
    const t = tail.current;
    const rg = ring.current;
    if (!el || !f || !h || !t || !rg) return;
    const reduced = prefersReducedMotion();
    let width = el.offsetWidth;
    const xOf = (v: number) => PAD + (count > 1 ? v / (count - 1) : 0) * (width - THUMB);
    const sHead: Spring = { x: xOf(goal.current), v: 0 };
    const sTail: Spring = { x: sHead.x, v: 0 };

    const loop = frameLoop((dt) => {
      const target = xOf(goal.current);
      if (reduced) {
        sHead.x = sTail.x = target;
        sHead.v = 0;
      } else {
        stepSpring(sHead, target, HEAD, dt);
        stepSpring(sTail, target, TAIL, dt);
      }
      const stretch = 1 + Math.min(0.7, Math.abs(sHead.v) / 1400);
      h.style.transform = `translate3d(${sHead.x - PAD}px, 0, 0) scale(${stretch}, ${1 / Math.sqrt(stretch)})`;
      t.style.transform = `translate3d(${sTail.x - 7}px, 4px, 0)`;
      f.style.width = `${Math.max(0, sHead.x)}px`;
      rg.style.transform = `translate3d(${sHead.x - PAD - 4}px, -4px, 0)`;
      return !(settled(sHead, target, 0.2) && settled(sTail, target, 0.2));
    });
    wake.current = loop.wake;
    const ro = new ResizeObserver(() => {
      width = el.offsetWidth;
      sHead.x = sTail.x = xOf(goal.current);
      loop.wake();
    });
    ro.observe(el);
    loop.wake();
    return () => {
      loop.stop();
      ro.disconnect();
    };
  }, [count]);

  useEffect(() => {
    goal.current = value;
    wake.current();
  }, [value]);

  return (
    <div ref={root} className="relative h-[22px]">
      <div className="absolute inset-x-0 top-[6px] h-2.5 rounded-full bg-ink/10" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -inset-y-4 [filter:url(#goo-sm)]">
        <div ref={fill} className="absolute top-[21px] left-0 h-3 rounded-full bg-ink" />
        <div ref={tail} className="absolute top-4 left-0 size-[14px] rounded-full bg-ink" />
        <div ref={head} className="absolute top-4 left-0 size-[22px] rounded-full bg-ink" />
      </div>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 size-[30px] rounded-full opacity-0 ring-2 ring-ink/40 transition-opacity duration-150"
      />
      <input
        type="range"
        min={0}
        max={count - 1}
        step={1}
        value={value}
        aria-label={label}
        aria-valuetext={valueText}
        onChange={(e) => onChange(Number(e.target.value))}
        onFocus={(e) => ring.current?.classList.toggle("opacity-100", e.target.matches(":focus-visible"))}
        onBlur={() => ring.current?.classList.remove("opacity-100")}
        className="absolute inset-0 size-full cursor-grab opacity-0 active:cursor-grabbing"
      />
    </div>
  );
}
