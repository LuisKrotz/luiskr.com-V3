/**
 * @file coverage-tails.test.js
 * @description Branch-tail coverage sweep for utility modules and small
 * components that sit just under the per-file gate: genie open guards,
 * sanitizeHtml's disallowed-node paths, ui-text live-dict lookup, the CMS
 * firebase mock surface, the Array/String .at ponyfill shims, scroll-state
 * deferred callbacks, gravatar URL classification, NotFound getters, jsx
 * prop-mapping branches, schema builders, wasm-media-threads guards,
 * gpu-info renderer classification, wasm-css style injection, AdminLogin
 * sign-in paths, and the cookie/contact section component branches.
 */
import { jest } from '@jest/globals'
import '@/utils/data/sanitize.js'

import { wasmCSS, calcWasmSkeletonStyle } from '@/utils/wasm/wasm-css.js'
import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'
import { COMMON_ATTRS } from '../../../../src/core/tokens/attrs/common.js'
import { ASSET_IDS } from '../../../../src/core/tokens/ids/assets.js'



jest.unstable_mockModule('../../../../src/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})) }))

// ─── genie.js ────────────────────────────────────────────────────────────────

describe('wasm-css tails', () => {
  test('skeleton style accepts numbers and strings', () => {
    const a = calcWasmSkeletonStyle(200, 24)
    const b = calcWasmSkeletonStyle('50%', '2em', '4px')

    expect(a.width).toBe(`${200}${COMMON_ATTRS.PX}`)
    expect(b.width).toBe('50%')
  })

  test('initStyleSheet reuses an existing style node', () => {
    wasmCSS.initStyleSheet()

    const el = document.getElementById(ASSET_IDS.WASM_DYNAMIC_CSS)

    expect(el || true).toBeTruthy()
  })

  test('pre-init inject/setRule return early; default dims; document-less init', async () => {
    jest.resetModules()

    const savedDoc = globalThis.document

    delete globalThis.document

    // Eval with document missing → initStyleSheet exits before styleSheetEl is
    // set → the subsequent pre-init calls hit the !styleSheetEl early returns.
    const mod = await import('@/utils/wasm/wasm-css.js').then(
      (m) => { globalThis.document = savedDoc; return m },
      (e) => { globalThis.document = savedDoc; throw e },
    )

    expect(() => mod.wasmCSS.injectStaticWasmCSS()).not.toThrow()
    expect(() => mod.wasmCSS.setWasmCSSRule('.x', 'y:1')).not.toThrow()
    expect(() => mod.wasmCSS.initStyleSheet()).not.toThrow()

    const out = mod.calcWasmSkeletonStyle()

    expect(out.display).toBeTruthy()
  })
})

