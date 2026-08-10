import { createStore } from 'vuex'

export default createStore({
  state: {
    clickortap: '',
    inputMethod: 'ontouchstart' in window && !matchMedia('(pointer: fine)').matches ? 'touch' : 'pointer',
    actionTextMap: { click: 'Click', tap: 'Tap' },
    has_touch: 'ontouchstart' in window && !matchMedia('(pointer: fine)').matches,
    lang: {
      components: false,
      database: 'translations/',
      loading: {
        msg1: 'Loading',
        msg2: '...',
        msg3: 'Gathering some data on the server ... Hold on just a second while the Websockets are working!',
      },
      locale: 'en',
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
    origin: window.location.origin,
    page: {
      left: 0,
      top: 0,
    },
    showhover: false,
    storage: 'https://storage.googleapis.com/luiskr.com/public/_v3/',
    reducedMotion:
      localStorage.getItem('reducedMotion') !== null
        ? localStorage.getItem('reducedMotion') === 'true'
        : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    theme: localStorage.getItem('theme') || 'system', // 'system' | 'dark' | 'light'
    effectiveTheme: 'light',
    preferencesOpen: false,
  },
  mutations: {
    initTheme(state) {
      const stored = localStorage.getItem('theme') || 'system'
      state.theme = stored
      this.commit('applyTheme')
    },
    setTheme(state, payload) {
      state.theme = payload
      localStorage.setItem('theme', payload)
      this.commit('applyTheme')
    },
    applyTheme(state) {
      let isDark = false
      if (state.theme === 'dark') {
        isDark = true
      } else if (state.theme === 'light') {
        isDark = false
      } else {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      state.effectiveTheme = isDark ? 'dark' : 'light'
      if (isDark) {
        document.documentElement.classList.add('dark-mode')
      } else {
        document.documentElement.classList.remove('dark-mode')
      }
    },
    togglePreferencesModal(state, open) {
      state.preferencesOpen = typeof open === 'boolean' ? open : !state.preferencesOpen
    },
    initReducedMotion(state) {
      if (state.reducedMotion) {
        document.documentElement.classList.add('reduced-motion')
      } else {
        document.documentElement.classList.remove('reduced-motion')
      }
    },
    toggleReducedMotion(state) {
      state.reducedMotion = !state.reducedMotion
      localStorage.setItem('reducedMotion', state.reducedMotion)
      if (state.reducedMotion) {
        document.documentElement.classList.add('reduced-motion')
      } else {
        document.documentElement.classList.remove('reduced-motion')
      }
    },
    setInputMethod(state, payload) {
      if (state.inputMethod !== payload) {
        state.inputMethod = payload
        state.has_touch = payload === 'touch'
        state.clickortap = payload === 'touch' ? state.actionTextMap.tap : state.actionTextMap.click
      }
    },
    setClear(state) {
      document.body.classList.remove('mouseenter')
      state.showhover = false
    },
    setClickOrTap(state, payload) {
      if (payload?.click || payload?.tap) {
        state.actionTextMap = {
          click: payload.click || state.actionTextMap.click,
          tap: payload.tap || state.actionTextMap.tap,
        }
        state.clickortap = state.inputMethod === 'touch' ? state.actionTextMap.tap : state.actionTextMap.click
      }
    },
    setMentions(state, payload) {
      state.mentions.title = payload.title ?? state.mentions.title
      state.mentions.items = payload.items
    },
    setComponentLang(state, payload) {
      state.lang.components = payload
    },
    setHover(state, payload) {
      if (!state.has_touch) {
        state.showhover = true

        document.body.classList.add('mouseenter')
        this.commit('setOnMouseMove', payload)
      }
    },
    setLang(state, payload) {
      state.lang.locale = payload

      switch (state.lang.locale) {
        case 'br':
          ;((state.lang.loading.msg1 = 'Carregando'),
            (state.lang.loading.msg2 =
              'Trazendo dados do servidor ... Aguarde um momento enquanto os Websockets estão trabalhando!'))
          break
      }
    },
    setMarqueeAmount() {},
    setModal(state, payload) {
      ;((state.modalObject.transform = payload.transform),
        (state.modalObject.class = payload.class),
        (state.modalObject.open = payload.open),
        (state.modalObject.media = payload.media))
    },
    setOnMouseMove(state, payload) {
      state.page.left = payload.pageX - 60
      state.page.top = payload.pageY - 60
    },
  },
  getters: {
    getTheme: (state) => state.theme,
    getEffectiveTheme: (state) => state.effectiveTheme,
    getPreferencesOpen: (state) => state.preferencesOpen,
    getReducedMotion: (state) => {
      return state.reducedMotion
    },
    getMentions: (state) => {
      return state.mentions
    },
    getClickOrTap: (state) => {
      return state.inputMethod === 'touch' ? state.actionTextMap.tap : state.actionTextMap.click
    },
    getInputMethod: (state) => {
      return state.inputMethod
    },
    getHover: (state) => {
      return state.showhover
    },
    getlang: (state) => {
      return state.lang
    },
    getMarqueeAmount: () => 0,
    getModal: (state) => {
      return state.modalObject
    },
    getOnMouseMove: (state) => {
      return state.page
    },
    getStorage: (state) => {
      return state.storage
    },
    getTouch: (state) => {
      return state.has_touch
    },
  },
  actions: {},
  modules: {},
})
