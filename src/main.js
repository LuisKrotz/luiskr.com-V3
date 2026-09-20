import './polyfills.js'
import './registerServiceWorker'
import './sass/app.scss'
import router from './core/router.js'
import './core/store.js'
import './App.js'
import './utils/wasm-css.js'

const isWebKit = typeof navigator !== 'undefined' && (
  navigator.vendor === 'Apple Computer, Inc.' ||
  /iPad|iPhone|iPod/.test(navigator.userAgent || '')
)

// ── Safari / iOS compatibility bundle ──────────────────────────────────────
// Loaded only on Safari / WebKit or browsers missing container-type support.
// Chrome, Firefox, and Android never download or execute this chunk.
// Vite code-splits the dynamic import — zero overhead for modern non-Safari browsers.
if (isWebKit || !CSS.supports('container-type', 'inline-size')) {
  import('./safari-loader.js')
}

// Initialize client-side router
window.router = router
router.init()

// Mount custom element root
const appContainer = document.getElementById('app')
if (appContainer) {
  appContainer.innerHTML = '<app-root></app-root>'
}
