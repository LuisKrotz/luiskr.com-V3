/**
 * @file routes/views/home/scroll.ts
 * @description Post-navigation scroll handling for <view-home>: same-view
 * navigations (home→#about→#contact) re-scroll instead of remounting.
 * The delay lets the route transition's fade settle so the target
 * section is painted; scrollY + rect.top converts the viewport-relative
 * position into a document offset.
 */

import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { deepQuerySelector } from '@core/utils/dom.js'
import type { RouteDescriptor } from '@core/router/router.js'
import type { ViewHome } from './Home.js'

/** Smooth-scrolls to a section id (shadow root first, then deep DOM). */
export function scrollToSection(view: ViewHome, scrollTo: string, delay: number): void {
  setTimeout(() => {
    const el = view.$('#' + scrollTo) || deepQuerySelector('#' + scrollTo)

    if (el) {
      const targetY = window.scrollY + el.getBoundingClientRect().top

      window.scrollTo({ top: targetY, behavior: ATTR_VALUES.SMOOTH })
    }
  }, delay)
}

/** Router hook — section navigations re-scroll; others return to top. */
export function onHomeRouteChange(view: ViewHome, to: RouteDescriptor | null): void {
  if (to?.meta?.scrollTo) {
    scrollToSection(view, String(to.meta.scrollTo), 100)
  } else {
    window.scrollTo({ top: 0, behavior: ATTR_VALUES.SMOOTH })
  }
}

/** Mount-time scroll: honor a pending section target, else reset to top. */
export function scrollOnMount(view: ViewHome, to: RouteDescriptor | null): void {
  if (to?.meta?.scrollTo) {
    scrollToSection(view, String(to.meta.scrollTo), 300)
  } else {
    setTimeout(() => window.scrollTo(0, 0), 500)
  }
}
