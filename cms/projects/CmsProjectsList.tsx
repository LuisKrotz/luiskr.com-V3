/**
 * @file CmsProjectsList.js
 * @description CMS projects editor: full case-study editing — project
 * list, per-project sections (text blocks + media slots), create/delete
 * project, and save to Firebase. Behavior lives in `@cms/projects/*`
 * modules; this class is the element facade + state holder.
 */

import { LOCALES } from '@core/tokens/locales.js'
import { CMS_TAGS, CMS_EVENTS } from '@cms/tokens.js'
import { BaseComponent } from '@core/Component.js'
import { VALID_LANGS } from '@core/i18n.js'
import cmsStyles from '@cms/sass/cms.scss?inline'
import { bindEvents } from './events.js'
import {
  createProjectPrompt,
  deleteProject,
  loadProjectData,
  loadProjectKeys,
  saveProjectData,
} from './data.js'
import { renderProjects } from './render.js'
import { renderSection } from './section-render.js'
import {
  addSection,
  addSectionMedia,
  addSectionText,
  ensureSectionShape,
  moveSection,
  normalizeSection,
  removeSection,
  removeSectionMedia,
  removeSectionText,
} from './sections.js'
import type { CmsProject, CmsSection } from './types.js'

/**
 * The CmsProjectsList — projects list class.
 */
export class CmsProjectsList extends BaseComponent {
  languages: readonly string[] = VALID_LANGS // all editable locales
  selectedLang: string = LOCALES.EN // locale being edited
  projectKeys: string[] = [] // sorted project slugs from Firebase
  selectedProjectKey = '' // slug under edit
  currentProject: CmsProject | null = null // normalized project model (bound to inputs)
  saving = false // write in flight — disables the save button

  constructor() {
    super(cmsStyles)
  }

  /** Lifecycle: loads the project keys + data. */

  override onMounted() {
    loadProjectKeys(this)
  }

  /** Lifecycle: re-binds after render. */

  override onUpdated() {
    bindEvents(this)
  }

  // ─── Data loading (delegates — @cms/projects/data.ts) ──────────────────────
  loadProjectKeys() {
    return loadProjectKeys(this)
  }
  loadProjectData() {
    return loadProjectData(this)
  }
  createProjectPrompt() {
    return createProjectPrompt(this)
  }
  deleteProject() {
    return deleteProject(this)
  }
  saveProjectData() {
    return saveProjectData(this)
  }

  // ─── Sections (delegates — @cms/projects/sections.ts) ──────────────────────
  _normalizeSection(s: unknown): CmsSection {
    return normalizeSection(s)
  }
  _ensureSectionShape(sIdx: number) {
    ensureSectionShape(this, sIdx)
  }
  addSection() {
    addSection(this)
  }
  removeSection(sIdx: number) {
    removeSection(this, sIdx)
  }
  moveSection(sIdx: number, dir: number) {
    moveSection(this, sIdx, dir)
  }
  addSectionText(sIdx: number) {
    addSectionText(this, sIdx)
  }
  removeSectionText(sIdx: number, tIdx: number) {
    removeSectionText(this, sIdx, tIdx)
  }
  addSectionMedia(sIdx: number) {
    addSectionMedia(this, sIdx)
  }
  removeSectionMedia(sIdx: number, mIdx: number) {
    removeSectionMedia(this, sIdx, mIdx)
  }

  /** Fires a cms-notification toast. */

  _notify(msg: string): void {
    this.dispatchEvent(
      new CustomEvent(CMS_EVENTS.NOTIFY, { bubbles: true, composed: true, detail: msg })
    )
  }

  /** Section card JSX (delegate — @cms/projects/section-render.tsx). */

  _renderSection(sec: CmsSection, sIdx: number, total: number) {
    return renderSection(this, sec, sIdx, total)
  }

  /** Events wiring (delegate — @cms/projects/events.ts). */

  _bindEvents() {
    bindEvents(this)
  }

  /** JSX template (delegate — @cms/projects/render.tsx). */

  override render() {
    return renderProjects(this)
  }
}

if (!customElements.get(CMS_TAGS.CMS_PROJECTS_LIST)) {
  customElements.define(CMS_TAGS.CMS_PROJECTS_LIST, CmsProjectsList)
}
