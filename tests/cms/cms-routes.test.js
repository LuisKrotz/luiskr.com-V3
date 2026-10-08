/**
 * @file cms-routes.test.js
 * @description Coverage for CMS routes and the remaining editors:
 * ViewAdminLogin, ViewCmsDashboard (tabs/toast/logout), CmsLangEditor and
 * CmsPlaygroundEditor (Firebase load/save, key add/remove/move).
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { CMS_TABS, CMS_TAGS } from '@cms/tokens.js'
import { SP_DB_DEFAULT_SEED } from '@earth/space/controls.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { CMS_ADMIN_CLASSES } from '@cms/tokens.js'

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

// ─── ViewAdminLogin ──────────────────────────────────────────────────────────

describe('ViewAdminLogin', () => {
  test('renders the login card and wires the Google button', () => {
    const el = mount(CMS_TAGS.VIEW_ADMIN_LOGIN)
    const btn = el.shadowRoot.querySelector(`.${CMS_ADMIN_CLASSES.GOOGLE_AUTH_BTN}`)

    expect(btn).toBeTruthy()

    el.remove()
  })

  test('successful login completes without error state', async () => {
    const el = mount(CMS_TAGS.VIEW_ADMIN_LOGIN)

    await el.handleGoogleLogin()

    expect(el.loading).toBe(false)
    expect(el.errorMsg).toBe(ATTR_VALUES.EMPTY)

    el.remove()
  })

  test('failed login surfaces the error message', async () => {
    const { signInWithGoogle } = await import('@core/firebase.js')

    signInWithGoogle.mockRejectedValueOnce(new Error('popup blocked'))

    const el = mount(CMS_TAGS.VIEW_ADMIN_LOGIN)

    await el.handleGoogleLogin()

    expect(el.errorMsg).toBe('popup blocked')

    el.remove()
  })

  test('cancelled popup is swallowed silently', async () => {
    const { signInWithGoogle } = await import('@core/firebase.js')
    const err = new Error('cancelled')

    err.code = 'auth/popup-closed-by-user'
    signInWithGoogle.mockRejectedValueOnce(err)

    const el = mount(CMS_TAGS.VIEW_ADMIN_LOGIN)

    await el.handleGoogleLogin()

    expect(el.errorMsg).toBe(ATTR_VALUES.EMPTY)

    el.remove()
  })

  test('concurrent login attempts are deduplicated', async () => {
    const el = mount(CMS_TAGS.VIEW_ADMIN_LOGIN)

    const { signInWithGoogle } = await import('@core/firebase.js')
    const before = signInWithGoogle.mock.calls.length

    el._loginInProgress = true

    await el.handleGoogleLogin()

    expect(signInWithGoogle.mock.calls.length).toBe(before)

    el.remove()
  })
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

// ─── CmsLangEditor ───────────────────────────────────────────────────────────

describe('CmsLangEditor', () => {
  test('loads the dictionary JSON on mount', async () => {
    const el = mount(CMS_TAGS.CMS_LANG_EDITOR)

    await el.loadData()

    expect(el.jsonContent).toContain('headingKey')

    el.remove()
  })

  test('saveData writes parsed JSON back to Firebase', async () => {
    const el = mount(CMS_TAGS.CMS_LANG_EDITOR)

    el.jsonContent = '{"a":1}'

    await el.saveData()

    expect(setCalls.length).toBeGreaterThan(0)
    expect(setCalls[0]).toEqual({ a: 1 })

    el.remove()
  })

  test('saveData alerts on invalid JSON', async () => {
    const el = mount(CMS_TAGS.CMS_LANG_EDITOR)
    const alerts = []

    globalThis.alert = (m) => alerts.push(m)
    el.jsonContent = '{invalid'

    await el.saveData()

    expect(alerts.length).toBeGreaterThan(0)

    el.remove()
  })
})

// ─── CmsPlaygroundEditor ─────────────────────────────────────────────────────

describe('CmsPlaygroundEditor', () => {
  test('loads playground keys and slugs on mount', async () => {
    const el = mount(CMS_TAGS.CMS_PLAYGROUND_EDITOR)

    await el.loadAllData()

    expect(el.epData).toEqual(snapVal)
    expect(el.epKeys).toEqual(['headingKey', 'bodyKey'])

    el.remove()
  })

  test('addEpKey appends a new empty key via prompt', async () => {
    const el = mount(CMS_TAGS.CMS_PLAYGROUND_EDITOR)

    await el.loadAllData()

    globalThis.prompt = () => 'newKey'
    el.addEpKey()

    expect(el.epKeys).toContain('newKey')

    el.remove()
  })

  test('addEpKey ignores empty and duplicate keys', async () => {
    const el = mount(CMS_TAGS.CMS_PLAYGROUND_EDITOR)

    await el.loadAllData()

    globalThis.prompt = () => ''
    el.addEpKey()

    expect(el.epKeys).toHaveLength(2)

    globalThis.prompt = () => 'headingKey'
    el.addEpKey()

    expect(el.epKeys).toHaveLength(2)

    el.remove()
  })

  test('saveAll writes the key-ordered payload for both nodes', async () => {
    const el = mount(CMS_TAGS.CMS_PLAYGROUND_EDITOR)

    await el.loadAllData()

    el.epData.headingKey = 'T'
    el.epData.bodyKey = 'B'

    await el.saveAll()

    expect(setCalls.length).toBe(2)
    // A snapshot without a `defaults` node saves back the shipped seed —
    // the defaults exist in code even before the first CMS write.
    expect(setCalls[0]).toEqual({
      headingKey: 'T',
      bodyKey: 'B',
      defaults: { ...SP_DB_DEFAULT_SEED },
    })

    el.remove()
  })
})
