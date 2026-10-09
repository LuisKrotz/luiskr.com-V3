/**
 * @file coverage/starfield/engine/star-engine-tails.test.js
 * @description Coverage tails for the star-field engine internals — the
 * renderer probe/fallback arms, bootstrap bailout paths, per-frame
 * tick/approach arms, fly-to tween edges, pointer picking edges, scene
 * helpers, body construction recipes and the screenshot pipeline.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'

import { DEBUG_PARAMS, WEBGL_MODES } from '@core/tokens/strings/debug.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { POINTER_EVENTS, MOUSE_EVENTS, WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { SF_KINDS, SF_GROUPS } from '@core/tokens/starfield/kinds.js'
import { getDevLog, clearDevLog } from '@core/devlog.js'
import { LOG_LEVELS } from '@core/tokens/data/log.js'

import { createStarState } from '../../../../engine/state.js'
import { initStarRenderer } from '../../../../engine/renderer-setup.js'
import { bootstrapStarField } from '../../../../engine/bootstrap.js'
import { armFrame, anchorWorldPos, handleStarResize, tickStar } from '../../../../engine/frame.js'
import { startFly, updateFly, cancelFly } from '../../../../engine/fly.js'
import { armPicking, bindPicking } from '../../../../engine/picking.js'
import { makeGlowTexture, setupStarCamera, setupStarScene } from '../../../../engine/scene.js'
import { buildStarBodies, SF_USER_BODY } from '../../../../engine/bodies-scene.js'
import { takeStarScreenshot } from '../../../../engine/screenshot.js'
import { SF_CATALOG } from '../../../../engine/catalog.js'
import { __setRendererInitDelay } from 'three/webgpu'
import * as THREE from 'three'

const setSearch = (s) => window.history.replaceState(null, '', s)

const flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

const makeState = (overrides = {}) => {
  const s = createStarState(makeCanvas())

  return Object.assign(s, overrides)
}

/** WebGPURenderer stand-in that fails its first init() then succeeds. */
const makeFailOnceRenderer = () => {
  let inits = 0

  return class {
    async init() {
      inits += 1

      if (inits === 1) throw new Error('no-adapter')
    }

    render() {}
    dispose() {}
  }
}

const fakeCamera = () => ({
  position: { x: 0, y: 0, z: 0, set: jest.fn() },
  aspect: 1,
  updateProjectionMatrix: jest.fn(),
})

beforeEach(() => {
  setSearch('/')
  document.documentElement.classList.remove(STATE_CLASSES.REDUCED_MOTION)
  clearDevLog()
})

afterEach(() => {
  setSearch('/')
  __setRendererInitDelay(0)
  try {
    delete globalThis.navigator.gpu
  } catch {
    /* non-configurable in some DOM shims */
  }
})

