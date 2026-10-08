/**
 * @file cmsfootereditor-list-tails.test.js
 * @description Split from coverage-tails-7.test.js — covers the "CmsFooterEditor list tails" describe.
 */
import { jest } from '@jest/globals'
import { CMS_FIELD_KEYS, CMS_LIST_PREFIXES, CMS_TAGS } from '@cms/tokens.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { FORM_EVENTS } from '@core/tokens/events/dom.js'
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

describe('CmsFooterEditor list tails', () => {
  test('list input writes label field; out-of-range idx is skipped', async () => {
    const el = document.createElement(CMS_TAGS.CMS_FOOTER_EDITOR)

    document.body.appendChild(el)
    await flush()

    el.contactData = { line1: [{ description: 'd1' }], line2: [{ description: 'x' }] }
    el.legalLinks = [{ page: 'p' }]
    el.relatedFooter = { socials: [{ network: 'n' }] }

    el._updateDom()

    const stray = document.createElement('input')

    stray.className = `${CMS_LIST_PREFIXES.LINE1}-label`
    stray.setAttribute(DATA_ATTRS.DATA_IDX, '99')
    el.shadowRoot.appendChild(stray)

    el._bindListEvents(CMS_LIST_PREFIXES.LINE1, el.contactData.line1)

    const real = el.shadowRoot.querySelector(`.${CMS_LIST_PREFIXES.LINE1}-label`)

    if (real) {
      fire(real, FORM_EVENTS.INPUT, 'edited')
      expect(el.contactData.line1[0].description).toBe('edited')
    }

    fire(stray, FORM_EVENTS.INPUT, 'nope')
    expect(el.contactData.line1).toHaveLength(1)

    el._bindListEvents(CMS_LIST_PREFIXES.LEGAL, el.legalLinks, CMS_FIELD_KEYS.PAGE)
    el._bindListEvents(CMS_LIST_PREFIXES.SOCIAL, el.relatedFooter.socials, CMS_FIELD_KEYS.NETWORK)

    el.remove()
  })
})
