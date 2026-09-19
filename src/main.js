import './registerServiceWorker'
import './sass/app.scss'
import router from './core/router.js'
import './core/store.js'
import './App.js'
import './utils/wasm-css.js'

// Initialize client-side router
window.router = router
router.init()

// Mount custom element root
const appContainer = document.getElementById('app')
if (appContainer) {
  appContainer.innerHTML = '<app-root></app-root>'
}


