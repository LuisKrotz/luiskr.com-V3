/**
 * @file draw-text-fit-tails.test.js
 * @description Coverage tails for draw-text/fit.ts — the opt-in `fit`
 * attribute that scales font-size/letter-spacing down when a single
 * unbreakable word would overflow the parent's content box (long
 * locale words like "GESELECTEERD" on phone viewports). Covers the
 * width/word measurement guards, the scale application arms, the
 * ResizeObserver lifecycle, the font-ready refit, and the
 * attributeChangedCallback FIT wiring on DrawText.
 */

import '@website/components/media/DrawText.js'
import { fitText, setupFit, teardownFit } from '@website/components/media/draw-text/fit.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { DRAW_TEXT_SELECTORS } from '@core/tokens/selectors/draw-text.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'

const ORIG_GCS = globalThis.getComputedStyle
const ORIG_RO = globalThis.ResizeObserver
const ORIG_FONTS = document.fonts

/**
 * Mounts a fitted draw-text inside a wrapper div (the sizing parent).
 * @param attrs — attribute map applied before append
 * @returns {{ el: HTMLElement, wrap: HTMLElement }}
 */
const mount = (attrs = {}) => {
  const wrap = document.createElement(HTML_TAGS.DIV)

  document.body.appendChild(wrap)

  const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)

  el.setAttribute(FORM_ATTRS.TEXT, TEST_TEXT.HELLO_WORLD)

  for (const [name, val] of Object.entries(attrs)) el.setAttribute(name, val)

  wrap.appendChild(el)

  return { el, wrap }
}

/**
 * Pins the wrapper's content width and every word span's rendered width
 * so the scale math is deterministic under happy-dom's zero-size rects.
 * @param wrap — sizing parent
 * @param el — the draw-text host
 * @param avail — parent content-box width in px
 * @param wordW — width each word reports in px
 */
const stubRects = (wrap, el, avail, wordW) => {
  Object.defineProperty(wrap, 'clientWidth', { value: avail, configurable: true })

  el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD).forEach((word) => {
    word.getBoundingClientRect = () => ({ width: wordW })
  })
}

/**
 * Stubs getComputedStyle so fontSize/letterSpacing/padding resolve to
 * deterministic values regardless of the environment stylesheet.
 * @param styles — partial computed-style record
 */
const stubComputed = (styles) => {
  globalThis.getComputedStyle = () => ({
    paddingLeft: '0px',
    paddingRight: '0px',
    fontSize: '34px',
    letterSpacing: '5px',
    ...styles,
  })
}

afterEach(() => {
  document.body.innerHTML = ''
  globalThis.getComputedStyle = ORIG_GCS
  globalThis.ResizeObserver = ORIG_RO
  Object.defineProperty(document, 'fonts', { value: ORIG_FONTS, configurable: true })
})

