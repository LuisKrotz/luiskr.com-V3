/**
 * @file docs/telemetry.ts
 * @description Copy-attempt telemetry for the docs source viewer.
 *
 * Every guarded interaction (copy, cut, printscreen, print) posts one
 * record to the RTDB `docs-stats/copy-attempts` collection via the REST
 * endpoint — the same public-read channel the data layer uses, so no SDK
 * chunk is pulled. The visitor's IP can never be read client-side; the
 * REST request itself is what Firebase logging observes — the record
 * captures the client-side system profile (UA, screen, cores, TZ, route)
 * so the admin can correlate attempts.
 *
 * `navigator.sendBeacon` carries the request when available (unload-safe
 * while a viewer navigates away), fetch+keepalive otherwise. Analytics
 * fans out to `gtag` only when a GA global exists — the site has no GA
 * chunk of its own.
 */

import { CDN_URLS } from '@core/tokens/media/urls.js'
import { DB_PATHS } from '@core/tokens/routes/paths.js'
import { DOCS_STRINGS } from '@core/tokens/strings/docs.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { devWarn } from '@core/devlog.js'

/** Guard surfaces that generate telemetry — each maps to one event type. */
export type CopyAttemptKind = 'copy' | 'cut' | 'printscreen' | 'print' | 'contextmenu'

/**
 * Client-side system profile — best-effort, all fields optional because
 * every API is feature-detected (happy-dom exposes none of the hardware
 * hints).
 */
const systemInfo = (): Record<string, unknown> => ({
  ua: navigator.userAgent,
  platform: navigator.platform,
  language: navigator.language,
  cores: navigator.hardwareConcurrency || 0,
  screen: `${window.screen.width}x${window.screen.height}@${window.devicePixelRatio}`,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
})

/**
 * Posts one copy-attempt record. Fire-and-forget: the guard never blocks
 * the UI on the POST (beacon for unload safety, fetch keepalive fallback).
 * @param kind Which guard surface fired.
 * @param path The docs path being viewed (manifest-relative).
 */
export const trackCopyAttempt = (kind: CopyAttemptKind, path: string): void => {
  const url = `${CDN_URLS.FIREBASE_DB}${CHAR_STRINGS.SLASH}${DB_PATHS.DOCS_STATS}copy-attempts${CHAR_STRINGS.JSON_EXT}`

  const record = {
    kind,
    path,
    ts: Date.now(),
    event: DOCS_STRINGS.EVENT_COPY_ATTEMPT,
    ...systemInfo(),
  }

  const body = JSON.stringify(record)

  try {
    if (
      typeof navigator !== TYPE_STRINGS.UNDEFINED &&
      typeof navigator.sendBeacon === TYPE_STRINGS.FUNCTION
    ) {
      if (navigator.sendBeacon(url, body)) return
    }

    if (typeof fetch === TYPE_STRINGS.FUNCTION) {
      void fetch(url, {
        method: 'POST',
        body,
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
      }).catch((err) => devWarn('docs copy telemetry failed', err))
    }
  } catch (err) {
    devWarn('docs copy telemetry error', err)
  }

  // Analytics fan-out — gtag exists only when a GA tag is injected; the
  // RTDB record above is the durable channel.
  const gtag: ((a: string, b: string, c: object) => void) | undefined = (
    globalThis as { gtag?: (a: string, b: string, c: object) => void }
  ).gtag

  if (gtag) {
    gtag('event', DOCS_STRINGS.EVENT_COPY_ATTEMPT, { kind, path })
  }
}
