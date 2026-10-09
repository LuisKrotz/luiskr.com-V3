/**
 * @file experiments/star-field/index.ts
 * @description Barrel for the `star-field` experiment module — the
 * three.js star-chart scene and the <view-star-field> component surface.
 * Self-contained: imports resolve through @core only, never @website/@cms.
 * Re-export-only file.
 */
/* istanbul ignore file */

export { StarField } from './StarField.js'
export { StarFieldEngine } from './starfield-engine.js'
export { SF_CATALOG, SF_GROUP_ORDER, sfCatalogByGroup } from './engine/catalog.js'
export type { SFBodyDef, SFDossier } from './engine/types.js'
