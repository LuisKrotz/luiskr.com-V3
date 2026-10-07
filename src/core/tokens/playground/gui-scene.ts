/**
 * @file tokens/playground/gui-scene.js
 * @description Scene-subsystem start values for the Earth Playground —
 * moon orbit, atmosphere scattering, cloud shadows, ocean BRDF, earth
 * surface, sun, camera, environment. Grouped subsets of DEFAULT_SP_GUI.
 */

export const SP_MOON_DEFAULTS = Object.freeze({
  ENABLED: true,
  SPEED: 0.0002,
  DISTANCE: 50,
  INCLINATION: 0,
})

/**
 * Frozen sp atmosphere map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const SP_ATMOSPHERE_DEFAULTS = Object.freeze({
  MODE: 'Airglow',
  DENSITY: 20,
  RAYLEIGH_COLOR: 0x3377ff,
  MIE_COLOR: 0x0d374a,
  TWILIGHT_COLOR: 0xff5533,
  AIRGLOW_COLOR: 0x44ff55,
})

/**
 * Frozen sp cloud shadow map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const SP_CLOUD_SHADOW_DEFAULTS = Object.freeze({
  DISTANCE: 1.2,
  INTENSITY: 0.8,
  COLOR: 0x334059,
})

/**
 * Frozen sp ocean map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const SP_OCEAN_DEFAULTS = Object.freeze({
  ROUGHNESS: 0,
  METALNESS: 0,
})

/**
 * Frozen sp earth map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const SP_EARTH_DEFAULTS = Object.freeze({
  ROTATION_SPEED: 0.0001,
  BUMP_SCALE: 5,
  TERRAIN_SHADOW_INTENSITY: 1,
  TERRAIN_SHADOW_OFFSET: 0.002,
  TRUE_INCLINATION: true,
})

/**
 * Frozen sp camera map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const SP_CAMERA_DEFAULTS = Object.freeze({
  FOV: 45,
  POSITION: Object.freeze({
    x: 21.856154240766372,
    y: -3.6712368727086657,
    z: 20.125738437375286,
  }),
  TARGET: Object.freeze({
    x: 0,
    y: 0,
    z: 0,
  }),
  AUTO_ROTATE: false,
  AUTO_ROTATE_SPEED: 0.05,
})

/**
 * Frozen sp environment map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const SP_ENVIRONMENT_DEFAULTS = Object.freeze({
  SKYBOX_INTENSITY: 0.5,
  SKYBOX_AZIMUTH: 1.75,
  SKYBOX_PITCH: 0,
  SKYBOX_ROLL: 0,
  DARK_SIDE_BRIGHTNESS: 0.055,
  CITY_LIGHTS: 6.3,
})

/**
 * Frozen sp sun map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const SP_SUN_DEFAULTS = Object.freeze({
  INTENSITY: 2.5,
  COLOR: 0xffffff,
  AUTO_ROTATE: true,
  SPEED: 0.05,
  INCLINATION: 0.076,
})
