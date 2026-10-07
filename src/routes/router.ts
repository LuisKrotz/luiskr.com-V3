/**
 * @file router.js
 * @description History-API SPA router for the public site.
 *
 * Route resolution lives in ./parse-path.ts; the navigation pipeline
 * (hooks → history → title/canonical → scroll → notify) lives in
 * ./navigate.ts. This facade holds the mutable state (currentRoute,
 * hooks, subscribers) and the public API.
 */

import { WINDOW_EVENTS } from '@/core/tokens/events/dom.js'
import { LANG_MUTATIONS } from '@/core/tokens/events/mutations.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import store from '@/core/store.js'
import { detectLangFromPath } from '@/core/i18n.js'
import { normalizeProjectKey, parsePath } from './parse-path.js'
import { handleNavigation } from './navigate.js'
import type { NavHook, RouteDescriptor, RouteListener, RouteMeta } from './types.js'
import { devError } from '@/core/devlog.js'

export { normalizeProjectKey }
export type { NavHook, RouteDescriptor, RouteListener, RouteMeta }

/**
 * History-API router: parses paths into route descriptors, runs before/after
 * hooks, updates history + title + canonical + scroll, and notifies
 * subscribers (<app-root> swaps the view element on notification).
 */
export class Router {
  /** Static route table — unused; resolution is imperative in parsePath. */
  routes: RouteDescriptor[] = []

  /** Last resolved route descriptor {name, view, lang, path, meta, params}. */
  currentRoute: RouteDescriptor | null = null

  /** Subscriber callbacks fired by notify() on every successful nav. */
  listeners = new Set<RouteListener>()

  /** Navigation guards; each may return a redirect path/{path}. */
  beforeHooks: NavHook[] = []

  /** Post-nav side-effect hooks (run after history+title are updated). */
  afterHooks: NavHook[] = []

  constructor() {
    this._initPopstateListener()
  }

  /**
   * Wires the browser Back/Forward buttons into handleNavigation — popstate
   * fires only on traversal, so programmatic pushState/replaceState don't
   * double-trigger navigation. No-op under SSR.
   */
  private _initPopstateListener(): void {
    if (typeof window === TYPE_STRINGS.UNDEFINED) return

    window.addEventListener(WINDOW_EVENTS.POPSTATE, () => {
      this.handleNavigation(
        window.location.pathname + window.location.search + window.location.hash
      )
    })
  }

  /** Registers a navigation guard; a hook may return a redirect path/object. */
  beforeEach(fn: NavHook): void {
    this.beforeHooks.push(fn)
  }

  /** Registers a post-navigation hook (analytics, side effects). */
  afterEach(fn: NavHook): void {
    this.afterHooks.push(fn)
  }

  /**
   * Subscribes a listener to route changes.
   * @param listener Callback receiving (to, from) descriptors.
   * @returns unsubscribe function
   */
  subscribe(listener: RouteListener): () => void {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Fans the route change out to subscribers; each call is wrapped so one
   * throwing listener can't break the rest (logged via devError).
   * @param to Destination descriptor.
   * @param from Origin descriptor — null on first navigation.
   */
  notify(to: RouteDescriptor, from: RouteDescriptor | null): void {
    for (const listener of this.listeners) {
      try {
        listener(to, from)
      } catch (e) {
        devError('[Router] listener error:', e)
      }
    }
  }

  /**
   * Pure URL → route-descriptor resolution — see parse-path.ts for the
   * route table and slug priority order.
   * @param pathname Raw URL pathname (+search/hash tolerated).
   * @returns The matched descriptor (404-shaped when nothing matches).
   */
  parsePath(pathname: string): RouteDescriptor {
    return parsePath(pathname)
  }

  /** Public alias of parsePath kept for API compatibility. */
  resolve(path: string): RouteDescriptor {
    return this.parsePath(path)
  }

  /** Public alias of parsePath kept for API compatibility. */
  match(path: string): RouteDescriptor {
    return this.parsePath(path)
  }

  /**
   * Full navigation pipeline — guards → history → meta → notify; see
   * navigate.ts for the stage order.
   * @param path Destination URL path.
   * @param replace When true, replace the current history entry instead of pushing.
   */
  async handleNavigation(path: string, replace = false): Promise<void> {
    return handleNavigation(this, path, replace)
  }

  /** Navigates forward, pushing a history entry. */
  push(path: string): Promise<void> {
    return this.handleNavigation(path, false)
  }

  /** Navigates without adding a history entry (redirects, boot). */
  replace(path: string): Promise<void> {
    return this.handleNavigation(path, true)
  }

  /** Bootstraps the router from the current URL (replaces, not pushes). */
  init() {
    this.handleNavigation(
      window.location.pathname + window.location.search + window.location.hash,
      true
    )
  }
}

/**
 * Shared router singleton — the whole app navigates through one instance
 * so currentRoute, hooks, and subscribers stay coherent.
 */
export const router = new Router()

// Default navigation guards
// Derives the locale from the incoming path and commits it — route
// changes are the single source of truth for `store.lang`, so every
// localized surface re-renders from here rather than syncing separately.
router.beforeEach(async (to) => {
  const lang = detectLangFromPath(to.path)

  store.commit(LANG_MUTATIONS.SET_LANG, lang)
})

export default router
