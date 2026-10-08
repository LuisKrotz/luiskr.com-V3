# `components/home/awards/carousel.ts`

Carousel wiring for &lt;awards-mentions&gt;: configures the

| | |
|---|---|
| **Source** | `website/components/home/awards/carousel.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### `setupAwardsCarousel`

Builds the auto-advance loop: progress arc + timed slide transitions.

### `showAwardsProgress`

Shows the circular progress indicator for the current slide.

### `hideAwardsProgress`

Hides the progress arc (paused/hover).

### `restartAwardsProgress`

Resets the SVG progress arc so the next slide's timer animates from zero.
