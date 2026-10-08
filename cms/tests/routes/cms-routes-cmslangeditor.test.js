/**
 * @file cms-routes-cmslangeditor.test.js
 * @description Split from cms-routes.test.js — covers the "CmsLangEditor" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { CMS_TAGS } from '@cms/tokens.js'

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
