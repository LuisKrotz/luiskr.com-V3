import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueSmoothScroll from 'vue3-smooth-scroll'
import { app as firebaseApp } from './firebase.js'
import { getAnalytics } from 'firebase/analytics'

getAnalytics(firebaseApp)

const app = createApp(App)

app.config.globalProperties.$sharedData = window.globals

app
  .use(VueSmoothScroll)
  .use(store)

  .use(router)
  .mount('#app')