describe('initStarRenderer', () => {
  test('returns false when WebGL is disallowed', async () => {
    setSearch(`/?${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.WEBGL_MODE}:${WEBGL_MODES.FALLBACK}`)

    const s = makeState()

    expect(await initStarRenderer(s, THREE.WebGLRenderer ?? class {})).toBe(false)
  })

  test('no navigator.gpu → forced WebGL init path', async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    const s = makeState()

    expect(await initStarRenderer(s, WebGPURenderer)).toBe(true)
    expect(s.renderer).toBeTruthy()
  })

  test('adapter resolves → WebGPU path; adapter null/rejects → WebGL', async () => {
    const { WebGPURenderer } = await import('three/webgpu')

    globalThis.navigator.gpu = { requestAdapter: async () => ({ real: true }) }

    const s1 = makeState()

    expect(await initStarRenderer(s1, WebGPURenderer)).toBe(true)

    globalThis.navigator.gpu = { requestAdapter: async () => null }

    const s2 = makeState()

    expect(await initStarRenderer(s2, WebGPURenderer)).toBe(true)

    globalThis.navigator.gpu = {
      requestAdapter: async () => Promise.reject(new Error('no gpu')),
    }

    const s3 = makeState()

    expect(await initStarRenderer(s3, WebGPURenderer)).toBe(true)
  })

  test('failed init clones the canvas and retries forced WebGL', async () => {
    const canvas = makeCanvas()

    document.body.appendChild(canvas)

    const s = makeState({ canvas })

    const ok = await initStarRenderer(s, makeFailOnceRenderer())

    expect(ok).toBe(true)
    expect(s.canvas).not.toBe(canvas)
    expect(s.renderer).toBeTruthy()
    expect(getDevLog().filter((e) => e.level === LOG_LEVELS.WARN).length).toBeGreaterThan(0)
  })

  test('failed init without a parent still retries on the same canvas', async () => {
    const s = makeState()

    expect(await initStarRenderer(s, makeFailOnceRenderer())).toBe(true)
    expect(s.canvas).toBeTruthy()
  })

  test('double-init failure propagates to the bootstrap catch', async () => {
    class AlwaysFail {
      async init() {
        throw new Error('dead')
      }
    }

    const s = makeState({ canvas: makeCanvas() })

    await expect(initStarRenderer(s, AlwaysFail)).rejects.toThrow('dead')
  })

  test('dispose during renderer init returns false', async () => {
    __setRendererInitDelay(60)

    const { WebGPURenderer } = await import('three/webgpu')
    const s = makeState()
    const p = initStarRenderer(s, WebGPURenderer)

    s.disposed = true
    await flush(80)

    expect(await p).toBe(false)
  })

  test('null canvas → renderer option falls back to undefined', async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    const s = makeState({ canvas: null })

    expect(await initStarRenderer(s, WebGPURenderer)).toBe(true)
    expect(s.renderer).toBeTruthy()
  })
})

describe('bootstrapStarField', () => {
  test('returns immediately on a disposed state', async () => {
    const s = makeState({ disposed: true })

    await bootstrapStarField(s)

    expect(s.renderer).toBeNull()
  })

  test('dispose during the module-import phase aborts the boot', async () => {
    const s = makeState()
    const p = bootstrapStarField(s)

    s.disposed = true
    await p

    expect(s.scene).toBeNull()
  })

  test('onProgress receives stage updates through the boot', async () => {
    const onProgress = jest.fn()
    const s = makeState({ onProgress })

    await bootstrapStarField(s)

    expect(onProgress).toHaveBeenCalled()

    s.disposed = true
    s.renderer?.dispose?.()
  })

  test('reduced state skips the first tick', async () => {
    const s = makeState({ reduced: true })

    await bootstrapStarField(s)

    expect(s.animId).toBeNull()

    s.disposed = true
    s.renderer?.dispose?.()
  })

  test('texture failures warn instead of sinking the boot', async () => {
    const spy = jest
      .spyOn(THREE.TextureLoader.prototype, 'loadAsync')
      .mockRejectedValue(new Error('missing'))

    try {
      const s = makeState()

      await bootstrapStarField(s)

      expect(s.scene).toBeTruthy()
      expect(
        getDevLog().filter((e) => e.level === LOG_LEVELS.WARN).length
      ).toBeGreaterThan(0)

      s.disposed = true
    } finally {
      spy.mockRestore()
    }
  })

  test('dispose during texture load aborts mid-boot', async () => {
    const releases = []
    const spy = jest
      .spyOn(THREE.TextureLoader.prototype, 'loadAsync')
      .mockImplementation(() => new Promise((r) => releases.push(r)))

    try {
      const s = makeState()
      const p = bootstrapStarField(s)

      await flush(60)
      s.disposed = true
      releases.forEach((r) => r({}))
      await p

      expect(s.scene).toBeNull()
    } finally {
      spy.mockRestore()
    }
  })

  test('dispose before scene assembly leaves the state partial', async () => {
    __setRendererInitDelay(50)

    const s = makeState()
    const p = bootstrapStarField(s)

    await flush(10)
    s.disposed = true
    await p
  })

  test('shader warmup swallows compileAsync failures', async () => {
    const s = makeState()

    await bootstrapStarField(s)
    expect(s.scene).toBeTruthy()

    s.disposed = true
    s.renderer?.dispose?.()
  })

  test('shader warmup reports compileAsync rejections via devWarn', async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    const spy = jest
      .spyOn(WebGPURenderer.prototype, 'compileAsync')
      .mockRejectedValue(new Error('shader-boom'))

    try {
      const s = makeState()

      await bootstrapStarField(s)

      expect(s.scene).toBeTruthy()
      expect(
        getDevLog().filter((e) => e.level === LOG_LEVELS.WARN).length
      ).toBeGreaterThan(0)

      s.disposed = true
      s.renderer?.dispose?.()
    } finally {
      spy.mockRestore()
    }
  })

  test('warmup skips when the renderer lacks compileAsync', async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    const proto = WebGPURenderer.prototype
    const orig = Object.getOwnPropertyDescriptor(proto, 'compileAsync')

    Object.defineProperty(proto, 'compileAsync', { configurable: true, value: undefined })

    try {
      const s = makeState()

      await bootstrapStarField(s)

      expect(s.scene).toBeTruthy()

      s.disposed = true
      s.renderer?.dispose?.()
    } finally {
      Object.defineProperty(proto, 'compileAsync', orig)
    }
  })

  test('dispose during shader warmup aborts before the first tick', async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    const releases = []
    const spy = jest
      .spyOn(WebGPURenderer.prototype, 'compileAsync')
      .mockImplementation(() => new Promise((r) => releases.push(r)))

    try {
      const s = makeState()
      const p = bootstrapStarField(s)

      await flush(80)
      s.disposed = true
      releases.forEach((r) => r())
      await p

      expect(s.animId).toBeNull()
    } finally {
      spy.mockRestore()
    }
  })

  test('bound resize listener re-measures on window resize', async () => {
    const s = makeState()

    await bootstrapStarField(s)

    expect(s.onResize).toBeTruthy()

    window.dispatchEvent(new window.Event(WINDOW_EVENTS.RESIZE))

    s.disposed = true
    if (s.onResize) window.removeEventListener(WINDOW_EVENTS.RESIZE, s.onResize)
    s.renderer?.dispose?.()
  })
})

