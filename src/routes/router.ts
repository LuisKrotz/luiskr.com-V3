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

  /** Wires the browser Back/Forward buttons into handleNavigation. */
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
   * @returns unsubscribe function
   */
  subscribe(listener: RouteListener): () => void {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  /** Fans the route change out to subscribers; one bad listener can't break the rest. */
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

  /** Full navigation pipeline — see navigate.ts. */
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
 * The router constant.
 */
export const router = new Router()

// Default navigation guards
router.beforeEach(async (to) => {
  // Update store locale
  const lang = detectLangFromPath(to.path)

  store.commit(LANG_MUTATIONS.SET_LANG, lang)
})

export default router
