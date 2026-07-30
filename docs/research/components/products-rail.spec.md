# Products Rail Specification

## Overview
- Target file: `src/components/site/ProductsSection.tsx`
- Reference: `https://www.cantor8.io/?ref=land-book.com`
- Viewport: 1440 × 900
- Interaction model: vertical scroll drives a sticky horizontal rail

## Measured Reference Geometry
- Section: 1440 × 4365px
- Sticky stage: 1440 × 813px
- Source card at focus: approximately 376 × 438px
- Source card horizontal step: approximately 438px
- Source vertical offsets: 0, +100, 0, -120, 0, +100, 0
- Cards to the left of the focus lane remain full size.
- Cards approaching from the right scale up progressively.
- Rail travel is approximately 0.75px horizontally per 1px vertical scroll.

## Customized Clone Direction
The user explicitly prefers the cards to feel larger and overlap more than the
source. Preserve the source's one-sided depth behavior while applying:
- Card size: 460 × 535px
- Horizontal step: 412px
- Physical overlap: 48px
- Active/left cards: scale 1
- Incoming right cards: scale from 0.72 to 1
- Nearest card gets the highest stacking order
- Transition remains scroll-driven with inertial interpolation

## States
- Before focus: smaller, lower opacity, behind nearer cards.
- At focus: full size, full opacity, top stacking order.
- After focus: remains full size while exiting left.
- Hover: card lifts slightly without changing rail geometry.

## Verification
- At 1440px, at least three cards are partially visible.
- Adjacent cards overlap by about 48px.
- Cards never shrink after crossing the focus lane.
- No horizontal page overflow.
