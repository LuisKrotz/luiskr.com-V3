/**
 * @file tokens/playground/textures.js
 * @description Public-URL paths for the Earth Playground texture set (served
 * from `experiments/earth-playground/public/textures/earth/`). NASA-visible-earth style maps: day albedo,
 * night city lights, ocean specular mask, bump/normal, cloud layer,
 * star field backdrop, moon albedo + lunar displacement (LDEM).
 * @type {Readonly<Record<string, string>>}
 */

/**
 * Public-URL paths for the Earth Playground texture set (served from `experiments/earth-playground/public/textures/earth/`). NASA-visible-earth style maps: day albedo, night city lights, ocean specular mask, bump/normal, cloud layer, star field backdrop, moon albedo + lunar displacement (LDEM). Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const EARTH_TEXTURES = Object.freeze({
  ALBEDO: '/experiments/earth-playground/textures/earth/2k_earth_daymap.jpg',
  ALBEDO_2K: '/experiments/earth-playground/textures/earth/2k_earth_daymap.jpg',
  NIGHT: '/experiments/earth-playground/textures/earth/2k_earth_nightmap.jpg',
  SPECULAR: '/experiments/earth-playground/textures/earth/2k_earth_specular_map.jpg',
  NORMAL: '/experiments/earth-playground/textures/earth/2k_earth_normal_map.jpg',
  CLOUDS: '/experiments/earth-playground/textures/earth/2k_earth_clouds.jpg',
  STARS: '/experiments/earth-playground/textures/earth/starmap_2k.jpg',
  MOON: '/experiments/earth-playground/textures/earth/2k_moon.jpg',
  MOON_DISP: '/experiments/earth-playground/textures/earth/ldem_4.png',
})
