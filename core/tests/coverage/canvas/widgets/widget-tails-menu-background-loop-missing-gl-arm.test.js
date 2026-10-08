/**
 * @file widget-tails-menu-background-loop-missing-gl-arm.test.js
 * @description Split from widget-tails.test.js — covers the "menu-background loop — missing gl arm" describe.
 */
import { describe, test, expect } from '@jest/globals'
import { renderFrame } from '@core/utils/canvas/loaders/menu-background/loop.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

const _lang = (code, cc, cc2 = null) => ({ code, cc, cc2 })

// GL stub whose program creation fails — drives the `if (!built)` fallback arm.
const _makeProgramFailGL = () =>
  new Proxy(
    {},
    {
      get(_t, p) {
        if (p === 'createShader' || p === 'createBuffer') return () => ({})
        if (p === 'createProgram') return () => null
        if (p === 'getShaderParameter') return () => true
        if (p === 'getError') return () => 0
        if (p === 'getProgramParameter') return () => false
        if (p === 'getProgramInfoLog' || p === 'getShaderInfoLog') return () => 'fail'
        if (typeof p === TYPE_STRINGS.STRING && p === p.toUpperCase()) return 1
        return () => undefined
      },
      set: () => true,
    }
  )

describe('menu-background loop — missing gl arm', () => {
  test('renderFrame no-ops when host.gl is absent', () => {
    const host = { gl: null, canvas: makeCanvas() }

    expect(() => renderFrame(host)).not.toThrow()
    expect(() => renderFrame(host, 12)).not.toThrow()
  })
})
