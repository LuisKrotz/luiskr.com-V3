/**
 * @file schema-shims-polyfills.test.js
 * @description Split from schema-shims.test.js — covers the "polyfills" describe.
 */
import { jest } from '@jest/globals'

import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

// ─── polyfills.js fallback branches ──────────────────────────────────────────
describe('polyfills', () => {
  test('installs structuredClone/Array.at/Object.hasOwn fallbacks when missing', async () => {
    const nativeClone = globalThis.structuredClone
    const nativeArrAt = Array.prototype.at
    const nativeStrAt = String.prototype.at
    const nativeHasOwn = Object.hasOwn

    delete globalThis.structuredClone
    delete Array.prototype.at
    delete String.prototype.at
    delete Object.hasOwn

    // Fresh module registry evaluation so the guards re-run
    await jest.isolateModulesAsync(async () => {
      await import('@core/legacy-polyfills/polyfills.js')
    })

    expect(typeof globalThis.structuredClone).toBe(TYPE_STRINGS.FUNCTION)
    expect(globalThis.structuredClone({ a: 1 })).toEqual({ a: 1 })
    expect([1, 2, 3].at(-1)).toBe(3)
    expect('abc'.at(1)).toBe('b')
    expect(Object.hasOwn({ k: 1 }, 'k')).toBe(true)

    globalThis.structuredClone = nativeClone
    Array.prototype.at = nativeArrAt
    String.prototype.at = nativeStrAt
    Object.hasOwn = nativeHasOwn
  })

  test('structuredClone fallback returns the value itself for unserializable input', async () => {
    delete globalThis.structuredClone

    await jest.isolateModulesAsync(async () => {
      await import('@core/legacy-polyfills/polyfills.js')
    })

    const circular = {}

    circular.self = circular

    expect(globalThis.structuredClone(circular)).toBe(circular)
  })
})
