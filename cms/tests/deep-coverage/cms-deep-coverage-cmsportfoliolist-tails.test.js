/**
 * @file cms-deep-coverage-cmsportfoliolist-tails.test.js
 * @description Split from cms-deep-coverage.test.js — covers the "CmsPortfolioList tails" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { CMS_KEYS, LOCALES } from '@core/constants.js'
import { CMS_TAGS } from '@cms/tokens.js'
import { TEST_TEXT, TEST_URLS } from '@tests/fixtures/test-constants.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { FORM_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { COVER_DIMENSIONS, MOSAIC_DIMENSIONS } from '@core/tokens/media/dimensions.js'

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

describe('CmsPortfolioList tails', () => {
  test('bound controls write items, dims, featured and action rows', async () => {
    snapRoutes.push({
      match: CMS_KEYS.PORTFOLIOLIST,
      snap: () =>
        snapOf([
          {
            label: 'A',
            link: 'a',
            image: HTML_TAGS.IMG,
            featured: true,
            width: ['1', '2'],
            height: ['3', '4'],
          },
        ]),
    })

    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    await flush()

    fire(el, '#btn-add-item', MOUSE_EVENTS.CLICK)
    expect(el.items.length).toBe(2)

    fire(el, '#select-lang', FORM_EVENTS.CHANGE, LOCALES.DE)

    await flush()

    fire(el, '.item-field', FORM_EVENTS.INPUT, 'newlabel')
    fire(el, '.dim-field', FORM_EVENTS.INPUT, '9')

    const feat = el.shadowRoot.querySelector('.feat-select')

    feat.value = ATTR_VALUES.FALSE
    feat.dispatchEvent(new window.Event(FORM_EVENTS.CHANGE, { bubbles: true }))
    feat.value = ATTR_VALUES.TRUE
    feat.dispatchEvent(new window.Event(FORM_EVENTS.CHANGE, { bubbles: true }))

    const stale = el.shadowRoot.querySelector('.item-field')
    const staleDim = el.shadowRoot.querySelector('.dim-field')
    const staleFeat = el.shadowRoot.querySelector('.feat-select')

    el.items = []

    stale?.dispatchEvent(new window.Event(FORM_EVENTS.INPUT, { bubbles: true }))
    staleDim?.dispatchEvent(new window.Event(FORM_EVENTS.INPUT, { bubbles: true }))
    staleFeat?.dispatchEvent(new window.Event(FORM_EVENTS.CHANGE, { bubbles: true }))

    const acts = [...el.shadowRoot.querySelectorAll(`[${DATA_ATTRS.DATA_ACTION}]`)]

    acts.find((b) => b.getAttribute(DATA_ATTRS.DATA_ACTION) === 'up')?.click()
    acts.find((b) => b.getAttribute(DATA_ATTRS.DATA_ACTION) === 'down')?.click()
    acts.find((b) => b.getAttribute(DATA_ATTRS.DATA_ACTION) === 'delete')?.click()

    el.saving = true
    el._updateDom()

    await flush()

    el.saving = false
    el._updateDom()
    el._bindEvents()

    fire(el, '#btn-sync-items', MOUSE_EVENTS.CLICK)

    await flush()

    fire(el, '#btn-save-items', MOUSE_EVENTS.CLICK)

    await flush()

    confirms.push(false)
    el.removeItem(0)

    const bogus = document.createElement(HTML_TAGS.BUTTON)

    bogus.setAttribute(DATA_ATTRS.DATA_ACTION, 'bogus')
    bogus.setAttribute(DATA_ATTRS.DATA_IDX, '0')
    el._contentNode.appendChild(bogus)
    el._bindEvents()
    bogus.click()

    const $spy = jest.spyOn(el, '$').mockReturnValue(null)
    const $$spy = jest.spyOn(el, '$$').mockReturnValue([])

    el._bindEvents()
    $spy.mockRestore()
    $$spy.mockRestore()

    expect(el.getImagePreview(CHAR_STRINGS.EMPTY)).toBe(CHAR_STRINGS.EMPTY)
    expect(el.getImagePreview(TEST_URLS.EXTERNAL)).toBe(TEST_URLS.EXTERNAL)

    el.remove()
  })

  test('sync merge covers object vals, missing targets and related matches', async () => {
    snapRoutes.push(
      { match: 'de/pages', snap: () => snapOf(null, false) },
      { match: 'es/pages', snap: () => snapOf({ z: { link: 'a' } }) },
      { match: 'it/components', snap: () => snapOf([{ link: 'a', featured: true }]) },
      { match: 'de/components', snap: () => snapOf(null, false) },
      {
        match: 'components/related',
        snap: () =>
          snapOf({
            a: { link: 'a', featured: true },
            z: { link: 'zz' },
            q: { link: 'qq', featured: true },
          }),
      },
      {
        match: 'pages',
        snap: () =>
          snapOf([
            { link: 'a', image: 'i', featured: true, label: 'A', width: ['1'], height: ['2'] },
            { link: 'a', label: 'B2', featured: ATTR_VALUES.TRUE },
            { link: 'a', label: 'B3' },
            { label: 'B' },
            { link: 'z', image: 'i2' },
          ]),
      }
    )

    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    await flush()

    await el.syncNonLocalizedToAllLangs()
    await el.savePortfolio()

    el.selectedLang = LOCALES.DE
    await el.savePortfolio()

    el.remove()
  })

  test('non-Error set throws hit the err||err alert arms', async () => {
    snapRoutes.push({ match: CMS_KEYS.PORTFOLIOLIST, snap: () => snapOf([{ link: 'a' }]) })

    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    await flush()

    snapRoutes.failSet = 'str'
    await el.syncNonLocalizedToAllLangs()
    await el.savePortfolio()
    snapRoutes.failSet = false

    expect(alerts.length).toBeGreaterThanOrEqual(2)

    el.remove()
  })

  test('sync/save error paths alert, confirm-gate returns, failSet restores saving', async () => {
    snapRoutes.push({
      match: CMS_KEYS.PORTFOLIOLIST,
      snap: () => snapOf([{ label: 'A', link: 'a' }]),
    })

    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    await flush()

    confirms.push(false)
    await el.syncNonLocalizedToAllLangs()
    expect(alerts).toHaveLength(0)

    snapRoutes.failSet = true
    await el.syncNonLocalizedToAllLangs()
    await el.savePortfolio()
    snapRoutes.failSet = false

    expect(alerts.length).toBeGreaterThan(0)
    expect(el.saving).toBe(false)

    el.remove()
  })

  test('updateDim shapes scalars/arrays and load catch surfaces', async () => {
    snapRoutes.push({
      match: CMS_KEYS.PORTFOLIOLIST,
      snap: () => {
        throw new Error(TEST_TEXT.MISSING_KEY)
      },
    })

    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    await flush()
    expect(el.items).toEqual([])

    const item = {}

    el.updateDim(item, MEDIA_ATTRS.WIDTH, 0, '10')
    expect(item.width).toEqual(['10', MOSAIC_DIMENSIONS.MOSAIC_MOBILE_WIDTH_STR])

    el.updateDim(item, MEDIA_ATTRS.HEIGHT, 1, '20')
    expect(item.height).toEqual([COVER_DIMENSIONS.FHD_WIDTH_STR, '20'])

    el.updateDim(item, MEDIA_ATTRS.WIDTH, 1, CHAR_STRINGS.DELAY_30)
    expect(item.width[1]).toBe(CHAR_STRINGS.DELAY_30)

    el.remove()
  })
})
