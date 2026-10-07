/**
 * @file tokens/playground/params.js
 * @description `data-param` values on playground sliders/checkboxes split by
 * subsystem — grouped subsets of SP_PARAMS. The stable wire between a DOM
 * input and an engine setter (`PARAM_HANDLERS` in SpacePlayground maps each
 * token to an `earthBg.update*()` call).
 */

export const SP_CAMERA_PARAMS = Object.freeze({
  FOV: 'fov',
  ROTATE_SPEED: 'rotate-speed',
  AUTO_ROTATE: 'auto-rotate',
})

/**
 * Frozen sp scene parameter map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const SP_SCENE_PARAMS = Object.freeze({
  EARTH_SPEED: 'earth-speed',
  BUMP_SCALE: 'bump-scale',
  SELF_SHADOW: 'self-shadow',
  SELF_SHADOW_OFFSET: 'self-shadow-offset',
  WATER_METALNESS: 'water-metalness',
  SUN_AUTO_ROTATE: 'sun-auto-rotate',
})

/**
 * Frozen sp post parameter map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const SP_POST_PARAMS = Object.freeze({
  BLOOM: 'bloom',
  BLOOM_STRENGTH: 'bloom-strength',
  BLOOM_RADIUS: 'bloom-radius',
  BLOOM_THRESHOLD: 'bloom-threshold',
  VIGNETTE: 'vignette',
  VIGNETTE_DARKNESS: 'vignette-darkness',
  VIGNETTE_OFFSET: 'vignette-offset',
  CHROMATIC: 'chromatic',
  CA_STRENGTH: 'ca-strength',
  FILM_GRAIN: 'film-grain',
})

/**
 * Frozen sp grade parameter map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const SP_GRADE_PARAMS = Object.freeze({
  CONTRAST: 'contrast',
  SATURATION: 'saturation',
  BLACK_LEVEL: 'black-level',
})

/**
 * Frozen sp debug parameter map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const SP_DEBUG_PARAMS = Object.freeze({
  RES_SCALE: 'res-scale',
  SHOW_STATS: 'show-stats',
})
