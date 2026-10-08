/**
 * @file docs/copy-guard.ts
 * @description Copy-protection layer for the docs source viewer.
 *
 * Attach to the viewer container: intercepts `copy`/`cut` (rewrites the
 * clipboard payload to the GitHub repo URL), `contextmenu` (blocks the
 * "copy/inspect" surface), `selectstart`+`dragstart` (blocks text lift),
 * `beforeprint` (print → PDF = exfil), and the PrintScreen keyup. Every
 * blocked attempt toasts the translated message and fires telemetry.
 *
 * Browsers cannot fully prevent OS-level screenshots/screen recording —
 * the guards raise the bar on every web-accessible vector and log the
 * attempt; `@media print` blanks the protected region in the stylesheet.
 */

import {
  CLIPBOARD_EVENTS,
  DRAG_EVENTS,
  KEYBOARD_EVENTS,
  MOUSE_EVENTS,
} from '@core/tokens/events/dom.js'
import { DOCS_STRINGS } from '@core/tokens/strings/docs.js'
import { SOCIAL_URLS } from '@core/tokens/media/urls.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { notify } from '@core/utils/notify.js'
import { trackCopyAttempt } from './telemetry.js'

/** Disposer bag — each attach returns the remover. */
export type GuardDisposer = () => void

/**
 * The translated toast body — resolved by the caller from the docs-portal
 * CMS component node; falls back to the English literal so a missing
 * translation never silently swallows the warning.
 */
const guardToast = (message: string): void => {
  void notify(message || DOCS_STRINGS.COPY_TOAST_FALLBACK, { toastOnly: true })
}

/**
 * Rewrites an in-flight clipboard payload to the GitHub repo URL — the
 * paste target receives the repo link instead of protected source text.
 */
const hijackClipboard = (e: ClipboardEvent): void => {
  e.preventDefault()

  if (e.clipboardData) {
    e.clipboardData.setData('text/plain', SOCIAL_URLS.GITHUB_REPO)
  }
}

/**
 * Wires every guard listener onto `root` (typically the viewer container
 * or the component shadow root). `isProtected` gates interception so the
 * guard only bites while a protected page (source-code file) is open —
 * normal browsing of docs/reports keeps full clipboard freedom.
 * @param root       Element/ShadowRoot to attach to.
 * @param isProtected Whether the current view is guarded right now.
 * @param getPath    Returns the current docs path for telemetry.
 * @param toastText  Localized toast message getter.
 * @returns Disposer removing every listener.
 */
export const attachCopyGuard = (
  root: HTMLElement | ShadowRoot,
  isProtected: () => boolean,
  getPath: () => string,
  toastText: () => string
): GuardDisposer => {
  const disposers: Array<() => void> = []

  const on = (target: EventTarget, type: string, fn: EventListener, opts?: boolean) => {
    target.addEventListener(type, fn, opts)

    disposers.push(() => target.removeEventListener(type, fn, opts))
  }

  const guarded = (kind: 'copy' | 'cut' | 'contextmenu', e: Event) => {
    if (!isProtected()) return

    if (kind !== 'contextmenu') hijackClipboard(e as ClipboardEvent)
    else e.preventDefault()

    guardToast(toastText())

    trackCopyAttempt(kind, getPath())
  }

  on(root, CLIPBOARD_EVENTS.COPY, (e: Event) => guarded('copy', e))
  on(root, CLIPBOARD_EVENTS.CUT, (e: Event) => guarded('cut', e))
  on(root, MOUSE_EVENTS.CONTEXTMENU, (e: Event) => guarded('contextmenu', e))

  on(root, CLIPBOARD_EVENTS.SELECTSTART, (e: Event) => {
    if (isProtected()) e.preventDefault()
  })

  on(root, DRAG_EVENTS.DRAGSTART, (e: Event) => {
    if (isProtected()) e.preventDefault()
  })

  on(document, KEYBOARD_EVENTS.KEYUP, (e: Event) => {
    const key = (e as KeyboardEvent).key

    if (key === DOCS_STRINGS.KEY_PRINT_SCREEN && isProtected()) {
      guardToast(toastText())

      trackCopyAttempt('printscreen', getPath())

      // Best-effort clipboard clear so a captured frame can't paste.
      if (
        typeof navigator !== TYPE_STRINGS.UNDEFINED &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === TYPE_STRINGS.FUNCTION
      ) {
        void navigator.clipboard.writeText(ATTR_VALUES.EMPTY).catch(() => {})
      }
    }
  })

  // Print (Ctrl+P / menu) blanks the region via @media print — this hook
  // fires the telemetry + toast side of the attempt.
  on(window, CLIPBOARD_EVENTS.BEFORE_PRINT, () => {
    if (!isProtected()) return

    guardToast(toastText())

    trackCopyAttempt('print', getPath())
  })

  return () => disposers.forEach((d) => d())
}
