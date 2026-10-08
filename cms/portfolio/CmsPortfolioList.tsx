/**
 * @file CmsPortfolioList.js
 * @description CMS portfolio-list editor: the home page's ordered project
 * grid — item order, media dimensions and cover assignment per locale,
 * with structural fields synced across all locales.
 *
 * Behavior lives in `@cms/portfolio/*` modules (types, model, data,
 * events, render); this class is the element facade + state holder.
 */

import { CMS_TAGS } from '@cms/tokens.js'
import { BaseComponent } from '@core/Component.js'
import { LOCALES } from '@core/tokens/locales.js'
import { VALID_LANGS } from '@core/i18n.js'
import cmsStyles from '@cms/sass/cms.scss?inline'
import { loadLangPortfolio, savePortfolio, syncNonLocalizedToAllLangs } from './data.js'
import { bindEvents } from './events.js'
import { addNewItem, getImagePreview, moveDown, moveUp, removeItem, updateDim } from './model.js'
import { renderItem, renderPortfolioList } from './render.js'
import type { PortfolioItem } from './types.js'

/**
 * The CmsPortfolioList — portfolio list class.
 */
export class CmsPortfolioList extends BaseComponent {
  languages: readonly string[] = VALID_LANGS // all editable locales
  selectedLang: string = LOCALES.EN // locale under edit
  items: PortfolioItem[] = [] // normalized portfoliolist rows bound to the form
  saving = false // Firebase write in flight

  constructor() {
    super(cmsStyles)
  }

  /** Lifecycle: loads the portfolio list. */

  override onMounted() {
    this.loadLangPortfolio()
  }

  // ─── Delegates — @cms/portfolio/* ──────────────────────────────────────────
  getImagePreview(imgName: string | undefined) {
    return getImagePreview(imgName)
  }
  updateDim(item: PortfolioItem, prop: string, idx: number, val: string) {
    updateDim(item, prop, idx, val)
  }
  loadLangPortfolio() {
    return loadLangPortfolio(this)
  }
  addNewItem() {
    addNewItem(this)
  }
  removeItem(idx: number) {
    removeItem(this, idx)
  }
  moveUp(idx: number) {
    moveUp(this, idx)
  }
  moveDown(idx: number) {
    moveDown(this, idx)
  }
  syncNonLocalizedToAllLangs() {
    return syncNonLocalizedToAllLangs(this)
  }
  savePortfolio() {
    return savePortfolio(this)
  }
  _bindEvents() {
    bindEvents(this)
  }
  _renderItem(item: PortfolioItem, idx: number) {
    return renderItem(this, item, idx)
  }

  /** JSX template (delegate — @cms/portfolio/render.tsx). */

  override render() {
    return renderPortfolioList(this)
  }
}

if (!customElements.get(CMS_TAGS.CMS_PORTFOLIO_LIST)) {
  customElements.define(CMS_TAGS.CMS_PORTFOLIO_LIST, CmsPortfolioList)
}
