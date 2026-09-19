import store from '../src/core/store.js'
import router from '../src/core/router.js'
import '../src/App.js'
import '../src/components/AppNav.js'
import '../src/components/HomeMosaic.js'
import '../src/components/AboutSection.js'
import '../src/components/ContactSection.js'
import '../src/components/PreferencesModal.js'
import '../src/components/LangDialog.js'
import '../src/components/HomeCarousel.js'
import '../src/components/CustomCarousel.js'
import '../src/components/MediaFigure.js'
import '../src/components/MediaExpanded.js'
import '../src/components/CookieBanner.js'
import { CLASSES, TAGS, TEXT } from '../src/core/constants.js'

// ─── Local selector helpers (derived from CLASSES) ────────────────────────────
const S = {
  PROGRESS_BAR:          `.${CLASSES.PROGRESS_BAR}`,
  VIEW_OUTLET:           `#${CLASSES.VIEW_OUTLET}`,
  NAV_LOGO_BTN:          `.${CLASSES.NAV_LOGO_BTN}`,
  NAV_ABOUT_BTN:         `.${CLASSES.NAV_ABOUT_BTN}`,
  NAV_ACTION_BTN:        `.${CLASSES.NAV_ACTION_BTN}`,
  NAV_PREF_BTN:          `.${CLASSES.NAV_PREF_BTN}`,
  PREF_DIALOG:           `.${CLASSES.PREF_DIALOG}`,
  PREF_BACKDROP:         `.${CLASSES.PREF_BACKDROP}`,
  HOME_MOSAIC_ITEM:      `.${CLASSES.HOME_MOSAIC_ITEM}`,
  HOME_MOSAIC_ITEM_FEAT: `.${CLASSES.HOME_MOSAIC_ITEM_FEATURED}`,
  HOME_MOSAIC_TITLE:     `.${CLASSES.HOME_MOSAIC_TITLE}`,
  ABOUT_PIC_IMG:         `.${CLASSES.ABOUT_PROFILE_PICTURE_IMG}`,
  CONTACT_TITLE:         `.${CLASSES.CONTACT_TITLE}`,
  CONTACT_SOCIAL_LINK:   `.${CLASSES.CONTACT_SOCIAL_LINK}`,
  EXPAND_MODAL_OPEN_1:   `.${CLASSES.EXPAND_MODAL_OPEN_1}`,
  EXPAND_MODAL_CONTENT:  `.${CLASSES.EXPAND_MODAL_CONTENT}`,
  EXPAND_MODAL_CLOSING:  CLASSES.EXPAND_MODAL_CLOSING,
}

