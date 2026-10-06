/**
 * @file earth/scene-setup.ts
 * @description Scene assembly for the Earth engine: scene/camera/
 * OrbitControls rig, the directional sun + visible sprite, the
 * equirect starfield background, and the moon LOD — every stage checks
 * `s.disposed` after awaits so destroy() during a slow texture load
 * can't mutate a torn-down scene.
 */
import type * as THREE_NS from 'three'
import { DEFAULT_SP_GUI } from '@/core/tokens/playground.js'
import { EARTH_TEXTURES as TEXTURES } from '@/core/tokens/playground/textures.js'
import { EARTH_RADIUS, EARTH_AXIAL_TILT } from '../consts.js'
import { buildEarthShells, buildMoonLod } from '../scene/meshes.js'
import { syncEarthSun } from '../runtime/frame.js'
import type { EarthState } from '../runtime/state.js'

type ThreeNs = typeof THREE_NS
type TslNs = typeof import('three/tsl')
type WebGpuModule = typeof import('three/webgpu')

interface SceneDeps {
  THREE: ThreeNs
  TSL: TslNs
  mats: {
    MeshPhysicalNodeMaterial: WebGpuModule['MeshPhysicalNodeMaterial']
    MeshBasicNodeMaterial: WebGpuModule['MeshBasicNodeMaterial']
  }
}

/** Scene + perspective camera + orbit controls. */
export function setupSceneCamera(
  s: EarthState,
  THREE: ThreeNs,
  OrbitControls: typeof import('three/examples/jsm/controls/OrbitControls.js').OrbitControls
): void {
  s.scene = new THREE.Scene()

  // Near/far 0.1–1000 brackets the sun sprite at 200u with ~4 decades of
  // depth precision — a tighter near plane would clip close-zoom views.
  s.camera = new THREE.PerspectiveCamera(DEFAULT_SP_GUI.CAMERA.FOV, 1, 0.1, 1000)

  s.camera.position.set(
    DEFAULT_SP_GUI.CAMERA.POSITION.x,
    DEFAULT_SP_GUI.CAMERA.POSITION.y,
    DEFAULT_SP_GUI.CAMERA.POSITION.z
  )

  s.controls = new OrbitControls(s.camera, s.canvas)
  s.controls.enableDamping = true
  s.controls.enablePan = true
  s.controls.enableZoom = true
  s.controls.mouseButtons.RIGHT = THREE.MOUSE.PAN

  // Zoom clamp: 1.2× radius keeps the camera outside the atmosphere shell
  // (10.4); 10× radius pulls out far enough to frame the moon orbit.
  s.controls.minDistance = EARTH_RADIUS * 1.2
  s.controls.maxDistance = EARTH_RADIUS * 10
  s.controls.autoRotate = DEFAULT_SP_GUI.CAMERA.AUTO_ROTATE
  s.controls.autoRotateSpeed = DEFAULT_SP_GUI.CAMERA.AUTO_ROTATE_SPEED
  s.controls.target.set(
    DEFAULT_SP_GUI.CAMERA.TARGET.x,
    DEFAULT_SP_GUI.CAMERA.TARGET.y,
    DEFAULT_SP_GUI.CAMERA.TARGET.z
  )
  s.controls.update()
  s.controls.saveState()

  s.loader = new THREE.TextureLoader()
}

/**
 * Directional sun at 200u (far enough that its direction is effectively
 * parallel across the 20u Earth) + the visible 6u sprite co-located with
 * the light — color ×2 pushes it over the bloom threshold so it halos.
 */
