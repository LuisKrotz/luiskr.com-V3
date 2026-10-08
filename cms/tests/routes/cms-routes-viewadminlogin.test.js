/**
 * @file cms-routes-viewadminlogin.test.js
 * @description Split from cms-routes.test.js — covers the "ViewAdminLogin" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { CMS_TAGS } from '@cms/tokens.js'
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

const _flush = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

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
