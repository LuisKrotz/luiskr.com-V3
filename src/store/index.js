import { createStore } from 'vuex'

export default createStore({
  state: {
    storage: "https://storage.googleapis.com/luiskr.com/public/_v2/",
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
      }
    },
    has_touch: (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0)),
    showhover: false,
    page: {
        left : 0,
        top: 0
    }
  },
  mutations: {
    setModal(state, payload) {
      state.modalObject.transform = payload.transform,
      state.modalObject.class = payload.class,
      state.modalObject.open =  payload.open,
      state.modalObject.media =  payload.media
    },
    setOnMouseMove(state, payload) {
      state.page.left = payload.pageX - 60;
      state.page.top = payload.pageY - 60;
    },
    setHover(state, payload) {
      if(!state.has_touch) {
        state.showhover = true;

        document.body.classList.add("mouseenter");
        this.commit('setOnMouseMove', payload);
      }
    },
    setClear(state) {
      document.body.classList.remove("mouseenter");
      state.showhover = false;
    }
  },
  getters: {
    getStorage: state => {
      return state.storage;
    },
    getModal: state => {
      return state.modalObject;
    },
    getOnMouseMove: state => {
      return state.page;
    },
    getHover: state => {
      return state.showhover;
    },
    getTouch: state => {
      return state.has_touch;
    },
  },
  actions: {
  },
  modules: {
  }
})
