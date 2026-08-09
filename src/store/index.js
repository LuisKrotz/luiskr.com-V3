import { createStore } from 'vuex'

export default createStore({
  state: {
    clickortap: '',
    has_touch: 'ontouchstart' in window || navigator.msMaxTouchPoints > 0,
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
  },
  mutations: {
    setClear(state) {
      document.body.classList.remove('mouseenter')
      state.showhover = false
    },
    setClickOrTap(state, payload) {
      state.clickortap = state.has_touch ? payload.tap : payload.click
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
    getMentions: (state) => {
      return state.mentions
    },
    getClickOrTap: (state) => {
      return state.clickortap
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
