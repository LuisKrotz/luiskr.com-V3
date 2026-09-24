/**
 * @file @core/tokens/storage.js
 * @description Centralized localStorage, IndexedDB, and cache configuration tokens.
 */

export const STORAGE_KEYS = Object.freeze({
  VIDEO_AUTOPLAY: 'videoAutoplay',
  LOCALE: 'locale',
  REDUCED_MOTION: 'reducedMotion',
  THEME: 'theme',
  STATS_FOR_NERDS: 'statsForNerds',
  SHOW_GRID: 'showGrid',
  COOKIE: 'cookie',
  FB_CACHE_PREFIX: 'fb_',
})

export const IDB_CONFIG = Object.freeze({
  MEDIA_DB_NAME: 'luiskr_media_disk_cache_v1',
  MEDIA_DB_VERSION: 1,
  MEDIA_STORE: 'media_blobs',
  READONLY: 'readonly',
  READWRITE: 'readwrite',
})

export const CACHE_CONFIG = Object.freeze({
  FORCE_CACHE: 'force-cache',
})
