/**
 * @file debug-params-debug-params-notification-test-flag.test.js
 * @description Split from debug-params.test.js — covers the "debug params — notification test flag" describe.
 */
import { DEBUG_PARAMS } from '@core/tokens/strings/debug.js'
import { debugParams, hasDebugFlag, runDebugActions } from '@core/debug/params.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'

const setSearch = (s) => window.history.replaceState(null, '', s)

const restore = () => {
  setSearch('/')
  document.documentElement.classList.remove(STATE_CLASSES.REDUCED_MOTION)
}

describe('debug params — notification test flag', () => {
  afterEach(() => {
    restore()
    document.querySelector(COMPONENT_TAGS.SITE_TOAST)?.remove()
  })

  test('sendNotificationTest mounts a real <site-toast> with the test text', async () => {
    setSearch(`/?${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.NOTIFICATION_TEST}`)

    expect(debugParams()).toContain(DEBUG_PARAMS.NOTIFICATION_TEST)
    expect(hasDebugFlag(DEBUG_PARAMS.NOTIFICATION_TEST)).toBe(true)

    runDebugActions()

    // notify() → lazy <site-toast> chunk → push() — wait for the whole chain
    await new Promise((r) => setTimeout(r, 400))

    const toast = document.querySelector(COMPONENT_TAGS.SITE_TOAST)

    expect(toast).toBeTruthy()
    expect(toast.shadowRoot?.textContent || toast.textContent).toContain(
      DEBUG_PARAMS.NOTIFICATION_TEST
    )
  })

  test('no flag → debugParams empty, runDebugActions is a no-op', async () => {
    setSearch('/')

    expect(debugParams()).toEqual([])
    expect(hasDebugFlag(DEBUG_PARAMS.NOTIFICATION_TEST)).toBe(false)
    expect(document.querySelector(COMPONENT_TAGS.SITE_TOAST)).toBeNull()

    runDebugActions()
    await new Promise((r) => setTimeout(r, 0))
    expect(document.querySelector(COMPONENT_TAGS.SITE_TOAST)).toBeNull()
  })
})
