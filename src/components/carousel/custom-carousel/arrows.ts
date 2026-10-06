/**
 * @file carousel-arrows.ts
 * @description Control wiring for CustomCarousel — prev/next/dot click
 * binding, hover-driven autoplay stop, touch-swipe handling on the track,
 * and the CarouselArrowWebGL widget mount/teardown (pooled, viewport-gated).
 */

import { MOUSE_EVENTS, TOUCH_EVENTS, WINDOW_EVENTS } from '@/core/tokens/events/dom.js'
import { CAROUSEL_SELECTORS } from '@/core/tokens/selectors/carousel.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { ARROW_TYPES } from '@/core/tokens/theme/arrows.js'
import { CarouselArrowWebGL } from '@/utils/canvas/widgets/carousel-controls.js'
import type { CustomCarousel } from '../CustomCarousel.js'
import { CAROUSEL_LAYOUT } from '@/core/tokens/motion/carousel.js'

/**
 * Binds controls.
 * @param c — the component
 */
export function bindControls(c: CustomCarousel) {
  const prevBtn = c.$(CAROUSEL_SELECTORS.CAROUSEL_BTN_PREV)

  const nextBtn = c.$(CAROUSEL_SELECTORS.CAROUSEL_BTN_NEXT)

  const track = c.$(CAROUSEL_SELECTORS.CAROUSEL_TRACK)

  if (prevBtn) {
    c.addScopedListener(prevBtn, MOUSE_EVENTS.CLICK, () => c.onPrevClick())

    c.addScopedListener(prevBtn, MOUSE_EVENTS.MOUSEENTER, () => {
      c._stopAutoplay(true)

      c._prevArrow?.setHover(true)
    })

    c.addScopedListener(prevBtn, MOUSE_EVENTS.MOUSELEAVE, () => c._prevArrow?.setHover(false))
  }

  if (nextBtn) {
    c.addScopedListener(nextBtn, MOUSE_EVENTS.CLICK, () => c.onNextClick())

    c.addScopedListener(nextBtn, MOUSE_EVENTS.MOUSEENTER, () => {
      c._stopAutoplay(true)

      c._nextArrow?.setHover(true)
    })

    c.addScopedListener(nextBtn, MOUSE_EVENTS.MOUSELEAVE, () => c._nextArrow?.setHover(false))
  }

  // Arrow canvases are created on demand when the carousel enters the viewport

  const dots = c.$$(CAROUSEL_SELECTORS.CAROUSEL_DOT)

  dots.forEach((dot, idx) => {
    c.addScopedListener(dot, MOUSE_EVENTS.CLICK, () => c.onDotClick(idx))
  })

  if (track) {
    c.addScopedListener(track, WINDOW_EVENTS.SCROLL, () => c.onScroll(), { passive: true })

    c.addScopedListener(
      track,
      TOUCH_EVENTS.TOUCHSTART,
      (e) => {
        c._stopAutoplay(true)

        c.touchStartX = (e as TouchEvent).touches[0].clientX
      },
      { passive: true }
    )

    c.addScopedListener(
      track,
      TOUCH_EVENTS.TOUCHEND,
      (e) => {
        const delta = (e as TouchEvent).changedTouches[0].clientX - c.touchStartX

        if (Math.abs(delta) > CAROUSEL_LAYOUT.SWIPE_THRESHOLD) {
          c._stopAutoplay(true)

          if (delta < 0) c.goTo(c.currentIndex + 1)
          else c.goTo(c.currentIndex - 1)
        }
      },
      { passive: true }
    )
  }

  c.addScopedListener(window, WINDOW_EVENTS.RESIZE, () => c._onResize(), { passive: true })
}

/**
 * Mounts web glarrows.
 * @param c — the component
 */
export function mountWebGLArrows(c: CustomCarousel) {
  if (typeof window === TYPE_STRINGS.UNDEFINED) return

  const prevCanvas = c.$<HTMLCanvasElement>(
    `${CAROUSEL_SELECTORS.CAROUSEL_BTN_PREV} ${CAROUSEL_SELECTORS.CAROUSEL_BTN_CANVAS}`
  )

  if (prevCanvas) {
    if (c._prevArrow && c._prevArrow.canvas !== prevCanvas) {
      c._prevArrow.destroy()

      c._prevArrow = null
    }

    if (!c._prevArrow) {
      c._prevArrow = new CarouselArrowWebGL(prevCanvas, ARROW_TYPES.PREV, () => c.onPrevClick())
    }
  }

  const nextCanvas = c.$<HTMLCanvasElement>(
    `${CAROUSEL_SELECTORS.CAROUSEL_BTN_NEXT} ${CAROUSEL_SELECTORS.CAROUSEL_BTN_CANVAS}`
  )

  if (nextCanvas) {
    if (c._nextArrow && c._nextArrow.canvas !== nextCanvas) {
      c._nextArrow.destroy()

      c._nextArrow = null
    }

    if (!c._nextArrow) {
      c._nextArrow = new CarouselArrowWebGL(nextCanvas, ARROW_TYPES.NEXT, () => c.onNextClick())
    }
  }
}

/**
 * The destroyWebGLArrows value.
 * @param c — the component
 */
export function destroyWebGLArrows(c: CustomCarousel) {
  if (c._prevArrow) {
    c._prevArrow.destroy()

    c._prevArrow = null
  }

  if (c._nextArrow) {
    c._nextArrow.destroy()

    c._nextArrow = null
  }
}
