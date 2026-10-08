/**
 * @file misc-core-entry-shims.test.js
 * @description Split from misc-core.test.js — covers the "entry shims" describe.
 */
import { describe, test, expect } from '@jest/globals'

// Barrel/shim modules — imported for coverage of their re-export statements.
import '@core/safari/loader.js'
import '@/registerServiceWorker.js'

// ─── entry shims ─────────────────────────────────────────────────────────────
describe('entry shims', () => {
  test('safari-loader and registerServiceWorker evaluate without throwing', () => {
    // Imports above already executed the module bodies — reaching here is
    // the assertion.
    expect(true).toBe(true)
  })
})
