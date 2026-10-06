/**
 * @file three-webgpu.js (mock)
 * @description Auto-mock for `three/webgpu` — WebGPURenderer with a resolved
 * init/compileAsync and a render counter; RenderPipeline + node materials as
 * chainable proxies.
 */
import { __chain as chain } from './three.js'

// Test hooks — let suites delay renderer.init() (to interleave a mid-boot
// destroy) or fail the RenderPipeline ctor (to exercise the plain
// renderer.render fallback paths). Flags reset inside each test.
let __rendererInitDelayMs = 0
let __pipelineCtorFails = false

export const __setRendererInitDelay = (ms) => {
  __rendererInitDelayMs = ms
}
export const __setPipelineCtorFails = (v) => {
  __pipelineCtorFails = v
}

export class WebGPURenderer {
  constructor(opts) {
    this.opts = opts
    this.shadowMap = {}
    this.backend = { device: { queue: { onSubmittedWorkDone: async () => {} } } }
    this.renderCalls = 0
  }

  async init() {
    if (__rendererInitDelayMs) {
      await new Promise((r) => setTimeout(r, __rendererInitDelayMs))
    }
  }
  async compileAsync() {}
  render() {
    this.renderCalls += 1
  }
  dispose() {}
  setSize() {}
  setPixelRatio() {}
  getMaxAnisotropy() {
    return 4
  }
}

export class RenderPipeline {
  constructor() {
    if (__pipelineCtorFails) throw new Error('pipeline-disabled')

    this.outputNode = null
    this.renderCalls = 0
  }

  render() {
    this.renderCalls += 1
  }
}

export const MeshPhysicalNodeMaterial = chain()
export const MeshBasicNodeMaterial = chain()
export const MeshStandardNodeMaterial = chain()
