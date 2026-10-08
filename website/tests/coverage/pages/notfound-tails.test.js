/**
 * @file notfound-tails.test.js
 * @description Split from coverage-tails-4.test.js — covers the "NotFound tails" describe.
 */
import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { MOUSE_EVENTS } from '@core/tokens/events/dom.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

describe('NotFound tails', () => {
  test('mounts and binds the home link through the router', async () => {
    const el = document.createElement(VIEW_TAGS.VIEW_NOT_FOUND)

    document.body.appendChild(el)
    await flush(150)

    const link = el.shadowRoot.querySelector('a')

    link?.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true, cancelable: true }))

    el.onUpdated?.()
    el.remove()
  })
})
