/**
 * @file jsx.js
 * @description Zero-dependency native DOM JSX pragma.
 * Emits real DOM elements directly (no virtual DOM overhead, no string interpolation).
 */

import { sanitizeHtml } from '../utils/sanitize.js'

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

/**
 * JSX factory function.
 * @param {string|Function} tag - Element tag name or Component function
 * @param {Object} [props] - Element attributes / event handlers
 * @param  {...any} children - Child nodes or primitives
 * @returns {HTMLElement|SVGElement|DocumentFragment}
 */
export function h(tag, props, ...children) {
  // Functional component
  if (typeof tag === 'function') {
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

      if (key.startsWith('on') && typeof val === 'function') {
        const eventName = key.slice(2).toLowerCase()
        el.addEventListener(eventName, val)
      } else if (key === 'className' || key === 'class') {
        if (isSvg) {
          el.setAttribute('class', String(val))
        } else {
          el.className = String(val)
        }
      } else if (key === 'style') {
        if (typeof val === 'string') {
          el.style.cssText = val
        } else if (typeof val === 'object') {
          Object.assign(el.style, val)
        }
      } else if (key === 'ref' && typeof val === 'function') {
        val(el)
      } else if (key === 'dangerouslySetInnerHTML') {
        el.innerHTML = val?.__html != null ? sanitizeHtml(String(val.__html)) : ''
      } else {
        el.setAttribute(key, String(val))
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
