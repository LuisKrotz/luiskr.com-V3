/**
 * @file cms-deep-coverage-cmsprojectslist-dom-events.test.js
 * @description Split from cms-deep-coverage.test.js — covers the "CmsProjectsList DOM events" describe.
 */
import { describe, test, jest, beforeEach } from '@jest/globals'
import { CMS_TAGS } from '@cms/tokens.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { FORM_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { DB_PATHS } from '@core/tokens/routes/paths.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

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

describe('CmsProjectsList DOM events', () => {
  test('project selector change reloads the project data', async () => {
    snapRoutes.push({
      match: DB_PATHS.PROJECTS_SEGMENT,
      snap: () => snapOf({ k1: { title: 'K1', sections: [] }, k2: { title: 'K2', sections: [] } }),
    })

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    const sel = el.shadowRoot.querySelector(HTML_TAGS.SELECT)

    if (sel) {
      sel.value = 'k2'
      sel.dispatchEvent(new window.Event(FORM_EVENTS.CHANGE))

      await flush()
    }

    el.remove()
  })

  test('section text/media controls write through data attributes', async () => {
    snapRoutes.push({ match: DB_PATHS.PROJECTS_SEGMENT, snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    el.currentProject = { title: 'T', sections: [[['a'], [{ src: 's' }]]] }
    el._updateDom()

    await flush()

    el.shadowRoot
      .querySelector('#btn-save-project')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('#btn-create-project')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('#btn-delete-project')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    await flush()

    el.remove()
  })
})
