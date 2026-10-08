/**
 * @file utils-deep-coverage-scroll-state.test.js
 * @description Split from utils-deep-coverage.test.js — covers the "scroll-state" describe.
 */
import { describe, test, expect } from '@jest/globals'
import { isScrolling, onScrollStop } from '@core/utils/motion/scroll-state.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'

const flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

// ─── scroll-state.js ─────────────────────────────────────────────────────────
describe('scroll-state', () => {
  test('isScrolling tracks the gesture and onScrollStop fires', async () => {
    expect(isScrolling()).toBe(false)

    const immediate = []

    onScrollStop(() => immediate.push(1))
    onScrollStop(42)

    expect(immediate).toHaveLength(1)

    window.dispatchEvent(new window.Event(WINDOW_EVENTS.SCROLL))

    expect(isScrolling()).toBe(true)

    const stopped = []

    onScrollStop(() => stopped.push(1))

    await flush(150)

    expect(isScrolling()).toBe(false)
    expect(stopped).toHaveLength(1)
  })
})
