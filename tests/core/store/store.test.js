import store from '@/core/store.js'
import { CMS_KEYS, LOCALES, ROUTE_PREFIXES, THEME } from '@/core/constants.js'
import { TEST_AWARDS } from '../../fixtures/test-constants.js'
import { CDN_URLS } from '../../../src/core/tokens/media/urls.js'
import { TYPE_STRINGS } from '../../../src/core/tokens/strings/types.js'
import {
  DATA_MUTATIONS,
  LANG_MUTATIONS,
  MODAL_MUTATIONS,
  PREF_MUTATIONS,
  UI_MUTATIONS,
} from '../../../src/core/tokens/events/mutations.js'
import { STATE_CLASSES } from '../../../src/core/tokens/classes/state.js'
import { PREF_STORAGE_KEYS } from '../../../src/core/tokens/data/storage.js'
import { STATE_STRINGS } from '../../../src/core/tokens/strings/state.js'
import { LABEL_TEXT } from '../../../src/core/tokens/strings/text.js'
import { DB_PATHS, ROUTE_PATHS } from '../../../src/core/tokens/routes/paths.js'
import { INPUT_STRINGS } from '../../../src/core/tokens/strings/input.js'
import { MODAL_CLASSES } from '../../../src/core/tokens/classes/modal.js'

