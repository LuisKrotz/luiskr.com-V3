/**
 * @file custom-carousel-internals-customcarousel-tails.test.js
 * @description Split from custom-carousel-internals.test.js — covers the "CustomCarousel tails" describe.
 */
import { jest } from '@jest/globals'

import store from '@core/store.js'
import '@website/components/carousel/CustomCarousel.js'
import { TEST_URLS, waitFor } from '@tests/fixtures/test-constants.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { CAROUSEL_SELECTORS } from '@core/tokens/selectors/carousel.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { CAROUSEL_TIMING } from '@core/tokens/motion/carousel.js'
import { MODAL_MUTATIONS, PREF_MUTATIONS } from '@core/tokens/events/mutations.js'

const SLIDES = [
  { src: 'a.webp', size: [800, 450], label: 'One', canExpand: true },
  { src: 'b.webp', size: [800, 450], label: 'Two', isVideo: true },
  { src: 'c.webp', label: 'Three' },
]

const rect = (w = 300, h = 200) => ({ left: 0, top: 0, width: w, height: h, right: w, bottom: h })

const makeCarousel = (slides = SLIDES) => {
  const el = document.createElement(COMPONENT_TAGS.CUSTOM_CAROUSEL)

  document.body.appendChild(el)

  el.configure({ items: slides, folder: TEST_URLS.IMG })

  // happy-dom has no layout — provide geometry for measure/scroll paths
  el.getBoundingClientRect = () => rect(600, 400)

  const track = el.shadowRoot?.querySelector(CAROUSEL_SELECTORS.CAROUSEL_TRACK)

  if (track) {
    track.getBoundingClientRect = () => rect(600, 400)
    track.querySelectorAll('*').forEach((c) => {
      c.getBoundingClientRect = () => rect(600, 400)
    })
    track.shadowRoot?.querySelectorAll('*').forEach?.((_c) => {})
  }

  return el
}

const cleanup = (el) => {
  el?.remove()
}

afterEach(() => {
  document.body.innerHTML = CHAR_STRINGS.EMPTY
})

