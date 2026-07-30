"use client";

import { useEffect, useRef } from "react";

export function HeroPointerGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const stage = glow?.closest<HTMLElement>(".hero-stage");
    if (!glow || !stage) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      glow.style.transform = `translate3d(${x - 130}px, ${y - 130}px, 0)`;
    };

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      glow.classList.add("is-active");
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const onLeave = () => glow.classList.remove("is-active");

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={glowRef} className="hero-pointer-glow" aria-hidden />;
}
