/**
 * @file portfolio/events.ts — list input/button wiring.
 */

import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { FORM_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { CMS_ACTIONS, CMS_PORTFOLIO_IDS } from '@cms/tokens.js'
import type { CmsPortfolioList } from './CmsPortfolioList.js'
import { CMS_PORTFOLIO_CLASSES } from '@cms/tokens.js'

/**
 * Binds events.
 * @param host — the host component
 */
export function bindEvents(host: CmsPortfolioList) {
  const addBtn = host.$(`#${CMS_PORTFOLIO_IDS.ADD_ITEM}`)
  if (addBtn) host.addScopedListener(addBtn, MOUSE_EVENTS.CLICK, () => host.addNewItem())

  const syncBtn = host.$(`#${CMS_PORTFOLIO_IDS.SYNC_ITEMS}`)
  if (syncBtn)
    host.addScopedListener(syncBtn, MOUSE_EVENTS.CLICK, () => host.syncNonLocalizedToAllLangs())

  const saveBtn = host.$(`#${CMS_PORTFOLIO_IDS.SAVE_ITEMS}`)
  if (saveBtn) host.addScopedListener(saveBtn, MOUSE_EVENTS.CLICK, () => host.savePortfolio())

  const langSelect = host.$(`#${CMS_PORTFOLIO_IDS.SELECT_LANG}`)
  if (langSelect) {
    host.addScopedListener(langSelect, FORM_EVENTS.CHANGE, (e) => {
      host.selectedLang = (e.target as HTMLSelectElement).value
      host.loadLangPortfolio()
    })
  }

  host.$$(`[${DATA_ATTRS.DATA_ACTION}]`).forEach((btn) => {
    const action = btn.getAttribute(DATA_ATTRS.DATA_ACTION)
    const idx = parseInt(btn.getAttribute(DATA_ATTRS.DATA_IDX) || CHAR_STRINGS.ZERO, 10)
    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => {
      if (action === CMS_ACTIONS.UP) host.moveUp(idx)
      else if (action === CMS_ACTIONS.DOWN) host.moveDown(idx)
      else if (action === CMS_ACTIONS.DELETE) host.removeItem(idx)
    })
  })

  host.$$(`.${CMS_PORTFOLIO_CLASSES.ITEM_FIELD}`).forEach((input) => {
    const idx = parseInt(input.getAttribute(DATA_ATTRS.DATA_IDX) || CHAR_STRINGS.ZERO, 10)
    const field = input.getAttribute(DATA_ATTRS.DATA_FIELD)

    if (!field) return

    host.addScopedListener(input, FORM_EVENTS.INPUT, (e) => {
      if (host.items[idx]) host.items[idx][field] = (e.target as HTMLInputElement).value
    })
  })

  host.$$(`.${CMS_PORTFOLIO_CLASSES.DIM_FIELD}`).forEach((input) => {
    const idx = parseInt(input.getAttribute(DATA_ATTRS.DATA_IDX) || CHAR_STRINGS.ZERO, 10)
    const prop = input.getAttribute(DATA_ATTRS.DATA_PROP)
    const dimIdx = parseInt(input.getAttribute(DATA_ATTRS.DATA_DIM_IDX) || CHAR_STRINGS.ZERO, 10)

    if (!prop) return

    host.addScopedListener(input, FORM_EVENTS.INPUT, (e) => {
      const item = host.items[idx]

      if (item) host.updateDim(item, prop, dimIdx, (e.target as HTMLInputElement).value)
    })
  })

  host.$$(`.${CMS_PORTFOLIO_CLASSES.FEAT_SELECT}`).forEach((sel) => {
    const idx = parseInt(sel.getAttribute(DATA_ATTRS.DATA_IDX) || CHAR_STRINGS.ZERO, 10)
    host.addScopedListener(sel, FORM_EVENTS.CHANGE, (e) => {
      if (host.items[idx])
        host.items[idx].featured = (e.target as HTMLSelectElement).value === ATTR_VALUES.TRUE
    })
  })
}
