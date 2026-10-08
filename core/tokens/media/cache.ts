/**
 * @file tokens/media/cache.js
 * @description IndexedDB media disk-cache + network cache-mode tokens.
 */

/**
 * IndexedDB media disk-cache + network cache-mode tokens. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const IDB_CONFIG = Object.freeze({
  MEDIA_DB_NAME: 'luiskr_media_disk_cache_v1',
  MEDIA_KEY_PREFIX: 'luiskr_media_',
  MEDIA_META_PREFIX: 'luiskr_media_meta_',
  MEDIA_DB_VERSION: 1,
  MEDIA_STORE: 'media_blobs',
  READONLY: 'readonly',
  READWRITE: 'readwrite',
})

/**
 * Caches config.
 */
export const CACHE_CONFIG = Object.freeze({
  FORCE_CACHE: 'force-cache',
})