export function setupSun(s: EarthState, THREE: ThreeNs, TSL: TslNs): void {
  const sunDist = 200
  const sa = 0
  const si = DEFAULT_SP_GUI.SUN.INCLINATION

  s.sun = {
    autoRotate: DEFAULT_SP_GUI.SUN.AUTO_ROTATE,
    speed: DEFAULT_SP_GUI.SUN.SPEED,
    inclination: DEFAULT_SP_GUI.SUN.INCLINATION,
    intensity: DEFAULT_SP_GUI.SUN.INTENSITY,
    color: DEFAULT_SP_GUI.SUN.COLOR,
    angle: sa,
  }
  s.sunLight = new THREE.DirectionalLight(s.sun.color, s.sun.intensity)
  s.sunLight.position.set(Math.cos(sa) * sunDist, Math.sin(si) * sunDist, Math.sin(sa) * sunDist)
  s.scene?.add(s.sunLight)

  const sunGeom = new THREE.SphereGeometry(6, 32, 32)
  const sunMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(s.sun.color).multiplyScalar(2),
  })

  s.sunMesh = new THREE.Mesh(sunGeom, sunMat)
  s.sunMesh.position.copy(s.sunLight.position)
  s.scene?.add(s.sunMesh)

  s.sunDirU = TSL.uniform(s.sunLight.position.clone().normalize())
  s.moonPosU = TSL.uniform(new THREE.Vector3())

  syncEarthSun(s)
}

/** Equirect starfield background texture + rotation/intensity config. */
export async function setupStarfield(s: EarthState, THREE: ThreeNs): Promise<boolean> {
  const { loader, scene } = s

  if (!loader || !scene) return false

  s.onProgress?.('Loading starfield…', 15)

  const starsTex = await loader.loadAsync(TEXTURES.STARS)

  if (s.disposed) return false

  starsTex.mapping = THREE.EquirectangularReflectionMapping
  starsTex.colorSpace = THREE.SRGBColorSpace
  scene.background = starsTex
  scene.backgroundRotation.order = 'YXZ'
  scene.backgroundIntensity = DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_INTENSITY
  scene.backgroundRotation.y = DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_AZIMUTH
  scene.backgroundRotation.x = DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_PITCH
  scene.backgroundRotation.z = DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_ROLL

  return true
}

/**
 * Moon LOD, starting at angle π so it begins on the far side (-z) and
 * doesn't eclipse the sun in the first seconds after load.
 */
export async function setupMoon(s: EarthState, THREE: ThreeNs): Promise<boolean> {
  s.onProgress?.('Building Moon…', 30)

  s.moonCfg = {
    enabled: DEFAULT_SP_GUI.MOON.ENABLED,
    speed: DEFAULT_SP_GUI.MOON.SPEED,
    distance: DEFAULT_SP_GUI.MOON.DISTANCE,
    inclination: DEFAULT_SP_GUI.MOON.INCLINATION,
    angle: Math.PI,
  }
  s.moon = await buildMoonLod({ THREE, loader: s.loader })

  if (s.disposed) return false

  const moon = s.moon

  s.scene?.add(moon)

  moon.position.set(0, 0, -100)

  return true
}

/**
 * The 4-shell Earth group (see earth/meshes.ts). Anisotropy is maxed at
 * the renderer's supported level (clamped fallback 4) — equirect maps
 * sampled at grazing angles near the limb blur badly without it.
 */
export async function setupEarthGroup(s: EarthState, deps: SceneDeps): Promise<boolean> {
  s.onProgress?.('Loading Earth textures…', 50)

  const maxAniso = s.renderer?.getMaxAnisotropy?.() ?? 4

  const builtEarth = await buildEarthShells({
    THREE: deps.THREE,
    TSL: deps.TSL,
    mats: deps.mats,
    maxAniso,
    loader: s.loader,
    sunDir: s.sunDirU,
    moonPos: s.moonPosU,
  })

  s.earth = builtEarth.group
  s.cloudsMesh = builtEarth.cloudsMesh
  s.earthMatUniforms = builtEarth.earthMatUniforms

  if (s.disposed || !s.earth) return false

  s.scene?.add(s.earth)

  s.earthSpin = {
    rotationSpeed: DEFAULT_SP_GUI.EARTH.ROTATION_SPEED,
    trueInclination: DEFAULT_SP_GUI.EARTH.TRUE_INCLINATION,
  }
  s.earth.rotation.z = EARTH_AXIAL_TILT * Number(s.earthSpin.trueInclination)

  return true
}
