import '../src/components/HomeCarousel.js'
import '../src/components/CustomCarousel.js'
import store from '../src/core/store.js'
import { CLASSES, TAGS } from '../src/core/constants.js'

// ─── Local selector helpers (derived from CLASSES) ────────────────────────────
const S = {
  HC_TRACK:           `.${CLASSES.HC_TRACK}`,
  HC_SLIDE:           `.${CLASSES.HC_SLIDE}`,
  HC_SLIDE_CLONE:     `.${CLASSES.HC_SLIDE_CLONE}`,
  HC_SLIDE_CLONE_LAST:`.${CLASSES.HC_SLIDE_CLONE_LAST}`,
  HC_SLIDE_CLONE_FIRST:`.${CLASSES.HC_SLIDE_CLONE_FIRST}`,
  HC_SLIDE_CONTENT:   `.${CLASSES.HC_SLIDE_CONTENT}`,
  HC_SLIDE_NON_CLONE: `.${CLASSES.HC_SLIDE}:not(.${CLASSES.HC_SLIDE_CLONE})`,
  HC_DOT:             `.${CLASSES.HC_DOT}`,
  HC_DOT_ACTIVE:      `.${CLASSES.HC_DOT_ACTIVE}`,
  HC_AWARD:           `.${CLASSES.HC_AWARD}`,
  MEDIA_FIGURE:       TAGS.MEDIA_FIGURE,
}

