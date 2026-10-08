/**
 * @file cms-deep-coverage-cmsprojectslist-tails.test.js
 * @description Split from cms-deep-coverage.test.js — covers the "CmsProjectsList tails" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { LOCALES } from '@core/constants.js'
import { CMS_TAGS } from '@cms/tokens.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { FORM_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { DB_PATHS } from '@core/tokens/routes/paths.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'

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

const fire = (el, sel, eventType, value) => {
  const node = el.shadowRoot.querySelector(sel)

  if (!node) return null

  if (value !== undefined) node.value = value

  node.dispatchEvent(new window.Event(eventType, { bubbles: true }))

  return node
}

describe('CmsProjectsList tails', () => {
  const projSnap = {
    title: TEST_TEXT.HEADING,
    folder: TEST_TEXT.BODY,
    cover: { src: 'cov', label: 'L', size: [100, 200], isVideo: true },
    sections: [
      [['t1'], [{ src: 'a', label: 'b', isVideo: false, size: [1, 2] }]],
      [['x'], []],
    ],
  }

  const mountLoaded = async () => {
    snapRoutes.push(
      { match: 'projects/k1', snap: () => snapOf(projSnap) },
      {
        match: DB_PATHS.PROJECTS_SEGMENT,
        snap: () => snapOf({ k1: { title: 'a' }, k2: { title: 'b' } }),
      }
    )

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    return el
  }

  test('bound editor controls write the project model', async () => {
    const el = await mountLoaded()

    expect(el.currentProject).not.toBeNull()

    fire(el, '#proj-title-input', FORM_EVENTS.INPUT, 'T2')
    fire(el, '#proj-folder-input', FORM_EVENTS.INPUT, 'f2')

    const ni = el.shadowRoot.querySelector('#proj-noindex')

    ni.checked = true
    ni.dispatchEvent(new window.Event(FORM_EVENTS.CHANGE, { bubbles: true }))

    fire(el, '#cover-src-input', FORM_EVENTS.INPUT, 'c2')
    fire(el, '#cover-label-input', FORM_EVENTS.INPUT, 'l2')
    fire(el, '#cover-isvideo', FORM_EVENTS.CHANGE, ATTR_VALUES.TRUE)
    fire(el, '#cover-isvideo', FORM_EVENTS.CHANGE, ATTR_VALUES.FALSE)
    fire(el, '#cover-w-input', FORM_EVENTS.INPUT, '800')
    fire(el, '#cover-w-input', FORM_EVENTS.INPUT, 'x')
    fire(el, '#cover-h-input', FORM_EVENTS.INPUT, '600')
    fire(el, '#cover-h-input', FORM_EVENTS.INPUT, '')

    fire(el, '.sec-add-text', MOUSE_EVENTS.CLICK)
    fire(el, '.sec-add-media', MOUSE_EVENTS.CLICK)
    fire(el, '.sec-text-input', FORM_EVENTS.INPUT, 'nn')
    fire(el, '.media-src', FORM_EVENTS.INPUT, 'm2')

    await flush()

    fire(el, '.media-label', FORM_EVENTS.INPUT, 'ml2')
    fire(el, '.media-type', FORM_EVENTS.CHANGE, ATTR_VALUES.TRUE)
    fire(el, '.media-w', FORM_EVENTS.INPUT, '640')
    fire(el, '.media-w', FORM_EVENTS.INPUT, 'x')
    fire(el, '.media-h', FORM_EVENTS.INPUT, '480')
    fire(el, '.media-h', FORM_EVENTS.INPUT, 'x')

    fire(el, '.sec-up-btn', MOUSE_EVENTS.CLICK)
    fire(el, '.sec-down-btn', MOUSE_EVENTS.CLICK)
    fire(el, '.sec-text-del', MOUSE_EVENTS.CLICK)
    fire(el, '.media-del', MOUSE_EVENTS.CLICK)
    fire(el, '.sec-del-btn', MOUSE_EVENTS.CLICK)

    fire(el, '#btn-add-section', MOUSE_EVENTS.CLICK)
    fire(el, '#btn-save-proj', MOUSE_EVENTS.CLICK)

    await flush()

    fire(el, '#select-proj-lang', FORM_EVENTS.CHANGE, LOCALES.DE)

    await flush()

    fire(el, '#select-proj-key', FORM_EVENTS.CHANGE, 'k2')

    await flush()

    globalThis.prompt = () => 'BrandNew'
    fire(el, '#btn-create-proj', MOUSE_EVENTS.CLICK)

    await flush()

    confirms.push(true)
    fire(el, '#btn-delete-proj', MOUSE_EVENTS.CLICK)

    await flush()

    el.remove()
  }, 120000)

  test('load guards, missing snapshots and error paths', async () => {
    snapRoutes.push({
      match: DB_PATHS.PROJECTS_SEGMENT,
      snap: () => {
        throw new Error(TEST_TEXT.MISSING_KEY)
      },
    })

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    el.selectedProjectKey = ''
    await el.loadProjectData()
    expect(el.currentProject).toBeNull()

    snapRoutes.length = 0
    snapRoutes.push({ match: 'projects/none', snap: () => snapOf(null, false) })

    el.selectedProjectKey = STATE_STRINGS.NONE
    await el.loadProjectData()
    expect(el.currentProject).toBeNull()

    el.addSection()

    el.currentProject = { title: 't', sections: 'x' }
    el.addSection()
    expect(Array.isArray(el.currentProject.sections)).toBe(true)

    snapRoutes.push({ match: 'projects/bare', snap: () => snapOf({ sections: [] }) })
    el.selectedProjectKey = 'bare'
    await el.loadProjectData()
    expect(el.currentProject.cover).toBeTruthy()
    expect(el.currentProject.seo.noIndex).toBe(false)

    snapRoutes.push({
      match: 'projects/bad',
      snap: () => {
        throw new Error(TEST_TEXT.MISSING_KEY)
      },
    })
    el.selectedProjectKey = 'bad'
    await el.loadProjectData()

    confirms.push(true)

    const noIter = []

    noIter[Symbol.iterator] = () => {
      throw TEST_TEXT.MISSING_KEY
    }
    el.languages = noIter
    await el.deleteProject()
    expect(alerts.length).toBeGreaterThan(0)

    el.languages = [LOCALES.EN]
    el.selectedProjectKey = 'bad'
    el.currentProject = { title: 't', sections: [] }

    snapRoutes.failSet = 'str'
    await el.saveProjectData()
    snapRoutes.failSet = false

    expect(alerts.length).toBeGreaterThan(1)

    el.remove()
  })
})
