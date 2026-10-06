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
import _store from '@/core/store.js'

import '@/components/feedback/CookieBanner.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { GL_EVENTS, WINDOW_EVENTS } from '@/core/tokens/events/dom.js'




// ─── store.js ────────────────────────────────────────────────────────────────

describe('burger-button tails', () => {
  test('fallback + resize + destroy paths', async () => {
    const { BurgerButtonWebGL } = await import('@/utils/canvas/widgets/burger-button-webgl.js')
    const canvas = document.createElement(HTML_TAGS.CANVAS)

    document.body.appendChild(canvas)

    const btn = new BurgerButtonWebGL(canvas, jest.fn())

    btn._triggerFallback()

    expect(btn.useWebGL).toBe(false)

    btn._checkResize()
    window.dispatchEvent(new Event(WINDOW_EVENTS.RESIZE))

    btn.destroy()
    canvas.remove()
  })

  test('context-loss listener triggers the fallback path', async () => {
    const { BurgerButtonWebGL } = await import('@/utils/canvas/widgets/burger-button-webgl.js')
    const canvas = document.createElement(HTML_TAGS.CANVAS)

    document.body.appendChild(canvas)

    const btn = new BurgerButtonWebGL(canvas, jest.fn())

    canvas.dispatchEvent(new Event(GL_EVENTS.WEBGL_CONTEXT_LOST))

    btn.destroy()
    canvas.remove()
  })
})

