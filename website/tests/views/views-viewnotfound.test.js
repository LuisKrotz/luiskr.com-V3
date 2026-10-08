/**
 * @file views-viewnotfound.test.js
 * @description Split from views.test.js — covers the "ViewNotFound" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { ViewNotFound } from '@website/views/not-found/NotFound.js'
import { LOCALES } from '@core/constants.js'
import { SCSS, mount } from '@tests/fixtures/test-constants.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { HOME_MOSAIC_CLASSES } from '@core/tokens/classes/mosaic.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { NOT_FOUND_CLASSES } from '@core/tokens/classes/legal.js'

// ─── Local selector helpers (derived from TAGS/CLASSES) ───────────────────────
const S = {
  DRAW_TEXT: COMPONENT_TAGS.DRAW_TEXT,
  MEDIA_FIGURE: COMPONENT_TAGS.MEDIA_FIGURE,
  PORTFOLIO_RELATED: COMPONENT_TAGS.PORTFOLIO_RELATED,
  HOME_MOSAIC_ITEM: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM}`,
  HOME_MOSAIC_TITLE: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_TITLE}`,
}

// ─────────────────────────────────────────────────────────────────────────────
// ViewNotFound
// ─────────────────────────────────────────────────────────────────────────────
describe('ViewNotFound', () => {
  let notFoundEl
  let cleanup

  beforeEach(() => {
    notFoundEl = new ViewNotFound()
    cleanup = mount(notFoundEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(notFoundEl.shadowRoot).not.toBeNull()
  })

  test('homePath defaults to "/" for English', () => {
    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
    expect(notFoundEl.homePath).toBe('/')
  })

  test('homePath returns "/de" for German', () => {
    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.DE)
    expect(notFoundEl.homePath).toBe(`/${LOCALES.DE}`)
    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
  })

  test('parses emojiLine and subtitle from title with <br>', () => {
    notFoundEl.translations = { title: '(>_<)<br>Page Not Found' }
    expect(notFoundEl.emojiLine).toBe('(>_<)')
    expect(notFoundEl.subtitle).toBe('Page Not Found')
  })

  test('renders emoji title and subtitle when translations are set', () => {
    notFoundEl.translations = { title: '(o_O)<br>Lost in Space', link: 'Return Home' }
    notFoundEl._updateDom()

    const titleEl = notFoundEl.shadowRoot.querySelector(`.${NOT_FOUND_CLASSES.NOT_FOUND_TITLE}`)
    expect(titleEl).not.toBeNull()
    expect(titleEl.textContent).toContain('(o_O)')

    const subEl = notFoundEl.shadowRoot.querySelector(`.${NOT_FOUND_CLASSES.NOT_FOUND_SUBTITLE}`)
    const drawText = subEl.querySelector(S.DRAW_TEXT)
    expect(drawText.getAttribute(FORM_ATTRS.TEXT)).toBe('Lost in Space')

    const linkEl = notFoundEl.shadowRoot.querySelector(`.${NOT_FOUND_CLASSES.NOT_FOUND_LINK}`)
    expect(linkEl.textContent).toContain('Return Home')
  })

  test('clicking return home link navigates to homePath', () => {
    let navigatedTo = null
    const origPush = router.push
    router.push = (path) => {
      navigatedTo = path
    }

    notFoundEl.translations = { title: '(o_O)<br>Lost', link: 'Back' }
    notFoundEl._updateDom()
    notFoundEl._bindLinks()

    const link = notFoundEl.shadowRoot.querySelector(`.${NOT_FOUND_CLASSES.NOT_FOUND_LINK}`)
    link.click()
    expect(navigatedTo).toBe('/')
    router.push = origPush
  })

  test('not-found.scss defines layout, title, subtitle, link', () => {
    expect(SCSS.notFound).toMatch(/\.not-found\s*\{/)
    expect(SCSS.notFound).toMatch(/&-title\s*\{/)
    expect(SCSS.notFound).toMatch(/&-subtitle\s*\{/)
    expect(SCSS.notFound).toMatch(/&-link\s*\{/)
  })
})
