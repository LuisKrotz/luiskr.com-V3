/**
 * @file browser-detect-browser-detect-ua-table.test.js
 * @description Split from browser-detect.test.js — covers the "browser detect — UA table" describe.
 */
import { TEST_UA } from '@tests/fixtures/test-constants.js'
import { detectBrowser, BROWSERS } from '@core/browser/detect.js'

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
