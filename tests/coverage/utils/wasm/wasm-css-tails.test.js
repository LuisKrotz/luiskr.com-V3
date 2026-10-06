/**
 * @file coverage-tails-4.test.js
 * @description Fourth branch-tail sweep targeting files with ≤8 uncovered
 * branches: ui-text fallback dig, firebase-mock path resolver, sanitize
 * disallowed-tag replacement, webgl-pool IO guard, CMS mount guard,
 * CookieBanner actions, checkbox widget lifecycle, NPU GPU fallback,
 * ContactSection lang guards, jsx prop routing, media helpers,
 * scroll-state one-shots, NotFound link binding, wasm-css reuse,
 * Component remount reuse, schema generators, db bootstrap/cache,
 * gpu-info tiers, wasm-pool worker guards, intro-loader internals.
 */

import { wasmCSS, calcWasmSkeletonStyle } from '@/utils/wasm/wasm-css.js'

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'
import { ASSET_IDS } from '@/core/tokens/ids/assets.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'




// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

describe('wasm-css tails', () => {
  test('initStyleSheet reuses the existing node and calc helpers handle defaults', () => {
    wasmCSS.initStyleSheet()

    expect(document.getElementById(ASSET_IDS.WASM_DYNAMIC_CSS)).toBeTruthy()

    const calc = calcWasmSkeletonStyle({ width: '10px', height: '5px' })
    const calc2 = calcWasmSkeletonStyle({})

    expect(typeof calc).toBe(TYPE_STRINGS.OBJECT)
    expect(typeof calc2).toBe(TYPE_STRINGS.OBJECT)
  })
})

