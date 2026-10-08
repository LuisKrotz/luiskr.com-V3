/**
 * @file carousel-nav.ts
 * @description Navigation engine for CustomCarousel — goTo/prev/next/dot
 * entry points, clone-teleport infinite loop, scroll-handler teleport
 * detection, adjacent-slide lazy loading, and the IntersectionObserver
 * that gates autoplay on viewport visibility.
 */

import { CAROUSEL_CLASSES } from '@core/tokens/classes/carousel.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { CAROUSEL_SELECTORS } from '@core/tokens/selectors/carousel.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import store from '@core/store.js'
import type { CarouselLang } from './render.js'
import type { CustomCarousel } from '../CustomCarousel.js'
import { CAROUSEL_LAYOUT, CAROUSEL_TIMING } from '@core/tokens/motion/carousel.js'

/**
 * Computes the scrollLeft that centers `slide` inside `track` —
 * slide.offsetCenter minus the visible half-track. Returns null when either
 * element reports zero width (not yet laid out → caller should bail).
 * @param {Element} track — the scrollable slides track
 * @param {Element} slide — the slide to center
 * @returns {number | null} target scrollLeft, or null when unmeasurable
 */
const calcSlideCenterOffset = (track: Element, slide: Element): number | null => {
  const trackRect = track.getBoundingClientRect()

  const slideRect = slide.getBoundingClientRect()

  if (!trackRect.width || !slideRect.width) return null

  return (
    track.scrollLeft + slideRect.left - trackRect.left - (trackRect.width - slideRect.width) / 2
  )
}

/**
 * Clone-teleport detector: a slide counts as "parked" when its horizontal
 * center is within CENTER_EPS_PX of the track's center — loose enough to
 * catch sub-pixel scroll stops, tight enough not to fire mid-swipe.
 */
const isNearCenter = (childRect: DOMRect, center: number): boolean =>
  Math.abs(childRect.left + childRect.width / 2 - center) < CAROUSEL_LAYOUT.CENTER_EPS_PX

/**
 * Lazy-load window: flags slides within 2 ring positions of `centerIdx`
 * as loadable so their media src gets assigned. Distance is measured on
 * the ring — `min(|i−center|, len−|i−center|)` — so hovering at index 0
 * pre-loads the tail and vice versa. The two explicit edge lines cover
 * len<3 where ring distance alone under-marks.
 * @param c The CustomCarousel element.
 * @param centerIdx Active slide index.
 */
export function markAdjacentLoaded(c: CustomCarousel, centerIdx: number) {
  const len = c.items.length

  if (!len) return

  for (let i = 0; i < len; i++) {
    const direct = Math.abs(i - centerIdx)

    const wrapped = len - direct

    if (Math.min(direct, wrapped) <= 2) {
      c.slideLoaded[i] = true
    }
  }

  if (centerIdx === 0) c.slideLoaded[len - 1] = true

  if (centerIdx === len - 1) c.slideLoaded[0] = true
}

/**
 * Navigate to slide idx — accepts out-of-range idx (idx<0 or idx≥len) by
 * scrolling to the CLONE slide at that edge, then scheduling an instant
 * teleport to its real twin (the infinite-loop illusion). Also lazy-loads
 * the new neighborhood and triggers `loadHighRes` on the active
 * <media-figure> so the target slide upgrades immediately rather than on
 * the next intersection tick. The double-modulo normalizes idx into
 * [0,len) — a single % yields −1 for negative input.
 * @param c The CustomCarousel element.
 * @param idx Target index — may be −1 or len for edge wraps.
 */
export function carouselGoTo(c: CustomCarousel, idx: number) {
  const len = c.items.length

  if (!len) return

  const newIndex = ((idx % len) + len) % len

  c.currentIndex = newIndex

  c._markAdjacentLoaded(newIndex)

  c._updateActiveClasses()

  const slides = c.$$(CAROUSEL_SELECTORS.CAROUSEL_SLIDES_NOT_CLONE)
  const activeFig = slides[newIndex]?.querySelector(COMPONENT_TAGS.MEDIA_FIGURE) as
    (Element & { loadHighRes?: () => void }) | null

  if (activeFig && typeof activeFig.loadHighRes === TYPE_STRINGS.FUNCTION) {
    ;(activeFig.loadHighRes as () => void)()
  }

  c.isNavigating = true

  const cloneFirst = c.$(CAROUSEL_SELECTORS.CAROUSEL_SLIDE_CLONE_FIRST)

  const cloneLast = c.$(CAROUSEL_SELECTORS.CAROUSEL_SLIDE_CLONE_LAST)

  if (idx >= len && cloneFirst) {
    c._scrollToElement(cloneFirst)

    c._scheduleTeleport(0)
  } else if (idx < 0 && cloneLast) {
    c._scrollToElement(cloneLast)

    c._scheduleTeleport(len - 1)
  } else {
    c._scrollToSlide(newIndex)

    if (c.teleportTimer) clearTimeout(c.teleportTimer)

    c.teleportTimer = setTimeout(() => {
      c.isNavigating = false
    }, CAROUSEL_TIMING.NAVIGATION_SETTLE_DELAY)
  }
}

