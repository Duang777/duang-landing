"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { clamp, frameLoop, prefersReducedMotion, settled, springConfig, stepSpring, type Spring } from "@/lib/spring";

type Box = { pos: number; cross: number; size: number; crossSize: number };

const HEAD = springConfig(0.26, 0.62);
const TAIL = springConfig(0.44, 0.78);
const SIZE = springConfig(0.3, 0.7);
const PRESENCE = springConfig(0.32, 0.72);

/**
 * A liquid hover background, after goopUI's list highlight: a head blob springs to the hovered link and
 * a softer tail blob lags behind it, so under the goo filter the highlight stretches between items,
 * pinches, and melts back together. Mouse/pen and keyboard focus only, never touch.
 */
export function GooHighlight({
  axis = "y",
  className,
  innerClassName,
  blobClassName,
  children,
}: {
  axis?: "x" | "y";
  className?: string;
  innerClassName?: string;
  blobClassName: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const tail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const h = head.current;
    const t = tail.current;
    if (!el || !h || !t) return;
    const reduced = prefersReducedMotion();

    const sHead: Spring = { x: 0, v: 0 };
    const sTail: Spring = { x: 0, v: 0 };
    const sSize: Spring = { x: 0, v: 0 };
    const sPresence: Spring = { x: 0, v: 0 };
    let target: Box | null = null;
    let last: Box | null = null;

    const measure = (item: Element): Box => {
      const a = el.getBoundingClientRect();
      const b = item.getBoundingClientRect();
      return axis === "y"
        ? { pos: b.top - a.top, cross: b.left - a.left, size: b.height, crossSize: b.width }
        : { pos: b.left - a.left, cross: b.top - a.top, size: b.width, crossSize: b.height };
    };

    const paint = (blob: HTMLDivElement, pos: number, scale: number) => {
      const box = last;
      if (!box) return;
      const size = Math.max(0, sSize.x);
      const [x, y, w, hh] =
        axis === "y" ? [box.cross, pos, box.crossSize, size] : [pos, box.cross, size, box.crossSize];
      blob.style.width = `${w}px`;
      blob.style.height = `${hh}px`;
      blob.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    };

    const loop = frameLoop((dt) => {
      const goal = target ?? last;
      if (!goal) return false;
      const presence = target ? 1 : 0;
      if (reduced) {
        sHead.x = sTail.x = goal.pos;
        sSize.x = goal.size;
        sPresence.x = presence;
      } else {
        stepSpring(sHead, goal.pos, HEAD, dt);
        stepSpring(sTail, goal.pos, TAIL, dt);
        stepSpring(sSize, goal.size, SIZE, dt);
        stepSpring(sPresence, presence, PRESENCE, dt);
      }
      const p = clamp(sPresence.x, 0, 1.08);
      paint(h, sHead.x, p);
      paint(t, sTail.x, p * 0.94);
      return !(
        settled(sHead, goal.pos) &&
        settled(sTail, goal.pos) &&
        settled(sSize, goal.size) &&
        settled(sPresence, presence, 0.005)
      );
    });

    const moveTo = (item: Element | null) => {
      const next = item ? measure(item) : null;
      if (next && sPresence.x < 0.05) {
        // Appearing from nothing: start in place instead of sliding in from the last item.
        sHead.x = sTail.x = next.pos;
        sHead.v = sTail.v = 0;
        sSize.x = next.size;
      }
      target = next;
      if (next) last = next;
      loop.wake();
    };

    const itemOf = (e: Event) => (e.target as Element | null)?.closest?.("a[href],button") ?? null;
    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const item = itemOf(e);
      // Popovers inside the list (the style picker) live outside its box; leave them alone.
      if (item?.closest("[data-goo-skip]")) return;
      if (item && el.contains(item)) moveTo(item);
    };
    const onLeave = () => moveTo(null);
    const onFocus = (e: FocusEvent) => {
      const item = itemOf(e);
      if (item?.closest("[data-goo-skip]")) return;
      if (item && (item as HTMLElement).matches(":focus-visible")) moveTo(item);
    };
    const onBlur = (e: FocusEvent) => {
      if (!el.contains(e.relatedTarget as Node | null)) moveTo(null);
    };

    el.addEventListener("pointerover", onOver);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("focusin", onFocus);
    el.addEventListener("focusout", onBlur);
    return () => {
      loop.stop();
      el.removeEventListener("pointerover", onOver);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("focusin", onFocus);
      el.removeEventListener("focusout", onBlur);
    };
  }, [axis]);

  return (
    <div ref={root} className={cn("relative", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 [filter:url(#goo)]">
        <div ref={tail} className={cn("absolute top-0 left-0 origin-center", blobClassName)} />
        <div ref={head} className={cn("absolute top-0 left-0 origin-center", blobClassName)} />
      </div>
      <div className={cn("relative", innerClassName)}>{children}</div>
    </div>
  );
}
