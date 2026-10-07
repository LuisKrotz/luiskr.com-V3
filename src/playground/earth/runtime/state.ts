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
 * Progress callback signature — label + percent so the loader UI can show
 * which asset is streaming and how far along the whole boot is.
 * @param _label Asset label for the loader text.
 * @param percent 0–100 progress through the boot sequence.
 */
export type EarthProgressFn = (_label: string, percent: number) => void

/** Sun settings driven by the control panel. */
export interface EarthSunState {
  /** Whether the sun orbits automatically. */
  autoRotate: boolean
  /** Orbit angular speed (rad/frame scale). */
  speed: number
  /** Orbit plane inclination (rad). */
  inclination: number
  /** Directional-light intensity. */
  intensity: number
  /** Packed RGB light color. */
  color: number
  /** Current orbit angle (rad) — advanced per frame when autoRotate. */
  angle: number
}

/** Moon orbit settings driven by the control panel. */
export interface EarthMoonState {
  /** Whether the moon layer is rendered at all. */
  enabled: boolean
  /** Orbit angular speed. */
  speed: number
  /** Orbit radius in world units. */
  distance: number
  /** Orbit plane inclination (rad). */
  inclination: number
  /** Current orbit angle (rad). */
  angle: number
}

/** Earth self-rotation settings. */
export interface EarthSpinState {
  /** Y-rotation speed applied per frame. */
  rotationSpeed: number
  /** When true the real 23.44° tilt is applied to the group. */
  trueInclination: boolean
}

/** Bloom post-pass settings. */
export interface EarthBloomState {
  enabled: boolean
  /** Bloom intensity multiplier. */
  strength: number
  /** Bloom kernel radius. */
  radius: number
  /** Luminance threshold above which pixels bleed. */
  threshold: number
}

/** Chromatic-aberration post-pass settings. */
export interface EarthCaState {
  enabled: boolean
  /** RGB channel split magnitude. */
  strength: number
  /** Effect radial scale. */
  scale: number
}

/** Vignette post-pass settings. */
export interface EarthVigState {
  enabled: boolean
  /** Edge darkening amount. */
  darkness: number
  /** Where the falloff starts (0–1 UV distance). */
  offset: number
}

/** Film-grain post-pass settings. */
export interface EarthFilmState {
  enabled: boolean
  /** Grain opacity/intensity. */
  intensity: number
}

/** Color-grade post-pass settings. */
export interface EarthGradeState {
  /** Contrast multiplier around mid-gray. */
  contrast: number
  /** Saturation multiplier (1 = unchanged). */
  saturation: number
  /** Lift applied to the black point. */
  blackLevel: number
  /** Extra blue/green channel gain for the oceanic palette. */
  blueGreenBoost: number
}

/**
 * The single mutable bag for the whole engine — every async-created GPU
 * handle is nullable because bootstrap fills them progressively and a
 * mid-boot dispose must see exactly what's live.
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
 * Builds the initial null-everything state bag — every GPU handle starts
 * null so bootstrap can fill them in any order and dispose can skip
 * whatever never got created.
 * @param canvas The target canvas element.
 * @param onReady Callback once the scene is first rendered.
 * @param onProgress Boot progress reporter.
 * @returns The zeroed state bag.
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
