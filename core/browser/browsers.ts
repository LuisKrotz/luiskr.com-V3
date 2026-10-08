/**
 * @file browser/browsers.ts
 * @description Zero-dependency UA detection table — shared by the runtime
 * (`browser/detect.ts`), the build manifest (`build/es-targets.mjs` →
 * `window.__LK.browsers`) and the ES5 browser-loader, which recompiles each
 * `pattern` with `new RegExp(pattern)`. Leaf module: no imports, so Node's
 * type-stripping can load it directly from build scripts.
 *
 * Order is load-bearing: Samsung Internet, Edge and Opera all carry
 * `Chrome/…` in their UA, Firefox carries `Gecko/…`, and every modern UA
 * ends in `Safari/…` — the first match wins, so specific brands go first.
 */

/** Quirk hints the loader stamps on `window.__LK_BROWSER`. */
export interface BrowserQuirks {
  /** navigator.gpu absent/flag-gated — the app skips the WebGPU init path. */
  webgpu?: boolean
  /** Mostly mid-range SoCs — renderers may start at reduced resolution scale. */
  lowGpu?: boolean
}

/** One row of the detection table — UA regex source plus its quirks. */
export interface BrowserSpec {
  name: string
  pattern: string
  quirks: BrowserQuirks
}

/** Ordered UA patterns — first match wins. */
export const BROWSERS: BrowserSpec[] = [
  // Samsung Internet — Chromium-based, ships on mid-range Galaxy SoCs.
  // UA: `… Chrome/120.0.0.0 Mobile Safari/537.36 SamsungBrowser/23.0`
  { name: 'samsung', pattern: 'SamsungBrowser\\/(\\d+)', quirks: { webgpu: false, lowGpu: true } },
  // Edge legacy (Edg/) + Chromium Edge / Android Edge (EdgA/) — the
  // `Edg[eA]?` class covers both spellings; placed before Chrome since Edge
  // UAs also carry `Chrome/…`.
  { name: 'edge', pattern: 'Edg[eA]?\\/(\\d+)', quirks: {} },
  // Opera — `OPR/` suffix on Chromium UAs; also before the Chrome catch-all.
  { name: 'opera', pattern: 'OPR\\/(\\d+)', quirks: {} },
  // Firefox: `… Gecko/20100101 Firefox/133.0`. WebGPU is flag-gated
  // (Windows-only since FF141, unavailable on Android/macOS stable).
  { name: 'firefox', pattern: 'Firefox\\/(\\d+)', quirks: { webgpu: false } },
  { name: 'chrome', pattern: 'Chrome\\/(\\d+)', quirks: {} },
  // Safari keeps its version in `Version/x.y`, engine is `Safari/…`.
  { name: 'safari', pattern: 'Version\\/(\\d+)[^\\d].*Safari\\/', quirks: { webgpu: false } },
  // IE11 and older — Trident shells report `rv:NN`.
  {
    name: 'ie',
    pattern: '(?:MSIE |Trident\\/.*rv:)(\\d+)',
    quirks: { webgpu: false, lowGpu: true },
  },
]
