import { cn } from "@/lib/utils";

export function Tagline({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "brand";
  className?: string;
}) {
  return (
    <div className={cn("flex h-[11px] items-center gap-[11px]", className)}>
      <span
        className={cn(
          "tagline-dot block size-[4px]",
          tone === "brand" ? "bg-[var(--brand)]" : "bg-[var(--paper)]",
        )}
      />
      <span
        className={cn(
          "text-[10.8px] uppercase leading-[11px] tracking-[0.08em]",
          tone === "brand" ? "text-[var(--brand)]" : "text-[var(--paper)]",
        )}
      >
        {children}
      </span>
    </div>
  );
}

const COLS = 25;
const ROWS = 6;

/**
 * Cantor8 dissolves between sections with a grid of flickering 58px squares.
 * The strip also supplies the 302px of flow spacing the original leaves between
 * its coloured sections.
 */
export function PixelTransition({ from, to }: { from: string; to: string }) {
  return (
    <div
      aria-hidden
      className="pixel-band relative h-[302px] w-[1440px] overflow-hidden"
      style={{ background: to }}
    >
      <div
        className="absolute -left-[5px] top-0 grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 58px)` }}
      >
        {Array.from({ length: COLS * ROWS }).map((_, i) => {
          const row = Math.floor(i / COLS);
          const col = i % COLS;
          const base = 1 - row / (ROWS - 1);
          const waveDelay = (col * 0.045 + row * 0.08) % 1.8;
          const flickerDur = 1.55 + ((i * 11) % 7) * 0.18;
          return (
            <span
              key={i}
              className="block h-[58px]"
              style={{ opacity: 0.18 + base * 0.82 }}
            >
              <span
                className="pixel-cell block h-full w-full"
                style={{
                  background: from,
                  animationDuration: `${flickerDur}s`,
                  animationDelay: `${waveDelay}s`,
                  ["--cell-col" as string]: String(col),
                }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}
