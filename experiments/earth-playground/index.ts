/**
 * @file experiments/earth-playground/index.ts
 * @description Barrel for the `earth-playground` experiment module — the
 * WebGPU/Three.js Earth scene and the space-playground editor surface.
 * Self-contained: imports resolve through @core only, never @website/@cms.
 * Re-export-only file.
 */
/* istanbul ignore file */

export { SpacePlayground } from './SpacePlayground.js'
