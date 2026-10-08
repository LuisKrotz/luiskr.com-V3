/**
 * @file CmsPlaygroundEditor.js
 * @description <cms-playground-editor> — playground + slugs editor:
 * three sections per locale — the earth-playground panel labels, the
 * `defaults` sub-node (initial slider/toggle values the site's
 * SpacePlayground merges over its shipped config), and the localized
 * route slugs used by the router and language switcher. Behavior lives
 * in cms/playground-editor/{data,events,render} — this facade keeps the
 * editor's field + lifecycle surface.
 */

import { CMS_TAGS } from '@cms/tokens.js'
import { LOCALES } from '@core/tokens/locales.js'
import { BaseComponent } from '@core/Component.js'
import { VALID_LANGS } from '@core/i18n.js'
import { addEpKey, loadAllData, notify, removeEpKey, saveAll } from './data.js'
import { bindEvents } from './events.js'
import {
  renderDefaults,
  renderLabelRows,
  renderPlaygroundEditor,
  renderSlugRows,
} from './render.js'
import cmsStyles from '@cms/sass/cms.scss?inline'

/**
 * The CmsPlaygroundEditor — playground editor class.
 */
export class CmsPlaygroundEditor extends BaseComponent {
  languages: readonly string[] = VALID_LANGS
  selectedLang: string = LOCALES.EN
  saving = false

  // translations/<loc>/pages/earth-playground — ordered label keys
  epKeys: string[] = []
  epData: Record<string, unknown> = {}

  // translations/<loc>/pages/earth-playground/defaults — control defaults
  epDefaults: Record<string, unknown> = {}

  // translations/<loc>/slugs — per-locale route slugs
  slugs: Record<string, string> = {}

  constructor() {
    super(cmsStyles)
  }

  /** Lifecycle: loads playground data. */

  override onMounted() {
    this.loadAllData()
  }

  /** Lifecycle: re-binds after render. */

  override onUpdated() {
    this._bindEvents()
  }

  /** Reads the playground + slugs nodes for all locales. */

  async loadAllData(): Promise<void> {
    return loadAllData(this)
  }

  /** Writes edits back to Firebase. */

  async saveAll(): Promise<void> {
    return saveAll(this)
  }

  /** Adds a new playground label key. */

  addEpKey() {
    addEpKey(this)
  }

  /** Removes a playground label key. */

  removeEpKey(key: string | null): void {
    removeEpKey(this, key)
  }

  /** Fires a cms-notification toast. */

  _notify(msg: string): void {
    notify(this, msg)
  }

  /** Wires all inputs/buttons. */

  _bindEvents(): void {
    bindEvents(this)
  }

  /** JSX for the playground label key rows. */

  _renderLabelRows() {
    return renderLabelRows(this)
  }

  /** JSX for the playground control defaults (typed per stored value). */

  _renderDefaults() {
    return renderDefaults(this)
  }

  /** JSX for the per-locale slug editor rows. */

  _renderSlugRows() {
    return renderSlugRows(this)
  }

  /** JSX template. */

  override render() {
    return renderPlaygroundEditor(this)
  }
}

if (!customElements.get(CMS_TAGS.CMS_PLAYGROUND_EDITOR)) {
  customElements.define(CMS_TAGS.CMS_PLAYGROUND_EDITOR, CmsPlaygroundEditor)
}
