"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/spring";
import { THEMES, THEME_EVENT, THEME_KEY, currentTheme, type Theme } from "./theme";

const subscribe = (fn: () => void) => {
  window.addEventListener(THEME_EVENT, fn);
  return () => window.removeEventListener(THEME_EVENT, fn);
};

function Swatch({ colors, className }: { colors: readonly [string, string]; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("relative inline-block overflow-hidden rounded-full ring-1 ring-ink/15", className)}
      style={{ background: colors[0] }}
    >
      <span className="absolute right-0 bottom-0 size-[60%] rounded-tl-full" style={{ background: colors[1] }} />
    </span>
  );
}

function applyTheme(next: Theme, from: DOMRect) {
  const root = document.documentElement;
  const apply = () => {
    if (next === "fog") delete root.dataset.theme;
    else root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    window.dispatchEvent(new Event(THEME_EVENT));
  };
  if (!document.startViewTransition || prefersReducedMotion()) return apply();
  const x = from.left + from.width / 2;
  const y = from.top + from.height / 2;
  root.style.setProperty("--reveal-x", `${x}px`);
  root.style.setProperty("--reveal-y", `${y}px`);
  root.style.setProperty("--reveal-r", `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`);
  document.startViewTransition(apply);
}

/** Style picker in the pill nav: a swatch button that opens the list of themes. */
export function ThemePicker() {
  const theme = useSyncExternalStore<Theme>(subscribe, currentTheme, () => "fog");
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    root.current?.querySelector<HTMLButtonElement>("[aria-checked=true]")?.focus();
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`切换风格，当前：${active.name}`}
        className="grid size-10 place-items-center rounded-full transition-transform duration-150 ease-out active:scale-[0.9]"
      >
        <Swatch colors={active.swatch} className="size-[18px]" />
      </button>

      <div
        role="radiogroup"
        aria-label="风格"
        data-goo-skip
        className={cn(
          "slab absolute top-full right-0 z-10 mt-3 w-[176px] origin-top-right rounded-[18px] p-1.5 transition-[opacity,scale,visibility] duration-150 ease-out",
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0",
        )}
      >
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={t.id === theme}
            tabIndex={open ? 0 : -1}
            onClick={(e) => {
              applyTheme(t.id, e.currentTarget.getBoundingClientRect());
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-[12px] px-2.5 py-2 text-left text-[14px] transition-[background-color,scale] duration-150 ease-out hover:bg-chip active:scale-[0.97] aria-checked:bg-chip"
          >
            <Swatch colors={t.swatch} className="size-5 shrink-0" />
            <span className="flex-1">{t.name}</span>
            {t.id === theme && <span className="size-1.5 rounded-full bg-ink" aria-hidden />}
          </button>
        ))}
      </div>
    </div>
  );
}
