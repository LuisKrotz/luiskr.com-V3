/**
 * @file debug/params.ts
 * @description Boot-time `?debug=…` actions. Values:
 *
 *   ?debug=sendNotificationTest  — fires the notify() pipeline once with
 *     toastOnly:true, so the <site-toast> surface is exercised end-to-end
 *     regardless of OS notification permission.
 *   ?debug=webGLMode:active      — explicit WebGL on (documents intent; the
 *     default probing path already does this).
 *   ?debug=webGLMode:fallback    — every canvas getContext('webgl*') returns
 *     null, so all widgets render their CSS/2D/static fallbacks.
 *
 * The webGLMode value itself is consumed lazily by
 * src/utils/canvas/webgl-mode.ts on each context probe — nothing needs to
 * run here for it. `runDebugActions()` only performs side-effect flags.
 */

import { DEBUG_PARAMS } from '@/core/tokens/strings/debug.js'
import { NOTIFY_TYPES } from '@/core/tokens/data/notify.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'

/**
 * All `debug` values on the current URL (empty outside a windowed context).
 * `getAll` (not `get`) because the param is repeatable — `?debug=a&debug=b`
 * must surface both flags.
 * @returns Every `?debug=` value in order.
 */
export const debugParams = (): string[] => {
  if (typeof window === TYPE_STRINGS.UNDEFINED) return []

  return new URLSearchParams(window.location.search).getAll(DEBUG_PARAMS.KEY)
}

/**
 * True when `flag` is present among the URL's `?debug=` values.
 * @param flag Debug flag token from DEBUG_PARAMS.
 * @returns Whether the flag is active.
 */
export const hasDebugFlag = (flag: string): boolean => debugParams().includes(flag)

/**
 * Runs the side-effecting debug flags once at boot. The toast test is async
 * (lazy <site-toast> chunk) — intentionally fire-and-forget so a slow chunk
 * load never blocks the app start.
 */
export const runDebugActions = (): void => {
  if (!hasDebugFlag(DEBUG_PARAMS.NOTIFICATION_TEST)) return

  import('@/utils/notify.js').then(({ notify }) =>
    notify(DEBUG_PARAMS.NOTIFICATION_TEST, { type: NOTIFY_TYPES.INFO, toastOnly: true })
  )
}
