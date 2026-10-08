/**
 * @file cookiebanner-tails.test.js
 * @description Split from coverage-tails-4.test.js — covers the "CookieBanner tails" describe.
 */
import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'
import { PREF_STORAGE_KEYS } from '@core/tokens/data/storage.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

describe('CookieBanner tails', () => {
  test('accept + refuse persist the answer and hide the banner', async () => {
    localStorage.removeItem(PREF_STORAGE_KEYS.COOKIE)

    const el = document.createElement(COMPONENT_TAGS.COOKIE_BANNER)

    document.body.appendChild(el)
    await flush()

    el.handleAction(true)

    expect(JSON.parse(localStorage.getItem(PREF_STORAGE_KEYS.COOKIE))).toBe(true)
    expect(el.hidden).toBe(true)

    el.handleAction(false)

    expect(JSON.parse(localStorage.getItem(PREF_STORAGE_KEYS.COOKIE))).toBe(false)

    el.remove()
  })
})
