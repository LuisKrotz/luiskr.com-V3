/**
 * @file CmsFooterEditor.js
 * @description CMS footer editor: credit/source lines and the social/other
 * channel lists, with non-localized fields synced across locales on save.
 *
 * Facade — model/load/save/sync/list/render live in ../footer/.
 */

import { CMS_TAGS, CMS_EVENTS } from '@/cms/tokens.js'
import { BaseComponent } from '@/core/Component.js'
import { h } from '@/core/jsx.js'
import { LOCALES } from '@/core/tokens/locales.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { NAV_TEXT } from '@/core/tokens/strings/text.js'
import { VALID_LANGS } from '@/core/i18n.js'
import { loadAllData, saveAll, syncLine1ToAllLangs, syncSocialsToAllLangs } from './data.js'
import { addItem, bindListEvents, moveItem, removeItem, renderChannelList } from './lists.js'
import { bindEvents } from './events.js'
import { renderFooterEditor } from './render.js'
import type { ContactData, FooterChannel, RelatedFooter } from './types.js'
import cmsStyles from '@/cms/sass/cms.scss?inline'

/**
 * The CmsFooterEditor — footer editor class.
 */
export class CmsFooterEditor extends BaseComponent {
  languages: readonly string[] = VALID_LANGS // all editable locales
  selectedLang: string = LOCALES.EN // locale under edit
  saving = false // Firebase write in flight
  syncing = false // cross-locale sync in flight

  // Section 1: Main Contact Footer — components/contact:
  //   {title, line1:[{description,link}], line2:[{description,link}]}
  contactData: ContactData = { title: NAV_TEXT.CONTACT, line1: [], line2: [] }
  // Section 2: Legal Footer Navigation — components/legal-footer:
  //   {links:[{page,link}]} — 'page' is the label the site renders
  legalLinks: FooterChannel[] = []
  // Section 3: Case Study Footer — components/related:
  //   {title, note (disclaimer HTML), socials:[{network,link}]}
  relatedFooter: RelatedFooter = { title: NAV_TEXT.RELATED, note: CHAR_STRINGS.EMPTY, socials: [] }
  // Unknown keys on components/related (e.g. projects/path) are
  // captured here and spread back on save — the editor edits a subset
  // without silently deleting the rest of the node.
  relatedExtra: Record<string, unknown> = {}

  constructor() {
    super(cmsStyles)
  }

  /** Lifecycle: loads footer data. */

  override onMounted() {
    this.loadAllData()
  }

  /** Lifecycle: re-binds after render. */

  override onUpdated() {
    this._bindEvents()
  }

  /** Reads the footer nodes for the selected locale. */

  async loadAllData() {
    return loadAllData(this)
  }

  /** Writes the footer model back to Firebase. */

  async saveAll(): Promise<void> {
    return saveAll(this)
  }

  /** Propagates the source/credit line to every locale. */

  async syncLine1ToAllLangs() {
    return syncLine1ToAllLangs(this)
  }

  /** Propagates the social-channel list to every locale. */

  async syncSocialsToAllLangs() {
    return syncSocialsToAllLangs(this)
  }

  /** Appends an item to a channel list and re-renders. */

  _addItem(arr: FooterChannel[], item: FooterChannel): void {
    addItem(this, arr, item)
  }

  /** Removes an item by index and re-renders. */

  _removeItem(arr: FooterChannel[], idx: number): void {
    removeItem(this, arr, idx)
  }

  /** Moves an item up/down within its list. */

  _moveItem(arr: FooterChannel[], idx: number, dir: number): void {
    moveItem(this, arr, idx, dir)
  }

  /** Fires a cms-notification toast. */

  _notify(msg: string): void {
    this.dispatchEvent(
      new CustomEvent(CMS_EVENTS.NOTIFY, { bubbles: true, composed: true, detail: msg })
    )
  }

  /**
   * One editable channel list — see footer/lists.ts for the
   * prefix-namespaced row markup.
   */
  _renderChannelList(arr: FooterChannel[], prefix: string, addFn: string, labelField?: string) {
    return renderChannelList(this, arr, prefix, addFn, labelField)
  }

  /** Wires add/remove/move/input handlers for a rendered list. */

  _bindListEvents(prefix: string, arr: FooterChannel[], labelField?: string): void {
    bindListEvents(this, prefix, arr, labelField)
  }

  /** Wires the whole form. */

  _bindEvents(): void {
    bindEvents(this)
  }

  /** JSX template. */

  override render() {
    return renderFooterEditor(this)
  }
}

if (!customElements.get(CMS_TAGS.CMS_FOOTER_EDITOR)) {
  customElements.define(CMS_TAGS.CMS_FOOTER_EDITOR, CmsFooterEditor)
}
