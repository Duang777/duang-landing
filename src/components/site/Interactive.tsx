"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/spring";

/** 3D tilt toward the pointer with a moving glare, the "3D 倾斜" output of the magnetic-cursor formula. */
export function Tilt({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch" || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * 9}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 11}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };
  return (
    <div className="[perspective:900px]">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={cn(
          "group/tilt relative transition-transform duration-300 ease-out [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transform-style:preserve-3d]",
          className,
        )}
      >
        {children}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100 [background:radial-gradient(420px_circle_at_var(--gx,50%)_var(--gy,50%),rgb(255_255_255/0.45),transparent_45%)]"
        />
      </div>
    </div>
  );
}

/** Counts up from zero the first time it scrolls into view. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1100);
          setShown(Math.round(value * (1 - (1 - t) ** 4)));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    // Only count if it starts below the fold; otherwise keep the real number on screen.
    if (el.getBoundingClientRect().top > window.innerHeight) {
      raf = requestAnimationFrame(() => setShown(0));
      io.observe(el);
    }
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  );
}

/** Sets --mx/--my on whichever `[data-spot]` child the pointer is over, for a cursor spotlight. */
export function Spotlight({ className, children }: { className?: string; children: ReactNode }) {
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = (e.target as Element).closest<HTMLElement>("[data-spot]");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div className={className} onPointerMove={onMove}>
      {children}
    </div>
  );
}

/** Ghost wordmark whose letters lift one by one under the pointer. */
export function LiftLetters({ text, className }: { text: string; className?: string }) {
  return (
    <p aria-hidden className={cn("flex justify-center select-none", className)}>
      {Array.from(text).map((c, i) => (
        <span
          key={i}
          className="inline-block transition-[translate,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[9%] hover:text-[var(--ghost-hover)] hover:duration-200"
        >
          {c}
        </span>
      ))}
    </p>
  );
}