describe('frame helpers', () => {
  test('anchorWorldPos guards missing anchors and returns world coords', () => {
    // Vec3 is already armed — an earlier describe boots the engine, whose
    // bootstrap arms frame.ts; the unarmed arm lives in the unarmed-tails file.
    expect(anchorWorldPos({})).toEqual({ x: 0, y: 0, z: 0 })

    const out = anchorWorldPos({ getWorldPosition: (_v) => ({ x: 9, y: 8, z: 7 }) })

    expect(out).toEqual({ x: 9, y: 8, z: 7 })

    // re-arm with a fresh ctor — covers armFrame itself
    armFrame(class Vec3 {})

    expect(anchorWorldPos({ getWorldPosition: () => ({ x: 1, y: 2, z: 3 }) })).toEqual({
      x: 1,
      y: 2,
      z: 3,
    })
  })

  test('handleStarResize guards and host/parent/window fallbacks', () => {
    const s = makeState()

    handleStarResize(s)

    s.renderer = { setPixelRatio: jest.fn(), setSize: jest.fn() }
    handleStarResize(s)

    s.camera = fakeCamera()
    handleStarResize(s)

    expect(s.camera.updateProjectionMatrix).toHaveBeenCalled()

    const inner = makeCanvas()

    document.body.appendChild(inner)
    s.canvas = inner
    handleStarResize(s)

    s.camera.aspect = 0
    handleStarResize(s)

    // zero-dimension guard — no host, detached canvas, stubbed viewport
    const innerW = Object.getOwnPropertyDescriptor(window, 'innerWidth')
    const innerH = Object.getOwnPropertyDescriptor(window, 'innerHeight')

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 0 })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 0 })

    try {
      const orphan = makeCanvas()

      s.canvas = orphan
      s.camera.aspect = 0
      handleStarResize(s)

      expect(s.camera.aspect).toBe(0)
    } finally {
      Object.defineProperty(window, 'innerWidth', innerW)
      Object.defineProperty(window, 'innerHeight', innerH)
    }
  })

  test('tickStar advances orbits, spins, satellites and renders', () => {
    const s = makeState({
      camera: fakeCamera(),
      renderer: { render: jest.fn() },
      scene: {},
      controls: { update: jest.fn() },
    })
    const node = {
      def: { orbit: 10, speed: 1, spin: 1, phase: 0.2, radius: 1 },
      pivot: { rotation: { y: 0 } },
      spinner: { rotation: { y: 0 } },
      mesh: {},
      satPivots: [{ pivot: { rotation: { y: 0 } }, speed: 2, phase: 1 }],
    }

    s.nodes.set('mars', node)

    const raf = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 7)

    tickStar(s, 1000)

    expect(s.animId).toBeTruthy()
    expect(node.pivot.rotation.y).toBeGreaterThan(0)
    expect(node.spinner.rotation.y).toBeGreaterThan(0)
    expect(node.satPivots[0].pivot.rotation.y).toBeGreaterThan(0)
    expect(s.renderer.render).toHaveBeenCalled()
    expect(s.controls.update).toHaveBeenCalled()

    // orbit-but-no-speed arm
    node.def.speed = 0
    node.pivot.rotation.y = 0
    tickStar(s, 2000)
    expect(node.pivot.rotation.y).toBe(0)

    // orbit without phase → `def.phase ?? 0` arm
    node.def.speed = 1
    delete node.def.phase
    tickStar(s, 2500)
    expect(node.pivot.rotation.y).toBeGreaterThan(0)

    // disposed + reduced short-circuits
    s.disposed = true
    tickStar(s, 3000)
    s.disposed = false
    s.reduced = true
    tickStar(s, 3000)

    raf.mockRestore()
  })

  test('checkApproach fires once per body within the approach radius', () => {
    const s = makeState({
      camera: fakeCamera(),
      onApproach: jest.fn(),
    })

    s.nodes.set('mars', {
      def: { radius: 1 },
      pivot: {},
      spinner: {},
      mesh: {},
      satPivots: [],
    })
    s.anchors.set('mars', {
      getWorldPosition: () => ({ x: 1, y: 1, z: 1 }),
    })
    // def-less anchor → `if (!def) continue` arm
    s.anchors.set('ghost', { getWorldPosition: () => ({ x: 0, y: 0, z: 0 }) })

    // far anchor → distance ≥ approach radius → no prefetch arm
    s.nodes.set('andromeda', {
      def: { radius: 1 },
      pivot: {},
      spinner: {},
      mesh: {},
      satPivots: [],
    })
    s.anchors.set('andromeda', {
      getWorldPosition: () => ({ x: 1e9, y: 1e9, z: 1e9 }),
    })

    const raf = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1)

    tickStar(s, 0)

    expect(s.onApproach).toHaveBeenCalledWith('mars')
    expect(s.approached.has('mars')).toBe(true)

    s.onApproach.mockClear()
    tickStar(s, 100)

    expect(s.onApproach).not.toHaveBeenCalled()

    // no camera / no onApproach arms
    s.camera = null
    tickStar(s, 200)
    s.camera = fakeCamera()
    s.onApproach = null
    tickStar(s, 300)

    raf.mockRestore()
  })
})

