/**
 * @file browser-detect-browser-detect-stamped-runtime-reader.test.js
 * @description Split from browser-detect.test.js — covers the "browser detect — stamped runtime reader" describe.
 */
import { browserInfo, canUseWebGPU } from '@core/browser/detect.js'

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
