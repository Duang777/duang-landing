"use client";

import { useState } from "react";
import { ArrowButton } from "./ArrowButton";
import { BottleMark } from "./BottleMark";
import { Tagline } from "./Primitives";
import { footerColumns, news } from "@/data/site";

const BLOG = "https://duangblog.pages.dev";
const FOOTER_HREFS: Record<string, string> = {
  首页: `${BLOG}/`,
  文章: `${BLOG}/posts/`,
  归档: `${BLOG}/archives/`,
  标签: `${BLOG}/tags/`,
  搜索: `${BLOG}/search/`,
  关于: `${BLOG}/about/`,
  中文: `${BLOG}/`,
  English: `${BLOG}/en/`,
  "GitHub Duang777": "https://github.com/Duang777",
  "duangblog.pages.dev": `${BLOG}/`,
  "笔记站 duangblog": `${BLOG}/`,
  "本站 duang-landing": "https://duang-landing.pages.dev/",
  "Agent 项目拆解": `${BLOG}/posts/orloj-breakdown/`,
  后端专栏: `${BLOG}/posts/request-crossing/`,
  请求过境: `${BLOG}/posts/context-to-db/`,
  最新速递: `${BLOG}/posts/mcp-draft-session-handshake-removed/`,
  前端实验室: `${BLOG}/posts/webgl-particle-shader/`,
  全栈学习: `${BLOG}/posts/fullstack-learning/`,
};

export function NewsroomSection() {
  return (
    <section
      id="newsroom"
      data-header-theme="light"
      className="h-[878px] w-[1440px] bg-[var(--paper)] text-[var(--ink)]"
    >
      <div
        data-reveal="heading"
        className="c8-row flex items-end justify-between pt-[101px]"
      >
        <h2 className="font-display text-[64.8px] font-medium leading-[58.32px] tracking-[-0.02em] text-[var(--brand)]">
          更新
        </h2>
        <BottleMark
          kind="flask"
          className="mb-[6px] h-[42px] text-[var(--brand)]"
        />
      </div>

      <div className="c8-row mt-[29px] flex h-[467px] gap-[14px]">
        {news.map((item) => (
          <a
            key={item.title}
            href={item.href}
            data-reveal="card"
            className="news-card group h-[467px] w-[452px] overflow-hidden rounded-[3.6px] bg-[var(--muted)]"
          >
            <div className="news-card-visual relative mx-[14px] mt-[14px] h-[331px] w-[424px] overflow-hidden rounded-[3.6px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt=""
                className="news-card-image absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span className="news-card-open" aria-hidden>
                打开
              </span>
            </div>
            <div className="mx-[14px] mt-[14px] flex items-center gap-[8px]">
              <span className="news-pill">{item.tag}</span>
              <span className="news-pill">{item.date}</span>
            </div>
            <h3 className="mx-[14px] mt-[10px] text-[20.16px] font-medium leading-[25px] tracking-[-0.01em] text-[var(--ink)]">
              {item.title}
            </h3>
          </a>
        ))}
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section
      id="cta"
      data-header-theme="light"
      className="relative h-[1016px] w-[1440px] overflow-hidden bg-[var(--paper)] text-[var(--ink)]"
    >
      <CtaLines />
      <CtaKeywordLinks />
      <span className="cta-orbit-bottle" aria-hidden>
        <span className="cta-orbit-bottle-track">
          <BottleMark kind="vial" className="h-[27px] text-[var(--brand)]" />
        </span>
      </span>

      <div data-reveal="heading" className="c8-row relative flex pt-[94px]">
        <div>
          <Tagline tone="brand">外链</Tagline>
          <BottleMark
            kind="jar"
            className="mt-[18px] h-[40px] text-[var(--brand)]"
          />
        </div>
        <div className="ml-auto w-[692px]">
          <h2 className="w-[617px] font-display text-[64.8px] font-medium leading-[58.32px] tracking-[-0.02em] text-[var(--brand)]">
            博客
          </h2>
          <ArrowButton
            href="https://duangblog.pages.dev/"
            size="lg"
            variant="paper"
            className="mt-[17px]"
          >
            打开
          </ArrowButton>
        </div>
      </div>

      <div
        data-reveal="copy"
        className="c8-row relative mt-[618px] w-[1384px]"
      >
        <p className="w-[305px] text-[12.96px] font-medium leading-[20.2px] text-[var(--muted-fg)]">
          github.com/Duang777
        </p>
      </div>
    </section>
  );
}

