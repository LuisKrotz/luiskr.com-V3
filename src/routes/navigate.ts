/**
 * @file routes/navigate.ts — the navigation pipeline: resolve → before
 * hooks (redirect-capable) → history push/replace → title + canonical
 * sync → scroll (to the meta.scrollTo marker or top) → after hooks →
 * subscriber notification.
 */

import { BASE_TITLE } from '@/core/tokens/routes.js'
import { LINK_ATTRS } from '@/core/tokens/attrs/link.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { VIEW_TAGS } from '@/core/tokens/elements/views.js'
import { ROUTE_PATHS } from '@/core/tokens/routes/paths.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { DOM_STRINGS } from '@/core/tokens/strings/dom.js'
import { NET_STRINGS } from '@/core/tokens/strings/net.js'
import { QUERY_STRINGS } from '@/core/tokens/strings/queries.js'
import { ROUTE_STRINGS } from '@/core/tokens/strings/routes.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { deepQuerySelector } from '@/core/utils/dom.js'
import { notifyLoadFailed } from '@/utils/notify.js'
import { parsePath } from './parse-path.js'
import type { RouteDescriptor } from './types.js'
import type { Router } from './router.js'

/** ms to wait before scrolling to an anchored route's marker element. */
const ANCHOR_SCROLL_DELAY = 300

/**
 * The CMS is a separate document/app (cms/index.html) — /cms and /admin
 * are hard navigations so the CMS boots in isolation. In production the
 * firebase.json rewrites cover this; in dev the SPA fallback hands the
 * path to us, so we hand it back to the real CMS document.
 */
function isCmsPath(path: string): boolean {
  const firstSeg = path.split(CHAR_STRINGS.SLASH).filter(Boolean)[0]

  return firstSeg === ROUTE_STRINGS.CMS || firstSeg === ROUTE_STRINGS.ADMIN
}

/** document.title + canonical <link> sync for the resolved route. */
export function syncDocumentHead(to: RouteDescriptor): void {
  document.title = String(to.meta.title || BASE_TITLE)

  let canonicalEl = document.querySelector(QUERY_STRINGS.LINK_CANONICAL)

  if (!canonicalEl) {
    canonicalEl = document.createElement(HTML_TAGS.LINK)

    canonicalEl.setAttribute(DOM_STRINGS.REL, DOM_STRINGS.REL_CANONICAL)

    document.head.appendChild(canonicalEl)
  }

  const cleanPath = to.path === ROUTE_PATHS.ROOT ? CHAR_STRINGS.EMPTY : to.path

  canonicalEl.setAttribute(LINK_ATTRS.HREF, `${NET_STRINGS.SITE_URL}${cleanPath}`)
}

/**
 * Anchored routes (#about/#contact) wait 300ms — long enough for the
 * home view's dynamic chunk to mount its shadow DOM — then
 * deepQuerySelector pierces that shadow to find the marker element.
 * All other routes hard-reset to top so the new view doesn't inherit
 * the previous page's scroll depth.
 */
function syncScroll(to: RouteDescriptor): void {
  if (to.meta.scrollTo) {
    setTimeout(() => {
      const scrollTo = to.meta.scrollTo as string

      const el = deepQuerySelector(CHAR_STRINGS.HASH + scrollTo)

      if (el) {
        const targetY = window.scrollY + el.getBoundingClientRect().top

        window.scrollTo({ top: targetY, behavior: ATTR_VALUES.SMOOTH })
      }
    }, ANCHOR_SCROLL_DELAY)
  } else {
    window.scrollTo(0, 0)
  }
}

/** Runs the redirect-capable before hooks; resolves true when nav proceeds. */
async function runBeforeHooks(
  host: Router,
  to: RouteDescriptor,
  from: RouteDescriptor | null
): Promise<boolean> {
  for (const hook of host.beforeHooks) {
    const redirect = await hook(to, from)

    if (redirect) {
      if (typeof redirect === TYPE_STRINGS.STRING) {
        // Redirecting to the path already being resolved would loop
        // forever (hook → push → hook → …) — treat it as a pass-through.
        if (redirect === to.path) continue

        await host.push(redirect as string)

        return false
      }

      const redirectPath = (redirect as { path?: string }).path

      if (redirectPath) {
        if (redirectPath === to.path) continue

        await host.push(redirectPath)

        return false
      }
    }
  }

  return true
}

/**
 * Full navigation pipeline — the space-playground chunk is preloaded
 * when navigated to, since it's excluded from the idle route warmer
 * for size.
 */
export async function handleNavigation(host: Router, path: string, replace = false): Promise<void> {
  if (isCmsPath(path)) {
    window.location.replace(`${ROUTE_PATHS.CMS}/index.html`)

    return
  }

  const to = parsePath(path)

  const from = host.currentRoute

  if (!(await runBeforeHooks(host, to, from))) return

  // History update
  if (replace) {
    window.history.replaceState({}, CHAR_STRINGS.EMPTY, path)
  } else if (window.location.pathname !== to.path) {
    window.history.pushState({}, CHAR_STRINGS.EMPTY, path)
  }

  host.currentRoute = to

  syncDocumentHead(to)

  syncScroll(to)

  // Execute after hooks
  for (const hook of host.afterHooks) {
    hook(to, from)
  }

  if (to.view === VIEW_TAGS.VIEW_SPACE_PLAYGROUND) {
    try {
      await import('@/playground/SpacePlayground.js')
    } catch {
      // Chunk fetch failed (offline, stale deploy) — surface it gracefully
      // instead of leaving the user on a blank transitioning view.
      notifyLoadFailed()
    }
  }

  host.notify(to, from)
}
