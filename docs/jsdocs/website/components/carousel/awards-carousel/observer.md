# `website/components/carousel/awards-carousel/observer.ts`

| | |
|---|---|
| **Source** | `src/website/components/carousel/awards-carousel/observer.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `setupObserver`

Autoplay only runs while ≥50% of the carousel is on screen
(threshold [0, 0.5] gives a clean two-state signal); below that or
under reduced-motion it pauses — offscreen animation would burn
frames the user can't see. When IntersectionObserver itself is
absent (very old engines, some test DOMs) the carousel degrades to
always-visible so content still shows.
- `@param` host The AwardsCarousel element.

### `onResize`

Refits on container resize — instant re-jump to the current index since
slide geometry changed; smooth scroll would animate to a stale offset.
- `@param` host The AwardsCarousel element.

### `disableClonesFocus`

Keyboard/AT exclusion for clone slides: they're visual duplicates
that exist only for the loop illusion, so every focusable inside
them is tabindex−1 + aria-hidden — tab order and screen readers
traverse the real slides exactly once. Re-run after every render since
clones are re-created with the DOM.
- `@param` host The AwardsCarousel element.
