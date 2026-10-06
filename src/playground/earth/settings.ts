/**
 * @file earth/settings.ts
 * @description Settings snapshot builder for the WebGPU Earth engine,
 * extracted from earth-background.ts — maps live engine state (uniforms,
 * orbit configs, camera) onto the DEFAULT_SP_GUI-shaped tree that the
 * playground control panel renders.
 */
import type * as THREE_NS from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { UniformNode } from 'three/webgpu'
import { DEFAULT_SP_GUI } from '@/core/tokens/playground.js'

/** Rounded camera pose used to persist/restore the view. */
export interface CameraState {
  position: { x: number; y: number; z: number }
  target: { x: number; y: number; z: number }
}

/** The mutable engine state the snapshot reads — mirrors the private
 *  fields on EarthBackground; everything nullable covers pre-bootstrap. */
export interface EarthSettingsState {
  cg: { contrast: number; saturation: number; blackLevel: number; blueGreenBoost: number } | null
  moonCfg: {
    enabled: boolean
    speed: number
    distance: number
    inclination: number
    angle: number
  } | null
  bloom_: { enabled: boolean; strength: number; radius: number; threshold: number } | null
  vig: { enabled: boolean; darkness: number; offset: number } | null
  ca: { enabled: boolean; strength: number; scale: number } | null
  film: { enabled: boolean; intensity: number } | null
  earth_: { rotationSpeed: number; trueInclination: boolean } | null
  sun: {
    autoRotate: boolean
    speed: number
    inclination: number
    intensity: number
    color: number
    angle: number
  } | null
  earthMatUniforms: Record<string, UniformNode<'float', number>> | null
  camera: THREE_NS.PerspectiveCamera | null
  controls: OrbitControls | null
  render: { resolutionScale: number }
}

/**
 * Snapshot of every tunable, shaped exactly like DEFAULT_SP_GUI so the
 * playground control panel can render sliders without knowing which
 * values are live uniforms vs build-time constants. `??` fallbacks cover
 * the pre-bootstrap window where the private state is still null.
 * @returns {object} settings tree keyed like DEFAULT_SP_GUI
 */