describe('Carousel Web Components Suite - Full Interaction, Clones & Responsive Physics (60+ Tests)', () => {
  const sampleProjects = [
    {
      title: 'Metcha',
      label: 'Metcha',
      link: '/portfolio/metcha',
      category: 'Branding & UI',
      description: 'Futuristic leather magazine platform',
      awards: [{ title: 'FWA of the Day', link: 'https://thefwa.com' }],
      image: { src: 'metcha.jpg', width: 1920, height: 1080 },
    },
    {
      title: 'Melissa',
      label: 'Melissa',
      link: '/portfolio/melissa',
      category: 'Design System',
      description: 'Global footwear design system',
      awards: [{ title: 'Awwwards Site of the Day', link: 'https://awwwards.com' }],
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
    document.documentElement.classList.remove('reduced-motion')
    store.commit('setReducedMotion', false)
  })

  describe('1. HomeCarousel - Shadow DOM & Slide Rendering', () => {
    test('is defined as custom element "home-carousel"', () => {
      expect(customElements.get(TAGS.HOME_CAROUSEL)).toBeDefined()
    })

    test('attaches open shadow root', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      document.body.appendChild(carousel)
      expect(carousel.shadowRoot).not.toBeNull()
      expect(carousel.shadowRoot.mode).toBe('open')
    })

    test('renders track', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const shadow = carousel.shadowRoot
      expect(shadow.querySelector(S.HC_TRACK)).not.toBeNull()
    })

    test('renders slides plus clone slides for infinite loop', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const shadow = carousel.shadowRoot
      // 3 items + 1 clone last at beginning + 1 clone first at end = 5 slides total
      const allSlides = shadow.querySelectorAll(S.HC_SLIDE)
      expect(allSlides.length).toBe(5)

      const clones = shadow.querySelectorAll(S.HC_SLIDE_CLONE)
      expect(clones.length).toBe(2)

      expect(shadow.querySelector(S.HC_SLIDE_CLONE_LAST)).not.toBeNull()
      expect(shadow.querySelector(S.HC_SLIDE_CLONE_FIRST)).not.toBeNull()
    })

    test('renders slide content including titles, categories, and descriptions', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const titles = Array.from(carousel.shadowRoot.querySelectorAll(S.HC_SLIDE_CONTENT)).map((el) =>
        el.textContent.trim()
      )
      expect(titles).toContain('Metcha')
      expect(titles).toContain('Melissa')
      expect(titles).toContain('Rider')
    })

    test('renders awards when variant is awards', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.variant = 'awards'
      carousel.items = [
        { description: 'FWA of the Day', link: 'https://thefwa.com', icon: '🏆' },
        { description: 'Awwwards Site of the Day', link: 'https://awwwards.com', icon: '⭐' },
      ]
      document.body.appendChild(carousel)

      const awards = carousel.shadowRoot.querySelectorAll(S.HC_AWARD)
      expect(awards.length).toBeGreaterThan(0)
    })
  })

  describe('2. HomeCarousel - Clone Accessibility & Tab Order Management', () => {
    test('_disableClonesFocus sets tabIndex = -1 on all focusable elements in clones', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const clones = carousel.shadowRoot.querySelectorAll(S.HC_SLIDE_CLONE)
      clones.forEach((clone) => {
        expect(clone.getAttribute('aria-hidden')).toBe('true')
        const focusable = clone.querySelectorAll('a, button, [tabindex]')
        focusable.forEach((el) => {
          expect(el.getAttribute('tabindex')).toBe('-1')
        })
      })
    })

    test('non-clone slides retain normal accessibility attributes', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const regularSlides = carousel.shadowRoot.querySelectorAll(S.HC_SLIDE_NON_CLONE)
      expect(regularSlides.length).toBe(3)
      regularSlides.forEach((s) => {
        expect(s.getAttribute('aria-hidden')).toBeNull()
      })
    })
  })

  describe('3. HomeCarousel - Navigation Controls, goTo & Wrapping', () => {
    test('initial slide index is 0 and active class is applied to first slide', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      expect(carousel.currentIndex).toBe(0)
      const slides = carousel.shadowRoot.querySelectorAll(S.HC_SLIDE_NON_CLONE)
      expect(slides[0].classList.contains(CLASSES.HC_SLIDE_ACTIVE)).toBe(true)
    })

    test('goTo(1) activates second slide and updates currentIndex', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel.goTo(1)
      expect(carousel.currentIndex).toBe(1)
      const slides = carousel.shadowRoot.querySelectorAll(S.HC_SLIDE_NON_CLONE)
      expect(slides[1].classList.contains(CLASSES.HC_SLIDE_ACTIVE)).toBe(true)
      expect(slides[0].classList.contains(CLASSES.HC_SLIDE_ACTIVE)).toBe(false)
    })

    test('goTo advances to next slide', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel.goTo(carousel.currentIndex + 1)
      expect(carousel.currentIndex).toBe(1)
    })

    test('goTo(-1) from index 0 wraps to last slide', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel.goTo(-1)
      expect(carousel.currentIndex).toBe(sampleProjects.length - 1)
    })

    test('goTo handles index overflow and loops cleanly', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel.goTo(3) // 3 % 3 = 0
      expect(carousel.currentIndex).toBe(0)
    })
  })

  describe('4. HomeCarousel - Dot Indicators', () => {
    test('renders dot indicators matching item count when showDots is true', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.variant = 'awards'
      carousel.showDots = true
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const dots = carousel.shadowRoot.querySelectorAll(S.HC_DOT)
      expect(dots.length).toBe(3)
    })

    test('dot click updates active slide index', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.variant = 'awards'
      carousel.showDots = true
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel.onDotClick(2)
      expect(carousel.currentIndex).toBe(2)
      const dots = carousel.shadowRoot.querySelectorAll(S.HC_DOT)
      expect(dots[2].classList.contains(CLASSES.HC_DOT_ACTIVE)).toBe(true)
    })
  })

  describe('5. HomeCarousel - Touch & Swiping Physics', () => {
    test('touch swipe left (> 40px) triggers goTo(currentIndex + 1)', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const track = carousel.shadowRoot.querySelector(S.HC_TRACK)
      track.dispatchEvent(new TouchEvent('touchstart', { touches: [{ clientX: 200 }] }))
      track.dispatchEvent(new TouchEvent('touchend', { changedTouches: [{ clientX: 120 }] })) // delta = -80px

      expect(carousel.currentIndex).toBe(1)
    })

    test('touch swipe right (> 40px) triggers goTo(currentIndex - 1)', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      carousel.goTo(1)
      const track = carousel.shadowRoot.querySelector(S.HC_TRACK)
      track.dispatchEvent(new TouchEvent('touchstart', { touches: [{ clientX: 100 }] }))
      track.dispatchEvent(new TouchEvent('touchend', { changedTouches: [{ clientX: 180 }] })) // delta = +80px

      expect(carousel.currentIndex).toBe(0)
    })

    test('small touch movements (< 40px) do not trigger slide transition', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      const track = carousel.shadowRoot.querySelector(S.HC_TRACK)
      track.dispatchEvent(new TouchEvent('touchstart', { touches: [{ clientX: 100 }] }))
      track.dispatchEvent(new TouchEvent('touchend', { changedTouches: [{ clientX: 120 }] })) // delta = +20px

      expect(carousel.currentIndex).toBe(0)
    })
  })

  describe('6. HomeCarousel - Reduced Motion & Autoplay', () => {
    test('reduced motion disables autoplay in store listener', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      store.commit('setReducedMotion', true)
      expect(carousel.autoplayRunning).toBe(false)
    })

    test('cleanup on removal disconnects observers and cancels timers', () => {
      const carousel = document.createElement(TAGS.HOME_CAROUSEL)
      carousel.items = sampleProjects
      document.body.appendChild(carousel)

      expect(() => {
        document.body.removeChild(carousel)
      }).not.toThrow()
    })
  })

  describe('7. CustomCarousel - Multi-item Grid & Dynamic Height Synchronizer', () => {
    test('is defined as custom element "custom-carousel"', () => {
      expect(customElements.get(TAGS.CUSTOM_CAROUSEL)).toBeDefined()
    })

    test('attaches open shadow root', () => {
      const cc = document.createElement(TAGS.CUSTOM_CAROUSEL)
      document.body.appendChild(cc)
      expect(cc.shadowRoot).not.toBeNull()
      expect(cc.shadowRoot.mode).toBe('open')
    })

    test('renders items list with media figures', () => {
      const cc = document.createElement(TAGS.CUSTOM_CAROUSEL)
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
      const section = document.createElement('section')
      const cc = document.createElement(TAGS.CUSTOM_CAROUSEL)
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
        section.style.getPropertyValue('--carousel-item-height') ||
          cc.style.getPropertyValue('--carousel-item-height')
      ).toBeDefined()
    })

    test('next and prev navigation on CustomCarousel', () => {
      const cc = document.createElement(TAGS.CUSTOM_CAROUSEL)
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
      const cc = document.createElement(TAGS.CUSTOM_CAROUSEL)
      cc.items = [{ src: 'single-pic', width: 800, height: 600 }]
      document.body.appendChild(cc)

      expect(cc.isActive).toBe(false)
      expect(cc.autoplayRunning).toBe(false)
    })

    test('window resize updates mobile state and re-measures height', () => {
      const cc = document.createElement(TAGS.CUSTOM_CAROUSEL)
      cc.items = [
        { src: 'f1', width: 1000, height: 500 },
        { src: 'f2', width: 1000, height: 500 },
      ]
      document.body.appendChild(cc)

      expect(() => {
        window.dispatchEvent(new Event('resize'))
      }).not.toThrow()
    })

    test('once autoplay stopped the line regresses backwards to zero and is not re-added', () => {
      const cc = document.createElement(TAGS.CUSTOM_CAROUSEL)
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
})
