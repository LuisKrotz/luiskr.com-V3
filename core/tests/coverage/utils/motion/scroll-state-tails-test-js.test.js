/**
 * @file scroll-state-tails-test-js.test.js
 * @description Split from coverage-tails.test.js — covers the "scroll-state tails" describe.
 */
import { jest } from '@jest/globals'
import '@core/utils/data/sanitize.js'

import { isScrolling, onScrollStop } from '@core/utils/motion/scroll-state.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'

jest.unstable_mockModule('@core/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => {
    cb(null)
    return () => {}
  }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})),
}))

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms))

describe('scroll-state tails', () => {
  test('onScrollStop fires immediately when idle and defers while scrolling', async () => {
    const immediate = jest.fn()

    onScrollStop(immediate)

    expect(immediate).toHaveBeenCalled()

    onScrollStop(null)

    window.dispatchEvent(new Event(WINDOW_EVENTS.SCROLL))

    const deferred = jest.fn()
    const throwing = jest.fn(() => {
      throw new Error(TEST_TEXT.SECOND)
    })

    onScrollStop(throwing)
    onScrollStop(deferred)

    expect(isScrolling()).toBe(true)

    window.dispatchEvent(new Event(WINDOW_EVENTS.SCROLLEND))
    await flush(20)

    expect(throwing).toHaveBeenCalled()
    expect(deferred).toHaveBeenCalled()
    expect(isScrolling()).toBe(false)
  })
})
