/**
 * @file intro-loader-tails.test.js
 * @description Split from coverage-tails-2.test.js — covers the "intro-loader tails" describe.
 */
import { jest } from '@jest/globals'
import store from '@core/store.js'

import { IntroLoader } from '@core/utils/canvas/loaders/intro-loader.js'

import '@website/components/feedback/CookieBanner.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms))

describe('intro-loader tails', () => {
  test('skips entirely once shown', () => {
    sessionStorage.setItem('lk_intro_shown', '1')

    const done = jest.fn()
    const loader = new IntroLoader(document.body, done)

    expect(done).toHaveBeenCalled()
    expect(loader.container).toBeNull()

    sessionStorage.removeItem('lk_intro_shown')
  })

  test('reduced motion marks shown and completes', () => {
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)

    const done = jest.fn()

    void new IntroLoader(document.body, done)

    expect(done).toHaveBeenCalled()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
  })

  test('full path builds the overlay and starts animating', async () => {
    sessionStorage.removeItem('lk_intro_shown')
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    const loader = new IntroLoader(document.body, jest.fn())

    expect(loader.container).toBeTruthy()

    await flush(30)

    loader.destroy?.()
    loader.container?.remove()
  })

  test('finish() completes even when the container is already detached', async () => {
    sessionStorage.removeItem('lk_intro_shown')
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    const done = jest.fn()
    const loader = new IntroLoader(document.body, done)

    loader.finish()
    loader.container.remove()

    await flush(600)

    expect(done).toHaveBeenCalled()
  })

  test('default root + full animation run appends log lines and finishes', async () => {
    sessionStorage.removeItem('lk_intro_shown')
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    const origRaf = globalThis.requestAnimationFrame

    globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 4)

    const done = jest.fn()
    const loader = new IntroLoader(undefined, done)

    // Poll instead of a fixed wait: under parallel load the setTimeout-RAF
    // ticks fire slower than 4ms, so a hard 1800ms can starve the run.
    for (let i = 0; i < 100 && !done.mock.calls.length; i++) await flush(60)

    globalThis.requestAnimationFrame = origRaf

    expect(done).toHaveBeenCalled()

    loader.container?.remove()
  }, 15000)

  test('init is a no-op without document', () => {
    const saved = globalThis.document

    delete globalThis.document

    try {
      const loader = new IntroLoader(null)

      expect(loader.container).toBeNull()
    } finally {
      globalThis.document = saved
    }
  })

  test('update loop tolerates a null percentEl; finish guards detached container', async () => {
    sessionStorage.removeItem('lk_intro_shown')
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    const loader = new IntroLoader(document.body, jest.fn())

    loader.percentEl = null
    await flush(60)

    loader.container?.remove()
    loader.finish()

    loader.container = null
    loader.finish()
  })
})