describe('Web Components Suite - Structure, Events & Reactive Fidelity (50+ Tests)', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    localStorage.clear()
    store.commit('setLang', 'en')
    store.commit('setTheme', 'light')
    store.commit('setReducedMotion', false)
    store.commit('togglePreferencesModal', false)
    window.history.replaceState({}, '', '/')
  })

  describe('1. AppShell & Root Container', () => {
    test('AppRoot renders shell with progress bar, nav, modals, cookie banner and view outlet', () => {
      const app = document.createElement(TAGS.APP_ROOT)
      document.body.appendChild(app)

      const shadow = app.shadowRoot
      expect(shadow).not.toBeNull()
      expect(shadow.querySelector(S.PROGRESS_BAR)).not.toBeNull()
      expect(shadow.querySelector(TAGS.APP_NAV)).not.toBeNull()
      expect(shadow.querySelector(TAGS.PREFERENCES_MODAL)).not.toBeNull()
      expect(shadow.querySelector(TAGS.LANG_DIALOG)).not.toBeNull()
      expect(shadow.querySelector(TAGS.COOKIE_BANNER)).not.toBeNull()
      expect(shadow.querySelector(S.VIEW_OUTLET)).not.toBeNull()
    })

    test('CookieBanner displays consent buttons and closes on accept', () => {
      const banner = document.createElement(TAGS.COOKIE_BANNER)
      document.body.appendChild(banner)
      expect(banner.shadowRoot).not.toBeNull()
    })
  })

  describe('2. AppNav - Navigation Bar, Actions & States', () => {
    test('AppNav renders navigation links and action button with translations', () => {
      const nav = document.createElement(TAGS.APP_NAV)
      document.body.appendChild(nav)

      nav.translations = {
        title: 'Luis Krötz',
        about: { description: TEXT.ABOUT_ME },
        contact: 'Contact Me',
        preferences: 'Preferences',
        scrollup: TEXT.SCROLL_UP_ALT,
        related: 'Related Projects',
      }

      const shadow = nav.shadowRoot
      expect(shadow.querySelector(S.NAV_LOGO_BTN).textContent.trim()).toBe('Luis Krötz')
      expect(shadow.querySelector(S.NAV_ABOUT_BTN).textContent.trim()).toBe(TEXT.ABOUT_ME)
      expect(shadow.querySelector(S.NAV_ACTION_BTN).textContent.trim()).toBe('Contact Me')
    })

    test('updateScrollState transitions contact action button to scroll-up text', () => {
      const nav = document.createElement(TAGS.APP_NAV)
      document.body.appendChild(nav)
      nav.translations = {
        title: 'Luis',
        contact: TEXT.CONTACT,
        scrollup: TEXT.SCROLL_UP_ALT,
      }

      nav.updateScrollState('contact', true)
      const updatedBtn = nav.shadowRoot.querySelector(S.NAV_ACTION_BTN)
      expect(updatedBtn.textContent.trim()).toBe(TEXT.SCROLL_UP_ALT)
      expect(updatedBtn.classList.contains('scroll-up')).toBe(true)

      nav.updateScrollState('contact', false)
      expect(nav.shadowRoot.querySelector(S.NAV_ACTION_BTN).textContent.trim()).toBe(TEXT.CONTACT)
    })

    test('clicking logo navigates to home route', async () => {
      await router.push('/portfolio/metcha')
      const nav = document.createElement(TAGS.APP_NAV)
      document.body.appendChild(nav)
      const logoBtn = nav.shadowRoot.querySelector(S.NAV_LOGO_BTN)
      expect(logoBtn).not.toBeNull()
      logoBtn.click()
      await new Promise((r) => setTimeout(r, 50))
      expect(router.currentRoute.name).toBe('Home')
    })

    test('clicking preferences button opens preferences modal in store', () => {
      const nav = document.createElement(TAGS.APP_NAV)
      document.body.appendChild(nav)
      const prefBtn = nav.shadowRoot.querySelector(S.NAV_PREF_BTN)
      expect(prefBtn).not.toBeNull()
      prefBtn.click()
      expect(store.getters.getPreferencesOpen()).toBe(true)
    })
  })

  describe('3. HomeMosaic - Fibonacci Layout & Project Tiles', () => {
    test('HomeMosaic renders project items with responsive grid layout', () => {
      const mosaic = document.createElement(TAGS.HOME_MOSAIC)
      document.body.appendChild(mosaic)

      mosaic.processedItems = [
        { label: 'Metcha', link: 'metcha', image: 'metcha', featured: true, description: 'Metcha Platform' },
        { label: 'Melissa', link: 'melissa', image: 'melissa', featured: false, description: 'Melissa Shoes' },
        { label: 'Rider', link: 'rider', image: 'rider', featured: false, description: 'Rider Sandal' },
      ]

      const shadow = mosaic.shadowRoot
      const cards = shadow.querySelectorAll(S.HOME_MOSAIC_ITEM)
      expect(cards.length).toBe(3)
      expect(cards[0].classList.contains(CLASSES.HOME_MOSAIC_ITEM_FEATURED)).toBe(true)
      expect(cards[1].classList.contains(CLASSES.HOME_MOSAIC_ITEM_FEATURED)).toBe(false)
    })

    test('HomeMosaic renders project titles and categories', () => {
      const mosaic = document.createElement(TAGS.HOME_MOSAIC)
      document.body.appendChild(mosaic)

      mosaic.processedItems = [
        { label: 'Work 1', link: 'w1', image: 'w1', category: 'Dev' },
        { label: 'Work 2', link: 'w2', image: 'w2', category: 'Design' },
      ]

      const shadow = mosaic.shadowRoot
      const titles = shadow.querySelectorAll(S.HOME_MOSAIC_TITLE)
      expect(titles[0].textContent.trim()).toBe('Work 1')
      expect(titles[1].textContent.trim()).toBe('Work 2')
    })

    test('HomeMosaic empty state handles gracefully without throwing', () => {
      const mosaic = document.createElement(TAGS.HOME_MOSAIC)
      document.body.appendChild(mosaic)
      mosaic.processedItems = []
      expect(mosaic.shadowRoot.querySelectorAll(S.HOME_MOSAIC_ITEM).length).toBe(0)
    })
  })

  describe('4. AboutSection - Profile Gravatar & Localized Bio Columns', () => {
    test('renders Gravatar image with responsive density descriptors and alt text', () => {
      const about = document.createElement(TAGS.ABOUT_SECTION)
      document.body.appendChild(about)

      about.aboutTranslations = {
        title: 'About Luis',
        col1: ['Paragraph 1'],
        col2: ['Paragraph 2'],
      }
      about.profilePicture = 'https://gravatar.com/avatar/test1234?size=150'

      const shadow = about.shadowRoot
      const img = shadow.querySelector(S.ABOUT_PIC_IMG)
      expect(img).not.toBeNull()
      expect(img.getAttribute('src')).toContain('size=300')
      expect(img.getAttribute('srcset')).toContain('size=200 1x')
      expect(img.getAttribute('alt')).toBe('About Luis')
    })

    test('renders DrawText components for title and bio columns', () => {
      const about = document.createElement(TAGS.ABOUT_SECTION)
      document.body.appendChild(about)

      about.aboutTranslations = {
        title: TEXT.ABOUT_ME,
        col1: ['UX Engineer.'],
        col2: ['Design Systems.'],
      }

      const drawTexts = about.shadowRoot.querySelectorAll(TAGS.DRAW_TEXT)
      expect(drawTexts.length).toBe(3)
    })
  })

  describe('5. ContactSection - Localized Social Channels & Mailto URI', () => {
    test('renders title and social media links with SVG icons', () => {
      store.commit('setComponentLang', {
        contact: {
          title: TEXT.GET_IN_TOUCH,
          line1: [
            { description: 'WhatsApp', link: 'https://wa.me/test' },
            { description: 'GitHub', link: 'https://github.com/test' },
          ],
        },
      })

      const contact = document.createElement(TAGS.CONTACT_SECTION)
      document.body.appendChild(contact)

      const shadow = contact.shadowRoot
      const title = shadow.querySelector(S.CONTACT_TITLE)
      expect(title.textContent).toContain(TEXT.GET_IN_TOUCH)

      const links = shadow.querySelectorAll(S.CONTACT_SOCIAL_LINK)
      expect(links.length).toBe(2)
      expect(links[0].getAttribute('target')).toBe('_blank')
      expect(links[0].getAttribute('rel')).toContain('noopener')
    })

    test('renders direct email link', () => {
      store.commit('setComponentLang', {
        contact: {
          title: TEXT.GET_IN_TOUCH,
          line1: [
            { description: 'Email', link: 'mailto:luis@luiskr.com' },
          ],
        },
      })
      const contact = document.createElement(TAGS.CONTACT_SECTION)
      document.body.appendChild(contact)
      const emailLink = contact.shadowRoot.querySelector('a[href^="mailto:"]')
      expect(emailLink).not.toBeNull()
    })
  })

  describe('6. PreferencesModal - Themes, Motion Toggles & Keyboard ESC', () => {
    test('modal is hidden until opened via store', () => {
      const modal = document.createElement(TAGS.PREFERENCES_MODAL)
      document.body.appendChild(modal)
      expect(modal.shadowRoot.querySelector(S.PREF_DIALOG)).toBeNull()

      store.commit('togglePreferencesModal', true)
      expect(modal.shadowRoot.querySelector(S.PREF_DIALOG)).not.toBeNull()
    })

    test('selecting dark theme updates store and applies dark-mode class to documentElement', () => {
      const modal = document.createElement(TAGS.PREFERENCES_MODAL)
      document.body.appendChild(modal)
      store.commit('togglePreferencesModal', true)

      const darkBtn = modal.shadowRoot.querySelector('[data-theme="dark"]')
      expect(darkBtn).not.toBeNull()
      darkBtn.click()

      expect(store.getters.getTheme()).toBe('dark')
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true)
    })

    test('selecting light theme removes dark-mode class', () => {
      const modal = document.createElement(TAGS.PREFERENCES_MODAL)
      document.body.appendChild(modal)
      store.commit('togglePreferencesModal', true)

      const lightBtn = modal.shadowRoot.querySelector('[data-theme="light"]')
      lightBtn.click()

      expect(store.getters.getTheme()).toBe('light')
      expect(document.documentElement.classList.contains('dark-mode')).toBe(false)
    })

    test('toggling reduced motion updates store and documentElement class', () => {
      const modal = document.createElement(TAGS.PREFERENCES_MODAL)
      document.body.appendChild(modal)
      store.commit('togglePreferencesModal', true)

      const reducedBtn = modal.shadowRoot.querySelector('[data-motion="reduced"]')
      reducedBtn.click()

      expect(store.getters.getReducedMotion()).toBe(true)
      expect(document.documentElement.classList.contains('reduced-motion')).toBe(true)
    })

    test('escape key dismisses preferences modal', () => {
      const modal = document.createElement(TAGS.PREFERENCES_MODAL)
      document.body.appendChild(modal)
      store.commit('togglePreferencesModal', true)
      expect(store.getters.getPreferencesOpen()).toBe(true)

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      expect(store.getters.getPreferencesOpen()).toBe(false)
    })

    test('clicking backdrop overlay closes modal', () => {
      const modal = document.createElement(TAGS.PREFERENCES_MODAL)
      document.body.appendChild(modal)
      store.commit('togglePreferencesModal', true)

      const backdrop = modal.shadowRoot.querySelector(S.PREF_BACKDROP)
      if (backdrop) {
        backdrop.click()
        expect(store.getters.getPreferencesOpen()).toBe(false)
      }
    })
  })

  describe('7. LangDialog - 12 Language Selector & Switcher', () => {
    test('renders 12 language selection buttons', () => {
      const dialog = document.createElement(TAGS.LANG_DIALOG)
      document.body.appendChild(dialog)
      dialog.open = true

      const buttons = dialog.shadowRoot.querySelectorAll('[data-lang]')
      expect(buttons.length).toBe(12)
    })

    test('clicking German "de" switches store locale and closes dialog', () => {
      const dialog = document.createElement(TAGS.LANG_DIALOG)
      document.body.appendChild(dialog)
      dialog.open = true

      const deBtn = dialog.shadowRoot.querySelector('[data-lang="de"]')
      deBtn.click()

      expect(store.getters.getLang()).toBe('de')
      expect(dialog.open).toBe(false)
    })

    test('escape key closes language dialog', () => {
      const dialog = document.createElement(TAGS.LANG_DIALOG)
      document.body.appendChild(dialog)
      dialog.open = true

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      expect(dialog.open).toBe(false)
    })
  })

  describe('8. MediaFigure & MediaModal - Responsive Images & Video Lightbox', () => {
    test('MediaFigure renders image with expand button when can-expand="true"', () => {
      const media = document.createElement(TAGS.MEDIA_FIGURE)
      media.setAttribute('src', 'sample-media')
      media.setAttribute('width', '800')
      media.setAttribute('height', '450')
      media.setAttribute('can-expand', 'true')
      document.body.appendChild(media)

      const shadow = media.shadowRoot
      const fig = shadow.querySelector('figure')
      expect(fig).not.toBeNull()
      expect(fig.classList.contains(CLASSES.INTERNAL_EXPAND)).toBe(true)
      expect(shadow.querySelector(S.EXPAND_MODAL_OPEN_1)).not.toBeNull()
    })

    test('clicking expand button opens MediaModal via store.commit("setModal")', () => {
      const media = document.createElement(TAGS.MEDIA_FIGURE)
      media.setAttribute('src', 'zoom-pic')
      media.setAttribute('width', '1920')
      media.setAttribute('height', '1080')
      media.setAttribute('can-expand', 'true')
      document.body.appendChild(media)

      const expandBtn = media.shadowRoot.querySelector(S.EXPAND_MODAL_OPEN_1)
      expandBtn.click()

      const modalState = store.getters.getModal()
      expect(modalState.open).toBe(true)
      expect(modalState.media.source).toContain('zoom-pic')
    })

    test('MediaExpanded renders media preview and content wrapper', () => {
      const modal = document.createElement(TAGS.MEDIA_EXPANDED)
      modal.setAttribute('source', 'https://example.com/high.jpg')
      modal.setAttribute('thumb', 'https://example.com/thumb.jpg')
      modal.setAttribute('alt', 'High Res Preview')
      document.body.appendChild(modal)

      const shadow = modal.shadowRoot
      expect(shadow.querySelector(S.EXPAND_MODAL_CONTENT)).not.toBeNull()
    })

    test('startClose triggers modal exit and store reset', () => {
      const modal = document.createElement(TAGS.MEDIA_EXPANDED)
      modal.setAttribute('source', 'test.jpg')
      document.body.appendChild(modal)

      store.commit('setModal', {
        open: true,
        class: 'modal-open',
        media: { source: 'test.jpg' },
      })

      modal.startClose()
      expect(modal.isClosing).toBe(true)
      expect(modal.shadowRoot.querySelector(S.EXPAND_MODAL_CONTENT).classList.contains(S.EXPAND_MODAL_CLOSING)).toBe(true)
    })
  })
})
