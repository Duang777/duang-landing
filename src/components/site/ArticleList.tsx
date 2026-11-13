"use client";

import { useEffect, useRef, useState } from "react";
import type { Post } from "@/lib/posts";
import { frameLoop, prefersReducedMotion, springConfig, stepSpring, type Spring } from "@/lib/spring";
import { GooHighlight } from "./goo/GooHighlight";
import { ArrowIcon } from "./ui";

const FOLLOW = springConfig(0.3, 0.85);
const dot = (iso: string) => iso.replaceAll("-", ".");

/** Recent posts: a liquid hover background, and a card with the post's summary that trails the pointer. */
export function ArticleList({ posts }: { posts: Post[] }) {
  // `shown` keeps the last post so the card can fade out with its text still in it.
  const [shown, setShown] = useState<Post | null>(null);
  const [visible, setVisible] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  const follow = useRef<{ wake: () => void; target: { x: number; y: number } } | null>(null);

  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    const x: Spring = { x: 0, v: 0 };
    const y: Spring = { x: 0, v: 0 };
    const target = { x: 0, y: 0 };
    let placed = false;
    const loop = frameLoop((dt) => {
      if (!placed || reduced) {
        x.x = target.x;
        y.x = target.y;
        placed = true;
      } else {
        stepSpring(x, target.x, FOLLOW, dt);
        stepSpring(y, target.y, FOLLOW, dt);
      }
      el.style.transform = `translate3d(${x.x + 22}px, ${y.x + 18}px, 0)`;
      return Math.abs(x.x - target.x) + Math.abs(y.x - target.y) > 0.3;
    });
    follow.current = { wake: loop.wake, target };
    return () => loop.stop();
  }, []);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || !follow.current) return;
    follow.current.target.x = Math.min(e.clientX, window.innerWidth - 310);
    follow.current.target.y = e.clientY;
    follow.current.wake();
  };

  return (
    <>
      <GooHighlight blobClassName="rounded-[18px] bg-[#ebeae5]" className="slab rounded-[26px] p-2">
        <ol onPointerMove={onMove} onPointerLeave={() => setVisible(false)}>
          {posts.map((p) => (
            <li key={p.href}>
              <a
                href={p.href}
                onPointerEnter={(e) => {
                  if (e.pointerType === "touch") return;
                  setShown(p);
                  setVisible(true);
                }}
                className="group grid items-center gap-x-6 gap-y-1.5 rounded-[18px] px-4 py-4 transition-transform duration-150 ease-out active:scale-[0.99] sm:grid-cols-[96px_1fr_36px] sm:px-5 sm:py-5"
              >
                <time dateTime={p.date} className="font-mono text-[12px] text-muted-fg tabular-nums">
                  {dot(p.date)}
                </time>
                <span className="text-[16px] leading-[1.6] sm:text-[18px]">
                  {p.title}
                  {p.bilingual && (
                    <span className="ml-2 inline-block -translate-y-px rounded-full bg-fog px-1.5 font-mono text-[9.5px] leading-[16px] text-muted-fg">
                      EN
                    </span>
                  )}
                </span>
                <span className="hidden size-9 place-items-center rounded-full bg-fog text-ink transition-colors duration-200 group-hover:bg-ink group-hover:text-white sm:grid">
                  <ArrowIcon className="size-4" />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </GooHighlight>

      <div
        ref={card}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-40 hidden [@media(hover:hover)]:block"
      >
        <div
          className={`w-[280px] origin-top-left rounded-[16px] bg-ink p-4 text-white shadow-[0_18px_40px_-16px_rgb(22_22_22/0.5)] transition-[opacity,scale,filter] duration-200 ease-out ${
            visible ? "scale-100 opacity-100 blur-0" : "scale-95 opacity-0 blur-[2px]"
          }`}
        >
          {shown && (
            <>
              <p className="font-mono text-[10.5px] text-white/50">{dot(shown.date)}</p>
              <p className="mt-1.5 text-[13px] leading-[1.65] text-white/90">{shown.description}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
