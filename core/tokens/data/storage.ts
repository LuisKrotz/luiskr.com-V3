/**
 * @file tokens/data/storage.js
 * @description localStorage/sessionStorage key tokens split by scope —
 * grouped subsets of STORAGE_KEYS.
 */

/**
 * localStorage/sessionStorage key tokens split by scope. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const PREF_STORAGE_KEYS = Object.freeze({
  VIDEO_AUTOPLAY: 'videoAutoplay',
  LOCALE: 'locale',
  REDUCED_MOTION: 'reducedMotion',
  THEME: 'theme',
  STATS_FOR_NERDS: 'statsForNerds',
  SHOW_GRID: 'showGrid',
  COOKIE: 'cookie',
  SPACE_PLAYGROUND: 'spacePlayground',
})

/**
 * Caches storage keys.
 */
export const CACHE_STORAGE_KEYS = Object.freeze({
  FB_CACHE_PREFIX: 'fb_',
  SESSION_FB_CACHE_PREFIX: 'fb_cache_',
  /** Docs 3D-scene camera pose + rotation-off flag (session-scoped). */
  DOCS_SCENE_STATE: 'docs_scene_state',
})
