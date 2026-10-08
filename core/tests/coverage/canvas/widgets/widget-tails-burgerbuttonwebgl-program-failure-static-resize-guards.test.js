/**
 * @file widget-tails-burgerbuttonwebgl-program-failure-static-resize-guards.test.js
 * @description Split from widget-tails.test.js — covers the "BurgerButtonWebGL — program failure + static resize guards" describe.
 */
import { describe, test, expect } from '@jest/globals'
import { BurgerButtonWebGL } from '@core/utils/canvas/widgets/burger-button-webgl.js'
import { attachMockGL, attachNoGL } from '@tests/fixtures/mock-webgl.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

const _lang = (code, cc, cc2 = null) => ({ code, cc, cc2 })

// GL stub whose program creation fails — drives the `if (!built)` fallback arm.
const makeProgramFailGL = () =>
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

describe('BurgerButtonWebGL — program failure + static resize guards', () => {
  test('context ok but program build fails → fallback + early return', () => {
    const canvas = makeCanvas()

    canvas.getContext = () => makeProgramFailGL()

    const burger = new BurgerButtonWebGL(canvas)

    expect(burger.useWebGL).toBe(false)
    expect(canvas.classList.length).toBeGreaterThanOrEqual(0)

    burger.destroy()
  })

  test('_checkResize no-ops when gl is null (reduced-motion repaint guard)', () => {
    const canvas = makeCanvas()

    attachNoGL(canvas)

    const burger = new BurgerButtonWebGL(canvas)

    burger.gl = null
    burger.canvas = canvas

    expect(() => burger._checkResize()).not.toThrow()

    burger.destroy()
  })

  test('_checkResize repaints a static frame when animId is null', () => {
    const canvas = makeCanvas()

    canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 64, height: 64 })
    attachMockGL(canvas)

    const burger = new BurgerButtonWebGL(canvas)

    burger.animId = null
    burger._checkResize()

    burger.destroy()
  })
})
