/**
 * @file scroll-state-tails.test.js
 * @description Split from coverage-tails-4.test.js — covers the "scroll-state tails" describe.
 */
import { jest } from '@jest/globals'
import { h } from '@core/jsx.js'

import { isScrolling, onScrollStop } from '@core/utils/motion/scroll-state.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

describe('scroll-state tails', () => {
  test('onScrollStop guards non-functions and fires when idle', () => {
    const cb = jest.fn()

    onScrollStop(null)
    onScrollStop(cb)

    expect(cb).toHaveBeenCalled()
    expect(typeof isScrolling()).toBe(TYPE_STRINGS.BOOLEAN)
  })

  test('scroll arms the debounce, scrollend drains queued one-shots', async () => {
    const cb = jest.fn()
    const bad = jest.fn(() => {
      throw new Error('cb-fail')
    })

    window.dispatchEvent(new Event(WINDOW_EVENTS.SCROLL))
    window.dispatchEvent(new Event(WINDOW_EVENTS.SCROLL))

    expect(isScrolling()).toBe(true)

    onScrollStop(bad)
    onScrollStop(cb)

    if ('onscrollend' in window) {
      window.dispatchEvent(new Event(WINDOW_EVENTS.SCROLLEND))
      expect(isScrolling()).toBe(false)
      // second scrollend — no pending timer arm
      window.dispatchEvent(new Event(WINDOW_EVENTS.SCROLLEND))
    } else {
      await flush(160)
      expect(isScrolling()).toBe(false)
    }

    expect(cb).toHaveBeenCalled()
  })

  test('module skips window listeners when no window exists', async () => {
    const win = globalThis.window

    jest.resetModules()

    delete globalThis.window

    await import('@core/utils/motion/scroll-state.js')

    globalThis.window = win
  })

  test('module re-eval covers both scrollend-support branches', async () => {
    const had = 'onscrollend' in window

    if (had) {
      // happy-dom defines onscrollend on the window instance AND the
      // BrowserWindow prototype — the `in` check needs every holder cleared.
      const stash = []

      let holder = window

      while (holder && holder !== Object.prototype) {
        const desc = Object.getOwnPropertyDescriptor(holder, 'onscrollend')

        if (desc) {
          stash.push([holder, desc])
          delete holder.onscrollend
        }

        holder = Object.getPrototypeOf(holder)
      }

      jest.resetModules()

      await import('@core/utils/motion/scroll-state.js')

      stash.forEach(([h, d]) => Object.defineProperty(h, 'onscrollend', d))
    } else {
      window.onscrollend = null
      jest.resetModules()

      await import('@core/utils/motion/scroll-state.js')

      delete window.onscrollend
    }
  })
})
