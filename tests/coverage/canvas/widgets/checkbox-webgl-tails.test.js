/**
 * @file coverage-tails-2.test.js
 * @description Second branch-tail sweep: store init/mutation edges,
 * Component mount/remount fallbacks, predictive-loader observer paths,
 * wasm-smooth-scroll option shapes, WebGL pool purge/restore, intro
 * loader early exits, checkbox/burger canvas widgets, local media cache
 * fallbacks, the SWR db layer, NPU predictor tiers, and the legacy DOM
 * polyfill bodies.
 */
import { jest } from '@jest/globals'
import { THEME_CSS_PROPS } from '@/core/tokens/css/theme.js'
import _store from '@/core/store.js'

import { CheckboxWebGL } from '@/playground/space/checkbox-webgl.js'
import '@/components/feedback/CookieBanner.js'

import { attachMock2D } from '../../../fixtures/mock-webgl.js'
import { TEST_COLORS, TEST_TEXT } from '../../../fixtures/test-constants.js'
import { HTML_TAGS } from '../../../../src/core/tokens/elements/html.js'


const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms))

// ─── store.js ────────────────────────────────────────────────────────────────

describe('checkbox-webgl tails', () => {
  test('init guards, setChecked loop and destroy', async () => {
    const none = new CheckboxWebGL(null, true)

    expect(none.ctx2d).toBeNull()

    const canvas = document.createElement(HTML_TAGS.CANVAS)
    const cb = new CheckboxWebGL(canvas, true, jest.fn())

    expect(cb.isChecked).toBe(true)
    expect(cb.progress).toBe(1)

    cb.setChecked(false)

    expect(cb.targetP).toBe(0)

    cb.setChecked(true)
    await flush(120)

    cb.destroy()

    const bad = document.createElement(HTML_TAGS.CANVAS)

    bad.getContext = () => { throw new Error(TEST_TEXT.SECOND) }

    const broken = new CheckboxWebGL(bad, false)

    expect(broken.ctx2d).toBeNull()
    broken.destroy()
  })

  test('setChecked from rest starts the loop and settles to the target', async () => {
    const canvas = document.createElement(HTML_TAGS.CANVAS)
    const cb = new CheckboxWebGL(canvas, false)

    // box at rest: animId null → setChecked spins the loop up
    expect(cb.animId).toBeNull()

    cb.setChecked(true)

    expect(cb.animId).not.toBeNull()

    // Drive the frames manually — real rAF timers are unreliable under
    // parallel coverage load; each tick eases until the settle arm stops it.
    let guard = 0

    while (cb.animId && guard++ < 100) cb._renderTick()

    expect(cb.progress).toBe(1)
    expect(cb.animId).toBeNull()

    // settle→rest state, then toggle back — exercises the loop again
    cb.setChecked(false)

    guard = 0
    while (cb.animId && guard++ < 100) cb._renderTick()

    expect(cb.progress).toBe(0)

    cb.destroy()
  })

  test('_sampleInk falls back to null ink when no theme vars parse', async () => {
    const canvas = document.createElement(HTML_TAGS.CANVAS)
    const origGCS = globalThis.getComputedStyle

    globalThis.getComputedStyle = () => ({ getPropertyValue: () => TEST_COLORS.INVALID })

    try {
      const cb = new CheckboxWebGL(canvas, false)

      expect(cb._ink).toBeNull()

      cb.destroy()
    } finally {
      globalThis.getComputedStyle = origGCS
    }
  })

  test('draws the tick once a 2D context and parsed ink are available', async () => {
    const canvas = document.createElement(HTML_TAGS.CANVAS)

    attachMock2D(canvas)

    const origGCS = globalThis.getComputedStyle

    globalThis.getComputedStyle = () => ({
      getPropertyValue: (prop) =>
        prop === THEME_CSS_PROPS.COLOR_ACCENT_CONTRAST ? TEST_COLORS.INK : TEST_COLORS.INVALID })

    try {
      // one-arg constructor hits both default-param arms
      const cb = new CheckboxWebGL(canvas)

      expect(cb._ink).toBe(TEST_COLORS.INK_CHANNELS)

      cb.setChecked(true)

      // _startLoop while the loop is already armed → re-entry guard arm
      cb._startLoop()

      // Drive the frames manually — real rAF timers are unreliable under
      // parallel coverage load; each tick eases until the settle arm stops it.
      let guard = 0

      while (cb.animId && guard++ < 100) cb._renderTick()

      // settle arm drew a frame with ctx + ink through the full _draw body
      expect(cb.progress).toBe(1)
      expect(cb.animId).toBeNull()

      cb.setChecked(false)

      // destroy mid-animation → cancelAnimationFrame arm
      cb.destroy()

      // post-destroy setChecked → _sampleInk null-canvas guard arm
      cb.setChecked(true)
    } finally {
      globalThis.getComputedStyle = origGCS
    }
  })

  test('_sampleInk falls back to text ink when the accent var is absent', () => {
    const canvas = document.createElement(HTML_TAGS.CANVAS)
    const origGCS = globalThis.getComputedStyle

    globalThis.getComputedStyle = () => ({
      getPropertyValue: (prop) =>
        prop === THEME_CSS_PROPS.TEXT_PRIMARY ? TEST_COLORS.INK : TEST_COLORS.INVALID })

    try {
      const cb = new CheckboxWebGL(canvas, false)

      expect(cb._ink).toBe(TEST_COLORS.INK_CHANNELS)

      cb.destroy()
    } finally {
      globalThis.getComputedStyle = origGCS
    }
  })
})

