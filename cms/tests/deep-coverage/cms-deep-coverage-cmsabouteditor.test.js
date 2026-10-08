/**
 * @file cms-deep-coverage-cmsabouteditor.test.js
 * @description Split from cms-deep-coverage.test.js — covers the "CmsAboutEditor" describe.
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

    clearDevLog()

    await el.loadAboutData()

    expect(getDevLog().filter((e) => e.level === LOG_LEVELS.ERROR).length).toBeGreaterThan(0)
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
