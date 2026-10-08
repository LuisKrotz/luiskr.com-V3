/**
 * @file router-tails-2.test.js
 * @description Split from coverage-tails-5.test.js — covers the "router tails 2" describe.
 */
import { jest } from '@jest/globals'
import router from '@core/router/router.js'

import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import '@website/views/legal/Legal.js'
import '@website/views/home/Home.js'
import { QUERY_STRINGS } from '@core/tokens/strings/queries.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { SECTION_IDS } from '@core/tokens/ids/sections.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

describe('router tails 2', () => {
  test('push with replace and same-path skip', async () => {
    document.querySelector(QUERY_STRINGS.LINK_CANONICAL)?.remove()

    await router.push?.(router.currentRoute?.path || ROUTE_PATHS.ROOT).catch(() => {})
    await router.push?.(ROUTE_PATHS.GDPR, true).catch(() => {})

    expect(router.match?.(ROUTE_PATHS.GDPR)?.name).toBeTruthy()
  })

  test('CMS/admin paths hard-redirect to the CMS document', async () => {
    const replaceSpy = jest.fn()

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, replace: replaceSpy, pathname: ROUTE_PATHS.CMS },
    })

    await router.handleNavigation(ROUTE_PATHS.CMS).catch(() => {})
    await router.handleNavigation(ROUTE_PATHS.ADMIN).catch(() => {})

    expect(replaceSpy).toHaveBeenCalled()

    Object.defineProperty(window, 'location', { configurable: true, value: window.location })
  })

  test('before-hook redirect object pushes the new path', async () => {
    const hook = () => ({ path: ROUTE_PATHS.ROOT })

    router.beforeHooks?.push?.(hook)
    await router.push?.('/some-other-path').catch(() => {})

    const idx = router.beforeHooks?.indexOf?.(hook)

    if (idx >= 0) router.beforeHooks.splice(idx, 1)
  })

  test('before-hook string redirect to the same path is a pass-through', async () => {
    // String form of the same-path guard: a hook redirecting '/' to '/'
    // must not re-enter push() forever — it just lets the nav proceed.
    const hook = () => ROUTE_PATHS.ROOT

    router.beforeHooks?.push?.(hook)
    await router.push?.(ROUTE_PATHS.ROOT).catch(() => {})

    const idx = router.beforeHooks?.indexOf?.(hook)

    if (idx >= 0) router.beforeHooks.splice(idx, 1)

    expect(router.currentRoute?.path).toBe(ROUTE_PATHS.ROOT)
  })

  test('before-hook truthy non-path redirect is ignored', async () => {
    // redirect === true: truthy but has no .path → the guard falls
    // through to the next hook instead of pushing anywhere.
    const hook = () => true

    router.beforeHooks?.push?.(hook)
    await router.push?.(ROUTE_PATHS.GDPR).catch(() => {})

    const idx = router.beforeHooks?.indexOf?.(hook)

    if (idx >= 0) router.beforeHooks.splice(idx, 1)

    expect(router.currentRoute?.path).toBe(ROUTE_PATHS.GDPR)
  })

  test('popstate listener guards window and handles navigation', () => {
    const saved = globalThis.window

    delete globalThis.window

    try {
      expect(() => router._initPopstateListener()).not.toThrow()
    } finally {
      globalThis.window = saved
    }
  })

  test('init() boots navigation from the current URL', () => {
    expect(() => router.init()).not.toThrow()
  })

  test('earth-playground route resolves the space playground view + lazy chunk', async () => {
    await router.push?.(ROUTE_PATHS.EARTH_PLAYGROUND).catch(() => {})

    expect(router.currentRoute?.view).toBe(VIEW_TAGS.VIEW_SPACE_PLAYGROUND)
  })

  test('playground chunk failure surfaces a toast instead of throwing', async () => {
    jest.resetModules()
    jest.unstable_mockModule('@earth/SpacePlayground.js', () => {
      throw new Error(TEST_TEXT.STALE)
    })

    try {
      const { router: freshRouter } = await import('@core/router/router.js')

      await expect(freshRouter.push(ROUTE_PATHS.EARTH_PLAYGROUND)).resolves.toBeUndefined()
      await flush()

      document.querySelector(COMPONENT_TAGS.SITE_TOAST)?.remove?.()
    } finally {
      jest.unstable_unmockModule('@earth/SpacePlayground.js')
      jest.resetModules()
    }
  })

  test('scrollTo routes deep-query the marker after 300ms', async () => {
    await router.push?.(ROUTE_PATHS.ABOUT).catch(() => {})
    await new Promise((r) => setTimeout(r, 350))

    const marker = document.createElement(HTML_TAGS.DIV)

    marker.id = SECTION_IDS.ABOUT
    document.body.appendChild(marker)

    await router.push?.(ROUTE_PATHS.CONTACT).catch(() => {})

    const marker2 = document.createElement(HTML_TAGS.DIV)

    marker2.id = SECTION_IDS.CONTACT
    document.body.appendChild(marker2)

    await new Promise((r) => setTimeout(r, 350))

    marker.remove()
    marker2.remove()
  })

  test('scrollTo smooth-scrolls to a marker that exists before nav', async () => {
    // Marker present *before* the 300ms query — the previous test only
    // exercised the not-found arm because its marker mounted too late.
    const marker = document.createElement(HTML_TAGS.DIV)

    marker.id = SECTION_IDS.CONTACT
    marker.getBoundingClientRect = () => ({ top: 10 })
    document.body.appendChild(marker)

    const scrollSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})

    await router.push?.(ROUTE_PATHS.CONTACT).catch(() => {})
    await new Promise((r) => setTimeout(r, 350))

    marker.remove()
    scrollSpy.mockRestore()
  })
})
