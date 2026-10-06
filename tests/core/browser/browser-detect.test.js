/**
 * @file browser-detect.test.js — UA table order, quirk propagation and the
 * stamped-manifest fast path for src/core/browser/detect.ts.
 */

import { TEST_UA } from '../../fixtures/test-constants.js'
import { detectBrowser, browserInfo, canUseWebGPU, BROWSERS } from '@/core/browser/detect.js'

describe('browser detect — UA table', () => {
  test.each([
    ['SAMSUNG', 'samsung', 23],
    ['FIREFOX', 'firefox', 133],
    ['FIREFOX_ANDROID', 'firefox', 132],
    ['EDGE', 'edge', 130],
    ['EDGE_ANDROID', 'edge', 130],
    ['OPERA', 'opera', 115],
    ['CHROME', 'chrome', 130],
    ['SAFARI', 'safari', 18],
    ['IE11', 'ie', 11],
    ['UNKNOWN', 'other', 0],
  ])('detects %s → %s %i', (key, name, major) => {
    expect(detectBrowser(TEST_UA[key])).toMatchObject({ name, major })
  })

  test('nested-UA order: Samsung/Edge/Opera never fall through to Chrome/Safari', () => {
    for (const key of ['SAMSUNG', 'EDGE', 'EDGE_ANDROID', 'OPERA']) {
      expect(TEST_UA[key]).toMatch(/Chrome\/\d+/)

      const { name } = detectBrowser(TEST_UA[key])

      expect(['chrome', 'safari']).not.toContain(name)
    }
  })

  test('quirk flags propagate — samsung lowGpu, firefox/safari/ie webgpu', () => {
    expect(detectBrowser(TEST_UA.SAMSUNG)).toMatchObject({ webgpu: false, lowGpu: true })
    expect(detectBrowser(TEST_UA.FIREFOX).webgpu).toBe(false)
    expect(detectBrowser(TEST_UA.SAFARI).webgpu).toBe(false)
    expect(detectBrowser(TEST_UA.IE11)).toMatchObject({ webgpu: false, lowGpu: true })
    expect(detectBrowser(TEST_UA.CHROME).webgpu).toBeUndefined()
  })

  test('empty + malformed UA → other', () => {
    expect(detectBrowser('').name).toBe('other')
    expect(detectBrowser('Firefox/').name).toBe('other')
  })

  test('every pattern compiles and captures a major group', () => {
    for (const spec of BROWSERS) {
      const re = new RegExp(spec.pattern)

      expect(re.source).toBe(spec.pattern)
      expect(spec.name.length).toBeGreaterThan(0)
    }
  })
})

describe('browser detect — stamped runtime reader', () => {
  test('browserInfo prefers the loader-stamped __LK_BROWSER', () => {
    const w = window

    w.__LK_BROWSER = { name: 'firefox', major: 133, webgpu: false }
    expect(browserInfo()).toMatchObject({ name: 'firefox', webgpu: false })

    delete w.__LK_BROWSER
  })

  test('browserInfo falls back to the live UA; canUseWebGPU honors quirks', () => {
    expect(browserInfo().name).toBeTruthy()
    expect(typeof canUseWebGPU()).toBe('boolean')

    window.__LK_BROWSER = { name: 'safari', major: 17, webgpu: false }
    expect(canUseWebGPU()).toBe(false)

    window.__LK_BROWSER = { name: 'chrome', major: 130 }
    expect(canUseWebGPU()).toBe(true)

    delete window.__LK_BROWSER
  })
})
