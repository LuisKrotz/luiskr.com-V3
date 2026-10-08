/**
 * @file es-targets.mjs
 * @description The multi-engine build matrix: every ES tier the site ships,
 * how to transpile it (esbuild/terser/lightningcss knobs), and the runtime
 * feature-detection probes used by the inline browser loader
 * (scripts/build/browser-loader.js) to pick the newest tier a browser supports.
 *
 * Tier semantics: a build transpiled for ES level X may only run where level
 * X is fully supported, so each tier's `test` probes the flagship features
 * NEW in that level. The loader walks newest → oldest and serves the first
 * tier whose probes all pass — browsers always get the cleanest code they
 * can execute, never a polyfilled-by-default bundle.
 */

/**
 * Feature-detection probes. Two kinds:
 *   - API checks: plain expressions evaluated via new Function (truthy pass)
 *   - Syntax checks: snippets wrapped in new Function — a parse error on an
 *     old engine throws, which IS the negative signal. Never embed new
 *     syntax as a literal in the loader itself (it must stay ES5-parseable).
 */
export const ES_TARGETS = [
  {
    name: 'esnext',
    label: 'ESNext — untransformed bleeding edge (engines shipping stage-4+ APIs ahead of ES2026)',
    viteTarget: 'esnext',
    terserEcma: 2026,
    cssTarget: 'esnext',
    format: 'module',
    test: [
      `typeof RegExp.escape === 'function'`,
      `typeof Set.prototype.union === 'function'`,
      `typeof Iterator === 'function'`,
      `typeof Float16Array === 'function'`,
      `typeof Math.sumPrecise === 'function'`,
    ],
  },
  {
    name: 'es2026',
    label: 'ES2026 / ESNext — default, zero prefixes, modern browsers + Lighthouse',
    viteTarget: 'esnext',
    terserEcma: 2026,
    cssTarget: 'esnext',
    format: 'module',
    test: [
      `typeof RegExp.escape === 'function'`,
      `typeof Set.prototype.union === 'function'`,
      `typeof Iterator === 'function'`,
    ],
  },
  {
    name: 'es2025',
    label: 'ES2025 — Set methods / RegExp.escape era (Chrome 122+, Safari 17+)',
    viteTarget: 'es2025',
    terserEcma: 2025,
    cssTarget: 'chrome120',
    format: 'module',
    test: [`typeof Set.prototype.union === 'function'`, `typeof Object.groupBy === 'function'`],
  },
  {
    name: 'es2024',
    label: 'ES2024 — Object.groupBy / Promise.withResolvers (Chrome 117+)',
    viteTarget: 'es2024',
    terserEcma: 2024,
    cssTarget: 'chrome115',
    format: 'module',
    test: [`typeof Object.groupBy === 'function'`, `typeof Promise.withResolvers === 'function'`],
  },
  {
    name: 'es2023',
    label: 'ES2023 — immutable array methods findLast/toSorted (Chrome 110+)',
    viteTarget: 'es2023',
    terserEcma: 2023,
    cssTarget: 'chrome108',
    format: 'module',
    test: [
      `typeof Array.prototype.toSorted === 'function'`,
      `typeof Array.prototype.findLast === 'function'`,
    ],
  },
  {
    name: 'es2022',
    label: 'ES2022 — Object.hasOwn / .at / private class fields (Chrome 93+)',
    viteTarget: 'es2022',
    terserEcma: 2022,
    cssTarget: 'chrome93',
    format: 'module',
    test: [
      `typeof Object.hasOwn === 'function'`,
      `typeof Array.prototype.at === 'function'`,
      `(function(){ return (class { #f = 1; g(){ return this.#f } }).prototype.g.call(new (class { #f = 1; g(){ return this.#f } })()) === 1 })()`,
    ],
  },
  {
    name: 'es2021',
    label: 'ES2021 — replaceAll / Promise.any / ??= (Chrome 85+, Safari 14+)',
    viteTarget: 'es2021',
    terserEcma: 2021,
    cssTarget: 'chrome85',
    format: 'module',
    test: [
      `typeof String.prototype.replaceAll === 'function'`,
      `typeof Promise.any === 'function'`,
      `(function(){ var o = {}; o.x ??= 1; return o.x === 1 })()`,
    ],
  },
  {
    name: 'es2020',
    label: 'ES2020 — ?. ?? globalThis (Chrome 80+, Safari 13.1+)',
    viteTarget: 'es2020',
    terserEcma: 2020,
    cssTarget: 'chrome80',
    format: 'module',
    test: [
      `(function(){ var o = { a: 1 }; return (o?.a ?? 0) === 1 })()`,
      `typeof globalThis === 'object'`,
      `typeof Promise.allSettled === 'function'`,
    ],
  },
  {
    name: 'es2019',
    label: 'ES2019 — flat / fromEntries / optional catch (Chrome 73+)',
    viteTarget: 'es2019',
    terserEcma: 2019,
    cssTarget: 'chrome73',
    format: 'module',
    test: [
      `typeof Array.prototype.flat === 'function'`,
      `typeof Object.fromEntries === 'function'`,
      `(function(){ try { throw 0 } catch { return true } })()`,
    ],
  },
  {
    name: 'es2018',
    label: 'ES2018 — async iteration / object spread / lookbehind (Chrome 64+)',
    viteTarget: 'es2018',
    terserEcma: 2018,
    cssTarget: 'chrome64',
    format: 'module',
    test: [
      `(async function(){ for await (const x of []) { return x } })`,
      `typeof Promise.prototype.finally === 'function'`,
      `/a(?<=x)a/.test('xa')`,
    ],
  },
  {
    name: 'es2017',
    label: 'ES2017 — async/await / Object.values (Chrome 55+, Safari 11+)',
    viteTarget: 'es2017',
    terserEcma: 2017,
    cssTarget: 'chrome55',
    format: 'module',
    test: [
      `(async function(){ return await Promise.resolve(1) })`,
      `typeof Object.values === 'function'`,
      `typeof String.prototype.padStart === 'function'`,
    ],
  },
  {
    name: 'es2016',
    label:
      'ES2016 — ** / includes. IIFE classic bundle for pre-module browsers (EdgeHTML, Safari 10, Samsung ≤7)',
    viteTarget: 'es2015',
    terserEcma: 2015,
    cssTarget: 'ie11',
    format: 'iife',
    legacy: true,
    test: [
      `typeof Array.prototype.includes === 'function'`,
      `(function(){ return 2 ** 3 === 8 })()`,
    ],
  },
]

