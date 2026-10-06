# `components/carousel/custom-carousel/nav.ts`

Navigation engine for CustomCarousel — goTo/prev/next/dot

| | |
|---|---|
| **Source** | `src/components/carousel/custom-carousel/nav.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### `isNearCenter`

Clone-teleport detector: a slide counts as "parked" when its horizontal
center is within 10px of the track's center — loose enough to catch
sub-pixel scroll stops, tight enough not to fire mid-swipe.
