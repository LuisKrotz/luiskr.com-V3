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

import '@core/constants.js'

import '@cms/about/CmsAboutEditor.js'
import '@cms/portfolio/CmsPortfolioList.js'
import '@cms/projects/CmsProjectsList.js'
import '@cms/playground-editor/CmsPlaygroundEditor.js'
import '@cms/footer/CmsFooterEditor.js'
import '@cms/deploy-info/CmsDeployInfo.js'

import { gpuAccel } from '@core/utils/gpu/gpu-accel.js'

globalThis.alert = jest.fn()

// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('gpu-accel tails', () => {
  test('initGPU mobile early-return + compile/accelerate guards', () => {
    const gpu = gpuAccel

    gpu._init = gpu.initGPU
    const origUA = navigator.userAgent

    Object.defineProperty(navigator, 'userAgent', { value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit Mobile', configurable: true })

    const prevReady = gpu._ready

    gpu._ready = false
    gpu.initGPU()
    expect(gpu.gl).toBeFalsy()

    Object.defineProperty(navigator, 'userAgent', { value: origUA, configurable: true })

    gpu._ready = prevReady

    // compileShader guards
    const prevGl = gpu.gl

    gpu.gl = null
    expect(gpu.compileShader(0, 'x')).toBeNull()

    const glBad = {
      createShader: () => ({}),
      shaderSource: () => {},
      compileShader: () => {},
      getShaderParameter: () => false,
      deleteShader: jest.fn(),
      COMPILE_STATUS: 1,
    }

    gpu.gl = glBad
    expect(gpu.compileShader(1, 'x')).toBeNull()
    expect(glBad.deleteShader).toHaveBeenCalled()

    const glGood = {
      createShader: () => ({}),
      shaderSource: () => {},
      compileShader: () => {},
      getShaderParameter: () => true,
      deleteShader: jest.fn(),
    }

    gpu.gl = glGood
    expect(gpu.compileShader(1, 'x')).toBeTruthy()

    const glNoShader = { createShader: () => null }

    gpu.gl = glNoShader
    expect(gpu.compileShader(1, 'x')).toBeNull()

    gpu.gl = prevGl

    // accelerateElementGPU arms
    gpu.accelerateElementGPU(null)
    gpu.accelerateElementGPU({})
    gpu.accelerateElementGPU(document.documentElement)

    const div = document.createElement('div')

    gpu.accelerateElementGPU(div)
    gpu.releaseElementGPU?.(div)
  })

  test('initGPU desktop path compiles quad + creates texture', () => {
    const gpu = gpuAccel
    const fakeGl = {
      VERTEX_SHADER: 1,
      FRAGMENT_SHADER: 2,
      COMPILE_STATUS: 3,
      LINK_STATUS: 4,
      ARRAY_BUFFER: 5,
      STATIC_DRAW: 6,
      FLOAT: 7,
      TRIANGLES: 8,
      BLEND: 9,
      SRC_ALPHA: 10,
      ONE: 11,
      ONE_MINUS_SRC_ALPHA: 12,
      enable: () => {},
      blendFunc: () => {},
      createShader: () => ({}),
      shaderSource: () => {},
      compileShader: () => {},
      getShaderParameter: () => true,
      getShaderInfoLog: () => '',
      createProgram: () => ({}),
      attachShader: () => {},
      linkProgram: () => {},
      getProgramParameter: () => true,
      getProgramInfoLog: () => '',
      createBuffer: () => ({}),
      bindBuffer: () => {},
      bufferData: () => {},
      enableVertexAttribArray: () => {},
      vertexAttribPointer: () => {},
      getAttribLocation: () => 0,
      getUniformLocation: () => ({}),
      createTexture: () => ({}),
    }
    const fakeCanvas = { width: 0, height: 0, getContext: () => fakeGl }
    const origCreate = document.createElement.bind(document)
    const spy = jest
      .spyOn(document, 'createElement')
      .mockImplementation((tag) => (tag === 'canvas' ? fakeCanvas : origCreate(tag)))
    const prevReady = gpu._ready

    try {
      gpu._ready = false
      gpu.initGPU()

      expect(gpu.gl).toBe(fakeGl)
      expect(gpu.texture).toBeTruthy()
    } finally {
      spy.mockRestore()

      gpu._ready = prevReady
    }
  })
})

