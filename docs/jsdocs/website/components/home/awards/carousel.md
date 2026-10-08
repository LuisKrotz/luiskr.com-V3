# `website/components/home/awards/carousel.ts`

Carousel wiring for &lt;awards-mentions&gt;: configures the

| | |
|---|---|
| **Source** | `src/website/components/home/awards/carousel.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `setupAwardsCarousel`

Builds the auto-advance loop: progress arc + timed slide transitions.

### `showAwardsProgress`

Shows the circular progress indicator for the current slide.

### `hideAwardsProgress`

Hides the progress arc (paused/hover).

### `restartAwardsProgress`

Resets the SVG progress arc so the next slide's timer animates from zero.
