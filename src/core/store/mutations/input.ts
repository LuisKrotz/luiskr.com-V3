/**
 * @file store/mutations/input.ts
 * @description Input/hover mutations: touch-vs-mouse input method (drives
 * the click-or-tap label), hover-follower page coordinates (shifted −60px
 * so the magnetic cursor ring centers on the pointer), and the
 * clear/set hover flags that toggle the body's mouseenter class.
 */

import { COMMON_ATTRS } from '@/core/tokens/attrs/common.js'
import { MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import type { MutationMap } from '../state.js'
import type { Store } from '../../store.js'

/** Input + hover mutation group. */
export const inputMutations = (store: Store): MutationMap => ({
  setInputMethod: (payload) => {
    // No-change writes return false → commit() skips notify(), so the
    // frequent pointermove-driven calls don't re-render every subscriber.
    if (store.state.inputMethod === payload) return false

    store.state.inputMethod = String(payload)

    // has_touch tracks the method verbatim — 'touch' method implies a
    // touch-primary device for hover/cursor suppression elsewhere.
    store.state.has_touch = payload === COMMON_ATTRS.TOUCH

    // Re-resolve the hint verb immediately so the label doesn't wait for
    // the next onStoreUpdate render pass.
    store.state.clickortap =
      payload === COMMON_ATTRS.TOUCH
        ? store.state.actionTextMap.tap
        : store.state.actionTextMap.click

    return true
  },
  setClear: () => {
    if (typeof document !== TYPE_STRINGS.UNDEFINED)
      document.body.classList.remove(MOUSE_EVENTS.MOUSEENTER)

    store.state.showhover = false
  },
  setClickOrTap: (payload) => {
    const p = payload as { click?: string; tap?: string } | null

    // Partial writes merge field-wise — a payload carrying only `tap` keeps
    // the current `click` verb rather than blanking it.
    if (p?.click || p?.tap) {
      store.state.actionTextMap = {
        click: p.click || store.state.actionTextMap.click,
        tap: p.tap || store.state.actionTextMap.tap,
      }

      store.state.clickortap =
        store.state.inputMethod === COMMON_ATTRS.TOUCH
          ? store.state.actionTextMap.tap
          : store.state.actionTextMap.click
    }
  },
  setHover: (payload) => {
    // Touch devices have no hover affordance (MDN: hover fires as a
    // synthesized event on tap, not continuously) — the follower and body
    // class are pointer-only.
    if (!store.state.has_touch) {
      store.state.showhover = true

      if (typeof document !== TYPE_STRINGS.UNDEFINED)
        document.body.classList.add(MOUSE_EVENTS.MOUSEENTER)

      store.mutations.setOnMouseMove(payload)
    }
  },
  // Hover-follower position: store pageX/Y shifted −60px so the
  // magnetic cursor ring centers on the pointer rather than the
  // top-left corner of its box.
  setOnMouseMove: (payload) => {
    const p = payload as { pageX?: number; pageY?: number } | null

    // `|| 0` (not `?? 0`): a missing/unreadable coordinate must collapse to
    // the origin corner rather than propagate NaN into the follower offset.
    // The 60px shift centers the ring's bounding box on the pointer tip —
    // the ring's drawn radius is ~60px from its box corner.
    store.state.page.left = (p?.pageX || 0) - 60

    store.state.page.top = (p?.pageY || 0) - 60
  },
})
