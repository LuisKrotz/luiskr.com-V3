/**
 * @file legacy-polyfills/es-core.js
 * @description Full ES shim layer for pre-ES2019 engines: core-js-bundle
 * covers Promise, Symbol, Map/Set, Object.*, Array.*, Number.*, String.*,
 * iterators and regenerator support. Served ONLY to browsers whose runtime
 * guard fails (missing Promise/Symbol/Map/Object.assign) — modern browsers
 * never download it.
 */
/* istanbul ignore file */
import 'core-js-bundle/minified.js'
