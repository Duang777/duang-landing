/**
 * The page's goo filters, after goopUI's filter.ts: blur the shapes, crush alpha to a hard edge so
 * nearby blobs melt together, paint the source colour back on, then add a wet top-left rim.
 */
export function GooDefs() {
  return (
    <svg aria-hidden className="pointer-events-none absolute size-0" focusable="false">
      <defs>
        <filter id="goo" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" result="base" />
          <feOffset in="blur" dx="4" dy="4" result="down" />
          <feComposite in="blur" in2="down" operator="arithmetic" k2="1" k3="-1" result="facing" />
          <feComponentTransfer in="facing" result="specA">
            <feFuncA type="linear" slope="2.2" intercept="-0.05" />
          </feComponentTransfer>
          <feFlood floodColor="#ffffff" result="white" />
          <feComposite in="white" in2="specA" operator="in" result="spec0" />
          <feComposite in="spec0" in2="goo" operator="in" result="spec" />
          <feMerge>
            <feMergeNode in="base" />
            <feMergeNode in="spec" />
          </feMerge>
        </filter>
        {/* Tighter blur for small shapes (drips, slider), so thin parts survive the threshold. */}
        <filter id="goo-sm" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" result="base" />
          <feOffset in="blur" dx="2" dy="2" result="down" />
          <feComposite in="blur" in2="down" operator="arithmetic" k2="1" k3="-1" result="facing" />
          <feComponentTransfer in="facing" result="specA">
            <feFuncA type="linear" slope="2.2" intercept="-0.05" />
          </feComponentTransfer>
          <feFlood floodColor="#ffffff" result="white" />
          <feComposite in="white" in2="specA" operator="in" result="spec0" />
          <feComposite in="spec0" in2="goo" operator="in" result="spec" />
          <feMerge>
            <feMergeNode in="base" />
            <feMergeNode in="spec" />
          </feMerge>
        </filter>
        {/* Wide blur for the big lava-lamp blobs, so they neck and merge over long distances. */}
        <filter id="goo-lg" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -12" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" result="base" />
          <feOffset in="blur" dx="7" dy="7" result="down" />
          <feComposite in="blur" in2="down" operator="arithmetic" k2="1" k3="-1" result="facing" />
          <feComponentTransfer in="facing" result="specA">
            <feFuncA type="linear" slope="2.2" intercept="-0.05" />
          </feComponentTransfer>
          <feFlood floodColor="#ffffff" result="white" />
          <feComposite in="white" in2="specA" operator="in" result="spec0" />
          <feComposite in="spec0" in2="goo" operator="in" result="spec" />
          <feMerge>
            <feMergeNode in="base" />
            <feMergeNode in="spec" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
