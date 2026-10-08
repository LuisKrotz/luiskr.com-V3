/**
 * @file nav-scroll.ts — section navigation: scroll-top / about / contact.
 *
 * All three use the same pair — `window.scrollTo` (smooth unless reduced
 * motion, with a try/catch for engines that reject the options arg) then
 * `wasmSmoothScroll` for the accelerated path — funneled through
 * `smoothScrollTo` so the pattern lives once.
 */

import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { SECTIONS } from '@core/tokens/base.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { COMMON_SELECTORS } from '@core/tokens/selectors/common.js'
import { ROUTE_STRINGS } from '@core/tokens/strings/routes.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import store from '@core/store.js'
import { deepQuerySelector } from '@core/utils/dom.js'
import { localePath } from '@core/i18n.js'
import { wasmSmoothScroll } from '@core/utils/wasm/wasm-scroll.js'
import type { AppNav } from './AppNav.js'
import { SCROLL_TIMINGS } from '@core/tokens/media/dimensions.js'

/**
 * window.scrollTo + the WASM smooth-scroll accelerator for one target.
 * Under reduced-motion the options-arg scrollTo is `instant` — the WASM
 * path gets the longer `SCROLL_DURATION_REDUCED` ramp instead so the jump
 * stays perceivable without feeling abrupt. The try/catch covers engines
 * (old Safari) that throw on the options-object signature — the
 * positional fallback loses smoothness but still lands.
 * @param y Document-space scroll target in px.
 */
function smoothScrollTo(y: number): void {
  const isReduced = store.getters.getReducedMotion()

  try {
    window.scrollTo({ top: y, behavior: isReduced ? ATTR_VALUES.INSTANT : ATTR_VALUES.SMOOTH })
  } catch {
    window.scrollTo(0, y)
  }

  wasmSmoothScroll({
    duration: isReduced
      ? SCROLL_TIMINGS.SCROLL_DURATION_REDUCED
      : SCROLL_TIMINGS.SCROLL_DURATION_FULL,
    updateHistory: true,
    scrollTo: y,
  })
}

/**
 * pushState to `path` only when it differs — in-page section scrolls
 * shouldn't stack duplicate history entries for the same URL.
 * @param path Localized route path.
 */
function pushPath(path: string): void {
  if (typeof window !== TYPE_STRINGS.UNDEFINED && window.location.pathname !== path) {
    window.history.pushState({}, '', path)
  }
}

/**
 * Scrolls to a deep-queried section element, if present. The element can
 * live inside a shadow tree, hence deepQuerySelector; id first, tag
 * fallback for markup that drops the id.
 * @param selId `#id` selector.
 * @param selTag Custom-element tag fallback.
 */
function scrollToSectionEl(selId: string, selTag: string): void {
  const el = deepQuerySelector(selId) || deepQuerySelector(selTag)

  if (el) {
    // getBoundingClientRect().top is viewport-relative — adding scrollY
    // converts to the document-space Y window.scrollTo expects.
    const targetY = window.scrollY + el.getBoundingClientRect().top

    smoothScrollTo(targetY)
  }
}

/** Smooth-scrolls the window back to the top. */
export function scrollToTop(host: AppNav): void {
  if (host.isHomePage) {
    host.activeSection = SECTIONS.HOME

    pushPath(localePath('', host.locale))
  }

  smoothScrollTo(0)
}

/** Navigates to (or scrolls to) the about section — route-aware. */
export function goToAbout(host: AppNav): void {
  host.activeSection = SECTIONS.ABOUT

  scrollToSectionEl(COMMON_SELECTORS.ID_ABOUT, COMPONENT_TAGS.ABOUT_SECTION)

  pushPath(localePath(ROUTE_STRINGS.ABOUT, host.locale))
}

/** Navigates to (or scrolls to) the contact footer — route-aware. */
export function scrollToContact(host: AppNav): void {
  if (host.isHomePage) {
    host.activeSection = SECTIONS.CONTACT

    scrollToSectionEl(COMMON_SELECTORS.ID_CONTACT, COMPONENT_TAGS.CONTACT_SECTION)

    pushPath(localePath(ROUTE_STRINGS.CONTACT, host.locale))
  } else {
    const scrollHeight =
      typeof document !== TYPE_STRINGS.UNDEFINED
        ? Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
        : 0

    smoothScrollTo(scrollHeight)
  }
}
