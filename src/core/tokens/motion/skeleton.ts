/**
 * @file tokens/motion/skeleton.js
 * @description WebGL skeleton-field configuration tokens — grouped subsets
 * of SKELETON.
 */

export const SKELETON_RENDER = Object.freeze({
  /** Max placeholder rects per layer (GLSL uniform array size) */
  MAX_RECTS: 24,
  /** Device pixel ratio cap — the field is soft, 1.5 is plenty */
  MAX_DPR: 1.5,
  /** Internal render scale relative to device pixels — 1 keeps glyph edges sharp */
  RENDER_SCALE: 1,
  /** Render every Nth animation frame */
  FRAME_SKIP: 2,
  /** Max delay before the field starts animating after mount (ms) */
  START_DELAY: 600,
  INK_ALPHA_LIGHT: 0.16,
  INK_ALPHA_DARK: 0.22,
})

/**
 * The SKELETON_GLYPH constant.
 */
export const SKELETON_GLYPH = Object.freeze({
  /** Glyph cell size bounds for text rows (CSS px) */
  CELL_MIN: 7,
  CELL_MAX: 13,
  /** Glyph cell size for media/image placeholders (CSS px) */
  CELL_MEDIA: 16,
  /** Placeholders shorter than this are treated as text lines */
  TEXT_MAX_HEIGHT: 80,
})

/**
 * The SKELETON_RESOLVE constant.
 */
export const SKELETON_RESOLVE = Object.freeze({
  /** Resolve-out length once content has arrived (ms) */
  RESOLVE_DURATION: 480,
})

/**
 * The SKELETON_MOSAIC constant.
 */
export const SKELETON_MOSAIC = Object.freeze({
  /** Mosaic skeleton tiles rendered before data lands (mirrors portfoliolist size) */
  MOSAIC_TILES: 12,
  /** The curated home list leads with featured (2-column) items */
  MOSAIC_FEATURED: 6,
  /** Mosaic tiles eligible for LCP — loaded eagerly with high fetch priority */
  MOSAIC_LCP_TILES: 2,
})

/**
 * The SKELETON_WARN constant.
 */
export const SKELETON_WARN = Object.freeze({
  ARIA_HIDDEN: 'aria-hidden',
  SHADER_WARN: 'SkeletonWebGL shader error:',
  /** Renderer strings of CPU rasterizers where the field would cost main-thread time */
  SOFTWARE_RENDERERS: /swiftshader|llvmpipe|softpipe|software|mesa offscreen/i,
})
