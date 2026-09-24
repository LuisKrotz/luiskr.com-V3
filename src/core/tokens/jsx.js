/**
 * @file @core/tokens/jsx.js
 * @description Centralized tokens and dictionaries for JSX compilation and native DOM hydration.
 */

export const SVG_NS = 'http://www.w3.org/2000/svg'

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

export const BOOL_PROPS = Object.freeze(
  new Set([
    'muted',
    'loop',
    'controls',
    'autoplay',
    'disabled',
    'checked',
    'readonly',
    'required',
    'multiple',
    'selected',
    'default',
    'hidden',
    'novalidate',
    'reversed',
    'autofocus',
    'inert',
  ])
)

export const PROP_ATTR_MAP = Object.freeze({
  playsInline: 'playsinline',
  autoPlay: 'autoplay',
  readOnly: 'readonly',
  noValidate: 'novalidate',
  htmlFor: 'for',
  tabIndex: 'tabindex',
  crossOrigin: 'crossorigin',
})

export const JSX_PROPS = Object.freeze({
  CLASS_NAME: 'className',
  CLASS: 'class',
  STYLE: 'style',
  REF: 'ref',
  DANGEROUSLY_SET_INNER_HTML: 'dangerouslySetInnerHTML',
  PLAYS_INLINE: 'playsInline',
  PLAYSINLINE_ATTR: 'playsinline',
  ON_PREFIX: 'on',
})
