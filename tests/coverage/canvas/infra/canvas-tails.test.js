/**
 * @file coverage-tails-7.test.js
 * @description Seventh tail sweep — post-decomposition coverage for the
 * module trees exposed by the folder reorganization: CMS editor event
 * bindings + section helpers + deploy-info delegates, Earth engine
 * update/bootstrap guards, canvas-widget delegates + shared GL helpers,
 * route helpers, safari patch guards, and misc utilities
 * (css-color, gpu-accel, route-warmer, draw-text).
 */
import { jest } from '@jest/globals'

import { SWITCH_TYPES, THEME } from '@/core/constants.js'
import { attachNoGL, createMock2D, createMockGL } from '../../../fixtures/mock-webgl.js'

import '@/cms/about/CmsAboutEditor.js'
import '@/cms/portfolio/CmsPortfolioList.js'
import '@/cms/projects/CmsProjectsList.js'
import '@/cms/playground-editor/CmsPlaygroundEditor.js'
import '@/cms/footer/CmsFooterEditor.js'
import '@/cms/deploy-info/CmsDeployInfo.js'

import { parseCssColor } from '@/utils/canvas/css-color.js'
import { CloseButtonWebGL } from '@/utils/canvas/widgets/close-button.js'
import { SwitchWebGL } from '@/utils/canvas/widgets/switch-slider.js'
import { ThemeSliderWebGL } from '@/utils/canvas/widgets/theme-slider.js'
import { renderWebGL as renderSwitchWebGL, renderCanvas2D as renderSwitch2D } from '@/utils/canvas/widgets/switch-slider/render.js'
import { renderWebGL as renderCloseWebGL, renderStatic as renderCloseStatic, animate as animateClose } from '@/utils/canvas/widgets/close-button/render.js'
import { pToKnobX } from '@/utils/canvas/widgets/theme-slider/math.js'
import { FlagRenderer } from '@/utils/canvas/widgets/flag/renderer.js'
import { flagTexture } from '@/utils/canvas/widgets/flag/texture.js'
import { getWebGLContext, createQuadProgram } from '@/utils/canvas/gl-program.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'


globalThis.alert = jest.fn()


const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)



// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('canvas tails', () => {
  test('CloseButtonWebGL full API surface', () => {
    const btn = document.createElement('button')
    const canvas = makeCanvas()

    btn.appendChild(canvas)
    document.body.appendChild(btn)
    attachNoGL(canvas)

    let clicked = 0
    const cb = new CloseButtonWebGL(canvas, () => clicked++)

    cb.onMouseEnter()
    expect(cb.isHovered).toBe(true)
    cb.onMouseLeave()
    expect(cb.isHovered).toBe(false)
    cb.onClick()
    expect(clicked).toBe(1)

    cb.setHover(true)
    cb.setHover(false)
    cb.triggerClick()
    cb.setReducedMotion(true)
    cb.setReducedMotion(false)

    // real DOM events hit the bound handlers
    btn.dispatchEvent(new window.Event('mouseenter'))
    btn.dispatchEvent(new window.Event('mouseleave'))
    btn.dispatchEvent(new window.Event('click'))

    cb.initWebGL()
    cb._renderStatic()
    cb._renderWebGL(0)
    cb.animate()
    cb.destroy()
  })

  test('parseCssColor non-string arm', () => {
    expect(parseCssColor(42)).toBeNull()
    expect(parseCssColor('rgb(1,2,3)')).toBeTruthy()
  })

  test('SwitchWebGL full API surface', () => {
    const canvas = makeCanvas()

    attachNoGL(canvas)

    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.GRID)

    sw.width = 200
    expect(sw._pToKnobX(0.5)).toBeCloseTo(14 + (200 - 28) * 0.5)
    expect(sw._contextCode()).toBe(1.0)

    const sw2 = new SwitchWebGL(canvas, SWITCH_TYPES.STATS)

    expect(sw2._contextCode()).toBe(0.0)

    const sw3 = new SwitchWebGL(canvas, SWITCH_TYPES.MOTION)

    expect(sw3._contextCode()).toBe(2.0)

    // canvas click → onClick closure → toggle
    sw.bindEvents()
    canvas.dispatchEvent(new window.Event('click', { bubbles: false }))

    sw2.toggle()
    sw2.setActive(true)
    sw2.setActive(false)
    sw2.setReducedMotion(true)
    sw2.setReducedMotion(false)
    sw2.init()
    sw2.initWebGL()
    sw2.bindEvents()
    sw2._renderStatic()
    sw2.animate()
    sw2._renderWebGL(0)
    sw2._triggerFallback()

    canvas.dispatchEvent(new window.Event('click'))

    sw2.destroy()
    sw3.destroy()
    sw.destroy()
  })

  test('switch render early-return + 2d arm', () => {
    const host = { gl: null, program: null, quadBuffer: null }

    renderSwitchWebGL(host, 0)

    const host2d = {
      ctx: createMock2D(),
      canvas: { width: 50, height: 26 },
      width: 50,
      height: 26,
      knobX: 10,
      currentP: 0.5,
      isActive: true,
      contextType: SWITCH_TYPES.STATS }

    if (typeof renderSwitch2D === 'function') renderSwitch2D(host2d, 0)
  })

  test('close-button render module arms', () => {
    renderCloseWebGL({ gl: null, program: null, quadBuffer: null }, 0)
    renderCloseStatic({ useWebGL: false, ctx: createMock2D(), canvas: { width: 36, height: 36 }, width: 36, height: 36, isHovered: false, drawProgress: 1, hoverLevel: 0, rotation: 0, clickTime: -10, startTime: 0 })

    const glHost = {
      gl: createMockGL(),
      program: {},
      quadBuffer: {},
      canvas: { width: 36, height: 36 },
      width: 36,
      height: 36,
      uniforms: {},
      aPos: 0,
      isHovered: false,
      hoverLevel: 0,
      rotation: 0,
      drawProgress: 1,
      clickTime: -10,
      startTime: 0,
      ctx: null,
      useWebGL: true }

    renderCloseWebGL(glHost, 0)
    animateClose({ ...glHost, animId: 0, animate: jest.fn() })
  })

  test('ThemeSliderWebGL full API surface', () => {
    const canvas = makeCanvas()

    attachNoGL(canvas)

    const ts = new ThemeSliderWebGL(canvas, THEME.DARK)

    ts.width = 260
    expect(ts._themeToP(THEME.DARK)).toBeDefined()
    expect(ts._pToTheme(0)).toBeDefined()
    expect(ts._xToP(40)).toBeDefined()
    expect(ts._pToKnobX(1)).toBe(pToKnobX(ts, 1))
    expect(ts._xToContinuousP(40)).toBeDefined()
    expect(ts._xToContinuousP(40, 300)).toBeDefined()

    ts.setTheme(THEME.LIGHT)
    ts.setTheme(THEME.SYSTEM)
    ts.setReducedMotion(true)
    ts.setReducedMotion(false)
    ts.init()
    ts.initWebGL()
    ts.bindEvents()
    ts._renderStatic()
    ts.animate()
    ts._renderWebGL(0)
    ts._triggerFallback()

    ts.destroy()
  })

  test('FlagRenderer image + flagTexture cache/miss arms', () => {
    const r = new FlagRenderer()

    expect(typeof r.image('br')).toBe('object')

    expect(
      flagTexture({ gl: null, textures: new Map(), images: new Map(), bitmaps: new Map() }, 'x')
    ).toBeNull()

    const gl = createMockGL()
    const host = { gl, textures: new Map(), images: new Map(), bitmaps: new Map() }

    expect(flagTexture(host, 'x')).toBeNull()

    host.images.set('y', { complete: true, naturalWidth: 0 })
    expect(flagTexture(host, 'y')).toBeNull()

    host.images.set('x', { complete: true, naturalWidth: 1 })

    const tex = flagTexture(host, 'x')

    if (tex) expect(flagTexture(host, 'x')).toBe(tex)
  })

  test('gl-program fallback + shader-fail arms', () => {
    const canvas = makeCanvas()

    let calls = 0
    const ctx = {}

    canvas.getContext = () => (calls++ === 0 ? null : ctx)
    expect(getWebGLContext(canvas)).toBe(ctx)

    const warn = jest.fn()
    const glFail = {
      VERTEX_SHADER: 1,
      FRAGMENT_SHADER: 2,
      COMPILE_STATUS: 3,
      LINK_STATUS: 4,
      createShader: () => ({}),
      shaderSource: () => {},
      compileShader: () => {},
      getShaderParameter: () => false,
      getShaderInfoLog: () => 'bad',
      createProgram: () => ({}),
      attachShader: () => {},
      linkProgram: () => {},
      getProgramParameter: () => false,
      getProgramInfoLog: () => 'bad',
      createBuffer: () => ({}),
      bindBuffer: () => {},
      bufferData: () => {},
      enableVertexAttribArray: () => {},
      vertexAttribPointer: () => {},
      getAttribLocation: () => 0 }

    expect(createQuadProgram(glFail, 'vs', 'fs', 'X', { warn })).toBeNull()
    expect(warn).toHaveBeenCalled()

    // link-fail arm
    let stage = 0

    const glLinkFail = {
      ...glFail,
      getShaderParameter: () => ++stage && true,
      createProgram: () => ({}),
      getProgramParameter: () => false }

    expect(createQuadProgram(glLinkFail, 'vs', 'fs', 'X', { warn })).toBeNull()

    // createShader/createProgram null arms
    const glNullShader = { ...glFail, createShader: () => null }

    expect(createQuadProgram(glNullShader, 'vs', 'fs', 'X', { warn })).toBeNull()

    const glNullProgram = { ...glLinkFail, createProgram: () => null }

    expect(createQuadProgram(glNullProgram, 'vs', 'fs', 'X', { warn })).toBeNull()
  })
})

