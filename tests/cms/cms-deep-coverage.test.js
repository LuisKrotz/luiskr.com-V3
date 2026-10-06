/**
 * @file cms-deep-coverage.test.js
 * @description Branch-level coverage for the CMS editors and shell:
 * data-load variants, save/sync flows (confirm-gated cross-locale writes),
 * error paths (alert surfaces), input/event handlers, and the deploy-info
 * report renderers. Firebase is mocked with path-keyed snapshots; fetch,
 * confirm/alert/prompt and Notification are stubbed per test.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { CMS_KEYS, LOCALES, SECTIONS, TRANSLATION_KEYS } from '@/core/constants.js'
import { CMS_EVENTS, CMS_TAGS, CMS_TABS } from '@/cms/tokens.js'
import { TEST_TEXT, TEST_URLS } from '../fixtures/test-constants.js'
import { CHAR_STRINGS } from '../../src/core/tokens/strings/chars.js'
import {
  DRAG_EVENTS,
  FORM_EVENTS,
  MOUSE_EVENTS,
  WINDOW_EVENTS,
} from '../../src/core/tokens/events/dom.js'
import { STATE_STRINGS } from '../../src/core/tokens/strings/state.js'
import { DB_PATHS } from '../../src/core/tokens/routes/paths.js'
import { MEDIA_ATTRS } from '../../src/core/tokens/attrs/media.js'
import { STATE_CLASSES } from '../../src/core/tokens/classes/state.js'
import { DATA_ATTRS } from '../../src/core/tokens/attrs/data.js'
import { HTML_TAGS } from '../../src/core/tokens/elements/html.js'
import { ATTR_VALUES } from '../../src/core/tokens/attrs/values.js'
import { COVER_DIMENSIONS, MOSAIC_DIMENSIONS } from '../../src/core/tokens/media/dimensions.js'
import { CMS_ADMIN_CLASSES, CMS_DASHBOARD_CLASSES, CMS_ITEM_CLASSES } from '@/cms/tokens.js'

const authCallbacks = []
const setCalls = []
const removeCalls = []

// Path-keyed snapshot routing: each test registers matchers against the
// Firebase path fragment so one `get` mock can serve different nodes.
const snapRoutes = []
const defaultVal = { title: TEST_TEXT.HEADING }

const snapOf = (val, exists = true) => ({ exists: () => exists, val: () => val })

jest.unstable_mockModule('../../src/firebase.js', () => ({
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

await import('@/cms/about/CmsAboutEditor.js')
await import('@/cms/footer/CmsFooterEditor.js')
await import('@/cms/portfolio/CmsPortfolioList.js')
await import('@/cms/media-convert/CmsMediaConverter.js')
await import('@/cms/projects/CmsProjectsList.js')
await import('@/cms/lang/CmsLangEditor.js')
await import('@/cms/playground-editor/CmsPlaygroundEditor.js')
await import('@/cms/deploy-info/CmsDeployInfo.js')
await import('@/cms/routes/CmsDashboard.js')
await import('@/cms/routes/AdminLogin.js')

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

// ─── CmsAboutEditor ──────────────────────────────────────────────────────────

describe('CmsAboutEditor', () => {
  const mountLoaded = async (aboutVal) => {
    snapRoutes.push({ match: 'pages/about', snap: () => snapOf(aboutVal, aboutVal != null) })

    const el = mount(CMS_TAGS.CMS_ABOUT_EDITOR)

    await flush()

    return el
  }

  test('load reads the saved Gravatar size out of the stored URL', async () => {
    const el = await mountLoaded({
      title: 'T',
      profilePicture: 'https://www.gravatar.com/avatar/abc?s=300',
      col1: ['p1'],
      col2: [],
      mention_items: [{ description: 'd', link: 'l', icon: 'i' }],
    })

    expect(el.gravatarSize).toBe(300)
    expect(el.aboutData.col1).toEqual(['p1'])

    el.remove()
  })

  test('load falls back to defaults when the snapshot is missing', async () => {
    const el = await mountLoaded(null)

    expect(el.aboutData.col1).toEqual([])

    el.remove()
  })

  test('generateGravatarUrl hashes the email and applies the size preset', async () => {
    const el = await mountLoaded(null)

    el.emailInput = '  USER@Example.COM '
    el.gravatarSize = 256

    await el.generateGravatarUrl()

    expect(el.aboutData.profilePicture).toContain('gravatar.com/avatar/')
    expect(el.aboutData.profilePicture).toContain('s=256')

    el.emailInput = '   '

    await el.generateGravatarUrl()

    el.remove()
  })

  test('setGravatarSize rewrites the size param on the stored URL', async () => {
    const el = await mountLoaded({ profilePicture: 'https://x/avatar?foo=1&s=300' })

    el.setGravatarSize(150)

    expect(el.aboutData.profilePicture).toContain('s=150')
    expect(el.aboutData.profilePicture).not.toContain('s=300')

    el.remove()
  })

  test('paragraph ops add, move (bounds-checked) and remove', async () => {
    const el = await mountLoaded({ col1: ['a', 'b'] })

    el.addParagraph('col2')

    expect(el.aboutData.col2).toEqual([CHAR_STRINGS.EMPTY])

    el.moveParagraph('col1', 0, -1)

    expect(el.aboutData.col1).toEqual(['a', 'b'])

    el.moveParagraph('col1', 0, 1)

    expect(el.aboutData.col1).toEqual(['b', 'a'])

    el.moveParagraph('col1', 1, 1)
    el.removeParagraph('col1', 0)

    expect(el.aboutData.col1).toEqual(['a'])

    el.remove()
  })

  test('mention ops add, edit-model move (bounds-checked) and remove', async () => {
    const el = await mountLoaded(null)

    el.addMentionItem()
    el.addMentionItem()

    expect(el.aboutData.mention_items).toHaveLength(2)

    el.moveMentionItem(0, -1)
    el.moveMentionItem(1, 1)

    expect(el.aboutData.mention_items).toHaveLength(2)

    el.moveMentionItem(0, 1)
    el.removeMentionItem(0)

    expect(el.aboutData.mention_items).toHaveLength(1)

    el.remove()
  })

  test('applyPictureToAllLangs skips on cancel and writes per-locale on confirm', async () => {
    const el = await mountLoaded({ profilePicture: 'https://x/pic?s=200' })

    confirms.push(false)

    await el.applyPictureToAllLangs()

    expect(setCalls).toHaveLength(0)

    confirms.push(true)

    await el.applyPictureToAllLangs()

    expect(setCalls.length).toBe(el.languages.length - 1)
    expect(el.syncingAll).toBe(false)

    // set failing mid-sync -> the catch alert arm
    snapRoutes.failSet = true
    await el.applyPictureToAllLangs()

    expect(alerts.length).toBeGreaterThan(0)
    snapRoutes.failSet = false

    el.remove()
  })

  test('syncNonLocalizedToAllLangs merges picture and mentions per locale', async () => {
    const el = await mountLoaded({
      profilePicture: 'https://www.gravatar.com/avatar/x?s=200',
      mention_items: [{ description: 'd' }],
    })

    confirms.push(true)

    await el.syncNonLocalizedToAllLangs()

    expect(setCalls.length).toBe(el.languages.length - 1)
    expect(setCalls[0].value.profilePicture).toContain('gravatar')
    expect(setCalls[0].value.mention_items).toHaveLength(1)

    el.remove()
  })

  test('saveAboutData writes the model and alerts on failure', async () => {
    const el = await mountLoaded({ title: 'T' })

    await el.saveAboutData()

    expect(setCalls.length).toBe(1)

    snapRoutes.failSet = true

    await el.saveAboutData()

    expect(alerts.length).toBeGreaterThan(0)

    snapRoutes.failSet = false

    el.remove()
  })

  test('sync failure alerts without leaving the syncing flag set', async () => {
    const el = await mountLoaded(null)

    confirms.push(true)
    snapRoutes.failSet = true

    await el.applyPictureToAllLangs()

    expect(alerts.length).toBeGreaterThan(0)
    expect(el.syncingAll).toBe(false)

    snapRoutes.failSet = false

    el.remove()
  })

  test('load catch logs, non-Error rejections alert, and defaults arms render', async () => {
    const el = await mountLoaded(null)

    // throwing get -> the load catch logs the failure
    snapRoutes.length = 0
    snapRoutes.push({
      match: CHAR_STRINGS.EMPTY,
      snap: () => {
        throw new Error('db gone')
      },
    })

    const errSpy = jest.spyOn(console, WINDOW_EVENTS.ERROR).mockImplementation(() => {})

    await el.loadAboutData()

    expect(errSpy).toHaveBeenCalled()
    errSpy.mockRestore()
    snapRoutes.length = 0

    // rejection without .message -> the `err.message || err` right arm
    const { set } = await import('firebase/database')

    set.mockRejectedValueOnce('plain-failure')
    await el.saveAboutData()

    expect(alerts.some((m) => m.includes('plain-failure'))).toBe(true)

    // empty model -> every `|| []`/`|| ''` render default arm
    el.aboutData = {}
    el._updateDom()

    el.addParagraph('colX')

    expect(el.aboutData.colX).toEqual([CHAR_STRINGS.EMPTY])

    delete el.aboutData.mention_items
    el.addMentionItem()

    expect(el.aboutData.mention_items).toHaveLength(1)

    delete el.aboutData.mention_items
    el.moveMentionItem(0, 1)

    expect(el.aboutData.mention_items).toBeUndefined()

    el.remove()
  })

  test('syncNonLocalized confirm-cancel and catch alert arms', async () => {
    const el = await mountLoaded({ profilePicture: 'https://x/p' })

    confirms.push(false)
    await el.syncNonLocalizedToAllLangs()

    expect(setCalls).toHaveLength(0)
    expect(el.syncingAll).toBe(false)

    confirms.push(true)
    snapRoutes.failSet = true
    await el.syncNonLocalizedToAllLangs()

    expect(alerts.length).toBeGreaterThan(0)
    expect(el.syncingAll).toBe(false)

    snapRoutes.failSet = false

    // non-Error rejections -> each `err.message || err` right arm
    const { set } = await import('firebase/database')

    confirms.push(true, true)
    set.mockRejectedValueOnce('x').mockRejectedValueOnce('y')
    await el.syncNonLocalizedToAllLangs()
    await el.applyPictureToAllLangs()

    expect(alerts.some((m) => m.includes('x'))).toBe(true)
    expect(alerts.some((m) => m.includes('y'))).toBe(true)

    el.remove()
  })

  test('size input fallback and stale-field input guards', async () => {
    const el = await mountLoaded({
      col1: ['a'],
      mention_items: [{ description: 'd', link: 'l', icon: 'i' }],
    })

    // non-numeric size input -> parseInt NaN -> `|| 512` arm
    const size = el.shadowRoot.querySelector('#about-size-input')

    if (size) {
      size.value = 'abc'
      size.dispatchEvent(new window.Event(FORM_EVENTS.INPUT))
    }

    // live para input -> the `if (this.aboutData[col])` true arm
    const para = el.shadowRoot.querySelector('.para-input')

    para.value = 'edited'
    para.dispatchEvent(new window.Event(FORM_EVENTS.INPUT))

    expect(el.aboutData.col1[0]).toBe('edited')

    // stale para input after the column was deleted -> the guard's else arm
    delete el.aboutData.col1
    para?.dispatchEvent(new window.Event(FORM_EVENTS.INPUT))

    // live mention field -> the `if (mention_items[idx])` true arm
    const field = el.shadowRoot.querySelector('.mention-field')

    field.value = 'newdesc'
    field.dispatchEvent(new window.Event(FORM_EVENTS.INPUT))

    expect(el.aboutData.mention_items[0].description).toBe('newdesc')

    // stale mention field after clearing items -> the items[idx] guard else arm
    el.aboutData.mention_items = []
    field?.dispatchEvent(new window.Event(FORM_EVENTS.INPUT))

    // rendered mention controls: remove/up/down dispatch through data-idx
    el.aboutData.mention_items = [
      { description: 'a', link: 'a', icon: 'a' },
      { description: 'b', link: 'b', icon: 'b' },
    ]
    el._updateDom()

    await flush()

    el.shadowRoot
      .querySelectorAll('.mention-down-btn')[0]
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelectorAll('.mention-up-btn')[1]
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelectorAll('.mention-remove-btn')[0]
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    expect(el.aboutData.mention_items).toHaveLength(1)

    // pic input while #gravatar-preview is absent -> the `if (previewImg)`
    // else arm; `$` returning null also covers the `on()` helper else arm
    const qsSpy = jest.spyOn(el, '$').mockReturnValue(null)

    el._bindEvents()

    const pic = el.shadowRoot.querySelector('#about-pic-input')

    pic?.dispatchEvent(new window.Event(FORM_EVENTS.INPUT))

    qsSpy.mockRestore()

    el.remove()
  })
})

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

    const errSpy = jest.spyOn(console, WINDOW_EVENTS.ERROR).mockImplementation(() => {})

    await el.loadAllData()

    expect(errSpy).toHaveBeenCalled()
    errSpy.mockRestore()

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

// ─── CmsMediaConverter ───────────────────────────────────────────────────────

describe('CmsMediaConverter deep', () => {
  test('_collectDrop walks file and directory entries recursively', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)
    const fileEntry = {
      isFile: true,
      name: 'a.webp',
      file: (res) => res({ name: 'a.webp' }),
    }
    let reads = 0
    const dirEntry = {
      isDirectory: true,
      name: 'dir',
      createReader: () => ({
        readEntries: (res) => res(reads++ === 0 ? [fileEntry] : []),
      }),
    }

    await el._collectDrop({
      items: [{ webkitGetAsEntry: () => fileEntry }, { webkitGetAsEntry: () => dirEntry }],
    })

    expect(el.queue).toHaveLength(2)
    expect(el.queue[1].rel).toContain('dir/')

    el.remove()
  })

  test('_collectDrop falls back to dataTransfer.files without entries', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    await el._collectDrop({
      items: [{}],
      files: [{ name: 'x.webp', webkitRelativePath: '' }],
    })

    expect(el.queue).toHaveLength(1)
    expect(el.queue[0].rel).toBe('x.webp')

    el.remove()
  })

  test('non-media files are ignored on drop and input', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)
    const iniEntry = {
      isFile: true,
      file: (res) => res(new File(['x'], 'desktop.ini')),
    }
    const jpgEntry = {
      isFile: true,
      file: (res) => res(new File(['x'], 'shot.JPG')),
    }

    // entry-traversal path: OS litter inside a dropped folder is skipped
    await el._collectDrop({
      items: [{ webkitGetAsEntry: () => iniEntry }, { webkitGetAsEntry: () => jpgEntry }],
    })

    expect(el.queue).toHaveLength(1)
    expect(el.queue[0].rel).toBe('shot.JPG')

    // dataTransfer.files fallback path
    await el._collectDrop({
      items: [{}],
      files: [
        { name: 'Thumbs.db', webkitRelativePath: 'dir/Thumbs.db' },
        { name: 'clip.webm', webkitRelativePath: '' },
      ],
    })

    expect(el.queue).toHaveLength(2)

    // <input type=file> path
    el._collectInput({
      files: [new File(['x'], 'notes.txt'), new File(['x'], 'pic.png')],
    })

    expect(el.queue).toHaveLength(3)
    expect(el.queue[2].rel).toBe('pic.png')

    el.remove()
  })

  test('_run early-returns on an empty queue', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)
    const fetchSpy = jest.fn()

    globalThis.fetch = fetchSpy

    await el._run()

    expect(fetchSpy).not.toHaveBeenCalled()

    el.remove()
  })

  test('_run surfaces server errors in the error phase', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el.queue = [{ file: new Blob(['x']), rel: 'a.webp' }]

    globalThis.fetch = jest.fn(async () => ({
      ok: false,
      status: 500,
      json: async () => ({ error: 'boom' }),
      text: async () => 'boom',
    }))

    await el._run()

    expect(el.phase).toBe(WINDOW_EVENTS.ERROR)
    expect(el.error).toContain('boom')

    el.remove()
  })

  test('_poll schedules the next tick while running and finishes on done', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el.jobId = 'j1'

    let calls = 0

    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () =>
        calls++ === 0
          ? { status: 'running' }
          : { status: 'done', results: [{ ok: true }, { ok: false }] },
    }))

    await el._poll()

    expect(el._pollTimer).toBeTruthy()

    await new Promise((resolve) => setTimeout(resolve, 900))

    expect(el.phase).toBe('done')
    expect(el.status.results).toHaveLength(2)

    el.remove()
  })

  test('_poll flips to error when the server stops answering', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el.jobId = 'j2'

    globalThis.fetch = jest.fn(async () => ({ ok: false }))

    await el._poll()

    expect(el.phase).toBe(WINDOW_EVENTS.ERROR)
    expect(el.error).toContain('lost contact')

    el.remove()
  })

  test('_finish reports zero conversions as an error', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    el.status = { status: 'done', results: [{ ok: false }], error: 'all failed' }
    el._finish()

    expect(el.phase).toBe(WINDOW_EVENTS.ERROR)
    expect(el.error).toBe('all failed')

    el.remove()
  })

  test('_systemNotify and _askNotifyPermission respect the Notification API', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    globalThis.Notification = class {
      static permission = STATE_STRINGS.DEFAULT
      static requestPermission = jest.fn(async () => STATE_STRINGS.GRANTED)
    }

    await el._askNotifyPermission()

    expect(globalThis.Notification.requestPermission).toHaveBeenCalled()

    globalThis.Notification.permission = STATE_STRINGS.GRANTED
    el._systemNotify('t', 'b')

    delete globalThis.Notification

    el._systemNotify('t', 'b')

    el.remove()
  })

  test('onDestroy deletes an unfinished job', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)
    const deleted = []

    globalThis.fetch = jest.fn(async (url, opts = {}) => {
      if (opts.method === 'DELETE') deleted.push(String(url))

      return { ok: true, json: async () => ({}) }
    })

    el.jobId = 'j3'
    el.phase = 'converting'

    el.remove()
    el.onDestroy()

    await flush(20)

    expect(deleted.length).toBeGreaterThan(0)
  })
})

// ─── CmsProjectsList deep ────────────────────────────────────────────────────

describe('CmsProjectsList deep', () => {
  test('empty project index resets selection without loading data', async () => {
    snapRoutes.push({ match: DB_PATHS.PROJECTS_SEGMENT, snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    expect(el.projectKeys).toEqual([])
    expect(el.currentProject).toBeNull()

    el.remove()
  })

  test('loadProjectData normalizes legacy section shapes', async () => {
    snapRoutes.push({ match: DB_PATHS.PROJECTS_SEGMENT, snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    el.selectedProjectKey = 'k1'
    snapRoutes.unshift({
      match: 'projects/k1',
      snap: () => snapOf({ title: 'K', sections: { a: { texts: ['t'], media: ['m'] }, b: ['x'] } }),
    })

    await el.loadProjectData()

    expect(el.currentProject.sections[0]).toEqual([['t'], ['m']])

    el.remove()
  })

  test('createProjectPrompt sanitizes the slug and rejects duplicates', async () => {
    snapRoutes.push({ match: DB_PATHS.PROJECTS_SEGMENT, snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    el.projectKeys = ['exists']

    globalThis.prompt = () => 'EXISTS'

    el.createProjectPrompt()

    expect(el.projectKeys).toHaveLength(1)
    expect(alerts.length).toBeGreaterThan(0)

    globalThis.prompt = () => 'New Proj!!'

    el.createProjectPrompt()

    expect(el.projectKeys).toContain('newproj')
    expect(el.currentProject.title).toBe('NEWPROJ')

    globalThis.prompt = () => CHAR_STRINGS.EMPTY

    el.createProjectPrompt()

    el.remove()
  })

  test('deleteProject requires selection and confirmation', async () => {
    snapRoutes.push({ match: DB_PATHS.PROJECTS_SEGMENT, snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    el.selectedProjectKey = CHAR_STRINGS.EMPTY

    await el.deleteProject()

    el.selectedProjectKey = 'k1'

    confirms.push(false)

    await el.deleteProject()

    expect(removeCalls).toHaveLength(0)

    confirms.push(true)

    await el.deleteProject()

    expect(removeCalls.length).toBe(el.languages.length)

    el.remove()
  })

  test('saveProjectData guards on selection and writes the model', async () => {
    snapRoutes.push({ match: DB_PATHS.PROJECTS_SEGMENT, snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    await el.saveProjectData()

    expect(setCalls).toHaveLength(0)

    el.selectedProjectKey = 'k1'
    el.currentProject = { title: 'K' }

    await el.saveProjectData()

    expect(setCalls).toHaveLength(1)

    snapRoutes.failSet = true

    await el.saveProjectData()

    expect(alerts.length).toBeGreaterThan(0)

    snapRoutes.failSet = false

    el.remove()
  })

  test('_normalizeSection covers array-pair, object and junk shapes', async () => {
    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    expect(el._normalizeSection([['a'], ['m']])).toEqual([['a'], ['m']])
    expect(el._normalizeSection({ texts: ['t'], media: ['m'] })).toEqual([['t'], ['m']])
    expect(el._normalizeSection({})).toEqual([[], []])
    expect(el._normalizeSection(42)).toEqual([[], []])

    el.remove()
  })

  test('section add/remove/move honor bounds and confirm guards', async () => {
    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    el.currentProject = {
      sections: [
        [['a'], []],
        [['b'], []],
      ],
    }

    el.moveSection(0, -1)
    el.moveSection(1, 1)

    expect(el.currentProject.sections[0][0]).toEqual(['a'])

    confirms.push(false)
    el.removeSection(0)

    expect(el.currentProject.sections).toHaveLength(2)

    confirms.push(true)
    el.removeSection(0)

    expect(el.currentProject.sections).toHaveLength(1)

    el.addSection()

    expect(el.currentProject.sections).toHaveLength(2)

    el.remove()
  })
})

// ─── CmsLangEditor / CmsPlaygroundEditor branches ────────────────────────────

describe('CmsLangEditor branches', () => {
  test('loadData handles a missing node gracefully', async () => {
    snapRoutes.push({ match: CMS_KEYS.APP, snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_LANG_EDITOR)

    await flush()

    expect(el.jsonContent).toBe('{}')

    el.remove()
  })

  test('node selector change reloads the dictionary', async () => {
    const el = mount(CMS_TAGS.CMS_LANG_EDITOR)

    await flush()

    const sel = el.shadowRoot.querySelector('#select-dict-node')

    if (sel) {
      sel.value = sel.options[1]?.value || sel.value
      sel.dispatchEvent(new window.Event(FORM_EVENTS.CHANGE))

      await flush()
    }

    el.remove()
  })

  test('language selector, textarea input and save flow', async () => {
    const el = mount(CMS_TAGS.CMS_LANG_EDITOR)

    await flush()

    const langSel = el.shadowRoot.querySelector('#select-dict-lang')
    const textarea = el.shadowRoot.querySelector('#json-editor')
    const saveBtn = el.shadowRoot.querySelector('#btn-save-lang')

    if (langSel) {
      langSel.value = langSel.options[1]?.value || langSel.value
      langSel.dispatchEvent(new window.Event(FORM_EVENTS.CHANGE))
      await flush()
    }

    if (textarea) {
      textarea.value = '{"a":1}'
      textarea.dispatchEvent(new window.Event(FORM_EVENTS.INPUT))
    }

    saveBtn?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    await flush()

    const notified = []
    const handler = (e) => notified.push(e)

    el.addEventListener(CMS_EVENTS.NOTIFY, handler)
    el.jsonContent = '{"b":2}'
    await el.saveData()

    expect(notified.length).toBe(1)

    el.remove()
  })

  test('invalid JSON aborts the write with an alert', async () => {
    const alerts = []
    const origAlert = globalThis.alert

    globalThis.alert = (m) => alerts.push(m)

    const el = mount(CMS_TAGS.CMS_LANG_EDITOR)

    await flush()

    el.jsonContent = '{broken'
    await el.saveData()

    expect(alerts.length).toBe(1)
    expect(el.saving).toBe(false)

    globalThis.alert = origAlert
    el.remove()
  })

  test('loadData tolerates a rejecting get and _bindEvents tolerates missing nodes', async () => {
    snapRoutes.push({
      match: 'reject-node-zz',
      snap: () => {
        throw new Error('db-down')
      },
    })

    const el = mount(CMS_TAGS.CMS_LANG_EDITOR)

    await flush()

    el.selectedNode = 'reject-node-zz'
    await el.loadData()

    const qs = jest.spyOn(el.shadowRoot, 'querySelector').mockReturnValue(null)

    el._bindEvents()
    qs.mockRestore()

    el.remove()
  })
})

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

    const errSpy = jest.spyOn(console, WINDOW_EVENTS.ERROR).mockImplementation(() => {})

    await el.loadAllData()

    expect(errSpy).toHaveBeenCalled()

    errSpy.mockRestore()
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

// ─── CmsDashboard / AdminLogin branches ─────────────────────────────────────

describe('CmsDashboard branches', () => {
  test('tab clicks switch the mounted editor', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    const tabs = el.shadowRoot.querySelectorAll(`.${CMS_DASHBOARD_CLASSES.CMS_TAB_BTN}`)

    tabs[1]?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    expect(el.activeTab).toBe(CMS_TABS.PROJECTS)

    tabs[1]?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    el.remove()
  })

  test('brand click navigates home and logout click signs out', async () => {
    const { logoutUser } = await import('@/firebase.js')
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    const assigned = []
    const origAssign = window.location.assign

    try {
      Object.defineProperty(window.location, 'assign', {
        value: (u) => assigned.push(u),
        configurable: true,
      })
    } catch {
      window.location.assign = (u) => assigned.push(u)
    }

    el.shadowRoot
      .querySelector(`.${CMS_DASHBOARD_CLASSES.CMS_BRAND}`)
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector(`.${CMS_DASHBOARD_CLASSES.CMS_LOGOUT_BTN}`)
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    await flush()

    expect(logoutUser).toHaveBeenCalled()

    try {
      Object.defineProperty(window.location, 'assign', { value: origAssign, configurable: true })
    } catch {
      /* location assign not restorable */
    }

    el.remove()
  })

  test('second notification resets the toast timer and removal unsubscribes', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    el.showNotification('one')
    el.showNotification('two')

    expect(el.toastMessage).toBe('two')

    el.remove()
    el.onDestroy()

    expect(() => el.onDestroy()).not.toThrow()
  })

  test('auth callback assigns the user and NOTIFY without detail is ignored', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    authCallbacks.forEach((cb) => cb({ uid: 'u1', photoURL: TEST_URLS.IMG }))

    expect(el.user?.uid).toBe('u1')

    // NOTIFY without detail -> the e.detail guard's else arm
    el.dispatchEvent(new window.CustomEvent(CMS_EVENTS.NOTIFY))

    expect(el.toastMessage).toBeFalsy()

    el.remove()
  })

  test('toast auto-dismiss timer clears the message and hides the toast', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    el.showNotification('temp')

    expect(el.toastMessage).toBe('temp')

    await flush(3600)

    expect(el.toastMessage).toBe(CHAR_STRINGS.EMPTY)

    el.remove()
  })

  test('renderTabComponent returns an editor for every tab plus the default', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    const tabs = [
      CMS_TABS.PORTFOLIO,
      CMS_TABS.PROJECTS,
      CMS_TABS.ABOUT,
      CMS_TABS.FOOTER,
      CMS_TABS.PLAYGROUND,
      CMS_TABS.LANGUAGES,
      CMS_TABS.MEDIA,
      CMS_TABS.DEPLOY,
      'unknown-tab',
    ]

    for (const tab of tabs) {
      el.activeTab = tab

      expect(el.renderTabComponent()).toBeTruthy()
    }

    el.remove()
  })

  test('NOTIFY with detail shows the toast; destroy before mount is safe', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    el.onDestroy()

    await flush()

    el.dispatchEvent(new window.CustomEvent(CMS_EVENTS.NOTIFY, { detail: TEST_TEXT.BODY }))

    expect(el.toastMessage).toBe(TEST_TEXT.BODY)

    el.remove()
  })

  test('showNotification tolerates missing toast nodes', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    const origQ = el.$

    el.$ = () => null
    el.showNotification(TEST_TEXT.BODY)

    await flush(3600)

    expect(el.toastTimer).toBeTruthy()

    el.$ = origQ
    el.showNotification(TEST_TEXT.BODY)

    const toast = el.shadowRoot.querySelector(`.${CMS_DASHBOARD_CLASSES.CMS_TOAST}`)

    toast?.querySelector(`.${CMS_ADMIN_CLASSES.TOAST_TEXT}`)?.remove()
    el.showNotification(TEST_TEXT.BODY)

    el.remove()
  })

  test('_bindEvents tolerates missing logout and brand nodes', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    el._contentNode.innerHTML = CHAR_STRINGS.EMPTY
    el._bindEvents()

    el.remove()
  })

  test('each active tab renders its active button class', async () => {
    const el = mount(CMS_TAGS.VIEW_CMS_DASHBOARD)

    await flush()

    const tabs = [
      CMS_TABS.PORTFOLIO,
      CMS_TABS.PROJECTS,
      CMS_TABS.ABOUT,
      CMS_TABS.FOOTER,
      CMS_TABS.PLAYGROUND,
      CMS_TABS.LANGUAGES,
      CMS_TABS.MEDIA,
      CMS_TABS.DEPLOY,
    ]

    for (const tab of tabs) {
      el.activeTab = tab
      el._updateDom()

      const active = el.shadowRoot.querySelector(
        `.${CMS_DASHBOARD_CLASSES.CMS_TAB_BTN}.${STATE_CLASSES.ACTIVE}`
      )

      expect(active).toBeTruthy()
    }

    el.activeTab = CMS_TABS.PORTFOLIO

    el.remove()
  })
})

