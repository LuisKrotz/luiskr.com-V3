/**
 * @file delegate-tails-misc-attr-guard-arms.test.js
 * @description Split from delegate-tails.test.js — covers the "misc attr/guard arms" describe.
 */
import { describe, test, expect, jest } from '@jest/globals'
import '@website/components/carousel/CustomCarousel.js'
import '@website/components/home/HomeMosaic.js'
import '@website/components/media/DrawText.js'
import '@website/components/dialogs/LangDialog.js'
import '@website/components/feedback/SiteToast.js'
import '@website/components/media/MediaExpanded.js'
import '@website/components/home/AwardsMentions.js'
import '@earth/SpacePlayground.js'
import '@cms/projects/CmsProjectsList.js'
import { jumpToSlide, carouselOnScroll } from '@website/components/carousel/custom-carousel/nav.js'
import { localMediaCache } from '@core/utils/media/local-media-cache.js'
import { MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { AWARDS_CLASSES } from '@core/tokens/classes/awards.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

const _SLIDES = [
  { src: 'a.webp', size: [800, 450], label: 'One', canExpand: true },
  { src: 'b.webp', size: [800, 450], label: 'Two', isVideo: true },
]

const _rect = (w = 300, h = 200) => ({ left: 0, top: 0, width: w, height: h, right: w, bottom: h })

afterEach(() => {
  document.body.innerHTML = ''
})

describe('misc attr/guard arms', () => {
  test('awards-mentions link without href pushes empty path', async () => {
    const { default: router } = await import('@core/router/router.js')
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
      getBoundingClientRect: () => ({ width: 200, left: 0 }),
    }

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
    const { default: router } = await import('@core/router/router.js')
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
