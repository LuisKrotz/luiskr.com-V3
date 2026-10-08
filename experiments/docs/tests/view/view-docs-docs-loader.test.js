/**
 * @file view-docs-docs-loader.test.js
 * @description Docs boot loader — the overlay mirrors the space
 * playground's system boot sequence with docs-context stage copy:
 * manifest → scene → file → ready. Covers the staged DOM writes
 * (message/percent/bar), the hold during an in-flight file fetch,
 * fade+remove dismissal, and that WebGL fallback never strands the page
 * behind the overlay.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { ViewDocs } from '@docs/Docs.js'
import { mount, waitFor } from '@tests/fixtures/test-constants.js'
import router from '@core/router/router.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { ROUTE_NAMES } from '@core/tokens/routes/names.js'
import { DOCS_CLASSES } from '@core/tokens/classes/docs.js'
import { DOCS_LOADER_PCT, DOCS_STRINGS } from '@core/tokens/strings/docs.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'

const makePayload = (over = {}) => ({
  name: 'website.md',
  path: 'docs/architecture/website.md',
  format: 'markdown',
  html: '<article><h1>Website</h1><p>rendered</p></article>',
  media: null,
  mtime: '2024-06-01T12:00:00.000Z',
  ...over,
})

const docsRoute = (docsPath = '') => ({
  name: ROUTE_NAMES.DOCS,
  view: VIEW_TAGS.VIEW_DOCS,
  lang: 'en',
  path: `${ROUTE_PATHS.DOCS}${docsPath ? `/${docsPath}` : ''}`,
  meta: { docsRoute: true },
  params: { docsPath },
})

describe('ViewDocs — docs boot loader', () => {
  let view
  let cleanup
  let pushSpy
  let origRoute
  let origFetch

  const flush = () => new Promise((r) => setTimeout(r, 0))

  const $ = (sel) => view.shadowRoot.querySelector(sel)

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
  })

  test('renders the boot overlay, reaches ready and is removed after the fade', async () => {
    router.currentRoute = docsRoute()

    view = new ViewDocs()
    cleanup = mount(view)

    // First usable state (root portal, nothing loading) → ready stage.
    expect(view._docsReady).toBe(true)
    expect(view._loaderMsg).toBe(DOCS_STRINGS.LOADER_MSG_READY)
    expect(view._loaderPct).toBe(DOCS_LOADER_PCT.READY)

    // The overlay fades rather than vanishing instantly.
    const loader = $(`.${DOCS_CLASSES.DOCS_LOADER}`)

    expect(loader.style.opacity).toBe(CHAR_STRINGS.ZERO)

    await waitFor(() => !$(`.${DOCS_CLASSES.DOCS_LOADER}`))
  })

  test('file routes hold the loader at the payload stage until the fetch settles', async () => {
    let resolveFetch

    globalThis.fetch = jest.fn(
      () =>
        new Promise((res) => {
          resolveFetch = res
        })
    )

    router.currentRoute = docsRoute('docs/architecture/website.md')

    view = new ViewDocs()
    cleanup = mount(view)

    expect(view.fileLoading).toBe(true)
    expect(view._docsReady).toBe(false)

    const loader = $(`.${DOCS_CLASSES.DOCS_LOADER}`)

    expect(loader).toBeTruthy()
    expect($(`.${DOCS_CLASSES.DOCS_LOADER_TITLE}`).textContent).toBe(DOCS_STRINGS.LOADER_TITLE)
    expect($(`.${DOCS_CLASSES.DOCS_LOADER_MSG}`).textContent).toBe(DOCS_STRINGS.LOADER_MSG_FILE)
    expect($(`.${DOCS_CLASSES.DOCS_LOADER_VAL}`).textContent).toBe(String(DOCS_LOADER_PCT.FILE))
    expect($(`.${DOCS_CLASSES.DOCS_LOADER_BAR_FILL}`).style.width).toBe(
      `${DOCS_LOADER_PCT.FILE}${CHAR_STRINGS.PERCENT}`
    )

    resolveFetch({ ok: true, json: async () => makePayload() })
    await flush()
    await flush()

    expect(view._docsReady).toBe(true)
    expect(view._loaderMsg).toBe(DOCS_STRINGS.LOADER_MSG_READY)
    expect($(`.${DOCS_CLASSES.DOCS_LOADER}`).style.opacity).toBe(CHAR_STRINGS.ZERO)
  })

  test('WebGL fallback still reaches ready — the loader never strands the page', () => {
    router.currentRoute = docsRoute()

    view = new ViewDocs()
    cleanup = mount(view)

    // happy-dom has no WebGL — both canvases fall back and the loader
    // still completes its lifecycle.
    expect(view.classList.contains(DOCS_CLASSES.DOCS_GL_FALLBACK)).toBe(true)
    expect(view._docsReady).toBe(true)
  })

  test('the loader markup is dropped from renders once the portal is ready', () => {
    router.currentRoute = docsRoute()

    view = new ViewDocs()
    cleanup = mount(view)

    view._updateDom()

    expect($(`.${DOCS_CLASSES.DOCS_LOADER}`)).toBeFalsy()
  })
})
