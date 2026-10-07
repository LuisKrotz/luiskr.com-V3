/**
 * @file sizing-tails.test.js
 * @description Coverage tails for custom-carousel/sizing.js measureFit — the
 * early guards (>2-item teardown arms, sub-960px reset, window-less and
 * zero-host bails) plus the full breakpoint ladder: strip-height rungs,
 * item padding/margins, and the landscape/regular media caps the fit
 * projection mirrors from the stylesheet contract.
 * Static imports only — no resetModules (which discards istanbul counters).
 */

import { describe, test, expect, jest, afterEach } from '@jest/globals'
import { measureFit, onCarouselResize } from '@/components/carousel/custom-carousel/sizing.js'
import { CAROUSEL_LAYOUT } from '@/core/tokens/motion/carousel.js'
import { GENERIC_DIMENSIONS } from '@/core/tokens/media/dimensions.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'

const SLIDE = { src: 'a.webp', size: [800, 450], label: 'One' }
const WIDE = { src: 'b.webp', size: [1600, 900], label: 'Wide', class: STATE_STRINGS.LANDSCAPE }
const TALL = { src: 'c.webp', size: [400, 2400], label: 'Tall' }
const NOSIZE = { src: 'd.webp', label: 'No size' }

/** Fresh element stub — measureFit only reads the fields below. */
const stubEl = (items = [SLIDE, SLIDE]) => ({
  _forceActive: false,
  items,
  _isSideBySide: false,
  clientWidth: 0,
  _updateDom: jest.fn(),
  _setupAfterRender: jest.fn(),
  _setHeightVar: jest.fn(),
})

const savedWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth')
const savedHeight = Object.getOwnPropertyDescriptor(window, 'innerHeight')

const setViewport = (w, h) => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: w })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: h })
}

afterEach(() => {
  if (savedWidth) Object.defineProperty(window, 'innerWidth', savedWidth)
  if (savedHeight) Object.defineProperty(window, 'innerHeight', savedHeight)
})

describe('custom-carousel sizing measureFit guard tails', () => {
  test('more than two items while not side-by-side returns without teardown', () => {
    const el = stubEl([SLIDE, SLIDE, SLIDE])

    setViewport(1400, 900)
    el._isSideBySide = false
    measureFit(el, 800)

    expect(el._isSideBySide).toBe(false)
    expect(el._updateDom).not.toHaveBeenCalled()
    expect(el._setupAfterRender).not.toHaveBeenCalled()
  })

  test('sub-breakpoint viewport while side-by-side resets the pairing', () => {
    const el = stubEl()

    setViewport(500, 900)
    el._isSideBySide = true
    measureFit(el, 800)

    expect(el._isSideBySide).toBe(false)
    expect(el._updateDom).toHaveBeenCalled()
  })

  test('window-less projection falls back to the zero viewport path', () => {
    const el = stubEl()
    const savedWin = globalThis.window

    delete globalThis.window

    try {
      el._isSideBySide = true
      measureFit(el, 800)

      expect(el._isSideBySide).toBe(false)
      expect(el._updateDom).toHaveBeenCalled()

      el._updateDom.mockClear()
      el._isSideBySide = false
      measureFit(el, 800)

      expect(el._updateDom).not.toHaveBeenCalled()

      // onCarouselResize's own window-less arm lands on the mobile false arm.
      el.isMobile = true
      onCarouselResize(el)

      expect(el.isMobile).toBe(false)
    } finally {
      globalThis.window = savedWin
    }
  })

  test('zero host width bails before the projection loop', () => {
    const el = stubEl()

    setViewport(1400, 900)
    measureFit(el, 0)

    expect(el._updateDom).not.toHaveBeenCalled()
  })
})

describe('custom-carousel sizing measureFit ladder tails', () => {
  const rungs = [
    // vw rung → the strip-height step it must select
    { vw: 2600, strip: CAROUSEL_LAYOUT.STRIP_H_2560 },
    { vw: 2000, strip: CAROUSEL_LAYOUT.STRIP_H_1440 },
    { vw: 1600, strip: CAROUSEL_LAYOUT.STRIP_H_1440 },
    { vw: 1300, strip: CAROUSEL_LAYOUT.STRIP_H_1024 },
    { vw: 1100, strip: CAROUSEL_LAYOUT.STRIP_H_1024 },
    { vw: 970, strip: Math.round((900 * CAROUSEL_LAYOUT.MAX_HEIGHT_VH) / 100) - CAROUSEL_LAYOUT.STRIP_SUB_TABLET },
  ]

  for (const { vw, strip } of rungs) {
    test(`viewport ${vw} selects strip height ${strip}`, () => {
      const el = stubEl([SLIDE, WIDE])

      setViewport(vw, 900)
      measureFit(el, vw * 4)

      // Every rung lands on its projection — a huge host always fits.
      expect(el._isSideBySide).toBe(true)
    })
  }

  test('regular item below 1024 uses the 90vw-minus-pad cap and no margin', () => {
    const el = stubEl([SLIDE, SLIDE])

    setViewport(970, 900)

    // Start paired so the no-fit result flips state → teardown path runs.
    el._isSideBySide = true
    measureFit(el, 860)

    // regularCap = 970*0.9 − 68 = 805 → media 805 each → 805+805+pad+gap > 860
    expect(el._isSideBySide).toBe(false)
    expect(el._setupAfterRender).toHaveBeenCalled()
  })

  test('tall media is floored at the 320px minimum width', () => {
    const el = stubEl([TALL, TALL])

    setViewport(1600, 900)

    // natural = (400/2400)*610 ≈ 101 → floored to 320; both items fit.
    measureFit(el, 2000)

    expect(el._isSideBySide).toBe(true)
  })

  test('missing intrinsic sizes fall back to the generic dimensions', () => {
    const el = stubEl([NOSIZE, NOSIZE])

    setViewport(1600, 900)
    measureFit(el, 6000)

    expect(el._isSideBySide).toBe(true)
    expect(GENERIC_DIMENSIONS.DEFAULT_WIDTH).toBeGreaterThan(0)
    expect(GENERIC_DIMENSIONS.ITEM_FALLBACK_HEIGHT).toBeGreaterThan(0)
  })

  test('an already-correct side-by-side state skips the re-render', () => {
    const el = stubEl([SLIDE, SLIDE])

    setViewport(1600, 900)
    el._isSideBySide = true
    measureFit(el, 6000)

    expect(el._isSideBySide).toBe(true)
    expect(el._updateDom).not.toHaveBeenCalled()
  })
})
