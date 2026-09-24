import { THEME, STRINGS, ATTRS, URLS, STORAGE_KEYS, CLASSES, TAGS, EVENTS, MEDIA_QUERIES, PATHS, TEXT, LOCALES } from './constants.js'

// Pure Vanilla JS Reactive State Management
export class Store {
  constructor() {
    this.subscribers = new Set()

    this.state = {
      clickortap: ATTRS.EMPTY,
      inputMethod:
        typeof window !== STRINGS.UNDEFINED && STRINGS.ONTOUCHSTART in window && !matchMedia(MEDIA_QUERIES.POINTER_FINE).matches
          ? ATTRS.TOUCH
          : ATTRS.POINTER,
      actionTextMap: { click: TEXT.CLICK_LABEL, tap: TEXT.TAP_LABEL },
      has_touch:
        typeof window !== STRINGS.UNDEFINED && STRINGS.ONTOUCHSTART in window && !matchMedia(MEDIA_QUERIES.POINTER_FINE).matches,
      lang: {
        components: false,
        carousel:   { prev: TEXT.PREV_ITEM, next: TEXT.NEXT_ITEM, ofLabel: TEXT.OF },
        statsHud:   { title: TEXT.PERFORMANCE, fps: TEXT.FPS, memory: TEXT.MEMORY, network: TEXT.NETWORK, latency: TEXT.LATENCY, ai: TEXT.AI_ENGINE },
        database: PATHS.TRANSLATIONS,
        loading: {
          msg1: TEXT.LOADING,
          msg2: TEXT.ELLIPSIS,
          msg3: TEXT.MSG_LOADING_EN_WS,
        },
        locale: (typeof localStorage !== STRINGS.UNDEFINED && localStorage.getItem(STORAGE_KEYS.LOCALE)) || LOCALES.EN,
        pagesPath: PATHS.PAGES,
        projectPath: PATHS.PROJECTS,
      },
      mentions: {
        title: TEXT.SOME_MENTIONS,
        items: null,
      },
      marqueeamount: 0,
      modalObject: {
        transform: 0,
        class: ATTRS.EMPTY,
        open: false,
        media: {
          source: ATTRS.EMPTY,
          thumb: ATTRS.EMPTY,
          alt: ATTRS.EMPTY,
          width: 0,
          height: 0,
          isVideo: false,
        },
      },
      origin: typeof window !== STRINGS.UNDEFINED ? window.location.origin : ATTRS.EMPTY,
      page: {
        left: 0,
        top: 0,
      },
      showhover: false,
      storage: URLS.CDN_BASE,
      reducedMotion:
        typeof localStorage !== STRINGS.UNDEFINED && localStorage.getItem(STORAGE_KEYS.REDUCED_MOTION) !== null
          ? localStorage.getItem(STORAGE_KEYS.REDUCED_MOTION) === ATTRS.TRUE
          : typeof window !== STRINGS.UNDEFINED && window.matchMedia
            ? window.matchMedia(MEDIA_QUERIES.PREFERS_REDUCED_MOTION).matches
            : false,
      theme: (typeof localStorage !== STRINGS.UNDEFINED && localStorage.getItem(STORAGE_KEYS.THEME)) || THEME.SYSTEM,
      showStatsForNerds:
        typeof localStorage !== STRINGS.UNDEFINED && localStorage.getItem(STORAGE_KEYS.STATS_FOR_NERDS) === ATTRS.TRUE,
      showGrid:
        typeof localStorage !== STRINGS.UNDEFINED && localStorage.getItem(STORAGE_KEYS.SHOW_GRID) === ATTRS.TRUE,
      videoAutoplay:
        typeof localStorage !== STRINGS.UNDEFINED
          ? localStorage.getItem(STORAGE_KEYS.VIDEO_AUTOPLAY) !== ATTRS.FALSE
          : true,
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
        const stored = (typeof localStorage !== STRINGS.UNDEFINED && localStorage.getItem(STORAGE_KEYS.THEME)) || THEME.SYSTEM

        this.state.theme = stored

        this.mutations.applyTheme()
      },
      setTheme: (payload) => {
        this.state.theme = payload

        if (typeof localStorage !== STRINGS.UNDEFINED) localStorage.setItem(STORAGE_KEYS.THEME, payload)

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
            window.matchMedia(MEDIA_QUERIES.PREFERS_COLOR_DARK).matches
        }

        this.state.effectiveTheme = isDark ? THEME.DARK : THEME.LIGHT

        if (typeof document !== STRINGS.UNDEFINED) {
          if (isDark) {
            document.documentElement.classList.add(CLASSES.DARK_MODE)
          } else {
            document.documentElement.classList.remove(CLASSES.DARK_MODE)
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
        const stored = typeof localStorage !== STRINGS.UNDEFINED && localStorage.getItem(STORAGE_KEYS.REDUCED_MOTION)

        if (stored !== null) {
          this.state.reducedMotion = stored === ATTRS.TRUE
        }

        if (typeof document !== STRINGS.UNDEFINED) {
          if (this.state.reducedMotion) {
            document.documentElement.classList.add(CLASSES.REDUCED_MOTION)
          } else {
            document.documentElement.classList.remove(CLASSES.REDUCED_MOTION)
          }
        }
      },
      setReducedMotion: (payload) => {
        this.state.reducedMotion = typeof payload === STRINGS.BOOLEAN ? payload : !this.state.reducedMotion

        if (typeof localStorage !== STRINGS.UNDEFINED) {
          localStorage.setItem(STORAGE_KEYS.REDUCED_MOTION, String(this.state.reducedMotion))
        }

        this.mutations.initReducedMotion()
      },
      toggleReducedMotion: () => {
        this.mutations.setReducedMotion(!this.state.reducedMotion)
      },
      toggleStatsForNerds: () => {
        this.state.showStatsForNerds = !this.state.showStatsForNerds

        if (typeof localStorage !== STRINGS.UNDEFINED) {
          localStorage.setItem(STORAGE_KEYS.STATS_FOR_NERDS, String(this.state.showStatsForNerds))
        }

        this.notify()
      },
      toggleShowGrid: () => {
        this.state.showGrid = !this.state.showGrid

        if (typeof localStorage !== STRINGS.UNDEFINED) {
          localStorage.setItem(STORAGE_KEYS.SHOW_GRID, String(this.state.showGrid))
        }

        if (typeof document !== STRINGS.UNDEFINED) {
          document.documentElement.classList.toggle(CLASSES.SHOW_GRID, this.state.showGrid)
        }

        this.notify()
      },
      setVideoAutoplay: (payload) => {
        this.state.videoAutoplay = Boolean(payload)

        if (typeof localStorage !== STRINGS.UNDEFINED) {
          localStorage.setItem(STORAGE_KEYS.VIDEO_AUTOPLAY, String(this.state.videoAutoplay))
        }

        if (!this.state.videoAutoplay && typeof document !== STRINGS.UNDEFINED) {
          const videos = document.querySelectorAll(TAGS.VIDEO)

          videos.forEach((v) => {
            try {
              v.pause()
            } catch {}
          })

          const mediaFigures = document.querySelectorAll(TAGS.MEDIA_FIGURE)

          mediaFigures.forEach((mf) => {
            const vid = mf.shadowRoot?.querySelector(TAGS.VIDEO)

            if (vid) {
              try {
                vid.pause()
              } catch {}
            }
          })

          const mediaExpanded = document.querySelectorAll(TAGS.MEDIA_EXPANDED)

          mediaExpanded.forEach((me) => {
            const vid = me.shadowRoot?.querySelector(TAGS.VIDEO)

            if (vid) {
              try {
                vid.pause()
              } catch {}
            }
          })
        }

        this.notify()
      },
      toggleVideoAutoplay: () => {
        this.mutations.setVideoAutoplay(!this.state.videoAutoplay)
      },
      setInputMethod: (payload) => {
        if (this.state.inputMethod === payload) return false

        this.state.inputMethod = payload

        this.state.has_touch = payload === ATTRS.TOUCH

        this.state.clickortap =
          payload === ATTRS.TOUCH ? this.state.actionTextMap.tap : this.state.actionTextMap.click

        return true
      },
      setClear: () => {
        if (typeof document !== STRINGS.UNDEFINED) document.body.classList.remove(EVENTS.MOUSEENTER)

        this.state.showhover = false
      },
      setClickOrTap: (payload) => {
        if (payload?.click || payload?.tap) {
          this.state.actionTextMap = {
            click: payload.click || this.state.actionTextMap.click,
            tap: payload.tap || this.state.actionTextMap.tap,
          }

          this.state.clickortap =
            this.state.inputMethod === ATTRS.TOUCH
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
      setCarouselLang: (payload) => {
        this.state.lang.carousel = { ...this.state.lang.carousel, ...payload }
      },
      setStatsHudLang: (payload) => {
        this.state.lang.statsHud = { ...this.state.lang.statsHud, ...payload }
      },
      setHover: (payload) => {
        if (!this.state.has_touch) {
          this.state.showhover = true

          if (typeof document !== STRINGS.UNDEFINED) document.body.classList.add(EVENTS.MOUSEENTER)

          this.mutations.setOnMouseMove(payload)
        }
      },
      setLang: (payload) => {
        if (!payload) return

        if (typeof localStorage !== STRINGS.UNDEFINED) localStorage.setItem(STORAGE_KEYS.LOCALE, payload)

        if (this.state.lang.locale === payload && this.state.lang.components) return

        this.state.lang.locale = payload

        this.state.lang.components = false

        this.state.portfoliolist = []

        this.state.mentions = { title: TEXT.SOME_MENTIONS, items: null }

        const msgs = {
          [LOCALES.BR]: {
            msg1: TEXT.CARREGANDO,
            msg2: TEXT.ELLIPSIS,
            msg3: TEXT.MSG_LOADING_BR,
          },
          [LOCALES.ES]: {
            msg1: TEXT.CARGANDO,
            msg2: TEXT.ELLIPSIS,
            msg3: TEXT.MSG_LOADING_ES,
          },
          [LOCALES.DE]: {
            msg1: TEXT.LADT,
            msg2: TEXT.ELLIPSIS,
            msg3: TEXT.MSG_LOADING_DE,
          },
          [LOCALES.EN]: {
            msg1: TEXT.LOADING,
            msg2: TEXT.ELLIPSIS,
            msg3: TEXT.MSG_LOADING_EN,
          },
        }

        Object.assign(this.state.lang.loading, msgs[payload] || msgs[LOCALES.EN])
      },
      setMarqueeAmount: () => {},
      setModal: (payload) => {
        this.state.modalObject.transform = payload.transform

        this.state.modalObject.class = payload.class

        this.state.modalObject.open = payload.open

        this.state.modalObject.media = payload.media

        if (typeof document !== STRINGS.UNDEFINED) {
          const isOpen = Boolean(payload.open || payload.class === CLASSES.MODAL_OPEN)

          document.documentElement.classList.toggle(CLASSES.MODAL_OPEN, isOpen)

          document.body.classList.toggle(CLASSES.MODAL_OPEN, isOpen)
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
      getVideoAutoplay: () => this.state.videoAutoplay,
      getStatsForNerds: () => this.state.showStatsForNerds,
      getShowGrid: () => this.state.showGrid,
      getMentions: () => this.state.mentions,
      getClickOrTap: () =>
        this.state.inputMethod === ATTRS.TOUCH
          ? this.state.actionTextMap.tap
          : this.state.actionTextMap.click,
      getInputMethod: () => this.state.inputMethod,
      getHover: () => this.state.showhover,
      getlang: () => this.state.lang,
      getLang: () => this.state.lang.locale,
      getCarouselLang: () => this.state.lang.carousel,
      getStatsHudLang: () => this.state.lang.statsHud,
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
