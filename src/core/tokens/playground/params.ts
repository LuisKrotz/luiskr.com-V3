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
 * The SP_SCENE_PARAMS constant.
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
 * The SP_POST_PARAMS constant.
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
 * The SP_GRADE_PARAMS constant.
 */
export const SP_GRADE_PARAMS = Object.freeze({
  CONTRAST: 'contrast',
  SATURATION: 'saturation',
  BLACK_LEVEL: 'black-level',
})

/**
 * The SP_DEBUG_PARAMS constant.
 */
export const SP_DEBUG_PARAMS = Object.freeze({
  RES_SCALE: 'res-scale',
  SHOW_STATS: 'show-stats',
})
