/**
 * @file jsx.ts
 * @description Zero-dependency native DOM JSX pragma.
 * Emits real DOM elements directly (no virtual DOM overhead, no string interpolation).
 */

import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { CSS_STRINGS } from '@/core/tokens/strings/css.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { sanitizeHtml } from '@/utils/data/sanitize.js'
import {
  SVG_NS,
  SVG_TAGS,
  BOOL_PROPS,
  DOM_PROPS,
  PROP_ATTR_MAP,
  JSX_PROPS,
} from '@/core/tokens/jsx.js'

/** Any child value `h()`/`Fragment` accept — nodes, scalars, nested arrays. */
export type JSXChildValue = unknown

/** Functional component tag — receives `{...props, children}` and returns a node. */
export type JSXComponent<P = Record<string, unknown>> = (
  _props: P & { children?: unknown[] }
) => Node | DocumentFragment | null

/**
 * The JSXTag value.
 */
export type JSXTag<P = Record<string, unknown>> = string | JSXComponent<P>

const PROP_ATTR_LOOKUP = PROP_ATTR_MAP as Readonly<Record<string, string>>

/**
 * JSX factory function — every `render()` in the app funnels through here.
 * Creates real DOM nodes directly (no VDOM, no diffing): the element is
 * built, props applied, children appended, and the live node returned.
 *
 * Prop routing, by key shape:
 *  - `onClick`/`onInput`/… (function) → `addEventListener(key[2:].toLowerCase(), fn)`
 *  - `className`/`class` → className (setAttribute for SVG, which lacks the prop)
 *  - `style` → cssText string, or object (camelCase props + `--*` custom props via setProperty)
 *  - `ref` (function) → called with the element after creation
 *  - `dangerouslySetInnerHTML={{__html}}` → sanitized innerHTML (DB HTML bodies)
 *  - `playsInline` → bare `playsinline` attribute (iOS Safari quirk)
 *  - boolean props (disabled/hidden/muted/…) → property + bare attribute
 *  - DOM props (value/checked/innerHTML/…) → property assignment + attribute mirror
 *  - everything else → `setAttribute(name, String(val))`
 * `null`/`undefined`/`false` props are skipped entirely (conditional attrs).
 */
export function h(
  tag: JSXTag,
  props: Record<string, unknown> | null,
  ...children: unknown[]
): HTMLElement | SVGElement | DocumentFragment {
  // Functional component — call it with merged props+children and return
  // whatever node it builds.
  if (typeof tag === TYPE_STRINGS.FUNCTION) {
    return (tag as JSXComponent)({ ...(props || {}), children: children.flat(Infinity) }) as
      HTMLElement | SVGElement | DocumentFragment
  }

  // SVG elements need the namespace form of createElement — `svg`, `path`,
  // `circle`, etc. are in SVG_TAGS; everything else is HTML.
  const tagName = tag as string

  const isSvg = SVG_TAGS.has(tagName)

  const el = isSvg ? document.createElementNS(SVG_NS, tagName) : document.createElement(tagName)

  // Apply props — each key is routed to an attribute, property, listener,
  // or special behavior per the table in the JSDoc above.
  if (props) {
    for (const [key, val] of Object.entries(props)) {
      if (val === null || val === undefined || val === false) continue

      if (key.startsWith(JSX_PROPS.ON_PREFIX) && typeof val === TYPE_STRINGS.FUNCTION) {
        const eventName = key.slice(2).toLowerCase()

        el.addEventListener(eventName, val as EventListener)
      } else if (key === JSX_PROPS.CLASS_NAME || key === JSX_PROPS.CLASS) {
        if (isSvg) {
          el.setAttribute(JSX_PROPS.CLASS, String(val))
        } else {
          ;(el as HTMLElement).className = String(val)
        }
      } else if (key === JSX_PROPS.STYLE) {
        if (typeof val === TYPE_STRINGS.STRING) {
          ;(el as HTMLElement).style.cssText = val as string
        } else if (typeof val === TYPE_STRINGS.OBJECT) {
          for (const [prop, value] of Object.entries(val as Record<string, string>)) {
            if (prop.startsWith(CSS_STRINGS.CSS_VAR_PREFIX)) {
              ;(el as HTMLElement).style.setProperty(prop, value)
            } else {
              ;((el as HTMLElement).style as unknown as Record<string, string>)[prop] = value
            }
          }
        }
      } else if (key === JSX_PROPS.REF && typeof val === TYPE_STRINGS.FUNCTION) {
        ;(val as (_el: HTMLElement | SVGElement) => void)(el)
      } else if (key === JSX_PROPS.DANGEROUSLY_SET_INNER_HTML) {
        // DB content may contain markup (<br>, <strong>) — sanitize before
        // injecting so stored content can't inject scripts.
        const html = (val as { __html?: unknown })?.__html

        el.innerHTML = html != null ? sanitizeHtml(String(html)) : ATTR_VALUES.EMPTY
      } else if (key === JSX_PROPS.PLAYS_INLINE) {
        el.setAttribute(JSX_PROPS.PLAYSINLINE_ATTR, CHAR_STRINGS.EMPTY)
      } else if (BOOL_PROPS.has(key.toLowerCase())) {
        const attrName = PROP_ATTR_LOOKUP[key] || key.toLowerCase()

        // Property form first (reflects into IDL); some exotic props throw,
        // so the attribute below is the reliable fallback either way.
        try {
          ;(el as unknown as Record<string, unknown>)[key] = true
        } catch {
          // boolean attr rejected — fall through to setAttribute below
        }

        el.setAttribute(attrName, CHAR_STRINGS.EMPTY)
      } else if (DOM_PROPS.has(key)) {
        ;(el as unknown as Record<string, unknown>)[key] = val

        el.setAttribute(key, String(val))
      } else {
        const attrName = PROP_ATTR_LOOKUP[key] || key

        el.setAttribute(attrName, String(val))
      }
    }
  }

  // Append children — flatten nested arrays, skip falsy, stringify scalars.
  appendChildren(el, children)

  return el
}

/**
 * JSX Fragment factory — groups children without a wrapper element.
 * Returns a DocumentFragment whose children move into the parent on append
 * (the fragment itself is empty afterwards, which is intended).
 */
export function Fragment(props?: { children?: unknown } | null): DocumentFragment {
  const fragment = document.createDocumentFragment()

  const children = props?.children || []

  appendChildren(fragment, Array.isArray(children) ? children : [children])

  return fragment
}

/**
 * Appends the `children` rest-args to `parent`. Handles arbitrarily nested
 * arrays (JSX `list.map(...)` expressions inside children), skips the JSX
 * conditional-render sentinels (`null`/`undefined`/`false`), and wraps
 * anything that isn't a Node in a text node.
 */
function appendChildren(parent: Node, children: readonly unknown[]): void {
  for (const child of children) {
    if (child === null || child === undefined || typeof child === TYPE_STRINGS.BOOLEAN) {
      continue
    }

    if (Array.isArray(child)) {
      appendChildren(parent, child)

      continue
    }

    if (child instanceof Node) {
      parent.appendChild(child)
    } else {
      parent.appendChild(document.createTextNode(String(child)))
    }
  }
}
