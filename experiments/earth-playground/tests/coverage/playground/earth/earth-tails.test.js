/**
 * @file earth-tails.test.js — coverage tails for the earth playground engine.
 * No jest.resetModules(): re-imports after a reset lose istanbul counters.
 */

import { jest } from '@jest/globals'
import { clearDevLog, getDevLog } from '@core/devlog.js'
import { LOG_LEVELS } from '@core/tokens/data/log.js'
import { DEBUG_PARAMS, WEBGL_MODES } from '@core/tokens/strings/debug.js'
import { createEarthState } from '@earth/earth/runtime/state.js'
import { syncEarthSun, tickEarth } from '@earth/earth/runtime/frame.js'
import { initEarthRenderer } from '@earth/earth/setup/renderer-setup.js'
import { warmUpShaders } from '@earth/earth/setup/bootstrap.js'
import { updateEarthRender } from '@earth/earth/runtime/updates.js'

const setSearch = (s) => window.history.replaceState(null, '', s)

describe('earth tails', () => {
  test('syncEarthSun — state without sun uniforms → early return', () => {
    expect(() => syncEarthSun(createEarthState())).not.toThrow()
  })

  test('tickEarth — earthSpin without cloudsMesh skips cloud drift arm', () => {
    const s = createEarthState()
    const raf = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0)

    s.earth = { rotation: { y: 0, z: 0 } }
    s.earthSpin = { rotationSpeed: 0.1, trueInclination: false }

    expect(() => tickEarth(s)).not.toThrow()
    expect(s.earth.rotation.y).toBe(0.1)

    raf.mockRestore()
  })

  test('initEarthRenderer — debug webGLMode:fallback → false arm', async () => {
    setSearch(`/?${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.WEBGL_MODE}:${WEBGL_MODES.FALLBACK}`)

    const ok = await initEarthRenderer(createEarthState(), class {})

    expect(ok).toBe(false)

    setSearch('/')
  })

  test('warmUpShaders — compile, skip, and swallow arms', async () => {
    const compile = jest.fn(async () => {})

    await warmUpShaders({ compileAsync: compile }, { scene: {}, camera: {} })
    expect(compile).toHaveBeenCalled()

    await warmUpShaders({ compileAsync: compile }, { scene: null, camera: null })

    clearDevLog()

    await warmUpShaders(
      { compileAsync: async () => Promise.reject(new Error('x')) },
      { scene: {}, camera: {} }
    )
    expect(getDevLog().filter((e) => e.level === LOG_LEVELS.WARN).length).toBeGreaterThan(0)
  })

  test('updateEarthRender — no options → default-arg + skip arms', () => {
    expect(() => updateEarthRender(createEarthState())).not.toThrow()
  })
})
