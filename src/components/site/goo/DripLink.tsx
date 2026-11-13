"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { frameLoop, prefersReducedMotion, settled, springConfig, stepFall, stepSpring, type Spring } from "@/lib/spring";

const PAD = 24;
const BLOB = 20;
const SLOTS = [
  { at: 0.3, rate: 0.8 },
  { at: 0.68, rate: 0.55 },
];
const HANG_FED = springConfig(0.55, 0.95);
const HANG_DRAIN = springConfig(0.28, 0.7);
const MAGNET = springConfig(0.35, 0.6);

type Drip = { m: number; hang: Spring; circles: HTMLSpanElement[] };
type Drop = { y: Spring; x: number; r: number; fall: number; el: HTMLSpanElement };

/**
 * An ink pill that drips while hovered, after goopUI's drip model: a bulb fills and sags on a viscous
 * spring, pinches off once it is heavy enough, and falls as a drop; the neck springs back. The whole
 * button also leans toward the pointer (magnetic).
 */
export function DripLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const wrap = useRef<HTMLSpanElement>(null);
  const layer = useRef<HTMLSpanElement>(null);
  const body = useRef<HTMLSpanElement>(null);
  const link = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const ly = layer.current;
    const b = body.current;
    const a = link.current;
    if (!w || !ly || !b || !a || prefersReducedMotion()) return;

    let width = 0;
    let height = 0;
    const ro = new ResizeObserver(() => {
      width = a.offsetWidth;
      height = a.offsetHeight;
    });
    ro.observe(a);

    const circle = () => {
      const c = document.createElement("span");
      c.className = "absolute top-0 left-0 rounded-full bg-ink";
      c.style.width = c.style.height = `${BLOB}px`;
      c.style.transform = "scale(0)";
      ly.appendChild(c);
      return c;
    };
    const drips: Drip[] = SLOTS.map(() => ({ m: 0, hang: { x: 0, v: 0 }, circles: [circle(), circle(), circle()] }));
    const drops: Drop[] = [];
    const mx: Spring = { x: 0, v: 0 };
    const my: Spring = { x: 0, v: 0 };
    let hovered = false;
    let pull = { x: 0, y: 0 };

    const place = (el: HTMLSpanElement, x: number, y: number, r: number, opacity = 1) => {
      el.style.transform = `translate3d(${x - BLOB / 2}px, ${y - BLOB / 2}px, 0) scale(${(r * 2) / BLOB})`;
      el.style.opacity = String(opacity);
    };

    const loop = frameLoop((dt) => {
      let busy = hovered;
      const bottom = PAD + height;

      drips.forEach((d, i) => {
        const slot = SLOTS[i];
        d.m = hovered ? Math.min(1, d.m + dt * slot.rate) : Math.max(0, d.m - dt * 2.5);
        const fed = hovered && d.m > 0;
        stepSpring(d.hang, 34 * d.m ** 1.4, fed ? HANG_FED : HANG_DRAIN, dt);
        const r = (4 + 5 * Math.sqrt(d.m)) * Math.min(1, d.m * 4);
        const x = PAD + width * slot.at;

        if (d.m >= 1 && d.hang.x > 28) {
          const el = circle();
          drops.push({ y: { x: bottom + d.hang.x, v: Math.max(80, d.hang.v) }, x, r, fall: 0, el });
          d.m = 0.15;
        }
        const [root, neck, bulb] = d.circles;
        const hang = Math.max(0, d.hang.x);
        place(root, x, bottom - 3, r * 1.1);
        place(neck, x, bottom + hang * 0.5, r * 0.62);
        place(bulb, x, bottom + hang, r);
        if (d.m > 0 || !settled(d.hang, 0, 0.2)) busy = true;
      });

      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        const y0 = d.y.x;
        stepFall(d.y, 1500, 1.6, dt);
        d.fall += d.y.x - y0;
        d.r *= 1 - dt * 0.9;
        const fade = Math.max(0, 1 - d.fall / 80);
        place(d.el, d.x, d.y.x, d.r * (0.6 + 0.4 * fade), fade);
        if (fade <= 0) {
          d.el.remove();
          drops.splice(i, 1);
        }
      }
      busy ||= drops.length > 0;

      stepSpring(mx, pull.x, MAGNET, dt);
      stepSpring(my, pull.y, MAGNET, dt);
      w.style.transform = `translate3d(${mx.x}px, ${my.x}px, 0)`;
      return busy || !settled(mx, 0) || !settled(my, 0);
    });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = a.getBoundingClientRect();
      pull = { x: (e.clientX - (r.left + r.width / 2)) * 0.22, y: (e.clientY - (r.top + r.height / 2)) * 0.3 };
      loop.wake();
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      hovered = true;
      loop.wake();
    };
    const onLeave = () => {
      hovered = false;
      pull = { x: 0, y: 0 };
      loop.wake();
    };
    a.addEventListener("pointerenter", onEnter);
    a.addEventListener("pointermove", onMove);
    a.addEventListener("pointerleave", onLeave);
    return () => {
      loop.stop();
      ro.disconnect();
      a.removeEventListener("pointerenter", onEnter);
      a.removeEventListener("pointermove", onMove);
      a.removeEventListener("pointerleave", onLeave);
      ly.replaceChildren(b);
    };
  }, []);

  return (
    <span ref={wrap} className="relative inline-flex shrink-0">
      <span className="relative inline-flex transition-transform duration-150 ease-out has-[a:active]:scale-[0.96]">
      <span
        ref={layer}
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -top-6 -bottom-32 [filter:url(#goo-sm)]"
      >
        <span ref={body} className="absolute inset-x-6 top-6 bottom-32 rounded-full bg-ink" />
      </span>
      <a
        ref={link}
        href={href}
        className={cn(
          "group relative inline-flex items-center gap-1.5 rounded-full text-white",
          className,
        )}
      >
        {children}
      </a>
      </span>
    </span>
  );
}