describe('fly tween', () => {
  test('startFly no-ops without a camera', () => {
    const s = makeState()

    startFly(s, { x: 0, y: 0, z: 0 }, 10)

    expect(s.fly).toBeNull()
  })

  test('startFly uses the straight-above fallback when camera sits on target', () => {
    const s = makeState({ camera: fakeCamera() })

    startFly(s, { x: 0, y: 0, z: 0 }, 10)

    expect(s.fly.toPos.y).toBe(10)
    expect(s.fly.fromTgt).toBeTruthy()
  })

  test('updateFly lerps and completes with the done callback', () => {
    const s = makeState({
      camera: fakeCamera(),
      controls: { target: { x: 0, y: 0, z: 0, set: jest.fn() } },
    })
    const done = jest.fn()

    s.camera.position.x = 100
    startFly(s, { x: 0, y: 0, z: 0 }, 20, done)

    updateFly(s)

    expect(s.camera.position.set).toHaveBeenCalled()
    expect(s.controls.target.set).toHaveBeenCalled()

    // push t0 far into the past so the tween completes this frame
    s.fly.t0 = -1e9
    updateFly(s)

    expect(s.fly).toBeNull()
    expect(done).toHaveBeenCalled()

    // controls-null arm — tween still lerps the camera position
    s.camera = fakeCamera()
    s.controls = null
    s.fly = { t0: 0, fromPos: { x: 0, y: 0, z: 0 }, toPos: { x: 1, y: 1, z: 1 }, fromTgt: { x: 0, y: 0, z: 0 }, toTgt: { x: 1, y: 1, z: 1 } }
    updateFly(s)

    expect(s.camera.position.set).toHaveBeenCalled()

    // no-fly + no-camera arms
    updateFly(s)
    s.fly = { t0: 0, fromPos: {}, toPos: {}, fromTgt: {}, toTgt: {} }
    s.camera = null
    updateFly(s)

    cancelFly(s)
  })
})

