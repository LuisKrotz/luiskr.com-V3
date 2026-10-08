/**
 * @file about/events.ts — editor input/button wiring.
 */

import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { FORM_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { CMS_ABOUT_IDS } from '@cms/tokens.js'
import type { CmsAboutEditor } from './CmsAboutEditor.js'
import type { BioColumn, MentionItem } from './types.js'
import { CMS_ABOUT_CLASSES } from '@cms/tokens.js'

/**
 * Binds events.
 * @param host — the host component
 */
export function bindEvents(host: CmsAboutEditor) {
  const on = (sel: string, ev: string, fn: EventListener) => {
    const el = host.$(sel)
    if (el) host.addScopedListener(el, ev, fn)
  }
  const all = (sel: string, fn: (_el: HTMLElement) => void) => host.$$(sel).forEach(fn)

  on(`#${CMS_ABOUT_IDS.SAVE}`, MOUSE_EVENTS.CLICK, () => host.saveAboutData())
  on(`#${CMS_ABOUT_IDS.SYNC_PICTURE}`, MOUSE_EVENTS.CLICK, () => host.applyPictureToAllLangs())
  on(`#${CMS_ABOUT_IDS.SYNC_ALL}`, MOUSE_EVENTS.CLICK, () => host.syncNonLocalizedToAllLangs())
  on(`#${CMS_ABOUT_IDS.GEN_GRAVATAR}`, MOUSE_EVENTS.CLICK, () => host.generateGravatarUrl())
  on(`#${CMS_ABOUT_IDS.SELECT_LANG}`, FORM_EVENTS.CHANGE, (e) => {
    host.selectedLang = (e.target as HTMLSelectElement).value
    host.loadAboutData()
  })
  on(`#${CMS_ABOUT_IDS.TITLE_INPUT}`, FORM_EVENTS.INPUT, (e) => {
    host.aboutData.title = (e.target as HTMLInputElement).value
  })
  on(`#${CMS_ABOUT_IDS.MENTIONS_TITLE}`, FORM_EVENTS.INPUT, (e) => {
    host.aboutData.mentions = (e.target as HTMLInputElement).value
  })
  on(`#${CMS_ABOUT_IDS.EMAIL_INPUT}`, FORM_EVENTS.INPUT, (e) => {
    host.emailInput = (e.target as HTMLInputElement).value
  })
  on(`#${CMS_ABOUT_IDS.SIZE_INPUT}`, FORM_EVENTS.INPUT, (e) => {
    host.setGravatarSize(parseInt((e.target as HTMLInputElement).value, 10) || 512)
  })
  on(`#${CMS_ABOUT_IDS.PIC_INPUT}`, FORM_EVENTS.INPUT, (e) => {
    host.aboutData.profilePicture = (e.target as HTMLInputElement).value
    const previewImg = host.$<HTMLImageElement>(`#${CMS_ABOUT_IDS.GRAVATAR_PREVIEW}`)
    if (previewImg) previewImg.src = (e.target as HTMLInputElement).value
  })

  all(`.${CMS_ABOUT_CLASSES.SIZE_PRESET_BTN}`, (btn) => {
    const size = parseInt(btn.getAttribute(DATA_ATTRS.DATA_SIZE) || '0', 10)
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host.setGravatarSize(size))
  })
  all(`.${CMS_ABOUT_CLASSES.COL_ADD_BTN}`, (btn) => {
    const col = btn.getAttribute(DATA_ATTRS.DATA_COL) as BioColumn
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host.addParagraph(col))
  })
  all(`.${CMS_ABOUT_CLASSES.PARA_INPUT}`, (ta) => {
    const col = ta.getAttribute(DATA_ATTRS.DATA_COL) as BioColumn
    const idx = parseInt(ta.getAttribute(DATA_ATTRS.DATA_IDX) || '0', 10)
    host.addScopedListener(ta, FORM_EVENTS.INPUT, (e) => {
      if (host.aboutData[col]) host.aboutData[col][idx] = (e.target as HTMLTextAreaElement).value
    })
  })
  all(`.${CMS_ABOUT_CLASSES.PARA_REMOVE_BTN}`, (btn) => {
    const col = btn.getAttribute(DATA_ATTRS.DATA_COL) as BioColumn
    const idx = parseInt(btn.getAttribute(DATA_ATTRS.DATA_IDX) || '0', 10)
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host.removeParagraph(col, idx))
  })
  all(`.${CMS_ABOUT_CLASSES.PARA_UP_BTN}`, (btn) => {
    const col = btn.getAttribute(DATA_ATTRS.DATA_COL) as BioColumn
    const idx = parseInt(btn.getAttribute(DATA_ATTRS.DATA_IDX) || '0', 10)
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host.moveParagraph(col, idx, -1))
  })
  all(`.${CMS_ABOUT_CLASSES.PARA_DOWN_BTN}`, (btn) => {
    const col = btn.getAttribute(DATA_ATTRS.DATA_COL) as BioColumn
    const idx = parseInt(btn.getAttribute(DATA_ATTRS.DATA_IDX) || '0', 10)
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host.moveParagraph(col, idx, 1))
  })

  on('#btn-add-mention', MOUSE_EVENTS.CLICK, () => host.addMentionItem())
  all(`.${CMS_ABOUT_CLASSES.MENTION_FIELD}`, (inp) => {
    const idx = parseInt(inp.getAttribute(DATA_ATTRS.DATA_IDX) || '0', 10)
    const field = inp.getAttribute(DATA_ATTRS.DATA_FIELD) as keyof MentionItem
    host.addScopedListener(inp, FORM_EVENTS.INPUT, (e) => {
      if (host.aboutData.mention_items[idx] && field)
        host.aboutData.mention_items[idx][field] = (e.target as HTMLInputElement).value
    })
  })
  all(`.${CMS_ABOUT_CLASSES.MENTION_REMOVE_BTN}`, (btn) => {
    const idx = parseInt(btn.getAttribute(DATA_ATTRS.DATA_IDX) || '0', 10)
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host.removeMentionItem(idx))
  })
  all(`.${CMS_ABOUT_CLASSES.MENTION_UP_BTN}`, (btn) => {
    const idx = parseInt(btn.getAttribute(DATA_ATTRS.DATA_IDX) || '0', 10)
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host.moveMentionItem(idx, -1))
  })
  all(`.${CMS_ABOUT_CLASSES.MENTION_DOWN_BTN}`, (btn) => {
    const idx = parseInt(btn.getAttribute(DATA_ATTRS.DATA_IDX) || '0', 10)
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host.moveMentionItem(idx, 1))
  })
}
