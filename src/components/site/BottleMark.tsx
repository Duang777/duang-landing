type BottleKind = "jar" | "flask" | "vial" | "round";

export function BottleMark({
  kind = "jar",
  label,
  className = "",
  filled = false,
}: {
  kind?: BottleKind;
  label?: string;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-end gap-[7px] ${filled ? "is-bottle-filled" : ""} ${className}`}
    >
      <svg
        viewBox="0 0 40 60"
        className="bottle-mark h-full w-auto overflow-visible"
        aria-hidden
      >
        {kind === "jar" && (
          <>
            <rect x="14" y="5" width="12" height="5" rx="1" fill="currentColor" opacity=".58" />
            <rect x="12" y="9" width="16" height="4" rx="1" fill="currentColor" opacity=".84" />
            <path
              d="M12 20C10 21 9 24 9 27V47C9 54 13 57 20 57C27 57 31 54 31 47V27C31 24 30 21 28 20C27 16 24 14 20 14C16 14 13 16 12 20Z"
              fill="currentColor"
              fillOpacity=".06"
              stroke="currentColor"
              strokeOpacity=".62"
            />
            <path className="bottle-mark-liquid" d="M9.5 39H30.5V48C30.5 53 27 56 20 56C13 56 9.5 53 9.5 48Z" fill="currentColor" opacity=".48" />
            <path className="bottle-mark-liquid-full" d="M9.5 24H30.5V48C30.5 53 27 56 20 56C13 56 9.5 53 9.5 48Z" fill="currentColor" opacity=".62" />
          </>
        )}
        {kind === "flask" && (
          <>
            <rect x="15" y="5" width="10" height="6" rx="1" fill="currentColor" opacity=".72" />
            <path
              d="M16 11H24L25 25C31 33 34 40 34 48C34 55 29 58 20 58C11 58 6 55 6 48C6 40 9 33 15 25Z"
              fill="currentColor"
              fillOpacity=".06"
              stroke="currentColor"
              strokeOpacity=".62"
            />
            <path className="bottle-mark-liquid" d="M7 43C12 40 28 40 33 43V49C33 54 28 57 20 57C12 57 7 54 7 49Z" fill="currentColor" opacity=".48" />
            <path className="bottle-mark-liquid-full" d="M8 28C14 25 26 25 32 28V49C32 54 28 57 20 57C12 57 8 54 8 49Z" fill="currentColor" opacity=".62" />
          </>
        )}
        {kind === "vial" && (
          <>
            <rect x="11" y="5" width="18" height="6" rx="1" fill="currentColor" opacity=".72" />
            <rect x="13" y="11" width="14" height="4" rx="1" fill="currentColor" opacity=".45" />
            <path
              d="M12 18H28V51C28 55 26 57 22 57H18C14 57 12 55 12 51Z"
              fill="currentColor"
              fillOpacity=".06"
              stroke="currentColor"
              strokeOpacity=".62"
            />
            <path className="bottle-mark-liquid" d="M13 37H27V51C27 54 25 56 22 56H18C15 56 13 54 13 51Z" fill="currentColor" opacity=".48" />
            <path className="bottle-mark-liquid-full" d="M13 22H27V51C27 54 25 56 22 56H18C15 56 13 54 13 51Z" fill="currentColor" opacity=".62" />
          </>
        )}
        {kind === "round" && (
          <>
            <rect x="15" y="5" width="10" height="7" rx="1" fill="currentColor" opacity=".72" />
            <path
              d="M16 12H24L25 22C31 26 34 33 34 42C34 52 28 58 20 58C12 58 6 52 6 42C6 33 9 26 15 22Z"
              fill="currentColor"
              fillOpacity=".06"
              stroke="currentColor"
              strokeOpacity=".62"
            />
            <path className="bottle-mark-liquid" d="M7 43C13 40 27 40 33 43C33 52 28 57 20 57C12 57 7 52 7 43Z" fill="currentColor" opacity=".48" />
            <path className="bottle-mark-liquid-full" d="M7 28C13 24 27 24 33 28C33 48 28 57 20 57C12 57 7 48 7 28Z" fill="currentColor" opacity=".62" />
          </>
        )}
        <path d="M13 25V43" stroke="currentColor" strokeOpacity=".38" strokeWidth="1.4" strokeLinecap="round" />
        <circle className="bottle-mark-bubble bottle-mark-bubble-1" cx="17" cy="46" r="1.2" fill="currentColor" opacity="0" />
        <circle className="bottle-mark-bubble bottle-mark-bubble-2" cx="23" cy="49" r="0.9" fill="currentColor" opacity="0" />
      </svg>
      {label && (
        <span className="bottle-mark-caption pb-[4px] font-mono text-[8px] uppercase leading-[11px] tracking-[0.1em] opacity-55">
          {label}
        </span>
      )}
    </span>
  );
}
