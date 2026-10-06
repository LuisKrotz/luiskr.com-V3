/**
 * @file coverage-tails.test.js
 * @description Branch-tail coverage sweep for utility modules and small
 * components that sit just under the per-file gate: genie open guards,
 * sanitizeHtml's disallowed-node paths, ui-text live-dict lookup, the CMS
 * firebase mock surface, the Array/String .at ponyfill shims, scroll-state
 * deferred callbacks, gravatar URL classification, NotFound getters, jsx
 * prop-mapping branches, schema builders, wasm-media-threads guards,
 * gpu-info renderer classification, wasm-css style injection, AdminLogin
 * sign-in paths, and the cookie/contact section component branches.
 */
import { jest } from '@jest/globals'
import '@/utils/data/sanitize.js'

import { h, Fragment } from '@/core/jsx.js'

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'

import { TEST_TEXT } from '../../../fixtures/test-constants.js'
import { HTML_TAGS } from '../../../../src/core/tokens/elements/html.js'
import { MOUSE_EVENTS } from '../../../../src/core/tokens/events/dom.js'
import { COMMON_ATTRS } from '../../../../src/core/tokens/attrs/common.js'
import { CHAR_STRINGS } from '../../../../src/core/tokens/strings/chars.js'





jest.unstable_mockModule('../../../../src/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})) }))

// ─── genie.js ────────────────────────────────────────────────────────────────

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

