/**
 * @file store/mutations/ui.ts
 * @description UI-state mutations: dialog open toggles, the genie-zoom
 * origin point, the expand-modal descriptor (plus its modal-open class
 * flips on <html>/<body>), the portfolio list, the CDN storage base and
 * misc one-off setters.
 */

import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { MODAL_CLASSES } from '@core/tokens/classes/modal.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import type { ModalObject, MutationMap } from '../state.js'
import type { Store } from '../../store.js'

/** UI + data mutation group. */
export const uiMutations = (store: Store): MutationMap => ({
  setPortfolioList: (payload) => {
    // Firebase returns either an array or an object keyed by push-id —
    // Object.values normalizes the map shape; the object order Firebase
    // returns is already the stored order, so no re-sort is applied here.
    if (Array.isArray(payload)) {
      store.state.portfoliolist = payload
    } else if (payload && typeof payload === TYPE_STRINGS.OBJECT) {
      store.state.portfoliolist = Object.values(payload)
    }
  },
  // Boolean payload sets explicitly; a non-boolean (e.g. a click Event
  // object forwarded as payload) toggles — same set/toggle contract as
  // setReducedMotion.
  togglePreferencesModal: (open) => {
    store.state.preferencesOpen =
      typeof open === TYPE_STRINGS.BOOLEAN ? (open as boolean) : !store.state.preferencesOpen
  },
  toggleLangDialog: (open) => {
    store.state.langDialogOpen =
      typeof open === TYPE_STRINGS.BOOLEAN ? (open as boolean) : !store.state.langDialogOpen
  },
  setModalOrigin: (origin) => {
    const o = origin as { x?: unknown; y?: unknown } | null

    // Both coords must be finite numbers — a partial/NaN origin would place
    // the genie-zoom source at (NaN, NaN) and collapse the dialog to a
    // point, so invalid input collapses to null instead.
    store.state.modalOrigin =
      o && typeof o.x === TYPE_STRINGS.NUMBER && typeof o.y === TYPE_STRINGS.NUMBER
        ? { x: o.x as number, y: o.y as number }
        : null
  },
  // Deliberate no-op — the marquee feature is retired but the mutation name
  // stays registered so legacy commits don't hit the unknown-mutation warn.
  setMarqueeAmount: () => {},
  setStorage: (payload) => {
    if (!payload || typeof payload !== TYPE_STRINGS.STRING) return

    store.state.storage = payload as string

    store.notify()
  },
  setModal: (payload) => {
    const p = payload as Partial<ModalObject>

    // `??` defaults per field — a partial descriptor (open-only, class-only)
    // resets the untouched fields to safe closed-state defaults rather than
    // leaking the previous modal's geometry.
    store.state.modalObject.transform = p.transform ?? 0

    store.state.modalObject.class = p.class ?? ATTR_VALUES.EMPTY

    store.state.modalObject.open = p.open ?? false

    store.state.modalObject.media = p.media ?? null

    if (typeof document !== TYPE_STRINGS.UNDEFINED) {
      // Two ways to be "open": the boolean flag, or a caller passing the
      // modal-open class name through `class` (legacy callers encode state
      // in the class string).
      const isOpen = Boolean(p.open || p.class === MODAL_CLASSES.MODAL_OPEN)

      document.documentElement.classList.toggle(MODAL_CLASSES.MODAL_OPEN, isOpen)

      document.body.classList.toggle(MODAL_CLASSES.MODAL_OPEN, isOpen)
    }
  },
})
