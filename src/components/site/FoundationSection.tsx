import { ArrowButton } from "./ArrowButton";
import { BottleMark } from "./BottleMark";
import { Tagline } from "./Primitives";
import { ShrimpFlow } from "./ShrimpFlow";
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
      <FoundationBlock />
      <PartnersBlock />
    </section>
  );
}

function FoundationBlock() {
  return (
    <div className="foundation-band relative z-[2] h-[1093px] overflow-visible">
      <ShrimpFlow />
      <div className="relative z-[2]">
        <div className="c8-row pt-[191px]">
          <Tagline>关于</Tagline>
          <h2
            data-reveal="heading"
            className="mt-[32px] w-[690px] font-display text-[72px] font-normal leading-[72px] tracking-[-0.02em]"
          >
            笔记本
          </h2>
        </div>

        <div className="c8-row mt-[244px]">
          <div data-reveal="copy" className="ml-[761px] w-[415px]">
            <p className="w-[376px] text-[33.12px] font-normal leading-[33.12px] tracking-[-0.01em]">
              拆项目，跟实现，记坑。
            </p>
            <p className="mt-[13px] w-[376px] text-[12.96px] font-medium leading-[20.2px] text-[color-mix(in_oklab,var(--paper)_78%,transparent)]">
              全栈。偶尔写 Agent。更新不勤。
            </p>
            <ArrowButton
              href="https://duangblog.pages.dev/about/"
              size="lg"
              variant="light"
              className="mt-[22px]"
            >
              关于
            </ArrowButton>
          </div>
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

function PartnersBlock() {
  return (
    <div id="columns" className="relative z-[2] h-[1165px]">
      <div className="c8-row pt-[190px] text-center">
        <h2
          data-reveal="heading"
          className="mx-auto w-[439px] font-display text-[64.8px] font-normal leading-[64.8px] tracking-[-0.02em]"
        >
          栏目
        </h2>
      </div>

      <div className="c8-row relative mt-[124px] h-[428px]">
        {partners.map((item, i) => {
          const slot = PARTNER_SLOTS[i];
          return (
            <a
              key={item.name}
              href={item.href}
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
                {item.name}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