const CTA_KEYWORDS = [
  { label: "Agent", href: "#experiments", left: 162, top: 390 },
  { label: "后端", href: "#columns", left: 348, top: 320 },
  { label: "前端", href: "#articles", left: 1030, top: 405 },
  { label: "全栈", href: "#experiments", left: 980, top: 670 },
] as const;

function CtaKeywordLinks() {
  return (
    <div className="pointer-events-none absolute left-0 top-[162px] z-[2] h-[713px] w-[1440px]" aria-hidden>
      {CTA_KEYWORDS.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="cta-keyword-link pointer-events-auto absolute font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--brand)]"
          style={{ left: item.left, top: item.top - 12 }}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}

function CtaLines() {
  return (
    <svg
      aria-hidden
      data-scroll-layer
      data-scroll-speed="-0.055"
      className="scroll-layer pointer-events-none absolute left-0 top-[162px] h-[713px] w-[1440px]"
      viewBox="0 0 1440 713"
      fill="none"
    >
      {Array.from({ length: 14 }).map((_, i) => (
        <ellipse
          key={i}
          cx={720}
          cy={356}
          rx={120 + i * 62}
          ry={40 + i * 24}
          className="cta-orbit"
          stroke="var(--brand)"
          strokeOpacity={0.14}
          strokeWidth={0.7}
          strokeDasharray={`${6 + (i % 3) * 4} ${14 + (i % 4) * 3}`}
          style={{ animationDelay: `${i * -0.9}s` }}
        />
      ))}
    </svg>
  );
}

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done" | "error">("idle");
  const pour = state === "done" ? 1 : Math.min(1, email.trim().length / 18);

  return (
    <footer
      id="footer"
      data-header-theme="dark"
      className="relative h-[737px] w-[1440px] bg-[var(--near-black)] text-[var(--paper)]"
    >
      <BottleMark
        kind="round"
        filled={state === "done"}
        pour={pour}
        className="absolute left-[546px] top-[74px] h-[52px] text-white/45"
      />
      <div
        data-reveal="copy"
        className="c8-row flex h-[303px] pt-[65px] [box-sizing:content-box]"
      >
        <div className="w-[484px]">
          <p className="font-display text-[33.12px] font-normal leading-[36px] tracking-[-0.02em]">
            订阅
          </p>
          <form
            className="mt-[22px] flex h-[45px] w-[484px] items-center gap-[8px]"
            onSubmit={(event) => {
              event.preventDefault();
              setState(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? "done" : "error");
            }}
          >
            <input
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (state !== "idle") setState("idle");
              }}
              placeholder="邮箱"
              className="subscribe-input h-[45px] flex-1 rounded-[2.565px] border border-white/18 bg-transparent px-[14px] text-[12.96px] outline-none placeholder:text-white/40"
            />
            <ArrowButton size="lg" variant="light">
              提交
            </ArrowButton>
          </form>
          <p className="mt-[10px] h-[16px] text-[11.2px] text-white/55">
            {state === "done" && "ok"}
            {state === "error" && "邮箱不对"}
          </p>
        </div>

        <div className="ml-auto grid w-[692px] grid-cols-2 gap-x-[86px] gap-y-[72px]">
          {footerColumns.map((column) => (
            <div key={column.title} className="w-[303px]">
              <p className="text-[10.8px] uppercase tracking-[0.08em] text-white/45">
                {column.title}
              </p>
              <ul className="mt-[12px] space-y-[6px]">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href={FOOTER_HREFS[link] ?? `${BLOG}/posts/`}
                      className="footer-link text-[12.96px] font-medium text-white/80"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="c8-row mt-[288px] flex h-[59px] items-end">
        <div className="flex w-[484px] items-end gap-[136px]">
          <span className="font-display text-[33.12px] leading-[41px] tracking-[-0.02em]">
            Duang
          </span>
          <span className="pb-[4px] text-[11.2px] text-white/45">
            blog
          </span>
        </div>
        <div className="ml-auto flex w-[692px] items-end justify-between">
          <div className="flex gap-[18px] text-[11.2px] text-white/45">
            <a href={`${BLOG}/about/`} className="footer-link text-white/45">
              关于
            </a>
            <a href={`${BLOG}/rss.xml`} className="footer-link text-white/45">
              RSS
            </a>
          </div>
          <span className="text-[12.96px] font-medium text-white/45">
            ©2026 Duang
          </span>
        </div>
      </div>
    </footer>
  );
}
