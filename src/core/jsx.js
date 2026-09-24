/**
 * @file jsx.js
 * @description Zero-dependency native DOM JSX pragma.
 * Emits real DOM elements directly (no virtual DOM overhead, no string interpolation).
 */

import { sanitizeHtml } from '../utils/sanitize.js'
import { STRINGS, ATTRS } from './constants.js'
import {
  SVG_NS,
  SVG_TAGS,
  BOOL_PROPS,
  PROP_ATTR_MAP,
  JSX_PROPS,
} from './tokens/jsx.js'

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

      if (key.startsWith(JSX_PROPS.ON_PREFIX) && typeof val === STRINGS.FUNCTION) {
        const eventName = key.slice(2).toLowerCase()

        el.addEventListener(eventName, val)
      } else if (key === JSX_PROPS.CLASS_NAME || key === JSX_PROPS.CLASS) {
        if (isSvg) {
          el.setAttribute(JSX_PROPS.CLASS, String(val))
        } else {
          el.className = String(val)
        }
      } else if (key === JSX_PROPS.STYLE) {
        if (typeof val === STRINGS.STRING) {
          el.style.cssText = val
        } else if (typeof val === STRINGS.OBJECT) {
          Object.assign(el.style, val)
        }
      } else if (key === JSX_PROPS.REF && typeof val === STRINGS.FUNCTION) {
        val(el)
      } else if (key === JSX_PROPS.DANGEROUSLY_SET_INNER_HTML) {
        el.innerHTML = val?.__html != null ? sanitizeHtml(String(val.__html)) : ATTRS.EMPTY
      } else if (key === JSX_PROPS.PLAYS_INLINE) {
        el.setAttribute(JSX_PROPS.PLAYSINLINE_ATTR, STRINGS.EMPTY)
      } else if (BOOL_PROPS.has(key.toLowerCase())) {
        const attrName = PROP_ATTR_MAP[key] || key.toLowerCase()

        try {
          el[key] = true
        } catch (_) {}

        el.setAttribute(attrName, STRINGS.EMPTY)
      } else {
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
    if (child === null || child === undefined || typeof child === STRINGS.BOOLEAN) {
      continue
    }

    if (child instanceof Node) {
      parent.appendChild(child)
    } else {
      parent.appendChild(document.createTextNode(String(child)))
    }
  }
}