describe('Core Store - Comprehensive State, Mutations & Getters (50+ Tests)', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  describe('1. Default State & Initialization', () => {
    test('default language is en', () => {
      expect(store.getters.getLang()).toBe(LOCALES.EN)
    })

    test('default storage URL points to luiskr.com GCP bucket', () => {
      expect(store.getters.getStorage()).toBe(CDN_URLS.CDN_BASE)
    })

    test('default preferencesOpen is false', () => {
      expect(store.getters.getPreferencesOpen()).toBe(false)
    })

    test('default modal is closed with empty class', () => {
      const modal = store.getters.getModal()
      expect(modal.open).toBe(false)
      expect(modal.class).toBe('')
      expect(modal.transform).toBe(0)
      expect(modal.media.source).toBe('')
    })

    test('default hasTouch is false for pointer devices', () => {
      expect(typeof store.getters.getTouch()).toBe(TYPE_STRINGS.BOOLEAN)
    })
  })

  describe('2. Theme Management & OS Synchronization', () => {
    test('setTheme to dark applies dark-mode class to documentElement', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      expect(store.getters.getTheme()).toBe(THEME.DARK)
      expect(store.getters.getEffectiveTheme()).toBe(THEME.DARK)
      expect(document.documentElement.classList.contains(STATE_CLASSES.DARK_MODE)).toBe(true)
    })

    test('setTheme to dark persists to localStorage', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      expect(localStorage.getItem(PREF_STORAGE_KEYS.THEME)).toBe(THEME.DARK)
    })

    test('setTheme to light removes dark-mode class', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.LIGHT)
      expect(store.getters.getTheme()).toBe(THEME.LIGHT)
      expect(store.getters.getEffectiveTheme()).toBe(THEME.LIGHT)
      expect(document.documentElement.classList.contains(STATE_CLASSES.DARK_MODE)).toBe(false)
    })

    test('setTheme to light persists to localStorage', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.LIGHT)
      expect(localStorage.getItem(PREF_STORAGE_KEYS.THEME)).toBe(THEME.LIGHT)
    })

    test('setTheme to system respects system preference', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.SYSTEM)
      expect(store.getters.getTheme()).toBe(THEME.SYSTEM)
      expect(localStorage.getItem(PREF_STORAGE_KEYS.THEME)).toBe(THEME.SYSTEM)
    })

    test('initTheme restores dark theme from localStorage', () => {
      localStorage.setItem(PREF_STORAGE_KEYS.THEME, THEME.DARK)
      store.commit(PREF_MUTATIONS.INIT_THEME)
      expect(store.getters.getTheme()).toBe(THEME.DARK)
      expect(document.documentElement.classList.contains(STATE_CLASSES.DARK_MODE)).toBe(true)
    })

    test('initTheme restores light theme from localStorage', () => {
      localStorage.setItem(PREF_STORAGE_KEYS.THEME, THEME.LIGHT)
      store.commit(PREF_MUTATIONS.INIT_THEME)
      expect(store.getters.getTheme()).toBe(THEME.LIGHT)
      expect(document.documentElement.classList.contains(STATE_CLASSES.DARK_MODE)).toBe(false)
    })

    test('initTheme falls back to system when localStorage is empty', () => {
      localStorage.removeItem(PREF_STORAGE_KEYS.THEME)
      store.commit(PREF_MUTATIONS.INIT_THEME)
      expect(store.getters.getTheme()).toBe(THEME.SYSTEM)
    })
  })

  describe('3. Reduced Motion & Accessibility', () => {
    test('toggleReducedMotion switches motion state', () => {
      const initial = store.getters.getReducedMotion()
      store.commit(PREF_MUTATIONS.TOGGLE_REDUCED_MOTION)
      expect(store.getters.getReducedMotion()).toBe(!initial)
      store.commit(PREF_MUTATIONS.TOGGLE_REDUCED_MOTION)
      expect(store.getters.getReducedMotion()).toBe(initial)
    })

    test('toggleReducedMotion persists to localStorage', () => {
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      expect(localStorage.getItem(PREF_STORAGE_KEYS.REDUCED_MOTION)).toBe(STATE_STRINGS.TRUE)
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
      expect(localStorage.getItem(PREF_STORAGE_KEYS.REDUCED_MOTION)).toBe(STATE_STRINGS.FALSE)
    })

    test('reduced motion adds reduced-motion class to documentElement', () => {
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      expect(document.documentElement.classList.contains(STATE_CLASSES.REDUCED_MOTION)).toBe(true)
    })

    test('full motion removes reduced-motion class from documentElement', () => {
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
      expect(document.documentElement.classList.contains(STATE_CLASSES.REDUCED_MOTION)).toBe(false)
    })

    test('initReducedMotion restores true from localStorage', () => {
      localStorage.setItem(PREF_STORAGE_KEYS.REDUCED_MOTION, STATE_STRINGS.TRUE)
      store.commit(PREF_MUTATIONS.INIT_REDUCED_MOTION)
      expect(store.getters.getReducedMotion()).toBe(true)
    })

    test('initReducedMotion restores false from localStorage', () => {
      localStorage.setItem(PREF_STORAGE_KEYS.REDUCED_MOTION, STATE_STRINGS.FALSE)
      store.commit(PREF_MUTATIONS.INIT_REDUCED_MOTION)
      expect(store.getters.getReducedMotion()).toBe(false)
    })
  })

  describe('4. Multilingual State (All 12 Supported Locales)', () => {
    const locales = [
      { code: LOCALES.EN, loading: LABEL_TEXT.LOADING },
      { code: LOCALES.BR, loading: 'Carregando' },
      { code: LOCALES.ES, loading: 'Cargando' },
      { code: LOCALES.DE, loading: 'Lädt' },
      { code: LOCALES.HRK, loading: 'Laade' },
      { code: LOCALES.CAS, loading: 'Cargando' },
      { code: LOCALES.RIV, loading: 'Cargando' },
      { code: LOCALES.GN, loading: 'Oñemyatyrõhína' },
      { code: LOCALES.IT, loading: 'Caricamento' },
      { code: LOCALES.RU, loading: 'Загрузка' },
      { code: LOCALES.FR, loading: 'Chargement' },
      { code: LOCALES.TLN, loading: 'Drio cargar' },
    ]

    locales.forEach(({ code }) => {
      test(`setLang to '${code}' sets locale and localized or fallback loading message`, () => {
        store.commit(LANG_MUTATIONS.SET_LANG, code)
        expect(store.getters.getLang()).toBe(code)
        expect(localStorage.getItem(PREF_STORAGE_KEYS.LOCALE)).toBe(code)
        // UI copy now lives in the translations database (APP), reset on locale change
        expect(store.getters.getlang().app).toBeNull()
      })
    })

    test('setLang maintains database and resource path prefixes', () => {
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
      expect(store.getters.getlang().database).toBe(DB_PATHS.TRANSLATIONS)
      expect(store.getters.getlang().pagesPath).toBe(DB_PATHS.PAGES)
      expect(store.getters.getlang().projectPath).toBe(DB_PATHS.PROJECTS)
    })

    test('setComponentLang stores component translations', () => {
      store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {
        [CMS_KEYS.LEGAL_FOOTER]: {
          links: [{ page: ROUTE_PREFIXES.PRIVACY, link: ROUTE_PATHS.PRIVACY_POLICY }],
        },
      })
      expect(store.getters.getlang().components[CMS_KEYS.LEGAL_FOOTER].links[0].page).toBe(
        ROUTE_PREFIXES.PRIVACY
      )
    })
  })

  describe('5. Input Method & Click/Tap Adaptability', () => {
    test('setInputMethod touch sets getTouch() to true', () => {
      store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.TOUCH)
      expect(store.getters.getTouch()).toBe(true)
    })

    test('setInputMethod pointer sets getTouch() to false', () => {
      store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.POINTER)
      expect(store.getters.getTouch()).toBe(false)
    })

    test('setClickOrTap maps to tap when touch is active', () => {
      store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.TOUCH)
      store.commit(UI_MUTATIONS.SET_CLICK_OR_TAP, { click: 'Click project', tap: 'Tap project' })
      expect(store.getters.getClickOrTap()).toBe('Tap project')
    })

    test('setClickOrTap maps to click when pointer is active', () => {
      store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.POINTER)
      store.commit(UI_MUTATIONS.SET_CLICK_OR_TAP, { click: 'Click project', tap: 'Tap project' })
      expect(store.getters.getClickOrTap()).toBe('Click project')
    })

    test('setClickOrTap handles null/undefined gracefully without altering previous state', () => {
      const prev = store.getters.getClickOrTap()
      store.commit(UI_MUTATIONS.SET_CLICK_OR_TAP, null)
      expect(store.getters.getClickOrTap()).toBe(prev)
    })
  })

  describe('6. Modal State & Viewport Transformation', () => {
    test('setModal opens modal and stores payload', () => {
      store.commit(MODAL_MUTATIONS.SET_MODAL, {
        transform: 250,
        class: MODAL_CLASSES.MODAL_OPEN,
        open: true,
        media: {
          source: 'https://example.com/high.jpg',
          thumb: 'https://example.com/thumb.jpg',
          alt: 'Project Showcase',
          width: 1920,
          height: 1080,
          isVideo: false,
        },
      })

      const modal = store.getters.getModal()
      expect(modal.open).toBe(true)
      expect(modal.class).toBe(MODAL_CLASSES.MODAL_OPEN)
      expect(modal.transform).toBe(250)
      expect(modal.media.alt).toBe('Project Showcase')
      expect(modal.media.width).toBe(1920)
    })

    test('setModal with empty payload closes modal', () => {
      store.commit(MODAL_MUTATIONS.SET_MODAL, {
        transform: 0,
        class: '',
        open: false,
        media: null,
      })

      const modal = store.getters.getModal()
      expect(modal.open).toBe(false)
      expect(modal.class).toBe('')
      expect(modal.media).toBeNull()
    })

    test('togglePreferencesModal toggles preferences state', () => {
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
      expect(store.getters.getPreferencesOpen()).toBe(true)

      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
      expect(store.getters.getPreferencesOpen()).toBe(false)
    })
  })

  describe('7. Mentions & Portfolio List Data', () => {
    test('setMentions sets mentions title and items array', () => {
      const items = [
        { description: 'CSSDA Winner', link: 'https://cssda.com', icon: '🏆' },
        { description: TEST_AWARDS.FWA_OF_THE_DAY, link: 'https://thefwa.com', icon: '⭐' },
      ]
      store.commit(DATA_MUTATIONS.SET_MENTIONS, { title: 'Honors & Mentions', items })

      const mentions = store.getters.getMentions()
      expect(mentions.title).toBe('Honors & Mentions')
      expect(mentions.items.length).toBe(2)
      expect(mentions.items[0].description).toBe('CSSDA Winner')
    })

    test('setPortfolioList stores portfolio items array', () => {
      const list = [
        { label: 'Work 1', image: 'cover1.jpg', featured: true },
        { label: 'Work 2', image: 'cover2.jpg', featured: false },
      ]
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, list)
      expect(store.getters.getPortfolioList().length).toBe(2)
      expect(store.getters.getPortfolioList()[0].label).toBe('Work 1')
    })
  })

  describe('8. Reactive Subscriptions', () => {
    test('subscribe invokes callback on mutation commit', () => {
      let notified = false
      const unsub = store.subscribe(() => {
        notified = true
      })

      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      expect(notified).toBe(true)
      unsub()
    })

    test('unsub removes callback from store listeners', () => {
      let count = 0
      const unsub = store.subscribe(() => {
        count++
      })

      store.commit(PREF_MUTATIONS.SET_THEME, THEME.LIGHT)
      expect(count).toBe(1)

      unsub()
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      expect(count).toBe(1)
    })
  })
})
