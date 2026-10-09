/**
 * @file engine/bootstrap.ts
 * @description Async scene assembly for the star-field engine. Loads
 * three lazily (the chunk only ships when the route mounts), probes
 * WebGPU→WebGL renderer, textures every mapped body in parallel with
 * progress, builds skybox/lights/bodies/picking, warms shaders, then
 * starts the tick loop. Every `await` is followed by a disposed check —
 * destroy() during a slow texture load must not keep mutating a torn-down
 * scene.
 */
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { SF_TEXTURES } from '@core/tokens/starfield/textures.js'
import { initStarRenderer } from './renderer-setup.js'
import { makeGlowTexture, setupStarCamera, setupStarScene } from './scene.js'
import { buildStarBodies } from './bodies-scene.js'
import { armPicking, bindPicking } from './picking.js'
import { armFrame, handleStarResize, tickStar } from './frame.js'
import type * as THREE_NS from 'three'
import { SF_CATALOG } from './catalog.js'
import type { SFState } from './types.js'
import { devWarn } from '@core/devlog.js'

type ThreeModule = typeof import('three')

/**
 * Collects every texture URL the catalog + skybox needs and loads them in
 * parallel — progress reports per completed file so the loader bar climbs
 * smoothly across the ~14 fetches. A single failed texture resolves as
 * undefined (the body falls back to its procedural color) rather than
 * sinking the whole boot.
 * @returns URL → texture map (missing textures absent).
 */
async function loadStarTextures(
  THREE: ThreeModule,
  s: SFState
): Promise<Map<string, THREE_NS.Texture>> {
  const urls = new Set<string>([SF_TEXTURES.SKYBOX])

  for (const def of SF_CATALOG) {
    if (def.texture) urls.add(def.texture)
    if (def.shellTexture) urls.add(def.shellTexture)
  }

  const loader = new THREE.TextureLoader()

  const map = new Map<string, THREE_NS.Texture>()

  const list = [...urls]

  let done = 0

  await Promise.all(
    list.map(async (url) => {
      try {
        const tex = await loader.loadAsync(url)

        map.set(url, tex)
      } catch (e) {
        devWarn('[StarField] texture failed:', url, e)
      }

      done += 1

      s.onProgress?.('Loading star charts…', 10 + (done / list.length) * 70)
    })
  )

  return map
}

/**
 * Pre-compiles shader programs so the first visible frame doesn't hitch
 * on JIT — failures are non-fatal (the renderer recompiles lazily).
 */
async function warmUpShaders(
  renderer: NonNullable<SFState['renderer']>,
  s: SFState
): Promise<void> {
  const { scene, camera } = s

  const r = renderer as { compileAsync?: (sc: unknown, cam: unknown) => Promise<void> }

  try {
    if (scene && camera && r.compileAsync) await r.compileAsync(scene, camera)
  } catch (err) {
    devWarn('[StarField] Shader compile warmup notice:', err)
  }
}

/**
 * Bootstraps the star-field engine — full sequence: three import →
 * renderer probe → scene/camera/controls → texture parallel load →
 * body graph → picking → resize → shader warmup → first frame → ready.
 * Silent bailouts (webglAllowed, probe failure, dispose mid-boot) leave
 * `s.failed`/partial state for init() to flag.
 * @param s Engine state.
 */
export async function bootstrapStarField(s: SFState): Promise<void> {
  const THREE = await import('three')
  const { WebGPURenderer } = await import('three/webgpu')
  const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')

  if (s.disposed) return

  armPicking(THREE.Raycaster)
  armFrame(THREE.Vector3 as never)

  /* Renderer */
  s.onProgress?.('Initializing renderer…', 5)

  if (!(await initStarRenderer(s, WebGPURenderer)) || !s.renderer) return

  /* Scene / camera / controls — setupStarCamera is synchronous, so the
     disposed flag can't flip mid-call (renderer probe already returns
     !s.disposed upstream). */
  setupStarCamera(s, THREE, OrbitControls)

  /* Textures — the long pole; progress 10→80 */
  const texMap = await loadStarTextures(THREE, s)

  if (s.disposed) return

  setupStarScene(s, THREE, texMap.get(SF_TEXTURES.SKYBOX))

  /* Bodies */
  s.onProgress?.('Charting the skies…', 84)

  const glowTex = makeGlowTexture(THREE)

  buildStarBodies(s, THREE, SF_CATALOG, texMap, glowTex)

  /* Picking */
  bindPicking(s)

  /* Resize + warmup */
  handleStarResize(s)

  s.onResize = () => handleStarResize(s)

  window.addEventListener(WINDOW_EVENTS.RESIZE, s.onResize)

  s.onProgress?.('Compiling shaders…', 92)

  await warmUpShaders(s.renderer, s)

  if (s.disposed) return

  if (!s.reduced) tickStar(s)

  s.onProgress?.('Ready', 100)
}
