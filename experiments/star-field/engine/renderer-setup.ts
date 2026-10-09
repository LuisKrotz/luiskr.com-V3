/**
 * @file engine/renderer-setup.ts
 * @description Renderer creation for the star-field engine — same contract
 * as the earth playground: `webglAllowed()` gates the whole GPU path
 * (reduced-motion and ?debug=webGLMode:fallback users get the CSS surface
 * instead), a WebGPU adapter probe picks the backend, and a failed init
 * swaps the poisoned canvas for a clone before retrying forced-WebGL.
 */
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { webglAllowed } from '@core/utils/canvas/webgl-mode.js'
import { canUseWebGPU } from '@core/browser/detect.js'
import { devWarn } from '@core/devlog.js'
import type { SFState } from './types.js'

type WebGpuModule = typeof import('three/webgpu')

/**
 * Builds + initializes the renderer on `s`. Returns false when the GPU
 * path is disallowed so bootstrap can bail into the CSS fallback; a WebGPU
 * init throw clones the canvas (a canvas that failed context creation is
 * poisoned) and retries with `forceWebGL`.
 * @param s Engine state bag.
 * @param WebGPURenderer The three/webgpu renderer class.
 * @returns Whether a live renderer was attached.
 */
export async function initStarRenderer(
  s: SFState,
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

  const initable = (force: boolean) => {
    const r = new WebGPURenderer({
      canvas: s.canvas ?? undefined,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      forceWebGL: force,
    })

    return r as unknown as NonNullable<SFState['renderer']> & { init(): Promise<void> }
  }

  try {
    const r = initable(useWebGL)

    s.renderer = r

    await r.init()
  } catch (e) {
    devWarn('[StarField] WebGPU init failed, falling back to WebGL:', e)

    const oldCanvas = s.canvas

    const parent = oldCanvas?.parentNode

    if (parent) {
      const newCanvas = oldCanvas.cloneNode(true) as HTMLCanvasElement

      parent.replaceChild(newCanvas, oldCanvas)

      s.canvas = newCanvas
    }

    const r = initable(true)

    s.renderer = r

    await r.init()
  }

  return !s.disposed
}
