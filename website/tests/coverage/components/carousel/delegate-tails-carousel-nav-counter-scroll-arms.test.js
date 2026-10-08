/**
 * @file delegate-tails-carousel-nav-counter-scroll-arms.test.js
 * @description Split from delegate-tails.test.js — covers the "carousel nav — counter + scroll arms" describe.
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
import {
  scrollToElement,
  updateActiveClasses,
} from '@website/components/carousel/custom-carousel/nav.js'
import { jumpToSlide as hcJumpToSlide } from '@website/components/carousel/awards-carousel/nav.js'
import { setupObserver as hcSetupObserver } from '@website/components/carousel/awards-carousel/observer.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

const SLIDES = [
  { src: 'a.webp', size: [800, 450], label: 'One', canExpand: true },
  { src: 'b.webp', size: [800, 450], label: 'Two', isVideo: true },
]

const rect = (w = 300, h = 200) => ({ left: 0, top: 0, width: w, height: h, right: w, bottom: h })

afterEach(() => {
  document.body.innerHTML = ''
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
      $: (sel) => (sel.includes('counter') ? counter : null),
    }

    updateActiveClasses(c)

    expect(counter.textContent.length).toBeGreaterThan(0)
  })

  test('awards-carousel jumpToSlide uses the non-smooth default', () => {
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

  test('awards-carousel jumpToSlide early-returns when the track lookup fails', () => {
    const host = { $: () => null }

    expect(() => hcJumpToSlide(host, 0)).not.toThrow()
  })

  test('awards-carousel jumpToSlide early-returns when the slide is missing', () => {
    const track = document.createElement('div')
    const host = { $: () => track }

    expect(() => hcJumpToSlide(host, 0)).not.toThrow()
  })

  test('awards-carousel setupObserver early-returns without a root element', () => {
    const host = { $: () => null }

    expect(() => hcSetupObserver(host)).not.toThrow()
  })
})
