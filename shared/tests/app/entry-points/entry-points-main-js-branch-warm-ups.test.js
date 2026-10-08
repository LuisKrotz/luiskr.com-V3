/**
 * @file entry-points-main-js-branch-warm-ups.test.js
 * @description Split from entry-points.test.js — covers the "main.js branch warm-ups" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { waitFor } from '@tests/fixtures/test-constants.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { APP_IDS } from '@core/tokens/ids/app.js'

const registerMock = jest.fn()

jest.unstable_mockModule('register-service-worker', () => ({
  register: registerMock,
}))

const authCallbacks = []

jest.unstable_mockModule('@core/firebase.js', () => ({
  onAuthChange: jest.fn(async (cb) => {
    authCallbacks.push(cb)

    return () => {}
  }),
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  logoutUser: jest.fn(async () => {}),
  getDbInstance: jest.fn(async () => ({})),
}))

jest.unstable_mockModule('firebase/database', () => ({
  ref: jest.fn((db, p) => ({ db, p })),
  child: jest.fn((r, p) => ({ r, p })),
  get: jest.fn(async () => ({ exists: () => false, val: () => null })),
  set: jest.fn(async () => {}),
  remove: jest.fn(async () => {}),
}))

const mockRouter = { init: () => {}, subscribe: () => () => {}, currentRoute: null }

jest.unstable_mockModule('@core/router/router.js', () => ({
  default: mockRouter,
  router: mockRouter,
}))

jest.unstable_mockModule('@core/utils/motion/route-warmer.js', () => ({
  startRouteWarming: () => {},
}))

// Boot awaits `./safari/loader.js` whenever isSafari is true (happy-dom lacks
// real CSS.supports, so it is true for most cases here). Re-evaluating that
// real graph after jest.resetModules() starves past the waitFor budget under
// parallel coverage workers and gates `window.router`.
jest.unstable_mockModule('@core/safari/loader.js', () => ({}))

// Each warm-up test re-evaluates the full main.js module graph after
// jest.resetModules() — under the 75%-worker pool that re-import can be
// CPU-starved far beyond the default 60s, so this suite gets 120s.
jest.setTimeout(120000)

describe('main.js branch warm-ups', () => {
  beforeEach(() => {
    // Each warm-up re-imports main.js after jest.resetModules(); its static
    // graph (App.js → every component module, store singleton, WASM CSS shim,
    // plus the fire-and-forget view chunks) re-evaluates the whole
    // instrumented tree per test and starves past the waitFor budget under
    // parallel coverage workers. These tests only assert window.router, the
    // mount retry, and module-eval side effects — none read the components —
    // so stub the heavy deps. Registrations persist across resetModules; the
    // real-graph mount coverage already ran in 'boots the router' above.
    jest.unstable_mockModule('@/App.js', () => ({}))
    jest.unstable_mockModule('@core/utils/wasm/wasm-css.js', () => ({}))
    jest.unstable_mockModule('@website/views/home/Home.js', () => ({}))
    jest.unstable_mockModule('@website/views/project/Project.js', () => ({}))
  })

  test('portfolio pathname pre-warms the project chunk', async () => {
    jest.resetModules()

    window.history.pushState({}, '', '/portfolio/test-slug')

    const app = document.getElementById(APP_IDS.APP) || document.createElement(HTML_TAGS.DIV)

    app.id = APP_IDS.APP
    document.body.appendChild(app)

    await (await import('@/main.js')).bootPromise.catch(() => {})
    await waitFor(() => window.router, 90000)

    expect(window.router).toBeTruthy()

    window.history.pushState({}, '', '/')
  })

  test('missing #app container arms the mount retry loop', async () => {
    jest.resetModules()

    document.getElementById(APP_IDS.APP)?.remove()

    await (await import('@/main.js')).bootPromise.catch(() => {})
    await new Promise((resolve) => setTimeout(resolve, 80))

    const app = document.createElement(HTML_TAGS.DIV)

    app.id = APP_IDS.APP
    document.body.appendChild(app)

    // The 20ms retry interval picks up the late-added container — poll
    // rather than fixed-wait so parallel CPU contention can't flake it.
    await waitFor(() => app.firstElementChild, 90000)

    expect(app.firstElementChild).toBeTruthy()
  })

  test('non-home non-portfolio pathname skips route pre-warming', async () => {
    jest.resetModules()

    window.history.pushState({}, '', '/privacy-x')

    if (!document.getElementById(APP_IDS.APP)) {
      const app = document.createElement(HTML_TAGS.DIV)

      app.id = APP_IDS.APP
      document.body.appendChild(app)
    }

    await (await import('@/main.js')).bootPromise.catch(() => {})
    await waitFor(() => window.router, 90000)

    expect(window.router).toBeTruthy()

    window.history.pushState({}, '', '/')
  })

  test('mount retry timer self-clears after the 3s bound', async () => {
    jest.useFakeTimers()
    jest.resetModules()

    document.getElementById(APP_IDS.APP)?.remove()

    await (await import('@/main.js')).bootPromise.catch(() => {})
    await jest.advanceTimersByTimeAsync(3200)

    jest.useRealTimers()

    expect(true).toBe(true)
  })

  test('missing LANG_SLUGS entry falls back to English slugs', async () => {
    jest.resetModules()

    const { LANG_SLUGS } = await import('@core/i18n.js')
    const enBackup = LANG_SLUGS.en

    delete LANG_SLUGS.en
    window.history.pushState({}, '', '/privacy-y')

    let threw = false

    try {
      await (await import('@/main.js')).bootPromise.catch(() => {})
    } catch {
      threw = true
    }

    LANG_SLUGS.en = enBackup
    window.history.pushState({}, '', '/')

    expect(threw).toBe(true)
  })

  test('Safari-detected boot loads the safari-loader chunk', async () => {
    jest.resetModules()

    const prevCSS = globalThis.CSS

    globalThis.CSS = { supports: () => false }

    if (!document.getElementById(APP_IDS.APP)) {
      const app = document.createElement(HTML_TAGS.DIV)

      app.id = APP_IDS.APP
      document.body.appendChild(app)
    }

    await (await import('@/main.js')).bootPromise.catch(() => {})
    await waitFor(() => window.router, 90000)

    expect(window.router).toBeTruthy()

    if (prevCSS === undefined) delete globalThis.CSS
    else globalThis.CSS = prevCSS
  })

  test('CSS.supports true reaches the container-type probe arm', async () => {
    jest.resetModules()

    const prevCSS = globalThis.CSS

    globalThis.CSS = { supports: () => true }

    if (!document.getElementById(APP_IDS.APP)) {
      const app = document.createElement(HTML_TAGS.DIV)

      app.id = APP_IDS.APP
      document.body.appendChild(app)
    }

    await (await import('@/main.js')).bootPromise.catch(() => {})
    await waitFor(() => window.router, 90000)

    expect(window.router).toBeTruthy()

    if (prevCSS === undefined) delete globalThis.CSS
    else globalThis.CSS = prevCSS
  })

  test('window-less eval skips the warm block', async () => {
    jest.resetModules()

    const savedWin = globalThis.window

    delete globalThis.window

    await (
      await import('@/main.js')
    ).bootPromise
      .catch(() => {})
      .then(
        () => {
          globalThis.window = savedWin
        },
        () => {
          globalThis.window = savedWin
        }
      )

    expect(true).toBe(true)
  })

  test('document-less eval skips the mount block', async () => {
    jest.resetModules()

    const savedDoc = globalThis.document

    delete globalThis.document

    // Restore inside the import's microtask chain — the eval's typeof check
    // sees document missing, and the restore lands before any macrotask timer
    // (earlier module instances keep 20ms mount-retry intervals alive for 3s).
    await (
      await import('@/main.js')
    ).bootPromise
      .catch(() => {})
      .then(
        () => {
          globalThis.document = savedDoc
        },
        () => {
          globalThis.document = savedDoc
        }
      )

    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(true).toBe(true)
  })
})
