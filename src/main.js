import './registerServiceWorker'
import './sass/app.scss'
import router from './core/router.js'
import './core/store.js'
import './App.js'
import './utils/wasm-css.js'
import { EVENTS, STRINGS, TAGS } from './core/constants.js'

const isSafari = typeof window !== STRINGS.UNDEFINED && (
  (typeof navigator !== STRINGS.UNDEFINED && navigator.vendor === STRINGS.APPLE_VENDOR) ||
  (STRINGS.GESTURE_EVENT in window) ||
  (typeof CSS !== STRINGS.UNDEFINED && !CSS.supports(STRINGS.CONTAINER_TYPE, STRINGS.INLINE_SIZE))
)

const mount = () => {
  const appContainer = document.getElementById('app')

  if (appContainer && !appContainer.firstElementChild) {
    appContainer.replaceChildren(document.createElement(TAGS.APP_ROOT))
    return true
  }

  return false
}

const start = async () => {
  if (isSafari) {
    await import('./safari-loader.js')
  }

  // Initialize client-side router
  window.router = router

  router.init()

  // Mount custom element root
  if (typeof document !== STRINGS.UNDEFINED) {
    if (!mount()) {
      document.addEventListener(EVENTS.DOM_CONTENT_LOADED, mount, { once: true })

      const retryTimer = setInterval(() => {
        if (mount()) {
          clearInterval(retryTimer)
        }
      }, 20)

      setTimeout(() => clearInterval(retryTimer), 3000)
    }
  }
}

start()
