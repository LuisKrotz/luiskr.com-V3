import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue3-lazyload'
import VueSmoothScroll from 'vue3-smooth-scroll'

createApp(App)
.use(VueLazyLoad, {})
.use(VueSmoothScroll)
.use(store)
.use(router).mount('#app')