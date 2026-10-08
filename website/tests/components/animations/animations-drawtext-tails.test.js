/**
 * @file animations-drawtext-tails.test.js
 * @description Split from animations.test.js — covers the "DrawText tails" describe.
 */
import { jest } from '@jest/globals'
import '@website/components/media/DrawText.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { CSS_STRINGS } from '@core/tokens/strings/css.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sassDir = path.join(__dirname, '..', '..', '..', '..', 'core', 'sass', 'components')

function _readSass(filename) {
  return fs.readFileSync(path.join(sassDir, filename), 'utf-8')
}

// ─── DrawText coverage tails ─────────────────────────────────────────────────
describe('DrawText tails', () => {
  const mount = (attrs = {}) => {
    const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)

    Object.entries({ [FORM_ATTRS.TEXT]: TEST_TEXT.HELLO, ...attrs }).forEach(([k, v]) =>
      el.setAttribute(k, v)
    )
    document.body.appendChild(el)

    return el
  }

  test('property setters round-trip into attributes', () => {
    const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)

    el.text = TEST_TEXT.HEADING
    el.delay = 12
    el.offset = 3
    el.triggerMode = COMMON_ATTRS.TRIGGER_VIEWPORT
    el.visible = true

    expect(el.getAttribute(FORM_ATTRS.TEXT)).toBe(TEST_TEXT.HEADING)
    expect(el.hasAttribute(COMMON_ATTRS.VISIBLE)).toBe(true)

    el.visible = false

    expect(el.hasAttribute(COMMON_ATTRS.VISIBLE)).toBe(false)

    document.body.appendChild(el)
    el.remove()
  })

  test('prop trigger starts animation when visible flips on', () => {
    const el = mount({ [COMMON_ATTRS.TRIGGER]: COMMON_ATTRS.PROP })

    expect(el._isVisible).toBe(false)

    el.setAttribute(COMMON_ATTRS.VISIBLE, ATTR_VALUES.EMPTY)

    expect(el._isVisible).toBe(true)

    el.remove()
  })

  test('shared stylesheet adoption when CSSStyleSheet exists', () => {
    const RealSheet = globalThis.CSSStyleSheet

    globalThis.CSSStyleSheet = window.CSSStyleSheet

    const el = mount()

    expect(el._styleEl).toBeInstanceOf(window.CSSStyleSheet)

    globalThis.CSSStyleSheet = RealSheet
    el.remove()
  })

  test('aria-label is stripped during render', () => {
    const el = mount({ [ARIA_ATTRS.ARIA_LABEL]: TEST_TEXT.HEADING })

    expect(el.hasAttribute(ARIA_ATTRS.ARIA_LABEL)).toBe(false)

    el.remove()
  })

  test('observer callback covers empty, non-intersecting, and intersecting entries', async () => {
    const el = mount({ [COMMON_ATTRS.TRIGGER]: COMMON_ATTRS.TRIGGER_VIEWPORT })
    const cb = el._observer.callback

    cb([null], el._observer)
    cb([{ isIntersecting: false }], el._observer)

    expect(el._isVisible).toBe(false)

    // observer already gone -> the `if (this._observer)` else arm
    el._observer = null
    cb([{ isIntersecting: true }], {})

    await new Promise((r) => setTimeout(r, 50))

    expect(el._isVisible).toBe(true)

    el.remove()

    // live observer -> disconnect + null before the deferred start
    const el2 = mount({ [COMMON_ATTRS.TRIGGER]: COMMON_ATTRS.TRIGGER_VIEWPORT })

    el2._observer.callback([{ isIntersecting: true }], el2._observer)

    expect(el2._observer).toBeNull()

    el2.remove()
  })

  test('markup tokens render br and inline tags with aria fallbacks', () => {
    const el = mount({
      [FORM_ATTRS.TEXT]:
        'a<br/><em>hi</em><em></em><a href="/x">L</a><a href="/x"></a><a aria-label="z">M</a> b',
    })

    expect(el.shadowRoot.innerHTML).toContain(ARIA_ATTRS.ARIA_LABEL)

    el.remove()
  })

  test('done timer collapses char spans after the last character lands', async () => {
    const el = mount({ [COMMON_ATTRS.DELAY]: '0', [COMMON_ATTRS.OFFSET]: '0' })

    await new Promise((r) => setTimeout(r, 900))

    expect(el._hasAnimated).toBe(true)

    el.remove()
  })

  test('unmount disconnects the observer and clears the done timer', async () => {
    const el = mount({ [COMMON_ATTRS.TRIGGER]: COMMON_ATTRS.TRIGGER_VIEWPORT })

    el.trigger()

    expect(el._animTimer).not.toBeNull()

    el.remove()

    expect(el._observer).toBeNull()
    expect(el._animTimer).toBeNull()
  })

  test('offset setter and re-trigger clear pending timers', () => {
    const el = mount()

    el.offset = 5

    // pending timer -> the `if (this._animTimer)` arm inside _startAnimation
    el._isVisible = false
    el._animTimer = setTimeout(() => {}, 0)
    el.trigger()

    el.remove()
  })

  test('text-less and same-value edges hit the early returns', () => {
    const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)

    document.body.appendChild(el)

    expect(el.text).toBe(CHAR_STRINGS.EMPTY)
    expect(el._renderContent()).toBe(CHAR_STRINGS.EMPTY)

    // falsy setter value -> `val || EMPTY`
    el.text = null
    el.text = TEST_TEXT.HELLO

    // identical value -> the `oldValue === newValue` guard
    el.attributeChangedCallback(FORM_ATTRS.TEXT, TEST_TEXT.HELLO, TEST_TEXT.HELLO)

    el.remove()
  })

  test('reset() without a pending timer and without a root element', () => {
    const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)

    document.body.appendChild(el)

    // no animation started -> `_animTimer` stays null
    el.reset()

    expect(el._isVisible).toBe(false)

    const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)

    document.body.appendChild(el2)
    el2._contentEl = null
    el2.shadowRoot.innerHTML = CHAR_STRINGS.EMPTY
    el2.reset()

    el.remove()
    el2.remove()
  })

  test('prop trigger with visible set mounts straight into animation', () => {
    const el = mount({
      [COMMON_ATTRS.TRIGGER]: COMMON_ATTRS.PROP,
      [COMMON_ATTRS.VISIBLE]: ATTR_VALUES.EMPTY,
    })

    expect(el._isVisible).toBe(true)

    el.remove()
  })

  test('re-setup disconnects a live viewport observer', () => {
    const el = mount({ [COMMON_ATTRS.TRIGGER]: COMMON_ATTRS.TRIGGER_VIEWPORT })
    const observer = el._observer

    el.setAttribute(FORM_ATTRS.TEXT, TEST_TEXT.HEADING)

    expect(el._observer).not.toBe(observer)

    el.remove()
  })

  test('done timer without a root element and a number timer handle', async () => {
    const el = mount({ [COMMON_ATTRS.DELAY]: '0', [COMMON_ATTRS.OFFSET]: '0' })

    // null root at trigger time -> the `if (rootEl)` else arm in the timer
    const domSpy = jest.spyOn(el, '_updateDom').mockImplementation(() => {})

    el._contentEl = null
    el.shadowRoot.innerHTML = CHAR_STRINGS.EMPTY
    el._isVisible = false
    el.trigger()

    domSpy.mockRestore()

    await new Promise((r) => setTimeout(r, 900))

    expect(el._hasAnimated).toBe(true)

    el.remove()

    // timer handle without unref -> the `typeof unref` else arm
    const realSetTimeout = globalThis.setTimeout
    const el2 = mount({ [COMMON_ATTRS.DELAY]: '0' })

    el2._isVisible = false

    globalThis.setTimeout = () => 1
    el2.trigger()
    globalThis.setTimeout = realSetTimeout

    el2.remove()
  })

  test('non-word/space chunks and unknown tokens fall through to empty', () => {
    const el = mount()

    el._parseTokens = () => [
      { type: 'mystery' },
      {
        type: CSS_STRINGS.TOKEN_TAG,
        tag: 'em',
        attrStr: CHAR_STRINGS.EMPTY,
        inner: CHAR_STRINGS.EMPTY,
        chunks: [{ type: CSS_STRINGS.TOKEN_SPACE }, { type: 'mystery' }],
      },
    ]

    expect(() => el._renderContent()).not.toThrow()

    el._parseTokens = () => [
      {
        type: CSS_STRINGS.TOKEN_TAG,
        tag: 'em',
        attrStr: CHAR_STRINGS.EMPTY,
        inner: CHAR_STRINGS.EMPTY,
        chunks: [],
      },
    ]

    expect(() => el._renderContent()).not.toThrow()

    el.remove()
  })

  test('module re-evaluation respects the registered element', async () => {
    jest.resetModules()
    await import('@website/components/media/DrawText.js')

    expect(customElements.get(COMPONENT_TAGS.DRAW_TEXT)).toBeTruthy()
  })
})
