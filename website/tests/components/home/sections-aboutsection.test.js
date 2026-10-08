/**
 * @file sections-aboutsection.test.js
 * @description Split from sections.test.js — covers the "AboutSection" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { AboutSection } from '@website/components/home/AboutSection.js'
import { SCSS, TEST_TEXT, mount } from '@tests/fixtures/test-constants.js'
import { COOKIE_CLASSES } from '@core/tokens/classes/cookies.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { AWC_CLASSES } from '@core/tokens/classes/awards-carousel.js'
import { SKELETON_CLASSES } from '@core/tokens/classes/skeleton.js'
import { NAV_TEXT } from '@core/tokens/strings/text.js'
import { ABOUT_CLASSES } from '@core/tokens/classes/about.js'
import { COMMON_SELECTORS } from '@core/tokens/selectors/common.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { GENERIC_DIMENSIONS } from '@core/tokens/media/dimensions.js'
import { SECTION_UI_KEYS } from '@core/tokens/data/ui-keys.js'

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