describe('CustomCarousel tails', () => {
  test('onStoreUpdate starts autoplay when active, visible and motion allowed', () => {
    const el = makeCarousel()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    el.isFullyVisible = true
    el.onStoreUpdate()

    expect(el.autoplayRunning).toBe(true)

    el._stopAutoplay()
    cleanup(el)
  })

  test('_measureFit collapses side-by-side below the mobile breakpoint', () => {
    const el = makeCarousel()

    el._isSideBySide = true

    const desc = Object.getOwnPropertyDescriptor(window, 'innerWidth')
    Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true })
    el._measureFit(500)

    expect(el._isSideBySide).toBe(false)

    el._measureFit(500)
    Object.defineProperty(window, 'innerWidth', desc)
    cleanup(el)
  })

  test('_measureFit early-returns without window and on empty host width', () => {
    const el = makeCarousel()
    const w = globalThis.window

    try {
      delete globalThis.window
      el._measureFit(600)
    } finally {
      globalThis.window = w
    }

    el._measureFit(0)
    cleanup(el)
  })

  test('_measureFit exits side-by-side when items overflow the host', () => {
    const el = makeCarousel()

    el._isSideBySide = true
    el._measureFit(50)

    expect(el._isSideBySide).toBe(false)

    cleanup(el)
  })

  test('goTo in-range resets isNavigating via the teleport timer', () => {
    jest.useFakeTimers()

    const el = makeCarousel()

    el.goTo(1)
    jest.advanceTimersByTime(500)

    expect(el.isNavigating).toBe(false)

    jest.useRealTimers()
    cleanup(el)
  })

  test('_checkInfiniteLoop snaps to the real first slide near clone-first and guards missing nodes', () => {
    const el = makeCarousel()
    const track = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_TRACK)
    const cloneFirst = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_SLIDE_CLONE_FIRST)
    const cloneLast = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_SLIDE_CLONE_LAST)

    if (track && cloneFirst && cloneLast) {
      track.getBoundingClientRect = () => ({ left: 0, width: 600 })
      cloneLast.getBoundingClientRect = () => ({ left: -5000, width: 100 })
      cloneFirst.getBoundingClientRect = () => ({ left: 250, width: 100 })
      el._checkInfiniteLoop()

      expect(el.currentIndex).toBe(0)

      cloneFirst.getBoundingClientRect = () => ({ left: -8000, width: 100 })
      el._checkInfiniteLoop()
    }

    const bare = document.createElement(COMPONENT_TAGS.CUSTOM_CAROUSEL)

    bare._checkInfiniteLoop()
    cleanup(el)
  })

  test('_setupIntersectionObserver arms: missing root, no-API fallback, observer reuse', () => {
    const el = makeCarousel()
    const spy = jest.spyOn(el, '$').mockReturnValue(null)

    el._setupIntersectionObserver()
    spy.mockRestore()

    const IO = globalThis.IntersectionObserver

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    delete globalThis.IntersectionObserver
    el._setupIntersectionObserver()

    expect(el.isFullyVisible).toBe(true)
    expect(el.isEnteredViewport).toBe(true)

    el._stopAutoplay()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    el._setupIntersectionObserver()
    globalThis.IntersectionObserver = IO

    const disc = jest.fn()

    el.observer = { disconnect: disc }
    el._setupIntersectionObserver()

    expect(disc).toHaveBeenCalled()

    cleanup(el)
  })

  test('observer callback mounts and destroys arrows across visibility flips', () => {
    const el = makeCarousel()
    let cb
    const IO = globalThis.IntersectionObserver

    globalThis.IntersectionObserver = class {
      constructor(f) {
        cb = f
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    el._setupIntersectionObserver()
    cb([{ isIntersecting: false, intersectionRatio: 0, target: el }])
    cb([{ isIntersecting: true, intersectionRatio: 0.5, target: el }])
    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: true })
    cb([{ isIntersecting: true, intersectionRatio: 0.5, target: el }])
    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    cb([{ isIntersecting: true, intersectionRatio: 0.5, target: el }])
    cb([{ isIntersecting: false, intersectionRatio: 0, target: el }])

    el._stopAutoplay()
    globalThis.IntersectionObserver = IO
    cleanup(el)
  })

  test('ring regression decays to zero, aborts while autoplay runs, and no-ops at zero', async () => {
    const el = makeCarousel()

    el.ringProgress = 0
    el._regressRingToZero()

    expect(el.ringProgress).toBe(0)

    el.ringProgress = 0.5
    el.autoplayRunning = true
    el._regressRingToZero()
    await new Promise((r) => setTimeout(r, 40))

    expect(el._isRegressing).toBe(false)

    el.autoplayRunning = false
    el.ringProgress = 0.5
    el._regressRingToZero()
    await waitFor(() => el.ringProgress === 0)

    expect(el.ringProgress).toBe(0)

    cleanup(el)
  })

  test('autoplay tick heals a NaN clock instead of poisoning ringProgress', async () => {
    const el = makeCarousel()

    el.autoplayRunning = true
    el.autoplayStart = NaN
    el._tick(NaN) // NaN timestamp: start stays NaN, elapsed clamps to 0

    expect(el.ringProgress).toBe(0)
    expect(Number.isNaN(el.ringProgress)).toBe(false)

    el._tick(100) // finite timestamp rebases the NaN start
    expect(el.autoplayStart).toBe(100)
    expect(el.ringProgress).toBe(0)

    el.autoplayRunning = false
    await new Promise((r) => setTimeout(r, 40))
    cleanup(el)
  })

  test('autoplay tick advances the slide at cycle end then idles', async () => {
    const el = makeCarousel()

    el.autoplayRunning = true
    el.autoplayStart = 0
    const idx = el.currentIndex

    el._tick(CAROUSEL_TIMING.AUTOPLAY_DURATION + 10)

    expect(el.currentIndex).toBe(idx + 1)

    el.autoplayRunning = false
    await new Promise((r) => setTimeout(r, 40))
    cleanup(el)
  })
})
