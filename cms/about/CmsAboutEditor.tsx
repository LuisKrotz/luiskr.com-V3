/**
 * @file CmsAboutEditor.js
 * @description CMS about-page editor: bio paragraphs per column, the
 * mentions list, and the Gravatar picture URL (with size presets and a
 * URL generator). Edits write to translations/<locale>/APP via the
 * Firebase SDK; structural fields sync across all locales.
 *
 * Behavior lives in `@cms/about/*` modules (types, data, model, events,
 * render); this class is the element facade + state holder.
 */

import { CMS_TAGS, CMS_EVENTS } from '@cms/tokens.js'
import { BaseComponent } from '@core/Component.js'
import { LOCALES } from '@core/tokens/locales.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { NAV_TEXT } from '@core/tokens/strings/text.js'
import { VALID_LANGS } from '@core/i18n.js'
import cmsStyles from '@cms/sass/cms.scss?inline'
import {
  applyPictureToAllLangs,
  loadAboutData,
  saveAboutData,
  syncNonLocalizedToAllLangs,
} from './data.js'
import { bindEvents } from './events.js'
import {
  addMentionItem,
  addParagraph,
  generateGravatarUrl,
  moveMentionItem,
  moveParagraph,
  removeMentionItem,
  removeParagraph,
  setGravatarSize,
} from './model.js'
import { renderAbout, renderMentionItems, renderParagraphList } from './render.js'
import type { AboutData, BioColumn } from './types.js'

/**
 * The CmsAboutEditor — about editor class.
 */
export class CmsAboutEditor extends BaseComponent {
  languages: readonly string[] = VALID_LANGS
  selectedLang: string = LOCALES.EN
  gravatarSize = 512
  emailInput = ''
  saving = false
  syncingAll = false
  aboutData: AboutData = {
    title: NAV_TEXT.ABOUT,
    profilePicture: CHAR_STRINGS.EMPTY,
    col1: [],
    col2: [],
    mentions: NAV_TEXT.SOME_MENTIONS,
    mention_items: [],
  }

  constructor() {
    super(cmsStyles)
  }

  /** Lifecycle: loads the about data and binds events. */

  override onMounted() {
    this.loadAboutData()
  }

  /** Lifecycle: re-binds after each re-render. */

  override onUpdated() {
    this._bindEvents()
  }

  /** Fires a cms-notification toast. */

  _notify(msg: string): void {
    this.dispatchEvent(
      new CustomEvent(CMS_EVENTS.NOTIFY, { bubbles: true, composed: true, detail: msg })
    )
  }

  // ─── Delegates — @cms/about/* ──────────────────────────────────────────────
  loadAboutData() {
    return loadAboutData(this)
  }
  saveAboutData() {
    return saveAboutData(this)
  }
  applyPictureToAllLangs() {
    return applyPictureToAllLangs(this)
  }
  syncNonLocalizedToAllLangs() {
    return syncNonLocalizedToAllLangs(this)
  }
  setGravatarSize(size: number) {
    setGravatarSize(this, size)
  }
  generateGravatarUrl() {
    return generateGravatarUrl(this)
  }
  addParagraph(col: BioColumn) {
    addParagraph(this, col)
  }
  removeParagraph(col: BioColumn, idx: number) {
    removeParagraph(this, col, idx)
  }
  moveParagraph(col: BioColumn, idx: number, dir: number) {
    moveParagraph(this, col, idx, dir)
  }
  addMentionItem() {
    addMentionItem(this)
  }
  removeMentionItem(idx: number) {
    removeMentionItem(this, idx)
  }
  moveMentionItem(idx: number, dir: number) {
    moveMentionItem(this, idx, dir)
  }
  _bindEvents() {
    bindEvents(this)
  }
  _renderParagraphList(col: BioColumn) {
    return renderParagraphList(this, col)
  }
  _renderMentionItems() {
    return renderMentionItems(this)
  }

  /** JSX template (delegate — @cms/about/render.tsx). */

  override render() {
    return renderAbout(this)
  }
}

if (!customElements.get(CMS_TAGS.CMS_ABOUT_EDITOR)) {
  customElements.define(CMS_TAGS.CMS_ABOUT_EDITOR, CmsAboutEditor)
}