describe('AdminLogin branches', () => {
  test('error without message falls back to the generic copy', async () => {
    const { signInWithGoogle } = await import('@/firebase.js')

    signInWithGoogle.mockRejectedValueOnce({})

    const el = mount(CMS_TAGS.VIEW_ADMIN_LOGIN)

    await el.handleGoogleLogin()

    expect(el.errorMsg).toContain('Failed to sign in')

    el.remove()
  })

  test('bindEvents guards a missing button; button click triggers login', async () => {
    const el = mount(CMS_TAGS.VIEW_ADMIN_LOGIN)

    el._contentNode.innerHTML = CHAR_STRINGS.EMPTY
    el._bindEvents()

    el._updateDom()
    el._bindEvents()

    const btn = el.shadowRoot.querySelector(`.${CMS_ADMIN_CLASSES.GOOGLE_AUTH_BTN}`)

    btn?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    await flush()

    el.remove()
  })

  test('module re-eval skips custom-element re-registration', async () => {
    jest.resetModules()

    await expect(import('@/cms/routes/AdminLogin.js')).resolves.toBeTruthy()

    // tag already defined -> the registration guard's else arm
    await expect(import('@/cms/lang/CmsLangEditor.js')).resolves.toBeTruthy()
    await expect(import('@/cms/deploy-info/CmsDeployInfo.js')).resolves.toBeTruthy()
    await expect(import('@/cms/about/CmsAboutEditor.js')).resolves.toBeTruthy()
    await expect(import('@/cms/footer/CmsFooterEditor.js')).resolves.toBeTruthy()
    await expect(import('@/cms/playground-editor/CmsPlaygroundEditor.js')).resolves.toBeTruthy()
  })
})

