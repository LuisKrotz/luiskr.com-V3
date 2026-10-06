/**
 * @file store/mutations/ui.ts
 * @description UI-state mutations: dialog open toggles, the genie-zoom
 * origin point, the expand-modal descriptor (plus its modal-open class
 * flips on <html>/<body>), the portfolio list, the CDN storage base and
 * misc one-off setters.
 */

import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { MODAL_CLASSES } from '@/core/tokens/classes/modal.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import type { ModalObject, MutationMap } from '../state.js'
import type { Store } from '../../store.js'

/** UI + data mutation group. */
export const uiMutations = (store: Store): MutationMap => ({
  setPortfolioList: (payload) => {
    if (Array.isArray(payload)) {
      store.state.portfoliolist = payload
    } else if (payload && typeof payload === TYPE_STRINGS.OBJECT) {
      store.state.portfoliolist = Object.values(payload)
    }
  },
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

    store.state.modalOrigin =
      o && typeof o.x === TYPE_STRINGS.NUMBER && typeof o.y === TYPE_STRINGS.NUMBER
        ? { x: o.x as number, y: o.y as number }
        : null
  },
  setMarqueeAmount: () => {},
  setStorage: (payload) => {
    if (!payload || typeof payload !== TYPE_STRINGS.STRING) return

    store.state.storage = payload as string

    store.notify()
  },
  setModal: (payload) => {
    const p = payload as Partial<ModalObject>

    store.state.modalObject.transform = p.transform ?? 0

    store.state.modalObject.class = p.class ?? ATTR_VALUES.EMPTY

    store.state.modalObject.open = p.open ?? false

    store.state.modalObject.media = p.media ?? null

    if (typeof document !== TYPE_STRINGS.UNDEFINED) {
      const isOpen = Boolean(p.open || p.class === MODAL_CLASSES.MODAL_OPEN)

      document.documentElement.classList.toggle(MODAL_CLASSES.MODAL_OPEN, isOpen)

      document.body.classList.toggle(MODAL_CLASSES.MODAL_OPEN, isOpen)
    }
  },
})
