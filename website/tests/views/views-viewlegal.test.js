/**
 * @file views-viewlegal.test.js
 * @description Split from views.test.js — covers the "ViewLegal" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { ViewLegal } from '@website/views/legal/Legal.js'
import { ROUTE_NAMES } from '@core/constants.js'
import { SCSS, mount } from '@tests/fixtures/test-constants.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { HOME_MOSAIC_CLASSES } from '@core/tokens/classes/mosaic.js'
import { SKELETON_CLASSES } from '@core/tokens/classes/skeleton.js'
import { INTERNAL_CLASSES } from '@core/tokens/classes/project.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { LEGAL_CLASSES } from '@core/tokens/classes/legal.js'

// ─── Local selector helpers (derived from TAGS/CLASSES) ───────────────────────
const _S = {
  DRAW_TEXT: COMPONENT_TAGS.DRAW_TEXT,
  MEDIA_FIGURE: COMPONENT_TAGS.MEDIA_FIGURE,
  PORTFOLIO_RELATED: COMPONENT_TAGS.PORTFOLIO_RELATED,
  HOME_MOSAIC_ITEM: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM}`,
  HOME_MOSAIC_TITLE: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_TITLE}`,
}

// ─────────────────────────────────────────────────────────────────────────────
// ViewLegal
// ─────────────────────────────────────────────────────────────────────────────
describe('ViewLegal', () => {
  let legalEl
  let cleanup

  beforeEach(() => {
    legalEl = new ViewLegal()
    cleanup = mount(legalEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(legalEl.shadowRoot).not.toBeNull()
  })

  test('renders article and div#main with the legal class', () => {
    const article = legalEl.shadowRoot.querySelector('article')
    expect(article).not.toBeNull()
    const main = legalEl.shadowRoot.querySelector(`div#main.${LEGAL_CLASSES.LEGAL}`)
    expect(main).not.toBeNull()
  })

  test('renders skeleton placeholders when translations is null', () => {
    legalEl.translations = null
    legalEl._updateDom()
    const titleSkel = legalEl.shadowRoot.querySelector(`.${SKELETON_CLASSES.SKELETON_TITLE_SM}`)
    expect(titleSkel).not.toBeNull()
    const descSkels = legalEl.shadowRoot.querySelectorAll(
      `.${INTERNAL_CLASSES.INTERNAL_DESCRIPTION}`
    )
    expect(descSkels.length).toBe(3)
  })

  test('renders document title and sections when translations are provided', () => {
    legalEl.translations = {
      title: ROUTE_NAMES.PRIVACY,
      sections: [
        { title: 'Data Collection', content: ['We collect minimal data.', 'No trackers.'] },
        { title: 'Storage', content: ['Stored in Google Cloud.'] },
      ],
    }
    legalEl._updateDom()

    const title = legalEl.shadowRoot.querySelector(`.${INTERNAL_CLASSES.INTERNAL_TITLE}`)
    const titleDraw = title.querySelector(COMPONENT_TAGS.DRAW_TEXT)
    expect(titleDraw).not.toBeNull()
    expect(titleDraw.getAttribute(FORM_ATTRS.TEXT)).toBe(ROUTE_NAMES.PRIVACY)
    const sections = legalEl.shadowRoot.querySelectorAll(
      `.${INTERNAL_CLASSES.INTERNAL_DESCRIPTION}`
    )
    expect(sections.length).toBe(2)
    const sectionDraws = sections[0].querySelectorAll(COMPONENT_TAGS.DRAW_TEXT)
    expect(sectionDraws[0].getAttribute(FORM_ATTRS.TEXT)).toBe('Data Collection')
  })

  test('renders sections in order when translations arrive without a title', () => {
    legalEl.translations = {
      sections: [{ title: 'Only Section', content: ['Body copy.'] }],
    }
    legalEl._updateDom()

    // No title → the h1 keeps the skeleton slot while the ordered draw plan
    // still schedules section items from a zero cursor.
    const titleSkel = legalEl.shadowRoot.querySelector(`.${SKELETON_CLASSES.SKELETON_TITLE_SM}`)
    expect(titleSkel).not.toBeNull()

    const sections = legalEl.shadowRoot.querySelectorAll(
      `.${INTERNAL_CLASSES.INTERNAL_DESCRIPTION}`
    )
    expect(sections.length).toBe(1)
  })

  test('renders legal-footer component at the bottom', () => {
    const footer = legalEl.shadowRoot.querySelector(COMPONENT_TAGS.LEGAL_FOOTER)
    expect(footer).not.toBeNull()
  })

  test('cleans up router subscription on onDestroy', () => {
    legalEl.onDestroy()
    expect(legalEl._unsubRoute).toBeNull()
  })

  test('internals.scss defines internal-title and internal-description styling', () => {
    expect(SCSS.internals).toMatch(/\.internal\s*\{/)
    expect(SCSS.internals).toMatch(/&-title\s*\{/)
    expect(SCSS.internals).toMatch(/&-description\s*\{/)
  })
})
