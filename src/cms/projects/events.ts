/**
 * @file projects/events.ts — binds editor inputs/buttons/selects into the model.
 */

import { DATA_ATTRS } from '@/core/tokens/attrs/data.js'
import { FORM_EVENTS, MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { CMS_PROJECTS_IDS } from '@/cms/tokens.js'
import type { CmsProjectsList } from './CmsProjectsList.js'
import { ensureSectionShape } from './sections.js'
import { COVER_DIMENSIONS } from '@/core/tokens/media/dimensions.js'
import { CMS_PROJECTS_CLASSES } from '@/cms/tokens.js'

/**
 * Binds events.
 * @param host — the host component
 */
export function bindEvents(host: CmsProjectsList) {
  const on = (sel: string, ev: string, fn: EventListener) => {
    const el = host.$(sel)
    if (el) host.addScopedListener(el, ev, fn)
  }
  const all = (sel: string, fn: (_el: HTMLElement) => void) => host.$$(sel).forEach(fn)

  on(`#${CMS_PROJECTS_IDS.BTN_CREATE}`, MOUSE_EVENTS.CLICK, () => host.createProjectPrompt())
  on(`#${CMS_PROJECTS_IDS.BTN_DELETE}`, MOUSE_EVENTS.CLICK, () => host.deleteProject())
  on(`#${CMS_PROJECTS_IDS.BTN_SAVE}`, MOUSE_EVENTS.CLICK, () => host.saveProjectData())
  on(`#${CMS_PROJECTS_IDS.BTN_ADD_SECTION}`, MOUSE_EVENTS.CLICK, () => host.addSection())

  on(`#${CMS_PROJECTS_IDS.SELECT_LANG}`, FORM_EVENTS.CHANGE, (e) => {
    host.selectedLang = (e.target as HTMLSelectElement).value
    host.loadProjectData()
  })
  on(`#${CMS_PROJECTS_IDS.SELECT_KEY}`, FORM_EVENTS.CHANGE, (e) => {
    host.selectedProjectKey = (e.target as HTMLSelectElement).value
    host.loadProjectData()
  })

  const proj = host.currentProject

  if (proj) {
    on(`#${CMS_PROJECTS_IDS.PROJ_TITLE}`, FORM_EVENTS.INPUT, (e) => {
      proj.title = (e.target as HTMLInputElement).value
    })
    on(`#${CMS_PROJECTS_IDS.PROJ_FOLDER}`, FORM_EVENTS.INPUT, (e) => {
      proj.folder = (e.target as HTMLInputElement).value
    })
    on(`#${CMS_PROJECTS_IDS.PROJ_NOINDEX}`, FORM_EVENTS.CHANGE, (e) => {
      proj.seo.noIndex = (e.target as HTMLInputElement).checked
    })
    on(`#${CMS_PROJECTS_IDS.COVER_SRC}`, FORM_EVENTS.INPUT, (e) => {
      proj.cover.src = (e.target as HTMLInputElement).value
    })
    on(`#${CMS_PROJECTS_IDS.COVER_LABEL}`, FORM_EVENTS.INPUT, (e) => {
      proj.cover.label = (e.target as HTMLInputElement).value
    })
    on(`#${CMS_PROJECTS_IDS.COVER_ISVIDEO}`, FORM_EVENTS.CHANGE, (e) => {
      proj.cover.isVideo = (e.target as HTMLSelectElement).value === STATE_STRINGS.TRUE
    })
    on(`#${CMS_PROJECTS_IDS.COVER_W}`, FORM_EVENTS.INPUT, (e) => {
      proj.cover.size[0] =
        parseInt((e.target as HTMLInputElement).value, 10) || COVER_DIMENSIONS.FHD_WIDTH
    })
    on(`#${CMS_PROJECTS_IDS.COVER_H}`, FORM_EVENTS.INPUT, (e) => {
      proj.cover.size[1] =
        parseInt((e.target as HTMLInputElement).value, 10) || COVER_DIMENSIONS.COVER_HEIGHT_WIDE
    })
  }

  // Section controls
  all(`.${CMS_PROJECTS_CLASSES.SEC_UP}`, (btn) => {
    const i = parseInt(btn.getAttribute(DATA_ATTRS.DATA_IDX) || '0', 10)
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host.moveSection(i, -1))
  })
  all(`.${CMS_PROJECTS_CLASSES.SEC_DOWN}`, (btn) => {
    const i = parseInt(btn.getAttribute(DATA_ATTRS.DATA_IDX) || '0', 10)
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host.moveSection(i, 1))
  })
  all(`.${CMS_PROJECTS_CLASSES.SEC_DEL}`, (btn) => {
    const i = parseInt(btn.getAttribute(DATA_ATTRS.DATA_IDX) || '0', 10)
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host.removeSection(i))
  })
  all(`.${CMS_PROJECTS_CLASSES.SEC_ADD_TEXT}`, (btn) => {
    const s = parseInt(btn.getAttribute(DATA_ATTRS.DATA_SEC) || '0', 10)
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host.addSectionText(s))
  })
  all(`.${CMS_PROJECTS_CLASSES.SEC_ADD_MEDIA}`, (btn) => {
    const s = parseInt(btn.getAttribute(DATA_ATTRS.DATA_SEC) || '0', 10)
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host.addSectionMedia(s))
  })

  // Section text editing
  all(`.${CMS_PROJECTS_CLASSES.SEC_TEXT_INPUT}`, (ta) => {
    const s = parseInt(ta.getAttribute(DATA_ATTRS.DATA_SEC) || '0', 10)
    const t = parseInt(ta.getAttribute(DATA_ATTRS.DATA_TIDX) || '0', 10)
    host.addScopedListener(ta, FORM_EVENTS.INPUT, (e) => {
      ensureSectionShape(host, s)
      const cp = host.currentProject
      if (cp) cp.sections[s][0][t] = (e.target as HTMLInputElement).value
    })
  })
  all(`.${CMS_PROJECTS_CLASSES.SEC_TEXT_DEL}`, (btn) => {
    const s = parseInt(btn.getAttribute(DATA_ATTRS.DATA_SEC) || '0', 10)
    const t = parseInt(btn.getAttribute(DATA_ATTRS.DATA_TIDX) || '0', 10)
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host.removeSectionText(s, t))
  })

  // Media field editing
  all(`.${CMS_PROJECTS_CLASSES.MEDIA_SRC}`, (inp) => {
    const s = parseInt(inp.getAttribute(DATA_ATTRS.DATA_SEC) || '0', 10)
    const m = parseInt(inp.getAttribute(DATA_ATTRS.DATA_MIDX) || '0', 10)
    host.addScopedListener(inp, FORM_EVENTS.INPUT, (e) => {
      const cp = host.currentProject
      if (cp) cp.sections[s][1][m].src = (e.target as HTMLInputElement).value
      host._updateDom()
    })
  })
  all(`.${CMS_PROJECTS_CLASSES.MEDIA_LABEL}`, (inp) => {
    const s = parseInt(inp.getAttribute(DATA_ATTRS.DATA_SEC) || '0', 10)
    const m = parseInt(inp.getAttribute(DATA_ATTRS.DATA_MIDX) || '0', 10)
    host.addScopedListener(inp, FORM_EVENTS.INPUT, (e) => {
      const cp = host.currentProject
      if (cp) cp.sections[s][1][m].label = (e.target as HTMLInputElement).value
    })
  })
  all(`.${CMS_PROJECTS_CLASSES.MEDIA_TYPE}`, (sel) => {
    const s = parseInt(sel.getAttribute(DATA_ATTRS.DATA_SEC) || '0', 10)
    const m = parseInt(sel.getAttribute(DATA_ATTRS.DATA_MIDX) || '0', 10)
    host.addScopedListener(sel, FORM_EVENTS.CHANGE, (e) => {
      const cp = host.currentProject
      if (cp)
        cp.sections[s][1][m].isVideo = (e.target as HTMLInputElement).value === STATE_STRINGS.TRUE
    })
  })
  all(`.${CMS_PROJECTS_CLASSES.MEDIA_W}`, (inp) => {
    const s = parseInt(inp.getAttribute(DATA_ATTRS.DATA_SEC) || '0', 10)
    const m = parseInt(inp.getAttribute(DATA_ATTRS.DATA_MIDX) || '0', 10)
    host.addScopedListener(inp, FORM_EVENTS.INPUT, (e) => {
      const cp = host.currentProject
      if (cp)
        cp.sections[s][1][m].size[0] =
          parseInt((e.target as HTMLInputElement).value, 10) || COVER_DIMENSIONS.FHD_WIDTH
    })
  })
  all(`.${CMS_PROJECTS_CLASSES.MEDIA_H}`, (inp) => {
    const s = parseInt(inp.getAttribute(DATA_ATTRS.DATA_SEC) || '0', 10)
    const m = parseInt(inp.getAttribute(DATA_ATTRS.DATA_MIDX) || '0', 10)
    host.addScopedListener(inp, FORM_EVENTS.INPUT, (e) => {
      const cp = host.currentProject
      if (cp)
        cp.sections[s][1][m].size[1] =
          parseInt((e.target as HTMLInputElement).value, 10) || COVER_DIMENSIONS.FHD_HEIGHT
    })
  })
  all(`.${CMS_PROJECTS_CLASSES.MEDIA_DEL}`, (btn) => {
    const s = parseInt(btn.getAttribute(DATA_ATTRS.DATA_SEC) || '0', 10)
    const m = parseInt(btn.getAttribute(DATA_ATTRS.DATA_MIDX) || '0', 10)
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host.removeSectionMedia(s, m))
  })
}