/**
 * Syncs the -active modifier on slides and dots with currentIndex, then
 * rewrites the "N of M" counter in the current locale (ofLabel is
 * localized — 'of', 'de', 'di', …).
 * @param c The CustomCarousel element.
 */
export function updateActiveClasses(c: CustomCarousel) {
  const slides = c.$$(CAROUSEL_SELECTORS.CAROUSEL_SLIDES_NOT_CLONE)

  slides.forEach((slide, i) => {
    slide.classList.toggle(CAROUSEL_CLASSES.CAROUSEL_SLIDE_ACTIVE, i === c.currentIndex)
  })

  const dots = c.$$(CAROUSEL_SELECTORS.CAROUSEL_DOT)

  dots.forEach((dot, i) => {
    dot.classList.toggle(CAROUSEL_CLASSES.CAROUSEL_DOT_ACTIVE, i === c.currentIndex)
  })

  const counter = c.$(CAROUSEL_SELECTORS.CAROUSEL_COUNTER)

  if (counter) {
    const lang = store.getters.getCarouselLang() as unknown as CarouselLang

    counter.textContent = `${c.currentIndex + 1} ${lang.ofLabel} ${c.items.length}`
  }
}

/**
 * Smooth-centers a slide element in the track — null-safe on both ends
 * (clone nodes may be absent in the ≤2-item side-by-side layout).
 * @param c The CustomCarousel element.
 * @param el Slide element to center; null is a no-op.
 */
export function scrollToElement(c: CustomCarousel, el: Element | null) {
  const track = c.$(CAROUSEL_SELECTORS.CAROUSEL_TRACK)

  if (!track || !el) return

  const scrollLeft = calcSlideCenterOffset(track, el)

  if (scrollLeft !== null) {
    track.scrollTo({ left: scrollLeft, behavior: ATTR_VALUES.SMOOTH as ScrollBehavior })
  }
}

/**
 * Schedules the clone→real teleport: after TELEPORT_DELAY (just past the
 * smooth-scroll duration so the clone finishes animating in), instant-jump
 * to the identical real slide — invisible. Any pending teleport is
 * cancelled first so rapid nav can't queue competing jumps.
 * @param c The CustomCarousel element.
 * @param targetIdx Real-slide index to land on.
 */
export function scheduleTeleport(c: CustomCarousel, targetIdx: number) {
  if (c.teleportTimer) clearTimeout(c.teleportTimer)

  c.teleportTimer = setTimeout(() => {
    c._jumpToSlide(targetIdx, false)

    c.isNavigating = false

    c.teleportTimer = null
  }, CAROUSEL_TIMING.TELEPORT_DELAY)
}

/**
 * Smooth-centers real-slide idx — `children[idx + 1]` because a clone of
 * the last slide is prepended to the track (index 0 is the clone).
 * @param c The CustomCarousel element.
 * @param idx Real-slide index.
 */
export function scrollToSlide(c: CustomCarousel, idx: number) {
  const track = c.$(CAROUSEL_SELECTORS.CAROUSEL_TRACK)

  const slide = track?.children[idx + 1]

  if (!slide || !track) return

  const scrollLeft = calcSlideCenterOffset(track, slide)

  if (scrollLeft !== null) {
    track.scrollTo({ left: scrollLeft, behavior: ATTR_VALUES.SMOOTH as ScrollBehavior })
  }
}

/**
 * Instant (default) or smooth position jump to slide idx — used for the
 * clone teleports and resize refits. When layout hasn't produced
 * measurable widths yet (display:none parent, pre-paint) it retries one
 * frame later rather than computing a bogus 0-offset jump.
 * @param c The CustomCarousel element.
 * @param idx Real-slide index.
 * @param smooth Smooth scroll when true (default: instant).
 */
export function jumpToSlide(c: CustomCarousel, idx: number, smooth = false) {
  const track = c.$(CAROUSEL_SELECTORS.CAROUSEL_TRACK)

  const slide = track?.children[idx + 1]

  if (!slide || !track) return

  const scrollLeft = calcSlideCenterOffset(track, slide)

  if (scrollLeft === null) {
    requestAnimationFrame(() => c._jumpToSlide(idx, smooth))

    return
  }

  track.scrollTo({
    left: scrollLeft,
    behavior: (smooth ? ATTR_VALUES.SMOOTH : ATTR_VALUES.INSTANT) as ScrollBehavior,
  })
}

/**
 * Scroll handler — debounces SCROLL_DEBOUNCE_MS (150ms) then runs the
 * clone-teleport check. Skipped while isNavigating (a programmatic scroll
 * fires many scroll events; letting them trigger teleports would undo the
 * goTo-driven clone jump mid-animation).
 * @param c The CustomCarousel element.
 */
