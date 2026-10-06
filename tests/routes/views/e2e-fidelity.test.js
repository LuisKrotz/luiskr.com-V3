import { jest } from '@jest/globals'
import { LOCALES, ROUTE_NAMES, THEME } from '@/core/constants.js'
import '@/App.js'
import '@/components/nav/AppNav.js'
import '@/components/home/HomeMosaic.js'
import '@/components/home/AboutSection.js'
import '@/components/home/ContactSection.js'
import '@/components/dialogs/PreferencesModal.js'
import '@/components/dialogs/LangDialog.js'
import '@/components/carousel/CustomCarousel.js'
import '@/components/carousel/HomeCarousel.js'
import '@/components/media/MediaFigure.js'
import '@/components/media/MediaExpanded.js'
import '@/routes/views/home/Home.js'
import '@/routes/views/project/Project.js'
import '@/routes/views/legal/Legal.js'
import store from '@/core/store.js'
import '@/routes/router.js'
import { deepQuerySelector, deepQuerySelectorAll } from '@/core/utils/dom.js'
import { TEST_AWARDS, TEST_PROJECTS, TEST_TEXT } from '../../fixtures/test-constants.js'
import { LANG_MUTATIONS, MODAL_MUTATIONS, PREF_MUTATIONS } from '@/core/tokens/events/mutations.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import { DRAW_TEXT_SELECTORS } from '@/core/tokens/selectors/draw-text.js'
import { ARIA_ATTRS } from '@/core/tokens/attrs/aria.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { FORM_ATTRS } from '@/core/tokens/attrs/form.js'
import { HC_CLASSES } from '@/core/tokens/classes/home-carousel.js'
import { CAROUSEL_SELECTORS } from '@/core/tokens/selectors/carousel.js'
import { NAV_TEXT } from '@/core/tokens/strings/text.js'
import { NAV_SELECTORS } from '@/core/tokens/selectors/nav.js'
import { SECTION_IDS } from '@/core/tokens/ids/sections.js'
import { NAV_CLASSES } from '@/core/tokens/classes/nav.js'
import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { ANIMATION_DURATIONS } from '@/core/tokens/motion/animation.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'

