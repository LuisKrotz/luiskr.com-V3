/**
 * @file app/view.ts
 * @description View outlet reconciliation for AppRoot — same-tag routes delegate to onRouteParamChange; new views lazy-import their chunk then cross-fade (instant under reduced motion).
 */

import { ANIMATION_DURATIONS } from '@core/tokens/motion/animation.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { APP_IDS } from '@core/tokens/ids/app.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import type { RouteDescriptor } from '@core/router/router.js'
import type { RoutableView } from './types.js'
import type { AppRoot } from '../App.js'

/**
 * Route-change reconciliation for the view outlet: when the target view
 * tag equals the mounted one (and the element is actually defined), the
 * view is kept alive and told about the new route via onRouteParamChange —
 * project→project navigation must not tear down GL state. A tag change
 * delegates to _flipToView for the swap.
 * @param c The AppRoot element.
 * @param to Destination descriptor (falls back to router.currentRoute).
 * @param _from Origin descriptor — unused, kept for listener parity.
 */
export function updateAppViewContent(
  c: AppRoot,
  to?: RouteDescriptor,
  _from?: RouteDescriptor | null
): void {
  const outlet = c.$(`#${APP_IDS.VIEW_OUTLET}`)
  if (!outlet) return

  const current = outlet.firstElementChild
  const targetTag = c.currentViewTag.toLowerCase()
  const isDefined =
    typeof customElements !== TYPE_STRINGS.UNDEFINED && !!customElements.get(c.currentViewTag)

  if (current && current.tagName.toLowerCase() === targetTag && isDefined) {
    const routable = current as RoutableView

    if (typeof routable.onRouteParamChange === TYPE_STRINGS.FUNCTION) {
      routable.onRouteParamChange?.(to || router.currentRoute)
    }
    return
  }

  c._flipToView(outlet, to)
}

/**
 * View swap: lazy-imports the target view's chunk (each import is in its
 * own branch so bundlers keep per-route code-splitting), then either
 * instant-replaces the outlet (reduced motion / empty outlet) or plays
 * the two-leg cross-fade — fade-out for PAGE_FADE_HALF, then mount the
 * incoming view with a fade-in class removed on the next frame.
 * `_sectionsMeasured` resets so the new view's sections re-measure lazily.
 * @param c The AppRoot element.
 * @param outlet The #view-outlet element.
 * @param _to Destination descriptor — the tag is read from c.currentViewTag.
 */
export async function flipAppView(
  c: AppRoot,
  outlet: Element,
  _to?: RouteDescriptor
): Promise<void> {
  // New view = new section markers; re-measure lazily via checkScroll.
  c._sectionsMeasured = false

  const reduced = store.getters.getReducedMotion()
  const toTag = c.currentViewTag

  if (toTag === VIEW_TAGS.VIEW_HOME) {
    await import('@website/views/home/Home.js')
  } else if (toTag === VIEW_TAGS.VIEW_LEGAL) {
    await import('@website/views/legal/Legal.js')
  } else if (toTag === VIEW_TAGS.VIEW_PROJECT) {
    await import('@website/views/project/Project.js')
  } else if (toTag === VIEW_TAGS.VIEW_NOT_FOUND) {
    await import('@website/views/not-found/NotFound.js')
  } else if (toTag === VIEW_TAGS.VIEW_SPACE_PLAYGROUND) {
    await import('@earth/SpacePlayground.js')
  } else if (toTag === VIEW_TAGS.VIEW_DOCS) {
    await import('@docs/Docs.js')
  }

  if (reduced || !outlet.firstElementChild) {
    // Instant swap — no animation
    outlet.replaceChildren(document.createElement(toTag))
    return
  }

  const outgoing = outlet.firstElementChild

  outgoing.classList.add(STATE_CLASSES.PAGE_FADE_OUT)

  setTimeout(() => {
    const incoming = document.createElement(toTag)

    incoming.classList.add(STATE_CLASSES.PAGE_FADE_IN)
    outlet.replaceChildren(incoming)

    void incoming.offsetHeight

    incoming.classList.remove(STATE_CLASSES.PAGE_FADE_IN)
  }, ANIMATION_DURATIONS.PAGE_FADE_HALF)
}