/** Polyfill groups — each loads ONLY when its runtime guard fails. */
export const POLYFILLS = [
  {
    name: 'es-core',
    entry: 'core/legacy-polyfills/es-core.js',
    // Missing any core primitive → needs the whole ES shim layer.
    guard: `typeof Promise === 'function' && typeof Symbol === 'function' && typeof Map === 'function' && typeof Object.assign === 'function'`,
  },
  {
    name: 'fetch',
    entry: 'core/legacy-polyfills/fetch.js',
    guard: `typeof fetch === 'function'`,
  },
  {
    name: 'webcomponents',
    entry: 'core/legacy-polyfills/webcomponents.js',
    guard: `typeof customElements === 'object' && typeof Element.prototype.attachShadow === 'function'`,
  },
  {
    name: 'io',
    entry: 'core/legacy-polyfills/io.js',
    guard: `typeof IntersectionObserver === 'function'`,
  },
  {
    name: 'ro',
    entry: 'core/legacy-polyfills/ro.js',
    guard: `typeof ResizeObserver === 'function'`,
  },
  {
    name: 'dom',
    entry: 'core/legacy-polyfills/dom.js',
    guard: `typeof queueMicrotask === 'function' && typeof requestIdleCallback === 'function' && typeof structuredClone === 'function' && typeof AbortController === 'function' && typeof Element.prototype.closest === 'function'`,
  },
  {
    name: 'cssvars',
    entry: 'core/legacy-polyfills/cssvars.js',
    guard: `typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('(--a:0)')`,
  },
]

/** Load order — core shims first, they may be prerequisites of later groups. */
export const POLYFILL_ORDER = ['es-core', 'fetch', 'dom', 'webcomponents', 'io', 'ro', 'cssvars']

/**
 * Browser identification + per-engine quirks. Order is significant: UA
 * strings nest (Samsung Internet and Edge both claim Chrome, every modern
 * UA claims Safari), so the most specific brands must match first.
 *
 * `quirks` are runtime hints inlined into `window.__LK_BROWSER` by the
 * loader — consumers (WebGL/WebGPU capability checks, viewport math) read
 * them instead of re-sniffing. `webgpu:false` marks engines where
 * `navigator.gpu` is absent or flag-gated so the app skips a doomed init
 * attempt and goes straight to the WebGL path; `lowGpu` marks engines that
 * ship mostly on mid-range SoCs, where the renderers can drop resolution
 * scale up-front instead of probing into thermal throttling.
 */
/**
 * Browser identification table — the canonical copy lives in
 * `core/browser/detect.ts` (BROWSERS) so the ES5 loader manifest and
 * the typed runtime reader can never drift apart. `pattern` strings are
 * regex sources — they survive JSON serialization into the `__LK`
 * manifest; the loader recompiles them with `new RegExp(pattern)`.
 *
 * Quirk flags stamped on `window.__LK_BROWSER`:
 *   webgpu   — navigator.gpu is absent/flag-gated; the app skips the
 *              WebGPU init attempt and goes straight to the WebGL path
 *   lowGpu   — engine ships mostly on mid-range SoCs; renderers may start
 *              at a reduced resolution scale instead of probing into
 *              thermal throttling
 */
export { BROWSERS } from '../../core/browser/browsers.ts'
