/**
 * @file @core/index.js
 * @description Unified barrel export for the core layer with "sideEffects": false for clean tree-shaking.
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
