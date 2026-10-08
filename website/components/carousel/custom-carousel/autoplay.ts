/**
 * @file carousel-autoplay.ts
 * @description Autoplay/progress-ring engine for <custom-carousel>,
 * extracted from CustomCarousel.ts. Stateless free functions operating
 * on the host carousel (CarouselAutoplayHost) so the component keeps its
 * public method surface while the clock/regress/DOM-sync logic lives in
 * one focused, tree-shakeable module.
 */

import { CAROUSEL_SELECTORS } from '@core/tokens/selectors/carousel.js'
import { calcCarouselRingOffset } from '@core/utils/wasm/wasm-layout.js'
import { CAROUSEL_TIMING } from '@core/tokens/motion/carousel.js'

/** Slice of CarouselArrowWebGL the autoplay engine drives. */
export interface CarouselArrowLike {
  /** Toggles the arrow's playing affordance (ring visible vs idle). */
  setPlaying(playing: boolean): void
  /** Paints the 0–1 progress arc. */
  setProgress(progress: number, running: boolean): void
}

/** Host surface the autoplay engine needs (satisfied by CustomCarousel). */
export interface CarouselAutoplayHost {
  /** RAF cycle active flag. */
  autoplayRunning: boolean
  /** performance.now() the current dwell cycle started at. */
  autoplayStart: number
  /** Accumulated ms into the cycle — survives pause→resume. */
  autoplayElapsed: number
  /** 0–1 fraction of the autoplay cycle — drives ring + arrow arc. */
  ringProgress: number
  /** RAF handle for cancellation. */
  rafId: number | null
  /** Logical slide index for goTo(+1) on cycle end. */
  currentIndex: number
  /** 2πr of the SVG ring — dasharray/dashoffset base. */
  circumference: number
  /** Latched by user interaction — blocks all autoplay resumes. */
  _autoplayPermanentlyStopped: boolean
  /** Ring regress animation in flight. */
  _isRegressing: boolean
  /** Prev/next arrow widgets (null until viewport entry mounts them). */
  _prevArrow: CarouselArrowLike | null
  _nextArrow: CarouselArrowLike | null
  /** Navigate to slide idx (clone-wrap aware). */
  goTo(idx: number): void
  /** Shadow-scoped querySelectorAll. */
  $$(selector: string): Element[]
}

/**
 * Starts the autoplay RAF loop unless latched off or already running.
 * `autoplayStart` is backdated by `autoplayElapsed` so a pause→resume
 * continues the cycle mid-dwell — the ring picks up where it drained to
 * instead of restarting the countdown.
 * @param c The carousel host.
 */
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
 * @param c The carousel host.
 * @param permanently Latch user intent — no future resumes.
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
 * Drains ringProgress to 0 by RING_REGRESS_STEP per frame instead of
 * snapping — the ring visibly unwinds when autoplay stops, matching the
 * "paused" affordance. autoplayElapsed stays proportional so a resume
 * continues the cycle. Self-terminating: a resumed autoplay flag or
 * progress reaching 0 ends the RAF chain.
 * @param c The carousel host.
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
      c.ringProgress = Math.max(0, c.ringProgress - CAROUSEL_TIMING.RING_REGRESS_STEP)

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
 * @param c The carousel host.
 * @param timestamp RAF timestamp (ms) — the clock source for this frame.
 */
export const tickCarouselAutoplay = (c: CarouselAutoplayHost, timestamp: number): void => {
  if (!c.autoplayRunning) return

  // Clock guard: heal a NaN start (e.g. backdated from a NaN elapsed),
  // then clamp NaN/negative deltas — a poisoned clock must never write
  // NaN into ringProgress, where it survives the regression's >0 drain.
  if (!Number.isFinite(c.autoplayStart)) c.autoplayStart = timestamp

  c.autoplayElapsed = Math.max(0, timestamp - c.autoplayStart) || 0

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
 * The offset math lives in wasm-layout (SIMD-capable batch helper with a
 * JS fallback) since this runs per frame.
 * @param c The carousel host.
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
