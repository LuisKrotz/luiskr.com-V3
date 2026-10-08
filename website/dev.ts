/* istanbul ignore file -- standalone dev entry; only runs under `vite dev`, never bundled or exercised by tests */
/**
 * @file website/dev.ts
 * @description Standalone dev entry for the website module — `yarn dev` in
 * this folder boots the real app shell (shared/src/main.ts) through the
 * module vite config's @ alias, so the site runs in isolation without the
 * root build pipeline.
 */
import '@/main.js'
