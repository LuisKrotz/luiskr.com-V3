/**
 * @file predictive-loader.ts
 * @description Intent-based predictive prefetching engine.
 * Observes navigation links via IntersectionObserver and hover/touch intent
 * to prefetch route components, translation chunks, and resources during idle time
 * without blocking main-thread execution.
 */

import { LINK_ATTRS } from '@/core/tokens/attrs/link.js'
import { FOCUS_EVENTS, POINTER_EVENTS, TOUCH_EVENTS } from '@/core/tokens/events/dom.js'
import { LOCALES } from '@/core/tokens/locales.js'
import { PREFETCH_CONFIG } from '@/core/tokens/motion/prefetch.js'
import { DB_PATHS, ROUTE_PATHS } from '@/core/tokens/routes/paths.js'
import { QUERY_STRINGS } from '@/core/tokens/strings/queries.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { fetchFirebaseDb } from '@/utils/data/db.js'
import store from './store.js'

/**
 * Predictive prefetch engine — makes internal navigation feel instant by
 * warming a link's data before the click lands. Two triggers:
 *  1. IntersectionObserver — a link scrolling within 200px of the viewport
 *     is treated as "user may click soon";
 *  2. intent events — pointerenter/focus/touchstart fire a prefetch
 *     immediately (hover ≈ click intent on desktop).
 * Actual fetches are deferred to idle time so prefetching never competes
 * with the user's current frame work.
 */
class PredictiveLoader {
  private prefetchedRoutes = new Set<string>()
  private observedLinks = new WeakSet<Element>()
  private observer: IntersectionObserver | null = null

  constructor() {
    this._init()
  }

  /**
   * Builds the IntersectionObserver when the APIs exist (SSR/test-safe).
   * The schedule callback prefers requestIdleCallback with a 2s timeout
   * so prefetches run in idle gaps; falls back to a short setTimeout.
   */
  /**
   * Prefers requestIdleCallback (2s timeout) so prefetches run in idle gaps;
   * falls back to a short setTimeout. Evaluated per call so the probe always
   * reflects the live environment.
   */
  private _schedule(cb: () => void): void {
    if (typeof window.requestIdleCallback === TYPE_STRINGS.FUNCTION) {
      window.requestIdleCallback(cb, { timeout: PREFETCH_CONFIG.IDLE_TIMEOUT })
    } else {
      setTimeout(cb, PREFETCH_CONFIG.FALLBACK_DELAY)
    }
  }

  private _init(): void {
    if (
      typeof window === TYPE_STRINGS.UNDEFINED ||
      typeof IntersectionObserver === TYPE_STRINGS.UNDEFINED
    ) {
      return
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLElement

            const href = link.getAttribute(LINK_ATTRS.HREF) || link.dataset.route

            if (href) {
              this._schedule(() => this.prefetchRoute(href))
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
   */
  observeLink(element: Element | null | undefined): void {
    if (!element || this.observedLinks.has(element)) return

    this.observedLinks.add(element)

    if (this.observer) {
      this.observer.observe(element)
    }

    const onIntent = () => {
      const href = element.getAttribute(LINK_ATTRS.HREF) || (element as HTMLElement).dataset.route

      if (href) this.prefetchRoute(href)
    }

    const intentOpts = { once: true, passive: true }

    ;[POINTER_EVENTS.POINTERENTER, FOCUS_EVENTS.FOCUS, TOUCH_EVENTS.TOUCHSTART].forEach((evt) => {
      element.addEventListener(evt, onIntent, intentOpts)
    })
  }

  /**
   * Scans root for unobserved links and attaches observers.
   */
  scanAndObserve(
    root: (Document | ShadowRoot | Element) | null = typeof document !== TYPE_STRINGS.UNDEFINED
      ? document
      : null
  ): void {
    if (!root) return

    const links = root.querySelectorAll
      ? Array.from(root.querySelectorAll(QUERY_STRINGS.SELECTOR_LINKS))
      : []

    links.forEach((l) => this.observeLink(l))
  }

  /**
   * Preloads route data for a given path. Currently only `/portfolio/<slug>`
   * links carry a fetchable payload — the project node is pulled from
   * Firebase into `fetchFirebaseDb`'s memory/session cache, so the actual
   * navigation renders instantly from cache. Other routes are marked
   * prefetched and skipped (their code chunks are warmed by route-warmer).
   * Idempotent per path; skips the current route and external links.
   */
  async prefetchRoute(routePath: string): Promise<void> {
    if (!routePath || this.prefetchedRoutes.has(routePath)) return

    // Don't prefetch current route or non-internal links
    if (typeof window !== TYPE_STRINGS.UNDEFINED && window.location.pathname === routePath) return

    if (!routePath.startsWith(ROUTE_PATHS.ROOT)) return

    this.prefetchedRoutes.add(routePath)

    try {
      const lang = store.getters.getlang() as { locale?: string; database?: string } | undefined

      const locale = lang?.locale || LOCALES.EN

      const match = routePath.match(PREFETCH_CONFIG.PORTFOLIO_REGEX)

      if (match) {
        const slug = match[1]

        const dbpath = `${lang?.database || DB_PATHS.TRANSLATIONS}${locale}${DB_PATHS.PROJECTS}${slug}`

        // Fetch into memory/localStorage cache without blocking UI —
        // fetchFirebaseDb never rejects (it degrades to _snapshot(null)).
        fetchFirebaseDb(dbpath)
      }
    } catch {
      // Graceful fallback
    }
  }
}

/**
 * The predictiveLoader constant.
 */
export const predictiveLoader = new PredictiveLoader()
