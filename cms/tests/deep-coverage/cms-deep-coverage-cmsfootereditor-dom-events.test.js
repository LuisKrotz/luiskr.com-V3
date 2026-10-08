/**
 * @file cms-deep-coverage-cmsfootereditor-dom-events.test.js
 * @description Split from cms-deep-coverage.test.js — covers the "CmsFooterEditor DOM events" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { LOCALES } from '@core/constants.js'
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

const fire = (el, sel, eventType, value) => {
  const node = el.shadowRoot.querySelector(sel)

  if (!node) return null

  if (value !== undefined) node.value = value

  node.dispatchEvent(new window.Event(eventType, { bubbles: true }))

  return node
}

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
