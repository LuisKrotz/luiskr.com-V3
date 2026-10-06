/**
 * @file tokens/jsx/svg.js
 * @description SVG vocabulary tokens — the XML namespace plus the tag set
 * that must go through `document.createElementNS` (a plain
 * `createElement('svg')` produces an HTMLUnknownElement that renders
 * nothing, which is why the flag/carousel SVGs go through this check).
 */

/** XML namespace for SVG node creation via `document.createElementNS`. */
export const SVG_NS = 'http://www.w3.org/2000/svg'

/**
 * The svg tags helper.
 */
export const SVG_TAGS = Object.freeze(
  new Set([
    'svg',
    'animate',
    'circle',
    'clipPath',
    'defs',
    'desc',
    'ellipse',
    'feBlend',
    'feColorMatrix',
    'feComponentTransfer',
    'feComposite',
    'feConvolveMatrix',
    'feDiffuseLighting',
    'feDisplacementMap',
    'feDistantLight',
    'feDropShadow',
    'feFlood',
    'feFuncA',
    'feFuncB',
    'feFuncG',
    'feFuncR',
    'feGaussianBlur',
    'feImage',
    'feMerge',
    'feMergeNode',
    'feMorphology',
    'feOffset',
    'fePointLight',
    'feSpecularLighting',
    'feSpotLight',
    'feTile',
    'feTurbulence',
    'filter',
    'g',
    'image',
    'line',
    'linearGradient',
    'marker',
    'mask',
    'path',
    'pattern',
    'polygon',
    'polyline',
    'radialGradient',
    'rect',
    'stop',
    'text',
    'textPath',
    'tspan',
    'use',
  ])
)