export function carouselOnScroll(c: CustomCarousel) {
  if (c.isNavigating) return

  if (c.scrollTimeout) clearTimeout(c.scrollTimeout)

  c.scrollTimeout = setTimeout(() => {
    c._checkInfiniteLoop()
  }, CAROUSEL_TIMING.SCROLL_DEBOUNCE_MS)
}

/**
 * Clone-teleport check — runs after the scroll debounce: when a clone is
 * parked at the track's center, instant-jump to its real twin and re-sync
 * active classes. This is the *user-driven* wrap path (touch/wheel scroll
 * past an edge) — the programmatic path goes through carouselGoTo.
 * @param c The CustomCarousel element.
 */
export function checkInfiniteLoop(c: CustomCarousel) {
  if (c.isNavigating) return

  const track = c.$(CAROUSEL_SELECTORS.CAROUSEL_TRACK)

  const cloneLast = c.$(CAROUSEL_SELECTORS.CAROUSEL_SLIDE_CLONE_LAST)

  const cloneFirst = c.$(CAROUSEL_SELECTORS.CAROUSEL_SLIDE_CLONE_FIRST)

  if (!track || !cloneLast || !cloneFirst) return

  const trackRect = track.getBoundingClientRect()

  const cloneLastRect = cloneLast.getBoundingClientRect()

  const cloneFirstRect = cloneFirst.getBoundingClientRect()

  const center = trackRect.left + trackRect.width / 2

  if (isNearCenter(cloneLastRect, center)) {
    c.currentIndex = c.items.length - 1

    c._jumpToSlide(c.currentIndex)

    c._updateActiveClasses()
  } else if (isNearCenter(cloneFirstRect, center)) {
    c.currentIndex = 0

    c._jumpToSlide(c.currentIndex)

    c._updateActiveClasses()
  }
}

/**
 * Prev-arrow click — replays the WebGL arrow's click animation
 * (triggerClick), permanently stops autoplay (user intent overrides the
 * ambient cycle — the "true" latch), then navigates one step back.
 * @param c The CustomCarousel element.
 */
export function carouselOnPrevClick(c: CustomCarousel) {
  c._prevArrow?.triggerClick()

  c._stopAutoplay(true)

  c.goTo(c.currentIndex - 1)
}

/**
 * Next-arrow click — mirrors carouselOnPrevClick in the forward direction.
 * @param c The CustomCarousel element.
 */
export function carouselOnNextClick(c: CustomCarousel) {
  c._nextArrow?.triggerClick()

  c._stopAutoplay(true)

  c.goTo(c.currentIndex + 1)
}

/**
 * Dot-nav click — jumps straight to idx and permanently stops autoplay;
 * dot clicks are deliberate picks, not ambient browsing.
 * @param c The CustomCarousel element.
 * @param idx Dot index → real-slide index.
 */
export function carouselOnDotClick(c: CustomCarousel, idx: number) {
  c._stopAutoplay(true)

  c.goTo(idx)
}

/**
 * IntersectionObserver wiring — entry: adds the in-view class and mounts
 * the WebGL arrows; exit: destroys the arrows (their GL contexts are
 * released offscreen — canvases are re-mounted on return, keeping total
 * live contexts bounded). `isFullyVisible` gates autoplay at
 * VISIBILITY_RATIO (15%): a partly-seen strip still animates, a sliver
 * doesn't burn frames. Threshold array [0, .15, .5, 1] gives both the
 * 0-crossing and the gate crossing cleanly. No IntersectionObserver →
 * degrade to always-visible so content still shows.
 * @param c The CustomCarousel element.
 */
export function setupIntersectionObserver(c: CustomCarousel) {
  const root = c.$(CAROUSEL_SELECTORS.CAROUSEL)

  if (!root) return

  if (typeof IntersectionObserver === TYPE_STRINGS.UNDEFINED) {
    root.classList.add(CAROUSEL_CLASSES.CAROUSEL_IN_VIEW)

    c._mountWebGLArrows()

    c.isEnteredViewport = true

    c.isFullyVisible = true

    if (!store.getters.getReducedMotion()) c._startAutoplay()

    return
  }

  if (c.observer) {
    c.observer.disconnect()

    c.observer = null
  }

  c.observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          c.isEnteredViewport = true

          root.classList.add(CAROUSEL_CLASSES.CAROUSEL_IN_VIEW)

          c._mountWebGLArrows()
        } else {
          // Out of view: release the arrow canvases, they are rebuilt on return
          c._destroyWebGLArrows()
        }

        const isVisible =
          entry.isIntersecting && entry.intersectionRatio >= CAROUSEL_LAYOUT.VISIBILITY_RATIO

        c.isFullyVisible = isVisible

        if (isVisible) {
          if (!store.getters.getReducedMotion() && !store.getters.getModal()?.open) {
            c._startAutoplay()
          }
        } else {
          c._stopAutoplay()
        }
      })
    },
    { threshold: [0, CAROUSEL_LAYOUT.VISIBILITY_RATIO, 0.5, 1.0] }
  )

  c.observer.observe(root)
}
