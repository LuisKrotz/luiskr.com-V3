/**
 * @file lang-dialog/events.ts — option clicks, backdrop/Escape dismissal,
 * and the GPU-composited glass-follower highlight that glides between
 * option buttons (tracks hover/focus, falls back to the active locale).
 */

import { KEYS } from '@core/tokens/primitives.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { LANG_CLASSES } from '@core/tokens/classes/lang.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import {
  FOCUS_EVENTS,
  KEYBOARD_EVENTS,
  MOUSE_EVENTS,
  POINTER_EVENTS,
  WINDOW_EVENTS,
} from '@core/tokens/events/dom.js'
import type { LangDialog } from '../LangDialog.js'

/** Positions the glass follower over `btn` (transform only — no layout). */
function moveFollower(follower: Element, btn: HTMLElement): void {
  const x = btn.offsetLeft

  const y = btn.offsetTop

  const w = btn.offsetWidth

  const h = btn.offsetHeight

  const style = (follower as HTMLElement).style

  style.width = `${w}px`

  style.height = `${h}px`

  style.transform = `translate3d(${x}px, ${y}px, 0)`

  style.opacity = '1'
}

/** Snaps the follower back onto the active locale's button. */
function updateToActive(host: LangDialog, follower: Element): void {
  const activeBtn = host.$(`.${PREF_CLASSES.PREF_OPTION_BTN}.${STATE_CLASSES.ACTIVE}`)

  if (activeBtn && (activeBtn as HTMLElement).offsetWidth > 0) {
    moveFollower(follower, activeBtn as HTMLElement)
  }
}

/** Wires the glass-follower tracking (hover/focus/leave/resize). */
function bindGlassFollower(host: LangDialog, langBtns: Element[]): void {
  const grid = host.$(`.${PREF_CLASSES.PREF_OPTIONS}`)

  const follower = host.$(`.${LANG_CLASSES.LANG_GLASS_FOLLOWER}`)

  if (!grid || !follower) return

  // Two RAFs: offset* reads are 0 until the grid has been laid out;
  // the second frame catches post-font-load metric changes.
  requestAnimationFrame(() => {
    updateToActive(host, follower)

    requestAnimationFrame(() => updateToActive(host, follower))
  })

  langBtns.forEach((btn) => {
    host.addScopedListener(btn, POINTER_EVENTS.POINTERENTER, () =>
      moveFollower(follower, btn as HTMLElement)
    )

    host.addScopedListener(btn, MOUSE_EVENTS.MOUSEENTER, () =>
      moveFollower(follower, btn as HTMLElement)
    )

    host.addScopedListener(btn, FOCUS_EVENTS.FOCUS, () =>
      moveFollower(follower, btn as HTMLElement)
    )
  })

  host.addScopedListener(grid, POINTER_EVENTS.POINTERLEAVE, () => {
    const activeBtn = host.$(`.${PREF_CLASSES.PREF_OPTION_BTN}.${STATE_CLASSES.ACTIVE}`)

    if (activeBtn) {
      moveFollower(follower, activeBtn as HTMLElement)
    } else {
      ;(follower as HTMLElement).style.opacity = '0'
    }
  })

  host.addScopedListener(window, WINDOW_EVENTS.RESIZE, () => {
    const hovered =
      host.$(`.${PREF_CLASSES.PREF_OPTION_BTN}:hover`) ||
      host.$(`.${PREF_CLASSES.PREF_OPTION_BTN}.${STATE_CLASSES.ACTIVE}`)

    if (hovered) moveFollower(follower, hovered as HTMLElement)
  })
}

/** Binds option clicks, backdrop click and keyboard dismissal. */
export function bindEvents(host: LangDialog): void {
  if (!host.isOpen) return

  const backdrop = host.$(`.${PREF_CLASSES.PREF_BACKDROP}`)

  if (backdrop) {
    host.addScopedListener(backdrop, MOUSE_EVENTS.CLICK, (e) => {
      if (e.target === backdrop) host.close()
    })
  }

  host.addScopedListener(window, KEYBOARD_EVENTS.KEYDOWN, (e) => {
    if ((e as KeyboardEvent).key === KEYS.ESCAPE) host.close()
  })

  const closeBtn = host.$(`.${PREF_CLASSES.PREF_CLOSE_BTN}`)

  if (closeBtn) host.addScopedListener(closeBtn, MOUSE_EVENTS.CLICK, () => host.close())

  const langBtns = host.$$(`[${DATA_ATTRS.DATA_LANG}]`)

  langBtns.forEach((btn) => {
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => {
      const langCode = btn.getAttribute(DATA_ATTRS.DATA_LANG)

      host.selectLang(langCode)
    })
  })

  bindGlassFollower(host, langBtns)
}
