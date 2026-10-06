/**
 * @file earth/renderer-setup.ts
 * @description Renderer creation for the Earth engine: probes for a
 * WebGPU adapter (navigator.gpu alone isn't enough — requestAdapter()
 * can still return null on software/headless GPUs), constructs the
 * WebGPURenderer covering both APIs, and on failure clones the poisoned
 * canvas and retries with the WebGL backend forced.
 */
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import type { EarthState } from '../runtime/state.js'
import { webglAllowed } from '@/utils/canvas/webgl-mode.js'
import { canUseWebGPU } from '@/core/browser/detect.js'

type WebGpuModule = typeof import('three/webgpu')

/**
 * Builds + initializes the renderer on `s`. Probes WebGPU first; a failed
 * init swaps in a fresh canvas clone (a canvas that failed context
 * creation is poisoned) and retries with forceWebGL.
 */
export async function initEarthRenderer(
  s: EarthState,
  WebGPURenderer: WebGpuModule['WebGPURenderer']
): Promise<boolean> {
  if (!webglAllowed()) return false

  let useWebGL = true

  if (typeof navigator !== TYPE_STRINGS.UNDEFINED && navigator.gpu && canUseWebGPU()) {
    try {
      const adapter = await navigator.gpu.requestAdapter()

      if (adapter) useWebGL = false
    } catch {
      useWebGL = true
    }
  }

  try {
    s.renderer = new WebGPURenderer({
      canvas: s.canvas ?? undefined,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      forceWebGL: useWebGL,
    })

    await s.renderer.init()
  } catch (e) {
    console.warn('[EarthBG] WebGPU init failed, falling back to WebGL:', e)

    const oldCanvas = s.canvas

    const parent = oldCanvas?.parentNode

    if (parent) {
      const newCanvas = oldCanvas.cloneNode(true) as HTMLCanvasElement

      parent.replaceChild(newCanvas, oldCanvas)

      s.canvas = newCanvas
    }

    s.renderer = new WebGPURenderer({
      canvas: s.canvas ?? undefined,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      forceWebGL: true,
    })

    await s.renderer.init()
  }

  return !s.disposed
}
