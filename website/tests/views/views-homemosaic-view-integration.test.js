/**
 * @file views-homemosaic-view-integration.test.js
 * @description Split from views.test.js — covers the "HomeMosaic (view integration)" describe.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { HomeMosaic } from '@website/components/home/HomeMosaic.js'
import { LAYOUT } from '@core/constants.js'
import { SCSS, mount } from '@tests/fixtures/test-constants.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { HOME_MOSAIC_CLASSES } from '@core/tokens/classes/mosaic.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { UI_MUTATIONS } from '@core/tokens/events/mutations.js'
import { INPUT_STRINGS } from '@core/tokens/strings/input.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { DOM_STRINGS } from '@core/tokens/strings/dom.js'

// ─── Local selector helpers (derived from TAGS/CLASSES) ───────────────────────
const S = {
  DRAW_TEXT: COMPONENT_TAGS.DRAW_TEXT,
  MEDIA_FIGURE: COMPONENT_TAGS.MEDIA_FIGURE,
  PORTFOLIO_RELATED: COMPONENT_TAGS.PORTFOLIO_RELATED,
  HOME_MOSAIC_ITEM: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM}`,
  HOME_MOSAIC_TITLE: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_TITLE}`,
}

// ─────────────────────────────────────────────────────────────────────────────
// HomeMosaic (from home view)
// ─────────────────────────────────────────────────────────────────────────────
describe('HomeMosaic (view integration)', () => {
  let mosaicEl
  let cleanup

  beforeEach(() => {
    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.MOUSE)
    mosaicEl = new HomeMosaic()
    cleanup = mount(mosaicEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(mosaicEl.shadowRoot).not.toBeNull()
  })

  test('layout constants are FEAT_MULT=0.48, COMP_MULTS=[0.56,0.58,0.54,0.57,0.55], GAP=16', () => {
    expect(LAYOUT.FEAT_MULT).toBe(0.48)
    expect(LAYOUT.COMP_MULTS).toEqual([0.56, 0.58, 0.54, 0.57, 0.55])
    expect(LAYOUT.GAP).toBe(16)
  })

  test('renders mosaic items with title overlay', () => {
    mosaicEl.processedItems = [
      {
        label: 'Project Alpha',
        link: 'project-alpha',
        image: 'alpha',
        description: 'Branding.',
        featured: false,
      },
      {
        label: 'Project Beta',
        link: 'project-beta',
        image: 'beta',
        description: 'E-commerce.',
        featured: true,
      },
    ]
    mosaicEl._updateDom()

    const items = mosaicEl.shadowRoot.querySelectorAll(S.HOME_MOSAIC_ITEM)
    expect(items.length).toBe(2)
    expect(items[0].tagName).toBe(HTML_TAGS.A.toUpperCase())
    expect(items[0].getAttribute(DOM_STRINGS.HREF)).toBeTruthy()
    expect(items[0].querySelector(HTML_TAGS.BUTTON)).toBeNull()
    const titles = mosaicEl.shadowRoot.querySelectorAll(S.HOME_MOSAIC_TITLE)
    expect(titles[0].textContent).toContain('Project Alpha')
    expect(titles[1].textContent).toContain('Project Beta')
  })

  test('featured card has home-mosaic-item--featured class', () => {
    mosaicEl.processedItems = [
      { label: 'Standard', link: 'std', image: 's1', featured: false },
      { label: 'Featured', link: 'feat', image: 's2', featured: true },
    ]
    mosaicEl._updateDom()
    const items = mosaicEl.shadowRoot.querySelectorAll(S.HOME_MOSAIC_ITEM)
    expect(items[0].classList.contains(HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM_FEATURED)).toBe(false)
    expect(items[1].classList.contains(HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM_FEATURED)).toBe(true)
  })

  test('onHover updates hoveredIdx and expands card details', () => {
    mosaicEl.processedItems = [
      { label: 'Card 1', link: 'c1', image: 'i1', description: 'Desc 1', featured: false },
    ]
    mosaicEl.onHover(0)
    expect(mosaicEl.hoveredIdx).toBe(0)
    expect(mosaicEl.cards[0].bottomH).toBeGreaterThanOrEqual(130)
  })

  test('onLeave resets hoveredIdx to null', () => {
    mosaicEl.hoveredIdx = 0
    mosaicEl.onLeave()
    expect(mosaicEl.hoveredIdx).toBeNull()
  })

  test('onClick routes immediately on non-touch devices', () => {
    const pushSpy = jest.spyOn(router, 'push').mockImplementation(() => {})
    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.MOUSE)
    const item = { title: 'Test Project', link: 'test-project', image: 'test' }
    mosaicEl.onClick(item, 0)
    expect(pushSpy).toHaveBeenCalledWith('/portfolio/test-project')
    pushSpy.mockRestore()
  })

  test('onClick on touch device expands card on first tap without routing', () => {
    const pushSpy = jest.spyOn(router, 'push').mockImplementation(() => {})
    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.TOUCH)
    mosaicEl.touchIdx = null
    const item = { title: 'Touch Project', link: 'touch-project', image: INPUT_STRINGS.TOUCH }
    mosaicEl.onClick(item, 0)
    expect(mosaicEl.touchIdx).toBe(0)
    expect(pushSpy).not.toHaveBeenCalled()
    pushSpy.mockRestore()
  })

  test('onClick on touch device routes on second tap of the active card', () => {
    const pushSpy = jest.spyOn(router, 'push').mockImplementation(() => {})
    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.TOUCH)
    mosaicEl.touchIdx = 0
    const item = { label: 'Touch Project', link: 'touch-project', image: INPUT_STRINGS.TOUCH }
    mosaicEl.onClick(item, 0)
    expect(pushSpy).toHaveBeenCalledWith('/portfolio/touch-project')
    pushSpy.mockRestore()
  })

  test('touch interaction collapses previous card when tapping a new card', () => {
    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.TOUCH)
    mosaicEl.processedItems = [
      { label: 'Card 0', link: 'c0', image: 'i0', description: 'Desc 0' },
      { label: 'Card 1', link: 'c1', image: 'i1', description: 'Desc 1' },
    ]
    mosaicEl._updateDom()
    mosaicEl.touchIdx = 0
    mosaicEl.bottomHMap[0] = 160
    mosaicEl.onClick(mosaicEl.processedItems[1], 1)
    expect(mosaicEl.touchIdx).toBe(1)
    expect(mosaicEl.bottomHMap[0]).toBeUndefined()
  })

  test('skeletonH returns valid px string', () => {
    const h = mosaicEl.skeletonH
    expect(typeof h).toBe(TYPE_STRINGS.STRING)
    expect(h).toMatch(/\d+px$/)
    expect(parseInt(h, 10)).toBeGreaterThan(0)
  })

  test('card geometry includes position absolute, top, left, width, height', () => {
    mosaicEl.processedItems = [{ label: 'Card', link: 'c', image: 'i', featured: false }]
    mosaicEl.quickLayout()
    const cardStyle = mosaicEl.cards[0].card
    expect(cardStyle.position).toBe(STATE_STRINGS.ABSOLUTE)
    expect(cardStyle.top).toMatch(/\d+px$/)
    expect(cardStyle.left).toMatch(/\d+px$/)
    expect(cardStyle.width).toMatch(/\d+px$/)
    expect(cardStyle.height).toMatch(/\d+px$/)
  })

  // ─── SCSS structural assertions ───────────────────────────────────────────
  test('home-mosaic.scss defines container-type: inline-size', () => {
    expect(SCSS.homeMosaic).toMatch(/container-type:\s*inline-size/)
  })

  test('home-mosaic.scss defines hover elevation and scale', () => {
    expect(SCSS.homeMosaic).toMatch(
      /transform:\s*translateY\(-#\{to-rem\(\$space-sm\)\}\)\s*scale\(1\.015\)/
    )
  })

  test('home-mosaic.scss defines image zoom on hover', () => {
    expect(SCSS.homeMosaic).toMatch(/transform:\s*scale\(1\.07\)/)
  })

  test('home-mosaic.scss defines .home-mosaic-title with uppercase and letter-spacing', () => {
    expect(SCSS.homeMosaic).toMatch(/\.home-mosaic-title\s*\{[\s\S]*?text-transform:\s*uppercase/)
  })
})
