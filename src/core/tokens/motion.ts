/**
 * @file tokens/motion.js
 * @description Animation & rendering tokens — easing curves, carousel
 * timing/geometry, the WebGL skeleton field configuration, GPU renderer
 * classifiers, notification runtime tuning and predictive-prefetch config.
 * Decomposed into per-domain group objects under `tokens/motion/`; import a
 * group directly for tree-shaking.
 */

export * from './motion/carousel.js'
export * from './motion/animation.js'
export * from './motion/skeleton.js'
export * from './motion/gpu.js'
export * from './motion/notify.js'
export * from './motion/prefetch.js'
