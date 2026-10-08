/**
 * @file sections-awardsmentions.test.js
 * @description Split from sections.test.js — covers the "AwardsMentions" describe.
 */
import { FALLBACK_PAGES } from '@core/locale/fallback.js'
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { AwardsMentions } from '@website/components/home/AwardsMentions.js'
import { CMS_KEYS, LOCALES, ROUTE_NAMES, ROUTE_PREFIXES } from '@core/constants.js'
import { SCSS, TEST_AWARDS, mount } from '@tests/fixtures/test-constants.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { COOKIE_CLASSES } from '@core/tokens/classes/cookies.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { AWC_CLASSES } from '@core/tokens/classes/awards-carousel.js'
import { SKELETON_CLASSES } from '@core/tokens/classes/skeleton.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { LANG_MUTATIONS, UI_MUTATIONS } from '@core/tokens/events/mutations.js'
import { LINK_ATTRS } from '@core/tokens/attrs/link.js'
import { AWARDS_CLASSES } from '@core/tokens/classes/awards.js'
import { FOOTER_CLASSES } from '@core/tokens/classes/footer.js'
import { DOCS_STRINGS } from '@core/tokens/strings/docs.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { INPUT_STRINGS } from '@core/tokens/strings/input.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

// ─── Local selector helpers (derived from CLASSES) ────────────────────────────
const S = {
  COOKIES: `aside.${COOKIE_CLASSES.COOKIES}`,
  COOKIES_INFO: `.${COOKIE_CLASSES.COOKIES_INFO}`,
  COOKIES_ACCEPT: `.${COOKIE_CLASSES.COOKIES_BUTTONS_ACCEPT}`,
  COOKIES_REFUSE: `.${COOKIE_CLASSES.COOKIES_BUTTONS_REFUSE}`,
  AWC_AWARDS: `${COMPONENT_TAGS.AWARDS_CAROUSEL}.${AWC_CLASSES.AWC_AWARDS}`,
  AWARDS_CAROUSEL: COMPONENT_TAGS.AWARDS_CAROUSEL,
}

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
    let skels = awardsEl.shadowRoot.querySelectorAll(`.${SKELETON_CLASSES.SKELETON_BADGE}`)
    expect(skels.length).toBe(3)

    // empty array takes the same skeleton arm — `items.length` falsy
    awardsEl.items = []
    skels = awardsEl.shadowRoot.querySelectorAll(`.${SKELETON_CLASSES.SKELETON_BADGE}`)
    expect(skels.length).toBe(3)
  })

  test('renders awards-carousel with aw-c--awards class when items has data', () => {
    awardsEl.items = [
      { text: TEST_AWARDS.AWWARDS_SOTD, sub: '2024' },
      { text: TEST_AWARDS.FWA_OF_THE_DAY, sub: '2023' },
    ]
    const carousel = awardsEl.shadowRoot.querySelector(S.AWC_AWARDS)
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

  test('renders the English-only docs entry with the localized description', () => {
    const link = awardsEl.shadowRoot.querySelector(`.${FOOTER_CLASSES.FOOTER_DOCS_LINK}`)

    expect(link).toBeTruthy()
    expect(link.textContent).toBe(DOCS_STRINGS.TITLE)
    expect(link.getAttribute(LINK_ATTRS.HREF)).toBe(ROUTE_PATHS.DOCS)

    const desc = awardsEl.shadowRoot.querySelector(`.${FOOTER_CLASSES.FOOTER_DOCS_DESC}`)

    expect(desc).toBeTruthy()
    expect(desc.textContent).toBe(DOCS_STRINGS.DESC_FALLBACK)
  })

  test('docs entry click routes to /docs through the router', () => {
    let pushedRoute = null
    const originalPush = router.push

    router.push = (route) => {
      pushedRoute = route
    }

    const link = awardsEl.shadowRoot.querySelector(`.${FOOTER_CLASSES.FOOTER_DOCS_LINK}`)

    link.dispatchEvent(new MouseEvent(MOUSE_EVENTS.CLICK, { bubbles: true, cancelable: true }))

    expect(pushedRoute).toBe(ROUTE_PATHS.DOCS)

    router.push = originalPush
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

  test('does not re-render awards-carousel when unrelated store mutation occurs', () => {
    awardsEl.items = [
      { text: TEST_AWARDS.AWWARDS_SOTD, sub: '2024' },
      { text: TEST_AWARDS.FWA_OF_THE_DAY, sub: '2023' },
    ]
    const initialCarousel = awardsEl.shadowRoot.querySelector(S.AWARDS_CAROUSEL)
    expect(initialCarousel).not.toBeNull()

    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.POINTER)
    awardsEl.onStoreUpdate()

    const currentCarousel = awardsEl.shadowRoot.querySelector(S.AWARDS_CAROUSEL)
    expect(currentCarousel).toBe(initialCarousel)
  })

  test('items setter updates awards-carousel items without replacing the DOM node', () => {
    awardsEl.items = [
      { text: TEST_AWARDS.AWWARDS_SOTD, sub: '2024' },
      { text: TEST_AWARDS.FWA_OF_THE_DAY, sub: '2023' },
    ]
    const initialCarousel = awardsEl.shadowRoot.querySelector(S.AWARDS_CAROUSEL)
    awardsEl.items = [
      { text: TEST_AWARDS.AWWARDS_SOTD, sub: '2024' },
      { text: TEST_AWARDS.FWA_OF_THE_DAY, sub: '2023' },
      { text: 'CSS Design Awards', sub: '2022' },
    ]
    const updatedCarousel = awardsEl.shadowRoot.querySelector(COMPONENT_TAGS.AWARDS_CAROUSEL)
    expect(updatedCarousel).toBe(initialCarousel)
    expect(updatedCarousel.items.length).toBe(3)
  })

  test('AwardsCarousel dot click navigates to target slide and stops autoplay', () => {
    awardsEl.items = [
      { text: 'Award 1', sub: '2024' },
      { text: 'Award 2', sub: '2023' },
      { text: 'Award 3', sub: '2022' },
    ]
    const awc = awardsEl.shadowRoot.querySelector(S.AWARDS_CAROUSEL)
    expect(awc).not.toBeNull()
    awc.autoplayRunning = true
    const dots = awc.shadowRoot.querySelectorAll(`.${AWC_CLASSES.AWC_DOT}`)
    expect(dots.length).toBe(3)
    dots[1].click()
    expect(awc.currentIndex).toBe(1)
    expect(awc.autoplayRunning).toBe(false)
  })

  test('AwardsCarousel dot buttons have type="button" and aria-label', () => {
    awardsEl.items = [
      { text: 'Award 1', sub: '2024' },
      { text: 'Award 2', sub: '2023' },
    ]
    const awc = awardsEl.shadowRoot.querySelector(S.AWARDS_CAROUSEL)
    expect(awc).not.toBeNull()
    const dotBtn = awc.shadowRoot.querySelector(`button.${AWC_CLASSES.AWC_DOT}`)
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
    const awc = awardsEl.shadowRoot.querySelector(S.AWARDS_CAROUSEL)
    expect(awc).not.toBeNull()
    const awardText = awc.shadowRoot.querySelector(`.${AWC_CLASSES.AWC_AWARD_TEXT}`)
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
    const awc = awardsEl.shadowRoot.querySelector(S.AWARDS_CAROUSEL)
    const awardText = awc.shadowRoot.querySelector(`.${AWC_CLASSES.AWC_AWARD_TEXT}`)
    const emEl = awardText.querySelector('em')
    const linkEl = awardText.querySelector('a')
    expect(emEl).not.toBeNull()
    expect(emEl.textContent).toBe('Awwwards')
    expect(linkEl).not.toBeNull()
    expect(linkEl.getAttribute(LINK_ATTRS.HREF)).toBe('https://fwa.com')
  })
})
