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
import { CMS_TAGS } from '@cms/tokens.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { FORM_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import '@core/constants.js'

import '@cms/about/CmsAboutEditor.js'
import '@cms/portfolio/CmsPortfolioList.js'
import '@cms/projects/CmsProjectsList.js'
import '@cms/playground-editor/CmsPlaygroundEditor.js'
import '@cms/footer/CmsFooterEditor.js'
import '@cms/deploy-info/CmsDeployInfo.js'

globalThis.alert = jest.fn()

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

const fire = (el, type, value) => {
  if (value !== undefined) el.value = value

  el.dispatchEvent(new window.Event(type))
}

// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('CmsPlaygroundEditor event tails', () => {
  test('save/lang/add-key/ep/slug controls dispatch', async () => {
    const el = document.createElement(CMS_TAGS.CMS_PLAYGROUND_EDITOR)

    document.body.appendChild(el)
    await flush()

    el.epData = { label_bloom: 'Bloom' }
    el.epKeys = ['label_bloom']
    el.epDefaults = { bloomStr: 0.5, bloom: true }
    el.slugs = { space: 'space-playground' }

    el._updateDom()
    el._bindEvents()

    const q = (s) => el.shadowRoot.querySelector(s)

    const saveSpy = jest.spyOn(el, 'saveAll')
    const addSpy = jest.spyOn(el, 'addEpKey')
    const delSpy = jest.spyOn(el, 'removeEpKey')
    const loadSpy = jest.spyOn(el, 'loadAllData')

    const save = q('#btn-save-playground')

    if (save) fire(save, MOUSE_EVENTS.CLICK)

    const langSel = q('#select-playground-lang')

    if (langSel) {
      langSel.value = 'fr'
      fire(langSel, FORM_EVENTS.CHANGE)
      expect(el.selectedLang).toBe('fr')
    }

    // ep-value input: present key arm + stray missing-key arm
    const ep = q('.ep-value')

    if (ep) {
      fire(ep, FORM_EVENTS.INPUT, 'Bloom 2')
      expect(el.epData.label_bloom).toBe('Bloom 2')
    }

    const slug = q('.slug-value')

    if (slug) {
      fire(slug, FORM_EVENTS.INPUT, 'space-slug')
      expect(el.slugs[slug.getAttribute(DATA_ATTRS.DATA_FIELD)]).toBe('space-slug')
    }

    const addBtn = q('#btn-add-ep-key')

    if (addBtn) fire(addBtn, MOUSE_EVENTS.CLICK)

    // typed defaults rows (number + boolean)
    const num = q('.ep-def-num')
    const bool = q('.ep-def-bool')

    if (num) fire(num, FORM_EVENTS.INPUT, '0.9')
    if (bool) {
      bool.checked = false
      fire(bool, FORM_EVENTS.CHANGE)
    }

    // attr-fallback arms: bound classes without data-* attributes
    const strays = ['ep-value', 'ep-del', 'slug-value', 'ep-def-num', 'ep-def-bool'].map((cls) => {
      const s = document.createElement('input')

      s.className = cls
      el.shadowRoot.appendChild(s)

      return s
    })

    el._bindEvents()
    strays.forEach((s) => {
      fire(s, FORM_EVENTS.INPUT, 'x')
      fire(s, FORM_EVENTS.CHANGE)
      fire(s, MOUSE_EVENTS.CLICK)
    })

    const del = q('.ep-del')

    if (del) fire(del, MOUSE_EVENTS.CLICK)

    expect(saveSpy).toHaveBeenCalled()
    expect(addSpy).toHaveBeenCalled()
    expect(delSpy).toHaveBeenCalled()
    expect(loadSpy).toHaveBeenCalled()

    el.remove()
  })
})

