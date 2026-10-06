/**
 * @file cms-components.test.js
 * @description Covers the CMS editor components: Firebase-backed load/save
 * flows for projects, portfolio, about and footer editors, and the
 * localhost media-converter pipeline. firebase/* is module-mocked; `get`
 * resolves snapshots from a path-keyed fixture so each editor reads real
 * data shapes.
 */

import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { LOCALES, ROUTE_PREFIXES } from '@/core/constants.js'
import { CMS_TAGS } from '@/cms/tokens.js'
import { TEST_PROJECTS } from '../fixtures/test-constants.js'
import { NAV_TEXT } from '../../src/core/tokens/strings/text.js'
import { ROUTE_PATHS } from '../../src/core/tokens/routes/paths.js'
import { APP_IDS } from '../../src/core/tokens/ids/app.js'
import { DOM_STRINGS } from '../../src/core/tokens/strings/dom.js'
import { NET_STRINGS } from '../../src/core/tokens/strings/net.js'

// Path-keyed DB fixture — `get(child(ref(db), path))` resolves from here.
const DB = {
  [`translations/${LOCALES.EN}/projects`]: {
    [TEST_PROJECTS.METCHA]: { title: TEST_PROJECTS.METCHA_TITLE },
    [TEST_PROJECTS.CICB]: { title: 'CICB' },
  },
  [`translations/${LOCALES.EN}/projects/${TEST_PROJECTS.METCHA}`]: {
    title: TEST_PROJECTS.METCHA_TITLE,
    folder: 'metcha/',
    seo: { noIndex: false },
    cover: { src: 'cover', label: 'Metcha Cover', size: [1920, 1080], isVideo: false },
    sections: [{ type: 'media-text', title: 'Intro' }],
  },
  [`translations/${LOCALES.EN}/projects/${TEST_PROJECTS.CICB}`]: {
    title: 'CICB',
    folder: 'cicb/',
    cover: { src: 'cover', label: 'CICB Cover', size: [1920, 1080] },
    sections: [],
  },
  [`translations/${LOCALES.EN}/pages/about`]: {
    title: NAV_TEXT.ABOUT_ME,
    col1: ['Line one'],
    col2: ['Line two'],
    mentions: NAV_TEXT.SOME_MENTIONS,
    mention_items: [{ text: 'FWA', sub: '2024' }],
    profilePicture: 'https://cdn/avatar.png?s=200',
  },
  [`translations/${LOCALES.EN}/pages/portfolio`]: {
    title: 'Portfolio',
    portfoliolist: [
      {
        title: TEST_PROJECTS.METCHA_TITLE,
        link: `${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.METCHA}`,
      },
    ],
  },
  [`translations/${LOCALES.EN}/components/contact`]: {
    title: NAV_TEXT.CONTACT,
    line1: [{ link: 'mailto:x@x.com', description: 'Email' }],
    line2: [],
  },
  [`translations/${LOCALES.EN}/components/legal-footer`]: {
    links: [{ page: ROUTE_PREFIXES.PRIVACY, link: ROUTE_PATHS.PRIVACY_POLICY }],
  },
  [`translations/${LOCALES.EN}/components/related`]: {
    title: NAV_TEXT.RELATED,
    note: 'note',
    socials: [],
  },
}

const setCalls = []
const removeCalls = []
const getCalls = []

jest.unstable_mockModule('firebase/app', () => ({
  initializeApp: jest.fn(() => ({ marker: APP_IDS.APP })),
}))

jest.unstable_mockModule('firebase/auth', () => ({
  getAuth: jest.fn(() => ({ marker: 'auth' })),
}))

jest.unstable_mockModule('firebase/database', () => ({
  getDatabase: jest.fn(() => ({ marker: 'db' })),
  ref: jest.fn((_db, p) => ({ path: p || '' })),
  child: jest.fn((r, p) => ({ path: `${r.path || ''}${r.path ? '/' : ''}${p}` })),
  get: jest.fn(async (r) => {
    getCalls.push(r.path)
    const val = DB[r.path]
    return {
      exists: () => val !== undefined && val !== null,
      val: () => val,
    }
  }),
  set: jest.fn(async (r, data) => {
    setCalls.push({ path: r.path, data })
  }),
  remove: jest.fn(async (r) => {
    removeCalls.push(r.path)
  }),
}))

