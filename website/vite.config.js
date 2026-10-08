/**
 * @file website/vite.config.js
 * @description Library build for the `website` module — the public site's
 * views (home, legal, not-found, project) and every component they mount.
 * Emits `website/dist/website.js`; @core/@/sibling imports stay external.
 */
import { moduleConfig } from '../build/vite-lib.mjs'

export default moduleConfig({ dir: new URL('.', import.meta.url).pathname, name: 'website' })
