/**
 * @file cms-deep-coverage-cmsfootereditor.test.js
 * @description Split from cms-deep-coverage.test.js — covers the "CmsFooterEditor" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { clearDevLog, getDevLog } from '@core/devlog.js'
import { LOG_LEVELS } from '@core/tokens/data/log.js'
import { CMS_TAGS } from '@cms/tokens.js'
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

// ─── CmsFooterEditor ─────────────────────────────────────────────────────────
describe('CmsFooterEditor', () => {
  const mountLoaded = async () => {
    snapRoutes.push({
      match: 'components/contact',
      snap: () => snapOf({ title: 'C', line1: [{ description: 'd', link: 'l' }], line2: [] }),
    })
    snapRoutes.push({
      match: 'components/legal-footer',
      snap: () => snapOf({ links: [{ page: 'p', link: '/' }] }),
    })
    snapRoutes.push({
      match: 'components/related',
      snap: () =>
        snapOf({ title: 'R', note: 'n', socials: [{ network: 'x', link: 'y' }], extra: 1 }),
    })

    const el = mount(CMS_TAGS.CMS_FOOTER_EDITOR)

    await flush()

    return el
  }

  test('load splits editable fields from relatedExtra', async () => {
    const el = await mountLoaded()

    expect(el.relatedFooter.title).toBe('R')
    expect(el.relatedExtra.extra).toBe(1)
    expect(el.legalLinks).toHaveLength(1)

    el.remove()
  })

  test('saveAll writes all three footer nodes', async () => {
    const el = await mountLoaded()

    await el.saveAll()

    expect(setCalls).toHaveLength(3)
    expect(setCalls[2].value.extra).toBe(1)

    el.remove()
  })

  test('saveAll failure alerts and clears the saving flag', async () => {
    const el = await mountLoaded()

    snapRoutes.failSet = true

    await el.saveAll()

    expect(alerts.length).toBeGreaterThan(0)
    expect(el.saving).toBe(false)

    snapRoutes.failSet = false

    el.remove()
  })

  test('syncLine1ToAllLangs merges line1 into every other locale', async () => {
    const el = await mountLoaded()

    confirms.push(false)

    await el.syncLine1ToAllLangs()

    confirms.push(true)

    await el.syncLine1ToAllLangs()

    expect(setCalls.length).toBe(el.languages.length - 1)
    expect(setCalls[0].value.line1).toEqual(el.contactData.line1)

    el.remove()
  })

  test('syncSocialsToAllLangs writes socials + note per locale', async () => {
    const el = await mountLoaded()

    confirms.push(true)

    await el.syncSocialsToAllLangs()

    expect(setCalls.length).toBe(el.languages.length - 1)
    expect(setCalls[0].value.socials).toEqual(el.relatedFooter.socials)

    el.remove()
  })

  test('channel list inputs and controls mutate the backing arrays', async () => {
    const el = await mountLoaded()

    await flush()

    const label = el.shadowRoot.querySelector('.line1-label')

    label.value = 'new label'
    label.dispatchEvent(new window.Event(FORM_EVENTS.INPUT))

    expect(el.contactData.line1[0].description).toBe('new label')

    el.remove()
  })

  test('load covers every exists-but-fieldless default arm', async () => {
    snapRoutes.push({ match: 'components/contact', snap: () => snapOf({}) })
    snapRoutes.push({ match: 'components/legal-footer', snap: () => snapOf({}) })
    snapRoutes.push({ match: 'components/related', snap: () => snapOf({}) })

    const el = mount(CMS_TAGS.CMS_FOOTER_EDITOR)

    await flush()

    expect(el.contactData.title).toBeTruthy()
    expect(el.legalLinks).toEqual([])
    expect(el.relatedFooter.title).toBeTruthy()

    el.remove()
  })

  test('loadData catch logs and saveAll alerts on a non-Error rejection', async () => {
    const el = await mountLoaded()

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

    snapRoutes.length = 0

    const { set } = await import('firebase/database')

    set.mockRejectedValueOnce('plain-failure')
    await el.saveAll()

    expect(alerts.some((m) => m.includes('plain-failure'))).toBe(true)

    el.remove()
  })

  test('sync guards and list controls cover every index arm', async () => {
    const el = await mountLoaded()

    // confirm -> false covers the early-return arm of syncSocialsToAllLangs
    confirms.push(false)
    await el.syncSocialsToAllLangs()

    expect(el.syncing).toBe(false)

    // set failing mid-sync -> the catch alert arms on both sync flows
    confirms.push(true, true)
    snapRoutes.failSet = true
    await el.syncSocialsToAllLangs()
    await el.syncLine1ToAllLangs()

    expect(alerts.length).toBeGreaterThan(0)
    snapRoutes.failSet = false

    // non-Error rejections -> each `err.message || err` right arm
    const { set } = await import('firebase/database')

    confirms.push(true, true)
    set.mockRejectedValueOnce('x').mockRejectedValueOnce('y')
    await el.syncSocialsToAllLangs()
    await el.syncLine1ToAllLangs()

    expect(alerts.some((m) => m.includes('x'))).toBe(true)
    expect(alerts.some((m) => m.includes('y'))).toBe(true)

    // _moveItem boundary arms + swap
    el._moveItem(el.legalLinks, 0, -1)
    el._moveItem(el.legalLinks, el.legalLinks.length - 1, 1)
    el._moveItem(el.legalLinks, 0, 1)

    // rendered controls: link input, up/down/del clicks
    el.legalLinks = [
      { page: 'a', link: '/a' },
      { page: 'b', link: '/b' },
    ]
    el._updateDom()

    await flush()

    const linkInput = el.shadowRoot.querySelector('.legal-link')

    linkInput.value = '/edited'
    linkInput.dispatchEvent(new window.Event(FORM_EVENTS.INPUT))

    expect(el.legalLinks[0].link).toBe('/edited')

    // captured before the del click re-renders the list
    const stale = el.shadowRoot.querySelectorAll('.legal-link')[1]
    const staleLabel = el.shadowRoot.querySelectorAll('.legal-label')[0]

    // rendered controls: up/down/del dispatch through data-idx
    el.shadowRoot
      .querySelectorAll('.legal-up')[1]
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelectorAll('.legal-down')[0]
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelectorAll('.legal-del')[0]
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    // array emptied in place + stale input -> the `if (arr[idx])` else arm
    el.legalLinks.length = 0
    stale.dispatchEvent(new window.Event(FORM_EVENTS.INPUT))

    // array emptied in place + stale label input -> `arr[idx][labelField]` else
    staleLabel?.dispatchEvent(new window.Event(FORM_EVENTS.INPUT))

    // falsy title fields -> the `|| EMPTY` render arms
    el.contactData.title = CHAR_STRINGS.EMPTY
    el.relatedFooter.title = CHAR_STRINGS.EMPTY
    el._updateDom()

    // `on()` helper's missing-element else arm
    const qsSpy = jest.spyOn(el, '$').mockReturnValue(null)

    el._bindEvents()
    qsSpy.mockRestore()

    el.remove()
  })
})
