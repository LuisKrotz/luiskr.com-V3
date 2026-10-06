/**
 * @file earth/state.ts
 * @description Mutable engine state for EarthBackground, extracted from
 * the class's private-field block so behavior modules (bootstrap, frame
 * loop, updates, screenshot) can operate on a plain typed bag instead of
 * reaching into class internals. EarthBackground keeps this as its single
 * #s field and delegates every operation to the earth/* modules.
 */
import type * as THREE_NS from 'three'
import type { WebGPURenderer, RenderPipeline, UniformNode } from 'three/webgpu'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type BloomNode from 'three/examples/jsm/tsl/display/BloomNode.js'
import { DEFAULT_SP_GUI } from '@/core/tokens/playground.js'

/**
 * earths progress fn.
 * @param _label — the value
 * @param percent — the value
 */
export type EarthProgressFn = (_label: string, percent: number) => void

/**
 * Type contract for earth sun state.
 */
export interface EarthSunState {
  autoRotate: boolean
  speed: number
  inclination: number
  intensity: number
  color: number
  angle: number
}

/**
 * earths moon state.
 */
export interface EarthMoonState {
  enabled: boolean
  speed: number
  distance: number
  inclination: number
  angle: number
}

/**
 * earths spin state.
 */
export interface EarthSpinState {
  rotationSpeed: number
  trueInclination: boolean
}

/**
 * earths bloom state.
 */
export interface EarthBloomState {
  enabled: boolean
  strength: number
  radius: number
  threshold: number
}

/**
 * earths ca state.
 */
export interface EarthCaState {
  enabled: boolean
  strength: number
  scale: number
}

/**
 * earths vig state.
 */
export interface EarthVigState {
  enabled: boolean
  darkness: number
  offset: number
}

/**
 * earths film state.
 */
export interface EarthFilmState {
  enabled: boolean
  intensity: number
}

/**
 * earths grade state.
 */
export interface EarthGradeState {
  contrast: number
  saturation: number
  blackLevel: number
  blueGreenBoost: number
}

/**
 * earths state.
 */
export interface EarthState {
  /** RAF handle for the render loop; null while paused/reduced-motion. */
  animId: number | null
  /** Set by destroy(); checked after every await so a mid-load dispose
   *  aborts scene assembly without touching the GPU again. */
  disposed: boolean
  /** Mirrors the store's reduced-motion flag; freezes the loop. */
  reduced: boolean
  /** UI theme flag — stored for the sun-rotation feature (not yet wired). */
  isDarkTheme: boolean
  onReady: (() => void) | undefined | null
  onProgress: EarthProgressFn | null
  canvas: HTMLCanvasElement | null
  renderer: WebGPURenderer | null
  scene: THREE_NS.Scene | null
  camera: THREE_NS.PerspectiveCamera | null
  controls: OrbitControls | null
  pipeline: RenderPipeline | null
  earth: THREE_NS.Group | null
  moon: THREE_NS.LOD | null
  sunMesh: THREE_NS.Mesh | null
  sunLight: THREE_NS.DirectionalLight | null
  loader: THREE_NS.TextureLoader | null
  cloudsMesh: THREE_NS.Mesh | null
  sunDirU: UniformNode<'vec3', THREE_NS.Vector3> | null
  moonPosU: UniformNode<'vec3', THREE_NS.Vector3> | null
  cgUniforms: Record<string, UniformNode<'float', number>> | null
  caUniforms: Record<string, UniformNode<'float', number>> | null
  vigUniforms: Record<string, UniformNode<'float', number>> | null
  filmU: UniformNode<'float', number> | null
  bloomPass: BloomNode | null
  earthMatUniforms: Record<string, UniformNode<'float', number>> | null
  sun: EarthSunState | null
  moonCfg: EarthMoonState | null
  earthSpin: EarthSpinState | null
  bloom: EarthBloomState | null
  ca: EarthCaState | null
  vig: EarthVigState | null
  film: EarthFilmState | null
  cg: EarthGradeState | null
  render: { resolutionScale: number }
  /** Stable resize-listener identity so destroy() can removeEventListener. */
  onResize: (() => void) | null
}

/**
 * Creates earth state.
 */
export const createEarthState = (
  canvas: HTMLCanvasElement,
  onReady: (() => void) | undefined,
  onProgress: EarthProgressFn | undefined
): EarthState => ({
  animId: null,
  disposed: false,
  reduced: false,
  isDarkTheme: false,
  onReady: onReady ?? null,
  onProgress: onProgress ?? null,
  canvas,
  renderer: null,
  scene: null,
  camera: null,
  controls: null,
  pipeline: null,
  earth: null,
  moon: null,
  sunMesh: null,
  sunLight: null,
  loader: null,
  cloudsMesh: null,
  sunDirU: null,
  moonPosU: null,
  cgUniforms: null,
  caUniforms: null,
  vigUniforms: null,
  filmU: null,
  bloomPass: null,
  earthMatUniforms: null,
  sun: null,
  moonCfg: null,
  earthSpin: null,
  bloom: null,
  ca: null,
  vig: null,
  film: null,
  cg: null,
  render: { resolutionScale: DEFAULT_SP_GUI.DEBUG.RESOLUTION_SCALE },
  onResize: null,
})
