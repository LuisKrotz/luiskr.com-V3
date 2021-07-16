import { createStore } from 'vuex'

export default createStore({
  state: {
    storage: "https://storage.googleapis.com/luiskr.com/public/_v2/"
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
