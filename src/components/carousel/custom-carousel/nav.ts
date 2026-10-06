/**
 * @file carousel-nav.ts
 * @description Navigation engine for CustomCarousel — goTo/prev/next/dot
 * entry points, clone-teleport infinite loop, scroll-handler teleport
 * detection, adjacent-slide lazy loading, and the IntersectionObserver
 * that gates autoplay on viewport visibility.
 */

import { CAROUSEL_CLASSES } from '@/core/tokens/classes/carousel.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import { CAROUSEL_SELECTORS } from '@/core/tokens/selectors/carousel.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import store from '@/core/store.js'
import type { CarouselLang } from './render.js'
import type { CustomCarousel } from '../CustomCarousel.js'
import { CAROUSEL_TIMING } from '@/core/tokens/motion/carousel.js'

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
 * center is within 10px of the track's center — loose enough to catch
 * sub-pixel scroll stops, tight enough not to fire mid-swipe.
 */
const isNearCenter = (childRect: DOMRect, center: number): boolean =>
  Math.abs(childRect.left + childRect.width / 2 - center) < 10

/**
 * marks adjacent loaded.
 * @param c — the component
 * @param centerIdx — the value
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
 * The carouselGoTo value.
 * @param c — the component
 * @param idx — the index
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
    }, 400)
  }
}

/**
 * Updates active classes.
 * @param c — the component
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
 * scrolls to element.
 * @param c — the component
 * @param el — the element
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
 * Schedules teleport.
 * @param c — the component
 * @param targetIdx — the value
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
 * scrolls to slide.
 * @param c — the component
 * @param idx — the index
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
 * jumps to slide.
 * @param c — the component
 * @param idx — the index
 * @param smooth — the value
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
 * The carouselOnScroll value.
 * @param c — the component
 */
export function carouselOnScroll(c: CustomCarousel) {
  if (c.isNavigating) return

  if (c.scrollTimeout) clearTimeout(c.scrollTimeout)

  c.scrollTimeout = setTimeout(() => {
    c._checkInfiniteLoop()
  }, 150)
}

/**
 * Checks infinite loop.
 * @param c — the component
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
 * The carouselOnPrevClick value.
 * @param c — the component
 */
export function carouselOnPrevClick(c: CustomCarousel) {
  c._prevArrow?.triggerClick()

  c._stopAutoplay(true)

  c.goTo(c.currentIndex - 1)
}

/**
 * The carouselOnNextClick value.
 * @param c — the component
 */
export function carouselOnNextClick(c: CustomCarousel) {
  c._nextArrow?.triggerClick()

  c._stopAutoplay(true)

  c.goTo(c.currentIndex + 1)
}

/**
 * The carouselOnDotClick value.
 * @param c — the component
 * @param idx — the index
 */
export function carouselOnDotClick(c: CustomCarousel, idx: number) {
  c._stopAutoplay(true)

  c.goTo(idx)
}

/**
 * setups intersection observer.
 * @param c — the component
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

        const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.15

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
    { threshold: [0, 0.15, 0.5, 1.0] }
  )

  c.observer.observe(root)
}
