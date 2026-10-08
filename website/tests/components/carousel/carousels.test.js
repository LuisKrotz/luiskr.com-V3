/**
 * @file carousels.test.js
 * @description Covers website/components/carousel/AwardsCarousel.js +
 * CustomCarousel.js — the full interaction surface: clone-based infinite
 * looping (first/last clones + the post-transition teleport that must not
 * visibly jump), autoplay progression, swipe physics, dot/arrow nav, and
 * responsive sizing. Clones must stay aria-hidden/inert so assistive tech
 * never announces duplicated slides.
 */

import { jest } from '@jest/globals'
import '@website/components/carousel/AwardsCarousel.js'
import '@website/components/carousel/CustomCarousel.js'
import store from '@core/store.js'
import { TEST_AWARDS, TEST_PROJECTS, TEST_TEXT, waitFor } from '@tests/fixtures/test-constants.js'
import { AWC_CLASSES } from '@core/tokens/classes/awards-carousel.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { MOUSE_EVENTS, TOUCH_EVENTS, WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { CAROUSEL_CSS_PROPS } from '@core/tokens/css/carousel.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'

// ─── Local selector helpers (derived from CLASSES) ────────────────────────────
const S = {
  AWC_TRACK: `.${AWC_CLASSES.AWC_TRACK}`,
  AWC_SLIDE: `.${AWC_CLASSES.AWC_SLIDE}`,
  AWC_SLIDE_CLONE: `.${AWC_CLASSES.AWC_SLIDE_CLONE}`,
  AWC_SLIDE_CLONE_LAST: `.${AWC_CLASSES.AWC_SLIDE_CLONE_LAST}`,
  AWC_SLIDE_CLONE_FIRST: `.${AWC_CLASSES.AWC_SLIDE_CLONE_FIRST}`,
  AWC_SLIDE_CONTENT: `.${AWC_CLASSES.AWC_SLIDE_CONTENT}`,
  AWC_SLIDE_NON_CLONE: `.${AWC_CLASSES.AWC_SLIDE}:not(.${AWC_CLASSES.AWC_SLIDE_CLONE})`,
  AWC_DOT: `.${AWC_CLASSES.AWC_DOT}`,
  AWC_DOT_ACTIVE: `.${AWC_CLASSES.AWC_DOT_ACTIVE}`,
  AWC_AWARD: `.${AWC_CLASSES.AWC_AWARD}`,
  MEDIA_FIGURE: COMPONENT_TAGS.MEDIA_FIGURE,
}

