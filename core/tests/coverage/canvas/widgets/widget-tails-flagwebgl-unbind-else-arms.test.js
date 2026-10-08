/**
 * @file widget-tails-flagwebgl-unbind-else-arms.test.js
 * @description Split from widget-tails.test.js — covers the "FlagWebGL — unbind else-arms" describe.
 */
import { describe, test, expect } from '@jest/globals'
import { FlagWebGL } from '@core/utils/canvas/widgets/flag-webgl.js'
import { attachNoGL } from '@tests/fixtures/mock-webgl.js'
import { LOCALES } from '@core/constants.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

const lang = (code, cc, cc2 = null) => ({ code, cc, cc2 })

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

describe('FlagWebGL — unbind else-arms', () => {
  test('destroy with boundTarget but no handlers → else arms', () => {
    const canvas = makeCanvas()

    attachNoGL(canvas)

    const flag = new FlagWebGL(canvas, lang(LOCALES.EN, 'us'))

    flag.boundTarget = document.createElement(HTML_TAGS.DIV || 'div')
    flag.onMouseEnter = undefined
    flag.onMouseLeave = undefined

    expect(() => flag.destroy()).not.toThrow()
  })
})
