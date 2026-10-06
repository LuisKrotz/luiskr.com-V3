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

import '@/cms/about/CmsAboutEditor.js'
import '@/cms/portfolio/CmsPortfolioList.js'
import '@/cms/projects/CmsProjectsList.js'
import '@/cms/playground-editor/CmsPlaygroundEditor.js'
import '@/cms/footer/CmsFooterEditor.js'
import '@/cms/deploy-info/CmsDeployInfo.js'

import '@/playground/earth/setup/bootstrap.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'


globalThis.alert = jest.fn()

// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('earth setup module tails', () => {
  test('bootstrapEarth disposed + missing-callback arms', async () => {
    const { bootstrapEarth: boot } = await import('@/playground/earth/setup/bootstrap.js')
    const { createEarthState: mkState } = await import('@/playground/earth/runtime/state.js')
    const sD = mkState(document.createElement(HTML_TAGS.CANVAS), undefined, undefined)

    sD.disposed = true

    await boot(sD)
    expect(sD.renderer).toBeNull()

    // no onReady/onProgress — every ?. short-circuit arm through the pipeline
    const sB = mkState(document.createElement(HTML_TAGS.CANVAS), undefined, undefined)

    await boot(sB)
    expect(sB.scene).toBeTruthy()
    expect(sB.renderer).toBeTruthy()

    sB.disposed = true
  }, 15000)

  test('initEarthRenderer navigator.gpu + WebGL-retry arms', async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    const { initEarthRenderer: initR } = await import('@/playground/earth/setup/renderer-setup.js')
    const { createEarthState: mkState } = await import('@/playground/earth/runtime/state.js')

    Object.defineProperty(navigator, 'gpu', { value: { requestAdapter: async () => ({}) }, configurable: true })

    const s1 = mkState(null, undefined, undefined)

    await initR(s1, WebGPURenderer)
    expect(s1.renderer).toBeTruthy()

    // adapter null → stays on the WebGL backend
    navigator.gpu.requestAdapter = async () => null

    const s2 = mkState(null, undefined, undefined)

    await initR(s2, WebGPURenderer)

    // requestAdapter rejection → catch arm
    navigator.gpu.requestAdapter = async () => Promise.reject(new Error('denied'))

    const s3 = mkState(null, undefined, undefined)

    await initR(s3, WebGPURenderer)

    delete navigator.gpu

    // init() fails once per call-site → WebGL retry; each renderer class gets
    // its own fail-once flag so the retry instance succeeds
    const makeFlaky = () => {
      let failed = false

      return class {
        constructor() {
          this.shadowMap = {}
        }

        async init() {
          if (!failed) {
            failed = true
            throw new Error('init-fail')
          }
        }

        setSize() {}
        setPixelRatio() {}
        dispose() {}
        render() {}
        async compileAsync() {}
      }
    }

    const parented = document.createElement(HTML_TAGS.CANVAS)

    document.body.appendChild(parented)

    const s4 = mkState(parented, undefined, undefined)

    expect(await initR(s4, makeFlaky())).toBe(true)
    expect(s4.canvas).not.toBe(parented)

    // canvas without a parent → if(parent) false arm
    const s5 = mkState(document.createElement(HTML_TAGS.CANVAS), undefined, undefined)

    await initR(s5, makeFlaky())

    // no canvas at all → oldCanvas?. null arm
    const s6 = mkState(null, undefined, undefined)

    await initR(s6, makeFlaky())
  })

  test('setupSun / setupStarfield / setupMoon / setupEarthGroup guard arms', async () => {
    const { setupSun: setupSunFn, setupStarfield: starfieldFn, setupMoon: moonFn, setupEarthGroup: earthGroupFn } = await import('@/playground/earth/setup/scene-setup.js')
    const { createEarthState: mkState } = await import('@/playground/earth/runtime/state.js')
    const THREE = await import('three')
    const TSL = await import('three/tsl')
    const { MeshPhysicalNodeMaterial, MeshBasicNodeMaterial } = await import('three/webgpu')
    const mats = { MeshPhysicalNodeMaterial, MeshBasicNodeMaterial }

    // null scene → s.scene?.add short-circuit arms
    const s = mkState(null, undefined, undefined)

    setupSunFn(s, THREE, TSL)
    expect(s.sunDirU).toBeTruthy()

    // starfield: !loader → !scene → disposed → happy path
    expect(await starfieldFn({ loader: null, scene: null }, THREE)).toBe(false)

    const s2 = mkState(null, undefined, undefined)

    s2.loader = new THREE.TextureLoader()
    expect(await starfieldFn(s2, THREE)).toBe(false)

    s2.scene = new THREE.Scene()
    s2.disposed = true
    expect(await starfieldFn(s2, THREE)).toBe(false)

    const s3 = mkState(null, undefined, undefined)

    s3.loader = new THREE.TextureLoader()
    s3.scene = new THREE.Scene()
    expect(await starfieldFn(s3, THREE)).toBe(true)

    // moon: disposed + happy path
    const s4 = mkState(null, undefined, undefined)

    s4.disposed = true
    s4.loader = new THREE.TextureLoader()
    s4.scene = new THREE.Scene()
    expect(await moonFn(s4, THREE)).toBe(false)

    const s5 = mkState(null, undefined, undefined)

    s5.loader = new THREE.TextureLoader()
    s5.scene = new THREE.Scene()
    expect(await moonFn(s5, THREE)).toBe(true)

    // earth group: renderer null → maxAniso ?? 4 arm + disposed guard
    const s6 = mkState(null, undefined, undefined)

    s6.loader = new THREE.TextureLoader()
    s6.scene = new THREE.Scene()
    s6.disposed = true
    await earthGroupFn(s6, { THREE, TSL, mats })

    const s7 = mkState(null, undefined, undefined)

    s7.loader = new THREE.TextureLoader()
    s7.scene = new THREE.Scene()
    await earthGroupFn(s7, { THREE, TSL, mats })
    expect(s7.earth).toBeTruthy()
  })

  test('buildEarthShells early-return + happy path', async () => {
    const { buildEarthShells: shellsFn } = await import('@/playground/earth/scene/meshes.js')
    const THREE = await import('three')
    const TSL = await import('three/tsl')
    const { MeshPhysicalNodeMaterial, MeshBasicNodeMaterial } = await import('three/webgpu')
    const mats = { MeshPhysicalNodeMaterial, MeshBasicNodeMaterial }
    const base = { THREE, TSL, mats, maxAniso: 4 }

    const r1 = await shellsFn({ ...base, loader: null, sunDir: {}, moonPos: {} })

    expect(r1.cloudsMesh).toBeNull()
    expect(r1.earthMatUniforms).toBeNull()

    const r2 = await shellsFn({ ...base, loader: new THREE.TextureLoader(), sunDir: null, moonPos: null })

    expect(r2.cloudsMesh).toBeNull()

    const r3 = await shellsFn({ ...base, loader: new THREE.TextureLoader(), sunDir: {}, moonPos: {} })

    expect(r3.group).toBeTruthy()
    expect(r3.cloudsMesh).toBeTruthy()
  })

  test('seedPostState + buildEarthPostPipeline guard/happy/catch arms', async () => {
    const { seedPostState: seedFn, buildEarthPostPipeline: pipelineFn } = await import('@/playground/earth/setup/post-setup.js')
    const { createEarthState: mkState } = await import('@/playground/earth/runtime/state.js')
    const TSL = await import('three/tsl')
    const { RenderPipeline, __setPipelineCtorFails } = await import('three/webgpu')
    const { bloom } = await import('three/examples/jsm/tsl/display/BloomNode.js')
    const { chromaticAberration } = await import('three/examples/jsm/tsl/display/ChromaticAberrationNode.js')
    const { film } = await import('three/examples/jsm/tsl/display/FilmNode.js')
    const deps = { TSL, RenderPipeline, bloom, chromaticAberration, film }

    const s = mkState(null, undefined, undefined)

    pipelineFn(s, deps)
    expect(s.pipeline).toBeNull()

    // seeds the cg/ca/vig/film state + uniform maps
    seedFn(s, TSL)
    expect(s.cgUniforms).toBeTruthy()
    expect(s.caUniforms).toBeTruthy()
    expect(s.vigUniforms).toBeTruthy()
    expect(s.filmU).toBeTruthy()

    // still missing renderer/scene/camera → first guard again
    pipelineFn(s, deps)

    // uniforms missing → second guard
    const s2 = { renderer: {}, scene: {}, camera: {}, ca: {}, vig: {}, film: {}, cg: {} }

    pipelineFn(s2, deps)

    // happy path through the mocked node graph
    s.renderer = {}
    s.scene = {}
    s.camera = {}

    pipelineFn(s, deps)
    expect(s.pipeline).toBeTruthy()

    // RenderPipeline ctor failure → catch arm leaves pipeline null
    __setPipelineCtorFails(true)

    pipelineFn(s, deps)
    __setPipelineCtorFails(false)
    expect(s.pipeline).toBeNull()
  })
})

