/**
 * @file cms-routes-cmsplaygroundeditor.test.js
 * @description Split from cms-routes.test.js — covers the "CmsPlaygroundEditor" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { CMS_TAGS } from '@cms/tokens.js'
import { SP_DB_DEFAULT_SEED } from '@earth/space/controls.js'

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
