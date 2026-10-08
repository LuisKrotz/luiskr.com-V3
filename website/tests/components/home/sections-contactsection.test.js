/**
 * @file sections-contactsection.test.js
 * @description Split from sections.test.js — covers the "ContactSection" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { ContactSection } from '@website/components/home/ContactSection.js'
import { SCSS, mount } from '@tests/fixtures/test-constants.js'
import store from '@core/store.js'
import { COOKIE_CLASSES } from '@core/tokens/classes/cookies.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { AWC_CLASSES } from '@core/tokens/classes/awards-carousel.js'
import { SKELETON_CLASSES } from '@core/tokens/classes/skeleton.js'
import { NAV_TEXT } from '@core/tokens/strings/text.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { CONTACT_CLASSES } from '@core/tokens/classes/contact.js'
import { LINK_ATTRS } from '@core/tokens/attrs/link.js'
import { DOM_STRINGS } from '@core/tokens/strings/dom.js'

// ─── Local selector helpers (derived from CLASSES) ────────────────────────────
const _S = {
  COOKIES: `aside.${COOKIE_CLASSES.COOKIES}`,
  COOKIES_INFO: `.${COOKIE_CLASSES.COOKIES_INFO}`,
  COOKIES_ACCEPT: `.${COOKIE_CLASSES.COOKIES_BUTTONS_ACCEPT}`,
  COOKIES_REFUSE: `.${COOKIE_CLASSES.COOKIES_BUTTONS_REFUSE}`,
  AWC_AWARDS: `${COMPONENT_TAGS.AWARDS_CAROUSEL}.${AWC_CLASSES.AWC_AWARDS}`,
  AWARDS_CAROUSEL: COMPONENT_TAGS.AWARDS_CAROUSEL,
}

// ─────────────────────────────────────────────────────────────────────────────
// ContactSection
// ─────────────────────────────────────────────────────────────────────────────
describe('ContactSection', () => {
  let contactEl
  let cleanup

  beforeEach(() => {
    contactEl = new ContactSection()
    cleanup = mount(contactEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(contactEl.shadowRoot).not.toBeNull()
  })

  test('renders skeleton state when store has no contact translations', () => {
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {})
    contactEl._updateDom()
    const skelTitle = contactEl.shadowRoot.querySelector(`.${SKELETON_CLASSES.SKELETON_TITLE_SM}`)
    expect(skelTitle).not.toBeNull()
    const skelLinks = contactEl.shadowRoot.querySelectorAll(
      `.${SKELETON_CLASSES.SKELETON_FOOTER_LINK}`
    )
    expect(skelLinks.length).toBe(4)
  })

  test('renders title and social links when translations are populated', () => {
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {
      contact: {
        title: NAV_TEXT.GET_IN_TOUCH,
        line1: [
          { description: 'Email', link: 'mailto:test@example.com' },
          { description: 'GitHub', link: 'https://github.com/luiskr' },
          { description: 'LinkedIn', link: 'https://linkedin.com/in/luiskr' },
        ],
      },
    })
    contactEl._updateDom()

    const titleEl = contactEl.shadowRoot.querySelector(`.${CONTACT_CLASSES.CONTACT_TITLE}`)
    expect(titleEl.textContent).toContain(NAV_TEXT.GET_IN_TOUCH)

    const links = contactEl.shadowRoot.querySelectorAll(`a.${CONTACT_CLASSES.CONTACT_SOCIAL_LINK}`)
    expect(links.length).toBe(3)
    expect(links[0].getAttribute(LINK_ATTRS.HREF)).toBe('mailto:test@example.com')
    expect(links[0].getAttribute(LINK_ATTRS.TARGET)).toBe(DOM_STRINGS.BLANK)
    expect(links[0].getAttribute(LINK_ATTRS.REL)).toBe(DOM_STRINGS.NOOPENER)
    expect(links[0].textContent.trim()).toBe('Email')
  })

  test('renders dot separators between social links', () => {
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {
      contact: {
        title: NAV_TEXT.CONTACT,
        line1: [
          { description: 'Link1', link: 'https://link1.com' },
          { description: 'Link2', link: 'https://link2.com' },
          { description: 'Link3', link: 'https://link3.com' },
        ],
      },
    })
    contactEl._updateDom()
    const seps = contactEl.shadowRoot.querySelectorAll(`.${CONTACT_CLASSES.CONTACT_SEPARATOR}`)
    expect(seps.length).toBe(2)
  })

  test('updates DOM reactively on store mutations', () => {
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {
      contact: { title: 'Initial Contact', line1: [] },
    })
    contactEl._updateDom()
    expect(contactEl.shadowRoot.textContent).toContain('Initial Contact')

    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {
      contact: { title: 'Updated Contact', line1: [] },
    })
    contactEl.onStoreUpdate()
    expect(contactEl.shadowRoot.textContent).toContain('Updated Contact')
  })

  test('contact.scss defines .contact, .contact-title, .contact-social, .contact-separator', () => {
    expect(SCSS.contact).toMatch(/\.contact\s*\{/)
    expect(SCSS.contact).toMatch(/&-title\s*\{/)
    expect(SCSS.contact).toMatch(/&-social\s*\{/)
    expect(SCSS.contact).toMatch(/&-separator\s*\{/)
  })
})
