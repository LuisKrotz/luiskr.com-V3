/**
 * @file wasm-utils-wasm-css.test.js
 * @description Split from wasm-utils.test.js — covers the "wasm-css" describe.
 */
import { wasmCSS, calcWasmSkeletonStyle } from '@core/utils/wasm/wasm-css.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { ASSET_IDS } from '@core/tokens/ids/assets.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { CSS_STRINGS } from '@core/tokens/strings/css.js'

// The shared setup rAF stub calls cb() with no timestamp — wasm-scroll's
// easing math needs `now`. Re-stub here to pass monotonic timestamps.
const _raf = globalThis.requestAnimationFrame

const _installTimedRaf = () => {
  globalThis.requestAnimationFrame = (cb) => {
    const id = setTimeout(() => cb(performance.now() + 30), 5)

    if (id && typeof id.unref === TYPE_STRINGS.FUNCTION) id.unref()

    return id
  }
}

// ─── wasm-css ────────────────────────────────────────────────────────────────
describe('wasm-css', () => {
  test('injects the shared stylesheet into the head', () => {
    const style = document.getElementById(ASSET_IDS.WASM_DYNAMIC_CSS)

    expect(style).toBeTruthy()
    expect(style.tagName.toLowerCase()).toBe(HTML_TAGS.STYLE)
  })

  test('calcWasmSkeletonStyle builds a dimension style object', () => {
    const style = calcWasmSkeletonStyle(120, 30, CSS_STRINGS.VAR_RADIUS_2XS)

    expect(style.width).toBe('120px')
    expect(style.height).toBe('30px')

    const str = calcWasmSkeletonStyle('50%', '2em', CSS_STRINGS.VAR_RADIUS_FULL)

    expect(str.width).toBe('50%')
  })

  test('setWasmCSSRule dedupes selectors', () => {
    wasmCSS.setWasmCSSRule('.wasm-test-rule', 'color: red')
    wasmCSS.setWasmCSSRule('.wasm-test-rule', 'color: red')

    const el = document.getElementById(ASSET_IDS.WASM_DYNAMIC_CSS)
    const count = (el.textContent.match(/\.wasm-test-rule/g) || []).length

    expect(count).toBe(1)
  })
})
