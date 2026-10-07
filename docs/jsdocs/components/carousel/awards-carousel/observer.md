# `components/carousel/awards-carousel/observer.ts`

| | |
|---|---|
| **Source** | `src/components/carousel/awards-carousel/observer.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### `setupObserver`

Autoplay only runs while ≥50% of the carousel is on screen
(threshold [0, 0.5] gives a clean two-state signal); below that or
under reduced-motion it pauses — offscreen animation would burn
frames the user can't see.

### `onResize`

Refits on container resize.

### `disableClonesFocus`

Keyboard/AT exclusion for clone slides: they're visual duplicates
that exist only for the loop illusion, so every focusable inside
them is tabindex−1 + aria-hidden — tab order and screen readers
traverse the real slides exactly once.
