/**
 * @file carousel-autoplay.ts
 * @description Autoplay/progress-ring engine for <custom-carousel>,
 * extracted from CustomCarousel.ts. Stateless free functions operating
 * on the host carousel (CarouselAutoplayHost) so the component keeps its
 * public method surface while the clock/regress/DOM-sync logic lives in
 * one focused, tree-shakeable module.
 */

import { CAROUSEL_SELECTORS } from '@/core/tokens/selectors/carousel.js'
import { calcCarouselRingOffset } from '@/utils/wasm/wasm-layout.js'
import { CAROUSEL_TIMING } from '@/core/tokens/motion/carousel.js'

/** Slice of CarouselArrowWebGL the autoplay engine drives. */
export interface CarouselArrowLike {
  setPlaying(playing: boolean): void
  setProgress(progress: number, running: boolean): void
}

/** Host surface the autoplay engine needs (satisfied by CustomCarousel). */
export interface CarouselAutoplayHost {
  autoplayRunning: boolean
  autoplayStart: number
  autoplayElapsed: number
  ringProgress: number
  rafId: number | null
  currentIndex: number
  circumference: number
  _autoplayPermanentlyStopped: boolean
  _isRegressing: boolean
  _prevArrow: CarouselArrowLike | null
  _nextArrow: CarouselArrowLike | null
  goTo(idx: number): void
  $$(selector: string): Element[]
}

/** Starts the autoplay RAF loop unless latched off or already running. */
export const startCarouselAutoplay = (c: CarouselAutoplayHost): void => {
  if (c._autoplayPermanentlyStopped) return

  if (c.autoplayRunning) return

  c.autoplayRunning = true

  c.autoplayStart = performance.now() - c.autoplayElapsed

  c._prevArrow?.setPlaying(true)

  c._nextArrow?.setPlaying(true)

  c.rafId = requestAnimationFrame((ts) => tickCarouselAutoplay(c, ts))
}

/**
 * Stops autoplay and drains the progress ring. `permanently` latches
 * _autoplayPermanentlyStopped — every user-initiated navigation
 * (arrow/dot/swipe/hover) passes true so the carousel never auto-plays
 * again on this page; visibility/modal stops pass false and may resume.
 */
export const stopCarouselAutoplay = (c: CarouselAutoplayHost, permanently = false): void => {
  if (permanently) {
    c._autoplayPermanentlyStopped = true
  }

  if (!c.autoplayRunning && !c._isRegressing) return

  c.autoplayRunning = false

  c._prevArrow?.setPlaying(false)

  c._nextArrow?.setPlaying(false)

  if (c.rafId) {
    cancelAnimationFrame(c.rafId)

    c.rafId = null
  }

  regressRingToZero(c)
}

/**
 * Drains ringProgress to 0 at −4%/frame instead of snapping — the ring
 * visibly unwinds when autoplay stops, matching the "paused" affordance.
 * autoplayElapsed stays proportional so a resume continues the cycle.
 */
export const regressRingToZero = (c: CarouselAutoplayHost): void => {
  if (c.ringProgress <= 0) {
    c.ringProgress = 0

    c.autoplayElapsed = 0

    updateCarouselRingDom(c)

    return
  }

  c._isRegressing = true

  const regressStep = () => {
    if (c.autoplayRunning) {
      c._isRegressing = false

      return
    }

    if (c.ringProgress > 0) {
      c.ringProgress = Math.max(0, c.ringProgress - 0.04)

      c.autoplayElapsed = c.ringProgress * CAROUSEL_TIMING.AUTOPLAY_DURATION

      updateCarouselRingDom(c)

      requestAnimationFrame(regressStep)
    } else {
      c.ringProgress = 0

      c.autoplayElapsed = 0

      c._isRegressing = false

      updateCarouselRingDom(c)
    }
  }

  requestAnimationFrame(regressStep)
}

/**
 * Autoplay RAF tick: elapsed/duration → ringProgress 0–1 → paint →
 * advance when the cycle completes, then rebase the clock for the next
 * slide. The ring resets before goTo so the new slide starts empty.
 */
export const tickCarouselAutoplay = (c: CarouselAutoplayHost, timestamp: number): void => {
  if (!c.autoplayRunning) return

  c.autoplayElapsed = timestamp - c.autoplayStart

  c.ringProgress = Math.min(c.autoplayElapsed / CAROUSEL_TIMING.AUTOPLAY_DURATION, 1)

  updateCarouselRingDom(c)

  if (c.autoplayElapsed >= CAROUSEL_TIMING.AUTOPLAY_DURATION) {
    c.autoplayElapsed = 0

    c.ringProgress = 0

    updateCarouselRingDom(c)

    c.goTo(c.currentIndex + 1)

    c.autoplayStart = performance.now()
  }

  c.rafId = requestAnimationFrame((ts) => tickCarouselAutoplay(c, ts))
}

/**
 * Pushes progress into the DOM: the SVG ring's stroke-dashoffset (full
 * circumference = empty, 0 = full circle) and the WebGL arrows' arc.
 */
export const updateCarouselRingDom = (c: CarouselAutoplayHost): void => {
  const fills = c.$$(CAROUSEL_SELECTORS.CAROUSEL_BTN_RING_FILL)

  const offset = calcCarouselRingOffset(
    c.autoplayElapsed,
    CAROUSEL_TIMING.AUTOPLAY_DURATION,
    c.circumference
  )

  fills.forEach((fill) => {
    ;(fill as SVGElement).style.strokeDashoffset = `${offset}`
  })

  c._prevArrow?.setProgress(c.ringProgress, c.autoplayRunning)

  c._nextArrow?.setProgress(c.ringProgress, c.autoplayRunning)
}
