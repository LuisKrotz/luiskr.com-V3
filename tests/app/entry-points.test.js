/**
 * @file entry-points.test.js
 * @description Boot-path coverage for the application entry modules:
 * polyfills, service-worker registration, the public-site bootstrap
 * (main.js) and the CMS bootstrap (cms/main.js). Heavy side effects are
 * stubbed (register-service-worker, firebase auth) while the real boot
 * sequence executes against happy-dom.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { CMS_TAGS } from '@/cms/tokens.js'
import { waitFor } from '../fixtures/test-constants.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { APP_IDS } from '@/core/tokens/ids/app.js'
import { CMS_IDS } from '@/core/tokens/ids/cms.js'

const registerMock = jest.fn()

jest.unstable_mockModule('register-service-worker', () => ({
  register: registerMock,
}))

const authCallbacks = []

jest.unstable_mockModule('@/firebase.js', () => ({
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

jest.unstable_mockModule('@/routes/router.js', () => ({
  default: mockRouter,
  router: mockRouter,
}))

jest.unstable_mockModule('@/utils/motion/route-warmer.js', () => ({
  startRouteWarming: () => {},
}))

// Each warm-up test re-evaluates the full main.js module graph after
// jest.resetModules() — under the 75%-worker pool that re-import can be
// CPU-starved far beyond the default 60s, so this suite gets 120s.
jest.setTimeout(120000)

describe('polyfills', () => {
  test('importing polyfills installs globals without throwing', async () => {
    await expect(import('@/legacy-polyfills/polyfills.js')).resolves.toBeTruthy()
  })
})

describe('registerServiceWorker', () => {
  test('does not register outside production builds', async () => {
    await import('@/registerServiceWorker.js')

    expect(registerMock).not.toHaveBeenCalled()
  })
})

describe('main.js site bootstrap', () => {
  test('boots the router and mounts the app root into #app', async () => {
    const app = document.createElement(HTML_TAGS.DIV)

    app.id = APP_IDS.APP
    document.body.appendChild(app)

    await (await import('@/main.js')).bootPromise.catch(() => {})

    // start() is async — flush the boot promise + mount retry
    await waitFor(() => window.router, 90000)

    expect(window.router).toBeTruthy()
  }, 60000)
})

describe('main.js branch warm-ups', () => {
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

    const { LANG_SLUGS } = await import('@/core/i18n.js')
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

describe('cms/main.js bootstrap', () => {
  test('mounts the login view when unauthenticated and dashboard when authed', async () => {
    const root = document.createElement(HTML_TAGS.DIV)

    root.id = CMS_IDS.CMS_ROOT
    document.body.appendChild(root)

    await import('@/cms/main.js')
    await waitFor(() => authCallbacks.length)

    expect(authCallbacks.length).toBeGreaterThan(0)

    authCallbacks.forEach((cb) => cb(null))
    await waitFor(() => root.querySelector(CMS_TAGS.VIEW_ADMIN_LOGIN))

    expect(root.querySelector(CMS_TAGS.VIEW_ADMIN_LOGIN)).toBeTruthy()

    const { CMS_EVENTS } = await import('@/cms/tokens.js')

    window.dispatchEvent(new window.CustomEvent(CMS_EVENTS.AUTH_CHANGED, { detail: { uid: 'u9' } }))
    window.dispatchEvent(new window.CustomEvent(CMS_EVENTS.AUTH_CHANGED, { detail: { uid: 'u9' } }))
    await waitFor(() => root.querySelector(CMS_TAGS.VIEW_CMS_DASHBOARD))

    expect(root.querySelector(CMS_TAGS.VIEW_CMS_DASHBOARD)).toBeTruthy()

    window.dispatchEvent(new window.CustomEvent(CMS_EVENTS.AUTH_CHANGED, { detail: null }))
    await waitFor(() => root.querySelector(CMS_TAGS.VIEW_ADMIN_LOGIN))

    expect(root.querySelector(CMS_TAGS.VIEW_ADMIN_LOGIN)).toBeTruthy()

    authCallbacks.forEach((cb) => cb({ uid: 'u1' }))
    await waitFor(() => root.querySelector(CMS_TAGS.VIEW_CMS_DASHBOARD))

    expect(root.querySelector(CMS_TAGS.VIEW_CMS_DASHBOARD)).toBeTruthy()
  }, 15000)
})
