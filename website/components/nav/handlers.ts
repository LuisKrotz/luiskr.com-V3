/**
 * @file nav-handlers.ts — click handlers for the logo, section links,
 * CTA, and the dialog triggers (preferences / language).
 */

import { CMS_KEYS } from '@core/tokens/data/cms-keys.js'
import { APP_EVENTS } from '@core/tokens/events/app.js'
import { MODAL_MUTATIONS } from '@core/tokens/events/mutations.js'
import { COMMON_SELECTORS } from '@core/tokens/selectors/common.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { localePath } from '@core/i18n.js'
import type { AppNav } from './AppNav.js'

/**
 * Shared click preamble: kill the default anchor navigation and bubbling —
 * nav links are `<a href>` for SEO/right-click but click interception
 * routes through the SPA router, and stopPropagation prevents parent
 * gesture handlers (menu swipe, card taps) from double-firing.
 * @param e DOM event to neutralize.
 */
function swallow(e?: Event): void {
  e?.preventDefault?.()
  e?.stopPropagation?.()
}

/**
 * Records the clicked button's center point in store.modalOrigin — the
 * preferences/lang dialogs read it to zoom their "genie" open animation
 * out from the trigger instead of from screen center. Falls back to
 * `closest('button,a')` because the click may land on an inner span —
 * the origin should be the control's center, not the text node's.
 * @param e Click event on (or inside) the trigger control.
 */
export function captureOrigin(e?: Event): void {
  const target =
    e?.currentTarget instanceof Element
      ? e.currentTarget
      : e?.target instanceof Element
        ? e.target
        : null

  const btn = target?.closest?.(COMMON_SELECTORS.BUTTON_OR_ANCHOR) || target

  if (!(btn instanceof Element)) {
    store.commit(MODAL_MUTATIONS.SET_MODAL_ORIGIN, null)

    return
  }

  const rect = btn.getBoundingClientRect()

  store.commit(MODAL_MUTATIONS.SET_MODAL_ORIGIN, {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  })
}

/** Logo click: navigates home, or scrolls top when already on home. */
export function handleLogo(host: AppNav, e?: Event): void {
  swallow(e)

  if (!host.isHomePage) {
    router.push(localePath('', host.locale))
  } else {
    host.scrollToTop()
  }
}

/** About link click: routes to the localized about slug. */
export function handleAbout(host: AppNav, e?: Event): void {
  swallow(e)

  if (!host.isHomePage) {
    router.push(localePath(CMS_KEYS.ABOUT, host.locale))
  } else {
    host.goToAbout()
  }
}

/** Contact/CTA click: routes to the localized contact slug. */
export function handleAction(host: AppNav, e?: Event): void {
  swallow(e)

  if (host.onBottom) {
    host.scrollToTop()
  } else {
    host.scrollToContact()
  }
}

/** Opens the preferences modal (fires open-preferences-modal after capturing origin). */
export function handlePreferences(host: AppNav, e?: Event): void {
  swallow(e)

  host._captureOrigin(e)

  store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)

  if (typeof window !== TYPE_STRINGS.UNDEFINED) {
    window.dispatchEvent(new CustomEvent(APP_EVENTS.OPEN_PREFERENCES_MODAL))
  }
}

/** Opens the language dialog (fires open-lang-dialog after capturing origin). */
export function handleLang(host: AppNav, e?: Event): void {
  swallow(e)

  host._captureOrigin(e)

  store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, true)

  if (typeof window !== TYPE_STRINGS.UNDEFINED) {
    window.dispatchEvent(new CustomEvent(APP_EVENTS.OPEN_LANG_DIALOG))
  }
}