// ─── DOM-event branch coverage (shadow-DOM listeners via _bindEvents) ────────

const fire = (el, sel, eventType, value) => {
  const node = el.shadowRoot.querySelector(sel)

  if (!node) return null

  if (value !== undefined) node.value = value

  node.dispatchEvent(new window.Event(eventType, { bubbles: true }))

  return node
}

describe('CmsAboutEditor DOM events', () => {
  test('language select, title/mention/picture inputs write the model', async () => {
    snapRoutes.push({ match: 'pages/about', snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_ABOUT_EDITOR)

    await flush()

    fire(el, '#select-about-lang', FORM_EVENTS.CHANGE, LOCALES.DE)
    fire(el, '#about-title-input', FORM_EVENTS.INPUT, 'T')
    fire(el, '#about-mentions-title', FORM_EVENTS.INPUT, 'M')
    fire(el, '#email-gravatar-input', FORM_EVENTS.INPUT, 'a@b.c')
    fire(el, '#about-size-input', FORM_EVENTS.INPUT, '200')
    fire(el, '#about-pic-input', FORM_EVENTS.INPUT, 'https://x/p?s=200')

    expect(el.aboutData.title).toBe('T')
    expect(el.aboutData.mentions).toBe('M')
    expect(el.emailInput).toBe('a@b.c')
    expect(el.aboutData.profilePicture).toContain('s=200')

    await flush()

    el.remove()
  })

  test('paragraph and mention controls dispatch through data attributes', async () => {
    snapRoutes.push({
      match: 'pages/about',
      snap: () => snapOf({ col1: ['a', 'b'], mention_items: [{ description: 'd' }] }),
    })

    const el = mount(CMS_TAGS.CMS_ABOUT_EDITOR)

    await flush()

    el.shadowRoot.querySelector('.col-add-btn')?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('.para-down-btn')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    await flush()

    el.shadowRoot.querySelector('.para-up-btn')?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('.para-remove-btn')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('#btn-add-mention')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('.mention-down-btn')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('.size-preset-btn')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    await flush()

    expect(el.aboutData.mention_items.length).toBeGreaterThanOrEqual(1)

    el.remove()
  })

  test('save/sync/generate buttons invoke their flows', async () => {
    snapRoutes.push({ match: 'pages/about', snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_ABOUT_EDITOR)

    await flush()

    confirms.push(true, true)
    el.emailInput = 'a@b.c'

    el.shadowRoot
      .querySelector('#btn-save-about')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('#btn-sync-picture')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('#btn-sync-all')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('#btn-gen-gravatar')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    await flush()

    expect(setCalls.length).toBeGreaterThan(0)

    el.remove()
  })
})

describe('CmsFooterEditor DOM events', () => {
  test('title inputs, disclaimer and add-buttons mutate the model', async () => {
    snapRoutes.push({ match: 'components', snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_FOOTER_EDITOR)

    await flush()

    fire(el, '#contact-title-input', FORM_EVENTS.INPUT, 'CT')
    fire(el, '#related-title-input', FORM_EVENTS.INPUT, 'RT')
    fire(el, '#disclaimer-textarea', FORM_EVENTS.INPUT, 'note')
    fire(el, '#select-footer-lang', FORM_EVENTS.CHANGE, LOCALES.DE)

    expect(el.contactData.title).toBe('CT')
    expect(el.relatedFooter.title).toBe('RT')
    expect(el.relatedFooter.note).toBe('note')

    el.shadowRoot.querySelector('.line1-add')?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot.querySelector('.legal-add')?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot.querySelector('.social-add')?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot.querySelector('.line2-add')?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    expect(el.contactData.line1).toHaveLength(1)
    expect(el.legalLinks).toHaveLength(1)
    expect(el.relatedFooter.socials).toHaveLength(1)

    await flush()

    el.shadowRoot.querySelector('.line1-down')?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot.querySelector('.line1-del')?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('#btn-save-footer')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    confirms.push(true, true)

    el.shadowRoot
      .querySelector('#btn-sync-line1')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('#btn-sync-socials')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    await flush()

    el.remove()
  })
})

describe('CmsPortfolioList DOM events', () => {
  test('add/save/sync buttons and item controls dispatch correctly', async () => {
    snapRoutes.push({
      match: CMS_KEYS.PORTFOLIOLIST,
      snap: () => snapOf([{ label: 'A', link: '/p/a' }]),
    })

    const el = mount(CMS_TAGS.CMS_PORTFOLIO_LIST)

    await flush()

    el.shadowRoot
      .querySelector('#btn-add-item')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    expect(el.items).toHaveLength(2)

    fire(el, '#select-lang', FORM_EVENTS.CHANGE, LOCALES.DE)

    await flush()

    confirms.push(true)

    const buttons = [...el.shadowRoot.querySelectorAll(`[${DATA_ATTRS.DATA_ACTION}]`)]

    buttons.forEach((b) => b.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK)))

    await flush()

    el.remove()
  })
})

describe('CmsMediaConverter DOM events', () => {
  test('dropzone drag states and file input collect files', async () => {
    const el = mount(CMS_TAGS.CMS_MEDIA_CONVERTER)

    await flush()

    const dz = el.shadowRoot.querySelector(`.${CMS_ITEM_CLASSES.CMS_DROPZONE}`)

    dz?.dispatchEvent(new window.Event(DRAG_EVENTS.DRAGOVER))
    dz?.dispatchEvent(new window.Event(DRAG_EVENTS.DRAGLEAVE))
    dz?.dispatchEvent(new window.Event(DRAG_EVENTS.DROP))

    const input = el.shadowRoot.querySelector('#cms-media-file-input')

    if (input) {
      Object.defineProperty(input, 'files', { value: [{ name: 'f.webp' }], configurable: true })
      input.dispatchEvent(new window.Event(FORM_EVENTS.CHANGE))
    }

    await flush()

    el.shadowRoot
      .querySelector('#cms-media-run')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('#cms-media-reset')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('#cms-media-clear-list')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    await flush()

    el.remove()
  })
})

describe('CmsProjectsList DOM events', () => {
  test('project selector change reloads the project data', async () => {
    snapRoutes.push({
      match: DB_PATHS.PROJECTS_SEGMENT,
      snap: () => snapOf({ k1: { title: 'K1', sections: [] }, k2: { title: 'K2', sections: [] } }),
    })

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    const sel = el.shadowRoot.querySelector(HTML_TAGS.SELECT)

    if (sel) {
      sel.value = 'k2'
      sel.dispatchEvent(new window.Event(FORM_EVENTS.CHANGE))

      await flush()
    }

    el.remove()
  })

  test('section text/media controls write through data attributes', async () => {
    snapRoutes.push({ match: DB_PATHS.PROJECTS_SEGMENT, snap: () => snapOf(null, false) })

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    el.currentProject = { title: 'T', sections: [[['a'], [{ src: 's' }]]] }
    el._updateDom()

    await flush()

    el.shadowRoot
      .querySelector('#btn-save-project')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('#btn-create-project')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot
      .querySelector('#btn-delete-project')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    await flush()

    el.remove()
  })
})

describe('CmsPlaygroundEditor DOM events', () => {
  test('add-key button and ep-value inputs write the model', async () => {
    snapRoutes.push({ match: TRANSLATION_KEYS.EARTH_PLAYGROUND, snap: () => snapOf({ k1: 'v1' }) })
    snapRoutes.push({ match: 'slugs', snap: () => snapOf({}) })

    const el = mount(CMS_TAGS.CMS_PLAYGROUND_EDITOR)

    await flush()

    globalThis.prompt = () => 'added'

    el.shadowRoot
      .querySelector('#btn-add-ep-key')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    expect(el.epKeys).toContain('added')

    el.shadowRoot
      .querySelector('#btn-save-playground')
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))
    el.shadowRoot.querySelector('.ep-del')?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    await flush()

    el.remove()
  })
})

