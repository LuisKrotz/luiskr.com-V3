import { FALLBACK_PAGES } from '@/core/locale/fallback.js'
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { AboutSection } from '@/components/home/AboutSection.js'
import { ContactSection } from '@/components/home/ContactSection.js'
import { AwardsMentions } from '@/components/home/AwardsMentions.js'
import { CookieBanner } from '@/components/feedback/CookieBanner.js'
import { CMS_KEYS, LOCALES, ROUTE_NAMES, ROUTE_PREFIXES } from '@/core/constants.js'
import { SCSS, TEST_AWARDS, TEST_TEXT, mount } from '../../fixtures/test-constants.js'
import store from '@/core/store.js'
import router from '@/routes/router.js'
import { COOKIE_CLASSES } from '@/core/tokens/classes/cookies.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import { HC_CLASSES } from '@/core/tokens/classes/home-carousel.js'
import { SKELETON_CLASSES } from '@/core/tokens/classes/skeleton.js'
import { NAV_TEXT } from '@/core/tokens/strings/text.js'
import { ABOUT_CLASSES } from '@/core/tokens/classes/about.js'
import { COMMON_SELECTORS } from '@/core/tokens/selectors/common.js'
import { FORM_ATTRS } from '@/core/tokens/attrs/form.js'
import { MEDIA_ATTRS } from '@/core/tokens/attrs/media.js'
import { GENERIC_DIMENSIONS } from '@/core/tokens/media/dimensions.js'
import { SECTION_UI_KEYS } from '@/core/tokens/data/ui-keys.js'
import { LANG_MUTATIONS, UI_MUTATIONS } from '@/core/tokens/events/mutations.js'
import { CONTACT_CLASSES } from '@/core/tokens/classes/contact.js'
import { LINK_ATTRS } from '@/core/tokens/attrs/link.js'
import { DOM_STRINGS } from '@/core/tokens/strings/dom.js'
import { AWARDS_CLASSES } from '@/core/tokens/classes/awards.js'
import { ROUTE_PATHS } from '@/core/tokens/routes/paths.js'
import { ARIA_ATTRS } from '@/core/tokens/attrs/aria.js'
import { MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import { INPUT_STRINGS } from '@/core/tokens/strings/input.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { APP_EVENTS } from '@/core/tokens/events/app.js'
import { PREF_STORAGE_KEYS } from '@/core/tokens/data/storage.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'

// ─── Local selector helpers (derived from CLASSES) ────────────────────────────
const S = {
  COOKIES: `aside.${COOKIE_CLASSES.COOKIES}`,
  COOKIES_INFO: `.${COOKIE_CLASSES.COOKIES_INFO}`,
  COOKIES_ACCEPT: `.${COOKIE_CLASSES.COOKIES_BUTTONS_ACCEPT}`,
  COOKIES_REFUSE: `.${COOKIE_CLASSES.COOKIES_BUTTONS_REFUSE}`,
  HC_AWARDS: `${COMPONENT_TAGS.HOME_CAROUSEL}.${HC_CLASSES.HC_AWARDS}`,
  HOME_CAROUSEL: COMPONENT_TAGS.HOME_CAROUSEL,
}

// ─────────────────────────────────────────────────────────────────────────────
// AboutSection
// ─────────────────────────────────────────────────────────────────────────────
describe('AboutSection', () => {
  let aboutEl
  let cleanup

  beforeEach(() => {
    aboutEl = new AboutSection()
    cleanup = mount(aboutEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(aboutEl.shadowRoot).not.toBeNull()
  })

  test('renders skeleton placeholders when aboutTranslations is null', () => {
    aboutEl.aboutTranslations = null
    const root = aboutEl.shadowRoot
    expect(root.querySelector(`.${SKELETON_CLASSES.SKELETON_ABOUT_TITLE}`)).not.toBeNull()
    expect(root.querySelector(`.${SKELETON_CLASSES.SKELETON_ABOUT_P1}`)).not.toBeNull()
    expect(root.querySelector(`.${SKELETON_CLASSES.SKELETON_ABOUT_P2}`)).not.toBeNull()
    expect(root.querySelector(`.${SKELETON_CLASSES.SKELETON_ABOUT_P3}`)).not.toBeNull()
    expect(root.querySelector(`.${SKELETON_CLASSES.SKELETON_ABOUT_P4}`)).not.toBeNull()
    expect(root.querySelector(`.${SKELETON_CLASSES.SKELETON_ABOUT_P5}`)).not.toBeNull()
  })

  test('renders profile picture placeholder when profilePicture is null', () => {
    aboutEl.aboutTranslations = { title: NAV_TEXT.ABOUT_ME, col1: ['P1'], col2: ['P2'] }
    aboutEl.profilePicture = null
    const placeholder = aboutEl.shadowRoot.querySelector(
      `.${ABOUT_CLASSES.ABOUT_PROFILE_PICTURE_PLACEHOLDER}`
    )
    expect(placeholder).not.toBeNull()
  })

  test('renders the #about section with the about class', () => {
    const section = aboutEl.shadowRoot.querySelector(`section${COMMON_SELECTORS.ID_ABOUT}`)
    expect(section).not.toBeNull()
    expect(section.classList.contains(ABOUT_CLASSES.ABOUT)).toBe(true)
  })

  test('calculates aboutDrawData charDelay and offsets correctly', () => {
    aboutEl.aboutTranslations = {
      title: NAV_TEXT.ABOUT_ME,
      col1: [TEST_TEXT.HELLO_WORLD, 'Second line'],
      col2: ['Third line in col2'],
    }
    const data = aboutEl.aboutDrawData
    expect(data.charDelay).toBeGreaterThan(0)
    expect(data.col1.length).toBe(2)
    expect(data.col2.length).toBe(1)
    expect(data.col1[0].text).toBe(TEST_TEXT.HELLO_WORLD)
    expect(data.col1[0].offset).toBe(0)
    expect(data.col1[1].offset).toBeGreaterThan(0)
  })

  test('strips HTML when calculating offsets in aboutDrawData', () => {
    aboutEl.aboutTranslations = {
      title: NAV_TEXT.ABOUT_ME,
      col1: ['<b>Bold</b> text', 'Plain text'],
      col2: [],
    }
    const data = aboutEl.aboutDrawData
    expect(data.col1.length).toBe(2)
    expect(data.col1[1].offset).toBeGreaterThan(0)
  })

  test('renders draw-text elements for title and paragraphs when data is present', () => {
    aboutEl.aboutTranslations = { title: 'Biography', col1: ['Bio line 1'], col2: ['Bio line 2'] }
    const drawTexts = aboutEl.shadowRoot.querySelectorAll(COMPONENT_TAGS.DRAW_TEXT)
    expect(drawTexts.length).toBe(3)
    expect(drawTexts[0].getAttribute(FORM_ATTRS.TEXT)).toBe('Biography')
    expect(drawTexts[1].getAttribute(FORM_ATTRS.TEXT)).toBe('Bio line 1')
    expect(drawTexts[2].getAttribute(FORM_ATTRS.TEXT)).toBe('Bio line 2')
  })

  test('renders optimized profile picture with dimensions and accessibility attrs', () => {
    aboutEl.aboutTranslations = { title: 'Biography', col1: ['Bio'], col2: [] }
    aboutEl.profilePicture = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp'
    const img = aboutEl.shadowRoot.querySelector(`img.${ABOUT_CLASSES.ABOUT_PROFILE_PICTURE_IMG}`)
    expect(img).not.toBeNull()
    expect(img.getAttribute(MEDIA_ATTRS.WIDTH)).toBe(String(GENERIC_DIMENSIONS.PROFILE_SIZE))
    expect(img.getAttribute(MEDIA_ATTRS.HEIGHT)).toBe(String(GENERIC_DIMENSIONS.PROFILE_SIZE))
    expect(img.getAttribute(SECTION_UI_KEYS.LOADING)).toBe(MEDIA_ATTRS.LOADING_LAZY)
    expect(img.getAttribute(MEDIA_ATTRS.DECODING)).toBe(MEDIA_ATTRS.DECODING_ASYNC)
    expect(img.getAttribute(MEDIA_ATTRS.ALT)).toBe('Biography')
  })

  test('updates DOM reactively when profilePicture changes', () => {
    aboutEl.aboutTranslations = { title: 'Bio', col1: [], col2: [] }
    expect(
      aboutEl.shadowRoot.querySelector(`img.${ABOUT_CLASSES.ABOUT_PROFILE_PICTURE_IMG}`)
    ).toBeNull()
    aboutEl.profilePicture = 'https://www.gravatar.com/avatar/test?d=mp'
    expect(
      aboutEl.shadowRoot.querySelector(`img.${ABOUT_CLASSES.ABOUT_PROFILE_PICTURE_IMG}`)
    ).not.toBeNull()
  })

  test('about.scss defines layout and typography structures', () => {
    expect(SCSS.about).toMatch(/\.about\s*\{/)
    expect(SCSS.about).toMatch(/&-title\s*\{/)
    expect(SCSS.about).toMatch(/&-profile-section\s*\{/)
  })

  test('about.scss defines circular profile picture border-radius', () => {
    expect(SCSS.about).toMatch(/&-profile-picture[\s\S]*?border-radius:\s*var\(--radius-full\)/)
  })
})

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

// ─────────────────────────────────────────────────────────────────────────────
// AwardsMentions
// ─────────────────────────────────────────────────────────────────────────────
describe('AwardsMentions', () => {
  let awardsEl
  let cleanup

  beforeEach(() => {
    awardsEl = new AwardsMentions()
    cleanup = mount(awardsEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(awardsEl.shadowRoot).not.toBeNull()
  })

  test('defaults title to the EN about.mentions copy from the translations database', () => {
    const expected = FALLBACK_PAGES.about.mentions
    expect(awardsEl.title).toBe(expected)
    const titleEl = awardsEl.shadowRoot.querySelector(`.${AWARDS_CLASSES.AWARDS_FOOTER_TITLE}`)
    expect(titleEl.textContent).toBe(expected)
  })

  test('updates title reactively when title property is set', () => {
    awardsEl.title = 'Awards & Jury Work'
    expect(awardsEl.title).toBe('Awards & Jury Work')
    const titleEl = awardsEl.shadowRoot.querySelector(`.${AWARDS_CLASSES.AWARDS_FOOTER_TITLE}`)
    expect(titleEl.textContent).toBe('Awards & Jury Work')
  })

  test('renders skeleton badges when items is null or empty', () => {
    awardsEl.items = null
    const skels = awardsEl.shadowRoot.querySelectorAll(`.${SKELETON_CLASSES.SKELETON_BADGE}`)
    expect(skels.length).toBe(3)
  })

  test('renders home-carousel with hc--awards class when items has data', () => {
    awardsEl.items = [
      { text: TEST_AWARDS.AWWARDS_SOTD, sub: '2024' },
      { text: TEST_AWARDS.FWA_OF_THE_DAY, sub: '2023' },
    ]
    const carousel = awardsEl.shadowRoot.querySelector(S.HC_AWARDS)
    expect(carousel).not.toBeNull()
  })

  test('filters out single root language slugs from legal links', () => {
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {
      [CMS_KEYS.LEGAL_FOOTER]: {
        links: [
          { page: ROUTE_NAMES.HOME, link: `/${LOCALES.EN}` },
          { page: ROUTE_PREFIXES.PRIVACY, link: ROUTE_PATHS.PRIVACY_POLICY },
          { page: ROUTE_PREFIXES.TERMS, link: ROUTE_PATHS.TERMS_OF_USE },
        ],
      },
    })
    const links = awardsEl.legalLinks
    expect(links.find((l) => l.link === `/${LOCALES.EN}`)).toBeUndefined()
    expect(links.find((l) => l.link === ROUTE_PATHS.PRIVACY_POLICY)).toBeDefined()
  })

  test('renders legal navigation links with aria-label="Legal"', () => {
    const nav = awardsEl.shadowRoot.querySelector(`nav.${AWARDS_CLASSES.AWARDS_FOOTER_LINKS}`)
    expect(nav).not.toBeNull()
    expect(nav.getAttribute(ARIA_ATTRS.ARIA_LABEL)).toBe('Legal')
  })

  test('renders dot separators between legal links equal to links.length - 1', () => {
    const links = awardsEl.shadowRoot.querySelectorAll(`.${AWARDS_CLASSES.AWARDS_FOOTER_ITEM}`)
    const seps = awardsEl.shadowRoot.querySelectorAll(`.${AWARDS_CLASSES.AWARDS_FOOTER_SEP}`)
    expect(seps.length).toBe(Math.max(0, links.length - 1))
  })

  test('clicking legal link calls router.push', () => {
    let pushedRoute = null
    const originalPush = router.push
    router.push = (route) => {
      pushedRoute = route
    }

    const firstLink = awardsEl.shadowRoot.querySelector(`.${AWARDS_CLASSES.AWARDS_FOOTER_ITEM}`)
    expect(firstLink).not.toBeNull()
    firstLink.click()
    expect(pushedRoute).toBe(firstLink.getAttribute(LINK_ATTRS.HREF))
    router.push = originalPush
  })

  test('delegated footer-link handler tolerates events without composedPath', () => {
    const el = new AwardsMentions()
    const handlers = []
    const orig = el.addScopedListener.bind(el)

    // happy-dom calls composedPath() itself during dispatch, so the fallback
    // arm can only be reached by invoking the delegated handler directly.
    el.addScopedListener = (target, evt, fn, ...rest) => {
      if (target === el.shadowRoot && evt === MOUSE_EVENTS.CLICK) handlers.push(fn)
      return orig(target, evt, fn, ...rest)
    }

    const cleanup = mount(el)
    let pushedRoute = null
    const originalPush = router.push

    router.push = (route) => {
      pushedRoute = route
    }

    handlers.forEach((fn) => fn({ target: null, preventDefault: () => {} }))

    expect(handlers.length).toBeGreaterThan(0)
    expect(pushedRoute).toBeNull()

    router.push = originalPush
    cleanup()
  })

  test('awards-footer.scss defines layout and typography', () => {
    expect(SCSS.awardsFooter).toMatch(/\.awards-footer\s*\{/)
    expect(SCSS.awardsFooter).toMatch(/&-title\s*\{/)
    expect(SCSS.awardsFooter).toMatch(/&-links\s*\{/)
    expect(SCSS.awardsFooter).toMatch(/&-item\s*\{/)
    expect(SCSS.awardsFooter).toMatch(/&-sep\s*\{/)
  })

  test('does not re-render home-carousel when unrelated store mutation occurs', () => {
    awardsEl.items = [
      { text: TEST_AWARDS.AWWARDS_SOTD, sub: '2024' },
      { text: TEST_AWARDS.FWA_OF_THE_DAY, sub: '2023' },
    ]
    const initialCarousel = awardsEl.shadowRoot.querySelector(S.HOME_CAROUSEL)
    expect(initialCarousel).not.toBeNull()

    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.POINTER)
    awardsEl.onStoreUpdate()

    const currentCarousel = awardsEl.shadowRoot.querySelector(S.HOME_CAROUSEL)
    expect(currentCarousel).toBe(initialCarousel)
  })

  test('items setter updates home-carousel items without replacing the DOM node', () => {
    awardsEl.items = [
      { text: TEST_AWARDS.AWWARDS_SOTD, sub: '2024' },
      { text: TEST_AWARDS.FWA_OF_THE_DAY, sub: '2023' },
    ]
    const initialCarousel = awardsEl.shadowRoot.querySelector(S.HOME_CAROUSEL)
    awardsEl.items = [
      { text: TEST_AWARDS.AWWARDS_SOTD, sub: '2024' },
      { text: TEST_AWARDS.FWA_OF_THE_DAY, sub: '2023' },
      { text: 'CSS Design Awards', sub: '2022' },
    ]
    const updatedCarousel = awardsEl.shadowRoot.querySelector(COMPONENT_TAGS.HOME_CAROUSEL)
    expect(updatedCarousel).toBe(initialCarousel)
    expect(updatedCarousel.items.length).toBe(3)
  })

  test('HomeCarousel dot click navigates to target slide and stops autoplay', () => {
    awardsEl.items = [
      { text: 'Award 1', sub: '2024' },
      { text: 'Award 2', sub: '2023' },
      { text: 'Award 3', sub: '2022' },
    ]
    const hc = awardsEl.shadowRoot.querySelector(S.HOME_CAROUSEL)
    expect(hc).not.toBeNull()
    hc.autoplayRunning = true
    const dots = hc.shadowRoot.querySelectorAll(`.${HC_CLASSES.HC_DOT}`)
    expect(dots.length).toBe(3)
    dots[1].click()
    expect(hc.currentIndex).toBe(1)
    expect(hc.autoplayRunning).toBe(false)
  })

  test('HomeCarousel dot buttons have type="button" and aria-label', () => {
    awardsEl.items = [
      { text: 'Award 1', sub: '2024' },
      { text: 'Award 2', sub: '2023' },
    ]
    const hc = awardsEl.shadowRoot.querySelector(S.HOME_CAROUSEL)
    expect(hc).not.toBeNull()
    const dotBtn = hc.shadowRoot.querySelector(`button.${HC_CLASSES.HC_DOT}`)
    expect(dotBtn).not.toBeNull()
    expect(dotBtn.getAttribute(FORM_ATTRS.TYPE)).toBe(HTML_TAGS.BUTTON)
    expect(dotBtn.getAttribute(ARIA_ATTRS.ARIA_LABEL)).toContain('1')
  })

  test('awards item description renders as HTML markup', () => {
    awardsEl.items = [
      {
        description: 'Winner of <strong>Site of the Day</strong>',
        link: 'https://awwwards.com',
        icon: '⭐',
      },
    ]
    const hc = awardsEl.shadowRoot.querySelector(S.HOME_CAROUSEL)
    expect(hc).not.toBeNull()
    const awardText = hc.shadowRoot.querySelector(`.${HC_CLASSES.HC_AWARD_TEXT}`)
    expect(awardText).not.toBeNull()
    expect(awardText.innerHTML).toContain('<strong>Site of the Day</strong>')
  })

  test('awards item description parses nested HTML tags into DOM child elements', () => {
    awardsEl.items = [
      {
        description: 'Featured on <em>Awwwards</em> & <a href="https://fwa.com">FWA</a>',
        link: 'https://fwa.com',
        icon: '🏆',
      },
    ]
    const hc = awardsEl.shadowRoot.querySelector(S.HOME_CAROUSEL)
    const awardText = hc.shadowRoot.querySelector(`.${HC_CLASSES.HC_AWARD_TEXT}`)
    const emEl = awardText.querySelector('em')
    const linkEl = awardText.querySelector('a')
    expect(emEl).not.toBeNull()
    expect(emEl.textContent).toBe('Awwwards')
    expect(linkEl).not.toBeNull()
    expect(linkEl.getAttribute(LINK_ATTRS.HREF)).toBe('https://fwa.com')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// CookieBanner
// ─────────────────────────────────────────────────────────────────────────────
describe('CookieBanner', () => {
  let cookieEl
  let cleanup

  beforeEach(() => {
    localStorage.clear()
    cookieEl = new CookieBanner()
    cleanup = mount(cookieEl)
  })

  afterEach(() => {
    cleanup()
    localStorage.clear()
  })

  test('creates shadow root on construction', () => {
    expect(cookieEl.shadowRoot).not.toBeNull()
  })

  test('renders null when translations is null', () => {
    cookieEl.translations = null
    const aside = cookieEl.shadowRoot.querySelector(S.COOKIES)
    expect(aside).toBeNull()
  })

  test('renders aside.cookies when translations provided and no prior consent', () => {
    cookieEl.translations = {
      cookies: { message: 'This site uses cookies.', accept: 'Accept', refuse: 'Refuse' },
    }
    const aside = cookieEl.shadowRoot.querySelector(S.COOKIES)
    expect(aside).not.toBeNull()
    const info = cookieEl.shadowRoot.querySelector(S.COOKIES_INFO)
    expect(info.textContent).toContain('This site uses cookies.')
  })

  test('accept button renders custom translated text', () => {
    cookieEl.translations = { cookies: { message: 'Info', accept: 'Concordo', refuse: 'Recusar' } }
    const acceptBtn = cookieEl.shadowRoot.querySelector(S.COOKIES_ACCEPT)
    expect(acceptBtn.textContent).toBe('Concordo')
  })

  test('clicking accept sets localStorage "cookie" to true and hides banner', () => {
    cookieEl.translations = { cookies: { message: 'Info', accept: 'Accept', refuse: 'Refuse' } }
    let eventFired = false
    const listener = () => {
      eventFired = true
    }
    document.addEventListener(APP_EVENTS.COOKIE_ACTION, listener)

    const acceptBtn = cookieEl.shadowRoot.querySelector(S.COOKIES_ACCEPT)
    acceptBtn.click()

    expect(localStorage.getItem(PREF_STORAGE_KEYS.COOKIE)).toBe(STATE_STRINGS.TRUE)
    expect(eventFired).toBe(true)
    expect(cookieEl.hidden).toBe(true)
    expect(cookieEl.shadowRoot.querySelector(S.COOKIES)).toBeNull()
    document.removeEventListener(APP_EVENTS.COOKIE_ACTION, listener)
  })

  test('clicking refuse sets localStorage "cookie" to false and hides banner', () => {
    cookieEl.translations = { cookies: { message: 'Info', accept: 'Accept', refuse: 'Refuse' } }
    const refuseBtn = cookieEl.shadowRoot.querySelector(S.COOKIES_REFUSE)
    refuseBtn.click()
    expect(localStorage.getItem(PREF_STORAGE_KEYS.COOKIE)).toBe(STATE_STRINGS.FALSE)
    expect(cookieEl.hidden).toBe(true)
    expect(cookieEl.shadowRoot.querySelector(S.COOKIES)).toBeNull()
  })

  test('does not render when localStorage already contains consent', () => {
    localStorage.setItem(PREF_STORAGE_KEYS.COOKIE, STATE_STRINGS.TRUE)
    const newBanner = new CookieBanner()
    document.body.appendChild(newBanner)
    newBanner.translations = { cookies: { message: 'Info', accept: 'Accept', refuse: 'Refuse' } }
    expect(newBanner.hidden).toBe(true)
    expect(newBanner.shadowRoot.querySelector(S.COOKIES)).toBeNull()
    newBanner.parentNode.removeChild(newBanner)
  })
})
