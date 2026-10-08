/**
 * @file awards-carousel/nav.ts — slide navigation: dot clicks, smooth
 * centering, and the clone→real teleport that makes the loop infinite.
 */

import { AWC_CLASSES } from '@core/tokens/classes/awards-carousel.js'
import { APP_EVENTS } from '@core/tokens/events/app.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { CAROUSEL_TIMING } from '@core/tokens/motion/carousel.js'
import type { AwardsCarousel } from '../AwardsCarousel.js'

/**
 * Smooth-centers an element in the track. Formula (same geometry as
 * CustomCarousel): scrollLeft + (el.left − track.left) positions the
 * slide at the track's left edge; −(track.w − el.w)/2 recenters it so
 * the slide's midpoint sits on the track's midpoint.
 * @param host The AwardsCarousel element.
 * @param el Slide element to center.
 */
export function scrollToElement(host: AwardsCarousel, el: Element): void {
  const track = host.$(`.${AWC_CLASSES.AWC_TRACK}`)
  if (!track || !el) return
  const trackRect = track.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  const left =
    track.scrollLeft + elRect.left - trackRect.left - (trackRect.width - elRect.width) / 2
  track.scrollTo({ left, behavior: 'smooth' })
}

/**
 * Instant centering jump (offsetLeft variant — no smooth scroll): used
 * for the invisible clone→real teleport and resize refits. Retries one
 * frame later when layout hasn't produced measurable widths yet (a
 * display:none parent yields clientWidth 0 — waiting a frame beats
 * computing a bogus 0-offset jump).
 * @param host The AwardsCarousel element.
 * @param idx Real-slide index; `children[idx + 1]` skips the leading
 *   last-clone prepended to the track.
 * @param smooth true for a smooth jump, false (default) for instant.
 */
export function jumpToSlide(host: AwardsCarousel, idx: number, smooth = false): void {
  const track = host.$(`.${AWC_CLASSES.AWC_TRACK}`)
  const slide = track?.children[idx + 1] as HTMLElement | undefined
  if (!slide || !track) return

  const trackWidth = track.clientWidth
  const slideWidth = slide.clientWidth
  if (!trackWidth || !slideWidth) {
    requestAnimationFrame(() => jumpToSlide(host, idx, smooth))
    return
  }

  const scrollLeft = slide.offsetLeft - (trackWidth - slideWidth) / 2
  track.scrollTo({ left: scrollLeft, behavior: smooth ? ATTR_VALUES.SMOOTH : ATTR_VALUES.INSTANT })
}

/**
 * Clone→real teleport for the infinite loop: waits TELEPORT_DELAY (420ms,
 * just past the smooth-scroll duration) so the clone finishes animating
 * in, then instant-jumps to its real twin — invisible because the clone
 * and real slide are pixel-identical. A pending teleport is cancelled so
 * rapid nav can't queue competing jumps.
 * @param host The AwardsCarousel element.
 * @param targetIdx Real-slide index to land on after the clone animates.
 */
export function scheduleTeleport(host: AwardsCarousel, targetIdx: number): void {
  if (host.teleportTimer) clearTimeout(host.teleportTimer)
  host.teleportTimer = setTimeout(() => {
    jumpToSlide(host, targetIdx, false)
    host.isNavigating = false
    host.teleportTimer = null
  }, CAROUSEL_TIMING.TELEPORT_DELAY)
}

/**
 * Smooth scroll to slide idx (children offset +1 skips the last-clone).
 * Same centering math as scrollToElement but reads rects fresh — the
 * track may have scrolled between calls, so offsets come from
 * getBoundingClientRect, not offsetLeft.
 * @param host The AwardsCarousel element.
 * @param idx Real-slide index.
 */
export function scrollToSlide(host: AwardsCarousel, idx: number): void {
  const track = host.$(`.${AWC_CLASSES.AWC_TRACK}`)
  const slide = track?.children[idx + 1]
  if (!slide || !track) return
  const trackRect = track.getBoundingClientRect()
  const slideRect = slide.getBoundingClientRect()
  if (!trackRect.width || !slideRect.width) return
  const scrollLeft =
    track.scrollLeft + slideRect.left - trackRect.left - (trackRect.width - slideRect.width) / 2
  track.scrollTo({ left: scrollLeft, behavior: ATTR_VALUES.SMOOTH })
}

/**
 * Navigate to slide idx. idx may be out-of-range (−1 or len): the call
 * scrolls to the matching CLONE slide at that edge and schedules an
 * instant teleport to its real twin — the user sees a continuous wrap
 * scroll while the clone→real swap is invisible. In-range idx scrolls
 * directly; the NAVIGATION_SETTLE_DELAY isNavigating window suppresses
 * scroll-handler teleports until the smooth animation settles.
 * `((idx % len) + len) % len` normalizes idx into [0,len) — the double
 * modulo handles negative idx (−1 → len−1) where a single % yields −1.
 * @param host The AwardsCarousel element.
 * @param idx Target index — may be −1 or len for edge wraps.
 */
export function goTo(host: AwardsCarousel, idx: number): void {
  const len = host.items.length
  if (!len) return
  const newIndex = ((idx % len) + len) % len
  host.currentIndex = newIndex

  const slides = host.$$(`.${AWC_CLASSES.AWC_SLIDE}:not(.${AWC_CLASSES.AWC_SLIDE_CLONE})`)
  slides.forEach((s, i) => {
    s.classList.toggle(AWC_CLASSES.AWC_SLIDE_ACTIVE, i === host.currentIndex)
  })

  const dots = host.$$(`.${AWC_CLASSES.AWC_DOT}`)
  dots.forEach((d, i) => {
    d.classList.toggle(AWC_CLASSES.AWC_DOT_ACTIVE, i === host.currentIndex)
  })

  // AwardsMentions' progress bar listens for this to sync its timeline.
  host.dispatchEvent(
    new CustomEvent(APP_EVENTS.SLIDE_CHANGE, {
      bubbles: true,
      composed: true,
      detail: { index: host.currentIndex, total: len },
    })
  )
  host.isNavigating = true
  const cloneFirst = host.$(`.${AWC_CLASSES.AWC_SLIDE_CLONE_FIRST}`)
  const cloneLast = host.$(`.${AWC_CLASSES.AWC_SLIDE_CLONE_LAST}`)

  if (idx >= len && cloneFirst) {
    scrollToElement(host, cloneFirst)
    scheduleTeleport(host, 0)
  } else if (idx < 0 && cloneLast) {
    scrollToElement(host, cloneLast)
    scheduleTeleport(host, len - 1)
  } else {
    scrollToSlide(host, newIndex)
    if (host.teleportTimer) clearTimeout(host.teleportTimer)
    host.teleportTimer = setTimeout(() => {
      host.isNavigating = false
    }, CAROUSEL_TIMING.NAVIGATION_SETTLE_DELAY)
  }
}

/**
 * Jumps to the slide matching the clicked dot — a manual choice stops
 * autoplay (user intent overrides the ambient cycle).
 * @param host The AwardsCarousel element.
 * @param idx Dot index → real-slide index.
 */
export function onDotClick(host: AwardsCarousel, idx: number): void {
  host._stopAutoplay()
  goTo(host, idx)
}
