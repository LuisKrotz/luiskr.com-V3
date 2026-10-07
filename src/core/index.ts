/**
 * @file @core/index.js
 * @description Unified barrel export for the core layer. package.json marks
 * "sideEffects": false, so re-export chains like this are what let bundlers
 * tree-shake: consumers importing a single token pay for only that module.
 * istanbul ignores it because re-export lines have no executable logic to cover.
 */
/* istanbul ignore file */

export * from './constants.js'
export * from './Component.js'
export * from './jsx.js'
export * from './i18n.js'
export * from '@/core/utils/index.js'
export { default as store } from './store.js'
export { default as router } from '@/routes/router.js'
export { predictiveLoader } from './predictive-loader.js'
