/**
 * @file awards-carousel/types.ts — slide entry shape.
 */
/* istanbul ignore file */

export interface CarouselSlide {
  link?: string
  media?: { path?: string; width?: number; height?: number }
  icon?: string
  description?: string
  content?: string
  label?: string
}
