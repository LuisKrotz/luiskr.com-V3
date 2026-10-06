/**
 * @file media-convert/events.ts — drop-zone, file-input and button wiring.
 */

import { CMS_MEDIA_IDS } from '@/cms/tokens.js'
import { DRAG_EVENTS, FORM_EVENTS, MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import type { CmsMediaConverter } from './CmsMediaConverter.js'
import { API_BASE } from './consts.js'
import { CMS_ITEM_CLASSES } from '@/cms/tokens.js'
/**
 * Binds events.
 * @param host — the host component
 */
export function bindEvents(host: CmsMediaConverter) {
  const dz = host.$(`.${CMS_ITEM_CLASSES.CMS_DROPZONE}`)

  if (dz) {
    host.addScopedListener(dz, DRAG_EVENTS.DRAGOVER, (e) => {
      e.preventDefault()
      if (!host.dragging) {
        host.dragging = true
        dz.classList.add(`${CMS_ITEM_CLASSES.CMS_DROPZONE}--over`)
      }
    })
    host.addScopedListener(dz, DRAG_EVENTS.DRAGLEAVE, (e) => {
      if (!dz.contains((e as DragEvent).relatedTarget as Node | null)) {
        host.dragging = false
        dz.classList.remove(`${CMS_ITEM_CLASSES.CMS_DROPZONE}--over`)
      }
    })
    host.addScopedListener(dz, DRAG_EVENTS.DROP, async (e) => {
      e.preventDefault()
      host.dragging = false
      dz.classList.remove(`${CMS_ITEM_CLASSES.CMS_DROPZONE}--over`)
      const dataTransfer = (e as DragEvent).dataTransfer
      if (dataTransfer) await host._collectDrop(dataTransfer)
      host._updateDom()
      host._bindEvents()
    })
  }

  const fileInput = host.$<HTMLInputElement>(`#${CMS_MEDIA_IDS.FILE_INPUT}`)
  if (fileInput) {
    host.addScopedListener(fileInput, FORM_EVENTS.CHANGE, () => {
      host._collectInput(fileInput)
      host._updateDom()
      host._bindEvents()
    })
  }

  const on = (id: string, fn: EventListener) => {
    const el = host.$(id)
    if (el) host.addScopedListener(el, MOUSE_EVENTS.CLICK, fn)
  }

  on(`#${CMS_MEDIA_IDS.RUN}`, () => host._run())
  on(`#${CMS_MEDIA_IDS.RESET}`, () => host._reset())
  on(`#${CMS_MEDIA_IDS.CLEAR_LIST}`, () => {
    host.queue = []
    host._updateDom()
    host._bindEvents()
  })
  on(`#${CMS_MEDIA_IDS.DOWNLOAD}`, () => {
    window.location.assign(`${API_BASE}/jobs/${host.jobId}/zip`)
    host._notify('ZIP download started')
    setTimeout(() => host._deleteJob(), 1500)
  })
}
