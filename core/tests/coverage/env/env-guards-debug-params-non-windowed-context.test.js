/**
 * @file env-guards-debug-params-non-windowed-context.test.js
 * @description Split from env-guards.test.js — covers the "debug params — non-windowed context" describe.
 */
import { debugParams, hasDebugFlag, runDebugActions } from '@core/debug/params.js'

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

describe('debug params — non-windowed context', () => {
  test('debugParams/hasDebugFlag/runDebugActions are safe without window', () => {
    const g = withGlobals()

    g.hideWindow()

    expect(debugParams()).toEqual([])
    expect(hasDebugFlag('sendNotificationTest')).toBe(false)
    expect(() => runDebugActions()).not.toThrow()

    g.restore()
  })
})
