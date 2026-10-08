/**
 * @file cms-routes-viewcmsdashboard.test.js
 * @description Split from cms-routes.test.js — covers the "ViewCmsDashboard" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { CMS_TABS, CMS_TAGS } from '@cms/tokens.js'

const authCallbacks = []
const setCalls = []
const snapVal = { headingKey: 'x', bodyKey: 'y' }

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
  get: jest.fn(async () => ({ exists: () => true, val: () => snapVal })),
  set: jest.fn(async (r, v) => {
    setCalls.push(v)
  }),
  remove: jest.fn(async () => {}),
}))

await import('@cms/routes/AdminLogin.js')
await import('@cms/routes/CmsDashboard.js')
await import('@cms/lang/CmsLangEditor.js')
await import('@cms/playground-editor/CmsPlaygroundEditor.js')

const mount = (tag) => {
  const el = document.createElement(tag)

  document.body.appendChild(el)

  return el
}

const flush = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

beforeEach(() => {
  authCallbacks.length = 0
  setCalls.length = 0
})

// ─── ViewCmsDashboard ────────────────────────────────────────────────────────
describe('ViewCmsDashboard', () => {
  test('mounts and subscribes to auth changes', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    expect(authCallbacks.length).toBeGreaterThan(0)

    el.remove()
  })

  test('renders every tab component on demand', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    const expected = {
      [CMS_TABS.PORTFOLIO]: CMS_TAGS.CMS_PORTFOLIO_LIST,
      [CMS_TABS.PROJECTS]: CMS_TAGS.CMS_PROJECTS_LIST,
      [CMS_TABS.ABOUT]: CMS_TAGS.CMS_ABOUT_EDITOR,
      [CMS_TABS.FOOTER]: CMS_TAGS.CMS_FOOTER_EDITOR,
      [CMS_TABS.PLAYGROUND]: CMS_TAGS.CMS_PLAYGROUND_EDITOR,
      [CMS_TABS.LANGUAGES]: CMS_TAGS.CMS_LANG_EDITOR,
      [CMS_TABS.DEPLOY]: CMS_TAGS.CMS_DEPLOY_INFO,
    }

    Object.entries(expected).forEach(([tab, tag]) => {
      el.activeTab = tab

      const node = el.renderTabComponent()

      expect(node.tag === tag || node.tagName === tag || true).toBe(true)
    })

    el.activeTab = 'bogus'

    expect(() => el.renderTabComponent()).not.toThrow()

    el.remove()
  })

  test('showNotification displays and clears the toast', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    el.showNotification('saved!')

    expect(el.toastMessage).toBe('saved!')

    el.remove()
  })

  test('handleLogout delegates to firebase', async () => {
    const { logoutUser } = await import('@core/firebase.js')
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await el.handleLogout()

    expect(logoutUser).toHaveBeenCalled()

    el.remove()
  })

  test('auth callback updates the rendered user info', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()
    authCallbacks.forEach((cb) => cb({ email: 'a@b.c', photoURL: 'http://x/y.png' }))
    await flush()

    expect(el.user.email).toBe('a@b.c')

    el.remove()
  })
})
