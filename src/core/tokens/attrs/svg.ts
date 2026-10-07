/**
 * @file tokens/attrs/svg.js
 * @description SVG geometry attribute values — token group.
 * The carousel countdown ring's viewBox/radius must stay consistent with
 * `CAROUSEL_LAYOUT.CIRCUMFERENCE` (2π × 19) in tokens/motion/carousel.js.
 */

/**
 * SVG geometry attribute values. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const SVG_ATTRS = Object.freeze({
  RING_VIEWBOX: '0 0 40 40',
  RING_CX: '20',
  RING_CY: '20',
  RING_R: '19',
})
