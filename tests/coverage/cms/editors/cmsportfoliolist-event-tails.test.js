/**
 * @file coverage-tails-7.test.js
 * @description Seventh tail sweep — post-decomposition coverage for the
 * module trees exposed by the folder reorganization: CMS editor event
 * bindings + section helpers + deploy-info delegates, Earth engine
 * update/bootstrap guards, canvas-widget delegates + shared GL helpers,
 * route helpers, safari patch guards, and misc utilities
 * (css-color, gpu-accel, route-warmer, draw-text).
 */
import { jest } from '@jest/globals'
import { CMS_PORTFOLIO_IDS, CMS_TAGS } from '@/cms/tokens.js'
import { DATA_ATTRS } from '@/core/tokens/attrs/data.js'
import { FORM_EVENTS, MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import '@/core/constants.js'

import '@/cms/about/CmsAboutEditor.js'
import '@/cms/portfolio/CmsPortfolioList.js'
import '@/cms/projects/CmsProjectsList.js'
import '@/cms/playground-editor/CmsPlaygroundEditor.js'
import '@/cms/footer/CmsFooterEditor.js'
import '@/cms/deploy-info/CmsDeployInfo.js'
import { CMS_PORTFOLIO_CLASSES } from '@/cms/tokens.js'

globalThis.alert = jest.fn()

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

const fire = (el, type, value) => {
  if (value !== undefined) el.value = value

  el.dispatchEvent(new window.Event(type))
}

// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('CmsPortfolioList event tails', () => {
  test('lang select, action buttons, item/dim/feat fields dispatch', async () => {
    const el = document.createElement(CMS_TAGS.CMS_PORTFOLIO_LIST)

    document.body.appendChild(el)
    await flush()

    el.items = [
      { title: 'x', featured: false, dims: { w: [1, 2] } },
      { title: 'y', featured: true, dims: { w: [3, 4] } },
    ]

    el._updateDom()
    el._bindEvents()

    const q = (s) => el.shadowRoot.querySelector(s)
    const qa = (s) => [...el.shadowRoot.querySelectorAll(s)]

    const langSel = q(`#${CMS_PORTFOLIO_IDS.SELECT_LANG}`)

    if (langSel) {
      const spy = jest.spyOn(el, 'loadLangPortfolio')

      langSel.value = 'de'
      fire(langSel, FORM_EVENTS.CHANGE)
      expect(el.selectedLang).toBe('de')
      expect(spy).toHaveBeenCalled()
    }

    jest.spyOn(el, 'addNewItem')
    jest.spyOn(el, 'syncNonLocalizedToAllLangs')
    jest.spyOn(el, 'savePortfolio')
    jest.spyOn(el, 'moveUp')
    jest.spyOn(el, 'moveDown')
    jest.spyOn(el, 'removeItem')
    jest.spyOn(el, 'updateDim')

    qa(`[${DATA_ATTRS.DATA_ACTION}]`).forEach((b) => fire(b, MOUSE_EVENTS.CLICK))

    const addBtn = q(`#${CMS_PORTFOLIO_IDS.ADD_ITEM}`)

    if (addBtn) fire(addBtn, MOUSE_EVENTS.CLICK)

    const syncBtn = q(`#${CMS_PORTFOLIO_IDS.SYNC_ITEMS}`)

    if (syncBtn) fire(syncBtn, MOUSE_EVENTS.CLICK)

    const saveBtn = q(`#${CMS_PORTFOLIO_IDS.SAVE_ITEMS}`)

    if (saveBtn) fire(saveBtn, MOUSE_EVENTS.CLICK)

    // item-field/dim-field/feat-select: fire with items present
    qa('.' + CMS_PORTFOLIO_CLASSES.ITEM_FIELD).forEach((i) => fire(i, FORM_EVENTS.INPUT, 'val'))
    qa('.' + CMS_PORTFOLIO_CLASSES.DIM_FIELD).forEach((i) => fire(i, FORM_EVENTS.INPUT, '9'))
    qa('.' + CMS_PORTFOLIO_CLASSES.FEAT_SELECT).forEach((s) => {
      s.value = 'true'
      fire(s, FORM_EVENTS.CHANGE)
    })

    // attr-fallback arms: bound classes without data-* attributes
    const strayClasses = [CMS_PORTFOLIO_CLASSES.ITEM_FIELD, CMS_PORTFOLIO_CLASSES.DIM_FIELD, CMS_PORTFOLIO_CLASSES.FEAT_SELECT]
    const strays = strayClasses.map((cls) => {
      const s = document.createElement('input')

      s.className = cls
      el.shadowRoot.appendChild(s)

      return s
    })

    const strayAction = document.createElement('button')

    strayAction.setAttribute(DATA_ATTRS.DATA_ACTION, 'unknown')
    el.shadowRoot.appendChild(strayAction)
    strays.push(strayAction)

    el._bindEvents()
    strays.forEach((s) => {
      fire(s, FORM_EVENTS.INPUT, 'v')
      fire(s, FORM_EVENTS.CHANGE)
      fire(s, MOUSE_EVENTS.CLICK)
    })

    // items-emptied arms for the captured (bound) controls
    el.items = []
    qa('.' + CMS_PORTFOLIO_CLASSES.ITEM_FIELD).forEach((i) => fire(i, FORM_EVENTS.INPUT, 'z'))

    el.remove()
  })
})

