/**
 * @file gl-lifecycle-tails-watchcontextloss-releasequadgl.test.js
 * @description Split from gl-lifecycle-tails.test.js — covers the "watchContextLoss / releaseQuadGL" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { watchContextLoss, releaseQuadGL } from '@core/utils/canvas/gl-lifecycle.js'
import { createMockGL, createMock2D } from '@tests/fixtures/mock-webgl.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { GL_EVENTS } from '@core/tokens/events/dom.js'

const _flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

let mockGL
let mock2D
let origGetContext

beforeEach(() => {
  mockGL = createMockGL()
  mock2D = createMock2D()

  const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

  origGetContext = proto.getContext

  proto.getContext = function patchedGetContext(type) {
    if (String(type) === WEBGL_STRINGS.CONTEXT_2D) return mock2D
    if (/webgl/i.test(String(type))) return mockGL

    return null
  }
})

afterEach(() => {
  const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

  proto.getContext = origGetContext

  document.body.innerHTML = ''
})

const makeCanvas = (cls = null, parent = document.body) => {
  const canvas = document.createElement(HTML_TAGS.CANVAS)

  if (cls) canvas.className = cls

  parent.appendChild(canvas)

  return canvas
}

// A WebGL stub whose shader/program status checks always fail — drives
// every widget down the `!built` path in its init (and now its release).
const _makeFailingGL = () =>
  new Proxy(
    {},
    {
      get(_t, prop) {
        if (typeof prop === TYPE_STRINGS.STRING && prop === prop.toUpperCase()) return 1

        return (...args) => {
          if (prop === 'getExtension') return { loseContext: () => {} }
          if (prop === 'getShaderParameter' || prop === 'getProgramParameter') return false
          if (prop === 'getShaderInfoLog' || prop === 'getProgramInfoLog') return 'fail'
          if (prop === 'getParameter') return 'mock'

          return ['createShader', 'createProgram', 'createBuffer', 'getUniformLocation'].includes(
            prop
          )
            ? { id: args.length }
            : undefined
        }
      },
      set: () => true,
    }
  )

// ─── watchContextLoss / releaseQuadGL ────────────────────────────────────────
describe('watchContextLoss / releaseQuadGL', () => {
  test('dispatched context loss runs onLost without preventDefault', () => {
    const canvas = makeCanvas()
    let lost = 0

    watchContextLoss(canvas, () => {
      lost += 1
    })

    const event = new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST, { cancelable: true })
    let prevented = false

    event.preventDefault = () => {
      prevented = true
    }

    canvas.dispatchEvent(event)

    expect(lost).toBe(1)
    expect(prevented).toBe(false)
  })

  test('releaseQuadGL deletes resources, force-loses the context and detaches the watcher', () => {
    const canvas = makeCanvas()
    let lost = 0
    const onLost = watchContextLoss(canvas, () => {
      lost += 1
    })
    const host = { gl: mockGL, program: { p: 1 }, quadBuffer: { b: 1 } }

    releaseQuadGL(canvas, host, onLost)

    expect(host.gl).toBeNull()
    expect(host.program).toBeNull()
    expect(host.quadBuffer).toBeNull()

    canvas.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST))

    expect(lost).toBe(0)
  })

  test('releaseQuadGL short-circuits on a missing context', () => {
    const host = { gl: null, program: { p: 1 }, quadBuffer: { b: 1 } }

    releaseQuadGL(makeCanvas(), host, null)

    expect(host.gl).toBeNull()
  })

  test('releaseQuadGL tolerates missing listener, canvas and resources', () => {
    const host = { gl: mockGL, program: null, quadBuffer: null }

    releaseQuadGL(makeCanvas(), host, null)

    expect(host.gl).toBeNull()

    const host2 = { gl: mockGL, program: null, quadBuffer: null }

    releaseQuadGL(null, host2, () => {})

    expect(host2.gl).toBeNull()
  })

  test('releaseQuadGL survives a context without WEBGL_lose_context', () => {
    const bare = { deleteBuffer: () => {}, deleteProgram: () => {} }
    const host = { gl: bare, program: { p: 1 }, quadBuffer: { b: 1 } }

    releaseQuadGL(makeCanvas(), host, null)

    expect(host.gl).toBeNull()

    const noExt = {
      deleteBuffer: () => {},
      deleteProgram: () => {},
      getExtension: () => null,
    }
    const host2 = { gl: noExt, program: null, quadBuffer: null }

    releaseQuadGL(makeCanvas(), host2, null)

    expect(host2.gl).toBeNull()
  })
})
