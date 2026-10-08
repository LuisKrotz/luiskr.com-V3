/**
 * @file env-guards-browser-detect-stamped-non-windowed-arms.test.js
 * @description Split from env-guards.test.js — covers the "browser detect — stamped + non-windowed arms" describe.
 */
import { browserInfo, canUseWebGPU, detectBrowser } from '@core/browser/detect.js'
import { VENDOR_STRINGS } from '@core/tokens/strings/vendor.js'

const withGlobals = (fn) => {
  const win = globalThis.window
  const nav = globalThis.navigator

  return {
    hideWindow() {
      globalThis.window = undefined
      return this
    },
    hideNavigator() {
      globalThis.navigator = undefined
      return this
    },
    restore() {
      globalThis.window = win
      globalThis.navigator = nav
    },
    run: fn,
  }
}

describe('browser detect — stamped + non-windowed arms', () => {
  test('browserInfo returns the loader-stamped __LK_BROWSER verbatim', () => {
    window.__LK_BROWSER = { name: 'firefox', major: 140, webgpu: false }

    expect(browserInfo()).toEqual({ name: 'firefox', major: 140, webgpu: false })
    expect(canUseWebGPU()).toBe(false)

    delete window.__LK_BROWSER
  })

  test('stamped entry without a name falls through to UA parsing', () => {
    window.__LK_BROWSER = { major: 0 }

    const info = browserInfo()

    expect(info).toHaveProperty('name')
    expect(info).toHaveProperty('major')

    delete window.__LK_BROWSER
  })

  test('browserInfo returns "other" outside a windowed context', () => {
    const g = withGlobals()

    g.hideWindow().hideNavigator()

    expect(browserInfo()).toEqual({ name: VENDOR_STRINGS.OTHER || 'other', major: 0 })

    g.restore()
  })

  test('window present but navigator absent → detectBrowser parses empty UA', () => {
    const g = withGlobals()

    g.hideNavigator()

    expect(browserInfo().name).toBe('other')
    expect(canUseWebGPU()).toBe(true)

    g.restore()
  })

  test('detectBrowser handles a UA that matches nothing', () => {
    expect(detectBrowser('TotallyMadeUp/9.9')).toEqual({ name: 'other', major: 0 })
  })
})
