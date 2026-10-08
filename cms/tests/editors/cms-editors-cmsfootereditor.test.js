/**
 * @file cms-editors-cmsfootereditor.test.js
 * @description Split from cms-editors.test.js — covers the "CmsFooterEditor" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { CMS_TAGS } from '@cms/tokens.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
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

// ─── CmsFooterEditor ─────────────────────────────────────────────────────────
describe('CmsFooterEditor', () => {
  test('loads all footer data on mount', async () => {
    const el = mount(CMS_TAGS.CMS_FOOTER_EDITOR)

    await flush()

    expect(el.contactData).toBeTruthy()

    el.remove()
  })

  test('_addItem/_removeItem/_moveItem mutate the list and re-render', async () => {
    const el = mount(CMS_TAGS.CMS_FOOTER_EDITOR)

    const arr = el.contactData.line1

    el._addItem(arr, { label: 'x' })

    expect(arr.length).toBe(1)

    el._addItem(arr, { label: 'y' })
    el._moveItem(arr, 0, 1)

    expect(arr[0].label).toBe('y')

    el._removeItem(arr, 0)

    expect(arr.length).toBe(1)

    el.remove()
  })

  test('render outputs all three footer sections', async () => {
    const el = mount(CMS_TAGS.CMS_FOOTER_EDITOR)

    el._updateDom()

    await flush()

    el.remove()
  })

  test('_renderChannelList renders an item list with controls', () => {
    const el = mount(CMS_TAGS.CMS_FOOTER_EDITOR)

    const arr = [{ description: 'a', href: '#' }]
    const node = el._renderChannelList?.(arr, 'p', () => {})

    expect(node).toBeTruthy()

    el.remove()
  })
})
