import { createStore } from 'vuex'

export default createStore({
  state: {
    storage: "https://storage.googleapis.com/luiskr.com/public/_v2/",
    modalObject: {
      transform: 'translateY(0)',
      position: 'relative'
    }
  },
  mutations: {

  },
  getters: {
    getStorage: state => {
      return state.storage;
    }
  },
  actions: {
  },
  modules: {
  }
})