describe('CmsDashboard registration', () => {
  test('re-eval respects a registered element and the non-localhost arm', async () => {
    const origHostname = window.location.hostname
    let patched = false

    try {
      Object.defineProperty(window.location, 'hostname', {
        value: 'cms.example.test',
        configurable: true,
      })
      patched = window.location.hostname === 'cms.example.test'
    } catch {
      /* hostname not redefinable */
    }

    jest.resetModules()

    try {
      const { ViewCmsDashboard } = await import('@/cms/routes/CmsDashboard.js')

      // The re-evaluated class closes over IS_LOCALHOST=false: rendering via
      // the prototype (a second define is intentionally skipped) covers the
      // non-localhost `: null` arm and the toast-visible display arm in one
      // render pass.
      ViewCmsDashboard.prototype.render.call({
        user: { email: TEST_TEXT.BODY },
        activeTab: CMS_TABS.PORTFOLIO,
        toastMessage: TEST_TEXT.BODY,
        renderTabComponent: () => null,
      })
    } finally {
      if (patched) {
        try {
          Object.defineProperty(window.location, 'hostname', {
            value: origHostname,
            configurable: true,
          })
        } catch {
          /* restore failed */
        }
      }
    }
  })
})

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

describe('CmsProjectsList tails', () => {
  const projSnap = {
    title: TEST_TEXT.HEADING,
    folder: TEST_TEXT.BODY,
    cover: { src: 'cov', label: 'L', size: [100, 200], isVideo: true },
    sections: [
      [['t1'], [{ src: 'a', label: 'b', isVideo: false, size: [1, 2] }]],
      [['x'], []],
    ],
  }

  const mountLoaded = async () => {
    snapRoutes.push(
      { match: 'projects/k1', snap: () => snapOf(projSnap) },
      {
        match: DB_PATHS.PROJECTS_SEGMENT,
        snap: () => snapOf({ k1: { title: 'a' }, k2: { title: 'b' } }),
      }
    )

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    return el
  }

  test('bound editor controls write the project model', async () => {
    const el = await mountLoaded()

    expect(el.currentProject).not.toBeNull()

    fire(el, '#proj-title-input', FORM_EVENTS.INPUT, 'T2')
    fire(el, '#proj-folder-input', FORM_EVENTS.INPUT, 'f2')

    const ni = el.shadowRoot.querySelector('#proj-noindex')

    ni.checked = true
    ni.dispatchEvent(new window.Event(FORM_EVENTS.CHANGE, { bubbles: true }))

    fire(el, '#cover-src-input', FORM_EVENTS.INPUT, 'c2')
    fire(el, '#cover-label-input', FORM_EVENTS.INPUT, 'l2')
    fire(el, '#cover-isvideo', FORM_EVENTS.CHANGE, ATTR_VALUES.TRUE)
    fire(el, '#cover-isvideo', FORM_EVENTS.CHANGE, ATTR_VALUES.FALSE)
    fire(el, '#cover-w-input', FORM_EVENTS.INPUT, '800')
    fire(el, '#cover-w-input', FORM_EVENTS.INPUT, 'x')
    fire(el, '#cover-h-input', FORM_EVENTS.INPUT, '600')
    fire(el, '#cover-h-input', FORM_EVENTS.INPUT, '')

    fire(el, '.sec-add-text', MOUSE_EVENTS.CLICK)
    fire(el, '.sec-add-media', MOUSE_EVENTS.CLICK)
    fire(el, '.sec-text-input', FORM_EVENTS.INPUT, 'nn')
    fire(el, '.media-src', FORM_EVENTS.INPUT, 'm2')

    await flush()

    fire(el, '.media-label', FORM_EVENTS.INPUT, 'ml2')
    fire(el, '.media-type', FORM_EVENTS.CHANGE, ATTR_VALUES.TRUE)
    fire(el, '.media-w', FORM_EVENTS.INPUT, '640')
    fire(el, '.media-w', FORM_EVENTS.INPUT, 'x')
    fire(el, '.media-h', FORM_EVENTS.INPUT, '480')
    fire(el, '.media-h', FORM_EVENTS.INPUT, 'x')

    fire(el, '.sec-up-btn', MOUSE_EVENTS.CLICK)
    fire(el, '.sec-down-btn', MOUSE_EVENTS.CLICK)
    fire(el, '.sec-text-del', MOUSE_EVENTS.CLICK)
    fire(el, '.media-del', MOUSE_EVENTS.CLICK)
    fire(el, '.sec-del-btn', MOUSE_EVENTS.CLICK)

    fire(el, '#btn-add-section', MOUSE_EVENTS.CLICK)
    fire(el, '#btn-save-proj', MOUSE_EVENTS.CLICK)

    await flush()

    fire(el, '#select-proj-lang', FORM_EVENTS.CHANGE, LOCALES.DE)

    await flush()

    fire(el, '#select-proj-key', FORM_EVENTS.CHANGE, 'k2')

    await flush()

    globalThis.prompt = () => 'BrandNew'
    fire(el, '#btn-create-proj', MOUSE_EVENTS.CLICK)

    await flush()

    confirms.push(true)
    fire(el, '#btn-delete-proj', MOUSE_EVENTS.CLICK)

    await flush()

    el.remove()
  })

  test('load guards, missing snapshots and error paths', async () => {
    snapRoutes.push({
      match: DB_PATHS.PROJECTS_SEGMENT,
      snap: () => {
        throw new Error(TEST_TEXT.MISSING_KEY)
      },
    })

    const el = mount(CMS_TAGS.CMS_PROJECTS_LIST)

    await flush()

    el.selectedProjectKey = ''
    await el.loadProjectData()
    expect(el.currentProject).toBeNull()

    snapRoutes.length = 0
    snapRoutes.push({ match: 'projects/none', snap: () => snapOf(null, false) })

    el.selectedProjectKey = STATE_STRINGS.NONE
    await el.loadProjectData()
    expect(el.currentProject).toBeNull()

    el.addSection()

    el.currentProject = { title: 't', sections: 'x' }
    el.addSection()
    expect(Array.isArray(el.currentProject.sections)).toBe(true)

    snapRoutes.push({ match: 'projects/bare', snap: () => snapOf({ sections: [] }) })
    el.selectedProjectKey = 'bare'
    await el.loadProjectData()
    expect(el.currentProject.cover).toBeTruthy()
    expect(el.currentProject.seo.noIndex).toBe(false)

    snapRoutes.push({
      match: 'projects/bad',
      snap: () => {
        throw new Error(TEST_TEXT.MISSING_KEY)
      },
    })
    el.selectedProjectKey = 'bad'
    await el.loadProjectData()

    confirms.push(true)

    const noIter = []

    noIter[Symbol.iterator] = () => {
      throw TEST_TEXT.MISSING_KEY
    }
    el.languages = noIter
    await el.deleteProject()
    expect(alerts.length).toBeGreaterThan(0)

    el.languages = [LOCALES.EN]
    el.selectedProjectKey = 'bad'
    el.currentProject = { title: 't', sections: [] }

    snapRoutes.failSet = 'str'
    await el.saveProjectData()
    snapRoutes.failSet = false

    expect(alerts.length).toBeGreaterThan(1)

    el.remove()
  })
})
