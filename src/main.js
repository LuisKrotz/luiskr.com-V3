import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue3-lazyload'

createApp(App)
.use(VueLazyLoad, {log: false})
.use(store)
.use(router).mount('#app')