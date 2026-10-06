/**
 * @file tokens/playground.js
 * @description Playground-scoped registries — Space/Earth Playground action
 * names, ambient soundtrack URLs, `data-param` slider keys, the texture
 * manifest and the engine start-state (`DEFAULT_SP_GUI`). Decomposed into
 * per-subsystem group objects under `tokens/playground/`; import a group
 * directly for tree-shaking.
 */

import {
  SP_MOON_DEFAULTS,
  SP_ATMOSPHERE_DEFAULTS,
  SP_CLOUD_SHADOW_DEFAULTS,
  SP_OCEAN_DEFAULTS,
  SP_EARTH_DEFAULTS,
  SP_CAMERA_DEFAULTS,
  SP_ENVIRONMENT_DEFAULTS,
  SP_SUN_DEFAULTS,
} from './playground/gui-scene.js'
import {
  SP_COLOR_GRADING_DEFAULTS,
  SP_LENS_FLARE_DEFAULTS,
  SP_ANAMORPHIC_DEFAULTS,
  SP_BLOOM_DEFAULTS,
  SP_VIGNETTE_DEFAULTS,
  SP_CHROMATIC_DEFAULTS,
  SP_FILM_GRAIN_DEFAULTS,
  SP_DEBUG_DEFAULTS,
} from './playground/gui-post.js'

export * from './playground/actions.js'
export * from './playground/music.js'
export * from './playground/params.js'
export * from './playground/textures.js'
export * from './playground/gui-scene.js'
export * from './playground/gui-post.js'

/**
 * Engine start state for the Earth Playground — the hardcoded baseline the
 * scene boots with before any CMS `defaults` node or user localStorage
 * overrides merge in. Values were hand-tuned visually; each block maps to
 * one `earth-background.js` subsystem (post-fx chain, moon orbit, sun,
 * atmosphere scattering, ocean BRDF, camera orbit).
 * @type {Readonly<object>}
 */
export const DEFAULT_SP_GUI = Object.freeze({
  SHOW: true,
  COLOR_GRADING: SP_COLOR_GRADING_DEFAULTS,
  MOON: SP_MOON_DEFAULTS,
  LENS_FLARE: SP_LENS_FLARE_DEFAULTS,
  ANAMORPHIC: SP_ANAMORPHIC_DEFAULTS,
  BLOOM: SP_BLOOM_DEFAULTS,
  VIGNETTE: SP_VIGNETTE_DEFAULTS,
  CHROMATIC_ABERRATION: SP_CHROMATIC_DEFAULTS,
  FILM_GRAIN: SP_FILM_GRAIN_DEFAULTS,
  ATMOSPHERE: SP_ATMOSPHERE_DEFAULTS,
  CLOUD_SHADOWS: SP_CLOUD_SHADOW_DEFAULTS,
  OCEAN: SP_OCEAN_DEFAULTS,
  EARTH: SP_EARTH_DEFAULTS,
  CAMERA: SP_CAMERA_DEFAULTS,
  ENVIRONMENT: SP_ENVIRONMENT_DEFAULTS,
  DEBUG: SP_DEBUG_DEFAULTS,
  SUN: SP_SUN_DEFAULTS,
})