describe('draw-text fit tails', () => {
  test('fitText early-returns without the fit attribute', () => {
    const { el } = mount()

    fitText(el)

    expect(el.style.fontSize).toBe(ATTR_VALUES.EMPTY)
  })

  test('scales font-size and letter-spacing when the widest word overflows', () => {
    const { el, wrap } = mount({ [COMMON_ATTRS.FIT]: ATTR_VALUES.EMPTY })

    stubRects(wrap, el, 100, 200)
    stubComputed({})

    fitText(el)

    expect(el.style.fontSize).toBe('17px')
    expect(el.style.letterSpacing).toBe('2.5px')
  })

  test('does not scale when the text already fits', () => {
    const { el, wrap } = mount({ [COMMON_ATTRS.FIT]: ATTR_VALUES.EMPTY })

    stubRects(wrap, el, 400, 50)
    stubComputed({})

    fitText(el)

    expect(el.style.fontSize).toBe(ATTR_VALUES.EMPTY)
  })

  test('guards on unmeasurable box and zero-width words', () => {
    const { el, wrap } = mount({ [COMMON_ATTRS.FIT]: ATTR_VALUES.EMPTY })

    stubComputed({})

    fitText(el) // avail = 0 → return

    stubRects(wrap, el, 100, 0)
    fitText(el) // widest = 0 → return

    expect(el.style.fontSize).toBe(ATTR_VALUES.EMPTY)
  })

  test('falls back to host clientWidth when detached', () => {
    const { el, wrap } = mount({ [COMMON_ATTRS.FIT]: ATTR_VALUES.EMPTY })

    el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD).forEach((word) => {
      word.getBoundingClientRect = () => ({ width: 200 })
    })

    el.remove() // detach → parentElement null → host.clientWidth is the constraint

    Object.defineProperty(el, 'clientWidth', { value: 100, configurable: true })

    stubComputed({})

    fitText(el)

    expect(el.style.fontSize).toBe('17px')

    wrap.remove()
  })

  test('empty padding and font metrics are skipped safely', () => {
    const { el, wrap } = mount({ [COMMON_ATTRS.FIT]: ATTR_VALUES.EMPTY })

    stubRects(wrap, el, 100, 200)
    stubComputed({ paddingLeft: ATTR_VALUES.EMPTY, fontSize: ATTR_VALUES.EMPTY })

    fitText(el) // !baseFont → return without applying

    expect(el.style.fontSize).toBe(ATTR_VALUES.EMPTY)
  })

  test('letter-spacing "normal" parses to zero tracking', () => {
    const { el, wrap } = mount({ [COMMON_ATTRS.FIT]: ATTR_VALUES.EMPTY })

    stubRects(wrap, el, 100, 200)
    stubComputed({ letterSpacing: ATTR_VALUES.EMPTY })

    fitText(el)

    expect(el.style.fontSize).toBe('17px')
    expect(el.style.letterSpacing).toBe(ATTR_VALUES.EMPTY)
  })

  test('setupFit installs a ResizeObserver on the parent and refits on its callback', () => {
    let roCb = null

    globalThis.ResizeObserver = class {
      constructor(cb) {
        roCb = cb
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    const { el, wrap } = mount({ [COMMON_ATTRS.FIT]: ATTR_VALUES.EMPTY })

    expect(el._fitObserver).not.toBeNull()

    stubRects(wrap, el, 100, 200)
    stubComputed({})

    roCb()

    expect(el.style.fontSize).toBe('17px')
  })

  test('setupFit skips the observer when ResizeObserver is missing', () => {
    delete globalThis.ResizeObserver

    const { el } = mount({ [COMMON_ATTRS.FIT]: ATTR_VALUES.EMPTY })

    expect(el._fitObserver).toBeNull()
  })

  test('setupFit observes the host itself when detached from a parent', () => {
    let observed = null

    globalThis.ResizeObserver = class {
      constructor() {}
      observe(el) {
        observed = el
      }
      disconnect() {}
    }

    const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)

    el.setAttribute(FORM_ATTRS.TEXT, TEST_TEXT.HELLO_WORLD)
    el.setAttribute(COMMON_ATTRS.FIT, ATTR_VALUES.EMPTY)

    setupFit(el) // detached → parentElement null → observes the host

    expect(el._fitObserver).not.toBeNull()
    expect(observed).toBe(el)

    teardownFit(el)
  })

  test('a second _setupFit keeps the already-installed observer', () => {
    const { el } = mount({ [COMMON_ATTRS.FIT]: ATTR_VALUES.EMPTY })

    const seen = el._fitObserver

    el._setupFit()

    expect(el._fitObserver).toBe(seen)
  })

  test('document.fonts.ready schedules a refit once fonts settle', async () => {
    let resolveReady

    const readyPromise = new Promise((res) => {
      resolveReady = res
    })

    Object.defineProperty(document, 'fonts', {
      value: { ready: readyPromise },
      configurable: true,
    })

    const { el, wrap } = mount({ [COMMON_ATTRS.FIT]: ATTR_VALUES.EMPTY })

    stubRects(wrap, el, 100, 200)
    stubComputed({})

    resolveReady()

    await readyPromise
    await Promise.resolve()

    expect(el.style.fontSize).toBe('17px')
  })

  test('fonts.ready rejection is swallowed', async () => {
    Object.defineProperty(document, 'fonts', {
      value: { ready: Promise.reject(new Error('font fail')) },
      configurable: true,
    })

    const { el } = mount({ [COMMON_ATTRS.FIT]: ATTR_VALUES.EMPTY })

    await Promise.resolve()
    await Promise.resolve()

    expect(el._isMounted).toBe(true)
  })

  test('teardownFit disconnects the observer and restores stylesheet sizing', () => {
    const { el, wrap } = mount({ [COMMON_ATTRS.FIT]: ATTR_VALUES.EMPTY })

    stubRects(wrap, el, 100, 200)
    stubComputed({})

    fitText(el)

    expect(el.style.fontSize).not.toBe(ATTR_VALUES.EMPTY)

    teardownFit(el)

    expect(el._fitObserver).toBeNull()
    expect(el.style.fontSize).toBe(ATTR_VALUES.EMPTY)
  })

  test('removing and re-adding the fit attribute toggles the pipeline', () => {
    const { el } = mount({ [COMMON_ATTRS.FIT]: ATTR_VALUES.EMPTY })

    el.removeAttribute(COMMON_ATTRS.FIT) // → teardownFit arm

    expect(el._fitObserver).toBeNull()

    el.setAttribute(COMMON_ATTRS.FIT, ATTR_VALUES.EMPTY) // → _setupFit arm

    expect(el._isMounted).toBe(true)
  })

  test('fit attribute on an unmounted element waits for connectedCallback', () => {
    const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)

    el.setAttribute(FORM_ATTRS.TEXT, TEST_TEXT.HELLO_WORLD)
    el.setAttribute(COMMON_ATTRS.FIT, ATTR_VALUES.EMPTY) // _isMounted=false → skip

    expect(el._fitObserver).toBeNull()
  })
})
