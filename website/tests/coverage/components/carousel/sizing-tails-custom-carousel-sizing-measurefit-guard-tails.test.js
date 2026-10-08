/**
 * @file sizing-tails-custom-carousel-sizing-measurefit-guard-tails.test.js
 * @description Split from sizing-tails.test.js — covers the "custom-carousel sizing measureFit guard tails" describe.
 */
import { describe, test, expect, jest, afterEach } from '@jest/globals'
import {
  measureFit,
  onCarouselResize,
} from '@website/components/carousel/custom-carousel/sizing.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'

const SLIDE = { src: 'a.webp', size: [800, 450], label: 'One' }
const _WIDE = { src: 'b.webp', size: [1600, 900], label: 'Wide', class: STATE_STRINGS.LANDSCAPE }
const _TALL = { src: 'c.webp', size: [400, 2400], label: 'Tall' }
const _NOSIZE = { src: 'd.webp', label: 'No size' }

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
