/**
 * @file engine/scene.ts
 * @description Scene-graph foundation for the star-field engine: the
 * equirect milky-way skybox sphere (BackSide so the camera sits inside
 * it), the ambient + sun point-light rig that lights the textured
 * planets, and the shared radial-gradient glow texture every nebula
 * sprite, galaxy disc and star halo reuses (one canvas → one texture).
 */
import type * as THREE_NS from 'three'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'
import { SF_CAMERA, SF_COLORS, SF_SCENE } from '@core/tokens/starfield/params.js'
import type { SFState } from './types.js'

type ThreeModule = typeof import('three')

/**
 * Creates the shared soft radial-gradient texture used by every glow
 * billboard (nebulae, galaxy cores, star halos). A 128px canvas with a
 * white-center → transparent-edge gradient; the material's `color`
 * channel tints it per body so one texture serves all hues. Returns
 * undefined when the 2d context is unavailable (headless probes) —
 * callers fall back to untextured materials.
 * @param THREE The three.js module.
 * @returns A CanvasTexture or undefined.
 */
export function makeGlowTexture(THREE: ThreeModule): THREE_NS.Texture | undefined {
  const canvas = document.createElement(HTML_TAGS.CANVAS)

  canvas.width = 128
  canvas.height = 128

  const ctx = canvas.getContext(WEBGL_STRINGS.CONTEXT_2D)

  if (!ctx) return undefined

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)

  grad.addColorStop(0, SF_COLORS.GLOW_INNER)
  grad.addColorStop(0.35, SF_COLORS.GLOW_MID)
  grad.addColorStop(1, SF_COLORS.GLOW_OUTER)

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)

  return new THREE.CanvasTexture(canvas)
}

/**
 * Builds the camera + orbit-controls rig at the home/overview pose.
 * Damping is enabled so drag/momentum reads smooth; the controls target
 * doubles as the fly-to destination vector.
 * @param s Engine state.
 * @param THREE The three.js module.
 * @param OrbitControls The controls class.
 */
export function setupStarCamera(
  s: SFState,
  THREE: ThreeModule,
  OrbitControls: typeof import('three/examples/jsm/controls/OrbitControls.js').OrbitControls
): void {
  const camera = new THREE.PerspectiveCamera(
    SF_CAMERA.FOV,
    (s.canvas?.clientWidth || 1) / (s.canvas?.clientHeight || 1),
    SF_CAMERA.NEAR,
    SF_CAMERA.FAR
  )

  camera.position.set(SF_CAMERA.HOME_X, SF_CAMERA.HOME_Y, SF_CAMERA.HOME_Z)

  s.camera = camera

  if (s.canvas) {
    s.controls = new OrbitControls(camera, s.canvas)
    s.controls.enableDamping = true
    s.controls.target.set(SF_CAMERA.TARGET_X, SF_CAMERA.TARGET_Y, SF_CAMERA.TARGET_Z)
  }
}

/**
 * Wraps the scene in the milky-way skybox — a big inverted sphere whose
 * inside surface carries the 8k equirect star panorama — plus the light
 * rig: a dim ambient floor so night sides aren't pure black, and a point
 * light at the origin standing in for the Sun.
 * @param s Engine state.
 * @param THREE The three.js module.
 * @param skyTex The loaded skybox texture (undefined → geometry skipped).
 */
export function setupStarScene(
  s: SFState,
  THREE: ThreeModule,
  skyTex: THREE_NS.Texture | undefined
): void {
  const scene = new THREE.Scene()

  s.scene = scene

  if (skyTex) {
    const skyGeo = new THREE.SphereGeometry(SF_SCENE.SKYBOX_RADIUS, 32, 16)
    const skyMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide })

    const sky = new THREE.Mesh(skyGeo, skyMat)

    scene.add(sky)
  }

  scene.add(new THREE.AmbientLight(SF_COLORS.AMBIENT, 1.6))

  const sunLight = new THREE.PointLight(SF_COLORS.SUN_LIGHT, 2.2, 0, 0)

  sunLight.position.set(0, 0, 0)

  scene.add(sunLight)
}
