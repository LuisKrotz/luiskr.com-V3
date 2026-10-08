/**
 * @file core/vite.config.js
 * @description Library build for the `core` module — every shared primitive
 * (tokens, store, router, utils, sass entry points, polyfills, safari
 * patches). Emits `core/dist/core.js` (ES module); sibling-module and npm
 * specifiers stay external so the bundle is exactly this folder.
 */
import { moduleConfig } from '../build/vite-lib.mjs'

export default moduleConfig({ dir: new URL('.', import.meta.url).pathname, name: 'core' })
