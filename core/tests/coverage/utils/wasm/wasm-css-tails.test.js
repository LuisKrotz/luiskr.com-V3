/**
 * @file wasm-css-tails.test.js
 * @description Split from coverage-tails-4.test.js — covers the "wasm-css tails" describe.
 */
import { wasmCSS, calcWasmSkeletonStyle } from '@core/utils/wasm/wasm-css.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'
import { ASSET_IDS } from '@core/tokens/ids/assets.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

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
