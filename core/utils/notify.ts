/**
 * @file notify.ts
 * @description User-facing notification service. A failure is surfaced as a
 * native device notification whenever the platform allows it (Notification
 * API present + permission granted — or grantable); every other case falls
 * back to the in-page <site-toast> pill so the message can never be lost.
 *
 * Fallback ladder for the native path:
 *   1. `new Notification()` — desktop browsers
 *   2. `ServiceWorkerRegistration.showNotification()` — Android Chrome only
 *      allows OS notifications through the active service worker
 *   3. <site-toast> — guaranteed, always available
 *
 * Identical type+message pairs are deduped for NOTIFY.DEDUPE_MS so a burst
 * of repeated errors can't stack a wall of toasts.
 */

import { NOTIFY_TYPES } from '@core/tokens/data/notify.js'
import { NOTIFY_UI_KEYS, SECTION_UI_KEYS } from '@core/tokens/data/ui-keys.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { NOTIFY } from '@core/tokens/motion/notify.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { appText } from '@core/locale/ui-text.js'

/** Options accepted by `notify`/`notifyError`/`notifyLoadFailed`. */
export interface NotifyOpts {
  type?: string
  title?: string
  duration?: number
  tag?: string
  icon?: string
  toastOnly?: boolean
}

interface ToastItem {
  text: string
  type?: string
  title?: string
  duration?: number
}

/** The <site-toast> element once its chunk has upgraded it. */
type ToastElement = HTMLElement & { push?: (_item: ToastItem) => void }

/** Lazily created <site-toast> singleton (created on first use, not boot). */
let _toastEl: ToastElement | null = null

/** Dedupe registry: `${type}|${message}` → last-shown timestamp. */
const _seen = new Map<string, number>()

/** True once global error handlers are bound — keeps init idempotent. */
let _globalBound = false

/**
 * Finds or lazily mounts the toast element, upgrading the component on first
 * use so the <site-toast> chunk stays out of the boot bundle. An element
 * placed in light DOM by other means (SSR shell, tests) is adopted instead
 * of duplicated.
 */
const _ensureToast = async (): Promise<ToastElement | null> => {
  if (_toastEl?.isConnected) return _toastEl

  if (typeof document === TYPE_STRINGS.UNDEFINED) return null

  // First toast only — registers the tag, which upgrades any existing node.
  await import('@website/components/feedback/SiteToast.js')

  _toastEl =
    (document.querySelector(COMPONENT_TAGS.SITE_TOAST) as ToastElement | null) ||
    (document.createElement(COMPONENT_TAGS.SITE_TOAST) as ToastElement)

  if (!_toastEl.isConnected) {
    document.body.appendChild(_toastEl)
  }

  return _toastEl
}

/**
 * Pushes an item into the toast element.
 * @returns false when no DOM is available to host the element
 */
const _toast = async (message: string, opts: NotifyOpts): Promise<boolean> => {
  const el = await _ensureToast()

  const push = el?.push

  if (!el || typeof push !== TYPE_STRINGS.FUNCTION) return false

  ;(push as (_item: ToastItem) => void).call(el, {
    text: message,
    type: opts.type,
    title: opts.title,
    duration: opts.duration,
  })

  return true
}

/**
 * Resolves the effective Notification permission, requesting it when the
 * browser hasn't answered yet. requestPermission() may reject outside a
 * user gesture — the rejection degrades to the current (ungranted) state.
 */
const _resolvePermission = async (): Promise<NotificationPermission> => {
  if (Notification.permission === STATE_STRINGS.GRANTED)
    return STATE_STRINGS.GRANTED as NotificationPermission

  try {
    return await Notification.requestPermission()
  } catch {
    return Notification.permission
  }
}

/**
 * Attempts a native OS notification. Returns false when construction throws
 * (insecure contexts, Android's service-worker-only model) and the SW
 * channel is absent or fails as well.
 */
const _nativeNotify = async (title: string, opts: NotificationOptions): Promise<boolean> => {
  try {
    return Boolean(new Notification(title, opts))
  } catch {
    try {
      const registration = await navigator.serviceWorker?.ready

      if (registration?.showNotification) {
        await registration.showNotification(title, opts)

        return true
      }
    } catch {
      /* falls through to the toast fallback */
    }

    return false
  }
}

/**
 * Surfaces a message to the user — native notification when allowed, the
 * in-page toast otherwise.
 * @param message - body copy (localized by the caller)
 * @returns which surface took the message
 */
export const notify = async (
  message: string,
  opts: NotifyOpts = {}
): Promise<'native' | 'toast' | false> => {
  if (!message) return false

  const type = opts.type || NOTIFY_TYPES.ERROR

  const key = `${type}|${message}`

  const now = Date.now()

  if (now - (_seen.get(key) || 0) < NOTIFY.DEDUPE_MS) return false

  _seen.set(key, now)

  if (_seen.size > NOTIFY.DEDUPE_CACHE_MAX) {
    // _seen is non-empty in this branch, so keys() always yields a key —
    // the cast documents that invariant instead of a dead undefined guard.
    _seen.delete(_seen.keys().next().value as string)
  }

  if (
    !opts.toastOnly &&
    typeof Notification !== TYPE_STRINGS.UNDEFINED &&
    Notification.permission !== STATE_STRINGS.DENIED &&
    (await _resolvePermission()) === STATE_STRINGS.GRANTED
  ) {
    const title = opts.title || String(appText(SECTION_UI_KEYS.TITLE) || CHAR_STRINGS.EMPTY)

    const shown = await _nativeNotify(title, { body: message, tag: opts.tag, icon: opts.icon })

    if (shown) return 'native'
  }

  return (await _toast(message, opts)) ? 'toast' : false
}

/**
 * Generic failure shortcut — the localized "something went wrong" string.
 * Used by global handlers where the raw error detail belongs in the devlog
 * buffer (`core/devlog.ts`), not on screen.
 */
export const notifyError = (opts: NotifyOpts = {}): Promise<'native' | 'toast' | false> =>
  notify(String(appText(NOTIFY_UI_KEYS.NOTIFY_ERROR)), { type: NOTIFY_TYPES.ERROR, ...opts })

/** Resource/section load failure shortcut. */
export const notifyLoadFailed = (opts: NotifyOpts = {}): Promise<'native' | 'toast' | false> =>
  notify(String(appText(NOTIFY_UI_KEYS.NOTIFY_LOAD_FAILED)), { type: NOTIFY_TYPES.ERROR, ...opts })

/**
 * Wires window 'error' + 'unhandledrejection' to the generic error toast so
 * uncaught failures surface gracefully instead of only logging. Idempotent.
 * @returns false outside a windowed context
 */
export const initGlobalErrorHandlers = (): boolean => {
  if (typeof window === TYPE_STRINGS.UNDEFINED || _globalBound) return false

  const onFailure = () => {
    notifyError()
  }

  window.addEventListener(WINDOW_EVENTS.ERROR, onFailure)

  window.addEventListener(WINDOW_EVENTS.UNHANDLED_REJECTION, onFailure)

  _globalBound = true

  return true
}
