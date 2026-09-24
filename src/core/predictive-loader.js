/**
 * @file predictive-loader.js
 * @description Intent-based predictive prefetching engine.
 * Observes navigation links via IntersectionObserver and hover/touch intent
 * to prefetch route components, translation chunks, and resources during idle time
 * without blocking main-thread execution.
 */

import { STRINGS, ATTRS, EVENTS, PATHS, LOCALES, PREFETCH_CONFIG } from './constants.js'
import { fetchFirebaseDb } from '../utils/db.js'
import store from './store.js'

class PredictiveLoader {
  constructor() {
    this.prefetchedRoutes = new Set()

    this.observedLinks = new WeakSet()

    this.observer = null

    this._init()
  }

  _init() {
    if (typeof window === STRINGS.UNDEFINED || typeof IntersectionObserver === STRINGS.UNDEFINED) {
      return
    }

    const schedule = typeof window.requestIdleCallback === STRINGS.FUNCTION
      ? (cb) => window.requestIdleCallback(cb, { timeout: PREFETCH_CONFIG.IDLE_TIMEOUT })
      : (cb) => setTimeout(cb, PREFETCH_CONFIG.FALLBACK_DELAY)

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const link = entry.target

            const href = link.getAttribute(ATTRS.HREF) || link.dataset.route

            if (href) {
              schedule(() => this.prefetchRoute(href))
            }
          }
        })
      },
      { rootMargin: PREFETCH_CONFIG.ROOT_MARGIN, threshold: PREFETCH_CONFIG.THRESHOLD }
    )
  }

  /**
   * Attaches predictive prefetch listeners to a link element.
   * Listens for viewport entrance, mouse hover, focus, and touchstart.
   * @param {Element} element
   */
  observeLink(element) {
    if (!element || this.observedLinks.has(element)) return

    this.observedLinks.add(element)

    if (this.observer) {
      this.observer.observe(element)
    }

    const onIntent = () => {
      const href = element.getAttribute(ATTRS.HREF) || element.dataset.route

      if (href) this.prefetchRoute(href)
    }

    const intentOpts = { once: true, passive: true }

    ;[EVENTS.POINTERENTER, EVENTS.FOCUS, EVENTS.TOUCHSTART].forEach((evt) => {
      element.addEventListener(evt, onIntent, intentOpts)
    })
  }

  /**
   * Scans root for unobserved links and attaches observers.
   * @param {Element|Document|ShadowRoot} root
   */
  scanAndObserve(root = typeof document !== STRINGS.UNDEFINED ? document : null) {
    if (!root) return

    const links = root.querySelectorAll ? root.querySelectorAll(STRINGS.SELECTOR_LINKS) : []

    links.forEach((l) => this.observeLink(l))
  }

  /**
   * Preloads route data, translation chunks, and component definitions.
   * @param {string} routePath
   */
  async prefetchRoute(routePath) {
    if (!routePath || this.prefetchedRoutes.has(routePath)) return

    // Don't prefetch current route or non-internal links
    if (typeof window !== STRINGS.UNDEFINED && window.location.pathname === routePath) return

    if (!routePath.startsWith(PATHS.ROOT)) return

    this.prefetchedRoutes.add(routePath)

    try {
      const lang = store.getters.getlang()

      const locale = lang?.locale || LOCALES.EN

      const match = routePath.match(PREFETCH_CONFIG.PORTFOLIO_REGEX)

      if (match) {
        const slug = match[1]

        const dbpath = `${lang.database || PATHS.TRANSLATIONS}${locale}${PATHS.PROJECTS}${slug}`

        // Fetch into memory/localStorage cache without blocking UI
        fetchFirebaseDb(dbpath).catch(() => {})
      }
    } catch {
      // Graceful fallback
    }
  }
}

export const predictiveLoader = new PredictiveLoader()

