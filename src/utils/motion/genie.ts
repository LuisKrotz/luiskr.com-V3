/**
 * @file genie.js
 * @description "Genie" dialog transition shared by the preferences modal and
 * language dialog: the dialog scales from the control that triggered it
 * (store.modalOrigin) on open and zooms back into it on close, via the
 * --genie-x/--genie-y transform-origin custom properties. Reduced motion
 * skips the animation entirely.
 */

import { PREF_CLASSES } from '@/core/tokens/classes/preferences.js'
import { GENIE_CSS_PROPS } from '@/core/tokens/css/genie.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import store from '@/core/store.js'
import { ANIMATION_DURATIONS } from '@/core/tokens/motion/animation.js'

/** Any component exposing the shadow-scoped `$` selector helper. */
interface GenieHost {
  $(_selector: string): HTMLElement | null
}

/**
 * Genie open/close shared by the preferences and language dialogs.
 * The dialog scales from the control that opened it (store.modalOrigin) and
 * zooms back into it on close. Honors reduced motion (instant).
 */
export const genieEnter = (component: GenieHost): void => {
  const backdrop = component.$(`.${PREF_CLASSES.PREF_BACKDROP}`)

  const dialog = component.$(`.${PREF_CLASSES.PREF_DIALOG}`)

  if (!backdrop || !dialog) return

  if (store.getters.getReducedMotion()) return

  const origin = store.getters.getModalOrigin() as { x: number; y: number } | null

  const rect = dialog.getBoundingClientRect()

  // Transform origin in dialog-local coords: the trigger's viewport
  // position minus the dialog's top-left = the point the scale-up grows
  // from. No origin recorded → dialog center (generic zoom, not genie).
  const x = origin ? origin.x - rect.left : rect.width / 2

  const y = origin ? origin.y - rect.top : rect.height / 2

  dialog.style.setProperty(GENIE_CSS_PROPS.GENIE_X, `${x}px`)

  dialog.style.setProperty(GENIE_CSS_PROPS.GENIE_Y, `${y}px`)

  // Jump to the collapsed start state without animating (layout may already
  // have been flushed at full size by the WebGL controls), then release.
  dialog.style.transition = STATE_STRINGS.NONE

  backdrop.style.transition = STATE_STRINGS.NONE

  backdrop.classList.add(PREF_CLASSES.PREF_BACKDROP_ENTER)

  void dialog.offsetWidth

  dialog.style.transition = CHAR_STRINGS.EMPTY

  backdrop.style.transition = CHAR_STRINGS.EMPTY

  requestAnimationFrame(() => {
    requestAnimationFrame(() => backdrop.classList.remove(PREF_CLASSES.PREF_BACKDROP_ENTER))
  })
}

/**
 * Plays the collapse-back-to-origin animation, then runs done() so the
 * caller can finish unmounting. Instant (done() immediately) under reduced
 * motion or when the backdrop isn't in the DOM.
 */
export const genieLeave = (component: GenieHost, done: () => void): void => {
  const backdrop = component.$(`.${PREF_CLASSES.PREF_BACKDROP}`)

  if (!backdrop || store.getters.getReducedMotion()) {
    done()

    return
  }

  backdrop.classList.add(PREF_CLASSES.PREF_BACKDROP_LEAVE)

  setTimeout(done, ANIMATION_DURATIONS.DIALOG_LEAVE_DURATION)
}
