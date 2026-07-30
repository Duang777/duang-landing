import { ArrowButton } from "./ArrowButton";
import { BottleMark } from "./BottleMark";
import { Tagline } from "./Primitives";
import { partners } from "@/data/site";

/**
 * Cantor8 keeps Foundation and Partners inside one 2258px band on the brand field.
 */
export function FoundationSection() {
  return (
    <section
      id="about"
      data-header-theme="dark"
      className="relative w-[1440px] overflow-hidden bg-[var(--brand)] text-[var(--paper)]"
    >
      <FlowLines />
      <FoundationBlock />
      <PartnersBlock />
    </section>
  );
}

function FoundationBlock() {
  return (
    <div className="relative h-[1093px]">
      <div className="c8-row pt-[191px]">
        <Tagline>关于这个博客</Tagline>
        <h2
          data-reveal="heading"
          className="mt-[32px] w-[690px] font-display text-[72px] font-normal leading-[72px] tracking-[-0.02em]"
        >
          把一条技术链路拆开讲清楚
        </h2>
      </div>

      <div className="c8-row mt-[244px]">
        <div data-reveal="copy" className="ml-[761px] w-[415px]">
          <p className="w-[376px] text-[33.12px] font-normal leading-[33.12px] tracking-[-0.01em]">
            从真实问题出发，一路跟到代码和运行时。
          </p>
          <p className="mt-[13px] w-[376px] text-[12.96px] font-medium leading-[20.2px] text-[color-mix(in_oklab,var(--paper)_78%,transparent)]">
            这里是 Duang 的公开笔记本。我会拆 Agent 项目，也会沿一次
            HTTP 请求去看服务端机制，再把前端实验和全栈落地时踩过的坑写下来。
          </p>
          <ArrowButton
            href="https://duangblog.pages.dev/about/"
            size="lg"
            variant="light"
            className="mt-[22px]"
          >
            关于 Duang
          </ArrowButton>
        </div>
      </div>
    </div>
  );
}

/** x-offset and y-offset inside the 1384x428 partner grid, taken from the original. */
const PARTNER_SLOTS = [
  { x: 0, y: 148 },
  { x: 233, y: 148 },
  { x: 466, y: 0 },
  { x: 699, y: 148 },
  { x: 932, y: 148 },
  { x: 1165, y: 148 },
  { x: 466, y: 295 },
  { x: 932, y: 295 },
];
const PARTNER_BOTTLES = ["vial", "jar", "flask", "round", "jar", "vial", "round", "flask"] as const;
const PARTNER_TIPS = [
  "顺着真实 Agent 循环拆",
  "从请求进进程开始看",
  "一次 HTTP 的过境笔记",
  "最近读过、踩过的点",
  "能直接操作的前端实验",
  "从接口到页面落地",
  "构建、发布、排查路径",
  "还没写成文章的念头",
] as const;

function PartnersBlock() {
  return (
    <div id="columns" className="relative h-[1165px]">
      <div className="c8-row pt-[190px] text-center">
        <h2
          data-reveal="heading"
          className="mx-auto w-[439px] font-display text-[64.8px] font-normal leading-[64.8px] tracking-[-0.02em]"
        >
          我在持续写的主题
        </h2>
        <p className="mx-auto mt-[18px] w-[421px] text-[12.96px] font-medium leading-[20.2px] text-[color-mix(in_oklab,var(--paper)_78%,transparent)]">
          Agent 项目拆解、后端机制、前端实验和全栈学习。更新不追求频率，
          只尽量把一个问题写到能用于下一次排查和实现。
        </p>
      </div>

      <div className="c8-row relative mt-[124px] h-[428px]">
        {partners.map((name, i) => {
          const slot = PARTNER_SLOTS[i];
          return (
            <div
              key={name}
              data-reveal="card"
              className="topic-card group absolute flex h-[133px] w-[219px] items-center justify-center border border-[color-mix(in_oklab,var(--paper)_16%,transparent)] bg-[color-mix(in_oklab,var(--paper)_5%,transparent)]"
              style={{ left: slot.x, top: slot.y }}
            >
              <span className="absolute left-[16px] top-[14px] font-mono text-[9px] text-[color-mix(in_oklab,var(--paper)_42%,transparent)]">
                0{i + 1}
              </span>
              <BottleMark
                kind={PARTNER_BOTTLES[i]}
                className="absolute right-[12px] top-[9px] h-[28px] text-[color-mix(in_oklab,var(--paper)_62%,transparent)]"
              />
              <span className="w-[187px] text-center text-[16px] font-medium tracking-[-0.02em]">
                {name}
              </span>
              <span className="topic-card-tip font-mono">
                {PARTNER_TIPS[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FlowLines() {
  return (
    <svg
      aria-hidden
      data-scroll-layer
      data-scroll-speed="0.07"
      className="scroll-layer pointer-events-none absolute left-0 top-[320px] h-[686px] w-[1440px] opacity-[0.28]"
      viewBox="0 0 1440 686"
      fill="none"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <path
          key={i}
          d={`M-40 ${40 + i * 74} C 320 ${-40 + i * 88}, 780 ${300 + i * 44}, 1480 ${120 + i * 62}`}
          className="flow-line"
          stroke="var(--paper)"
          strokeOpacity={0.22}
          strokeWidth={0.7}
          strokeDasharray="7 13"
          style={{ animationDelay: `${i * -0.7}s` }}
        />
      ))}
    </svg>
  );
}
