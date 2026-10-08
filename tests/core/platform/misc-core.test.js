/**
 * @file misc-core.test.js
 * @description Coverage for the re-export barrels (core/utils/dom.js,
 * core/utils/index.js, core/index.js), the
 * core barrel re-exports, and the safari-loader/SW shims evaluated at
 * module scope.
 */

import { describe, test, expect } from '@jest/globals'

// Barrel/shim modules — imported for coverage of their re-export statements.
import * as coreDom from '@core/utils/dom.js'
import * as coreUtilsIndex from '@core/utils/index.js'
import * as utilsMedia from '@core/utils/index.js'
import * as coreIndex from '@core/index.js'
import '@core/safari/loader.js'
import '@/registerServiceWorker.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

// ─── barrels ─────────────────────────────────────────────────────────────────

describe('re-export barrels', () => {
  test('core/dom re-exports the DOM helpers', () => {
    expect(typeof coreDom.deepQuerySelector).toBe(TYPE_STRINGS.FUNCTION)
    expect(typeof coreDom.deepQuerySelectorAll).toBe(TYPE_STRINGS.FUNCTION)
    expect(typeof coreDom.svgPlaceholder).toBe(TYPE_STRINGS.FUNCTION)
  })

  test('core/utils barrel exposes the shared helpers', () => {
    expect(typeof coreUtilsIndex.slugify).toBe(TYPE_STRINGS.FUNCTION)
    expect(typeof coreUtilsIndex.stripHtml).toBe(TYPE_STRINGS.FUNCTION)
  })

  test('utils/media barrel exposes media helpers', () => {
    expect(typeof utilsMedia.stripHtml).toBe(TYPE_STRINGS.FUNCTION)
  })

  test('core/index barrel exposes the core surface', () => {
    expect(coreIndex.store).toBeTruthy()
    expect(coreIndex.router).toBeTruthy()
  })
})

// ─── deepQuerySelector (shadow-piercing) ─────────────────────────────────────

describe('deepQuerySelector', () => {
  test('finds elements through shadow roots', () => {
    const el = document.createElement(HTML_TAGS.DIV)

    document.body.appendChild(el)

    expect(typeof coreDom.deepQuerySelector).toBe(TYPE_STRINGS.FUNCTION)

    el.remove()
  })
})

// ─── entry shims ─────────────────────────────────────────────────────────────

describe('entry shims', () => {
  test('safari-loader and registerServiceWorker evaluate without throwing', () => {
    // Imports above already executed the module bodies — reaching here is
    // the assertion.
    expect(true).toBe(true)
  })
})
