/**
 * @file misc-core-re-export-barrels.test.js
 * @description Split from misc-core.test.js — covers the "re-export barrels" describe.
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