// Side-effect imports: each module registers its custom element on import.
await import('@/cms/projects/CmsProjectsList.js')
await import('@/cms/about/CmsAboutEditor.js')
await import('@/cms/footer/CmsFooterEditor.js')
await import('@/cms/portfolio/CmsPortfolioList.js')
await import('@/cms/media-convert/CmsMediaConverter.js')
await import('@/cms/deploy-info/CmsDeployInfo.js')

const mount = async (El) => {
  const el = document.createElement(El)
  document.body.appendChild(el)
  await new Promise((r) => setTimeout(r, 60))
  return el
}

describe('CmsProjectsList', () => {
  let el
  beforeEach(async () => {
    document.body.innerHTML = ''
    setCalls.length = 0
    el = await mount(CMS_TAGS.CMS_PROJECTS_LIST)
  })

  test('loads project keys and selects the first project', () => {
    expect(el.projectKeys).toContain(TEST_PROJECTS.METCHA)
    expect(el.selectedProjectKey).toBe(TEST_PROJECTS.CICB) // sorted: cicb < metcha
    expect(el.currentProject).not.toBeNull()
  })

  test('renders the editor UI with inputs bound', () => {
    expect(el.shadowRoot.innerHTML.length).toBeGreaterThan(100)
  })

  test('createProjectPrompt adds a new slug-keyed project', () => {
    globalThis.prompt = () => 'New-Project!!'
    el.createProjectPrompt()

    expect(el.projectKeys).toContain('new-project')
    expect(el.currentProject.title).toBe('NEW-PROJECT')
  })

  test('createProjectPrompt ignores duplicates and empty input', () => {
    globalThis.alert = jest.fn()

    globalThis.prompt = () => TEST_PROJECTS.CICB
    el.createProjectPrompt()
    expect(globalThis.alert).toHaveBeenCalled()

    const before = el.projectKeys.length
    globalThis.prompt = () => ''
    el.createProjectPrompt()
    expect(el.projectKeys.length).toBe(before)

    delete globalThis.alert
    delete globalThis.prompt
  })

  test('saveProjectData writes the project via set()', async () => {
    el.selectedProjectKey = TEST_PROJECTS.METCHA
    await el.loadProjectData()
    el.currentProject.title = 'Metcha Updated'
    await el.saveProjectData()

    expect(setCalls.length).toBeGreaterThan(0)
    const call = setCalls.find((c) => c.path.includes(TEST_PROJECTS.METCHA))
    expect(call).toBeDefined()
    expect(call.data.title).toBe('Metcha Updated')
  })

  test('deleteProject removes the key across all languages', async () => {
    removeCalls.length = 0
    globalThis.confirm = () => true
    el.selectedProjectKey = TEST_PROJECTS.CICB
    await el.deleteProject()
    delete globalThis.confirm

    expect(removeCalls.length).toBeGreaterThan(0)
    expect(removeCalls[0]).toContain(TEST_PROJECTS.CICB)
  })

  test('deleteProject respects cancel', async () => {
    removeCalls.length = 0
    globalThis.confirm = () => false
    el.selectedProjectKey = TEST_PROJECTS.CICB
    await el.deleteProject()
    delete globalThis.confirm

    expect(removeCalls.length).toBe(0)
  })
})

describe('CmsAboutEditor', () => {
  let el
  beforeEach(async () => {
    document.body.innerHTML = ''
    setCalls.length = 0
    el = await mount(CMS_TAGS.CMS_ABOUT_EDITOR)
  })

  test('loads about page data into aboutData', () => {
    expect(el.aboutData.title).toBe(NAV_TEXT.ABOUT_ME)
    expect(el.aboutData.col1).toEqual(['Line one'])
    expect(el.aboutData.mention_items.length).toBe(1)
  })

  test('paragraph add/remove/move mutates the columns', () => {
    el.addParagraph('col1')
    expect(el.aboutData.col1.length).toBe(2)

    el.moveParagraph('col1', 1, -1)
    expect(el.aboutData.col1[0]).toBeDefined()

    el.removeParagraph('col1', 0)
    expect(el.aboutData.col1.length).toBe(1)
  })

  test('mention add/remove works', () => {
    el.addMentionItem()
    expect(el.aboutData.mention_items.length).toBe(2)
    el.removeMentionItem(0)
    expect(el.aboutData.mention_items.length).toBe(1)
  })

  test('gravatar size helper rewrites the ?s= param', () => {
    el.aboutData.profilePicture = 'https://cdn/avatar.png?s=200'
    el.setGravatarSize(300)
    expect(el.aboutData.profilePicture).toBe('https://cdn/avatar.png?s=300')
  })

  test('saveAboutData writes via set()', async () => {
    await el.saveAboutData()
    expect(setCalls.length).toBeGreaterThan(0)
  })

  test('syncNonLocalizedToAllLangs propagates shared fields to every locale', async () => {
    setCalls.length = 0
    globalThis.confirm = () => true
    await el.syncNonLocalizedToAllLangs()
    delete globalThis.confirm
    // non-localized fields (profile picture etc.) written for each VALID_LANG
    expect(setCalls.length).toBeGreaterThan(0)
  })
})

