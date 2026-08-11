import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueSmoothScroll from 'vue3-smooth-scroll'

const app = createApp(App)

app.config.globalProperties.$sharedData = window.globals

app
  .use(VueSmoothScroll)
  .use(store)
  .use(router)
  .mount('#app')

// Defer analytics initialization until main thread is idle
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    import('./firebase.js').then(({ app: firebaseApp }) => {
      import('firebase/analytics').then(({ getAnalytics }) => getAnalytics(firebaseApp))
    })
  }, { timeout: 4000 })
} else {
  setTimeout(() => {
    import('./firebase.js').then(({ app: firebaseApp }) => {
      import('firebase/analytics').then(({ getAnalytics }) => getAnalytics(firebaseApp))
    })
  }, 4000)
}
