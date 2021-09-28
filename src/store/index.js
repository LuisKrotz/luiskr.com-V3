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
    }
  },
  mutations: {
    setModal(state, payload) {
      state.modalObject.transform = payload.transform,
      state.modalObject.class = payload.class,
      state.modalObject.open =  payload.open,
      state.modalObject.media =  payload.media
    }
  },
  getters: {
    getStorage: state => {
      return state.storage;
    },
    getModal: state => {
      return state.modalObject;
    },
  },
  actions: {
  },
  modules: {
  }
})