describe('CmsFooterEditor', () => {
  let el
  beforeEach(async () => {
    document.body.innerHTML = ''
    el = await mount(CMS_TAGS.CMS_FOOTER_EDITOR)
  })

  test('loads contact/legal/related footer data', () => {
    expect(el.contactData.title).toBe(NAV_TEXT.CONTACT)
    expect(el.contactData.line1.length).toBe(1)
    expect(el.legalLinks.length).toBe(1)
    expect(el.relatedFooter.title).toBe(NAV_TEXT.RELATED)
  })

  test('renders editor sections', () => {
    expect(el.shadowRoot.innerHTML.length).toBeGreaterThan(100)
  })
})

describe('CmsPortfolioList', () => {
  test('loads the portfolio page data', async () => {
    document.body.innerHTML = ''
    const el = await mount(CMS_TAGS.CMS_PORTFOLIO_LIST)
    expect(el.shadowRoot.innerHTML.length).toBeGreaterThan(50)
  })
})

describe('CmsMediaConverter', () => {
  test('renders the drop zone and file input', async () => {
    document.body.innerHTML = ''
    const el = await mount(CMS_TAGS.CMS_MEDIA_CONVERTER)
    const input = el.$('#cms-media-file-input')
    expect(input).not.toBeNull()
    expect(input.getAttribute(DOM_STRINGS.TYPE)).toBe('file')
  })

  test('collects files from the input into the pending queue', async () => {
    document.body.innerHTML = ''
    const el = await mount(CMS_TAGS.CMS_MEDIA_CONVERTER)
    const file = new File(['x'], 'img.png', { type: NET_STRINGS.IMAGE_PNG })
    el._collectInput({ files: [file] })
    expect(el.queue.length).toBeGreaterThan(0)
  })
})

describe('CmsDeployInfo', () => {
  test('renders missing state when no deploy-info bundle exists', async () => {
    document.body.innerHTML = ''
    const orig = globalThis.fetch
    globalThis.fetch = jest.fn(async () => ({ ok: false, status: 404, json: async () => null }))

    const el = await mount(CMS_TAGS.CMS_DEPLOY_INFO)
    expect(el._fetchState).toBe('missing')

    globalThis.fetch = orig
  })

  test('renders the full report when the bundle exists', async () => {
    document.body.innerHTML = ''
    const index = {
      generatedAt: 'now',
      commit: 'abc123',
      files: {
        lighthouse: 'lighthouse-summary.json',
        coverage: 'coverage-summary.json',
        axe: 'axe-report.json',
        snyk: 'snyk-report.json',
        consoleScan: 'console-scan.json',
      },
    }
    const payloads = {
      'lighthouse-summary.json': { urls: [{ url: '/', scores: { performance: 0.95 } }] },
      'coverage-summary.json': { total: { lines: { covered: 9, total: 10, pct: 90 } } },
      'axe-report.json': { totals: { violations: 0 }, surfaces: [] },
      'snyk-report.json': { scanner: 'snyk', totals: { total: 0 }, vulnerabilities: [] },
      'console-scan.json': { totals: { callsites: 5 }, violations: [] },
    }
    const orig = globalThis.fetch
    globalThis.fetch = jest.fn(async (url) => {
      const key = url.split('/').pop()
      if (key === 'index.json') return { ok: true, json: async () => index }
      return { ok: true, json: async () => payloads[key] || null }
    })

    const el = await mount(CMS_TAGS.CMS_DEPLOY_INFO)
    expect(el._fetchState).toBe('ready')
    expect(el.axe).not.toBeNull()
    expect(el.snyk).not.toBeNull()
    expect(el.consoleScan).not.toBeNull()
    expect(el.shadowRoot.innerHTML).toContain('Accessibility Scan')
    expect(el.shadowRoot.innerHTML).toContain('Dependency Scan')
    expect(el.shadowRoot.innerHTML).toContain('Console Usage Scan')

    globalThis.fetch = orig
  })
})
