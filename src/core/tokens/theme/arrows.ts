/**
 * @file tokens/theme/arrows.js
 * @description Carousel arrow button directions — shared by CustomCarousel
 * markup and CarouselArrowWebGL shader direction mapping.
 */

export const ARROW_TYPES = Object.freeze({
  PREV: 'prev',
  NEXT: 'next',
})

/** Glyphs shown inside each arrow button (JSX decodes &#8592;/&#8594;). */
export const ARROW_GLYPHS = Object.freeze({
  PREV: '←',
  NEXT: '→',
})
