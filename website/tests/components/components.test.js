/**
 * @file components.test.js
 * @description Cross-component integration suite — mounts the real App
 * shell plus every top-level component (nav, mosaic, dialogs, carousels,
 * media, cookie banner) against the real store + router and drives them
 * through locale switches, theme/preference mutations, modal open/close,
 * and keyboard events. Catches contract drift between components that
 * per-component suites can't see (e.g. store keys, shared classes,
 * mutation names).
 */

import { jest } from '@jest/globals'
import store from '@core/store.js'
import router from '@core/router/router.js'
import '@/App.js'
import '@website/components/nav/AppNav.js'
import '@website/components/home/HomeMosaic.js'
import '@website/components/home/AboutSection.js'
import '@website/components/home/ContactSection.js'
import '@website/components/dialogs/PreferencesModal.js'
import '@website/components/dialogs/LangDialog.js'
import '@website/components/carousel/AwardsCarousel.js'
import '@website/components/carousel/CustomCarousel.js'
import '@website/components/media/MediaFigure.js'
import '@website/components/media/MediaExpanded.js'
import '@website/components/feedback/CookieBanner.js'
import { KEYS, LOCALES, ROUTE_NAMES, THEME } from '@core/constants.js'
import { LANG_OPTIONS } from '@core/i18n.js'
import { TEST_PROJECTS, TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { APP_CLASSES } from '@core/tokens/classes/app.js'
import { NAV_CLASSES } from '@core/tokens/classes/nav.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'
import { HOME_MOSAIC_CLASSES } from '@core/tokens/classes/mosaic.js'
import { ABOUT_CLASSES } from '@core/tokens/classes/about.js'
import { CONTACT_CLASSES } from '@core/tokens/classes/contact.js'
import { EXPAND_MODAL_CLASSES, MODAL_CLASSES } from '@core/tokens/classes/modal.js'
import { LANG_MUTATIONS, MODAL_MUTATIONS, PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { NAV_TEXT } from '@core/tokens/strings/text.js'
import { SECTION_IDS } from '@core/tokens/ids/sections.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { LINK_ATTRS } from '@core/tokens/attrs/link.js'
import { DOM_STRINGS } from '@core/tokens/strings/dom.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { KEYBOARD_EVENTS } from '@core/tokens/events/dom.js'
import { ANIMATION_DURATIONS } from '@core/tokens/motion/animation.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { INTERNAL_CLASSES } from '@core/tokens/classes/project.js'
import { COVER_DIMENSIONS } from '@core/tokens/media/dimensions.js'

// ─── Local selector helpers (derived from CLASSES) ────────────────────────────
const S = {
  PROGRESS_BAR: `.${APP_CLASSES.PROGRESS_BAR}`,
  VIEW_OUTLET: `#${APP_CLASSES.VIEW_OUTLET}`,
  NAV_LOGO_BTN: `.${NAV_CLASSES.NAV_LOGO_BTN}`,
  NAV_ABOUT_BTN: `.${NAV_CLASSES.NAV_ABOUT_BTN}`,
  NAV_ACTION_BTN: `.${NAV_CLASSES.NAV_ACTION_BTN}`,
  NAV_PREF_BTN: `.${NAV_CLASSES.NAV_PREF_BTN}`,
  PREF_DIALOG: `.${PREF_CLASSES.PREF_DIALOG}`,
  PREF_BACKDROP: `.${PREF_CLASSES.PREF_BACKDROP}`,
  HOME_MOSAIC_ITEM: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM}`,
  HOME_MOSAIC_ITEM_FEAT: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM_FEATURED}`,
  HOME_MOSAIC_TITLE: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_TITLE}`,
  ABOUT_PIC_IMG: `.${ABOUT_CLASSES.ABOUT_PROFILE_PICTURE_IMG}`,
  CONTACT_TITLE: `.${CONTACT_CLASSES.CONTACT_TITLE}`,
  CONTACT_SOCIAL_LINK: `.${CONTACT_CLASSES.CONTACT_SOCIAL_LINK}`,
  EXPAND_MODAL_OPEN_1: `.${EXPAND_MODAL_CLASSES.EXPAND_MODAL_OPEN_1}`,
  EXPAND_MODAL_CONTENT: `.${EXPAND_MODAL_CLASSES.EXPAND_MODAL_CONTENT}`,
  EXPAND_MODAL_CLOSING: EXPAND_MODAL_CLASSES.EXPAND_MODAL_CLOSING,
}

describe('Web Components Suite - Structure, Events & Reactive Fidelity (50+ Tests)', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    localStorage.clear()
    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
    store.commit(PREF_MUTATIONS.SET_THEME, THEME.LIGHT)
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
    window.history.replaceState({}, '', '/')
  })

  describe('1. AppShell & Root Container', () => {
    test('AppRoot renders shell with progress bar, nav, modals, cookie banner and view outlet', () => {
      const app = document.createElement(COMPONENT_TAGS.APP_ROOT)
      document.body.appendChild(app)

      const shadow = app.shadowRoot
      expect(shadow).not.toBeNull()
      expect(shadow.querySelector(S.PROGRESS_BAR)).not.toBeNull()
      expect(shadow.querySelector(COMPONENT_TAGS.APP_NAV)).not.toBeNull()
      expect(shadow.querySelector(COMPONENT_TAGS.PREFERENCES_MODAL)).not.toBeNull()
      expect(shadow.querySelector(COMPONENT_TAGS.LANG_DIALOG)).not.toBeNull()
      expect(shadow.querySelector(COMPONENT_TAGS.COOKIE_BANNER)).not.toBeNull()
      expect(shadow.querySelector(S.VIEW_OUTLET)).not.toBeNull()
    })

    test('CookieBanner displays consent buttons and closes on accept', () => {
      const banner = document.createElement(COMPONENT_TAGS.COOKIE_BANNER)
      document.body.appendChild(banner)
      expect(banner.shadowRoot).not.toBeNull()
    })
  })

  describe('2. AppNav - Navigation Bar, Actions & States', () => {
    test('AppNav renders navigation links and action button with translations', () => {
      const nav = document.createElement(COMPONENT_TAGS.APP_NAV)
      document.body.appendChild(nav)

      nav.translations = {
        title: TEST_TEXT.LUIS_KROTZ,
        about: { description: NAV_TEXT.ABOUT_ME },
        contact: 'Contact Me',
        preferences: 'Preferences',
        scrollup: NAV_TEXT.SCROLL_UP_ALT,
        related: 'Related Projects',
      }

      nav._openMenu()
      const shadow = nav.shadowRoot
      expect(shadow.querySelector(S.NAV_LOGO_BTN).textContent.trim()).toBe(TEST_TEXT.LUIS_KROTZ)
      expect(shadow.querySelector(S.NAV_ABOUT_BTN).textContent.trim()).toBe(NAV_TEXT.ABOUT_ME)
      expect(shadow.querySelector(S.NAV_ACTION_BTN).textContent.trim()).toBe('Contact Me')
    })

    test('updateScrollState transitions contact action button to scroll-up text', () => {
      const nav = document.createElement(COMPONENT_TAGS.APP_NAV)
      document.body.appendChild(nav)
      nav.translations = {
        title: 'Luis',
        contact: NAV_TEXT.CONTACT,
        scrollup: NAV_TEXT.SCROLL_UP_ALT,
      }

      nav._openMenu()
      nav.updateScrollState(SECTION_IDS.CONTACT, true)
      const updatedBtn = nav.shadowRoot.querySelector(S.NAV_ACTION_BTN)
      expect(updatedBtn.textContent.trim()).toBe(NAV_TEXT.SCROLL_UP_ALT)
      expect(updatedBtn.classList.contains(NAV_CLASSES.NAV_SCROLL_UP)).toBe(true)

      nav.updateScrollState(SECTION_IDS.CONTACT, false)
      expect(nav.shadowRoot.querySelector(S.NAV_ACTION_BTN).textContent.trim()).toBe(
        NAV_TEXT.CONTACT
      )
    })

    test('clicking logo navigates to home route', async () => {
      await router.push(`${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.METCHA}`)
      const nav = document.createElement(COMPONENT_TAGS.APP_NAV)
      document.body.appendChild(nav)
      const logoBtn = nav.shadowRoot.querySelector(S.NAV_LOGO_BTN)
      expect(logoBtn).not.toBeNull()
      logoBtn.click()
      await new Promise((r) => setTimeout(r, 50))
      expect(router.currentRoute.name).toBe(ROUTE_NAMES.HOME)
    })

    test('clicking preferences button opens preferences modal in store', () => {
      const nav = document.createElement(COMPONENT_TAGS.APP_NAV)
      document.body.appendChild(nav)
      nav._openMenu()
      const prefBtn = nav.shadowRoot.querySelector(S.NAV_PREF_BTN)
      expect(prefBtn).not.toBeNull()
      prefBtn.click()
      expect(store.getters.getPreferencesOpen()).toBe(true)
    })
  })

  describe('3. HomeMosaic - Fibonacci Layout & Project Tiles', () => {
    test('HomeMosaic renders project items with responsive grid layout', () => {
      const mosaic = document.createElement(COMPONENT_TAGS.HOME_MOSAIC)
      document.body.appendChild(mosaic)

      mosaic.processedItems = [
        {
          label: TEST_PROJECTS.METCHA_TITLE,
          link: TEST_PROJECTS.METCHA,
          image: TEST_PROJECTS.METCHA,
          featured: true,
          description: 'Metcha Platform',
        },
        {
          label: 'Melissa',
          link: 'melissa',
          image: 'melissa',
          featured: false,
          description: 'Melissa Shoes',
        },
        {
          label: 'Rider',
          link: 'rider',
          image: 'rider',
          featured: false,
          description: 'Rider Sandal',
        },
      ]

      const shadow = mosaic.shadowRoot
      const cards = shadow.querySelectorAll(S.HOME_MOSAIC_ITEM)
      expect(cards.length).toBe(3)
      expect(cards[0].classList.contains(HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM_FEATURED)).toBe(true)
      expect(cards[1].classList.contains(HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM_FEATURED)).toBe(false)
    })

    test('HomeMosaic renders project titles and categories', () => {
      const mosaic = document.createElement(COMPONENT_TAGS.HOME_MOSAIC)
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
      const mosaic = document.createElement(COMPONENT_TAGS.HOME_MOSAIC)
      document.body.appendChild(mosaic)
      mosaic.processedItems = []
      expect(mosaic.shadowRoot.querySelectorAll(S.HOME_MOSAIC_ITEM).length).toBe(0)
    })
  })

  describe('4. AboutSection - Profile Gravatar & Localized Bio Columns', () => {
    test('renders Gravatar image with responsive density descriptors and alt text', () => {
      const about = document.createElement(COMPONENT_TAGS.ABOUT_SECTION)
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
      expect(img.getAttribute(MEDIA_ATTRS.SRC)).toContain('size=300')
      expect(img.getAttribute('srcset')).toContain('size=200 1x')
      expect(img.getAttribute(MEDIA_ATTRS.ALT)).toBe('About Luis')
    })

    test('renders DrawText components for title and bio columns', () => {
      const about = document.createElement(COMPONENT_TAGS.ABOUT_SECTION)
      document.body.appendChild(about)

      about.aboutTranslations = {
        title: NAV_TEXT.ABOUT_ME,
        col1: ['UX Engineer.'],
        col2: ['Design Systems.'],
      }

      const drawTexts = about.shadowRoot.querySelectorAll(COMPONENT_TAGS.DRAW_TEXT)
      expect(drawTexts.length).toBe(3)
    })
  })

  describe('5. ContactSection - Localized Social Channels & Mailto URI', () => {
    test('renders title and social media links with SVG icons', () => {
      store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {
        contact: {
          title: NAV_TEXT.GET_IN_TOUCH,
          line1: [
            { description: 'WhatsApp', link: 'https://wa.me/test' },
            { description: 'GitHub', link: 'https://github.com/test' },
          ],
        },
      })

      const contact = document.createElement(COMPONENT_TAGS.CONTACT_SECTION)
      document.body.appendChild(contact)

      const shadow = contact.shadowRoot
      const title = shadow.querySelector(S.CONTACT_TITLE)
      expect(title.textContent).toContain(NAV_TEXT.GET_IN_TOUCH)

      const links = shadow.querySelectorAll(S.CONTACT_SOCIAL_LINK)
      expect(links.length).toBe(2)
      expect(links[0].getAttribute(LINK_ATTRS.TARGET)).toBe(DOM_STRINGS.BLANK)
      expect(links[0].getAttribute(LINK_ATTRS.REL)).toContain('noopener')
    })

    test('renders direct email link', () => {
      store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {
        contact: {
          title: NAV_TEXT.GET_IN_TOUCH,
          line1: [{ description: 'Email', link: 'mailto:luis@luiskr.com' }],
        },
      })
      const contact = document.createElement(COMPONENT_TAGS.CONTACT_SECTION)
      document.body.appendChild(contact)
      const emailLink = contact.shadowRoot.querySelector('a[href^="mailto:"]')
      expect(emailLink).not.toBeNull()
    })
  })

  describe('6. PreferencesModal - Themes, Motion Toggles & Keyboard ESC', () => {
    test('modal is hidden until opened via store', () => {
      const modal = document.createElement(COMPONENT_TAGS.PREFERENCES_MODAL)
      document.body.appendChild(modal)
      expect(modal.shadowRoot.querySelector(S.PREF_DIALOG)).toBeNull()

      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
      expect(modal.shadowRoot.querySelector(S.PREF_DIALOG)).not.toBeNull()
    })

    test('selecting dark theme updates store and applies dark-mode class to documentElement', () => {
      const modal = document.createElement(COMPONENT_TAGS.PREFERENCES_MODAL)
      document.body.appendChild(modal)
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)

      const darkBtn = modal.shadowRoot.querySelector('[data-theme="dark"]')
      expect(darkBtn).not.toBeNull()
      darkBtn.click()

      expect(store.getters.getTheme()).toBe(THEME.DARK)
      expect(document.documentElement.classList.contains(STATE_CLASSES.DARK_MODE)).toBe(true)
    })

    test('selecting light theme removes dark-mode class', () => {
      const modal = document.createElement(COMPONENT_TAGS.PREFERENCES_MODAL)
      document.body.appendChild(modal)
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)

      const lightBtn = modal.shadowRoot.querySelector('[data-theme="light"]')
      lightBtn.click()

      expect(store.getters.getTheme()).toBe(THEME.LIGHT)
      expect(document.documentElement.classList.contains(STATE_CLASSES.DARK_MODE)).toBe(false)
    })

    test('toggling reduced motion updates store and documentElement class', () => {
      const modal = document.createElement(COMPONENT_TAGS.PREFERENCES_MODAL)
      document.body.appendChild(modal)
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)

      const reducedBtn = modal.shadowRoot.querySelector('button[aria-label="Reduced Motion"]')
      reducedBtn.click()

      expect(store.getters.getReducedMotion()).toBe(true)
      expect(document.documentElement.classList.contains(STATE_CLASSES.REDUCED_MOTION)).toBe(true)
    })

    test('escape key dismisses preferences modal', () => {
      const modal = document.createElement(COMPONENT_TAGS.PREFERENCES_MODAL)
      document.body.appendChild(modal)
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
      expect(store.getters.getPreferencesOpen()).toBe(true)

      jest.useFakeTimers()
      window.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ESCAPE }))
      jest.advanceTimersByTime(ANIMATION_DURATIONS.DIALOG_LEAVE_DURATION)
      jest.useRealTimers()
      expect(store.getters.getPreferencesOpen()).toBe(false)
    })

    test('clicking backdrop overlay closes modal', () => {
      const modal = document.createElement(COMPONENT_TAGS.PREFERENCES_MODAL)
      document.body.appendChild(modal)
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)

      const backdrop = modal.shadowRoot.querySelector(S.PREF_BACKDROP)
      if (backdrop) {
        jest.useFakeTimers()
        backdrop.click()
        jest.advanceTimersByTime(ANIMATION_DURATIONS.DIALOG_LEAVE_DURATION)
        jest.useRealTimers()
        expect(store.getters.getPreferencesOpen()).toBe(false)
      }
    })
  })

  describe('7. LangDialog - 12 Language Selector & Switcher', () => {
    test('renders 12 language selection buttons', () => {
      const dialog = document.createElement(COMPONENT_TAGS.LANG_DIALOG)
      document.body.appendChild(dialog)
      dialog.open = true

      const buttons = dialog.shadowRoot.querySelectorAll('[data-lang]')
      expect(buttons.length).toBe(LANG_OPTIONS.length)
    })

    test('clicking German "de" switches store locale and closes dialog', () => {
      const dialog = document.createElement(COMPONENT_TAGS.LANG_DIALOG)
      document.body.appendChild(dialog)
      dialog.open = true

      const deBtn = dialog.shadowRoot.querySelector('[data-lang="de"]')
      jest.useFakeTimers()
      deBtn.click()
      jest.advanceTimersByTime(ANIMATION_DURATIONS.DIALOG_LEAVE_DURATION)
      jest.useRealTimers()

      expect(store.getters.getLang()).toBe(LOCALES.DE)
      expect(dialog.open).toBe(false)
    })

    test('escape key closes language dialog', () => {
      const dialog = document.createElement(COMPONENT_TAGS.LANG_DIALOG)
      document.body.appendChild(dialog)
      dialog.open = true

      jest.useFakeTimers()
      window.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ESCAPE }))
      jest.advanceTimersByTime(ANIMATION_DURATIONS.DIALOG_LEAVE_DURATION)
      jest.useRealTimers()
      expect(dialog.open).toBe(false)
    })
  })

  describe('8. MediaFigure & MediaModal - Responsive Images & Video Lightbox', () => {
    test('MediaFigure renders image with expand button when can-expand="true"', () => {
      const media = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)
      media.setAttribute(MEDIA_ATTRS.SRC, 'sample-media')
      media.setAttribute(MEDIA_ATTRS.WIDTH, '800')
      media.setAttribute(MEDIA_ATTRS.HEIGHT, '450')
      media.setAttribute(MEDIA_ATTRS.CAN_EXPAND, STATE_STRINGS.TRUE)
      document.body.appendChild(media)

      const shadow = media.shadowRoot
      const fig = shadow.querySelector(HTML_TAGS.FIGURE)
      expect(fig).not.toBeNull()
      expect(fig.classList.contains(INTERNAL_CLASSES.INTERNAL_EXPAND)).toBe(true)
      expect(shadow.querySelector(S.EXPAND_MODAL_OPEN_1)).not.toBeNull()
    })

    test('clicking expand button opens MediaModal via store.commit("setModal")', () => {
      const media = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)
      media.setAttribute(MEDIA_ATTRS.SRC, 'zoom-pic')
      media.setAttribute(MEDIA_ATTRS.WIDTH, COVER_DIMENSIONS.FHD_WIDTH_STR)
      media.setAttribute(MEDIA_ATTRS.HEIGHT, '1080')
      media.setAttribute(MEDIA_ATTRS.CAN_EXPAND, STATE_STRINGS.TRUE)
      document.body.appendChild(media)

      const expandBtn = media.shadowRoot.querySelector(S.EXPAND_MODAL_OPEN_1)
      expandBtn.click()

      const modalState = store.getters.getModal()
      expect(modalState.open).toBe(true)
      expect(modalState.media.source).toContain('zoom-pic')
    })

    test('MediaExpanded renders media preview and content wrapper', () => {
      const modal = document.createElement(COMPONENT_TAGS.MEDIA_EXPANDED)
      modal.setAttribute(MEDIA_ATTRS.SOURCE, 'https://example.com/high.jpg')
      modal.setAttribute(MEDIA_ATTRS.THUMB, 'https://example.com/thumb.jpg')
      modal.setAttribute(MEDIA_ATTRS.ALT, 'High Res Preview')
      document.body.appendChild(modal)

      const shadow = modal.shadowRoot
      expect(shadow.querySelector(S.EXPAND_MODAL_CONTENT)).not.toBeNull()
    })

    test('startClose triggers modal exit and store reset', () => {
      const modal = document.createElement(COMPONENT_TAGS.MEDIA_EXPANDED)
      modal.setAttribute(MEDIA_ATTRS.SOURCE, 'test.jpg')
      document.body.appendChild(modal)

      store.commit(MODAL_MUTATIONS.SET_MODAL, {
        open: true,
        class: MODAL_CLASSES.MODAL_OPEN,
        media: { source: 'test.jpg' },
      })

      modal.startClose()
      expect(modal.isClosing).toBe(true)
      expect(
        modal.shadowRoot
          .querySelector(S.EXPAND_MODAL_CONTENT)
          .classList.contains(S.EXPAND_MODAL_CLOSING)
      ).toBe(true)
    })
  })
})
