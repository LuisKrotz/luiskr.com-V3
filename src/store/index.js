import { createStore } from 'vuex'

export default createStore({
  state: {
    clickortap:  String,
    defaultSVG: {
      viewBox: "0 0 117.29 122.67",
      polygonPoints: ["58.65 1 0.87 101.08 116.43 101.08 58.65 1", "58.65 22.09 0.87 122.17 116.43 122.17 58.65 22.09"],
      textTransform: "translate(18.28 115.62)"
    },
    has_touch: (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0)),
    lang: {
      components: false,
      database: 'translations/',
      loading: {
        msg1: 'Loading',
        msg2: '...',
        msg3: 'Gathering some data on the server ... Hold on just a second while the Websockets are working!'
      },
      locale: 'en',
      pagesPath: '/pages/',
      projectPath: '/projects/',
    },
    marqueeamount: Number,
    modalObject: {
      transform: 'translateY(0)',
      class: '',
      open: false,
      media: {
        source: '',
        thumb: '',
        alt: '',
        width: 0,
        height: 0,
        isVideo: false
      },
    },
    origin: window.location.origin,
    page: {
      left : 0,
      top: 0
    },
    showhover: false,
    storage: "https://storage.googleapis.com/luiskr.com/public/_v3/"
  },
  mutations: {
    setClear(state) {
      document.body.classList.remove("mouseenter");
      state.showhover = false;
    },
    setClickOrTap(state, payload) {
      state.clickortap = state.has_touch ? payload.tap : payload.click;
    },
    setComponentLang(state, payload) {
      state.lang.components = payload;
    },
    setHover(state, payload) {
      if(!state.has_touch) {
        state.showhover = true;

        document.body.classList.add("mouseenter");
        this.commit('setOnMouseMove', payload);
      }
    },
    setLang(state, payload) {
      state.lang.locale = payload;

      switch (state.lang.locale) {
        case 'br':
          state.lang.loading.msg1 = 'Carregando',
          state.lang.loading.msg2 = 'Trazendo dados do servidor ... Aguarde um momento enquanto os Websockets estão trabalhando!';
        break;
      }
    },
    setMarqueeAmount(state) {
      let width = window.innerWidth,
          height = window.innerHeight;

      switch (window.outerWidth) {
        case width >= 2560:
          state.marqueeamount = Math.ceil(height / 377); 
        break;
        case width >= 1280:
          state.marqueeamount = Math.ceil(height / 144); 
        break;
        case width >= 768:
          state.marqueeamount = Math.ceil(height / 89); 
        break;
        default:
          state.marqueeamount = Math.ceil(height / 144); 
        break;
      }
    },
    setModal(state, payload) {
      state.modalObject.transform = payload.transform,
      state.modalObject.class = payload.class,
      state.modalObject.open =  payload.open,
      state.modalObject.media =  payload.media
    },
    setOnMouseMove(state, payload) {
      state.page.left = payload.pageX - 60;
      state.page.top = payload.pageY - 60;
    }
  },
  getters: {
    getClickOrTap: state => {
      return state.clickortap;
    },
    getHover: state => {
      return state.showhover;
    },
    getlang: state => {
      return state.lang;
    },
    getMarqueeAmount: state => {
      return state.marqueeamount;
    },
    getModal: state => {
      return state.modalObject;
    },
    getOnMouseMove: state => {
      return state.page;
    },
    getStorage: state => {
      return state.storage;
    },
    getSVG: state => {
      return state.defaultSVG;
    },
    getTouch: state => {
      return state.has_touch;
    }
  },
  actions: {
  },
  modules: {
  }
})
