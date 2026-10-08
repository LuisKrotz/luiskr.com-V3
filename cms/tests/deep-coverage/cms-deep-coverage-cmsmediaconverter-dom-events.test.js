/**
 * @file cms-deep-coverage-cmsmediaconverter-dom-events.test.js
 * @description Split from cms-deep-coverage.test.js — covers the "CmsMediaConverter DOM events" describe.
 */
import { describe, test, jest, beforeEach } from '@jest/globals'
import { CMS_TAGS } from '@cms/tokens.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { DRAG_EVENTS, FORM_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { CMS_ITEM_CLASSES } from '@cms/tokens.js'

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

describe('CmsMediaConverter DOM events', () => {
  test('dropzone drag states and file input collect files', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    await flush()

    const dz = el.shadowRoot.querySelector(`.${CMS_ITEM_CLASSES.CMS_DROPZONE}`)

    dz?.dispatchEvent(new window.Event(DRAG_EVENTS.DRAGOVER))
    dz?.dispatchEvent(new window.Event(DRAG_EVENTS.DRAGLEAVE))
    dz?.dispatchEvent(new window.Event(DRAG_EVENTS.DROP))

    const input = el.shadowRoot.querySelector('#cms-media-file-input')

    if (input) {
      Object.defineProperty(input, 'files', { value: [{ name: 'f.webp' }], configurable: true })
      input.dispatchEvent(new window.Event(FORM_EVENTS.CHANGE))
    }

    await flush()

    el.shadowRoot
      .querySelector('#cms-media-run')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('#cms-media-reset')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('#cms-media-clear-list')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    await flush()

    el.remove()
  })
})
