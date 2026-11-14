"use client";

import { useEffect, useRef } from "react";
import { clamp, frameLoop, prefersReducedMotion, springConfig, stepSpring, type Spring } from "@/lib/spring";

/** x and rise are fractions of the stage; period in seconds. Two groups hug the sides so the centred copy stays clear. */
const BLOBS = [
  { x: 0.1, r: 70, period: 11, phase: 0, rise: 0.55 },
  { x: 0.21, r: 46, period: 8.5, phase: 2.1, rise: 0.4 },
  { x: 0.05, r: 34, period: 7, phase: 4, rise: 0.32 },
  { x: 0.89, r: 76, period: 12.5, phase: 1.2, rise: 0.58 },
  { x: 0.79, r: 44, period: 9, phase: 3.3, rise: 0.44 },
  { x: 0.95, r: 32, period: 6.5, phase: 5, rise: 0.3 },
  { x: 0.5, r: 42, period: 10, phase: 0.7, rise: 0.16 },
  { x: 0.36, r: 30, period: 7.5, phase: 2.6, rise: 0.14 },
  { x: 0.64, r: 32, period: 8, phase: 4.4, rise: 0.15 },
];
const BASE = 200;
const REACH = springConfig(0.7, 0.55);

/**
 * Lava-lamp goo along the bottom of a stage: blobs swell out of a goo floor, rise, neck off and sink back,
 * merging under the goo filter. Blobs near the pointer stretch toward it.
 */
export function GooLava() {
  const root = useRef<HTMLDivElement>(null);
  const blobs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    const pull = BLOBS.map(() => ({ x: { x: 0, v: 0 } as Spring, y: { x: 0, v: 0 } as Spring }));
    const pointer = { x: -1e4, y: -1e4 };
    let visible = false;
    const start = performance.now();

    const paint = (dt: number) => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const k = clamp(w / 1200, 0.55, 1);
      const t = reduced ? 3 : (performance.now() - start) / 1000;
      BLOBS.forEach((b, i) => {
        const node = blobs.current[i];
        if (!node) return;
        const cycle = 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / b.period + b.phase);
        const x = w * b.x + Math.sin(t * 0.4 + b.phase) * w * 0.02;
        const y = h - b.rise * h * cycle;
        const r = b.r * k * (1 + 0.08 * Math.sin(t * 0.9 + b.phase));
        const dx = pointer.x - x;
        const dy = pointer.y - y;
        const near = Math.max(0, 1 - Math.hypot(dx, dy) / (280 * k));
        if (!reduced) {
          stepSpring(pull[i].x, dx * 0.4 * near, REACH, dt);
          stepSpring(pull[i].y, dy * 0.4 * near, REACH, dt);
        }
        node.style.transform = `translate3d(${x + pull[i].x.x - BASE / 2}px, ${y + pull[i].y.x - BASE / 2}px, 0) scale(${(r * 2) / BASE})`;
      });
    };

    const loop = frameLoop((dt) => {
      paint(dt);
      return visible && !reduced;
    });
    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      if (visible) loop.wake();
    });
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    paint(0);
    return () => {
      loop.stop();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-0 [filter:url(#goo-lg)]">
      {/* A flat floor the blobs rise out of; the footer links sit on it. */}
      <div className="absolute inset-x-0 bottom-0 h-[92px] bg-lava sm:h-[64px]" />
      {BLOBS.map((_, i) => (
        <div
          key={i}
          ref={(n) => {
            blobs.current[i] = n;
          }}
          className="absolute top-0 left-0 size-[200px] rounded-full bg-lava"
        />
      ))}
    </div>
  );
}
