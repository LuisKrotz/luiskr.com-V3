/**
 * @file scroll-and-predict-scroll-state.test.js
 * @description Split from scroll-and-predict.test.js — covers the "scroll-state" describe.
 */
import { isScrolling, onScrollStop } from '@core/utils/motion/scroll-state.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'

const flush = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── scroll-state ────────────────────────────────────────────────────────────
describe('scroll-state', () => {
  test('marks scrolling active and fires the stop callback', async () => {
    const stops = []

    onScrollStop(() => stops.push(1))

    window.dispatchEvent(new window.Event(WINDOW_EVENTS.SCROLL))

    expect(isScrolling()).toBe(true)

    await flush(200)

    expect(isScrolling()).toBe(false)
    expect(stops.length).toBe(1)
  })

  test('a throwing callback does not break the pipeline', async () => {
    const good = []

    window.dispatchEvent(new window.Event(WINDOW_EVENTS.SCROLL))

    onScrollStop(() => {
      throw new Error(CHAR_STRINGS.EMPTY)
    })
    onScrollStop(() => good.push(1))

    await flush(200)

    expect(good.length).toBe(1)
  })
})
