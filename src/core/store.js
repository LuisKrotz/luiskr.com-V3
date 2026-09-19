import { THEME, STRINGS, ATTRS, URLS } from './constants.js'

// Pure Vanilla JS Reactive State Management
class Store {
  constructor() {
    this.subscribers = new Set()

    this.state = {
      clickortap: '',
      inputMethod:
        typeof window !== STRINGS.UNDEFINED && 'ontouchstart' in window && !matchMedia('(pointer: fine)').matches
          ? 'touch'
          : 'pointer',
      actionTextMap: { click: 'Click', tap: 'Tap' },
      has_touch:
        typeof window !== STRINGS.UNDEFINED && 'ontouchstart' in window && !matchMedia('(pointer: fine)').matches,
      lang: {
        components: false,
        database: 'translations/',
        loading: {
          msg1: 'Loading',
          msg2: '...',
          msg3: 'Gathering some data on the server ... Hold on just a second while the Websockets are working!',
        },
        locale: (typeof localStorage !== STRINGS.UNDEFINED && localStorage.getItem('locale')) || 'en',
        pagesPath: '/pages/',
        projectPath: '/projects/',
      },
      mentions: {
        title: 'Some mentions',
        items: null,
      },
      marqueeamount: 0,
      modalObject: {
        transform: 0,
        class: '',
        open: false,
        media: {
          source: '',
          thumb: '',
          alt: '',
          width: 0,
          height: 0,
          isVideo: false,
        },
      },
      origin: typeof window !== STRINGS.UNDEFINED ? window.location.origin : '',
      page: {
        left: 0,
        top: 0,
      },
      showhover: false,
      storage: URLS.CDN_BASE,
      reducedMotion:
        typeof localStorage !== STRINGS.UNDEFINED && localStorage.getItem('reducedMotion') !== null
          ? localStorage.getItem('reducedMotion') === ATTRS.TRUE
          : typeof window !== STRINGS.UNDEFINED && window.matchMedia
            ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
            : false,
      theme: (typeof localStorage !== STRINGS.UNDEFINED && localStorage.getItem('theme')) || THEME.SYSTEM,
      showStatsForNerds:
        typeof localStorage !== STRINGS.UNDEFINED && localStorage.getItem('statsForNerds') === ATTRS.TRUE,
      showGrid:
        typeof localStorage !== STRINGS.UNDEFINED && localStorage.getItem('showGrid') === ATTRS.TRUE,
      effectiveTheme: THEME.LIGHT,
      preferencesOpen: false,
      langDialogOpen: false,
      portfoliolist: [],
    }

    this.mutations = {
      setPortfolioList: (payload) => {
        if (Array.isArray(payload)) {
          this.state.portfoliolist = payload
        } else if (payload && typeof payload === STRINGS.OBJECT) {
          this.state.portfoliolist = Object.values(payload)
        }
      },
      initTheme: () => {
        const stored = (typeof localStorage !== STRINGS.UNDEFINED && localStorage.getItem('theme')) || THEME.SYSTEM
        this.state.theme = stored
        this.mutations.applyTheme()
      },
      setTheme: (payload) => {
        this.state.theme = payload
        if (typeof localStorage !== STRINGS.UNDEFINED) localStorage.setItem('theme', payload)
        this.mutations.applyTheme()
      },
      applyTheme: () => {
        let isDark
        if (this.state.theme === THEME.DARK) {
          isDark = true
        } else if (this.state.theme === THEME.LIGHT) {
          isDark = false
        } else {
          isDark =
            typeof window !== STRINGS.UNDEFINED &&
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        this.state.effectiveTheme = isDark ? THEME.DARK : THEME.LIGHT
        if (typeof document !== STRINGS.UNDEFINED) {
          if (isDark) {
            document.documentElement.classList.add('dark-mode')
          } else {
            document.documentElement.classList.remove('dark-mode')
          }
        }
      },
      togglePreferencesModal: (open) => {
        this.state.preferencesOpen =
          typeof open === STRINGS.BOOLEAN ? open : !this.state.preferencesOpen
      },
      toggleLangDialog: (open) => {
        this.state.langDialogOpen =
          typeof open === STRINGS.BOOLEAN ? open : !this.state.langDialogOpen
      },
      initReducedMotion: () => {
        const stored = typeof localStorage !== STRINGS.UNDEFINED && localStorage.getItem('reducedMotion')
        if (stored !== null) {
          this.state.reducedMotion = stored === ATTRS.TRUE
        }
        if (typeof document !== STRINGS.UNDEFINED) {
          if (this.state.reducedMotion) {
            document.documentElement.classList.add('reduced-motion')
          } else {
            document.documentElement.classList.remove('reduced-motion')
          }
        }
      },
      setReducedMotion: (payload) => {
        this.state.reducedMotion = typeof payload === STRINGS.BOOLEAN ? payload : !this.state.reducedMotion
        if (typeof localStorage !== STRINGS.UNDEFINED) {
          localStorage.setItem('reducedMotion', String(this.state.reducedMotion))
        }
        this.mutations.initReducedMotion()
      },
      toggleReducedMotion: () => {
        this.mutations.setReducedMotion(!this.state.reducedMotion)
      },
      toggleStatsForNerds: () => {
        this.state.showStatsForNerds = !this.state.showStatsForNerds

        if (typeof localStorage !== STRINGS.UNDEFINED) {
          localStorage.setItem('statsForNerds', String(this.state.showStatsForNerds))
        }

        this._notify()
      },
      toggleShowGrid: () => {
        this.state.showGrid = !this.state.showGrid

        if (typeof localStorage !== STRINGS.UNDEFINED) {
          localStorage.setItem('showGrid', String(this.state.showGrid))
        }

        if (typeof document !== STRINGS.UNDEFINED) {
          document.documentElement.classList.toggle('show-grid', this.state.showGrid)
        }

        this._notify()
      },
      setInputMethod: (payload) => {
        if (this.state.inputMethod === payload) return false
        this.state.inputMethod = payload
        this.state.has_touch = payload === 'touch'
        this.state.clickortap =
          payload === 'touch' ? this.state.actionTextMap.tap : this.state.actionTextMap.click
        return true
      },
      setClear: () => {
        if (typeof document !== STRINGS.UNDEFINED) document.body.classList.remove('mouseenter')
        this.state.showhover = false
      },
      setClickOrTap: (payload) => {
        if (payload?.click || payload?.tap) {
          this.state.actionTextMap = {
            click: payload.click || this.state.actionTextMap.click,
            tap: payload.tap || this.state.actionTextMap.tap,
          }
          this.state.clickortap =
            this.state.inputMethod === 'touch'
              ? this.state.actionTextMap.tap
              : this.state.actionTextMap.click
        }
      },
      setMentions: (payload) => {
        this.state.mentions.title = payload.title ?? this.state.mentions.title
        this.state.mentions.items = payload.items
      },
      setComponentLang: (payload) => {
        this.state.lang.components = payload
      },
      setHover: (payload) => {
        if (!this.state.has_touch) {
          this.state.showhover = true
          if (typeof document !== STRINGS.UNDEFINED) document.body.classList.add('mouseenter')
          this.mutations.setOnMouseMove(payload)
        }
      },
      setLang: (payload) => {
        if (!payload) return
        if (typeof localStorage !== STRINGS.UNDEFINED) localStorage.setItem('locale', payload)
        if (this.state.lang.locale === payload && this.state.lang.components) return
        this.state.lang.locale = payload

        this.state.lang.components = false
        this.state.portfoliolist = []
        this.state.mentions = { title: 'Some mentions', items: null }

        const msgs = {
          br: {
            msg1: 'Carregando',
            msg2: '...',
            msg3: 'Buscando dados no servidor… Aguarde um momento!',
          },
          es: { msg1: 'Cargando', msg2: '...', msg3: '¡Obteniendo datos del servidor… Un momento!' },
          de: { msg1: 'Lädt', msg2: '...', msg3: 'Daten werden abgerufen… Bitte warten!' },
          en: {
            msg1: 'Loading',
            msg2: '...',
            msg3: 'Gathering some data on the server … Hold on just a second!',
          },
        }
        Object.assign(this.state.lang.loading, msgs[payload] || msgs.en)
      },
      setMarqueeAmount: () => {},
      setModal: (payload) => {
        this.state.modalObject.transform = payload.transform
        this.state.modalObject.class = payload.class
        this.state.modalObject.open = payload.open
        this.state.modalObject.media = payload.media

        if (typeof document !== STRINGS.UNDEFINED) {
          const isOpen = !!payload.open || payload.class === 'modal-open'
          document.documentElement.classList.toggle('modal-open', isOpen)
          document.body.classList.toggle('modal-open', isOpen)
        }
      },
      setOnMouseMove: (payload) => {
        this.state.page.left = (payload?.pageX || 0) - 60
        this.state.page.top = (payload?.pageY || 0) - 60
      },
    }

    this.getters = {
      getTheme: () => this.state.theme,
      getEffectiveTheme: () => this.state.effectiveTheme,
      getPreferencesOpen: () => this.state.preferencesOpen,
      getLangDialogOpen: () => this.state.langDialogOpen,
      getReducedMotion: () => this.state.reducedMotion,
      getStatsForNerds: () => this.state.showStatsForNerds,
      getShowGrid: () => this.state.showGrid,
      getMentions: () => this.state.mentions,
      getClickOrTap: () =>
        this.state.inputMethod === 'touch'
          ? this.state.actionTextMap.tap
          : this.state.actionTextMap.click,
      getInputMethod: () => this.state.inputMethod,
      getHover: () => this.state.showhover,
      getlang: () => this.state.lang,
      getLang: () => this.state.lang.locale,
      getMarqueeAmount: () => 0,
      getModal: () => this.state.modalObject,
      getOnMouseMove: () => this.state.page,
      getStorage: () => this.state.storage,
      getTouch: () => this.state.has_touch,
      getPortfolioList: () => this.state.portfoliolist,
      getPortfoliolist: () => this.state.portfoliolist,
    }
  }

  commit(mutationName, payload) {
    if (this.mutations[mutationName]) {
      const res = this.mutations[mutationName](payload)
      if (res !== false) {
        this.notify()
      }
    } else {
      console.warn(`[Store] Unknown mutation: ${mutationName}`)
    }
  }

  subscribe(listener) {
    this.subscribers.add(listener)
    return () => this.subscribers.delete(listener)
  }

  notify() {
    for (const sub of this.subscribers) {
      try {
        sub(this.state)
      } catch (err) {
        console.error('[Store] Subscriber error:', err)
      }
    }
  }
}

export const store = new Store()
export default store
