/**
 * @file awards-carousel/types.ts — slide entry shape.
 */
/* istanbul ignore file */

/**
 * One slide of the awards carousel — `link` is the outbound award URL,
 * `media` the optional cover image (path + intrinsic size for aspect layout),
 * `icon`/`description`/`content`/`label` the rendered copy fields. All optional:
 * slides tolerate partial CMS rows without render guards.
 */
export interface CarouselSlide {
  link?: string
  media?: { path?: string; width?: number; height?: number }
  icon?: string
  description?: string
  content?: string
  label?: string
}