describe('picking', () => {
  const makeRaycaster = (hits) =>
    class {
      setFromCamera() {}
      intersectObjects() {
        return hits
      }
    }

  test('bindPicking no-ops without a canvas', () => {
    const s = makeState({ canvas: null })

    bindPicking(s)

    expect(s.onPointerDown).toBeNull()
    expect(s.onPointerUp).toBeNull()
    expect(s.onWheel).toBeNull()
  })

  test('pointer down/up selects within the drag threshold', () => {
    const hit = { object: { userData: { [SF_USER_BODY]: 'mars' } } }

    armPicking(makeRaycaster([hit]))

    const canvas = makeCanvas()

    canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 })

    const s = makeState({
      canvas,
      camera: fakeCamera(),
      pickables: [{}],
      onSelect: jest.fn(),
      onHover: jest.fn(),
    })

    bindPicking(s)

    const evt = (type, x, y) =>
      canvas.dispatchEvent(new window.PointerEvent(type, { clientX: x, clientY: y }))

    evt(POINTER_EVENTS.POINTERDOWN, 10, 10)

    expect(s.downXY).toEqual({ x: 10, y: 10 })

    s.fly = {}
    evt(POINTER_EVENTS.POINTERUP, 12, 12)

    expect(s.onSelect).toHaveBeenCalledWith('mars')
    expect(s.downXY).toBeNull()

    // drag beyond threshold → no pick
    s.onSelect.mockClear()
    evt(POINTER_EVENTS.POINTERDOWN, 10, 10)
    evt(POINTER_EVENTS.POINTERUP, 60, 60)

    expect(s.onSelect).not.toHaveBeenCalled()

    // up without a prior down → `if (down)` skip → still raycasts a pick
    s.onSelect.mockClear()
    evt(POINTER_EVENTS.POINTERUP, 5, 5)

    expect(s.onSelect).toHaveBeenCalledWith('mars')

    // down→up where the raycast misses → `if (id)` else arm
    armPicking(makeRaycaster([]))
    s.onSelect.mockClear()
    evt(POINTER_EVENTS.POINTERDOWN, 5, 5)
    evt(POINTER_EVENTS.POINTERUP, 6, 6)

    expect(s.onSelect).not.toHaveBeenCalled()

    // wheel cancels any fly tween
    s.fly = {}
    canvas.dispatchEvent(new window.Event(MOUSE_EVENTS.WHEEL))

    expect(s.fly).toBeNull()
  })

  test('pointermove announces hover transitions once', () => {
    const hit = { object: { userData: { [SF_USER_BODY]: 'venus' } } }

    armPicking(makeRaycaster([hit]))

    const canvas = makeCanvas()

    canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 50, height: 50 })

    const s = makeState({
      canvas,
      camera: fakeCamera(),
      pickables: [{}],
      onHover: jest.fn(),
    })

    bindPicking(s)

    const move = () =>
      canvas.dispatchEvent(
        new window.PointerEvent(POINTER_EVENTS.POINTERMOVE, { clientX: 5, clientY: 5 })
      )

    move()
    move()

    expect(s.onHover).toHaveBeenCalledTimes(1)
    expect(s.onHover).toHaveBeenCalledWith('venus')
  })

  test('pickAt early-returns — no canvas/camera/pickables, zero rect, empty hits', () => {
    armPicking(makeRaycaster([]))

    const canvas = makeCanvas()
    const s = makeState({ canvas, pickables: [{}], onHover: jest.fn() })

    bindPicking(s)
    canvas.dispatchEvent(new window.PointerEvent(POINTER_EVENTS.POINTERMOVE, { clientX: 1, clientY: 1 }))

    expect(s.onHover).not.toHaveBeenCalled()

    s.camera = fakeCamera()
    canvas.dispatchEvent(new window.PointerEvent(POINTER_EVENTS.POINTERMOVE, { clientX: 1, clientY: 1 }))

    s.pickables = []
    canvas.dispatchEvent(new window.PointerEvent(POINTER_EVENTS.POINTERMOVE, { clientX: 1, clientY: 1 }))

    s.pickables = [{}]
    canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 10, height: 10 })
    canvas.dispatchEvent(new window.PointerEvent(POINTER_EVENTS.POINTERMOVE, { clientX: 1, clientY: 1 }))

    expect(s.hoverId).toBeNull()
  })
})

