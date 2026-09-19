import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { AboutSection } from '../src/components/AboutSection.js'
import { ContactSection } from '../src/components/ContactSection.js'
import { AwardsMentions } from '../src/components/AwardsMentions.js'
import { CookieBanner } from '../src/components/CookieBanner.js'
import { CLASSES, TAGS, MEDIA_DIMENSIONS } from '../src/core/constants.js'
import { SCSS, mount } from './fixtures/test-constants.js'
import store from '../src/core/store.js'
import router from '../src/core/router.js'

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
    expect(root.querySelector(`.${CLASSES.SKELETON_ABOUT_TITLE}`)).not.toBeNull()
    expect(root.querySelector(`.${CLASSES.SKELETON_ABOUT_P1}`)).not.toBeNull()
    expect(root.querySelector(`.${CLASSES.SKELETON_ABOUT_P2}`)).not.toBeNull()
    expect(root.querySelector(`.${CLASSES.SKELETON_ABOUT_P3}`)).not.toBeNull()
    expect(root.querySelector(`.${CLASSES.SKELETON_ABOUT_P4}`)).not.toBeNull()
    expect(root.querySelector(`.${CLASSES.SKELETON_ABOUT_P5}`)).not.toBeNull()
  })

  test('renders profile picture placeholder when profilePicture is null', () => {
    aboutEl.aboutTranslations = { title: 'About Me', col1: ['P1'], col2: ['P2'] }
    aboutEl.profilePicture = null
    const placeholder = aboutEl.shadowRoot.querySelector(`.${CLASSES.ABOUT_PROFILE_PICTURE_PLACEHOLDER}`)
    expect(placeholder).not.toBeNull()
  })

  test('renders section#about with CLASSES.ABOUT', () => {
    const section = aboutEl.shadowRoot.querySelector('section#about')
    expect(section).not.toBeNull()
    expect(section.classList.contains(CLASSES.ABOUT)).toBe(true)
  })

  test('calculates aboutDrawData charDelay and offsets correctly', () => {
    aboutEl.aboutTranslations = {
      title: 'About Me',
      col1: ['Hello World', 'Second line'],
      col2: ['Third line in col2'],
    }
    const data = aboutEl.aboutDrawData
    expect(data.charDelay).toBeGreaterThan(0)
    expect(data.col1.length).toBe(2)
    expect(data.col2.length).toBe(1)
    expect(data.col1[0].text).toBe('Hello World')
    expect(data.col1[0].offset).toBe(0)
    expect(data.col1[1].offset).toBeGreaterThan(0)
  })

  test('strips HTML when calculating offsets in aboutDrawData', () => {
    aboutEl.aboutTranslations = {
      title: 'About Me',
      col1: ['<b>Bold</b> text', 'Plain text'],
      col2: [],
    }
    const data = aboutEl.aboutDrawData
    expect(data.col1.length).toBe(2)
    expect(data.col1[1].offset).toBeGreaterThan(0)
  })

  test('renders draw-text elements for title and paragraphs when data is present', () => {
    aboutEl.aboutTranslations = { title: 'Biography', col1: ['Bio line 1'], col2: ['Bio line 2'] }
    const drawTexts = aboutEl.shadowRoot.querySelectorAll(TAGS.DRAW_TEXT)
    expect(drawTexts.length).toBe(3)
    expect(drawTexts[0].getAttribute('text')).toBe('Biography')
    expect(drawTexts[1].getAttribute('text')).toBe('Bio line 1')
    expect(drawTexts[2].getAttribute('text')).toBe('Bio line 2')
  })

  test('renders optimized profile picture with dimensions and accessibility attrs', () => {
    aboutEl.aboutTranslations = { title: 'Biography', col1: ['Bio'], col2: [] }
    aboutEl.profilePicture = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp'
    const img = aboutEl.shadowRoot.querySelector(`img.${CLASSES.ABOUT_PROFILE_PICTURE_IMG}`)
    expect(img).not.toBeNull()
    expect(img.getAttribute('width')).toBe(String(MEDIA_DIMENSIONS.PROFILE_SIZE))
    expect(img.getAttribute('height')).toBe(String(MEDIA_DIMENSIONS.PROFILE_SIZE))
    expect(img.getAttribute('loading')).toBe('lazy')
    expect(img.getAttribute('decoding')).toBe('async')
    expect(img.getAttribute('alt')).toBe('Biography')
  })

  test('updates DOM reactively when profilePicture changes', () => {
    aboutEl.aboutTranslations = { title: 'Bio', col1: [], col2: [] }
    expect(aboutEl.shadowRoot.querySelector(`img.${CLASSES.ABOUT_PROFILE_PICTURE_IMG}`)).toBeNull()
    aboutEl.profilePicture = 'https://www.gravatar.com/avatar/test?d=mp'
    expect(aboutEl.shadowRoot.querySelector(`img.${CLASSES.ABOUT_PROFILE_PICTURE_IMG}`)).not.toBeNull()
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
    store.commit('setComponentLang', {})
    contactEl._updateDom()
    const skelTitle = contactEl.shadowRoot.querySelector(`.${CLASSES.SKELETON_TITLE_SM}`)
    expect(skelTitle).not.toBeNull()
    const skelLinks = contactEl.shadowRoot.querySelectorAll(`.${CLASSES.SKELETON_FOOTER_LINK}`)
    expect(skelLinks.length).toBe(4)
  })

  test('renders title and social links when translations are populated', () => {
    store.commit('setComponentLang', {
      contact: {
        title: 'Get in Touch',
        line1: [
          { description: 'Email', link: 'mailto:test@example.com' },
          { description: 'GitHub', link: 'https://github.com/luiskr' },
          { description: 'LinkedIn', link: 'https://linkedin.com/in/luiskr' },
        ],
      },
    })
    contactEl._updateDom()

    const titleEl = contactEl.shadowRoot.querySelector(`.${CLASSES.CONTACT_TITLE}`)
    expect(titleEl.textContent).toContain('Get in Touch')

    const links = contactEl.shadowRoot.querySelectorAll(`a.${CLASSES.CONTACT_SOCIAL_LINK}`)
    expect(links.length).toBe(3)
    expect(links[0].getAttribute('href')).toBe('mailto:test@example.com')
    expect(links[0].getAttribute('target')).toBe('_blank')
    expect(links[0].getAttribute('rel')).toBe('noopener noreferrer')
    expect(links[0].textContent.trim()).toBe('Email')
  })

  test('renders dot separators between social links', () => {
    store.commit('setComponentLang', {
      contact: {
        title: 'Contact',
        line1: [
          { description: 'Link1', link: 'https://link1.com' },
          { description: 'Link2', link: 'https://link2.com' },
          { description: 'Link3', link: 'https://link3.com' },
        ],
      },
    })
    contactEl._updateDom()
    const seps = contactEl.shadowRoot.querySelectorAll(`.${CLASSES.CONTACT_SEPARATOR}`)
    expect(seps.length).toBe(2)
  })

  test('updates DOM reactively on store mutations', () => {
    store.commit('setComponentLang', { contact: { title: 'Initial Contact', line1: [] } })
    contactEl._updateDom()
    expect(contactEl.shadowRoot.textContent).toContain('Initial Contact')

    store.commit('setComponentLang', { contact: { title: 'Updated Contact', line1: [] } })
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

  test('defaults title to "Some mentions"', () => {
    expect(awardsEl.title).toBe('Some mentions')
    const titleEl = awardsEl.shadowRoot.querySelector(`.${CLASSES.AWARDS_FOOTER_TITLE}`)
    expect(titleEl.textContent).toBe('Some mentions')
  })

  test('updates title reactively when title property is set', () => {
    awardsEl.title = 'Awards & Jury Work'
    expect(awardsEl.title).toBe('Awards & Jury Work')
    const titleEl = awardsEl.shadowRoot.querySelector(`.${CLASSES.AWARDS_FOOTER_TITLE}`)
    expect(titleEl.textContent).toBe('Awards & Jury Work')
  })

  test('renders skeleton badges when items is null or empty', () => {
    awardsEl.items = null
    const skels = awardsEl.shadowRoot.querySelectorAll(`.${CLASSES.SKELETON_BADGE}`)
    expect(skels.length).toBe(3)
  })

  test('renders home-carousel with hc--awards class when items has data', () => {
    awardsEl.items = [
      { text: 'Awwwards Site of the Day', sub: '2024' },
      { text: 'FWA of the Day', sub: '2023' },
    ]
    const carousel = awardsEl.shadowRoot.querySelector('home-carousel.hc--awards')
    expect(carousel).not.toBeNull()
  })

  test('filters out single root language slugs from legal links', () => {
    store.commit('setComponentLang', {
      'legal-footer': {
        links: [
          { page: 'Home', link: '/en' },
          { page: 'Privacy', link: '/privacy-policy' },
          { page: 'Terms', link: '/terms-of-use' },
        ],
      },
    })
    const links = awardsEl.legalLinks
    expect(links.find((l) => l.link === '/en')).toBeUndefined()
    expect(links.find((l) => l.link === '/privacy-policy')).toBeDefined()
  })

  test('renders legal navigation links with aria-label="Legal"', () => {
    const nav = awardsEl.shadowRoot.querySelector(`nav.${CLASSES.AWARDS_FOOTER_LINKS}`)
    expect(nav).not.toBeNull()
    expect(nav.getAttribute('aria-label')).toBe('Legal')
  })

  test('renders dot separators between legal links equal to links.length - 1', () => {
    const links = awardsEl.shadowRoot.querySelectorAll(`.${CLASSES.AWARDS_FOOTER_ITEM}`)
    const seps = awardsEl.shadowRoot.querySelectorAll(`.${CLASSES.AWARDS_FOOTER_SEP}`)
    expect(seps.length).toBe(Math.max(0, links.length - 1))
  })

  test('clicking legal link calls router.push', () => {
    let pushedRoute = null
    const originalPush = router.push
    router.push = (route) => { pushedRoute = route }

    const firstLink = awardsEl.shadowRoot.querySelector(`.${CLASSES.AWARDS_FOOTER_ITEM}`)
    expect(firstLink).not.toBeNull()
    firstLink.click()
    expect(pushedRoute).toBe(firstLink.getAttribute('href'))
    router.push = originalPush
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
      { text: 'Awwwards Site of the Day', sub: '2024' },
      { text: 'FWA of the Day', sub: '2023' },
    ]
    const initialCarousel = awardsEl.shadowRoot.querySelector('home-carousel')
    expect(initialCarousel).not.toBeNull()

    store.commit('setInputMethod', 'pointer')
    awardsEl.onStoreUpdate()

    const currentCarousel = awardsEl.shadowRoot.querySelector('home-carousel')
    expect(currentCarousel).toBe(initialCarousel)
  })

  test('items setter updates home-carousel items without replacing the DOM node', () => {
    awardsEl.items = [
      { text: 'Awwwards Site of the Day', sub: '2024' },
      { text: 'FWA of the Day', sub: '2023' },
    ]
    const initialCarousel = awardsEl.shadowRoot.querySelector('home-carousel')
    awardsEl.items = [
      { text: 'Awwwards Site of the Day', sub: '2024' },
      { text: 'FWA of the Day', sub: '2023' },
      { text: 'CSS Design Awards', sub: '2022' },
    ]
    const updatedCarousel = awardsEl.shadowRoot.querySelector('home-carousel')
    expect(updatedCarousel).toBe(initialCarousel)
    expect(updatedCarousel.items.length).toBe(3)
  })

  test('HomeCarousel dot click navigates to target slide and stops autoplay', () => {
    awardsEl.items = [
      { text: 'Award 1', sub: '2024' },
      { text: 'Award 2', sub: '2023' },
      { text: 'Award 3', sub: '2022' },
    ]
    const hc = awardsEl.shadowRoot.querySelector('home-carousel')
    expect(hc).not.toBeNull()
    hc.autoplayRunning = true
    const dots = hc.shadowRoot.querySelectorAll(`.${CLASSES.HC_DOT}`)
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
    const hc = awardsEl.shadowRoot.querySelector('home-carousel')
    expect(hc).not.toBeNull()
    const dotBtn = hc.shadowRoot.querySelector(`button.${CLASSES.HC_DOT}`)
    expect(dotBtn).not.toBeNull()
    expect(dotBtn.getAttribute('type')).toBe('button')
    expect(dotBtn.getAttribute('aria-label')).toContain('1')
  })

  test('awards item description renders as HTML markup', () => {
    awardsEl.items = [
      { description: 'Winner of <strong>Site of the Day</strong>', link: 'https://awwwards.com', icon: '⭐' },
    ]
    const hc = awardsEl.shadowRoot.querySelector('home-carousel')
    expect(hc).not.toBeNull()
    const awardText = hc.shadowRoot.querySelector(`.${CLASSES.HC_AWARD_TEXT}`)
    expect(awardText).not.toBeNull()
    expect(awardText.innerHTML).toContain('<strong>Site of the Day</strong>')
  })

  test('awards item description parses nested HTML tags into DOM child elements', () => {
    awardsEl.items = [
      { description: 'Featured on <em>Awwwards</em> & <a href="https://fwa.com">FWA</a>', link: 'https://fwa.com', icon: '🏆' },
    ]
    const hc = awardsEl.shadowRoot.querySelector('home-carousel')
    const awardText = hc.shadowRoot.querySelector(`.${CLASSES.HC_AWARD_TEXT}`)
    const emEl = awardText.querySelector('em')
    const linkEl = awardText.querySelector('a')
    expect(emEl).not.toBeNull()
    expect(emEl.textContent).toBe('Awwwards')
    expect(linkEl).not.toBeNull()
    expect(linkEl.getAttribute('href')).toBe('https://fwa.com')
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
    const aside = cookieEl.shadowRoot.querySelector('aside.cookies')
    expect(aside).toBeNull()
  })

  test('renders aside.cookies when translations provided and no prior consent', () => {
    cookieEl.translations = {
      cookies: { message: 'This site uses cookies.', accept: 'Accept', refuse: 'Refuse' },
    }
    const aside = cookieEl.shadowRoot.querySelector('aside.cookies')
    expect(aside).not.toBeNull()
    const info = cookieEl.shadowRoot.querySelector('.cookies-info')
    expect(info.textContent).toContain('This site uses cookies.')
  })

  test('accept button renders custom translated text', () => {
    cookieEl.translations = { cookies: { message: 'Info', accept: 'Concordo', refuse: 'Recusar' } }
    const acceptBtn = cookieEl.shadowRoot.querySelector('.cookies-buttons-accept')
    expect(acceptBtn.textContent).toBe('Concordo')
  })

  test('clicking accept sets localStorage "cookie" to true and hides banner', () => {
    cookieEl.translations = { cookies: { message: 'Info', accept: 'Accept', refuse: 'Refuse' } }
    let eventFired = false
    const listener = () => { eventFired = true }
    document.addEventListener('cookieAction', listener)

    const acceptBtn = cookieEl.shadowRoot.querySelector('.cookies-buttons-accept')
    acceptBtn.click()

    expect(localStorage.getItem('cookie')).toBe('true')
    expect(eventFired).toBe(true)
    expect(cookieEl.hidden).toBe(true)
    expect(cookieEl.shadowRoot.querySelector('aside.cookies')).toBeNull()
    document.removeEventListener('cookieAction', listener)
  })

  test('clicking refuse sets localStorage "cookie" to false and hides banner', () => {
    cookieEl.translations = { cookies: { message: 'Info', accept: 'Accept', refuse: 'Refuse' } }
    const refuseBtn = cookieEl.shadowRoot.querySelector('.cookies-buttons-refuse')
    refuseBtn.click()
    expect(localStorage.getItem('cookie')).toBe('false')
    expect(cookieEl.hidden).toBe(true)
    expect(cookieEl.shadowRoot.querySelector('aside.cookies')).toBeNull()
  })

  test('does not render when localStorage already contains consent', () => {
    localStorage.setItem('cookie', 'true')
    const newBanner = new CookieBanner()
    document.body.appendChild(newBanner)
    newBanner.translations = { cookies: { message: 'Info', accept: 'Accept', refuse: 'Refuse' } }
    expect(newBanner.hidden).toBe(true)
    expect(newBanner.shadowRoot.querySelector('aside.cookies')).toBeNull()
    newBanner.parentNode.removeChild(newBanner)
  })
})
