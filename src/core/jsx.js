/**
 * @file jsx.js
 * @description Zero-dependency native DOM JSX pragma.
 * Emits real DOM elements directly (no virtual DOM overhead, no string interpolation).
 */

import { sanitizeHtml } from '../utils/sanitize.js'
import { STRINGS, ATTRS } from './constants.js'

const SVG_TAGS = new Set([
  'svg', 'animate', 'circle', 'clipPath', 'defs', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB',
  'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge',
  'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
  'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence',
  'filter', 'g', 'image', 'line', 'linearGradient', 'marker', 'mask',
  'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'stop', 'text', 'textPath', 'tspan', 'use',
])

const SVG_NS = 'http://www.w3.org/2000/svg'

// Boolean HTML attributes that MUST be set as DOM properties (not attribute strings).
// 'muted' in particular MUST be el.muted = true — setAttribute('muted','true') does NOT
// mute the video in Chrome/Safari, which blocks autoplay. Same for other boolean IDL attrs.
const BOOL_PROPS = new Set([
  'muted', 'loop', 'controls', 'autoplay', 'disabled', 'checked',
  'readonly', 'required', 'multiple', 'selected', 'default',
  'hidden', 'novalidate', 'reversed', 'autofocus', 'inert',
])

// JSX camelCase prop → lowercase HTML attribute name (for setAttribute path only).
const PROP_ATTR_MAP = {
  playsInline: 'playsinline',
  autoPlay:    'autoplay',
  readOnly:    'readonly',
  noValidate:  'novalidate',
  htmlFor:     'for',
  tabIndex:    'tabindex',
  crossOrigin: 'crossorigin',
}

/**
 * JSX factory function.
 * @param {string|Function} tag - Element tag name or Component function
 * @param {Object} [props] - Element attributes / event handlers
 * @param  {...any} children - Child nodes or primitives
 * @returns {HTMLElement|SVGElement|DocumentFragment}
 */
export function h(tag, props, ...children) {
  // Functional component
  if (typeof tag === STRINGS.FUNCTION) {
    return tag({ ...(props || {}), children: children.flat(Infinity) })
  }

  // Create element (SVG-aware)
  const isSvg = SVG_TAGS.has(tag)
  const el = isSvg
    ? document.createElementNS(SVG_NS, tag)
    : document.createElement(tag)

  // Apply props
  if (props) {
    for (const [key, val] of Object.entries(props)) {
      if (val === null || val === undefined || val === false) continue

      if (key.startsWith('on') && typeof val === STRINGS.FUNCTION) {
        const eventName = key.slice(2).toLowerCase()
        el.addEventListener(eventName, val)
      } else if (key === 'className' || key === 'class') {
        if (isSvg) {
          el.setAttribute('class', String(val))
        } else {
          el.className = String(val)
        }
      } else if (key === 'style') {
        if (typeof val === STRINGS.STRING) {
          el.style.cssText = val
        } else if (typeof val === STRINGS.OBJECT) {
          Object.assign(el.style, val)
        }
      } else if (key === 'ref' && typeof val === STRINGS.FUNCTION) {
        val(el)
      } else if (key === 'dangerouslySetInnerHTML') {
        el.innerHTML = val?.__html != null ? sanitizeHtml(String(val.__html)) : ATTRS.EMPTY
      } else if (key === 'playsInline') {
        // 'playsInline' JSX → 'playsinline' attribute (must be lowercase, empty string value)
        el.setAttribute('playsinline', '')
      } else if (BOOL_PROPS.has(key.toLowerCase())) {
        // Boolean IDL attributes: set as DOM property (true) AND as empty attribute.
        // This is critical for 'muted' — setAttribute alone does not mute in Chrome/Safari.
        const attrName = PROP_ATTR_MAP[key] || key.toLowerCase()
        try { el[key] = true } catch (_) {}
        el.setAttribute(attrName, '')
      } else {
        // Map camelCase JSX prop names to lowercase HTML attribute names
        const attrName = PROP_ATTR_MAP[key] || key
        el.setAttribute(attrName, String(val))
      }
    }
  }

  // Append children
  appendChildren(el, children)

  return el
}

/**
 * JSX Fragment factory
 */
export function Fragment(props) {
  const fragment = document.createDocumentFragment()
  const children = props?.children || []
  appendChildren(fragment, Array.isArray(children) ? children : [children])
  return fragment
}

function appendChildren(parent, children) {
  const flat = children.flat(Infinity)
  for (const child of flat) {
    if (child === null || child === undefined || typeof child === 'boolean') {
      continue
    }
    if (child instanceof Node) {
      parent.appendChild(child)
    } else {
      parent.appendChild(document.createTextNode(String(child)))
    }
  }
}