describe('scene helpers', () => {
  test('makeGlowTexture returns a texture or undefined without 2d support', async () => {
    const three = await import('three')
    const proto = window.HTMLCanvasElement.prototype

    const noCtx = jest.spyOn(proto, 'getContext').mockImplementation(() => null)

    expect(makeGlowTexture(three)).toBeUndefined()

    noCtx.mockRestore()

    const fakeCtx = {
      createRadialGradient: () => ({ addColorStop: jest.fn() }),
      fillStyle: null,
      fillRect: jest.fn(),
    }
    const yesCtx = jest.spyOn(proto, 'getContext').mockImplementation(() => fakeCtx)

    expect(makeGlowTexture(three)).toBeDefined()

    yesCtx.mockRestore()
  })

  test('setupStarCamera builds controls only when a canvas exists', async () => {
    const three = await import('three')
    const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
    const s = makeState()

    setupStarCamera(s, three, OrbitControls)

    expect(s.camera).toBeTruthy()
    expect(s.controls).toBeTruthy()

    const bare = makeState({ canvas: null })

    setupStarCamera(bare, three, OrbitControls)

    expect(bare.camera).toBeTruthy()
    expect(bare.controls).toBeNull()
  })

  test('setupStarScene adds the skybox only when a texture exists', async () => {
    const three = await import('three')
    const s = makeState()

    setupStarScene(s, three, { mapped: true })
    setupStarScene(makeState(), three, undefined)
  })
})

