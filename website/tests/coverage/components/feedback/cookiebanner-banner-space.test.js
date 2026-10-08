/**
 * @file cookiebanner-banner-space.test.js
 * @description Coverage tail for CookieBanner's --cookie-banner-h
 * clearance channel — the banner publishes its rendered height on the
 * document root so <main> pads the page bottom and the fixed banner never
 * covers the footer (mobile legal-footer regression). Locks down the
 * publish/remove branches, the no-banner guard, the ResizeObserver
 * re-observe on re-render, the missing-RO environment guard, and
 * onDestroy teardown.
 */

import '@website/components/feedback/CookieBanner.js'
import { PREF_STORAGE_KEYS } from '@core/tokens/data/storage.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { COOKIE_CSS_PROPS } from '@core/tokens/css/cookies.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

const rootProp = () => document.documentElement.style.getPropertyValue(COOKIE_CSS_PROPS.BANNER_H)

const mountBanner = async (withTranslations = true) => {
  const el = document.createElement(COMPONENT_TAGS.COOKIE_BANNER)

  document.body.appendChild(el)

  if (withTranslations) {
    el.translations = {
      cookies: {
        message: TEST_TEXT.HELLO,
        accept: TEST_TEXT.HELLO,
        refuse: TEST_TEXT.HELLO,
      },
    }
  }

  await flush()

  return el
}

describe('CookieBanner --cookie-banner-h clearance', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    localStorage.clear()
    document.documentElement.style.removeProperty(COOKIE_CSS_PROPS.BANNER_H)
  })

  afterEach(() => {
    document.documentElement.style.removeProperty(COOKIE_CSS_PROPS.BANNER_H)
    delete globalThis.ResizeObserver
  })

  test('publishes the banner height while visible', async () => {
    const el = await mountBanner()

    // happy-dom layout reports 0px — the contract is that the property is
    // written; real browsers publish the measured px height.
    expect(rootProp()).not.toBe('')

    el.remove()
  })

  test('removes the property when consent hides the banner', async () => {
    const el = await mountBanner()

    expect(rootProp()).not.toBe('')

    el.handleAction(true)
    await flush()

    expect(rootProp()).toBe('')
    expect(el._resizeObserver).toBeNull()

    el.remove()
  })

  test('pre-consented mount never publishes (hidden path)', async () => {
    localStorage.setItem(PREF_STORAGE_KEYS.COOKIE, 'true')

    const el = await mountBanner()

    expect(rootProp()).toBe('')
    expect(el._resizeObserver).toBeNull()

    el.remove()
  })

  test('missing translations skip the publish (no banner node)', async () => {
    const el = await mountBanner(false)

    // render() returned null — no .cookies aside to measure or observe
    expect(rootProp()).toBe('')

    el.remove()
  })

  test('creates and releases the ResizeObserver when the API exists', async () => {
    const observed = []

    globalThis.ResizeObserver = class {
      observe(n) {
        observed.push(n)
      }

      disconnect() {}
    }

    const el = await mountBanner()

    expect(el._resizeObserver).not.toBeNull()
    expect(observed.length).toBeGreaterThan(0)

    el.remove()

    expect(el._resizeObserver).toBeNull()
  })

  test('re-render re-observes the rebuilt aside node', async () => {
    const observed = []

    globalThis.ResizeObserver = class {
      observe(n) {
        observed.push(n)
      }

      disconnect() {}
    }

    const el = await mountBanner()
    const firstCount = observed.length

    // Force a render cycle — the aside node is rebuilt and re-observed
    el._updateDom()
    await flush()

    expect(observed.length).toBeGreaterThan(firstCount)
    expect(rootProp()).not.toBe('')

    el.remove()
  })

  test('skips observer creation when ResizeObserver is unavailable', async () => {
    const el = await mountBanner()

    // No RO global in the plain happy-dom env — publish still ran,
    // observation is skipped cleanly.
    expect(rootProp()).not.toBe('')

    el.remove()
  })
})
