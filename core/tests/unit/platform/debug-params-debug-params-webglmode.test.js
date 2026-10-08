/**
 * @file debug-params-debug-params-webglmode.test.js
 * @description Split from debug-params.test.js — covers the "debug params — webGLMode" describe.
 */
import { jest } from '@jest/globals'
import { DEBUG_PARAMS, WEBGL_MODES } from '@core/tokens/strings/debug.js'
import { attachMockGL } from '@tests/fixtures/mock-webgl.js'
import { webglAllowed, webglContext, webglMode } from '@core/utils/canvas/webgl-mode.js'
import { getWebGLContext } from '@core/utils/canvas/gl-program.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'

const setSearch = (s) => window.history.replaceState(null, '', s)

const restore = () => {
  setSearch('/')
  document.documentElement.classList.remove(STATE_CLASSES.REDUCED_MOTION)
}

describe('debug params — webGLMode', () => {
  afterEach(restore)

  test('no flag → active; webglAllowed true', () => {
    setSearch('/')
    expect(webglMode()).toBe(WEBGL_MODES.ACTIVE)
    expect(webglAllowed()).toBe(true)
  })

  test('reduced motion prefers fallback until the preference is disabled', () => {
    document.documentElement.classList.add(STATE_CLASSES.REDUCED_MOTION)
    expect(webglAllowed()).toBe(false)

    document.documentElement.classList.remove(STATE_CLASSES.REDUCED_MOTION)
    expect(webglAllowed()).toBe(true)
  })

  test('webGLMode:fallback → every context probe returns null', () => {
    setSearch(`/?${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.WEBGL_MODE}:${WEBGL_MODES.FALLBACK}`)
    expect(webglMode()).toBe(WEBGL_MODES.FALLBACK)
    expect(webglAllowed()).toBe(false)

    const canvas = document.createElement(HTML_TAGS.CANVAS)

    attachMockGL(canvas)

    // fallback mode never touches the canvas — a poisoned canvas stays clean
    const probe = jest.spyOn(canvas, 'getContext')

    expect(webglContext(canvas, {})).toBeNull()
    expect(getWebGLContext(canvas)).toBeNull()
    expect(probe).not.toHaveBeenCalled()
  })

  test('webGLMode:active → normal probing resumes', () => {
    setSearch(`/?${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.WEBGL_MODE}:${WEBGL_MODES.ACTIVE}`)

    const canvas = document.createElement(HTML_TAGS.CANVAS)

    attachMockGL(canvas)
    expect(webglContext(canvas)).toBeTruthy()
    expect(getWebGLContext(canvas)).toBeTruthy()
  })

  test('webGL2 opt-in + experimental fallback both respect the flag', () => {
    const canvas = document.createElement(HTML_TAGS.CANVAS)

    attachMockGL(canvas)
    setSearch('/')
    expect(webglContext(canvas, {}, true)).toBeTruthy()

    setSearch(`/?${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.WEBGL_MODE}:${WEBGL_MODES.FALLBACK}`)
    expect(webglContext(canvas, {}, true)).toBeNull()
  })

  test('last webGLMode wins when several debug flags are present', () => {
    setSearch(
      `/?${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.WEBGL_MODE}:${WEBGL_MODES.FALLBACK}&${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.WEBGL_MODE}:${WEBGL_MODES.ACTIVE}`
    )
    expect(webglMode()).toBe(WEBGL_MODES.ACTIVE)

    setSearch(
      `/?${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.WEBGL_MODE}:${WEBGL_MODES.ACTIVE}&${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.WEBGL_MODE}:${WEBGL_MODES.FALLBACK}`
    )
    expect(webglMode()).toBe(WEBGL_MODES.FALLBACK)
  })

  test('malformed values are ignored', () => {
    setSearch(
      `/?${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.WEBGL_MODE}&${DEBUG_PARAMS.KEY}=bogus&${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.WEBGL_MODE}:bogus`
    )
    expect(webglMode()).toBe(WEBGL_MODES.ACTIVE)
  })
})
