/**
 * @file earth/bootstrap.ts
 * @description Async scene assembly for the Earth engine, extracted from
 * earth-background.ts. Loads three.js lazily (the playground chunk only
 * ships when the route mounts), probes for a WebGPU adapter, builds
 * renderer/scene/camera/controls, loads textures with progress callbacks,
 * assembles the TSL post pipeline, warms shaders, then starts the loop.
 * Stages live in renderer-setup.ts, scene-setup.ts and post-setup.ts.
 *
 * Every `await` is followed by a disposed check — destroy() during a
 * slow texture load must not continue mutating a torn-down scene.
 */
import { DEFAULT_SP_GUI } from '@/core/tokens/playground.js'
import { WINDOW_EVENTS } from '@/core/tokens/events/dom.js'
import { initEarthRenderer } from './renderer-setup.js'
import {
  setupEarthGroup,
  setupMoon,
  setupSceneCamera,
  setupStarfield,
  setupSun,
} from './scene-setup.js'
import { buildEarthPostPipeline, seedPostState } from './post-setup.js'
import { handleEarthResize, tickEarth } from '../runtime/frame.js'
import type { EarthState } from '../runtime/state.js'

/**
 * Pre-compiles the scene's shader programs so the first visible frame doesn't
 * hitch on JIT. compileAsync failures (driver hiccups, lost device) are
 * non-fatal — the renderer recompiles lazily on first draw.
 */
export async function warmUpShaders(
  renderer: NonNullable<EarthState['renderer']>,
  s: EarthState
): Promise<void> {
  const { scene, camera } = s

  try {
    if (scene && camera) await renderer.compileAsync(scene, camera)
  } catch (err) {
    console.warn('[EarthBG] Shader compile warmup notice:', err)
  }
}

/**
 * bootstraps earth.
 * @param s — the source value
 * @returns Promise<void>
 */
export const bootstrapEarth = async (s: EarthState): Promise<void> => {
  const THREE = await import('three')
  const { WebGPURenderer, MeshPhysicalNodeMaterial, MeshBasicNodeMaterial } =
    await import('three/webgpu')
  const TSL = await import('three/tsl')
  const { bloom } = await import('three/examples/jsm/tsl/display/BloomNode.js')
  const { chromaticAberration } =
    await import('three/examples/jsm/tsl/display/ChromaticAberrationNode.js')
  const { film } = await import('three/examples/jsm/tsl/display/FilmNode.js')
  const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
  const { RenderPipeline } = await import('three/webgpu')

  if (s.disposed) return

  /* Renderer */
  if (!(await initEarthRenderer(s, WebGPURenderer)) || !s.renderer) return

  const renderer = s.renderer

  // ACES filmic keeps the sun disc + city lights from clipping to flat
  // white; exposure 1 leaves headroom for bloom to do the brightening.
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.shadowMap.enabled = false

  /* Scene / Camera / Controls */
  setupSceneCamera(s, THREE, OrbitControls)

  s.onProgress?.('Initializing WebGPU renderer…', 5)

  /* Sun */
  setupSun(s, THREE, TSL)

  /* Starfield */
  if (!(await setupStarfield(s, THREE))) return

  /* Moon */
  if (!(await setupMoon(s, THREE))) return

  /* Earth */
  if (
    !(await setupEarthGroup(s, {
      THREE,
      TSL,
      mats: { MeshPhysicalNodeMaterial, MeshBasicNodeMaterial },
    }))
  )
    return

  /* Post: color grade, CA, vignette, film grain */
  seedPostState(s, TSL)

  /* Render pipeline */
  s.onProgress?.('Building post-processing pipeline…', 70)

  buildEarthPostPipeline(s, { TSL, RenderPipeline, bloom, chromaticAberration, film })

  s.render.resolutionScale = DEFAULT_SP_GUI.DEBUG.RESOLUTION_SCALE

  /* Resize + start */
  handleEarthResize(s)

  s.onResize = () => handleEarthResize(s)

  window.addEventListener(WINDOW_EVENTS.RESIZE, s.onResize)

  s.onProgress?.('Compiling shaders…', 90)

  await warmUpShaders(renderer, s)

  if (s.disposed) return

  if (!s.reduced) tickEarth(s)

  s.onProgress?.('Ready', 100)

  s.onReady?.()
}
