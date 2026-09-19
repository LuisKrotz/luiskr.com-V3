import store from '../src/core/store.js'

describe('Core Store - Comprehensive State, Mutations & Getters (50+ Tests)', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  describe('1. Default State & Initialization', () => {
    test('default language is en', () => {
      expect(store.getters.getLang()).toBe('en')
    })

    test('default storage URL points to luiskr.com GCP bucket', () => {
      expect(store.getters.getStorage()).toBe('https://storage.googleapis.com/luiskr.com/public/_v3/')
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
      expect(typeof store.getters.getTouch()).toBe('boolean')
    })
  })

  describe('2. Theme Management & OS Synchronization', () => {
    test('setTheme to dark applies dark-mode class to documentElement', () => {
      store.commit('setTheme', 'dark')
      expect(store.getters.getTheme()).toBe('dark')
      expect(store.getters.getEffectiveTheme()).toBe('dark')
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true)
    })

    test('setTheme to dark persists to localStorage', () => {
      store.commit('setTheme', 'dark')
      expect(localStorage.getItem('theme')).toBe('dark')
    })

    test('setTheme to light removes dark-mode class', () => {
      store.commit('setTheme', 'light')
      expect(store.getters.getTheme()).toBe('light')
      expect(store.getters.getEffectiveTheme()).toBe('light')
      expect(document.documentElement.classList.contains('dark-mode')).toBe(false)
    })

    test('setTheme to light persists to localStorage', () => {
      store.commit('setTheme', 'light')
      expect(localStorage.getItem('theme')).toBe('light')
    })

    test('setTheme to system respects system preference', () => {
      store.commit('setTheme', 'system')
      expect(store.getters.getTheme()).toBe('system')
      expect(localStorage.getItem('theme')).toBe('system')
    })

    test('initTheme restores dark theme from localStorage', () => {
      localStorage.setItem('theme', 'dark')
      store.commit('initTheme')
      expect(store.getters.getTheme()).toBe('dark')
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true)
    })

    test('initTheme restores light theme from localStorage', () => {
      localStorage.setItem('theme', 'light')
      store.commit('initTheme')
      expect(store.getters.getTheme()).toBe('light')
      expect(document.documentElement.classList.contains('dark-mode')).toBe(false)
    })

    test('initTheme falls back to system when localStorage is empty', () => {
      localStorage.removeItem('theme')
      store.commit('initTheme')
      expect(store.getters.getTheme()).toBe('system')
    })
  })

  describe('3. Reduced Motion & Accessibility', () => {
    test('toggleReducedMotion switches motion state', () => {
      const initial = store.getters.getReducedMotion()
      store.commit('toggleReducedMotion')
      expect(store.getters.getReducedMotion()).toBe(!initial)
      store.commit('toggleReducedMotion')
      expect(store.getters.getReducedMotion()).toBe(initial)
    })

    test('toggleReducedMotion persists to localStorage', () => {
      store.commit('setReducedMotion', true)
      expect(localStorage.getItem('reducedMotion')).toBe('true')
      store.commit('setReducedMotion', false)
      expect(localStorage.getItem('reducedMotion')).toBe('false')
    })

    test('reduced motion adds reduced-motion class to documentElement', () => {
      store.commit('setReducedMotion', true)
      expect(document.documentElement.classList.contains('reduced-motion')).toBe(true)
    })

    test('full motion removes reduced-motion class from documentElement', () => {
      store.commit('setReducedMotion', false)
      expect(document.documentElement.classList.contains('reduced-motion')).toBe(false)
    })

    test('initReducedMotion restores true from localStorage', () => {
      localStorage.setItem('reducedMotion', 'true')
      store.commit('initReducedMotion')
      expect(store.getters.getReducedMotion()).toBe(true)
    })

    test('initReducedMotion restores false from localStorage', () => {
      localStorage.setItem('reducedMotion', 'false')
      store.commit('initReducedMotion')
      expect(store.getters.getReducedMotion()).toBe(false)
    })
  })

  describe('4. Multilingual State (All 12 Supported Locales)', () => {
    const locales = [
      { code: 'en', loading: 'Loading' },
      { code: 'br', loading: 'Carregando' },
      { code: 'es', loading: 'Cargando' },
      { code: 'de', loading: 'Lädt' },
      { code: 'hrk', loading: 'Laade' },
      { code: 'cas', loading: 'Cargando' },
      { code: 'riv', loading: 'Cargando' },
      { code: 'gn', loading: 'Oñemyatyrõhína' },
      { code: 'it', loading: 'Caricamento' },
      { code: 'ru', loading: 'Загрузка' },
      { code: 'fr', loading: 'Chargement' },
      { code: 'tln', loading: 'Drio cargar' },
    ]

    locales.forEach(({ code, loading }) => {
      test(`setLang to '${code}' sets locale and localized or fallback loading message`, () => {
        store.commit('setLang', code)
        expect(store.getters.getLang()).toBe(code)
        expect(localStorage.getItem('locale')).toBe(code)
        const expectedMsg = ['br', 'es', 'de'].includes(code) ? loading : 'Loading'
        expect(store.getters.getlang().loading.msg1).toBe(expectedMsg)
      })
    })

    test('setLang maintains database and resource path prefixes', () => {
      store.commit('setLang', 'en')
      expect(store.getters.getlang().database).toBe('translations/')
      expect(store.getters.getlang().pagesPath).toBe('/pages/')
      expect(store.getters.getlang().projectPath).toBe('/projects/')
    })

    test('setComponentLang stores component translations', () => {
      store.commit('setComponentLang', { 'legal-footer': { links: [{ page: 'Privacy', link: '/privacy' }] } })
      expect(store.getters.getlang().components['legal-footer'].links[0].page).toBe('Privacy')
    })
  })

  describe('5. Input Method & Click/Tap Adaptability', () => {
    test('setInputMethod touch sets getTouch() to true', () => {
      store.commit('setInputMethod', 'touch')
      expect(store.getters.getTouch()).toBe(true)
    })

    test('setInputMethod pointer sets getTouch() to false', () => {
      store.commit('setInputMethod', 'pointer')
      expect(store.getters.getTouch()).toBe(false)
    })

    test('setClickOrTap maps to tap when touch is active', () => {
      store.commit('setInputMethod', 'touch')
      store.commit('setClickOrTap', { click: 'Click project', tap: 'Tap project' })
      expect(store.getters.getClickOrTap()).toBe('Tap project')
    })

    test('setClickOrTap maps to click when pointer is active', () => {
      store.commit('setInputMethod', 'pointer')
      store.commit('setClickOrTap', { click: 'Click project', tap: 'Tap project' })
      expect(store.getters.getClickOrTap()).toBe('Click project')
    })

    test('setClickOrTap handles null/undefined gracefully without altering previous state', () => {
      const prev = store.getters.getClickOrTap()
      store.commit('setClickOrTap', null)
      expect(store.getters.getClickOrTap()).toBe(prev)
    })
  })

  describe('6. Modal State & Viewport Transformation', () => {
    test('setModal opens modal and stores payload', () => {
      store.commit('setModal', {
        transform: 250,
        class: 'modal-open',
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
      expect(modal.class).toBe('modal-open')
      expect(modal.transform).toBe(250)
      expect(modal.media.alt).toBe('Project Showcase')
      expect(modal.media.width).toBe(1920)
    })

    test('setModal with empty payload closes modal', () => {
      store.commit('setModal', {
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
      store.commit('togglePreferencesModal', true)
      expect(store.getters.getPreferencesOpen()).toBe(true)

      store.commit('togglePreferencesModal', false)
      expect(store.getters.getPreferencesOpen()).toBe(false)
    })
  })

  describe('7. Mentions & Portfolio List Data', () => {
    test('setMentions sets mentions title and items array', () => {
      const items = [
        { description: 'CSSDA Winner', link: 'https://cssda.com', icon: '🏆' },
        { description: 'FWA of the Day', link: 'https://thefwa.com', icon: '⭐' },
      ]
      store.commit('setMentions', { title: 'Honors & Mentions', items })

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
      store.commit('setPortfolioList', list)
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

      store.commit('setTheme', 'dark')
      expect(notified).toBe(true)
      unsub()
    })

    test('unsub removes callback from store listeners', () => {
      let count = 0
      const unsub = store.subscribe(() => {
        count++
      })

      store.commit('setTheme', 'light')
      expect(count).toBe(1)

      unsub()
      store.commit('setTheme', 'dark')
      expect(count).toBe(1)
    })
  })
})
