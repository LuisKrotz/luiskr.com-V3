/**
 * @file main.js
 * @description Public-site entry point (modern ESM bundle).
 *
 * Boot order:
 *   1. Side-effect imports — service worker registration, global stylesheet,
 *      router, store, the <app-root> custom element definition, WASM CSS.
 *   2. Parallel warm-up — the locale's data snapshot and the likely route
 *      chunk start fetching before mount, so first paint isn't data-blocked.
 *   3. `start()` — Safari quirk loader (only on Safari/iOS), router init,
 *      idle-time route-chunk warming, then <app-root> insertion into #app.
 *
 * The compat (legacy-browser) variant of this file is the same source; the
 * index.html loader picks modern vs compat by feature detection.
 */

import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { APP_IDS } from '@core/tokens/ids/app.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { QUERY_STRINGS } from '@core/tokens/strings/queries.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { VENDOR_STRINGS } from '@core/tokens/strings/vendor.js'
import './registerServiceWorker.js'
import '@core/sass/components/shell/app.scss'
import router from '@core/router/router.js'
import '@core/store.js'
import './App.js'
import '@core/utils/wasm/wasm-css.js'
import { detectLangFromPath, LANG_SLUGS } from '@core/i18n.js'
import { warmBootstrap } from '@core/utils/data/db.js'
import { startRouteWarming } from '@core/utils/motion/route-warmer.js'
import { initGlobalErrorHandlers } from '@core/utils/notify.js'
import { runDebugActions } from '@core/debug/params.js'

// Warm the critical path in parallel with the rest of the boot: the locale's
// data snapshot and, for home-like routes, the Home view chunk.
if (typeof window !== TYPE_STRINGS.UNDEFINED) {
  const locale = detectLangFromPath(window.location.pathname)

  warmBootstrap(locale)

  const segments = window.location.pathname
    .split(CHAR_STRINGS.SLASH)
    .filter(Boolean)
    .filter((seg) => seg !== locale)

  const slugs = LANG_SLUGS[locale] || LANG_SLUGS.en

  if (!segments.length || segments[0] === slugs.about || segments[0] === slugs.contact) {
    import('@website/views/home/Home.js')
  } else if (segments[0] === ROUTE_PATHS.PORTFOLIO_SEGMENT) {
    import('@website/views/project/Project.js')
  }
}

// Triple-probe Safari detection: vendor string is spoofable, so GestureEvent
// (WebKit-only) and missing container-type support (pre-16 iOS) are fallbacks.
const isSafari =
  typeof window !== TYPE_STRINGS.UNDEFINED &&
  ((typeof navigator !== TYPE_STRINGS.UNDEFINED &&
    navigator.vendor === VENDOR_STRINGS.APPLE_VENDOR) ||
    VENDOR_STRINGS.GESTURE_EVENT in window ||
    (typeof CSS !== TYPE_STRINGS.UNDEFINED &&
      !CSS.supports(QUERY_STRINGS.CONTAINER_TYPE, QUERY_STRINGS.INLINE_SIZE)))

/**
 * Inserts <app-root> into #app if empty. Idempotent — safe to call on a timer
 * while the document finishes parsing.
 * @returns {boolean} true when the root element now exists in the DOM
 */
const mount = () => {
  const appContainer = document.getElementById(APP_IDS.APP)

  if (appContainer && !appContainer.firstElementChild) {
    appContainer.replaceChildren(document.createElement(COMPONENT_TAGS.APP_ROOT))
    return true
  }

  return false
}

/**
 * Async boot sequence: loads Safari-specific workarounds only when needed,
 * starts the router, schedules idle route-chunk warming, and mounts the app
 * root (with a bounded retry loop for slow DOMContentLoaded edge cases).
 */
const start = async () => {
  if (typeof window === TYPE_STRINGS.UNDEFINED) return

  // Uncaught errors/rejections surface as toast (or native) notifications
  initGlobalErrorHandlers()

  // ?debug=… side-effect flags (toast test; webGLMode is read lazily by the
  // canvas choke point and needs no action here)
  runDebugActions()

  if (isSafari) {
    await import('@core/safari/loader.js')
  }

  // Initialize client-side router
  window.router = router

  router.init()

  // After full load, warm the remaining route chunks during idle time so
  // subsequent navigations resolve from the module cache instantly.
  startRouteWarming()

  // Mount custom element root
  if (typeof document !== TYPE_STRINGS.UNDEFINED) {
    if (!mount()) {
      document.addEventListener(WINDOW_EVENTS.DOM_CONTENT_LOADED, mount, { once: true })

      const retryTimer = setInterval(() => {
        if (mount()) {
          clearInterval(retryTimer)
        }
      }, 20)

      setTimeout(() => clearInterval(retryTimer), 3000)
    }
  }
}

/**
 * Boot promise — resolves once the full start sequence (Safari lazy chunk,
 * router init, mount/retry arming) has run. Tests await this so async boot
 * work never continues past a test boundary into a torn-down registry.
 */
export const bootPromise = start()
