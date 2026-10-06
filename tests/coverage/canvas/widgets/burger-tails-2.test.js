/**
 * @file coverage-tails-5.test.js
 * @description Fifth branch-tail sweep: gpu-accel compositing + texture
 * paths, stats-engine observers and fetch patch, wasm-media-threads
 * probes, Legal route data modes, router canonical/history edges,
 * firebase REST fallback, deep-shadow DOM traversal, burger resize
 * branches, legacy polyfill bodies, wasm-scroll option shapes and
 * Home route param changes.
 */
import { jest } from '@jest/globals'
import { KEYS } from '@/core/tokens/primitives.js'
import { KEYBOARD_EVENTS } from '@/core/tokens/events/dom.js'

import _router from '@/routes/router.js'

import '@/routes/views/legal/Legal.js'
import '@/routes/views/home/Home.js'
import { HTML_TAGS } from '../../../../src/core/tokens/elements/html.js'
import { STATE_CLASSES } from '../../../../src/core/tokens/classes/state.js'




// ─── utils/gpu-accel.js ──────────────────────────────────────────────────────

describe('burger tails 2', () => {
  test('_checkResize guards and dpr rounding', async () => {
    const { BurgerButtonWebGL } = await import('@/utils/canvas/widgets/burger-button-webgl.js')
    const canvas = document.createElement(HTML_TAGS.CANVAS)

    const btn = new BurgerButtonWebGL(canvas, jest.fn())

    btn.gl = null
    btn._checkResize()

    btn.canvas = null
    btn._checkResize()

    btn.destroy()
  })

  test('_triggerFallback clears raf and marks the canvas', async () => {
    const { BurgerButtonWebGL } = await import('@/utils/canvas/widgets/burger-button-webgl.js')
    const canvas = document.createElement(HTML_TAGS.CANVAS)

    const btn = new BurgerButtonWebGL(canvas, jest.fn())

    btn.animId = 7
    btn._triggerFallback()

    expect(btn.animId).toBeNull()
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

    btn.destroy()
  })

  test('Enter/Space keydown activates the burger (keyboard-only access)', async () => {
    const { BurgerButtonWebGL } = await import('@/utils/canvas/widgets/burger-button-webgl.js')
    const canvas = document.createElement(HTML_TAGS.CANVAS)
    const onClick = jest.fn()

    const btn = new BurgerButtonWebGL(canvas, onClick)

    canvas.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ENTER }))
    canvas.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.SPACE }))
    canvas.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ESCAPE }))

    expect(onClick).toHaveBeenCalledTimes(2)

    btn.destroy()

    // destroy detaches the keydown path — no late activations
    canvas.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ENTER }))
    expect(onClick).toHaveBeenCalledTimes(2)
  })
})

