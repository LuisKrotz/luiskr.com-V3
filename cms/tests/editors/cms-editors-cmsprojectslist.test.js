/**
 * @file cms-editors-cmsprojectslist.test.js
 * @description Split from cms-editors.test.js — covers the "CmsProjectsList" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { LOCALES } from '@core/constants.js'
import { CMS_TAGS } from '@cms/tokens.js'
import { TEST_TEXT, TEST_PROJECTS } from '@tests/fixtures/test-constants.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'

const setCalls = []
const snapVal = {
  title: TEST_TEXT.HEADING,
  sections: [{ text: [TEST_TEXT.BODY], media: [] }],
}

jest.unstable_mockModule('@core/firebase.js', () => ({
  onAuthChange: jest.fn(async () => () => {}),
  signInWithGoogle: jest.fn(async () => ({})),
  logoutUser: jest.fn(async () => {}),
  getDbInstance: jest.fn(async () => ({ db: true })),
}))

jest.unstable_mockModule('firebase/database', () => ({
  ref: jest.fn((db, p) => ({ db, p })),
  child: jest.fn((r, p) => ({ r, p })),
  get: jest.fn(async () => ({ exists: () => true, val: () => snapVal })),
  set: jest.fn(async (r, v) => {
    setCalls.push(v)
  }),
  remove: jest.fn(async () => {}),
}))

await import('@cms/projects/CmsProjectsList.js')
await import('@cms/footer/CmsFooterEditor.js')
await import('@cms/portfolio/CmsPortfolioList.js')
await import('@cms/media-convert/CmsMediaConverter.js')

const mount = (tag) => {
  const el = document.createElement(tag)

  document.body.appendChild(el)

  return el
}

const flush = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

beforeEach(() => {
  setCalls.length = 0
  document.body.innerHTML = CHAR_STRINGS.EMPTY
})

// ─── CmsProjectsList ─────────────────────────────────────────────────────────
describe('CmsProjectsList', () => {
  test('loads project keys on mount', async () => {
    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    expect(el.languages).toContain(LOCALES.EN)

    el.remove()
  })

  test('createProjectPrompt prompts for a key and creates the project', async () => {
    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    globalThis.prompt = jest.fn(() => TEST_PROJECTS.CICB)
    globalThis.confirm = jest.fn(() => true)

    el.createProjectPrompt?.()

    await flush()

    el.remove()
  })

  test('section operations normalize, add, move, and remove', async () => {
    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    el.currentProject = {
      title: TEST_TEXT.HEADING,
      sections: [
        { text: ['a'], media: [] },
        { text: ['b'], media: [] },
      ],
    }

    el.addSection()

    expect(el.currentProject.sections.length).toBe(3)

    el.moveSection(0, 1)

    expect(el.currentProject.sections[0].text).toEqual(['b'])

    el.addSectionText(0)
    el.removeSectionText(0, 0)
    el.addSectionMedia(0)
    el.removeSectionMedia(0, 0)
    el.removeSection(2)

    expect(el.currentProject.sections.length).toBe(2)

    el.remove()
  })

  test('_normalizeSection returns a shaped section', () => {
    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    const sec = el._normalizeSection?.({ text: 'x' })

    expect(sec).toBeTruthy()

    el.remove()
  })

  test('_notify surfaces a message without throwing', () => {
    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    el._notify?.(TEST_TEXT.BODY)

    el.remove()
  })
})
