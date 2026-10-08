/**
 * @file views-source-file-structure.test.js
 * @description Split from views.test.js — covers the "Source file structure" describe.
 */
import { describe, test, expect } from '@jest/globals'
import { SRC } from '@tests/fixtures/test-constants.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { HOME_MOSAIC_CLASSES } from '@core/tokens/classes/mosaic.js'
import { NOT_FOUND_CLASSES } from '@core/tokens/classes/legal.js'

// ─── Local selector helpers (derived from TAGS/CLASSES) ───────────────────────
const _S = {
  DRAW_TEXT: COMPONENT_TAGS.DRAW_TEXT,
  MEDIA_FIGURE: COMPONENT_TAGS.MEDIA_FIGURE,
  PORTFOLIO_RELATED: COMPONENT_TAGS.PORTFOLIO_RELATED,
  HOME_MOSAIC_ITEM: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM}`,
  HOME_MOSAIC_TITLE: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_TITLE}`,
}

// ─────────────────────────────────────────────────────────────────────────────
// JS source structure assertions
// ─────────────────────────────────────────────────────────────────────────────
describe('Source file structure', () => {
  test('Home view contains HOME_MOSAIC, ABOUT_SECTION, CONTACT_SECTION, AWARDS_MENTIONS', () => {
    expect(SRC.Home).toContain('HOME_MOSAIC')
    expect(SRC.Home).toContain('id="about"')
    expect(SRC.Home).toContain('ABOUT_SECTION')
    expect(SRC.Home).toContain('id="contact"')
    expect(SRC.Home).toContain('CONTACT_SECTION')
    expect(SRC.Home).toContain('AWARDS_MENTIONS')
  })

  test('Project view contains INTERNAL_TITLE, INTERNAL_MAIN, custom-carousel, portfolio-related', () => {
    expect(SRC.Project).toContain('INTERNAL_TITLE')
    expect(SRC.Project).toContain('INTERNAL_MAIN')
    expect(SRC.Project).toContain('INTERNAL_DESCRIPTION')
    expect(SRC.Project).toContain(COMPONENT_TAGS.CUSTOM_CAROUSEL)
    expect(SRC.Project).toContain(COMPONENT_TAGS.PORTFOLIO_RELATED)
  })

  test('Legal view contains INTERNAL_TITLE, INTERNAL_DESCRIPTION, LEGAL_FOOTER', () => {
    expect(SRC.Legal).toContain('INTERNAL_TITLE')
    expect(SRC.Legal).toContain('INTERNAL_DESCRIPTION')
    expect(SRC.Legal).toContain('INTERNAL_DESCRIPTION_TEXT')
    expect(SRC.Legal).toContain('LEGAL_FOOTER')
  })

  test('NotFound view contains not-found class references', () => {
    expect(SRC.NotFound).toContain(NOT_FOUND_CLASSES.NOT_FOUND)
  })

  test('PortfolioRelated contains RELATED_MOSAIC, RELATED_MOSAIC_ITEM, INTERNAL_FOOTER_ITEMS_NOTE', () => {
    expect(SRC.PortfolioRelated).toContain('RELATED_MOSAIC')
    expect(SRC.PortfolioRelated).toContain('RELATED_MOSAIC_ITEM')
    expect(SRC.PortfolioRelated).toContain('INTERNAL_FOOTER_ITEMS_NOTE')
  })

  test('LegalFooter contains INTERNAL_FOOTER, INTERNAL_FOOTER_ITEMS_LINK, INTERNAL_FOOTER_ITEMS_SEP', () => {
    expect(SRC.LegalFooter).toContain('INTERNAL_FOOTER')
    expect(SRC.LegalFooter).toContain('INTERNAL_FOOTER_ITEMS_LINK')
    expect(SRC.LegalFooter).toContain('CONTACT_OTHER_LINK')
    expect(SRC.LegalFooter).toContain('INTERNAL_FOOTER_ITEMS_SEP')
  })
})
