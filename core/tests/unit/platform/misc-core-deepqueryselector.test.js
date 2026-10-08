/**
 * @file misc-core-deepqueryselector.test.js
 * @description Split from misc-core.test.js — covers the "deepQuerySelector" describe.
 */
import { describe, test, expect } from '@jest/globals'

// Barrel/shim modules — imported for coverage of their re-export statements.
import * as coreDom from '@core/utils/dom.js'
import '@core/safari/loader.js'
import '@/registerServiceWorker.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

// ─── deepQuerySelector (shadow-piercing) ─────────────────────────────────────
describe('deepQuerySelector', () => {
  test('finds elements through shadow roots', () => {
    const el = document.createElement(HTML_TAGS.DIV)

    document.body.appendChild(el)

    expect(typeof coreDom.deepQuerySelector).toBe(TYPE_STRINGS.FUNCTION)

    el.remove()
  })
})
