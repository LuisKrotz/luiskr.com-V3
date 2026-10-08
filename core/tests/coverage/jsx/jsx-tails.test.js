/**
 * @file jsx-tails.test.js
 * @description Split from coverage-tails-4.test.js — covers the "jsx tails" describe.
 */
import { h } from '@core/jsx.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

describe('jsx tails', () => {
  test('style string, style object with custom props, and attr mapping', () => {
    const a = h(HTML_TAGS.DIV, { style: 'color: red' })
    const b = h(HTML_TAGS.DIV, { style: { color: 'blue', '--x-var': '1px' } })
    const c = h(HTML_TAGS.DIV, { dataset: undefined, unknownAttrX: '1' })
    const d = h(HTML_TAGS.INPUT, { disabled: true })

    expect(a.style.cssText).toContain('color')
    expect(b.style.getPropertyValue('--x-var')).toBe('1px')
    expect(c.getAttribute('unknownattrx')).toBe('1')
    expect(d.disabled).toBe(true)
  })
})
