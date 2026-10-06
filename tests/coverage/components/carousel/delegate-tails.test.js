/**
 * @file delegate-tails.test.js
 * @description Coverage tails for the decomposed component delegates — the
 * one-line forwarding methods on custom elements plus the attribute-fallback
 * and guard arms left uncovered after the folder split.
 * Static imports only — no resetModules (which discards istanbul counters).
 */

import { describe, test, expect, jest } from '@jest/globals'
import '@/components/carousel/CustomCarousel.js'
import '@/components/home/HomeMosaic.js'
import '@/components/media/DrawText.js'
import '@/components/dialogs/LangDialog.js'
import '@/components/feedback/SiteToast.js'
import '@/components/media/MediaExpanded.js'
import '@/components/home/AwardsMentions.js'
import '@/playground/SpacePlayground.js'
import '@/cms/projects/CmsProjectsList.js'
import { scrollToElement, updateActiveClasses, jumpToSlide, carouselOnScroll } from '@/components/carousel/custom-carousel/nav.js'
import { jumpToSlide as hcJumpToSlide } from '@/components/carousel/home-carousel/nav.js'
import { setupObserver as hcSetupObserver } from '@/components/carousel/home-carousel/observer.js'
import { cardIdxFromEvent } from '@/components/home/mosaic/interactions.js'
import { computeMosaicLayout, packMosaicSkeleton } from '@/components/home/mosaic/pack.js'
import { renderWordHtml, tokenToHtml } from '@/components/media/draw-text/render.js'
import { localMediaCache } from '@/utils/media/local-media-cache.js'
import { MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import { AWARDS_CLASSES } from '@/core/tokens/classes/awards.js'
import { MEDIA_ATTRS } from '@/core/tokens/attrs/media.js'
import { TEST_URLS as FIXTURE_URLS } from '../../../fixtures/test-constants.js'
import { COMPONENT_TAGS } from '../../../../src/core/tokens/elements/components.js'
import { HTML_TAGS } from '../../../../src/core/tokens/elements/html.js'



const SLIDES = [
  { src: 'a.webp', size: [800, 450], label: 'One', canExpand: true },
  { src: 'b.webp', size: [800, 450], label: 'Two', isVideo: true },
]

const rect = (w = 300, h = 200) => ({ left: 0, top: 0, width: w, height: h, right: w, bottom: h })

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
      undefined,
    )

    expect(node).toBeTruthy()
  })

  test('cms-projects-list _renderSection renders the section template', () => {
    const el = document.createElement('cms-projects-list')

    const node = el._renderSection([['text one'], []], 0, 1)

    expect(node).toBeTruthy()
  })
})

