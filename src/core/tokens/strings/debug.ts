/**
 * @file tokens/strings/debug.ts
 * @description URL `debug` parameter vocabulary. `?debug=<value>` may appear
 * multiple times on a URL; every value listed here is parsed by
 * src/core/debug/params.ts at boot.
 */

/**
 * URL `debug` parameter vocabulary. `?debug=<value>` may appear multiple times on a URL; every value listed here is parsed by src/core/debug/params.ts at boot. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const DEBUG_PARAMS = Object.freeze({
  /** The query-string key — `?debug=…`. */
  KEY: 'debug',
  /** Fires a test toast notification at boot (notification pipeline check). */
  NOTIFICATION_TEST: 'sendNotificationTest',
  /** `webGLMode:<mode>` forces the WebGL pipeline — `active` (default
   *  probing) or `fallback` (every context acquisition returns null, so all
   *  widgets render their CSS/2D fallback). */
  WEBGL_MODE: 'webGLMode',
})

/** `webGLMode:` values. */
export const WEBGL_MODES = Object.freeze({
  ACTIVE: 'active',
  FALLBACK: 'fallback',
})
