/**
 * @file views-homemosaic-tails.test.js
 * @description Split from views.test.js — covers the "HomeMosaic tails" describe.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { HomeMosaic } from '@website/components/home/HomeMosaic.js'
import { FOCUS_EVENTS, LOCALES } from '@core/constants.js'
import { mount } from '@tests/fixtures/test-constants.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { HOME_MOSAIC_CLASSES } from '@core/tokens/classes/mosaic.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { LANG_MUTATIONS, UI_MUTATIONS } from '@core/tokens/events/mutations.js'
import { INPUT_STRINGS } from '@core/tokens/strings/input.js'
import { MOUSE_EVENTS, WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'

// ─── Local selector helpers (derived from TAGS/CLASSES) ───────────────────────
const S = {
  DRAW_TEXT: COMPONENT_TAGS.DRAW_TEXT,
  MEDIA_FIGURE: COMPONENT_TAGS.MEDIA_FIGURE,
  PORTFOLIO_RELATED: COMPONENT_TAGS.PORTFOLIO_RELATED,
  HOME_MOSAIC_ITEM: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM}`,
  HOME_MOSAIC_TITLE: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_TITLE}`,
}

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
    await import('@website/components/home/HomeMosaic.js')
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
