import { BLOG_URL, columns, featured, profile } from "@/data/site";
import { columnCount, findPost, recentArticles, siteStats, writingLog } from "@/lib/posts";
import { ArticleList } from "./ArticleList";
import { CountUp, Spotlight, Tilt } from "./Interactive";
import { LogoMark } from "./logo/LogoMark";
import { ArrowIcon, SectionTitle } from "./ui";
import { WritingLog } from "./WritingLog";

const dot = (iso: string) => iso.replaceAll("-", ".");

function Shell({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-[1120px] px-4 py-20 sm:px-8 md:py-28">
      {children}
    </section>
  );
}

export function IntroSection() {
  const stats = siteStats();
  const numbers = [
    { value: stats.total, label: "篇笔记" },
    { value: stats.bilingual, label: "篇中英双语" },
    { value: stats.activeDays, label: "天有更新" },
  ];
  return (
    <section id="about" className="mx-auto max-w-[960px] px-5 pt-28 pb-16 text-center sm:px-8 md:pt-40">
      <p className="font-mono text-[11px] tracking-[0.08em] text-muted-fg">01 / 关于</p>
      <p className="mt-8 font-display text-[34px] leading-[1.45] font-medium sm:text-[52px] md:text-[64px]">
        我是
        <span className="slab group mr-0.5 ml-2 inline-flex -translate-y-[0.08em] items-center gap-[0.22em] rounded-full py-[0.1em] pr-[0.42em] pl-[0.3em] align-middle text-[0.82em] leading-none tracking-[-0.03em] transition-[scale] duration-300 ease-out hover:scale-[1.04]">
          <LogoMark split className="size-[0.78em]" />
          {profile.name}
        </span>
        ，{profile.line}
      </p>
      <dl className="mx-auto mt-16 grid max-w-[720px] grid-cols-3 gap-4 md:mt-24">
        {numbers.map((n) => (
          <div key={n.label}>
            <dd className="font-display text-[44px] leading-none font-light tracking-[-0.04em] tabular-nums sm:text-[72px]">
              <CountUp value={n.value} />
            </dd>
            <dt className="mt-3 font-mono text-[11px] text-muted-fg">{n.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ArticlesSection() {
  return (
    <Shell id="articles">
      <SectionTitle index="02" label="RECENT" title="最近在写">
        <a
          href={`${BLOG_URL}posts/`}
          className="group hidden items-center gap-1 font-mono text-[12px] text-muted-fg transition-colors duration-150 hover:text-ink sm:inline-flex"
        >
          全部 {siteStats().total} 篇
          <ArrowIcon className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </SectionTitle>
      <ArticleList posts={recentArticles(8)} />
    </Shell>
  );
}

export function LabSection() {
  return (
    <Shell id="lab">
      <SectionTitle index="03" label="SELECTED" title="精选" />
      <div className="grid gap-5 md:grid-cols-3">
        {featured.map((f) => {
          const post = findPost(f.href);
          return (
            <a
              key={f.href}
              href={f.href}
              className="group block transition-transform duration-150 ease-out active:scale-[0.98]"
            >
              <Tilt className="slab overflow-hidden rounded-[22px] p-2 transition-shadow duration-300 group-hover:[box-shadow:var(--slab-lift)]">
                {/* eslint-disable-next-line @next/next/no-img-element -- static export serves images as-is */}
                <img
                  src={f.image}
                  alt=""
                  width={1200}
                  height={900}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-[15px] object-cover"
                />
              </Tilt>
              <p className="mt-4 flex gap-2 px-1 font-mono text-[11px] text-muted-fg">
                <span className="text-ink">{f.tag}</span>
                {post && <time dateTime={post.date}>{dot(post.date)}</time>}
              </p>
              <h3 className="mt-1.5 px-1 text-[17px] leading-[1.55] font-medium">{f.title}</h3>
            </a>
          );
        })}
      </div>
    </Shell>
  );
}

export function ColumnsSection() {
  return (
    <Shell id="columns">
      <SectionTitle index="04" label="COLUMNS" title="专栏" />
      <Spotlight className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {columns.map((c, i) => {
          const count = columnCount(c.series);
          return (
            <a
              key={c.href}
              href={c.href}
              data-spot
              className="slab group relative isolate flex flex-col overflow-hidden rounded-[22px] p-6 transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:[box-shadow:var(--slab-lift)] active:scale-[0.98] sm:min-h-[210px]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(280px_circle_at_var(--mx,50%)_var(--my,50%),rgb(22_22_22/0.07),transparent_70%)]"
              />
              <span className="flex items-center justify-between font-mono text-[11px] text-muted-fg">
                {String(i + 1).padStart(2, "0")}
                <span className="rounded-full bg-chip px-2 py-0.5">
                  {count ? `已更 ${count} 篇` : "专栏入口"}
                </span>
              </span>
              <h3 className="mt-auto pt-8 font-display text-[21px] font-medium tracking-[-0.01em]">{c.name}</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-muted-fg">{c.blurb}</p>
            </a>
          );
        })}
      </Spotlight>
    </Shell>
  );
}

export function LogSection() {
  const stats = siteStats();
  return (
    <Shell id="log">
      <SectionTitle index="05" label="WRITING LOG" title="写作记录">
        <span className="hidden font-mono text-[12px] text-muted-fg sm:inline">
          {dot(stats.first)} — 今天
        </span>
      </SectionTitle>
      <div className="slab overflow-hidden rounded-[26px]">
        <WritingLog log={writingLog(new Date())} />
      </div>
    </Shell>
  );
}
