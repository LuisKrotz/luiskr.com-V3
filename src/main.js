import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueGtag from 'vue-gtag'
import VueLazyLoad from 'vue3-lazyload'
import VueSmoothScroll from 'vue3-smooth-scroll'

createApp(App)
.use(VueGtag, {config: { id: "UA-142757641-1" }})
.use(VueLazyLoad, {log: false})
.use(VueSmoothScroll)
.use(store)
.use(router).mount('#app')