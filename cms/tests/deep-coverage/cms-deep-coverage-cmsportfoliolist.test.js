/**
 * @file cms-deep-coverage-cmsportfoliolist.test.js
 * @description Split from cms-deep-coverage.test.js — covers the "CmsPortfolioList" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { CMS_KEYS } from '@core/constants.js'
import { CMS_TAGS } from '@cms/tokens.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'

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

// ─── CmsPortfolioList ────────────────────────────────────────────────────────
describe('CmsPortfolioList', () => {
  test('load merges the featured flag from related projects', async () => {
    snapRoutes.push({
      match: CMS_KEYS.PORTFOLIOLIST,
      snap: () =>
        snapOf([
          { label: 'A', link: '/p/a' },
          { label: 'B', link: '/p/b', featured: STATE_STRINGS.TRUE },
        ]),
    })
    snapRoutes.push({
      match: 'components/related/projects',
      snap: () => snapOf([{ link: '/p/a', featured: true }]),
    })

    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    await flush()

    expect(el.items).toHaveLength(2)
    expect(el.items[0].featured).toBe(true)
    expect(el.items[1].featured).toBe(true)
    expect(el.items[0].width).toHaveLength(2)

    el.remove()
  })

  test('load handles a missing snapshot and non-array values', async () => {
    snapRoutes.push({ match: CMS_KEYS.PORTFOLIOLIST, snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    await flush()

    expect(el.items).toEqual([])

    el.remove()
  })

  test('moveUp/moveDown respect list boundaries', async () => {
    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    el.items = [{ id: 'a' }, { id: 'b' }]

    el.moveUp(0)
    el.moveDown(1)

    expect(el.items[0].id).toBe('a')

    el.remove()
  })

  test('savePortfolio writes items and refreshes related featured flags', async () => {
    snapRoutes.push({
      match: 'components/related/projects',
      snap: () => snapOf([{ link: '/p/a', featured: false }]),
    })

    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    await flush()

    el.items = [{ label: 'A', link: '/p/a', featured: true }]

    await el.savePortfolio()

    expect(setCalls.length).toBeGreaterThanOrEqual(1)
    expect(setCalls.at(-1).value[0].featured).toBe(true)

    el.remove()
  })

  test('syncNonLocalizedToAllLangs merges structure preserving localized text', async () => {
    snapRoutes.push({
      match: CMS_KEYS.PORTFOLIOLIST,
      snap: () => snapOf([{ label: 'DE label', description: 'de desc', link: '/p/a' }]),
    })

    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    await flush()

    el.items = [
      {
        label: 'EN label',
        description: 'en desc',
        link: '/p/a',
        image: 'img.webp',
        featured: true,
      },
    ]

    confirms.push(true)

    await el.syncNonLocalizedToAllLangs()

    expect(setCalls.length).toBeGreaterThanOrEqual(el.languages.length - 1)
    expect(setCalls[0].value[0].label).toBe('DE label')
    expect(setCalls[0].value[0].image).toBe('img.webp')

    el.remove()
  })
})
