"use client";

import { useMemo, useState } from "react";
import type { LogDay, WritingLog as Log } from "@/lib/posts";
import { cn } from "@/lib/utils";
import { GooSlider } from "./goo/GooSlider";

const WEEKDAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

const level = (n: number) =>
  n === 0 ? "bg-heat-0" : n === 1 ? "bg-heat-1" : n === 2 ? "bg-heat-2" : "bg-heat-3";

export function WritingLog({ log }: { log: Log }) {
  const latest = useMemo(
    () => log.weeks.flat().filter((d): d is NonNullable<LogDay> => !!d?.posts.length).at(-1),
    [log],
  );
  const days = useMemo(() => log.weeks.flat().filter((d): d is NonNullable<LogDay> => !!d), [log]);
  const [active, setActive] = useState(latest?.date);
  const day = days.find((d) => d.date === active) ?? latest;
  const cols = log.weeks.length;
  const index = Math.max(0, days.findIndex((d) => d.date === day?.date));

  return (
    <div className="grid md:grid-cols-[1fr_300px]">
      <div className="px-5 py-6 sm:px-7">
        <div className="grid grid-cols-[22px_1fr] gap-x-2">
          <div />
          <div
            className="relative mb-1.5 h-3 font-mono text-[10px] leading-none text-muted-fg"
            aria-hidden
          >
            {log.months.map((m) => (
              <span
                key={`${m.week}-${m.label}`}
                className="absolute"
                style={{ left: `${(m.week / cols) * 100}%` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="grid grid-rows-7 gap-[3px] font-mono text-[9px] leading-none text-muted-fg" aria-hidden>
            {WEEKDAYS.map((w, i) => (
              <span key={w} className="flex items-center">
                {i % 2 === 0 ? w.slice(1) : ""}
              </span>
            ))}
          </div>

          <div
            className="grid grid-flow-col grid-rows-7 gap-[3px]"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {log.weeks.flat().map((d, i) =>
              !d ? (
                <span key={i} />
              ) : d.posts.length ? (
                <button
                  key={d.date}
                  type="button"
                  aria-label={`${d.date}，${d.posts.length} 篇`}
                  onMouseEnter={() => setActive(d.date)}
                  onFocus={() => setActive(d.date)}
                  onClick={() => setActive(d.date)}
                  className={cn(
                    "aspect-square rounded-[3px] outline-offset-1 transition-[scale] duration-100 ease-out active:scale-90",
                    level(d.posts.length),
                    d.date === day?.date && "outline-2 outline-ink",
                  )}
                />
              ) : (
                <span
                  key={d.date}
                  onMouseEnter={() => setActive(d.date)}
                  className={cn(
                    "aspect-square rounded-[3px] bg-heat-0",
                    d.date === day?.date && "outline outline-offset-1 outline-ink/30",
                  )}
                />
              ),
            )}
          </div>
        </div>

        <div className="mt-6 pl-[30px]">
          <GooSlider
            count={days.length}
            value={index}
            onChange={(i) => setActive(days[i]?.date)}
            label="按天浏览写作记录"
            valueText={day ? `${day.date}，${day.posts.length} 篇` : ""}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-1.5 font-mono text-[10px] text-muted-fg" aria-hidden>
          <span>拖动滑块，按天看</span>
          <span className="flex items-center gap-1.5">
          少
          {[0, 1, 2, 3].map((n) => (
            <span key={n} className={cn("size-2.5 rounded-[3px]", level(n))} />
          ))}
          多
          </span>
        </div>
      </div>

      <div className="border-t border-line px-5 py-6 sm:px-7 md:border-t-0 md:border-l" aria-live="polite">
        {day && (
          <>
            <p className="font-mono text-[11px] text-muted-fg">
              {WEEKDAYS[(new Date(day.date).getUTCDay() + 6) % 7]} · {day.posts.length} 篇
            </p>
            <p className="mt-1 font-mono text-[22px] tracking-[-0.02em] tabular-nums">
              {day.date.replaceAll("-", ".")}
            </p>
            {day.posts.length ? (
              <ul className="mt-3 space-y-2.5">
                {day.posts.map((p) => (
                  <li key={p.href}>
                    <a
                      href={p.href}
                      className="text-[13.5px] leading-[1.6] underline decoration-ink/20 underline-offset-4 transition-colors duration-150 hover:decoration-ink"
                    >
                      {p.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[13.5px] text-muted-fg">这天没写。</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
