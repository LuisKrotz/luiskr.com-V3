/**
 * @file cms-deep-coverage-cmsdeployinfo.test.js
 * @description Split from cms-deep-coverage.test.js — covers the "CmsDeployInfo" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { SECTIONS } from '@core/constants.js'
import { CMS_TAGS } from '@cms/tokens.js'
import { TEST_TEXT, TEST_URLS } from '@tests/fixtures/test-constants.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'

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

// ─── CmsDeployInfo ───────────────────────────────────────────────────────────
describe('CmsDeployInfo', () => {
  const manifest = {
    generatedAt: '2025-01-01',
    commit: 'abc',
    files: {
      lighthouse: 'lighthouse.json',
      coverage: 'coverage.json',
      axe: 'axe-report.json',
      snyk: 'snyk-report.json',
      consoleScan: 'console-scan.json',
    },
  }

  const stubFetch = (payloads) => {
    globalThis.fetch = jest.fn(async (url) => {
      const u = String(url)

      for (const [key, body] of Object.entries(payloads)) {
        if (u.includes(key)) return { ok: true, json: async () => body }
      }

      return { ok: false, json: async () => null }
    })
  }

  test('missing bundle renders the hint state', async () => {
    stubFetch({})

    const el = mount(CMS_TAGS.CMS_DEPLOY_INFO)

    await flush()

    expect(el._fetchState).toBe('missing')

    el.remove()
  })

  test('full bundle renders every report section with score classes', async () => {
    stubFetch({
      'index.json': manifest,
      'lighthouse.json': {
        urls: [
          {
            url: 'https://x/',
            scores: { performance: 0.97, accessibility: 1, 'best-practices': 0.6, seo: 0.3 },
          },
          { url: 'https://x/p', scores: null },
        ],
      },
      'coverage.json': {
        total: {
          lines: { covered: 90, total: 100, pct: 90 },
          statements: { covered: 80, total: 100, pct: 80 },
          functions: { covered: 95, total: 100, pct: 95 },
          branches: { covered: 40, total: 100, pct: 40 },
        },
      },
      'axe-report.json': {
        engine: 'axe',
        totals: { violations: 1, criticalOrSerious: 1, passes: 10, incomplete: 0 },
        surfaces: [
          { surface: SECTIONS.HOME, violations: [{ impact: 'serious', id: 'r1', help: 'fix' }] },
        ],
      },
      'snyk-report.json': {
        scanner: 'snyk',
        ok: false,
        totals: { total: 1, critical: 0, high: 1, moderate: 0, low: 0 },
        vulnerabilities: [
          {
            packageName: 'pkg',
            severity: STATE_STRINGS.HIGH,
            title: 'v',
            fixedIn: '1.2',
            acceptedRisk: true,
          },
        ],
      },
      'console-scan.json': {
        ok: true,
        totals: { callsites: 5, warn: 3, error: 2, exempted: 0, violations: 1 },
        violations: [{ file: 'a.js', line: 3, method: 'log' }],
      },
    })

    const el = mount(CMS_TAGS.CMS_DEPLOY_INFO)

    await flush()

    expect(el._fetchState).toBe('ready')

    el._updateDom()

    const html = el.shadowRoot.innerHTML

    expect(html).toContain('accepted')
    expect(html).toContain('gate')

    el.remove()
  })

  test('empty reports render their no-data hints', async () => {
    stubFetch({
      'index.json': { generatedAt: 'x', files: {} },
    })

    const el = mount(CMS_TAGS.CMS_DEPLOY_INFO)

    await flush()

    expect(el._fetchState).toBe('ready')

    el._updateDom()

    expect(el.shadowRoot.innerHTML).toContain('No Lighthouse data')

    el.remove()
  })

  test('reports without totals or lists hit every default-value arm', async () => {
    stubFetch({
      'index.json': manifest,
      'lighthouse.json': { urls: [{ url: TEST_URLS.EXTERNAL, scores: { performance: 0.5 } }] },
      'coverage.json': { total: { lines: { covered: 5, total: 10, pct: 50 } } },
      'axe-report.json': {
        engine: 'axe',
        surfaces: [
          { surface: SECTIONS.HOME, violations: [{ impact: 'minor', id: 'r2', help: 'h' }] },
          { surface: 'empty-surface' },
        ],
      },
      'snyk-report.json': {
        scanner: 'snyk',
        ok: true,
        totals: { total: 2 },
        vulnerabilities: [
          { packageName: 'pkg-a', severity: MEDIA_ATTRS.FETCH_PRIORITY_LOW, title: 't' },
          { packageName: 'pkg-b', severity: 'critical', title: 't2', fixedIn: '1.0' },
        ],
      },
      'console-scan.json': {},
    })

    const el = mount(CMS_TAGS.CMS_DEPLOY_INFO)

    await flush()

    expect(el._fetchState).toBe('ready')

    el._updateDom()

    // variants without totals/surfaces/vulnerabilities -> the `||`/`??` arms
    el.axe = { engine: 'axe' }
    el.snyk = { scanner: 'snyk' }
    el._updateDom()

    expect(el.shadowRoot.innerHTML.length).toBeGreaterThan(0)

    el.remove()
  })

  test('a corrupt report body degrades to null via the json catch arm', async () => {
    globalThis.fetch = jest.fn(async (url) => {
      const u = String(url)

      if (u.includes('index.json')) return { ok: true, json: async () => manifest }
      if (u.includes('lighthouse.json'))
        return {
          ok: true,
          json: async () => {
            throw new Error('corrupt')
          },
        }

      return { ok: false, json: async () => null }
    })

    const el = mount(CMS_TAGS.CMS_DEPLOY_INFO)

    await flush()

    expect(el._fetchState).toBe('ready')
    expect(el.shadowRoot.innerHTML).toContain('No Lighthouse data')

    el.remove()
  })
})
