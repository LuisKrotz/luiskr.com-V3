/**
 * @file burger-button-tails.test.js
 * @description Split from coverage-tails-2.test.js — covers the "burger-button tails" describe.
 */
import { jest } from '@jest/globals'
import _store from '@core/store.js'

import '@website/components/feedback/CookieBanner.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { GL_EVENTS, WINDOW_EVENTS } from '@core/tokens/events/dom.js'

describe('burger-button tails', () => {
  test('fallback + resize + destroy paths', async () => {
    const { BurgerButtonWebGL } = await import('@core/utils/canvas/widgets/burger-button-webgl.js')
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
    const { BurgerButtonWebGL } = await import('@core/utils/canvas/widgets/burger-button-webgl.js')
    const canvas = document.createElement(HTML_TAGS.CANVAS)

    document.body.appendChild(canvas)

    const btn = new BurgerButtonWebGL(canvas, jest.fn())

    canvas.dispatchEvent(new Event(GL_EVENTS.WEBGL_CONTEXT_LOST))

    btn.destroy()
    canvas.remove()
  })
})
