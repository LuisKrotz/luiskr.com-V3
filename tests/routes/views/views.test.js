/**
 * @file views.test.js
 * @description Integration coverage for the routed views — ViewProject
 * (media sections, expand modal, related rail), HomeMosaic (packing +
 * expand interaction), ViewNotFound, ViewLegal, LegalFooter, and
 * PortfolioRelated — plus a source-structure section that asserts file
 * organization stays aligned with the documented layout.
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { ViewProject } from '@/routes/views/project/Project.js'
import { HomeMosaic } from '@/components/home/HomeMosaic.js'
import { ViewLegal } from '@/routes/views/legal/Legal.js'
import { ViewNotFound } from '@/routes/views/not-found/NotFound.js'
import { LegalFooter, getFallbackLegalLinks } from '@/components/legal/Footer.js'
import { PortfolioRelated } from '@/components/portfolio/Related.js'
import { FOCUS_EVENTS, LAYOUT, LOCALES, ROUTE_NAMES } from '@/core/constants.js'
import { SCSS, SRC, mount, TEST_TEXT } from '../../fixtures/test-constants.js'
import store from '@/core/store.js'
import router from '@/routes/router.js'
import { wasmPool } from '@/utils/wasm/wasm-pool.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import { HOME_MOSAIC_CLASSES } from '@/core/tokens/classes/mosaic.js'
import { SKELETON_CLASSES } from '@/core/tokens/classes/skeleton.js'
import { INTERNAL_CLASSES } from '@/core/tokens/classes/project.js'
import { LABEL_TEXT } from '@/core/tokens/strings/text.js'
import { FORM_ATTRS } from '@/core/tokens/attrs/form.js'
import { MEDIA_ATTRS } from '@/core/tokens/attrs/media.js'
import { COVER_DIMENSIONS } from '@/core/tokens/media/dimensions.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { MODAL_CLASSES } from '@/core/tokens/classes/modal.js'
import { ARIA_ATTRS } from '@/core/tokens/attrs/aria.js'
import { LANG_MUTATIONS, UI_MUTATIONS } from '@/core/tokens/events/mutations.js'
import { INPUT_STRINGS } from '@/core/tokens/strings/input.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { MOUSE_EVENTS, WINDOW_EVENTS } from '@/core/tokens/events/dom.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { DOM_STRINGS } from '@/core/tokens/strings/dom.js'
import { COMMON_ATTRS } from '@/core/tokens/attrs/common.js'
import { DATA_ATTRS } from '@/core/tokens/attrs/data.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { LEGAL_CLASSES, NOT_FOUND_CLASSES } from '@/core/tokens/classes/legal.js'
import { LINK_ATTRS } from '@/core/tokens/attrs/link.js'
import { ROUTE_PATHS } from '@/core/tokens/routes/paths.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { ROUTER_CLASSES } from '@/core/tokens/classes/router.js'

// ─── Local selector helpers (derived from TAGS/CLASSES) ───────────────────────
const S = {
  DRAW_TEXT: COMPONENT_TAGS.DRAW_TEXT,
  MEDIA_FIGURE: COMPONENT_TAGS.MEDIA_FIGURE,
  PORTFOLIO_RELATED: COMPONENT_TAGS.PORTFOLIO_RELATED,
  HOME_MOSAIC_ITEM: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM}`,
  HOME_MOSAIC_TITLE: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_TITLE}`,
}

// ─────────────────────────────────────────────────────────────────────────────
// ViewProject
// ─────────────────────────────────────────────────────────────────────────────
describe('ViewProject', () => {
  let projectEl
  let cleanup

  beforeEach(() => {
    projectEl = new ViewProject()
    cleanup = mount(projectEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(projectEl.shadowRoot).not.toBeNull()
  })

  test('renders skeleton state when translations are null', () => {
    const skeletonTitle = projectEl.shadowRoot.querySelector(
      `.${SKELETON_CLASSES.SKELETON_TITLE_MD}`
    )
    const skeletonCover = projectEl.shadowRoot.querySelector(
      `.${INTERNAL_CLASSES.INTERNAL_MAIN_ITEM}`
    )
    expect(skeletonTitle).not.toBeNull()
    expect(skeletonCover).not.toBeNull()
    expect(projectEl.shadowRoot.textContent).not.toContain(LABEL_TEXT.LOADING)
  })

  test('renders title and cover media when translations are provided', () => {
    projectEl.translations = {
      title: 'Stellar Branding Project',
      folder: 'portfolio/stellar/',
      cover: { src: 'cover', size: [1920, 1080], isVideo: false, label: 'Cover Art' },
      sections: [],
    }
    projectEl._updateDom()

    const drawText = projectEl.shadowRoot.querySelector(S.DRAW_TEXT)
    const mediaFigure = projectEl.shadowRoot.querySelector(S.MEDIA_FIGURE)
    expect(drawText).not.toBeNull()
    expect(drawText.getAttribute(FORM_ATTRS.TEXT)).toBe('Stellar Branding Project')
    expect(mediaFigure).not.toBeNull()
    expect(mediaFigure.getAttribute(MEDIA_ATTRS.SRC)).toBe('portfolio/stellar/cover')
    expect(mediaFigure.getAttribute(MEDIA_ATTRS.WIDTH)).toBe(COVER_DIMENSIONS.FHD_WIDTH_STR)
    expect(mediaFigure.getAttribute(MEDIA_ATTRS.HEIGHT)).toBe('1080')
  })

  test('renders video cover with autoPlay and isVideo attributes', () => {
    projectEl.translations = {
      title: 'Video Showcase',
      folder: 'portfolio/video/',
      cover: { src: 'hero-reel', size: [1920, 1080], isVideo: true, label: 'Reel' },
      sections: [],
    }
    projectEl._updateDom()
    const mediaFigure = projectEl.shadowRoot.querySelector(S.MEDIA_FIGURE)
    expect(mediaFigure.getAttribute(MEDIA_ATTRS.IS_VIDEO)).toBe(STATE_STRINGS.TRUE)
    expect(mediaFigure.getAttribute(MEDIA_ATTRS.AUTO_PLAY)).toBe(STATE_STRINGS.TRUE)
  })

  test('isLandscapeGroup returns true when all items have landscape class', () => {
    const landscapeGroup = [
      { src: 'img1', class: STATE_STRINGS.LANDSCAPE },
      { src: 'img2', class: STATE_STRINGS.LANDSCAPE },
    ]
    expect(projectEl.isLandscapeGroup(landscapeGroup)).toBe(true)
  })

  test('isLandscapeGroup returns false when any item is portrait or standard', () => {
    const mixedGroup = [
      { src: 'img1', class: STATE_STRINGS.LANDSCAPE },
      { src: 'img2', class: 'portrait' },
    ]
    expect(projectEl.isLandscapeGroup(mixedGroup)).toBe(false)
  })

  test('isLandscapeGroup returns false for empty or non-array groups', () => {
    expect(projectEl.isLandscapeGroup([])).toBe(false)
    expect(projectEl.isLandscapeGroup(null)).toBe(false)
  })

  test('textDelay dynamically calculates per-character animation delay', () => {
    const textItems = [
      'Short heading',
      'A slightly longer paragraph describing the design process.',
    ]
    const delay = projectEl.textDelay(textItems)
    expect(delay).toBeGreaterThanOrEqual(1)
    expect(delay).toBeLessThanOrEqual(22)
  })

  test('textOffset returns cumulative character offset for staggered entry', () => {
    const textItems = ['First block', 'Second block follows after first block finishes.']
    const offset0 = projectEl.textOffset(textItems, 0)
    const offset1 = projectEl.textOffset(textItems, 1)
    expect(offset0).toBe(0)
    expect(offset1).toBeGreaterThan(0)
  })

  test('renders custom-carousel elements for image sections', () => {
    projectEl.translations = {
      title: 'Gallery Project',
      folder: 'gallery/',
      cover: { src: 'cover', size: [1920, 1080] },
      sections: [
        [
          ['Description paragraph 1'],
          [
            { src: 'slide1', size: [1920, 1080], label: 'Slide 1' },
            { src: 'slide2', size: [1920, 1080], label: 'Slide 2' },
          ],
        ],
      ],
    }
    projectEl._updateDom()
    projectEl._bindCarousels()

    const carousel = projectEl.shadowRoot.querySelector(COMPONENT_TAGS.CUSTOM_CAROUSEL)
    expect(carousel).not.toBeNull()
    expect(carousel.items.length).toBe(2)
  })

  test('renders portfolio-related component at bottom of article', () => {
    const related = projectEl.shadowRoot.querySelector(S.PORTFOLIO_RELATED)
    expect(related).not.toBeNull()
  })

  test('includes dialog.modal-above for fullscreen lightbox preview', () => {
    const modalDialog = projectEl.shadowRoot.querySelector(`dialog.${MODAL_CLASSES.MODAL_ABOVE}`)
    expect(modalDialog).not.toBeNull()
    expect(modalDialog.getAttribute(ARIA_ATTRS.ARIA_LABEL)).toBe('Media preview')
  })

  // ─── SCSS structural assertions ───────────────────────────────────────────
  test('internals.scss defines .internal-main with flex centering and dark background', () => {
    expect(SCSS.internals).toMatch(/&-main\s*\{[\s\S]*?display:\s*flex/)
    expect(SCSS.internals).toMatch(/&-main\s*\{[\s\S]*?align-items:\s*center/)
    expect(SCSS.internals).toMatch(/&-main\s*\{[\s\S]*?justify-content:\s*center/)
    expect(SCSS.internals).toMatch(/&-main\s*\{[\s\S]*?background-color:\s*var\(--bg-dark\)/)
  })

  test('internals.scss defines dynamic carousel item min-height', () => {
    expect(SCSS.internals).toMatch(/min-height:\s*var\(--carousel-item-height,\s*auto\)/)
  })

  test('internals.scss progressive image styles define blur on thumb and opacity transition on high-res', () => {
    expect(SCSS.internals).toMatch(/--thumb[\s\S]*?filter:\s*blur\(12px\)/)
    expect(SCSS.internals).toMatch(/--high[\s\S]*?opacity:\s*0/)
    expect(SCSS.internals).toMatch(/render-media--loaded[\s\S]*?opacity:\s*1/)
  })
})

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

// ─── HomeMosaic tails ───────────────────────────────────────────────────
describe('HomeMosaic tails', () => {
  let mosaicEl
  let cleanup

  const MOSAIC_ITEMS = [
    { label: 'Card A', link: 'card-a', image: 'ia', description: 'Desc A', featured: false },
    { label: 'Card B', link: 'card-b', image: 'ib', description: 'Desc B', featured: true },
  ]

  beforeEach(() => {
    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.MOUSE)
    mosaicEl = new HomeMosaic()
    cleanup = mount(mosaicEl)
    mosaicEl.processedItems = MOSAIC_ITEMS
    mosaicEl._updateDom()
  })

  afterEach(() => cleanup())

  test('shadow listeners route click, hover, leave and window resize through closest()', () => {
    const pushSpy = jest.spyOn(router, 'push').mockImplementation(() => {})
    const item = mosaicEl.shadowRoot.querySelector(S.HOME_MOSAIC_ITEM)
    const mosaic = mosaicEl.shadowRoot.querySelector(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC}`)

    item.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    expect(pushSpy).toHaveBeenCalledWith('/portfolio/card-a')

    item.dispatchEvent(new MouseEvent(MOUSE_EVENTS.CLICK, { bubbles: true, ctrlKey: true }))
    expect(pushSpy).toHaveBeenCalledTimes(1)

    mosaic.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    item.dispatchEvent(new Event(MOUSE_EVENTS.MOUSEOVER, { bubbles: true }))
    expect(mosaicEl.hoveredIdx).toBe(0)
    item.dispatchEvent(new Event(MOUSE_EVENTS.MOUSEOVER, { bubbles: true }))

    const same = new Event(MOUSE_EVENTS.MOUSEOUT, { bubbles: true })
    Object.defineProperty(same, 'relatedTarget', { value: item })
    item.dispatchEvent(same)

    const out = new Event(MOUSE_EVENTS.MOUSEOUT, { bubbles: true })
    Object.defineProperty(out, 'relatedTarget', { value: document.createElement(HTML_TAGS.DIV) })
    item.dispatchEvent(out)

    const plain = new Event(MOUSE_EVENTS.MOUSEOUT, { bubbles: true })
    item.dispatchEvent(plain)

    const noClosest = new Event(MOUSE_EVENTS.MOUSEOUT, { bubbles: true })
    Object.defineProperty(noClosest, 'relatedTarget', { value: {} })
    item.dispatchEvent(noClosest)

    mosaic.dispatchEvent(new Event(MOUSE_EVENTS.MOUSEOVER, { bubbles: true }))
    mosaic.dispatchEvent(new Event(MOUSE_EVENTS.MOUSEOUT, { bubbles: true }))
    window.dispatchEvent(new Event(WINDOW_EVENTS.RESIZE))

    pushSpy.mockRestore()
  })

  test('focusin/focusout mirror hover — keyboard users get the same card expand', () => {
    const item = mosaicEl.shadowRoot.querySelector(S.HOME_MOSAIC_ITEM)
    const mosaic = mosaicEl.shadowRoot.querySelector(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC}`)

    item.dispatchEvent(new Event(FOCUS_EVENTS.FOCUSIN, { bubbles: true }))
    expect(mosaicEl.hoveredIdx).toBe(0)

    // Same card re-focus — no duplicate hover.
    item.dispatchEvent(new Event(FOCUS_EVENTS.FOCUSIN, { bubbles: true }))

    // A retargeted focus transition within the same card keeps it expanded.
    const inner = new Event(FOCUS_EVENTS.FOCUSOUT, { bubbles: true })
    Object.defineProperty(inner, 'relatedTarget', {
      value: item.querySelector(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_BTN}`),
    })
    item.dispatchEvent(inner)
    expect(mosaicEl.hoveredIdx).toBe(0)

    // Focus leaving the card collapses it.
    const out = new Event(FOCUS_EVENTS.FOCUSOUT, { bubbles: true })
    Object.defineProperty(out, 'relatedTarget', { value: document.createElement(HTML_TAGS.DIV) })
    item.dispatchEvent(out)
    expect(mosaicEl.hoveredIdx).toBeNull()

    // Events outside any card are ignored.
    mosaic.dispatchEvent(new Event(FOCUS_EVENTS.FOCUSIN, { bubbles: true }))
    mosaic.dispatchEvent(new Event(FOCUS_EVENTS.FOCUSOUT, { bubbles: true }))
    expect(mosaicEl.hoveredIdx).toBeNull()
  })

  test('layout retries via quickLayout+scheduleLayout when the width computes to zero', () => {
    const desc = Object.getOwnPropertyDescriptor(window, 'innerWidth')
    const quick = jest.spyOn(mosaicEl, 'quickLayout')
    const sched = jest.spyOn(mosaicEl, 'scheduleLayout')

    Object.defineProperty(window, 'innerWidth', { value: 4, configurable: true })
    mosaicEl.layout()
    expect(quick).toHaveBeenCalled()
    expect(sched).toHaveBeenCalled()

    Object.defineProperty(window, 'innerWidth', desc)
  })

  test('wasm batch-layout applies the returned container height', async () => {
    const spy = jest.spyOn(wasmPool, 'dispatch').mockResolvedValue({ totalHeight: 777 })

    mosaicEl.layout()
    await Promise.resolve()
    await Promise.resolve()
    expect(mosaicEl.containerH).toBe(`777${COMMON_ATTRS.PX}`)

    spy.mockResolvedValue(null)
    mosaicEl.layout()
    await Promise.resolve()
    spy.mockRestore()
  })

  test('onHover inserts the description after the button or appends without one', async () => {
    mosaicEl.onHover(0)
    const detail = mosaicEl.shadowRoot.querySelector(
      `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_DETAILS}[${DATA_ATTRS.DATA_INDEX}="0"]`
    )
    expect(detail.querySelector(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_DESC}`)).not.toBeNull()

    mosaicEl.onLeave()
    detail.querySelector(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_BTN}`)?.remove()
    mosaicEl.onHover(0)
    const detail2 = mosaicEl.shadowRoot.querySelector(
      `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_DETAILS}[${DATA_ATTRS.DATA_INDEX}="0"]`
    )
    expect(detail2.querySelector(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_DESC}`)).not.toBeNull()

    await new Promise((r) => setTimeout(r, 40))
  })

  test('onLeave removes the injected description node', () => {
    mosaicEl.onHover(0)
    const detail = mosaicEl.shadowRoot.querySelector(
      `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_DETAILS}[${DATA_ATTRS.DATA_INDEX}="0"]`
    )

    expect(detail.querySelector(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_DESC}`)).not.toBeNull()

    mosaicEl.onLeave()

    expect(detail.querySelector(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_DESC}`)).toBeNull()
  })

  test('hover and leave are inert under touch input', () => {
    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.TOUCH)
    mosaicEl.onHover(0)
    expect(mosaicEl.hoveredIdx).toBeNull()
    mosaicEl.onLeave()
    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.MOUSE)
  })

  test('customElements re-evaluation skips re-registration', async () => {
    expect(customElements.get(COMPONENT_TAGS.HOME_MOSAIC)).toBeTruthy()
    jest.resetModules()
    await import('@/components/home/HomeMosaic.js')
  })

  test('translations setter re-renders and drives the featured title', () => {
    mosaicEl.translations = { featured: 'Featured Work' }

    const h1 = mosaicEl.shadowRoot.querySelector(`.${HOME_MOSAIC_CLASSES.HOME_SECTION_TITLE}`)
    expect(h1.getAttribute(ARIA_ATTRS.ARIA_LABEL)).toBe('Featured Work')
    expect(h1.querySelector(COMPONENT_TAGS.DRAW_TEXT)).not.toBeNull()

    mosaicEl.translations = null

    const h1b = mosaicEl.shadowRoot.querySelector(`.${HOME_MOSAIC_CLASSES.HOME_SECTION_TITLE}`)
    expect(h1b.querySelector(COMPONENT_TAGS.DRAW_TEXT)).toBeNull()

    const bare = new HomeMosaic()
    bare.translations = { featured: 'Bare' }
    expect(bare.translations.featured).toBe('Bare')
  })

  test('onMounted renders items already assigned before mount', () => {
    const el = new HomeMosaic()
    el.processedItems = MOSAIC_ITEMS
    const unmount = mount(el)

    expect(el.shadowRoot.querySelectorAll(S.HOME_MOSAIC_ITEM).length).toBe(2)

    unmount()
  })

  test('window-less skeleton and layout paths fall back safely', () => {
    const orig = globalThis.window

    try {
      delete globalThis.window

      expect(() => {
        mosaicEl._packSkeleton()
        mosaicEl.quickLayout()
        mosaicEl.layout()
      }).not.toThrow()
    } finally {
      globalThis.window = orig
    }
  })

  test('onClick ignores linkless items and prefixes non-English routes', () => {
    const pushSpy = jest.spyOn(router, 'push').mockImplementation(() => {})

    mosaicEl.onClick({}, 0)
    expect(pushSpy).not.toHaveBeenCalled()

    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.ES)
    mosaicEl.onClick(MOSAIC_ITEMS[0], 0)
    expect(pushSpy).toHaveBeenCalledWith('/es/portfolio/card-a')

    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
    pushSpy.mockRestore()
  })

  test('touch card switch removes stale description and measures detail height', async () => {
    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.TOUCH)
    mosaicEl.touchIdx = 0

    const prevDetail = mosaicEl.shadowRoot.querySelector(
      `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_DETAILS}[${DATA_ATTRS.DATA_INDEX}="0"]`
    )
    const desc = document.createElement(HTML_TAGS.P)
    desc.className = HOME_MOSAIC_CLASSES.HOME_MOSAIC_DESC
    prevDetail.appendChild(desc)

    const scrollSpy = jest.spyOn(Element.prototype, 'scrollHeight', 'get').mockReturnValue(200)

    mosaicEl.onClick(MOSAIC_ITEMS[1], 1)
    await new Promise((r) => setTimeout(r, 40))

    expect(mosaicEl.touchIdx).toBe(1)
    expect(mosaicEl.bottomHMap[1]).toBe(224)

    scrollSpy.mockRestore()
    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.MOUSE)
  })

  test('quickLayout uses bottomHMap for the active card', () => {
    mosaicEl.hoveredIdx = 0
    mosaicEl.bottomHMap = {}

    mosaicEl.quickLayout()
    expect(mosaicEl.cards[0].bottom.height).toBe(`130${COMMON_ATTRS.PX}`)

    mosaicEl.bottomHMap = { 0: 200 }
    mosaicEl.quickLayout()
    expect(mosaicEl.cards[0].bottom.height).toBe(`200${COMMON_ATTRS.PX}`)
  })

  test('render falls back for sparse items and missing card geometry', () => {
    mosaicEl.processedItems = [
      { label: 'Zero', link: 'l0', image: 'i0' },
      { title: 'Only Title', link: 'l1', image: 'i1' },
      { image: 'i2' },
      { label: 'Three', link: 'l3', image: 'i3' },
    ]
    mosaicEl.cards = []
    mosaicEl._updateDom()

    const imgs = mosaicEl.shadowRoot.querySelectorAll(HTML_TAGS.IMG)

    expect(imgs[0].getAttribute(MEDIA_ATTRS.DECODING)).toBe(MEDIA_ATTRS.DECODING_SYNC)
    expect(imgs[0].getAttribute(MEDIA_ATTRS.LOADING)).toBe(MEDIA_ATTRS.LOADING_EAGER)
    expect(imgs[2].getAttribute(MEDIA_ATTRS.DECODING)).toBe(MEDIA_ATTRS.DECODING_ASYNC)
    expect(imgs[2].getAttribute(MEDIA_ATTRS.LOADING)).toBe(MEDIA_ATTRS.LOADING_LAZY)
    expect(imgs[2].getAttribute('fetchpriority')).toBe(MEDIA_ATTRS.FETCH_PRIORITY_LOW)
    expect(imgs[1].getAttribute(MEDIA_ATTRS.ALT)).toBe('Only Title')
    expect(imgs[2].getAttribute(MEDIA_ATTRS.ALT)).toBe(ATTR_VALUES.EMPTY)
  })

  test('processedItems ignores non-array values', () => {
    mosaicEl.processedItems = 'nope'
    expect(mosaicEl.processedItems).toEqual([])
  })

  test('item click with a stale index is ignored', () => {
    const pushSpy = jest.spyOn(router, 'push').mockImplementation(() => {})
    const mosaic = mosaicEl.shadowRoot.querySelector(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC}`)
    const fake = document.createElement(HTML_TAGS.DIV)
    fake.className = HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM
    fake.setAttribute(DATA_ATTRS.DATA_INDEX, '99')
    mosaic.appendChild(fake)

    fake.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    expect(pushSpy).not.toHaveBeenCalled()
    pushSpy.mockRestore()
  })

  test('unmounted element skips the mosaic node in quickLayout', () => {
    const bare = new HomeMosaic()

    bare.processedItems = MOSAIC_ITEMS

    expect(bare.cards.length).toBe(MOSAIC_ITEMS.length)

    mosaicEl.shadowRoot.querySelector(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC}`).remove()
    mosaicEl.quickLayout()
  })

  test('onDestroy without a pending frame is a no-op', () => {
    mosaicEl._rafId = null

    expect(() => mosaicEl.onDestroy()).not.toThrow()
  })

  test('touch switch with a stale previous index skips detail cleanup', () => {
    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.TOUCH)
    mosaicEl.touchIdx = 9

    mosaicEl.onClick(MOSAIC_ITEMS[1], 1)

    expect(mosaicEl.touchIdx).toBe(1)
    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.MOUSE)
  })

  test('_applyCardStyles tolerates sparse card geometry', () => {
    mosaicEl.cards = [{ card: { position: STATE_STRINGS.ABSOLUTE } }]

    expect(() => mosaicEl._applyCardStyles()).not.toThrow()
  })

  test('onHover guards missing details, descriptions and re-created nodes', async () => {
    mosaicEl.onHover(0)
    mosaicEl.onHover(0)

    mosaicEl.processedItems = [{ label: 'No Desc', link: 'nd', image: 'in' }]
    mosaicEl._updateDom()

    mosaicEl.onHover(0)

    const detail = mosaicEl.shadowRoot.querySelector(
      `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_DETAILS}[${DATA_ATTRS.DATA_INDEX}="0"]`
    )
    expect(detail.querySelector(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_DESC}`)).toBeNull()

    mosaicEl.processedItems = MOSAIC_ITEMS
    mosaicEl._updateDom()
    mosaicEl.hoveredIdx = null
    mosaicEl.onHover(0)

    mosaicEl._processedItems = []
    mosaicEl._updateDom()

    await new Promise((r) => setTimeout(r, 40))
  })

  test('onLeave with a manually set index leaves the detail untouched', () => {
    mosaicEl.hoveredIdx = 0

    mosaicEl.onLeave()

    expect(mosaicEl.hoveredIdx).toBeNull()
  })
})

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

// ─────────────────────────────────────────────────────────────────────────────
// LegalFooter
// ─────────────────────────────────────────────────────────────────────────────
describe('LegalFooter', () => {
  let footerEl
  let cleanup

  beforeEach(() => {
    footerEl = new LegalFooter()
    cleanup = mount(footerEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(footerEl.shadowRoot).not.toBeNull()
  })

  test('getFallbackLegalLinks returns 4 valid links for English locale', () => {
    const links = getFallbackLegalLinks(LOCALES.EN)
    expect(links.length).toBe(4)
    expect(links[0].page).toBe(ROUTE_NAMES.HOME)
    expect(links[0].link).toBe('/')
    expect(links[1].page).toBe(ROUTE_NAMES.PRIVACY)
    expect(links[2].page).toBe(ROUTE_NAMES.GDPR)
    expect(links[3].page).toBe(ROUTE_NAMES.TERMS)
  })

  test('getFallbackLegalLinks localizes paths for Portuguese (br) and labels come from the live components dictionary', () => {
    const links = getFallbackLegalLinks(LOCALES.BR)
    expect(links.length).toBe(4)
    expect(links[0].link).toBe('/br/')
    expect(links[1].link).toBe('/br/politica-de-privacidade')
    expect(links[3].link).toBe('/br/termos-de-uso')
    // No locale-specific copy lives in JS: without the live dictionary the EN snapshot labels are used
    expect(links[1].page).toBe(ROUTE_NAMES.PRIVACY)
  })

  test('getFallbackLegalLinks localizes paths for German (de)', () => {
    const links = getFallbackLegalLinks(LOCALES.DE)
    expect(links.length).toBe(4)
    expect(links[0].link).toBe('/de/')
    expect(links[1].link).toBe('/de/datenschutzrichtlinie')
    expect(links[3].link).toBe('/de/nutzungsbedingungen')
  })

  test('renders fallback links when store has no legal links', () => {
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {})
    footerEl._updateDom()
    const links = footerEl.shadowRoot.querySelectorAll('a')
    expect(links.length).toBe(4)
  })

  test('clicking link calls router.push with link href', () => {
    let pushedHref = null
    const origPush = router.push
    router.push = (href) => {
      pushedHref = href
    }

    footerEl._updateDom()
    const firstLink = footerEl.shadowRoot.querySelector('a')
    firstLink.click()
    expect(pushedHref).toBe(firstLink.getAttribute(LINK_ATTRS.HREF))
    router.push = origPush
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// PortfolioRelated
// ─────────────────────────────────────────────────────────────────────────────
describe('PortfolioRelated', () => {
  let relatedEl
  let cleanup

  beforeEach(() => {
    relatedEl = new PortfolioRelated()
    cleanup = mount(relatedEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(relatedEl.shadowRoot).not.toBeNull()
  })

  test('projectsList returns empty array when translations has no projects', () => {
    relatedEl.translations = {}
    expect(relatedEl.projectsList).toEqual([])
  })

  test('maps projects with clean links and resolves home portfolio images', () => {
    store.state.portfoliolist = [
      { link: 'art-direction', image: 'art-dir-thumb.webp', label: 'Art Direction' },
    ]
    relatedEl.translations = {
      path: ROUTE_PATHS.PORTFOLIO,
      projects: [{ link: '/portfolio/art-direction', page: 'Art Direction' }],
    }
    const projects = relatedEl.projectsList
    expect(projects.length).toBe(1)
    expect(projects[0].link).toBe('art-direction')
    expect(projects[0].imageSrc).toContain('art-dir-thumb.webp')
  })

  test('renders related section with title when translations are present', () => {
    relatedEl.translations = {
      title: 'More Projects',
      path: ROUTE_PATHS.PORTFOLIO,
      projects: [
        { link: '/portfolio/project-one', page: 'Project One' },
        { link: '/portfolio/project-two', page: 'Project Two' },
      ],
    }
    relatedEl._updateDom()
    expect(relatedEl.shadowRoot.textContent).toContain('More Projects')
    const links = relatedEl.shadowRoot.querySelectorAll('a')
    expect(links.length).toBe(2)
  })

  test('clicking item link pushes route to router', () => {
    let routed = null
    const origPush = router.push
    router.push = (path) => {
      routed = path
    }

    relatedEl.translations = {
      title: 'More Projects',
      path: ROUTE_PATHS.PORTFOLIO,
      projects: [{ link: '/portfolio/design-system', page: 'Design System' }],
    }
    relatedEl._updateDom()
    const link = relatedEl.shadowRoot.querySelector('a')
    expect(link).not.toBeNull()
    link.click()
    expect(routed).toContain('design-system')
    router.push = origPush
  })

  test('item without fullPath/imageSrc takes the skip-push and skeleton arms', () => {
    let routed = null
    const origPush = router.push
    router.push = (path) => {
      routed = path
    }

    // projectsList always derives non-empty fullPath/imageSrc in production;
    // the render guards still need a falsy projection — inject one directly.
    Object.defineProperty(relatedEl, 'projectsList', {
      configurable: true,
      get: () => [
        {
          link: 'ghost',
          page: 'Ghost',
          fullPath: CHAR_STRINGS.EMPTY,
          imageSrc: CHAR_STRINGS.EMPTY,
          description: CHAR_STRINGS.EMPTY,
        },
      ],
    })
    relatedEl.translations = { title: 'More Projects', path: ROUTE_PATHS.PORTFOLIO }
    relatedEl._updateDom()

    const link = relatedEl.shadowRoot.querySelector('a')
    expect(link).not.toBeNull()
    expect(link.querySelector(`.${SKELETON_CLASSES.SKELETON_MEDIA}`)).not.toBeNull()

    link.click()
    expect(routed).toBeNull()

    delete relatedEl.projectsList
    router.push = origPush
  })

  test('projectsList covers object maps, fallbacks and all match strategies', () => {
    const prevList = store.state.portfoliolist

    store.state.portfoliolist = null
    relatedEl.homePortfolio = [
      null,
      { title: 'Project Beta', description: 'home-desc' },
      { image: 'x-alpha' },
      { label: 'No Match' },
    ]
    relatedEl.translations = {
      // no `path` → PORTFOLIO_SLASH default; object map → Object.values arm
      projects: {
        a: { link: '/projects/x-alpha', page: 'Alpha', featured: true, description: 'own-desc' },
        b: { title: 'Beta' },
        c: { link: '/portfolio/gamma/' },
        d: { link: 'delta', image: 'delta-img' },
      },
    }

    const list = relatedEl.projectsList

    expect(list).toHaveLength(4)
    expect(list[0].featured).toBe(true)
    expect(list[2].link).toBe('gamma')

    store.state.portfoliolist = prevList
  })

  test('non-EN locale, relative basePath, storage fallback and socials render', () => {
    const prevLocale = store.state.lang.locale
    const prevStorage = store.state.storage
    const prevList = store.state.portfoliolist

    store.state.lang.locale = LOCALES.BR
    store.state.storage = null
    store.state.portfoliolist = null

    relatedEl.translations = {
      title: 'More',
      path: ROUTE_PATHS.PORTFOLIO_SEGMENT,
      note: 'note-html',
      socials: [{ network: 'gh', link: 'https://x.example' }],
      projects: [{ link: '/portfolio/p1', page: 'p1' }],
    }

    const list = relatedEl.projectsList

    expect(list[0].fullPath).toContain('/br/portfolio/p1')
    expect(relatedEl.storage).toContain('http')

    relatedEl._updateDom()

    const socials = relatedEl.shadowRoot.querySelectorAll(
      `.${INTERNAL_CLASSES.INTERNAL_FOOTER_ITEMS_LINK}`
    )

    expect(socials.length).toBeGreaterThan(0)

    // socials present but no note → the `note || EMPTY` arm
    relatedEl.translations = {
      title: 'More',
      projects: [],
      socials: [{ network: 'gh', link: 'https://x.example' }],
    }
    relatedEl._updateDom()

    store.state.lang.locale = prevLocale
    store.state.storage = prevStorage
    store.state.portfoliolist = prevList
  })

  test('disclaimer note renders as a clamped toggle button and expands on click', () => {
    relatedEl.translations = {
      title: 'More',
      note: TEST_TEXT.LONG_NOTE,
      socials: [{ network: 'gh', link: 'https://x.example' }],
    }
    relatedEl._updateDom()

    const note = relatedEl.shadowRoot.querySelector(
      `.${INTERNAL_CLASSES.INTERNAL_FOOTER_ITEMS_NOTE}`
    )

    expect(note).not.toBeNull()
    expect(note.tagName).toBe(HTML_TAGS.BUTTON.toUpperCase())
    expect(note.getAttribute(ARIA_ATTRS.ARIA_EXPANDED)).toBe('false')
    expect(note.classList.contains(STATE_CLASSES.IS_OPEN)).toBe(false)

    note.click()

    const openNote = relatedEl.shadowRoot.querySelector(
      `.${INTERNAL_CLASSES.INTERNAL_FOOTER_ITEMS_NOTE}`
    )

    expect(relatedEl._noteOpen).toBe(true)
    expect(openNote.getAttribute(ARIA_ATTRS.ARIA_EXPANDED)).toBe('true')
    expect(openNote.classList.contains(STATE_CLASSES.IS_OPEN)).toBe(true)

    openNote.click()

    expect(relatedEl._noteOpen).toBe(false)
  })

  test('isCurrent arms: link match, page match and non-match', () => {
    const prevLocation = window.location

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, pathname: '/portfolio/omega' },
    })

    relatedEl.translations = {
      title: 'T',
      projects: [
        { link: 'omega', page: 'x' },
        { link: 'zzz', page: 'omega' },
        { link: 'other', page: 'other' },
      ],
    }
    relatedEl._updateDom()

    const active = relatedEl.shadowRoot.querySelectorAll(`.${ROUTER_CLASSES.ROUTER_LINK_ACTIVE}`)

    expect(active.length).toBe(2)

    Object.defineProperty(window, 'location', { configurable: true, value: prevLocation })
  })

  test('window-less render arm and destroy guards', () => {
    const prevWindow = globalThis.window

    delete globalThis.window

    relatedEl.translations = { title: 'T', projects: [{ link: 'x', page: 'y' }] }
    relatedEl.render()

    globalThis.window = prevWindow

    // onDestroy without onMounted → the unsub guard else arm
    const fresh = new PortfolioRelated()

    fresh.onDestroy()

    // onMounted with a title already present → the translations guard else arm
    const titled = new PortfolioRelated()

    titled.translations = { title: 'preset' }
    document.body.appendChild(titled)
    titled.remove()
  })

  test('fetchData covers missing snapshots and object portfoliolist', async () => {
    const lang = store.getters.getlang()
    const prevDb = lang.database
    const prevLocale = lang.locale
    const origFetch = globalThis.fetch

    // network returns null → both snapshots exists()===false → else arms
    globalThis.fetch = async () => ({ ok: true, json: async () => null })

    lang.database = 'nodb/'
    lang.locale = CHAR_STRINGS.EMPTY

    relatedEl.fetchData()

    await new Promise((r) => setTimeout(r, 80))

    // new database path → skips the db.js in-flight cache — network returns
    // a portfoliolist OBJECT → Object.values arm
    lang.database = 'nodb2/'

    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({ portfoliolist: { a: { link: 'x', image: 'y' } } }),
    })

    relatedEl.fetchData()

    await new Promise((r) => setTimeout(r, 80))

    expect(relatedEl.homePortfolio.length).toBe(1)

    globalThis.fetch = origFetch
    lang.database = prevDb
    lang.locale = prevLocale
  })

  test('router notify and title-present store update arms', async () => {
    // beforeEach mounted the element → the router subscriber is already live
    relatedEl.translations = { title: 'kept' }

    relatedEl.onStoreUpdate()

    router.notify({ path: '/x', name: 'x' }, { path: '/', name: 'home' })

    relatedEl.onDestroy()
  })

  test('module re-eval sees the tag already registered', async () => {
    jest.resetModules()

    await import('@/components/portfolio/Related.js')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// JS source structure assertions
// ─────────────────────────────────────────────────────────────────────────────
describe('Source file structure', () => {
  test('Home view contains HOME_MOSAIC, ABOUT_SECTION, CONTACT_SECTION, AWARDS_MENTIONS', () => {
    expect(SRC.Home).toContain('HOME_MOSAIC')
    expect(SRC.Home).toContain('id="about"')
    expect(SRC.Home).toContain('ABOUT_SECTION')
    expect(SRC.Home).toContain('id="contact"')
    expect(SRC.Home).toContain('CONTACT_SECTION')
    expect(SRC.Home).toContain('AWARDS_MENTIONS')
  })

  test('Project view contains INTERNAL_TITLE, INTERNAL_MAIN, custom-carousel, portfolio-related', () => {
    expect(SRC.Project).toContain('INTERNAL_TITLE')
    expect(SRC.Project).toContain('INTERNAL_MAIN')
    expect(SRC.Project).toContain('INTERNAL_DESCRIPTION')
    expect(SRC.Project).toContain(COMPONENT_TAGS.CUSTOM_CAROUSEL)
    expect(SRC.Project).toContain(COMPONENT_TAGS.PORTFOLIO_RELATED)
  })

  test('Legal view contains INTERNAL_TITLE, INTERNAL_DESCRIPTION, LEGAL_FOOTER', () => {
    expect(SRC.Legal).toContain('INTERNAL_TITLE')
    expect(SRC.Legal).toContain('INTERNAL_DESCRIPTION')
    expect(SRC.Legal).toContain('INTERNAL_DESCRIPTION_TEXT')
    expect(SRC.Legal).toContain('LEGAL_FOOTER')
  })

  test('NotFound view contains not-found class references', () => {
    expect(SRC.NotFound).toContain(NOT_FOUND_CLASSES.NOT_FOUND)
  })

  test('PortfolioRelated contains RELATED_MOSAIC, RELATED_MOSAIC_ITEM, INTERNAL_FOOTER_ITEMS_NOTE', () => {
    expect(SRC.PortfolioRelated).toContain('RELATED_MOSAIC')
    expect(SRC.PortfolioRelated).toContain('RELATED_MOSAIC_ITEM')
    expect(SRC.PortfolioRelated).toContain('INTERNAL_FOOTER_ITEMS_NOTE')
  })

  test('LegalFooter contains INTERNAL_FOOTER, INTERNAL_FOOTER_ITEMS_LINK, INTERNAL_FOOTER_ITEMS_SEP', () => {
    expect(SRC.LegalFooter).toContain('INTERNAL_FOOTER')
    expect(SRC.LegalFooter).toContain('INTERNAL_FOOTER_ITEMS_LINK')
    expect(SRC.LegalFooter).toContain('CONTACT_OTHER_LINK')
    expect(SRC.LegalFooter).toContain('INTERNAL_FOOTER_ITEMS_SEP')
  })
})
