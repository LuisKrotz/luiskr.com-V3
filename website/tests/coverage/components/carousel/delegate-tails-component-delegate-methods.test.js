/**
 * @file delegate-tails-component-delegate-methods.test.js
 * @description Split from delegate-tails.test.js — covers the "component delegate methods" describe.
 */
import { describe, test, expect } from '@jest/globals'
import '@website/components/carousel/CustomCarousel.js'
import '@website/components/home/HomeMosaic.js'
import '@website/components/media/DrawText.js'
import '@website/components/dialogs/LangDialog.js'
import '@website/components/feedback/SiteToast.js'
import '@website/components/media/MediaExpanded.js'
import '@website/components/home/AwardsMentions.js'
import '@earth/SpacePlayground.js'
import '@cms/projects/CmsProjectsList.js'
import { TEST_URLS as FIXTURE_URLS } from '@tests/fixtures/test-constants.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'

const SLIDES = [
  { src: 'a.webp', size: [800, 450], label: 'One', canExpand: true },
  { src: 'b.webp', size: [800, 450], label: 'Two', isVideo: true },
]

const _rect = (w = 300, h = 200) => ({ left: 0, top: 0, width: w, height: h, right: w, bottom: h })

afterEach(() => {
  document.body.innerHTML = ''
})

describe('component delegate methods', () => {
  test('custom-carousel _updateRingDom forwards to the ring module', () => {
    const el = document.createElement(COMPONENT_TAGS.CUSTOM_CAROUSEL)

    document.body.appendChild(el)
    el.configure({ items: SLIDES, folder: FIXTURE_URLS.IMG })

    expect(() => el._updateRingDom()).not.toThrow()

    el.remove()
  })

  test('home-mosaic skeletonStyle delegate produces a style string', () => {
    const el = document.createElement(COMPONENT_TAGS.HOME_MOSAIC)

    document.body.appendChild(el)

    expect(el.skeletonStyle({ top: 1, left: 2, w: 3, h: 4 })).toContain('px')

    el.remove()
  })

  test('draw-text _parseTokens delegate parses inline markup', () => {
    const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)

    document.body.appendChild(el)

    const tokens = el._parseTokens('a b')

    expect(Array.isArray(tokens)).toBe(true)

    el.remove()
  })

  test('space-playground _renderControl renders a checkbox row', () => {
    const el = document.createElement('view-space-playground')

    const node = el._renderControl(
      { type: 'checkbox', param: 'paused', label: 'Paused', checked: true },
      {},
      undefined
    )

    expect(node).toBeTruthy()
  })

  test('cms-projects-list _renderSection renders the section template', () => {
    const el = document.createElement('cms-projects-list')

    const node = el._renderSection([['text one'], []], 0, 1)

    expect(node).toBeTruthy()
  })
})
