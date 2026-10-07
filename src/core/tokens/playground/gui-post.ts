/**
 * @file tokens/playground/gui-post.js
 * @description Post-processing start values for the Earth Playground —
 * color grading, lens flare, anamorphic streaks, bloom, vignette, chromatic
 * aberration, film grain, debug. Grouped subsets of DEFAULT_SP_GUI.
 */

export const SP_COLOR_GRADING_DEFAULTS = Object.freeze({
  CONTRAST: 1,
  SATURATION: 1.5,
  BLACK_LEVEL: 0.015,
  BLUE_GREEN_BOOST: 0,
})

/**
 * Frozen sp lens flare map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const SP_LENS_FLARE_DEFAULTS = Object.freeze({
  ENABLED: true,
  INTENSITY: 0.15,
})

/**
 * Frozen sp anamorphic map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const SP_ANAMORPHIC_DEFAULTS = Object.freeze({
  ENABLED: false,
  INTENSITY: 0.5,
  THICKNESS: 2,
  SIZE: 0.2,
  COLOR: 0xffffff,
  INNER_FADE: 0.08,
  OUTER_FADE: 0.08,
})

/**
 * Frozen sp bloom map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const SP_BLOOM_DEFAULTS = Object.freeze({
  ENABLED: false,
  STRENGTH: 0.1,
  RADIUS: 0.3,
  THRESHOLD: 0.9,
})

/**
 * Frozen sp vignette map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const SP_VIGNETTE_DEFAULTS = Object.freeze({
  ENABLED: false,
  DARKNESS: 1,
  OFFSET: 0.5,
})

/**
 * Frozen sp chromatic map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const SP_CHROMATIC_DEFAULTS = Object.freeze({
  ENABLED: false,
  STRENGTH: 0.25,
  SCALE: 0.5,
})

/**
 * Frozen sp film grain map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const SP_FILM_GRAIN_DEFAULTS = Object.freeze({
  ENABLED: false,
  INTENSITY: 0.25,
})

/**
 * Frozen sp debug map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const SP_DEBUG_DEFAULTS = Object.freeze({
  STATS: false,
  RESOLUTION_SCALE: 2,
})