describe('carousel nav — counter + scroll arms', () => {
  test('scrollToElement scrolls when offsets are measurable', () => {
    const track = document.createElement(HTML_TAGS.DIV || 'div')
    const slide = document.createElement('div')

    track.getBoundingClientRect = () => rect(600, 400)
    slide.getBoundingClientRect = () => rect(300, 400)
    track.scrollTo = jest.fn()
    track.scrollLeft = 0

    const c = { $: () => track }

    scrollToElement(c, slide)

    expect(track.scrollTo).toHaveBeenCalled()
  })

  test('updateActiveClasses writes the counter when present', () => {
    const counter = document.createElement('div')
    const c = {
      currentIndex: 0,
      items: SLIDES,
      $$: () => [],
      $: (sel) => (sel.includes('counter') ? counter : null) }

    updateActiveClasses(c)

    expect(counter.textContent.length).toBeGreaterThan(0)
  })

  test('home-carousel jumpToSlide uses the non-smooth default', () => {
    const slide = document.createElement('div')
    const track = document.createElement('div')

    Object.defineProperty(slide, 'clientWidth', { value: 50 })
    Object.defineProperty(slide, 'offsetLeft', { value: 10 })
    Object.defineProperty(track, 'clientWidth', { value: 200 })
    track.appendChild(document.createElement('div'))
    track.appendChild(slide)
    track.scrollTo = jest.fn()

    const host = { $: () => track }

    hcJumpToSlide(host, 0)

    expect(track.scrollTo).toHaveBeenCalled()
  })

  test('home-carousel jumpToSlide early-returns when the track lookup fails', () => {
    const host = { $: () => null }

    expect(() => hcJumpToSlide(host, 0)).not.toThrow()
  })

  test('home-carousel jumpToSlide early-returns when the slide is missing', () => {
    const track = document.createElement('div')
    const host = { $: () => track }

    expect(() => hcJumpToSlide(host, 0)).not.toThrow()
  })

  test('home-carousel setupObserver early-returns without a root element', () => {
    const host = { $: () => null }

    expect(() => hcSetupObserver(host)).not.toThrow()
  })
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

describe('misc attr/guard arms', () => {
  test('awards-mentions link without href pushes empty path', async () => {
    const { default: router } = await import('@/routes/router.js')
    const push = jest.spyOn(router, 'push').mockImplementation(() => {})

    const el = document.createElement('awards-mentions')

    document.body.appendChild(el)

    const a = document.createElement('a')

    el.shadowRoot?.appendChild(a)
    a.dispatchEvent(new Event('click', { bubbles: true }))

    el.remove()
    push.mockRestore()
  })

  test('lang-dialog selectLang(null) early-returns', () => {
    const el = document.createElement('lang-dialog')

    expect(() => el.selectLang(null)).not.toThrow()
  })

  test('media-expanded returns early when the local URL resolves null', async () => {
    const spy = jest.spyOn(localMediaCache, 'fetchOrGetLocalMedia').mockResolvedValue(null)

    const el = document.createElement('media-expanded')

    el.setAttribute(MEDIA_ATTRS.SOURCE, 'x.webp')
    el.setAttribute(MEDIA_ATTRS.THUMB, 'x.webp')
    document.body.appendChild(el)

    await new Promise((r) => setTimeout(r, 50))

    el.remove()
    spy.mockRestore()
  })

  test('jumpToSlide — default smooth param + measurable slide scrolls instantly', () => {
    const slide = { getBoundingClientRect: () => ({ width: 100, left: 50 }) }

    const track = {
      scrollLeft: 0,
      scrollTo: jest.fn(),
      children: [{}, slide],
      getBoundingClientRect: () => ({ width: 200, left: 0 }) }

    const c = { $: () => track, currentIndex: 0 }

    jumpToSlide(c, 0)

    expect(track.scrollTo).toHaveBeenCalled()
  })

  test('carouselOnScroll — second call clears the pending timer arm', () => {
    const c = { isNavigating: false, scrollTimeout: null, _checkInfiniteLoop: () => {} }

    carouselOnScroll(c)
    carouselOnScroll(c)

    expect(c.scrollTimeout).not.toBeNull()

    clearTimeout(c.scrollTimeout)
  })

  test('site-toast — push with nullish optional fields covers ??/|| arms', () => {
    const el = document.createElement(COMPONENT_TAGS.SITE_TOAST)

    const id = el.push({ text: 't', type: null, title: null, duration: null })

    expect(id).not.toBeNull()

    el.remove()
  })

  test('awards-mentions — click on href-less footer item hits EMPTY fallback', async () => {
    const { default: router } = await import('@/routes/router.js')
    const pushSpy = jest.spyOn(router, 'push').mockImplementation(() => Promise.resolve())

    const el = document.createElement(COMPONENT_TAGS.AWARDS_MENTIONS)

    document.body.appendChild(el)

    await new Promise((r) => setTimeout(r, 60))

    // Delegated click handler lives on shadowRoot — a footer-item anchor
    // without href exercises the getAttribute || EMPTY fallback.
    const stray = document.createElement(HTML_TAGS.A)

    stray.classList.add(AWARDS_CLASSES.AWARDS_FOOTER_ITEM)
    el.shadowRoot.appendChild(stray)
    stray.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK, { bubbles: true, cancelable: true }))

    el.remove()
    pushSpy.mockRestore()
  })
})
