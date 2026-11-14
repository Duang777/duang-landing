import { BLOG_URL, nav } from "@/data/site";
import { DripLink } from "./goo/DripLink";
import { GooHighlight } from "./goo/GooHighlight";
import { LogoMark } from "./logo/LogoMark";
import { ThemePicker } from "./ThemePicker";
import { ArrowIcon } from "./ui";

const link =
  "rounded-full px-3 py-2 font-mono text-[11.5px] tracking-[0.06em] text-ink/70 transition-colors duration-150 hover:text-ink";

/** Frosted pill that starts at the centre of the hero and sticks to the top once it gets there. */
export function PillNav() {
  const [left, right] = [nav.slice(0, 2), nav.slice(2)];
  return (
    <nav
      aria-label="页面导航"
      className="pointer-events-auto sticky top-3 mx-auto mt-[calc(50svh-28px)] h-14 w-[min(640px,calc(100%-24px))] nav-glass rounded-full px-2 backdrop-blur-xl backdrop-saturate-150"
    >
      <GooHighlight
        axis="x"
        blobClassName="rounded-full bg-nav-hl"
        className="h-full"
        innerClassName="flex h-full items-center justify-between"
      >
        <div className="hidden items-center sm:flex">
          {left.map((item) => (
            <a key={item.href} href={item.href} className={link}>
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#top"
          className="group flex items-center gap-2 rounded-full px-3 py-2 transition-transform duration-150 ease-out active:scale-[0.96] sm:absolute sm:left-1/2 sm:-translate-x-1/2"
        >
          <LogoMark split className="size-[18px]" />
          <span className="text-[19px] font-semibold tracking-[-0.03em]">Duang</span>
        </a>

        <div className="flex items-center gap-1">
          {right.map((item) => (
            <a key={item.href} href={item.href} className={`${link} hidden sm:inline-flex`}>
              {item.label}
            </a>
          ))}
          <ThemePicker />
          <DripLink href={BLOG_URL} className="h-10 pr-3 pl-4 text-[13px]">
            笔记站
            <ArrowIcon className="size-3.5" />
          </DripLink>
        </div>
      </GooHighlight>
    </nav>
  );
}
