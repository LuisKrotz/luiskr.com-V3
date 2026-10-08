/**
 * @file cms-deep-coverage-cmsprojectslist-deep.test.js
 * @description Split from cms-deep-coverage.test.js — covers the "CmsProjectsList deep" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { CMS_TAGS } from '@cms/tokens.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { DB_PATHS } from '@core/tokens/routes/paths.js'

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

// ─── CmsProjectsList deep ────────────────────────────────────────────────────
describe('CmsProjectsList deep', () => {
  test('empty project index resets selection without loading data', async () => {
    snapRoutes.push({ match: DB_PATHS.PROJECTS_SEGMENT, snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    expect(el.projectKeys).toEqual([])
    expect(el.currentProject).toBeNull()

    el.remove()
  })

  test('loadProjectData normalizes legacy section shapes', async () => {
    snapRoutes.push({ match: DB_PATHS.PROJECTS_SEGMENT, snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    el.selectedProjectKey = 'k1'
    snapRoutes.unshift({
      match: 'projects/k1',
      snap: () => snapOf({ title: 'K', sections: { a: { texts: ['t'], media: ['m'] }, b: ['x'] } }),
    })

    await el.loadProjectData()

    expect(el.currentProject.sections[0]).toEqual([['t'], ['m']])

    el.remove()
  })

  test('createProjectPrompt sanitizes the slug and rejects duplicates', async () => {
    snapRoutes.push({ match: DB_PATHS.PROJECTS_SEGMENT, snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    el.projectKeys = ['exists']

    globalThis.prompt = () => 'EXISTS'

    el.createProjectPrompt()

    expect(el.projectKeys).toHaveLength(1)
    expect(alerts.length).toBeGreaterThan(0)

    globalThis.prompt = () => 'New Proj!!'

    el.createProjectPrompt()

    expect(el.projectKeys).toContain('newproj')
    expect(el.currentProject.title).toBe('NEWPROJ')

    globalThis.prompt = () => CHAR_STRINGS.EMPTY

    el.createProjectPrompt()

    el.remove()
  })

  test('deleteProject requires selection and confirmation', async () => {
    snapRoutes.push({ match: DB_PATHS.PROJECTS_SEGMENT, snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    el.selectedProjectKey = CHAR_STRINGS.EMPTY

    await el.deleteProject()

    el.selectedProjectKey = 'k1'

    confirms.push(false)

    await el.deleteProject()

    expect(removeCalls).toHaveLength(0)

    confirms.push(true)

    await el.deleteProject()

    expect(removeCalls.length).toBe(el.languages.length)

    el.remove()
  })

  test('saveProjectData guards on selection and writes the model', async () => {
    snapRoutes.push({ match: DB_PATHS.PROJECTS_SEGMENT, snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    await el.saveProjectData()

    expect(setCalls).toHaveLength(0)

    el.selectedProjectKey = 'k1'
    el.currentProject = { title: 'K' }

    await el.saveProjectData()

    expect(setCalls).toHaveLength(1)

    snapRoutes.failSet = true

    await el.saveProjectData()

    expect(alerts.length).toBeGreaterThan(0)

    snapRoutes.failSet = false

    el.remove()
  })

  test('_normalizeSection covers array-pair, object and junk shapes', async () => {
    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    expect(el._normalizeSection([['a'], ['m']])).toEqual([['a'], ['m']])
    expect(el._normalizeSection({ texts: ['t'], media: ['m'] })).toEqual([['t'], ['m']])
    expect(el._normalizeSection({})).toEqual([[], []])
    expect(el._normalizeSection(42)).toEqual([[], []])

    el.remove()
  })

  test('section add/remove/move honor bounds and confirm guards', async () => {
    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    el.currentProject = {
      sections: [
        [['a'], []],
        [['b'], []],
      ],
    }

    el.moveSection(0, -1)
    el.moveSection(1, 1)

    expect(el.currentProject.sections[0][0]).toEqual(['a'])

    confirms.push(false)
    el.removeSection(0)

    expect(el.currentProject.sections).toHaveLength(2)

    confirms.push(true)
    el.removeSection(0)

    expect(el.currentProject.sections).toHaveLength(1)

    el.addSection()

    expect(el.currentProject.sections).toHaveLength(2)

    el.remove()
  })
})
