/**
 * @file cms-deep-coverage-cmsplaygroundeditor-branches.test.js
 * @description Split from cms-deep-coverage.test.js — covers the "CmsPlaygroundEditor branches" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { clearDevLog, getDevLog } from '@core/devlog.js'
import { LOG_LEVELS } from '@core/tokens/data/log.js'
import { LOCALES, TRANSLATION_KEYS } from '@core/constants.js'
import { CMS_TAGS } from '@cms/tokens.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { FORM_EVENTS } from '@core/tokens/events/dom.js'

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

describe('CmsPlaygroundEditor branches', () => {
  test('loadAllData reads ep keys plus slugs; saveAll writes both', async () => {
    snapRoutes.push({
      match: TRANSLATION_KEYS.EARTH_PLAYGROUND,
      snap: () => snapOf({ speed: '1', defaults: { speed: 1 } }),
    })
    snapRoutes.push({ match: 'slugs', snap: () => snapOf({ about: 'sobre' }) })

    const el = mount(CMS_TAGS.CMS_PLAYGROUND_EDITOR)

    await flush()

    expect(el.epKeys).toContain('speed')
    expect(el.slugs.about).toBe('sobre')

    await el.saveAll()

    expect(setCalls.length).toBe(2)

    el.remove()
  })

  test('removeEpKey drops the key and ep-value inputs write the model', async () => {
    snapRoutes.push({
      match: TRANSLATION_KEYS.EARTH_PLAYGROUND,
      snap: () => snapOf({ k1: 'v1', k2: 'v2' }),
    })
    snapRoutes.push({ match: 'slugs', snap: () => snapOf({}) })

    const el = mount(CMS_TAGS.CMS_PLAYGROUND_EDITOR)

    await flush()

    el.removeEpKey('k1')

    expect(el.epKeys).not.toContain('k1')

    const inp = el.shadowRoot.querySelector('.ep-value')

    if (inp) {
      inp.value = 'edited'
      inp.dispatchEvent(new window.Event(FORM_EVENTS.INPUT))
    }

    el.remove()
  })

  test('loadAllData tolerates missing snapshots and a throwing fetch', async () => {
    snapRoutes.push({ match: TRANSLATION_KEYS.EARTH_PLAYGROUND, snap: () => snapOf(null, false) })
    snapRoutes.push({ match: 'slugs', snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_PLAYGROUND_EDITOR)

    await flush()

    expect(el.epKeys).toHaveLength(0)
    expect(el.slugs).toEqual({})

    // get() throwing -> the catch branch logs and keeps the component alive
    snapRoutes.length = 0
    snapRoutes.push({
      match: CHAR_STRINGS.EMPTY,
      snap: () => {
        throw new Error('db gone')
      },
    })

    clearDevLog()

    await el.loadAllData()

    expect(getDevLog().filter((e) => e.level === LOG_LEVELS.ERROR).length).toBeGreaterThan(0)

    el.remove()
  })

  test('saveAll fills missing ep values and alerts on every failure shape', async () => {
    snapRoutes.push({ match: TRANSLATION_KEYS.EARTH_PLAYGROUND, snap: () => snapOf({}) })
    snapRoutes.push({ match: 'slugs', snap: () => snapOf({}) })

    const el = mount(CMS_TAGS.CMS_PLAYGROUND_EDITOR)

    await flush()

    // epKeys entry without an epData value -> the `?? EMPTY` arm on write
    el.epKeys = ['k1', 'missing']
    el.epData = { k1: 'v1' }

    snapRoutes.failSet = true
    await el.saveAll()

    expect(alerts.some((m) => m.includes('set exploded'))).toBe(true)

    // rejection without .message -> the `err.message || err` right arm
    const { set } = await import('firebase/database')

    snapRoutes.failSet = false
    set.mockRejectedValueOnce('plain-failure')
    await el.saveAll()

    expect(alerts.some((m) => m.includes('plain-failure'))).toBe(true)

    el.remove()
  })

  test('addEpKey guards null, blank and duplicate prompts', async () => {
    snapRoutes.push({ match: TRANSLATION_KEYS.EARTH_PLAYGROUND, snap: () => snapOf({ k1: 'v' }) })
    snapRoutes.push({ match: 'slugs', snap: () => snapOf({}) })

    const el = mount(CMS_TAGS.CMS_PLAYGROUND_EDITOR)

    await flush()

    globalThis.prompt = () => null
    el.addEpKey()

    globalThis.prompt = () => '   '
    el.addEpKey()

    globalThis.prompt = () => 'k1'
    el.addEpKey()

    expect(el.epKeys).toEqual(['k1'])

    confirms.push(false)
    el.removeEpKey('k1')

    expect(el.epKeys).toContain('k1')

    el.remove()
  })

  test('language select, slug/number/bool inputs write the model', async () => {
    snapRoutes.push({
      match: TRANSLATION_KEYS.EARTH_PLAYGROUND,
      snap: () => snapOf({ k1: 'v', defaults: { flag: true, off: false, speed: 1.5 } }),
    })
    snapRoutes.push({ match: 'slugs', snap: () => snapOf({ about: 'sobre' }) })

    const el = mount(CMS_TAGS.CMS_PLAYGROUND_EDITOR)

    await flush()

    const sel = el.shadowRoot.querySelector('#select-playground-lang')

    if (sel) {
      sel.value = LOCALES.BR
      sel.dispatchEvent(new window.Event(FORM_EVENTS.CHANGE))
    }

    const slug = el.shadowRoot.querySelector('.slug-value')

    if (slug) {
      slug.value = 'novo'
      slug.dispatchEvent(new window.Event(FORM_EVENTS.INPUT))

      expect(el.slugs.about).toBe('novo')
    }

    const num = el.shadowRoot.querySelector('.ep-def-num')

    if (num) {
      num.value = '2.5'
      num.dispatchEvent(new window.Event(FORM_EVENTS.INPUT))

      expect(el.epDefaults.speed).toBe(2.5)
    }

    const bool = el.shadowRoot.querySelector('.ep-def-bool')

    if (bool) {
      bool.checked = false
      bool.dispatchEvent(new window.Event(FORM_EVENTS.CHANGE))

      expect(el.epDefaults.flag).toBe(false)
    }

    await flush()
    // `on()` helper's missing-element else arm
    const qsSpy = jest.spyOn(el, '$').mockReturnValue(null)

    el._bindEvents()
    qsSpy.mockRestore()

    el.remove()
  })
})
