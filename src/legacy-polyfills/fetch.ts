/**
 * @file legacy-polyfills/fetch.js
 * @description window.fetch polyfill (whatwg-fetch) for pre-fetch engines —
 * the site's REST data layer (utils/db.js, firebase.js) requires fetch.
 * Loaded only when `typeof fetch !== 'function'`.
 */
/* istanbul ignore file */
import 'whatwg-fetch'
