/**
 * @file cms-components-cmsprojectslist.test.js
 * @description Split from cms-components.test.js — covers the "CmsProjectsList" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { LOCALES, ROUTE_PREFIXES } from '@core/constants.js'
import { CMS_TAGS } from '@cms/tokens.js'
import { TEST_PROJECTS } from '@tests/fixtures/test-constants.js'
import { NAV_TEXT } from '@core/tokens/strings/text.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { APP_IDS } from '@core/tokens/ids/app.js'

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
await import('@cms/projects/CmsProjectsList.js')
await import('@cms/about/CmsAboutEditor.js')
await import('@cms/footer/CmsFooterEditor.js')
await import('@cms/portfolio/CmsPortfolioList.js')
await import('@cms/media-convert/CmsMediaConverter.js')
await import('@cms/deploy-info/CmsDeployInfo.js')

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
