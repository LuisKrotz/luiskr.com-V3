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
    if (store.state.inputMethod === payload) return false

    store.state.inputMethod = String(payload)

    store.state.has_touch = payload === COMMON_ATTRS.TOUCH

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

    store.state.page.left = (p?.pageX || 0) - 60

    store.state.page.top = (p?.pageY || 0) - 60
  },
})
