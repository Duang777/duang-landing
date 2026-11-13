import { BLOG_URL, GITHUB_URL, RSS_URL } from "@/data/site";
import { siteStats } from "@/lib/posts";
import { DripLink } from "./goo/DripLink";
import { LiftLetters } from "./Interactive";
import { ArrowIcon, GithubIcon } from "./ui";

export function SiteFooter() {
  const { total } = siteStats();
  const built = new Date().toISOString().slice(0, 10).replaceAll("-", ".");

  return (
    <footer className="p-2.5 pt-10">
      <div className="stage flex min-h-[560px] flex-col items-center px-6 pt-24 text-center sm:pt-28">
        <p className="font-mono text-[11px] tracking-[0.08em] text-muted-fg">06 / 笔记站</p>
        <p className="mt-5 max-w-[16em] text-[32px] leading-[1.25] font-medium tracking-[-0.02em] sm:text-[44px]">
          {total} 篇笔记，都在笔记站。
        </p>
        <div className="mt-8">
          <DripLink href={BLOG_URL} className="h-11 pr-4 pl-5 text-[14px]">
            去笔记站
            <ArrowIcon className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </DripLink>
        </div>

        <LiftLetters
          text="DUANG"
          className="absolute inset-x-0 bottom-0 translate-y-[30%] text-[27vw] leading-none font-bold tracking-[-0.06em] text-ghost select-none"
        />

        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 px-5 pb-5 font-mono text-[11px] text-muted-fg sm:px-8 sm:pb-7">
          <span>© 2026 Duang · 文章数据取自 rss.xml，构建于 {built}</span>
          <span className="flex items-center gap-4">
            <a href={GITHUB_URL} className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-ink">
              <GithubIcon className="size-3.5" />
              GitHub
            </a>
            <a href={RSS_URL} className="transition-colors duration-150 hover:text-ink">
              RSS
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
