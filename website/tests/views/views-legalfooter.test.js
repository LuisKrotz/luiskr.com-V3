/**
 * @file views-legalfooter.test.js
 * @description Split from views.test.js — covers the "LegalFooter" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { LegalFooter, getFallbackLegalLinks } from '@website/components/legal/Footer.js'
import { LOCALES, ROUTE_NAMES } from '@core/constants.js'
import { mount } from '@tests/fixtures/test-constants.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { HOME_MOSAIC_CLASSES } from '@core/tokens/classes/mosaic.js'
import { INTERNAL_CLASSES } from '@core/tokens/classes/project.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { LINK_ATTRS } from '@core/tokens/attrs/link.js'

// ─── Local selector helpers (derived from TAGS/CLASSES) ───────────────────────
const _S = {
  DRAW_TEXT: COMPONENT_TAGS.DRAW_TEXT,
  MEDIA_FIGURE: COMPONENT_TAGS.MEDIA_FIGURE,
  PORTFOLIO_RELATED: COMPONENT_TAGS.PORTFOLIO_RELATED,
  HOME_MOSAIC_ITEM: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM}`,
  HOME_MOSAIC_TITLE: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_TITLE}`,
}

// ─────────────────────────────────────────────────────────────────────────────
// LegalFooter
// ─────────────────────────────────────────────────────────────────────────────
describe('LegalFooter', () => {
  let footerEl
  let cleanup

  beforeEach(() => {
    footerEl = new LegalFooter()
    cleanup = mount(footerEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(footerEl.shadowRoot).not.toBeNull()
  })

  test('getFallbackLegalLinks returns 4 valid links for English locale', () => {
    const links = getFallbackLegalLinks(LOCALES.EN)
    expect(links.length).toBe(4)
    expect(links[0].page).toBe(ROUTE_NAMES.HOME)
    expect(links[0].link).toBe('/')
    expect(links[1].page).toBe(ROUTE_NAMES.PRIVACY)
    expect(links[2].page).toBe(ROUTE_NAMES.GDPR)
    expect(links[3].page).toBe(ROUTE_NAMES.TERMS)
  })

  test('getFallbackLegalLinks localizes paths for Portuguese (br) and labels come from the live components dictionary', () => {
    const links = getFallbackLegalLinks(LOCALES.BR)
    expect(links.length).toBe(4)
    expect(links[0].link).toBe('/br/')
    expect(links[1].link).toBe('/br/politica-de-privacidade')
    expect(links[3].link).toBe('/br/termos-de-uso')
    // No locale-specific copy lives in JS: without the live dictionary the EN snapshot labels are used
    expect(links[1].page).toBe(ROUTE_NAMES.PRIVACY)
  })

  test('getFallbackLegalLinks localizes paths for German (de)', () => {
    const links = getFallbackLegalLinks(LOCALES.DE)
    expect(links.length).toBe(4)
    expect(links[0].link).toBe('/de/')
    expect(links[1].link).toBe('/de/datenschutzrichtlinie')
    expect(links[3].link).toBe('/de/nutzungsbedingungen')
  })

  test('renders fallback links when store has no legal links', () => {
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {})
    footerEl._updateDom()
    const links = footerEl.shadowRoot.querySelectorAll(
      `.${INTERNAL_CLASSES.INTERNAL_FOOTER_ITEMS_LINK}`
    )
    expect(links.length).toBe(4)
    // The docs-portal entry lives on the home footer — legal pages have
    // no docs row anymore.
    expect(
      footerEl.shadowRoot.querySelector(`.${INTERNAL_CLASSES.INTERNAL_FOOTER_DOCS_LINK}`)
    ).toBeNull()
  })

  test('clicking link calls router.push with link href', () => {
    let pushedHref = null
    const origPush = router.push
    router.push = (href) => {
      pushedHref = href
    }

    footerEl._updateDom()
    const firstLink = footerEl.shadowRoot.querySelector('a')
    firstLink.click()
    expect(pushedHref).toBe(firstLink.getAttribute(LINK_ATTRS.HREF))
    router.push = origPush
  })
})
