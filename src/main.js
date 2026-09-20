import './polyfills.js'
import './registerServiceWorker'
import './sass/app.scss'
import router from './core/router.js'
import './core/store.js'
import './App.js'
import './utils/wasm-css.js'

// ── Safari / iOS compatibility CSS ─────────────────────────────────────────
// Loaded only on browsers missing container-type support (iOS < 16, Safari < 16).
// Chrome, Firefox, and modern Safari never download this chunk.
// Vite code-splits the dynamic import — zero overhead for modern browsers.
if (!CSS.supports('container-type', 'inline-size')) {
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