export function buildSettingsSnapshot(s: EarthSettingsState, cam: CameraState | null) {
  return {
    SHOW: true,
    COLOR_GRADING: {
      CONTRAST: s.cg?.contrast ?? DEFAULT_SP_GUI.COLOR_GRADING.CONTRAST,
      SATURATION: s.cg?.saturation ?? DEFAULT_SP_GUI.COLOR_GRADING.SATURATION,
      BLACK_LEVEL: s.cg?.blackLevel ?? DEFAULT_SP_GUI.COLOR_GRADING.BLACK_LEVEL,
      BLUE_GREEN_BOOST: s.cg?.blueGreenBoost ?? DEFAULT_SP_GUI.COLOR_GRADING.BLUE_GREEN_BOOST,
    },
    MOON: {
      ENABLED: s.moonCfg?.enabled ?? DEFAULT_SP_GUI.MOON.ENABLED,
      SPEED: s.moonCfg?.speed ?? DEFAULT_SP_GUI.MOON.SPEED,
      DISTANCE: s.moonCfg?.distance ?? DEFAULT_SP_GUI.MOON.DISTANCE,
      INCLINATION: s.moonCfg?.inclination ?? DEFAULT_SP_GUI.MOON.INCLINATION,
    },
    LENS_FLARE: {
      ENABLED: DEFAULT_SP_GUI.LENS_FLARE.ENABLED,
      INTENSITY: DEFAULT_SP_GUI.LENS_FLARE.INTENSITY,
    },
    ANAMORPHIC: {
      ENABLED: DEFAULT_SP_GUI.ANAMORPHIC.ENABLED,
      INTENSITY: DEFAULT_SP_GUI.ANAMORPHIC.INTENSITY,
      THICKNESS: DEFAULT_SP_GUI.ANAMORPHIC.THICKNESS,
      SIZE: DEFAULT_SP_GUI.ANAMORPHIC.SIZE,
      COLOR: DEFAULT_SP_GUI.ANAMORPHIC.COLOR,
      INNER_FADE: DEFAULT_SP_GUI.ANAMORPHIC.INNER_FADE,
      OUTER_FADE: DEFAULT_SP_GUI.ANAMORPHIC.OUTER_FADE,
    },
    BLOOM: {
      ENABLED: s.bloom_?.enabled ?? DEFAULT_SP_GUI.BLOOM.ENABLED,
      STRENGTH: s.bloom_?.strength ?? DEFAULT_SP_GUI.BLOOM.STRENGTH,
      RADIUS: s.bloom_?.radius ?? DEFAULT_SP_GUI.BLOOM.RADIUS,
      THRESHOLD: s.bloom_?.threshold ?? DEFAULT_SP_GUI.BLOOM.THRESHOLD,
    },
    VIGNETTE: {
      ENABLED: s.vig?.enabled ?? DEFAULT_SP_GUI.VIGNETTE.ENABLED,
      DARKNESS: s.vig?.darkness ?? DEFAULT_SP_GUI.VIGNETTE.DARKNESS,
      OFFSET: s.vig?.offset ?? DEFAULT_SP_GUI.VIGNETTE.OFFSET,
    },
    CHROMATIC_ABERRATION: {
      ENABLED: s.ca?.enabled ?? DEFAULT_SP_GUI.CHROMATIC_ABERRATION.ENABLED,
      STRENGTH: s.ca?.strength ?? DEFAULT_SP_GUI.CHROMATIC_ABERRATION.STRENGTH,
      SCALE: s.ca?.scale ?? DEFAULT_SP_GUI.CHROMATIC_ABERRATION.SCALE,
    },
    FILM_GRAIN: {
      ENABLED: s.film?.enabled ?? DEFAULT_SP_GUI.FILM_GRAIN.ENABLED,
      INTENSITY: s.film?.intensity ?? DEFAULT_SP_GUI.FILM_GRAIN.INTENSITY,
    },
    ATMOSPHERE: {
      MODE: DEFAULT_SP_GUI.ATMOSPHERE.MODE,
      DENSITY: DEFAULT_SP_GUI.ATMOSPHERE.DENSITY,
      RAYLEIGH_COLOR: DEFAULT_SP_GUI.ATMOSPHERE.RAYLEIGH_COLOR,
      MIE_COLOR: DEFAULT_SP_GUI.ATMOSPHERE.MIE_COLOR,
      TWILIGHT_COLOR: DEFAULT_SP_GUI.ATMOSPHERE.TWILIGHT_COLOR,
      AIRGLOW_COLOR: DEFAULT_SP_GUI.ATMOSPHERE.AIRGLOW_COLOR,
    },
    CLOUD_SHADOWS: {
      DISTANCE: DEFAULT_SP_GUI.CLOUD_SHADOWS.DISTANCE,
      INTENSITY: DEFAULT_SP_GUI.CLOUD_SHADOWS.INTENSITY,
      COLOR: DEFAULT_SP_GUI.CLOUD_SHADOWS.COLOR,
    },
    OCEAN: {
      ROUGHNESS: DEFAULT_SP_GUI.OCEAN.ROUGHNESS,
      METALNESS: s.earthMatUniforms?.waterMetalness?.value ?? DEFAULT_SP_GUI.OCEAN.METALNESS,
    },
    EARTH: {
      ROTATION_SPEED: s.earth_?.rotationSpeed ?? DEFAULT_SP_GUI.EARTH.ROTATION_SPEED,
      BUMP_SCALE: s.earthMatUniforms?.bumpScale?.value ?? DEFAULT_SP_GUI.EARTH.BUMP_SCALE,
      TERRAIN_SHADOW_INTENSITY:
        s.earthMatUniforms?.terrainShadowIntensity?.value ??
        DEFAULT_SP_GUI.EARTH.TERRAIN_SHADOW_INTENSITY,
      TERRAIN_SHADOW_OFFSET:
        s.earthMatUniforms?.terrainShadowOffset?.value ??
        DEFAULT_SP_GUI.EARTH.TERRAIN_SHADOW_OFFSET,
      TRUE_INCLINATION: s.earth_?.trueInclination ?? DEFAULT_SP_GUI.EARTH.TRUE_INCLINATION,
    },
    CAMERA: {
      FOV: s.camera?.fov ?? DEFAULT_SP_GUI.CAMERA.FOV,
      POSITION: cam?.position ?? DEFAULT_SP_GUI.CAMERA.POSITION,
      TARGET: cam?.target ?? DEFAULT_SP_GUI.CAMERA.TARGET,
      AUTO_ROTATE: s.controls?.autoRotate ?? DEFAULT_SP_GUI.CAMERA.AUTO_ROTATE,
      AUTO_ROTATE_SPEED: s.controls?.autoRotateSpeed ?? DEFAULT_SP_GUI.CAMERA.AUTO_ROTATE_SPEED,
    },
    ENVIRONMENT: {
      SKYBOX_INTENSITY: DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_INTENSITY,
      SKYBOX_AZIMUTH: DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_AZIMUTH,
      SKYBOX_PITCH: DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_PITCH,
      SKYBOX_ROLL: DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_ROLL,
      DARK_SIDE_BRIGHTNESS: DEFAULT_SP_GUI.ENVIRONMENT.DARK_SIDE_BRIGHTNESS,
      CITY_LIGHTS: DEFAULT_SP_GUI.ENVIRONMENT.CITY_LIGHTS,
    },
    DEBUG: {
      STATS: DEFAULT_SP_GUI.DEBUG.STATS,
      RESOLUTION_SCALE: s.render.resolutionScale,
    },
    SUN: {
      INTENSITY: s.sun?.intensity ?? DEFAULT_SP_GUI.SUN.INTENSITY,
      COLOR: DEFAULT_SP_GUI.SUN.COLOR,
      AUTO_ROTATE: s.sun?.autoRotate ?? DEFAULT_SP_GUI.SUN.AUTO_ROTATE,
      SPEED: s.sun?.speed ?? DEFAULT_SP_GUI.SUN.SPEED,
      INCLINATION: s.sun?.inclination ?? DEFAULT_SP_GUI.SUN.INCLINATION,
    },
  }
}
