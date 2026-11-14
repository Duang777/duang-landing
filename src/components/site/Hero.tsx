import { profile } from "@/data/site";
import { recentArticles, siteStats } from "@/lib/posts";
import { LogoStage } from "./logo/LogoStage";
import { ArrowIcon } from "./ui";

const dot = (iso: string) => iso.replaceAll("-", ".");

export function Hero() {
  const stats = siteStats();
  const latest = recentArticles(1)[0];

  return (
    <section id="top" className="p-2.5">
      <div className="stage h-[calc(100svh-20px)] min-h-[600px]">
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-[24%] text-center text-[27vw] font-display leading-none font-bold tracking-[-0.06em] text-ghost select-none"
        >
          DUANG
        </p>

        <LogoStage className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing" />

        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-5 pt-5 font-mono text-[11px] tracking-[0.06em] text-muted-fg sm:px-8 sm:pt-7">
          <span>DUANG / 作品站</span>
          <span className="hidden sm:inline">{profile.focus}</span>
          <span>
            {stats.total} 篇 · {stats.latest.slice(0, 4)}
          </span>
        </div>

        <h1 className="sr-only">
          我是 {profile.name}，{profile.line}
        </h1>

        {latest && (
          <a
            href={latest.href}
            className="rise group absolute right-3 bottom-3 left-3 rounded-[18px] bg-pop p-4 text-pop-fg transition-transform duration-150 ease-out [--i:3] active:scale-[0.98] sm:right-6 sm:bottom-6 sm:left-auto sm:w-[290px]"
          >
            <span className="flex items-center justify-between font-mono text-[10.5px] opacity-60">
              最新 · {dot(latest.date)}
              <ArrowIcon className="size-4 opacity-75 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
            <span className="mt-2 block text-[14px] leading-[1.55]">{latest.title}</span>
          </a>
        )}

        <p className="pointer-events-none absolute bottom-7 left-8 hidden font-mono text-[10.5px] tracking-[0.06em] text-muted-fg sm:block">
          拖拽转一转 · 点一下拆开
        </p>
      </div>
    </section>
  );
}
