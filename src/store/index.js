import { createStore } from 'vuex'

export default createStore({
  state: {
    clickortap:  String,
    has_touch: (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0)),
    lang: {
      folder: '/translations/',
      locale: 'en',
      prefix: '',
      suffix: '.json'
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
    setHover(state, payload) {
      if(!state.has_touch) {
        state.showhover = true;

        document.body.classList.add("mouseenter");
        this.commit('setOnMouseMove', payload);
      }
    },
    setLang(state, payload) {
      state.lang.locale = payload;
      state.lang.prefix = state.origin + state.lang.folder + payload;
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
    getTouch: state => {
      return state.has_touch;
    }
  },
  actions: {
  },
  modules: {
  }
})
