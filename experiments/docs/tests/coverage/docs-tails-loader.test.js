/**
 * @file coverage/docs-tails-loader.test.js
 * @description Coverage tails for docs/loader.ts + the Docs.tsx loader
 * wiring — the no-overlay no-op arms (bare element, post-ready state),
 * the timed fade-removal, and dismissal via a failed payload fetch.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { ViewDocs } from '@docs/Docs.js'
import { dismissDocsLoader, updateDocsLoader } from '@docs/loader.js'
import { mount } from '@tests/fixtures/test-constants.js'
import router from '@core/router/router.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { ROUTE_NAMES } from '@core/tokens/routes/names.js'
import { DOCS_CLASSES } from '@core/tokens/classes/docs.js'
import { DOCS_STRINGS, DOCS_LOADER_PCT } from '@core/tokens/strings/docs.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { ANIMATION_DURATIONS } from '@core/tokens/motion/animation.js'

const docsRoute = (docsPath = '') => ({
  name: ROUTE_NAMES.DOCS,
  view: VIEW_TAGS.VIEW_DOCS,
  lang: 'en',
  path: `${ROUTE_PATHS.DOCS}${docsPath ? `/${docsPath}` : ''}`,
  meta: { docsRoute: true },
  params: { docsPath },
})

describe('docs loader — coverage tails', () => {
  let view
  let cleanup
  let pushSpy
  let origRoute
  let origFetch

  const flush = () => new Promise((r) => setTimeout(r, 0))

  beforeEach(() => {
    origRoute = router.currentRoute
    origFetch = globalThis.fetch

    pushSpy = jest.spyOn(router, 'push').mockImplementation(async () => {})
  })

  afterEach(() => {
    cleanup?.()

    cleanup = undefined
    view = undefined

    pushSpy.mockRestore()

    router.currentRoute = origRoute
    globalThis.fetch = origFetch
    jest.useRealTimers()
  })

  test('updateDocsLoader no-ops when the overlay nodes are absent', () => {
    // Bare element — shadow root exists but no content was rendered, so
    // all three loader queries hit their null arms without throwing.
    view = new ViewDocs()

    expect(() =>
      updateDocsLoader(view, DOCS_STRINGS.LOADER_MSG_MANIFEST, DOCS_LOADER_PCT.MANIFEST)
    ).not.toThrow()

    expect(view._loaderMsg).toBe(DOCS_STRINGS.LOADER_MSG_MANIFEST)
    expect(view._loaderPct).toBe(DOCS_LOADER_PCT.MANIFEST)
  })

  test('dismissDocsLoader no-ops when no overlay exists', () => {
    view = new ViewDocs()

    expect(() => dismissDocsLoader(view)).not.toThrow()
  })

  test('dismiss fades then removes the overlay node after the transition', () => {
    router.currentRoute = docsRoute()

    view = new ViewDocs()
    cleanup = mount(view)

    jest.useFakeTimers()

    // The post-ready dismiss left the fading node in place — a second
    // call drives the setTimeout removal deterministically.
    view._dismissLoader()
    jest.advanceTimersByTime(ANIMATION_DURATIONS.LOADER_FADE_MS)

    expect(view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS_LOADER}`)).toBeFalsy()
  })

  test('post-ready updates leave the loader lifecycle untouched', () => {
    router.currentRoute = docsRoute()

    view = new ViewDocs()
    cleanup = mount(view)

    // Re-render after readiness: _syncLoader early-returns and the scene
    // remount guard takes its false arm — no loader state changes.
    view._updateDom()

    expect(view._docsReady).toBe(true)
    expect(view._loaderMsg).toBe(DOCS_STRINGS.LOADER_MSG_READY)
  })

  test('onRouteParamChange with no route descriptor falls back to the portal root', () => {
    router.currentRoute = docsRoute()

    view = new ViewDocs()
    cleanup = mount(view)

    view.onRouteParamChange()

    expect(view.docsPath).toBe(CHAR_STRINGS.EMPTY)
    expect(view.node).toBe(null)
  })

  test('a failed payload fetch still settles the loader', async () => {
    globalThis.fetch = jest.fn(async () => ({ ok: false, json: async () => null }))

    router.currentRoute = docsRoute('docs/architecture/website.md')

    view = new ViewDocs()
    cleanup = mount(view)

    await flush()
    await flush()

    expect(view.fileLoading).toBe(false)
    expect(view.filePayload).toBe(null)
    expect(view._docsReady).toBe(true)
  })
})
