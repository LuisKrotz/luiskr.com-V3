import './polyfills.js'
import './registerServiceWorker'
import './sass/app.scss'
import router from './core/router.js'
import './core/store.js'
import './App.js'
import './utils/wasm-css.js'

const isSafari = typeof window !== 'undefined' && (
  (typeof navigator !== 'undefined' && navigator.vendor === 'Apple Computer, Inc.') ||
  ('GestureEvent' in window) ||
  (typeof CSS !== 'undefined' && !CSS.supports('container-type', 'inline-size'))
)

async function start() {
  if (isSafari) {
    await import('./safari-loader.js')
  }

  // Initialize client-side router
  window.router = router
  router.init()

  // Mount custom element root
  const appContainer = document.getElementById('app')
  if (appContainer) {
    appContainer.innerHTML = '<app-root></app-root>'
  }
}

start()
