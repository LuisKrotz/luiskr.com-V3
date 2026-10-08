/**
 * @file utils-deep-coverage-sanitizehtml.test.js
 * @description Split from utils-deep-coverage.test.js — covers the "sanitizeHtml" describe.
 */
import { describe, test, expect } from '@jest/globals'
import { sanitizeHtml } from '@core/utils/data/sanitize.js'

const _flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

// ─── sanitize.js ─────────────────────────────────────────────────────────────
describe('sanitizeHtml', () => {
  test('returns empty for non-strings and blank input', () => {
    expect(sanitizeHtml(42)).toBe('')
    expect(sanitizeHtml('   ')).toBe('')
  })

  test('keeps allowed tags, strips disallowed ones to text', () => {
    expect(sanitizeHtml('<b>ok</b><script>alert(1)</script>')).toBe('<b>ok</b>alert(1)')
    expect(sanitizeHtml('<div><em>x</em></div>')).toBe('x')
  })

  test('strips disallowed attributes and comments', () => {
    const out = sanitizeHtml('<p onclick="x()">a<!-- hi --></p>')

    expect(out).toBe('<p>a</p>')
  })

  test('external links get safe target/rel; javascript: hrefs are removed', () => {
    const out = sanitizeHtml(
      '<a href="https://x">l</a><a href="javascript:evil()">j</a><a href="/rel">r</a>'
    )

    expect(out).toContain('target="_blank"')
    expect(out).toContain('rel="noopener noreferrer"')
    expect(out).not.toContain('javascript:')
  })
})
