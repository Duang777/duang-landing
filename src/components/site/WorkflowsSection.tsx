"use client";

import { useEffect } from "react";
import { workflows } from "@/data/site";
import { BottleMark } from "./BottleMark";
import { subscribeScrollFrame } from "@/lib/scroll-frame";

/**
 * Right-aligned boxes of varying width step inward down the section; every box
 * ends on the 1412px gutter and carries a 358px text column.
 */
const BOXES = [
  { top: 525, width: 623 },
  { top: 1022, width: 1107 },
  { top: 1359, width: 830 },
  { top: 1696, width: 1107 },
];
const WORKFLOW_BOTTLES = ["vial", "jar", "flask", "round"] as const;

export function WorkflowsSection() {
  useEffect(() => {
    const rows = Array.from(document.querySelectorAll<HTMLElement>(".workflow-row"));
    if (!rows.length) return;
    let renderedActive = -1;

    return subscribeScrollFrame(({ viewportHeight }) => {
      const targetY = viewportHeight * 0.45;
      let best = 0;
      let distance = Number.POSITIVE_INFINITY;
      rows.forEach((row, i) => {
        const rect = row.getBoundingClientRect();
        const mid = rect.top + rect.height * 0.35;
        const next = Math.abs(mid - targetY);
        if (next < distance) {
          best = i;
          distance = next;
        }
      });
      if (best === renderedActive) return;
      renderedActive = best;
      rows.forEach((row, i) => row.classList.toggle("is-active", i === best));
    });
  }, []);

  return (
    <section
      id="experiments"
      data-header-theme="dark"
      className="relative h-[2290px] w-[1440px] overflow-hidden bg-[var(--brand)] text-[var(--paper)]"
    >
      <div className="c8-row pt-[191px]">
        <h2
          data-reveal="heading"
          className="font-display text-[72px] font-normal leading-[72px] tracking-[-0.02em]"
        >
          我会持续写这些
          <br />
          技术主题
        </h2>
      </div>

      {workflows.map((item, i) => {
        const box = BOXES[i];
        return (
          <div
            key={item.title}
            data-reveal="row"
            className="workflow-row absolute right-[28px] border-t border-[color-mix(in_oklab,var(--paper)_22%,transparent)] pt-[20px]"
            style={{
              top: box.top,
              width: box.width,
              ["--workflow-signal-distance" as string]: `${Math.min(box.width - 20, 420)}px`,
            }}
          >
            <span className="absolute -top-[4px] right-0 block size-[7px] bg-[var(--paper)]" />
            <div className="flex items-start justify-between">
              <div className="ml-[20px] w-[358px]">
                <h3 className="text-[40.32px] font-normal leading-[44.352px] tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="mt-[12px] text-[12.96px] font-medium leading-[20.2px] text-[color-mix(in_oklab,var(--paper)_78%,transparent)]">
                  {item.body}
                </p>
              </div>
              <div className="flex items-start gap-[12px] text-[color-mix(in_oklab,var(--paper)_60%,transparent)]">
                <BottleMark kind={WORKFLOW_BOTTLES[i]} className="h-[38px]" />
                <span className="pt-[2px] font-mono text-[10.8px] tracking-[0.1em]">
                  0{i + 1}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
