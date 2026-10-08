/**
 * @file utils-misc-calcaspectscaled.test.js
 * @description Split from utils-misc.test.js — covers the "calcAspectScaled" describe.
 */
import { describe, test, expect } from '@jest/globals'
import { calcAspectScaled } from '@core/utils/aspect.js'

const _flush = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── aspect ──────────────────────────────────────────────────────────────────
describe('calcAspectScaled', () => {
  test('scales height proportionally to maxWidth', () => {
    expect(calcAspectScaled(1920, 1080, 960)).toBe(540)
    expect(calcAspectScaled(100, 50, 200)).toBe(100)
  })

  test('returns fallback for missing dimensions', () => {
    expect(calcAspectScaled(0, 100, 500)).toBe(100)
    expect(calcAspectScaled(100, 0, 500)).toBe(0)
    expect(calcAspectScaled(100, 50, 0)).toBe(50)
    expect(calcAspectScaled(0, 0, 0)).toBe(0)
  })
})
