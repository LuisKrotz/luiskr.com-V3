/**
 * @file mock-webgl.js
 * @description Shared WebGL test fixture — a Proxy-based WebGL context
 * stub that auto-stubs every gl.* call so canvas widgets can run their
 * full init/render/destroy lifecycle inside happy-dom without a GPU.
 * OBJECT_FACTORIES returns truthy handles where code paths check them.
 */

import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'

// Methods that must return truthy handles/objects rather than undefined.
const OBJECT_FACTORIES = new Set([
  'createShader',
  'createProgram',
  'createBuffer',
  'createTexture',
  'createFramebuffer',
  'createRenderbuffer',
  'createVertexArray',
  'getUniformLocation',
  'getAttribLocation',
  'createSampler',
])

/**
 * Creates a fully stubbed WebGL context.
 * Unknown methods return a no-op function; known factory/query
 * methods return realistic handles so widget code paths don't bail early.
 */
export const createMockGL = () =>
  new Proxy(
    {},
    {
      get(_target, prop) {
        // GL enum constants — numeric identity so bitmasks work.
        if (typeof prop === TYPE_STRINGS.STRING && prop === prop.toUpperCase()) {
          return 1
        }

        return (...args) => {
          if (prop === 'getExtension') {
            return { loseContext: () => {}, restoreContext: () => {} }
          }
          if (prop === 'getSupportedExtensions') return []
          if (prop === 'getParameter') return 'mock'
          if (prop === 'getShaderPrecisionFormat') return { precision: 23 }
          if (prop === 'checkFramebufferStatus') return 36053 // FRAMEBUFFER_COMPLETE
          if (prop === 'getContextAttributes') return { alpha: true }
          if (prop === 'getError') return 0
          if (prop === 'isContextLost') return false
          if (prop === 'getShaderParameter' || prop === 'getProgramParameter') return true
          if (prop === 'getShaderInfoLog' || prop === 'getProgramInfoLog') return ''
          if (prop === 'getActiveUniform' || prop === 'getActiveAttrib') {
            return { name: 'u_mock', size: 1, type: 5126 }
          }

          if (OBJECT_FACTORIES.has(prop)) return { id: args.length }

          return undefined
        }
      },
      set() {
        return true
      },
    }
  )

/**
 * Creates a stubbed Canvas2D context — every method is a no-op and every
 * property assignment is swallowed (gradients, fonts, etc).
 */
export const createMock2D = () => {
  const gradient = { addColorStop: () => {} }

  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === HTML_TAGS.CANVAS) return null

        return () => {
          if (
            prop === 'createLinearGradient' ||
            prop === 'createRadialGradient' ||
            prop === 'createPattern'
          ) {
            return gradient
          }
          if (prop === 'measureText') return { width: 0 }
          if (prop === 'getImageData') return { data: new Uint8ClampedArray(4) }

          return undefined
        }
      },
      set() {
        return true
      },
    }
  )
}

/**
 * Stubs `canvas.getContext` so webgl/webgl2/experimental-webgl return the
 * shared mock while other context types return null.
 */
export const attachMockGL = (canvas, gl = createMockGL()) => {
  canvas.getContext = (type) => (/webgl/i.test(String(type)) ? gl : null)

  return gl
}

/**
 * Stubs `canvas.getContext` to return a mock 2D context for '2d' and the
 * mock GL for webgl types.
 */
export const attachMock2D = (canvas, ctx = createMock2D()) => {
  canvas.getContext = (type) => (String(type) === WEBGL_STRINGS.CONTEXT_2D ? ctx : null)

  return ctx
}

/**
 * Stubs `canvas.getContext` to always return null — exercises the
 * WebGL-unavailable fallback branches.
 */
/**
 * Stubs `canvas.getContext` to return a mock 2D context for '2d' and a mock
 * GL context for webgl types — for widgets that probe both paths.
 */
export const attachHybridGL = (canvas, gl = createMockGL(), ctx = createMock2D()) => {
  canvas.getContext = (type) =>
    String(type) === WEBGL_STRINGS.CONTEXT_2D ? ctx : /webgl/i.test(String(type)) ? gl : null

  return gl
}

/**
 * Stubs `canvas.getContext` to always return null — exercises the
 * WebGL-unavailable fallback branches.
 */
export const attachNoGL = (canvas) => {
  canvas.getContext = () => null

  return canvas
}
