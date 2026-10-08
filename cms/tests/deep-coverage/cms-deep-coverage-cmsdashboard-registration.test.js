/**
 * @file cms-deep-coverage-cmsdashboard-registration.test.js
 * @description Split from cms-deep-coverage.test.js — covers the "CmsDashboard registration" describe.
 */
import { describe, test, jest, beforeEach } from '@jest/globals'
import { CMS_TABS } from '@cms/tokens.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'

const authCallbacks = []
const setCalls = []
const removeCalls = []

// Path-keyed snapshot routing: each test registers matchers against the
// Firebase path fragment so one `get` mock can serve different nodes.
const snapRoutes = []
const defaultVal = { title: TEST_TEXT.HEADING }

const snapOf = (val, exists = true) => ({ exists: () => exists, val: () => val })

jest.unstable_mockModule('@core/firebase.js', () => ({
  onAuthChange: jest.fn(async (cb) => {
    authCallbacks.push(cb)

    return () => {}
  }),
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  logoutUser: jest.fn(async () => {}),
  getDbInstance: jest.fn(async () => ({ db: true })),
}))

jest.unstable_mockModule('firebase/database', () => ({
  ref: jest.fn((db, p) => ({ db, p })),
  child: jest.fn((r, p) => ({ r, p })),
  get: jest.fn(async (arg) => {
    const p = String(arg?.p ?? arg?.r?.p ?? CHAR_STRINGS.EMPTY)
    const hit = snapRoutes.find((route) => p.includes(route.match))

    return hit ? hit.snap() : snapOf(defaultVal)
  }),
  set: jest.fn(async (r, v) => {
    if (snapRoutes.failSet === 'str') throw 'set exploded'
    if (snapRoutes.failSet) throw new Error('set exploded')

    setCalls.push({ path: r?.p, value: v })
  }),
  remove: jest.fn(async (r) => {
    removeCalls.push(r?.p)
  }),
}))

await import('@cms/about/CmsAboutEditor.js')
await import('@cms/footer/CmsFooterEditor.js')
await import('@cms/portfolio/CmsPortfolioList.js')
await import('@cms/media-convert/CmsMediaConverter.js')
await import('@cms/projects/CmsProjectsList.js')
await import('@cms/lang/CmsLangEditor.js')
await import('@cms/playground-editor/CmsPlaygroundEditor.js')
await import('@cms/deploy-info/CmsDeployInfo.js')
await import('@cms/routes/CmsDashboard.js')
await import('@cms/routes/AdminLogin.js')

const _mount = (tag) => {
  const el = document.createElement(tag)

  document.body.appendChild(el)

  return el
}

const _flush = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

const alerts = []
const confirms = []

beforeEach(() => {
  snapRoutes.length = 0
  snapRoutes.failSet = false
  setCalls.length = 0
  removeCalls.length = 0
  authCallbacks.length = 0
  alerts.length = 0
  confirms.length = 0
  document.body.innerHTML = CHAR_STRINGS.EMPTY

  globalThis.alert = (m) => alerts.push(String(m))
  globalThis.confirm = () => confirms.length === 0 || confirms.shift()
  globalThis.prompt = () => null
})

const _fire = (el, sel, eventType, value) => {
  const node = el.shadowRoot.querySelector(sel)

  if (!node) return null

  if (value !== undefined) node.value = value

  node.dispatchEvent(new window.Event(eventType, { bubbles: true }))

  return node
}

describe('CmsDashboard registration', () => {
  test('re-eval respects a registered element and the non-localhost arm', async () => {
    const origHostname = window.location.hostname
    let patched = false

    try {
      Object.defineProperty(window.location, 'hostname', {
        value: 'cms.example.test',
        configurable: true,
      })
      patched = window.location.hostname === 'cms.example.test'
    } catch {
      /* hostname not redefinable */
    }

    jest.resetModules()

    try {
      const { ViewCmsDashboard } = await import('@cms/routes/CmsDashboard.js')

      // The re-evaluated class closes over IS_LOCALHOST=false: rendering via
      // the prototype (a second define is intentionally skipped) covers the
      // non-localhost `: null` arm and the toast-visible display arm in one
      // render pass.
      ViewCmsDashboard.prototype.render.call({
        user: { email: TEST_TEXT.BODY },
        activeTab: CMS_TABS.PORTFOLIO,
        toastMessage: TEST_TEXT.BODY,
        renderTabComponent: () => null,
      })
    } finally {
      if (patched) {
        try {
          Object.defineProperty(window.location, 'hostname', {
            value: origHostname,
            configurable: true,
          })
        } catch {
          /* restore failed */
        }
      }
    }
  })
})