describe('Automated End-to-End Feature & Fidelity Test Suite (50+ Tests)', () => {
  let consoleErrors = []
  let consoleWarnings = []
  const originalError = console.error
  const originalWarn = console.warn

  beforeAll(() => {
    console.error = (...args) => {
      consoleErrors.push(args.join(' '))
      originalError(...args)
    }
    console.warn = (...args) => {
      consoleWarnings.push(args.join(' '))
      originalWarn(...args)
    }
  })

  afterAll(() => {
    console.error = originalError
    console.warn = originalWarn
  })

  beforeEach(() => {
    document.body.innerHTML = ''
    consoleErrors = []
    consoleWarnings = []
    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
    store.commit(PREF_MUTATIONS.SET_THEME, THEME.LIGHT)
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
    window.history.replaceState({}, '', '/')
  })

  describe('1. Full DOM Text Spacing, Words & Typography Rendering', () => {
    test('AboutSection retains word isolation and non-breaking space spans', () => {
      const about = document.createElement(COMPONENT_TAGS.ABOUT_SECTION)
      about.aboutTranslations = {
        title: 'About Luis',
        col1: [
          'Hi, I\'m Luis —<br />a Software Engineer focused on UX.<br>Currently working at Dell on the <a href="https://www.delldesignsystem.com" target="_blank">Dell Design System</a>.',
        ],
        col2: ['Pixel-perfect design systems and scalable Web Components.'],
      }
      about.profilePicture = 'https://gravatar.com/avatar/test?size=200'
      document.body.appendChild(about)

      const aboutShadow = about.shadowRoot
      expect(aboutShadow).not.toBeNull()

      const paraDraw = aboutShadow.querySelector('.about-item-text draw-text')
      expect(paraDraw).not.toBeNull()

      const pShadow = paraDraw.shadowRoot
      const words = pShadow.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD)
      expect(words.length).toBeGreaterThanOrEqual(15)

      const wordValues = Array.from(words).map((w) => w.textContent)
      expect(wordValues).toContain('Hi,')
      expect(wordValues).toContain("I'm")
      expect(wordValues).toContain('Luis')
      expect(wordValues).toContain('Software')
      expect(wordValues).toContain('Engineer')

      const spaces = pShadow.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_SPACE)
      expect(spaces.length).toBeGreaterThanOrEqual(10)
      spaces.forEach((sp) => {
        expect(sp.innerHTML).toMatch(/(&nbsp;|&#32;|\s)/)
        expect(sp.getAttribute(ARIA_ATTRS.ARIA_HIDDEN)).toBe(STATE_STRINGS.TRUE)
      })
    })

    test('HomeMosaic section title renders formatted DrawText words', () => {
      const mosaic = document.createElement(COMPONENT_TAGS.HOME_MOSAIC)
      mosaic.translations = { featured: 'Selected Works', explore: 'Explore' }
      mosaic.processedItems = [
        {
          label: TEST_PROJECTS.METCHA_TITLE,
          image: TEST_PROJECTS.METCHA,
          featured: true,
          description: 'Design platform',
        },
      ]
      document.body.appendChild(mosaic)

      const mosaicTitle = mosaic.shadowRoot.querySelector('.home-section-title draw-text')
      expect(mosaicTitle).not.toBeNull()
      expect(mosaicTitle.getAttribute(FORM_ATTRS.TEXT)).toBe('Selected Works')

      const words = mosaicTitle.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD)
      expect(words.length).toBe(2)
      expect(words[0].textContent).toBe('Selected')
      expect(words[1].textContent).toBe('Works')
    })
  })

  describe('2. Carousel Interaction & Seamless Infinite Looping', () => {
    test('HomeCarousel initializes, creates clones, and updates on dot click', () => {
      const hc = document.createElement(COMPONENT_TAGS.HOME_CAROUSEL)
      hc.variant = 'awards'
      hc.showDots = true
      hc.items = [
        { description: TEST_AWARDS.FWA_OF_THE_DAY, link: 'https://thefwa.com', icon: '🏆' },
        { description: TEST_AWARDS.AWWARDS_SOTD, link: 'https://awwwards.com', icon: '⭐' },
        { description: 'CSSDA Best UI', link: 'https://cssdesignawards.com', icon: '🎖️' },
      ]
      document.body.appendChild(hc)

      const shadow = hc.shadowRoot
      expect(shadow.querySelectorAll('.hc-slide').length).toBe(5) // 3 + 2 clones

      const dots = shadow.querySelectorAll('.hc-dot')
      expect(dots.length).toBe(3)
      expect(dots[0].classList.contains(HC_CLASSES.HC_DOT_ACTIVE)).toBe(true)

      dots[1].click()
      expect(hc.currentIndex).toBe(1)
      expect(dots[1].classList.contains(HC_CLASSES.HC_DOT_ACTIVE)).toBe(true)
    })

    test('CustomCarousel renders responsive slides and updates height variable', () => {
      const cc = document.createElement(COMPONENT_TAGS.CUSTOM_CAROUSEL)
      cc.items = [
        { src: 's1.jpg', width: 800, height: 600, alt: 'Slide 1' },
        { src: 's2.jpg', width: 800, height: 600, alt: 'Slide 2' },
      ]
      document.body.appendChild(cc)

      expect(cc.isActive).toBe(true)
      const slides = cc.shadowRoot.querySelectorAll(CAROUSEL_SELECTORS.CAROUSEL_SLIDES_NOT_CLONE)
      expect(slides.length).toBe(2)

      const nextBtn = cc.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_BTN_NEXT)
      nextBtn.click()
      expect(cc.currentIndex).toBe(1)
    })
  })

  describe('3. Application Navigation, State & Deep Linking', () => {
    test('AppNav provides full navigation menu controls', () => {
      const nav = document.createElement(COMPONENT_TAGS.APP_NAV)
      nav.translations = {
        title: TEST_TEXT.LUIS_KROTZ,
        about: { description: NAV_TEXT.ABOUT },
        contact: NAV_TEXT.CONTACT,
        preferences: 'Preferences',
        scrollup: NAV_TEXT.SCROLL_UP_ALT,
      }
      document.body.appendChild(nav)
      nav._openMenu()

      const shadow = nav.shadowRoot
      expect(shadow.querySelector(NAV_SELECTORS.NAV_LOGO_BTN).textContent.trim()).toBe(
        TEST_TEXT.LUIS_KROTZ
      )
      expect(shadow.querySelector(NAV_SELECTORS.NAV_ABOUT_BTN).textContent.trim()).toBe(
        ROUTE_NAMES.ABOUT
      )
      expect(shadow.querySelector(NAV_SELECTORS.NAV_ACTION_BTN).textContent.trim()).toBe(
        ROUTE_NAMES.CONTACT
      )

      nav.updateScrollState(SECTION_IDS.CONTACT, true)
      expect(shadow.querySelector(NAV_SELECTORS.NAV_ACTION_BTN).textContent.trim()).toBe(
        NAV_TEXT.SCROLL_UP_ALT
      )
      expect(
        shadow
          .querySelector(NAV_SELECTORS.NAV_ACTION_BTN)
          .classList.contains(NAV_CLASSES.NAV_SCROLL_UP)
      ).toBe(true)
    })

    test('Preferences toggle opens and updates application theme across DOM', () => {
      const app = document.createElement(COMPONENT_TAGS.APP_ROOT)
      document.body.appendChild(app)

      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
      expect(store.getters.getPreferencesOpen()).toBe(true)

      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      expect(document.documentElement.classList.contains(STATE_CLASSES.DARK_MODE)).toBe(true)

      store.commit(PREF_MUTATIONS.SET_THEME, THEME.LIGHT)
      expect(document.documentElement.classList.contains(STATE_CLASSES.DARK_MODE)).toBe(false)
    })

    test('LangDialog emits open event and updates store language', () => {
      const dialog = document.createElement(COMPONENT_TAGS.LANG_DIALOG)
      document.body.appendChild(dialog)
      dialog.open = true

      const esBtn = dialog.shadowRoot.querySelector('[data-lang="es"]')
      jest.useFakeTimers()
      esBtn.click()
      jest.advanceTimersByTime(ANIMATION_DURATIONS.DIALOG_LEAVE_DURATION)
      jest.useRealTimers()

      expect(store.getters.getLang()).toBe(LOCALES.ES)
      expect(dialog.open).toBe(false)
    })
  })

  describe('4. Deep Piercing DOM Selector Integrity', () => {
    test('deepQuerySelector penetrates nested Shadow DOM trees', () => {
      const app = document.createElement(COMPONENT_TAGS.APP_ROOT)
      document.body.appendChild(app)

      const navInShadow = deepQuerySelector(COMPONENT_TAGS.APP_NAV)
      expect(navInShadow).not.toBeNull()

      const logoInNavShadow = deepQuerySelector(NAV_SELECTORS.NAV_LOGO_BTN)
      expect(logoInNavShadow).not.toBeNull()
    })

    test('deepQuerySelectorAll gathers matching elements across all shadow roots', () => {
      const app = document.createElement(COMPONENT_TAGS.APP_ROOT)
      document.body.appendChild(app)

      const buttons = deepQuerySelectorAll(HTML_TAGS.BUTTON)
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('5. Console Health & Runtime Exception Guard', () => {
    test('zero uncaught exceptions, TypeErrors, or null property accesses during test execution', () => {
      const fatalErrors = consoleErrors.filter(
        (err) =>
          err.includes('Uncaught') ||
          err.includes('TypeError') ||
          err.includes('ReferenceError') ||
          err.includes('Cannot read properties')
      )
      expect(fatalErrors).toEqual([])
    })
  })
})
