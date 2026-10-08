# `website/components/carousel/awards-carousel/autoplay.ts`

| | |
|---|---|
| **Source** | `src/website/components/carousel/awards-carousel/autoplay.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `startAutoplay`

Starts the auto-advance ticker. Bails (and actively stops any running
cycle) under reduced-motion or before ≥50% visibility — autoplay must
never run on an unseen or motion-sensitive carousel. Re-bases the clock
on each start so a fresh cycle always gets a full dwell.
- `@param` host The AwardsCarousel element.

### `stopAutoplay`

Stops auto-advance (hover, reduced-motion, offscreen). Cancels the
pending RAF so no stray tick survives, then emits `autoplaystop` for
progress-bar listeners.
- `@param` host The AwardsCarousel element.

### `tickAutoplay`

Autoplay RAF tick — advances once `duration` has elapsed. The elapsed
calculation `now - start + accumulated` lets pause/resume continue a
partially-spent dwell instead of restarting it. `currentIndex + 1`
landing past the last real slide routes through the clone — nav.ts's
teleport then jumps back to index 0 invisibly.
- `@param` host The AwardsCarousel element.