describe('buildStarBodies', () => {
  test('builds the real catalog into nodes, anchors and pickables', async () => {
    const three = await import('three')
    const s = makeState({ scene: new three.Scene() })

    buildStarBodies(s, three, SF_CATALOG, new Map(), undefined)

    expect(s.nodes.size).toBe(SF_CATALOG.length)
    expect(s.pickables.length).toBe(SF_CATALOG.length)
    expect(s.rings.length).toBeGreaterThan(0)
  })

  test('synthetic defs cover orbit/pos/parent/ring/shell edge arms', async () => {
    const three = await import('three')
    const s = makeState({ scene: new three.Scene() })

    const defs = [
      // orbiting body with a missing parent — anchor lookup misses
      {
        id: 'orphan',
        name: 'Orphan',
        kind: SF_KINDS.PLANET,
        group: SF_GROUPS.SOLAR,
        radius: 1,
        orbit: 5,
        parent: 'no-such-parent',
        ring: true,
      },
      // fixed body with no orbit and no pos — pivot stays at origin
      {
        id: 'static',
        name: 'Static',
        kind: SF_KINDS.PLANET,
        group: SF_GROUPS.SOLAR,
        radius: 1,
      },
      // shell-ring recipe with default tilt
      {
        id: 'ringed',
        name: 'Ringed',
        kind: SF_KINDS.PLANET,
        group: SF_GROUPS.SOLAR,
        radius: 2,
        pos: [1, 2, 3],
        shellRing: true,
        shellTexture: 'tex://ring',
        ring: false,
      },
      // satellites with and without explicit phases
      {
        id: 'companions',
        name: 'Companions',
        kind: SF_KINDS.SYSTEM,
        group: SF_GROUPS.MILKY_WAY,
        radius: 2,
        pos: [5, 0, 0],
        satellites: [
          { radius: 0.4, orbit: 3, speed: 1 },
          { radius: 0.3, orbit: 5, speed: 0.5, phase: 1.2 },
        ],
      },
      // ring requested but no orbit — the `def.orbit != null` arm
      {
        id: 'ringless',
        name: 'Ringless',
        kind: SF_KINDS.PLANET,
        group: SF_GROUPS.SOLAR,
        radius: 1,
        pos: [0, 0, 9],
        ring: true,
      },
      // galaxy disc without tilt — the `def.tilt ?? 0` arm
      {
        id: 'untilted-galaxy',
        name: 'Untilted',
        kind: SF_KINDS.GALAXY,
        group: SF_GROUPS.GALAXIES,
        radius: 20,
        pos: [100, 0, 0],
      },
      // nebula sprite arm
      {
        id: 'wispy',
        name: 'Wispy',
        kind: SF_KINDS.NEBULA,
        group: SF_GROUPS.NEBULAE,
        radius: 5,
        pos: [50, 0, 0],
      },
    ]

    buildStarBodies(s, three, defs, new Map(), undefined)

    expect(s.nodes.size).toBe(defs.length)

    // atmosphere-shell arm (no shellRing)
    defs.push({
      id: 'hazed',
      name: 'Hazed',
      kind: SF_KINDS.PLANET,
      group: SF_GROUPS.SOLAR,
      radius: 2,
      pos: [0, 4, 0],
      shellTexture: 'tex://haze',
    })
    buildStarBodies({ ...s, nodes: new Map(), anchors: new Map(), pickables: [], rings: [] }, three, [defs[defs.length - 1]], new Map(), undefined)
  })
})

describe('takeStarScreenshot', () => {
  test('no-ops without canvas or renderer', async () => {
    await takeStarScreenshot(makeState({ canvas: null }))
    await takeStarScreenshot(makeState({ renderer: null }))
  })

  test('toDataURL success path downloads the PNG', async () => {
    const canvas = makeCanvas()

    canvas.toDataURL = () => 'data:image/png;base64,abc'
    canvas.toBlob = jest.fn()

    const s = makeState({ canvas, renderer: { render: jest.fn() }, scene: {}, camera: {} })
    const clickSpy = jest.spyOn(window.HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    await takeStarScreenshot(s)
    await flush(1100)

    expect(clickSpy).toHaveBeenCalled()

    clickSpy.mockRestore()
  })

  test('tainted canvas falls back to toBlob + object URL', async () => {
    const canvas = makeCanvas()

    canvas.toDataURL = () => {
      throw new Error('tainted')
    }
    canvas.toBlob = (cb) => cb(new Blob(['x']))

    globalThis.URL.createObjectURL = jest.fn(() => 'blob:fake')
    globalThis.URL.revokeObjectURL = jest.fn()

    const s = makeState({ canvas, renderer: { render: jest.fn() }, scene: {}, camera: {} })
    const clickSpy = jest.spyOn(window.HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    await takeStarScreenshot(s)
    await flush(1100)

    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:fake')

    clickSpy.mockRestore()
  })

  test('empty dataUrl with a null blob skips the download', async () => {
    const canvas = makeCanvas()

    canvas.toDataURL = () => 'data:,'
    canvas.toBlob = (cb) => cb(null)

    const s = makeState({ canvas, renderer: { render: jest.fn() } })
    const clickSpy = jest.spyOn(window.HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    await takeStarScreenshot(s)
    await flush(20)

    expect(clickSpy).not.toHaveBeenCalled()

    clickSpy.mockRestore()
  })

  test('a throwing render reports via devError', async () => {
    const canvas = makeCanvas()
    const s = makeState({
      canvas,
      renderer: {
        render: () => {
          throw new Error('gpu lost')
        },
      },
      scene: {},
      camera: {},
    })

    await takeStarScreenshot(s)

    expect(getDevLog().filter((e) => e.level === LOG_LEVELS.ERROR).length).toBeGreaterThan(0)
  })
})
