/**
 * @file jsx-tails-test-js.test.js
 * @description Split from coverage-tails.test.js — covers the "jsx tails" describe.
 */
import { jest } from '@jest/globals'
import '@core/utils/data/sanitize.js'

import { h, Fragment } from '@core/jsx.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'

jest.unstable_mockModule('@core/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})) }))

describe('jsx tails', () => {
  test('style object/string, event listeners, mapped + raw props', () => {
    const onClick = jest.fn()
    const el = h(HTML_TAGS.BUTTON, {
      onClick,
      className: TEST_TEXT.HELLO,
      style: { color: 'red', '--x': '1' },
      htmlFor: TEST_TEXT.SECOND,
      'data-zeta': '1' })

    el.dispatchEvent(new Event(MOUSE_EVENTS.CLICK))

    expect(onClick).toHaveBeenCalled()
    expect(el.className).toBe(TEST_TEXT.HELLO)

    const el2 = h(HTML_TAGS.DIV, { style: 'color:red', playsInline: true, ref: (n) => n, dangerouslySetInnerHTML: undefined })

    expect(el2).toBeTruthy()

    const svg = h('svg', { className: TEST_TEXT.HELLO })

    expect(svg.getAttribute(COMMON_ATTRS.CLASS)).toBe(TEST_TEXT.HELLO)
  })

  test('non-string/non-object style and missing __html take the guarded paths', () => {
    const el = h(HTML_TAGS.DIV, { style: 5, dangerouslySetInnerHTML: {} })

    expect(el).toBeTruthy()
    expect(el.innerHTML).toBe(CHAR_STRINGS.EMPTY)
  })

  test('Fragment defaults absent props and wraps scalar children', () => {
    const frag = Fragment()

    expect(frag).toBeTruthy()

    const scalar = Fragment({ children: TEST_TEXT.HELLO })

    expect(scalar.childNodes.length).toBe(1)
  })
})
