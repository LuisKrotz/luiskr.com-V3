/**
 * @file cms-deep-coverage-cmslangeditor-branches.test.js
 * @description Split from cms-deep-coverage.test.js — covers the "CmsLangEditor branches" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { CMS_KEYS } from '@core/constants.js'
import { CMS_EVENTS, CMS_TAGS } from '@cms/tokens.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { FORM_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'

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

// ─── CmsLangEditor / CmsPlaygroundEditor branches ────────────────────────────
describe('CmsLangEditor branches', () => {
  test('loadData handles a missing node gracefully', async () => {
    snapRoutes.push({ match: CMS_KEYS.APP, snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_LANG_EDITOR)

    await flush()

    expect(el.jsonContent).toBe('{}')

    el.remove()
  })

  test('node selector change reloads the dictionary', async () => {
    const el = mount(CMS_TAGS.CMS_LANG_EDITOR)

    await flush()

    const sel = el.shadowRoot.querySelector('#select-dict-node')

    if (sel) {
      sel.value = sel.options[1]?.value || sel.value
      sel.dispatchEvent(new window.Event(FORM_EVENTS.CHANGE))

      await flush()
    }

    el.remove()
  })

  test('language selector, textarea input and save flow', async () => {
    const el = mount(CMS_TAGS.CMS_LANG_EDITOR)

    await flush()

    const langSel = el.shadowRoot.querySelector('#select-dict-lang')
    const textarea = el.shadowRoot.querySelector('#json-editor')
    const saveBtn = el.shadowRoot.querySelector('#btn-save-lang')

    if (langSel) {
      langSel.value = langSel.options[1]?.value || langSel.value
      langSel.dispatchEvent(new window.Event(FORM_EVENTS.CHANGE))
      await flush()
    }

    if (textarea) {
      textarea.value = '{"a":1}'
      textarea.dispatchEvent(new window.Event(FORM_EVENTS.INPUT))
    }

    saveBtn?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    await flush()

    const notified = []
    const handler = (e) => notified.push(e)

    el.addEventListener(CMS_EVENTS.NOTIFY, handler)
    el.jsonContent = '{"b":2}'
    await el.saveData()

    expect(notified.length).toBe(1)

    el.remove()
  })

  test('invalid JSON aborts the write with an alert', async () => {
    const alerts = []
    const origAlert = globalThis.alert

    globalThis.alert = (m) => alerts.push(m)

    const el = mount(CMS_TAGS.CMS_LANG_EDITOR)

    await flush()

    el.jsonContent = '{broken'
    await el.saveData()

    expect(alerts.length).toBe(1)
    expect(el.saving).toBe(false)

    globalThis.alert = origAlert
    el.remove()
  })

  test('loadData tolerates a rejecting get and _bindEvents tolerates missing nodes', async () => {
    snapRoutes.push({
      match: 'reject-node-zz',
      snap: () => {
        throw new Error('db-down')
      },
    })

    const el = mount(CMS_TAGS.CMS_LANG_EDITOR)

    await flush()

    el.selectedNode = 'reject-node-zz'
    await el.loadData()

    const qs = jest.spyOn(el.shadowRoot, 'querySelector').mockReturnValue(null)

    el._bindEvents()
    qs.mockRestore()

    el.remove()
  })
})