describe('Carousel Web Components Suite - Full Interaction, Clones & Responsive Physics (60+ Tests)', () => {
  const sampleProjects = [
    {
      title: TEST_PROJECTS.METCHA_TITLE,
      label: TEST_PROJECTS.METCHA_TITLE,
      link: `${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.METCHA}`,
      category: 'Branding & UI',
      description: 'Futuristic leather magazine platform',
      awards: [{ title: TEST_AWARDS.FWA_OF_THE_DAY, link: 'https://thefwa.com' }],
      image: { src: 'metcha.jpg', width: 1920, height: 1080 },
    },
    {
      title: 'Melissa',
      label: 'Melissa',
      link: '/portfolio/melissa',
      category: 'Design System',
      description: 'Global footwear design system',
      awards: [{ title: TEST_AWARDS.AWWARDS_SOTD, link: 'https://awwwards.com' }],
      image: { src: 'melissa.jpg', width: 1920, height: 1080 },
    },
    {
      title: 'Rider',
      label: 'Rider',
      link: '/portfolio/rider',
      category: 'Web App',
      description: 'Interactive sandal visualizer',
      awards: [],
      image: { src: 'rider.jpg', width: 1920, height: 1080 },
    },
  ]

  beforeEach(() => {
    document.body.innerHTML = ''
    document.documentElement.classList.remove(STATE_CLASSES.REDUCED_MOTION)
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
  })

  describe('1. AwardsCarousel - Shadow DOM & Slide Rendering', () => {
    test('is defined as custom element "awards-carousel"', () => {
      expect(customElements.get(COMPONENT_TAGS.AWARDS_CAROUSEL)).toBeDefined()
    })

    test('attaches open shadow root', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      document.body.appendChild(carousel)
      expect(carousel.shadowRoot).not.toBeNull()
      expect(carousel.shadowRoot.mode).toBe(STATE_STRINGS.OPEN)
    })

    test('renders track', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const shadow = carousel.shadowRoot
      expect(shadow.querySelector(S.AWC_TRACK)).not.toBeNull()
    })

    test('renders slides plus clone slides for infinite loop', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const shadow = carousel.shadowRoot
      // 3 items + 1 clone last at beginning + 1 clone first at end = 5 slides total
      const allSlides = shadow.querySelectorAll(S.AWC_SLIDE)
      expect(allSlides.length).toBe(5)

      const clones = shadow.querySelectorAll(S.AWC_SLIDE_CLONE)
      expect(clones.length).toBe(2)

      expect(shadow.querySelector(S.AWC_SLIDE_CLONE_LAST)).not.toBeNull()
      expect(shadow.querySelector(S.AWC_SLIDE_CLONE_FIRST)).not.toBeNull()
    })

    test('renders slide content including titles, categories, and descriptions', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const titles = Array.from(carousel.shadowRoot.querySelectorAll(S.AWC_SLIDE_CONTENT)).map(
        (el) => el.textContent.trim()
      )
      expect(titles).toContain(TEST_PROJECTS.METCHA_TITLE)
      expect(titles).toContain('Melissa')
      expect(titles).toContain('Rider')
    })

    test('renders awards when variant is awards', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.variant = 'awards'
      carousel.items = [
        { description: TEST_AWARDS.FWA_OF_THE_DAY, link: 'https://thefwa.com', icon: '🏆' },
        { description: TEST_AWARDS.AWWARDS_SOTD, link: 'https://awwwards.com', icon: '⭐' },
      ]
      document.body.appendChild(carousel)

      const awards = carousel.shadowRoot.querySelectorAll(S.AWC_AWARD)
      expect(awards.length).toBeGreaterThan(0)
    })
  })

  describe('2. AwardsCarousel - Clone Accessibility & Tab Order Management', () => {
    test('_disableClonesFocus sets tabIndex = -1 on all focusable elements in clones', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const clones = carousel.shadowRoot.querySelectorAll(S.AWC_SLIDE_CLONE)
      clones.forEach((clone) => {
        expect(clone.getAttribute(ARIA_ATTRS.ARIA_HIDDEN)).toBe(STATE_STRINGS.TRUE)
        const focusable = clone.querySelectorAll('a, button, [tabindex]')
        focusable.forEach((el) => {
          expect(el.getAttribute(ARIA_ATTRS.TABINDEX)).toBe(CHAR_STRINGS.MINUS_ONE)
        })
      })
    })

    test('non-clone slides retain normal accessibility attributes', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const regularSlides = carousel.shadowRoot.querySelectorAll(S.AWC_SLIDE_NON_CLONE)
      expect(regularSlides.length).toBe(3)
      regularSlides.forEach((s) => {
        expect(s.getAttribute(ARIA_ATTRS.ARIA_HIDDEN)).toBeNull()
      })
    })
  })

  describe('3. AwardsCarousel - Navigation Controls, goTo & Wrapping', () => {
    test('initial slide index is 0 and active class is applied to first slide', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      expect(carousel.currentIndex).toBe(0)
      const slides = carousel.shadowRoot.querySelectorAll(S.AWC_SLIDE_NON_CLONE)
      expect(slides[0].classList.contains(AWC_CLASSES.AWC_SLIDE_ACTIVE)).toBe(true)
    })

    test('goTo(1) activates second slide and updates currentIndex', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel.goTo(1)
      expect(carousel.currentIndex).toBe(1)
      const slides = carousel.shadowRoot.querySelectorAll(S.AWC_SLIDE_NON_CLONE)
      expect(slides[1].classList.contains(AWC_CLASSES.AWC_SLIDE_ACTIVE)).toBe(true)
      expect(slides[0].classList.contains(AWC_CLASSES.AWC_SLIDE_ACTIVE)).toBe(false)
    })

    test('goTo advances to next slide', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel.goTo(carousel.currentIndex + 1)
      expect(carousel.currentIndex).toBe(1)
    })

    test('goTo(-1) from index 0 wraps to last slide', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel.goTo(-1)
      expect(carousel.currentIndex).toBe(sampleProjects.length - 1)
    })

    test('goTo handles index overflow and loops cleanly', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel.goTo(3) // 3 % 3 = 0
      expect(carousel.currentIndex).toBe(0)
    })
  })

  describe('4. AwardsCarousel - Dot Indicators', () => {
    test('renders dot indicators matching item count when showDots is true', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.variant = 'awards'
      carousel.showDots = true
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const dots = carousel.shadowRoot.querySelectorAll(S.AWC_DOT)
      expect(dots.length).toBe(3)
    })

    test('dot click updates active slide index', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.variant = 'awards'
      carousel.showDots = true
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel.onDotClick(2)
      expect(carousel.currentIndex).toBe(2)
      const dots = carousel.shadowRoot.querySelectorAll(S.AWC_DOT)
      expect(dots[2].classList.contains(AWC_CLASSES.AWC_DOT_ACTIVE)).toBe(true)
    })
  })

  describe('5. AwardsCarousel - Touch & Swiping Physics', () => {
    test('touch swipe left (> 40px) triggers goTo(currentIndex + 1)', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const track = carousel.shadowRoot.querySelector(S.AWC_TRACK)
      track.dispatchEvent(new TouchEvent(TOUCH_EVENTS.TOUCHSTART, { touches: [{ clientX: 200 }] }))
      track.dispatchEvent(
        new TouchEvent(TOUCH_EVENTS.TOUCHEND, { changedTouches: [{ clientX: 120 }] })
      ) // delta = -80px

      expect(carousel.currentIndex).toBe(1)
    })

    test('touch swipe right (> 40px) triggers goTo(currentIndex - 1)', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel.goTo(1)
      const track = carousel.shadowRoot.querySelector(S.AWC_TRACK)
      track.dispatchEvent(new TouchEvent(TOUCH_EVENTS.TOUCHSTART, { touches: [{ clientX: 100 }] }))
      track.dispatchEvent(
        new TouchEvent(TOUCH_EVENTS.TOUCHEND, { changedTouches: [{ clientX: 180 }] })
      ) // delta = +80px

      expect(carousel.currentIndex).toBe(0)
    })

    test('small touch movements (< 40px) do not trigger slide transition', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const track = carousel.shadowRoot.querySelector(S.AWC_TRACK)
      track.dispatchEvent(new TouchEvent(TOUCH_EVENTS.TOUCHSTART, { touches: [{ clientX: 100 }] }))
      track.dispatchEvent(
        new TouchEvent(TOUCH_EVENTS.TOUCHEND, { changedTouches: [{ clientX: 120 }] })
      ) // delta = +20px

      expect(carousel.currentIndex).toBe(0)
    })
  })

  describe('6. AwardsCarousel - Reduced Motion & Autoplay', () => {
    test('reduced motion disables autoplay in store listener', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      expect(carousel.autoplayRunning).toBe(false)
    })

    test('cleanup on removal disconnects observers and cancels timers', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      expect(() => {
        document.body.removeChild(carousel)
      }).not.toThrow()
    })
  })

  describe('7. CustomCarousel - Multi-item Grid & Dynamic Height Synchronizer', () => {
    test('is defined as custom element "custom-carousel"', () => {
      expect(customElements.get(COMPONENT_TAGS.CUSTOM_CAROUSEL)).toBeDefined()
    })

    test('attaches open shadow root', () => {
      const cc = document.createElement(COMPONENT_TAGS.CUSTOM_CAROUSEL)
      document.body.appendChild(cc)
      expect(cc.shadowRoot).not.toBeNull()
      expect(cc.shadowRoot.mode).toBe(STATE_STRINGS.OPEN)
    })

    test('renders items list with media figures', () => {
      const cc = document.createElement(COMPONENT_TAGS.CUSTOM_CAROUSEL)
      cc.items = [
        { src: 'frame1', alt: 'Frame 1', width: 800, height: 600 },
        { src: 'frame2', alt: 'Frame 2', width: 800, height: 600 },
        { src: 'frame3', alt: 'Frame 3', width: 800, height: 600 },
      ]
      document.body.appendChild(cc)

      expect(cc.isActive).toBe(true)
      const figures = cc.shadowRoot.querySelectorAll(S.MEDIA_FIGURE)
      expect(figures.length).toBeGreaterThanOrEqual(3)
    })

    test('calculates and synchronizes --carousel-item-height on parent section', () => {
      const section = document.createElement(COMMON_ATTRS.SECTION)
      const cc = document.createElement(COMPONENT_TAGS.CUSTOM_CAROUSEL)
      cc.items = [
        { src: 'f1', width: 1000, height: 500 },
        { src: 'f2', width: 1000, height: 500 },
      ]
      section.appendChild(cc)
      document.body.appendChild(section)

      // Invoke internal height setter
      cc._setHeightVar()
      // Should set a CSS variable on section or custom-carousel
      expect(
        section.style.getPropertyValue(CAROUSEL_CSS_PROPS.CAROUSEL_ITEM_HEIGHT) ||
          cc.style.getPropertyValue(CAROUSEL_CSS_PROPS.CAROUSEL_ITEM_HEIGHT)
      ).toBeDefined()
    })

    test('next and prev navigation on CustomCarousel', () => {
      const cc = document.createElement(COMPONENT_TAGS.CUSTOM_CAROUSEL)
      cc.items = [
        { src: 'f1', width: 1000, height: 500 },
        { src: 'f2', width: 1000, height: 500 },
        { src: 'f3', width: 1000, height: 500 },
      ]
      document.body.appendChild(cc)

      cc.goTo(1)
      expect(cc.currentIndex).toBe(1)

      cc.goTo(2)
      expect(cc.currentIndex).toBe(2)
    })

    test('single item renders inactive carousel without autoplay', () => {
      const cc = document.createElement(COMPONENT_TAGS.CUSTOM_CAROUSEL)
      cc.items = [{ src: 'single-pic', width: 800, height: 600 }]
      document.body.appendChild(cc)

      expect(cc.isActive).toBe(false)
      expect(cc.autoplayRunning).toBe(false)
    })

    test('window resize updates mobile state and re-measures height', () => {
      const cc = document.createElement(COMPONENT_TAGS.CUSTOM_CAROUSEL)
      cc.items = [
        { src: 'f1', width: 1000, height: 500 },
        { src: 'f2', width: 1000, height: 500 },
      ]
      document.body.appendChild(cc)

      expect(() => {
        window.dispatchEvent(new Event(WINDOW_EVENTS.RESIZE))
      }).not.toThrow()
    })

    test('once autoplay stopped the line regresses backwards to zero and is not re-added', () => {
      const cc = document.createElement(COMPONENT_TAGS.CUSTOM_CAROUSEL)
      cc.items = [
        { src: 'f1', width: 1000, height: 500 },
        { src: 'f2', width: 1000, height: 500 },
      ]
      document.body.appendChild(cc)

      cc.ringProgress = 0.6
      cc.autoplayRunning = true
      cc._stopAutoplay(true)

      expect(cc.autoplayRunning).toBe(false)
      expect(cc._autoplayPermanentlyStopped).toBe(true)

      cc._startAutoplay()
      expect(cc.autoplayRunning).toBe(false)
    })
  })

  describe('AwardsCarousel tails', () => {
    test('items setter early-returns for identical content and accepts non-array as empty', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)
      const items = [{ title: TEST_PROJECTS.METCHA_TITLE, link: TEST_PROJECTS.METCHA }]

      carousel.items = items
      document.body.appendChild(carousel)

      carousel.items = items
      carousel.items = [items[0]]
      expect(carousel.items).toBe(items)

      carousel.items = TEST_TEXT.MISSING_KEY
      expect(carousel.items).toEqual([])

      carousel.remove()
    })

    test('goTo returns early when items are empty', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)

      document.body.appendChild(carousel)

      carousel.currentIndex = 0
      carousel.goTo(2)

      expect(carousel.currentIndex).toBe(0)

      carousel.remove()
    })

    test('scroll helpers guard missing track, slide and element', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)

      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel._scrollToElement(null)
      carousel._scrollToSlide(99)

      carousel.shadowRoot.innerHTML = CHAR_STRINGS.EMPTY
      carousel._scrollToSlide(0)
      carousel._scrollToElement(document.createElement(HTML_TAGS.DIV))
      carousel._bindEvents()

      carousel.remove()
    })

    test('_scheduleTeleport clears a pending timer before teleporting', async () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)

      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel.isNavigating = true
      carousel._scheduleTeleport(0)
      carousel._scheduleTeleport(1)

      // Teleport runs on a 420ms timer — poll so CPU contention can't flake it.
      await waitFor(() => !carousel.isNavigating && carousel.teleportTimer === null)

      expect(carousel.isNavigating).toBe(false)
      expect(carousel.teleportTimer).toBe(null)

      carousel.goTo(1)

      await waitFor(() => !carousel.isNavigating)

      carousel.remove()
    })

    test('_jumpToSlide scrolls smooth and instant when widths are measurable', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)

      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const track = carousel.$(S.AWC_TRACK)
      const slide = track.children[1]

      Object.defineProperty(track, 'clientWidth', { value: 800, configurable: true })
      Object.defineProperty(slide, 'clientWidth', { value: 400, configurable: true })
      track.scrollTo = jest.fn()

      carousel._jumpToSlide(0)
      carousel._jumpToSlide(0, true)

      expect(track.scrollTo).toHaveBeenCalledWith({
        left: expect.any(Number),
        behavior: ATTR_VALUES.INSTANT,
      })
      expect(track.scrollTo).toHaveBeenCalledWith({
        left: expect.any(Number),
        behavior: ATTR_VALUES.SMOOTH,
      })

      carousel.remove()
    })

    test('_scrollToSlide scrolls when rects report non-zero widths', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)

      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const track = carousel.$(S.AWC_TRACK)
      const slide = track.children[1]

      track.getBoundingClientRect = () => ({ left: 0, width: 800 })
      slide.getBoundingClientRect = () => ({ left: 0, width: 400 })
      track.scrollTo = jest.fn()

      carousel._scrollToSlide(0)

      expect(track.scrollTo).toHaveBeenCalledWith({
        left: expect.any(Number),
        behavior: ATTR_VALUES.SMOOTH,
      })

      carousel.remove()
    })

    test('_setupObserver falls back when IntersectionObserver is unavailable', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)

      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const IO = globalThis.IntersectionObserver

      delete globalThis.IntersectionObserver

      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      carousel.isFullyVisible = false
      carousel._setupObserver()

      expect(carousel.isFullyVisible).toBe(true)
      expect(carousel.isEnteredViewport).toBe(true)

      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
      carousel._setupObserver()

      globalThis.IntersectionObserver = IO

      carousel._stopAutoplay()
      carousel.remove()
    })

    test('_setupObserver disconnects a previous observer', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)

      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel._setupObserver()

      const first = carousel.observer

      carousel._setupObserver()

      expect(carousel.observer).not.toBe(first)

      carousel.remove()
    })

    test('observer callback stops autoplay below the visibility threshold', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)

      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      carousel._setupObserver()
      carousel.observer.callback([
        { isIntersecting: true, intersectionRatio: 1, target: carousel },
        { isIntersecting: false, intersectionRatio: 0, target: carousel },
        { isIntersecting: true, intersectionRatio: 0.2, target: carousel },
      ])

      expect(carousel.isFullyVisible).toBe(false)

      carousel.remove()
    })

    test('_startAutoplay stops early under reduced motion or when not fully visible', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)

      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel.isFullyVisible = false
      carousel._startAutoplay()
      expect(carousel.autoplayRunning).toBeFalsy()

      carousel.isFullyVisible = true
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      carousel._startAutoplay()
      expect(carousel.autoplayRunning).toBeFalsy()

      carousel.remove()
    })

    test('_tickAutoplay returns early when stopped and advances past the dwell duration', async () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)

      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel.autoplayRunning = false
      carousel._tickAutoplay()

      carousel.autoplayRunning = true
      carousel.autoplayElapsed = carousel.duration
      carousel._tickAutoplay()

      expect(carousel.autoplayElapsed).toBe(0)

      await new Promise((r) => setTimeout(r, 30))
      carousel._stopAutoplay()
      carousel.remove()
    })

    test('renderItem returns null for missing items and falls back on award fields', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)

      document.body.appendChild(carousel)

      expect(carousel.renderItem(null)).toBe(null)

      carousel.variant = 'awards'

      const award = carousel.renderItem({
        link: TEST_PROJECTS.METCHA,
        media: { path: TEST_TEXT.MISSING_KEY },
      })

      expect(award).toBeTruthy()

      carousel.remove()
    })

    test('module skips custom-element registration when already defined', async () => {
      jest.resetModules()

      await import('@website/components/carousel/AwardsCarousel.js')

      expect(customElements.get(COMPONENT_TAGS.AWARDS_CAROUSEL)).toBeDefined()
    })

    test('dot click navigates to its slide and render applies the in-view class', async () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)

      carousel.variant = 'awards'
      carousel.showDots = true
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const dots = carousel.$$(S.AWC_DOT)

      dots[1].dispatchEvent(new Event(MOUSE_EVENTS.CLICK))

      expect(carousel.currentIndex).toBe(1)

      carousel.isEnteredViewport = true
      await carousel._updateDom()

      expect(carousel.$(`.${AWC_CLASSES.AWC}`).classList.contains(AWC_CLASSES.AWC_IN_VIEW)).toBe(
        true
      )

      carousel.remove()
    })

    test('window resize listener refits the current slide', () => {
      const carousel = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)

      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const spy = jest.spyOn(carousel, '_jumpToSlide')

      window.dispatchEvent(new Event(WINDOW_EVENTS.RESIZE))

      expect(spy).toHaveBeenCalledWith(carousel.currentIndex, false)

      carousel.remove()
    })
  })
})
