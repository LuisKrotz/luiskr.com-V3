/**
 * @file browser/detect.ts
 * @description Single source of truth for engine identification. The same
 * BROWSERS table is inlined into `window.__LK` by build-targets.mjs and
 * evaluated by the ES5 browser-loader before any bundle ships; this module
 * is the typed runtime reader — `browserInfo()` prefers the loader's result
 * (`window.__LK_BROWSER`) and re-parses the UA only when the loader never
 * ran (CMS shell, tests, direct module usage).
 *
 * Quirk flags (all optional, undefined means "no data"):
 *   webgpu   — navigator.gpu is absent/flag-gated; skip the WebGPU init path
 *   lowGpu   — engine ships mostly on mid-range SoCs; start at reduced scale
 *
 * Detected `name` values: 'samsung' | 'edge' | 'opera' | 'firefox' |
 * 'chrome' | 'safari' | 'ie' | 'other'. `major` is the engine's marketing
 * version (SamsungBrowser/NN, Firefox/NN, Chrome/NN, Version/NN …).
 */

import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { VENDOR_STRINGS } from '@core/tokens/strings/vendor.js'
import { BROWSERS } from './browsers.js'
import type { BrowserQuirks } from './browsers.js'

export { BROWSERS }
/** BrowserQuirks re-export — canonical definition + docs live in ./browsers.js. */
export type { BrowserQuirks }

/** Resolved engine identity — name, marketing major version, quirks. */
export interface BrowserInfo extends BrowserQuirks {
  name: string
  major: number
}

/** The loader-free identity when nothing is known about the UA. */
const OTHER: BrowserInfo = { name: VENDOR_STRINGS.OTHER, major: 0 }

/**
 * Parses a UA string against BROWSERS. Regex `pattern` strings keep their
 * escaped form so the same table survives JSON serialization into the
 * inlined `__LK` manifest. The loop walks the ordered table and returns on
 * first match — order is load-bearing (see browsers.ts header).
 * @param ua User-Agent string to classify.
 * @returns Engine identity; `other/0` when no pattern matches.
 */
export const detectBrowser = (ua: string): BrowserInfo => {
  for (const spec of BROWSERS) {
    const m = ua.match(new RegExp(spec.pattern))

    // Every BROWSERS pattern anchors `(\d+)` — a match guarantees digits, so
    // parseInt can't produce NaN here and needs no || 0 fallback. Radix 10
    // is explicit because leading zeros would otherwise parse as octal on
    // legacy engines (MDN: always supply the radix parameter).
    if (m) return { name: spec.name, major: parseInt(m[1], 10), ...spec.quirks }
  }

  return { ...OTHER }
}

/**
 * Runtime reader — returns the loader-stamped `window.__LK_BROWSER` when
 * present (public site path), otherwise parses `navigator.userAgent`.
 * Outside a windowed context (SSR/tests without DOM) returns `other`.
 * Preferring the stamped value keeps the runtime consistent with whichever
 * build tier the ES5 loader already selected — re-parsing the same UA could
 * disagree if the tables ever diverged.
 * @returns Resolved engine identity.
 */
export const browserInfo = (): BrowserInfo => {
  const stamped =
    typeof window !== TYPE_STRINGS.UNDEFINED
      ? (window as unknown as { __LK_BROWSER?: BrowserInfo }).__LK_BROWSER
      : undefined

  if (stamped?.name) return stamped

  const ua = typeof navigator !== TYPE_STRINGS.UNDEFINED ? navigator.userAgent : ''

  return detectBrowser(ua)
}

/**
 * True when the engine may expose a usable WebGPU adapter. The check is
 * `!== false` (not `=== true`) because undefined means "no data" — absence
 * of the quirk flag must not disable WebGPU for unlisted engines.
 * @returns Whether the WebGPU init path should run.
 */
export const canUseWebGPU = (): boolean => browserInfo().webgpu !== false
