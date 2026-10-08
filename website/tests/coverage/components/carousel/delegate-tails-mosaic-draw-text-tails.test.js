/**
 * @file delegate-tails-mosaic-draw-text-tails.test.js
 * @description Split from delegate-tails.test.js — covers the "mosaic + draw-text tails" describe.
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
import { cardIdxFromEvent } from '@website/components/home/mosaic/interactions.js'
import { computeMosaicLayout, packMosaicSkeleton } from '@website/components/home/mosaic/pack.js'
import { renderWordHtml, tokenToHtml } from '@website/components/media/draw-text/render.js'

const _SLIDES = [
  { src: 'a.webp', size: [800, 450], label: 'One', canExpand: true },
  { src: 'b.webp', size: [800, 450], label: 'Two', isVideo: true },
]

const _rect = (w = 300, h = 200) => ({ left: 0, top: 0, width: w, height: h, right: w, bottom: h })

afterEach(() => {
  document.body.innerHTML = ''
})

describe('mosaic + draw-text tails', () => {
  test('cardIdxFromEvent defaults idx for a card without data-index', () => {
    const item = document.createElement('div')

    item.className = 'home-mosaic-item'

    const res = cardIdxFromEvent({ target: item })

    expect(res.idx).toBe(0)
  })

  test('computeMosaicLayout returns null on an unusable grid', () => {
    expect(computeMosaicLayout(1, [{ featured: false }], () => 0)).toBeNull()
  })

  test('packMosaicSkeleton degenerates on an unusable grid', () => {
    const res = packMosaicSkeleton(1)

    expect(res.boxes).toEqual([])
  })

  test('tokenToHtml label arm + renderWordHtml defaults', () => {
    // tag-less tag token → children pass through unwrapped (no <undefined>)
    expect(tokenToHtml({ type: 'tag', chunks: [] }, () => 'x')).toBe('')

    // renderWordHtml with no chars → the `= []` default arm
    expect(renderWordHtml(undefined, 0, 5, 0, true)).toContain('--wi: 0')
    expect(renderWordHtml(undefined, 0, 5, 0, false)).toContain('--wi: 0')
  })
})
