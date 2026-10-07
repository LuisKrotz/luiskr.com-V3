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
  /** Paths already warmed — Set so the dedupe check is O(1) per intent fire. */
  private prefetchedRoutes = new Set<string>()

  /**
   * Links already instrumented. WeakSet (not Set) deliberately holds no
   * strong refs — a link removed by a route swap can be GC'd without
   * unregistering, preventing the observer bookkeeping itself from leaking.
   */
  private observedLinks = new WeakSet<Element>()

  /** Lazily-built IntersectionObserver; stays null where the API is absent. */
  private observer: IntersectionObserver | null = null

  constructor() {
    this._init()
  }

  /**
   * Prefers requestIdleCallback (2s timeout) so prefetches run in idle gaps;
   * falls back to a short setTimeout. Evaluated per call so the probe always
   * reflects the live environment. The timeout bound guarantees the prefetch
   * still fires within ~2s even on a continuously busy main thread — without
   * it requestIdleCallback may starve indefinitely.
   * @param cb Work to run in the next idle gap.
   */
  private _schedule(cb: () => void): void {
    if (typeof window.requestIdleCallback === TYPE_STRINGS.FUNCTION) {
      window.requestIdleCallback(cb, { timeout: PREFETCH_CONFIG.IDLE_TIMEOUT })
    } else {
      setTimeout(cb, PREFETCH_CONFIG.FALLBACK_DELAY)
    }
  }

  /**
   * Builds the viewport-entrance observer; skips entirely where window or
   * IntersectionObserver is absent (SSR / minimal test DOMs).
   */
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
   * `once: true` auto-removes each intent listener after the first fire — a
   * link is prefetched at most once, so the listener is dead weight after
   * that. `passive: true` keeps touch/wheel-adjacent handlers off the
   * scroll-blocking path per MDN passive-listener semantics.
   * @param element Anchor-like element carrying href or data-route.
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
   * Scans root for unobserved links and attaches observers. Runs against a
   * Document, a ShadowRoot, or any Element — the querySelectorAll presence
   * check is what makes all three shapes safe.
   * @param root Scope to scan; defaults to document when present.
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

    // Mark before the async work — a duplicate intent firing mid-flight must
    // see the path as already claimed, not kick off a second fetch.
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
 * App-wide singleton — constructed at module eval so observation starts as
 * soon as the bootstrap imports it; the constructor's env guards make that
 * safe in SSR/test contexts.
 */
export const predictiveLoader = new PredictiveLoader()
