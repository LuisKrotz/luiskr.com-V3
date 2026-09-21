import './registerServiceWorker'
import './sass/app.scss'
import router from './core/router.js'
import './core/store.js'
import './App.js'
import './utils/wasm-css.js'
import { STRINGS, TAGS } from './core/constants.js'

const isSafari = typeof window !== STRINGS.UNDEFINED && (
  (typeof navigator !== STRINGS.UNDEFINED && navigator.vendor === STRINGS.APPLE_VENDOR) ||
  (STRINGS.GESTURE_EVENT in window) ||
  (typeof CSS !== STRINGS.UNDEFINED && !CSS.supports(STRINGS.CONTAINER_TYPE, STRINGS.INLINE_SIZE))
)

const start = async () => {
  if (isSafari) {
    await import('./safari-loader.js')
  }

  // Initialize client-side router
  window.router = router

  router.init()

  // Mount custom element root
  const appContainer = document.getElementById('app')

  if (appContainer) {
    appContainer.replaceChildren(document.createElement(TAGS.APP_ROOT))
  }
}

start()
