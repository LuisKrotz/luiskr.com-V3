# `components/carousel/custom-carousel/nav.ts`

Navigation engine for CustomCarousel — goTo/prev/next/dot

| | |
|---|---|
| **Source** | `src/components/carousel/custom-carousel/nav.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### `calcSlideCenterOffset`

Computes the scrollLeft that centers `slide` inside `track` —
slide.offsetCenter minus the visible half-track. Returns null when either
element reports zero width (not yet laid out → caller should bail).
- `@param` {Element} track — the scrollable slides track
- `@param` {Element} slide — the slide to center
- `@returns` {number | null} target scrollLeft, or null when unmeasurable

### `isNearCenter`

Clone-teleport detector: a slide counts as "parked" when its horizontal
center is within 10px of the track's center — loose enough to catch
sub-pixel scroll stops, tight enough not to fire mid-swipe.

### `markAdjacentLoaded`

marks adjacent loaded.
- `@param` c — the component
- `@param` centerIdx — the value

### `carouselGoTo`

The carouselGoTo value.
- `@param` c — the component
- `@param` idx — the index

### `updateActiveClasses`

Updates active classes.
- `@param` c — the component

### `scrollToElement`

scrolls to element.
- `@param` c — the component
- `@param` el — the element

### `scheduleTeleport`

Schedules teleport.
- `@param` c — the component
- `@param` targetIdx — the value

### `scrollToSlide`

scrolls to slide.
- `@param` c — the component
- `@param` idx — the index

### `jumpToSlide`

jumps to slide.
- `@param` c — the component
- `@param` idx — the index
- `@param` smooth — the value

### `carouselOnScroll`

The carouselOnScroll value.
- `@param` c — the component

### `checkInfiniteLoop`

Checks infinite loop.
- `@param` c — the component

### `carouselOnPrevClick`

The carouselOnPrevClick value.
- `@param` c — the component

### `carouselOnNextClick`

The carouselOnNextClick value.
- `@param` c — the component

### `carouselOnDotClick`

The carouselOnDotClick value.
- `@param` c — the component
- `@param` idx — the index

### `setupIntersectionObserver`

setups intersection observer.
- `@param` c — the component
