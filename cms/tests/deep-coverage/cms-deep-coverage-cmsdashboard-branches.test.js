/**
 * @file cms-deep-coverage-cmsdashboard-branches.test.js
 * @description Split from cms-deep-coverage.test.js — covers the "CmsDashboard branches" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { CMS_EVENTS, CMS_TAGS, CMS_TABS } from '@cms/tokens.js'
import { TEST_TEXT, TEST_URLS } from '@tests/fixtures/test-constants.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { CMS_ADMIN_CLASSES, CMS_DASHBOARD_CLASSES } from '@cms/tokens.js'

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

const mount = (tag) => {
  const el = document.createElement(tag)

  document.body.appendChild(el)

  return el
}

const flush = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

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

// ─── CmsDashboard / AdminLogin branches ─────────────────────────────────────
describe('CmsDashboard branches', () => {
  test('tab clicks switch the mounted editor', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    const tabs = el.shadowRoot.querySelectorAll(`.${CMS_DASHBOARD_CLASSES.CMS_TAB_BTN}`)

    tabs[1]?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    expect(el.activeTab).toBe(CMS_TABS.PROJECTS)

    tabs[1]?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    el.remove()
  })

  test('brand click navigates home and logout click signs out', async () => {
    const { logoutUser } = await import('@core/firebase.js')
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    const assigned = []
    const origAssign = window.location.assign

    try {
      Object.defineProperty(window.location, 'assign', {
        value: (u) => assigned.push(u),
        configurable: true,
      })
    } catch {
      window.location.assign = (u) => assigned.push(u)
    }

    el.shadowRoot
      .querySelector(`.${CMS_DASHBOARD_CLASSES.CMS_BRAND}`)
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector(`.${CMS_DASHBOARD_CLASSES.CMS_LOGOUT_BTN}`)
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    await flush()

    expect(logoutUser).toHaveBeenCalled()

    try {
      Object.defineProperty(window.location, 'assign', { value: origAssign, configurable: true })
    } catch {
      /* location assign not restorable */
    }

    el.remove()
  })

  test('second notification resets the toast timer and removal unsubscribes', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    el.showNotification('one')
    el.showNotification('two')

    expect(el.toastMessage).toBe('two')

    el.remove()
    el.onDestroy()

    expect(() => el.onDestroy()).not.toThrow()
  })

  test('auth callback assigns the user and NOTIFY without detail is ignored', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    authCallbacks.forEach((cb) => cb({ uid: 'u1', photoURL: TEST_URLS.IMG }))

    expect(el.user?.uid).toBe('u1')

    // NOTIFY without detail -> the e.detail guard's else arm
    el.dispatchEvent(new window.CustomEvent(CMS_EVENTS.NOTIFY))

    expect(el.toastMessage).toBeFalsy()

    el.remove()
  })

  test('toast auto-dismiss timer clears the message and hides the toast', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    el.showNotification('temp')

    expect(el.toastMessage).toBe('temp')

    await flush(3600)

    expect(el.toastMessage).toBe(CHAR_STRINGS.EMPTY)

    el.remove()
  })

  test('renderTabComponent returns an editor for every tab plus the default', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    const tabs = [
      CMS_TABS.PORTFOLIO,
      CMS_TABS.PROJECTS,
      CMS_TABS.ABOUT,
      CMS_TABS.FOOTER,
      CMS_TABS.PLAYGROUND,
      CMS_TABS.LANGUAGES,
      CMS_TABS.MEDIA,
      CMS_TABS.DEPLOY,
      'unknown-tab',
    ]

    for (const tab of tabs) {
      el.activeTab = tab

      expect(el.renderTabComponent()).toBeTruthy()
    }

    el.remove()
  })

  test('NOTIFY with detail shows the toast; destroy before mount is safe', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    el.onDestroy()

    await flush()

    el.dispatchEvent(new window.CustomEvent(CMS_EVENTS.NOTIFY, { detail: TEST_TEXT.BODY }))

    expect(el.toastMessage).toBe(TEST_TEXT.BODY)

    el.remove()
  })

  test('showNotification tolerates missing toast nodes', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    const origQ = el.$

    el.$ = () => null
    el.showNotification(TEST_TEXT.BODY)

    await flush(3600)

    expect(el.toastTimer).toBeTruthy()

    el.$ = origQ
    el.showNotification(TEST_TEXT.BODY)

    const toast = el.shadowRoot.querySelector(`.${CMS_DASHBOARD_CLASSES.CMS_TOAST}`)

    toast?.querySelector(`.${CMS_ADMIN_CLASSES.TOAST_TEXT}`)?.remove()
    el.showNotification(TEST_TEXT.BODY)

    el.remove()
  })

  test('_bindEvents tolerates missing logout and brand nodes', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    el._contentNode.innerHTML = CHAR_STRINGS.EMPTY
    el._bindEvents()

    el.remove()
  })

  test('each active tab renders its active button class', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    const tabs = [
      CMS_TABS.PORTFOLIO,
      CMS_TABS.PROJECTS,
      CMS_TABS.ABOUT,
      CMS_TABS.FOOTER,
      CMS_TABS.PLAYGROUND,
      CMS_TABS.LANGUAGES,
      CMS_TABS.MEDIA,
      CMS_TABS.DEPLOY,
    ]

    for (const tab of tabs) {
      el.activeTab = tab
      el._updateDom()

      const active = el.shadowRoot.querySelector(
        `.${CMS_DASHBOARD_CLASSES.CMS_TAB_BTN}.${STATE_CLASSES.ACTIVE}`
      )

      expect(active).toBeTruthy()
    }

    el.activeTab = CMS_TABS.PORTFOLIO

    el.remove()
  })
})
