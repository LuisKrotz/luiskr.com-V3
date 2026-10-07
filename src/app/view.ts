/**
 * @file app/view.ts
 * @description View outlet reconciliation for AppRoot — same-tag routes delegate to onRouteParamChange; new views lazy-import their chunk then cross-fade (instant under reduced motion).
 */

import { ANIMATION_DURATIONS } from '@/core/tokens/motion/animation.js'
import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { VIEW_TAGS } from '@/core/tokens/elements/views.js'
import { APP_IDS } from '@/core/tokens/ids/app.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import store from '@/core/store.js'
import router from '@/routes/router.js'
import type { RouteDescriptor } from '@/routes/router.js'
import type { RoutableView } from './types.js'
import type { AppRoot } from '../App.js'

/**
 * Updates app view content.
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
 * The flipAppView value.
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
    await import('@/routes/views/home/Home.js')
  } else if (toTag === VIEW_TAGS.VIEW_LEGAL) {
    await import('@/routes/views/legal/Legal.js')
  } else if (toTag === VIEW_TAGS.VIEW_PROJECT) {
    await import('@/routes/views/project/Project.js')
  } else if (toTag === VIEW_TAGS.VIEW_NOT_FOUND) {
    await import('@/routes/views/not-found/NotFound.js')
  } else if (toTag === VIEW_TAGS.VIEW_SPACE_PLAYGROUND) {
    await import('@/playground/SpacePlayground.js')
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
