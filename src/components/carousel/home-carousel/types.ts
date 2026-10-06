/**
 * @file home-carousel/types.ts — slide entry shape.
 */

export interface CarouselSlide {
  link?: string
  media?: { path?: string; width?: number; height?: number }
  icon?: string
  description?: string
  content?: string
  label?: string
}
