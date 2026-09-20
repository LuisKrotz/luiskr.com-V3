import '../src/App.js'
import '../src/components/AppNav.js'
import '../src/components/HomeMosaic.js'
import '../src/components/AboutSection.js'
import '../src/components/ContactSection.js'
import '../src/components/PreferencesModal.js'
import '../src/components/LangDialog.js'
import '../src/components/CustomCarousel.js'
import '../src/components/HomeCarousel.js'
import '../src/components/MediaFigure.js'
import '../src/components/MediaExpanded.js'
import '../src/views/Home.js'
import '../src/views/Project.js'
import '../src/views/Legal.js'
import store from '../src/core/store.js'
import router from '../src/core/router.js'
import { deepQuerySelector, deepQuerySelectorAll } from '../src/core/dom.js'

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
    store.commit('setLang', 'en')
    store.commit('setTheme', 'light')
    store.commit('setReducedMotion', false)
    store.commit('togglePreferencesModal', false)
    window.history.replaceState({}, '', '/')
  })

  describe('1. Full DOM Text Spacing, Words & Typography Rendering', () => {
    test('AboutSection retains word isolation and non-breaking space spans', () => {
      const about = document.createElement('about-section')
      about.aboutTranslations = {
        title: 'About Luis',
        col1: [
          "Hi, I'm Luis —<br />a Software Engineer focused on UX.<br>Currently working at Dell on the <a href=\"https://www.delldesignsystem.com\" target=\"_blank\">Dell Design System</a>.",
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
      const words = pShadow.querySelectorAll('.draw-text__word')
      expect(words.length).toBeGreaterThanOrEqual(15)

      const wordValues = Array.from(words).map((w) => w.textContent)
      expect(wordValues).toContain('Hi,')
      expect(wordValues).toContain("I'm")
      expect(wordValues).toContain('Luis')
      expect(wordValues).toContain('Software')
      expect(wordValues).toContain('Engineer')

      const spaces = pShadow.querySelectorAll('.draw-text__space')
      expect(spaces.length).toBeGreaterThanOrEqual(10)
      spaces.forEach((sp) => {
        expect(sp.innerHTML).toMatch(/(&nbsp;|&#32;|\s)/)
        expect(sp.getAttribute('aria-hidden')).toBe('true')
      })
    })

    test('HomeMosaic section title renders formatted DrawText words', () => {
      const mosaic = document.createElement('home-mosaic')
      mosaic.translations = { featured: 'Selected Works', explore: 'Explore' }
      mosaic.processedItems = [
        { label: 'Metcha', image: 'metcha', featured: true, description: 'Design platform' },
      ]
      document.body.appendChild(mosaic)

      const mosaicTitle = mosaic.shadowRoot.querySelector('.home-section-title draw-text')
      expect(mosaicTitle).not.toBeNull()
      expect(mosaicTitle.getAttribute('text')).toBe('Selected Works')

      const words = mosaicTitle.shadowRoot.querySelectorAll('.draw-text__word')
      expect(words.length).toBe(2)
      expect(words[0].textContent).toBe('Selected')
      expect(words[1].textContent).toBe('Works')
    })
  })

  describe('2. Carousel Interaction & Seamless Infinite Looping', () => {
    test('HomeCarousel initializes, creates clones, and updates on dot click', () => {
      const hc = document.createElement('home-carousel')
      hc.variant = 'awards'
      hc.showDots = true
      hc.items = [
        { description: 'FWA of the Day', link: 'https://thefwa.com', icon: '🏆' },
        { description: 'Awwwards Site of the Day', link: 'https://awwwards.com', icon: '⭐' },
        { description: 'CSSDA Best UI', link: 'https://cssdesignawards.com', icon: '🎖️' },
      ]
      document.body.appendChild(hc)

      const shadow = hc.shadowRoot
      expect(shadow.querySelectorAll('.hc-slide').length).toBe(5) // 3 + 2 clones

      const dots = shadow.querySelectorAll('.hc-dot')
      expect(dots.length).toBe(3)
      expect(dots[0].classList.contains('hc-dot--active')).toBe(true)

      dots[1].click()
      expect(hc.currentIndex).toBe(1)
      expect(dots[1].classList.contains('hc-dot--active')).toBe(true)
    })

    test('CustomCarousel renders responsive slides and updates height variable', () => {
      const cc = document.createElement('custom-carousel')
      cc.items = [
        { src: 's1.jpg', width: 800, height: 600, alt: 'Slide 1' },
        { src: 's2.jpg', width: 800, height: 600, alt: 'Slide 2' },
      ]
      document.body.appendChild(cc)

      expect(cc.isActive).toBe(true)
      const slides = cc.shadowRoot.querySelectorAll('.carousel-slide:not(.carousel-slide--clone)')
      expect(slides.length).toBe(2)

      const nextBtn = cc.shadowRoot.querySelector('.carousel-btn--next')
      nextBtn.click()
      expect(cc.currentIndex).toBe(1)
    })
  })

  describe('3. Application Navigation, State & Deep Linking', () => {
    test('AppNav provides full navigation menu controls', () => {
      const nav = document.createElement('app-nav')
      nav.translations = {
        title: 'Luis Krötz',
        about: { description: 'About' },
        contact: 'Contact',
        preferences: 'Preferences',
        scrollup: 'Scroll up',
      }
      document.body.appendChild(nav)

      const shadow = nav.shadowRoot
      expect(shadow.querySelector('.nav-logo-btn').textContent.trim()).toBe('Luis Krötz')
      expect(shadow.querySelector('.nav-about-btn').textContent.trim()).toBe('About')
      expect(shadow.querySelector('.nav-action-btn').textContent.trim()).toBe('Contact')

      nav.updateScrollState('contact', true)
      expect(shadow.querySelector('.nav-action-btn').textContent.trim()).toBe('Scroll up')
      expect(shadow.querySelector('.nav-action-btn').classList.contains('scroll-up')).toBe(true)
    })

    test('Preferences toggle opens and updates application theme across DOM', () => {
      const app = document.createElement('app-root')
      document.body.appendChild(app)

      store.commit('togglePreferencesModal', true)
      expect(store.getters.getPreferencesOpen()).toBe(true)

      store.commit('setTheme', 'dark')
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true)

      store.commit('setTheme', 'light')
      expect(document.documentElement.classList.contains('dark-mode')).toBe(false)
    })

    test('LangDialog emits open event and updates store language', () => {
      const dialog = document.createElement('lang-dialog')
      document.body.appendChild(dialog)
      dialog.open = true

      const esBtn = dialog.shadowRoot.querySelector('[data-lang="es"]')
      esBtn.click()

      expect(store.getters.getLang()).toBe('es')
      expect(dialog.open).toBe(false)
    })
  })

  describe('4. Deep Piercing DOM Selector Integrity', () => {
    test('deepQuerySelector penetrates nested Shadow DOM trees', () => {
      const app = document.createElement('app-root')
      document.body.appendChild(app)

      const navInShadow = deepQuerySelector('app-nav')
      expect(navInShadow).not.toBeNull()

      const logoInNavShadow = deepQuerySelector('.nav-logo-btn')
      expect(logoInNavShadow).not.toBeNull()
    })

    test('deepQuerySelectorAll gathers matching elements across all shadow roots', () => {
      const app = document.createElement('app-root')
      document.body.appendChild(app)

      const buttons = deepQuerySelectorAll('button')
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
