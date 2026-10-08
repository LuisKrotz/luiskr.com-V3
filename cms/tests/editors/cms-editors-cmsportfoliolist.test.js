/**
 * @file cms-editors-cmsportfoliolist.test.js
 * @description Split from cms-editors.test.js — covers the "CmsPortfolioList" describe.
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
  // removeItem() confirm()s destructive deletes — jsdom lacks a confirm impl.
  globalThis.confirm = jest.fn(() => true)
  document.body.innerHTML = CHAR_STRINGS.EMPTY
})

// ─── CmsPortfolioList ────────────────────────────────────────────────────────
describe('CmsPortfolioList', () => {
  test('loads the portfolio list on mount', async () => {
    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    await flush()

    expect(Array.isArray(el.items)).toBe(true)

    el.remove()
  })

  test('getImagePreview resolves CDN and pass-through URLs', () => {
    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    expect(el.getImagePreview('http://x/img.webp')).toBe('http://x/img.webp')
    expect(el.getImagePreview('file.webp')).toContain('file.webp')
    expect(el.getImagePreview('')).toBe(CHAR_STRINGS.EMPTY)

    el.remove()
  })

  test('updateDim writes a dimension on the item', () => {
    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    el.items = [{ size: [800, 450] }]

    el.updateDim(el.items[0], 'size', 0, '1024')

    expect(el.items[0].size[0]).toBe('1024')

    el.remove()
  })

  test('add/remove/move operations reorder the list', () => {
    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    el.items = [{ id: 'a' }, { id: 'b' }]

    el.addNewItem()

    expect(el.items.length).toBe(3)

    el.moveUp(1)

    expect(el.items[0].id).toBe('b')

    el.moveDown(0)

    expect(el.items[1].id).toBe('b')

    el.removeItem(0)

    expect(el.items.length).toBe(2)

    el.remove()
  })
})
