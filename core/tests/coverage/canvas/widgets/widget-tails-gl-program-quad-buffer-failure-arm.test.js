/**
 * @file widget-tails-gl-program-quad-buffer-failure-arm.test.js
 * @description Split from widget-tails.test.js — covers the "gl-program — quad buffer failure arm" describe.
 */
import { describe, test, expect } from '@jest/globals'
import { createQuadProgram } from '@core/utils/canvas/gl-program.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

const _makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

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

describe('gl-program — quad buffer failure arm', () => {
  test('createQuadProgram returns falsy when createBuffer fails', () => {
    // Proxy with set-trap (createMockGL) swallows overrides — use a bespoke
    // stub whose createBuffer returns null so the quad guard fires.
    const gl = new Proxy(
      {},
      {
        get(_t, p) {
          if (p === 'createBuffer') return () => null
          if (p === 'createShader' || p === 'createProgram') return () => ({})
          if (p === 'getShaderParameter' || p === 'getProgramParameter') return () => true
          if (p === 'getError') return () => 0
          if (p === 'getAttribLocation') return () => 0
          if (typeof p === TYPE_STRINGS.STRING && p === p.toUpperCase()) return 1
          return () => undefined
        },
        set: () => true,
      }
    )

    const built = createQuadProgram(gl, 'void main(){}', 'void main(){}', 'X', {
      verts: new Float32Array([0, 0, 0]),
      premultiplied: false,
    })

    expect(built).toBeFalsy()
  })
})
