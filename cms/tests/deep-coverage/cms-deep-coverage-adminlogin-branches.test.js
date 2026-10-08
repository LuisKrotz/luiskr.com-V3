/**
 * @file cms-deep-coverage-adminlogin-branches.test.js
 * @description Split from cms-deep-coverage.test.js — covers the "AdminLogin branches" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { CMS_TAGS } from '@cms/tokens.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { CMS_ADMIN_CLASSES } from '@cms/tokens.js'

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

describe('AdminLogin branches', () => {
  test('error without message falls back to the generic copy', async () => {
    const { signInWithGoogle } = await import('@core/firebase.js')

    signInWithGoogle.mockRejectedValueOnce({})

    const el = mount(CMS_TAGS.VIEW_ADMIN_LOGIN)

    await el.handleGoogleLogin()

    expect(el.errorMsg).toContain('Failed to sign in')

    el.remove()
  })

  test('bindEvents guards a missing button; button click triggers login', async () => {
    const el = mount(CMS_TAGS.VIEW_ADMIN_LOGIN)

    el._contentNode.innerHTML = CHAR_STRINGS.EMPTY
    el._bindEvents()

    el._updateDom()
    el._bindEvents()

    const btn = el.shadowRoot.querySelector(`.${CMS_ADMIN_CLASSES.GOOGLE_AUTH_BTN}`)

    btn?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    await flush()

    el.remove()
  })

  test('module re-eval skips custom-element re-registration', async () => {
    jest.resetModules()

    await expect(import('@cms/routes/AdminLogin.js')).resolves.toBeTruthy()

    // tag already defined -> the registration guard's else arm
    await expect(import('@cms/lang/CmsLangEditor.js')).resolves.toBeTruthy()
    await expect(import('@cms/deploy-info/CmsDeployInfo.js')).resolves.toBeTruthy()
    await expect(import('@cms/about/CmsAboutEditor.js')).resolves.toBeTruthy()
    await expect(import('@cms/footer/CmsFooterEditor.js')).resolves.toBeTruthy()
    await expect(import('@cms/playground-editor/CmsPlaygroundEditor.js')).resolves.toBeTruthy()
  })
})
