/**
 * @file cms/vite.config.js
 * @description Library build for the `cms` module — admin editors, routes and
 * tokens. The CMS is an author-only tool, so the target is ESNext with no
 * Safari/legacy polyfill story (the root app build still ships its own
 * cms.html entry for production). Emits `cms/dist/cms.js`.
 */
import { moduleConfig } from '../build/vite-lib.mjs'

export default moduleConfig({ dir: new URL('.', import.meta.url).pathname, name: 'cms' })
