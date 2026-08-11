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

// Defer analytics initialization until user interaction or timeout
function scheduleFirebaseAnalytics() {
  const trigger = () => {
    window.removeEventListener('scroll', trigger)
    window.removeEventListener('touchstart', trigger)
    window.removeEventListener('mousemove', trigger)
    import('./firebase.js').then(({ app: firebaseApp }) => {
      import('firebase/analytics').then(({ getAnalytics }) => getAnalytics(firebaseApp))
    }).catch(() => {})
  }
  window.addEventListener('scroll', trigger, { passive: true, once: true })
  window.addEventListener('touchstart', trigger, { passive: true, once: true })
  window.addEventListener('mousemove', trigger, { passive: true, once: true })
  setTimeout(trigger, 6000)
}

scheduleFirebaseAnalytics()

