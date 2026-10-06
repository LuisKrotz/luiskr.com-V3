/**
 * @file sanitize.js
 * Lightweight HTML sanitization utility — no external dependencies.
 *
 * Uses DOMParser to parse the HTML string in a sandboxed document, then
 * walks the resulting tree and strips any elements or attributes that are
 * not in the explicit allowlist. This prevents XSS from CMS / i18n content
 * that intentionally contains safe inline markup (<em>, <strong>, <br>, etc.).
 *
 * Usage:
 *   import { sanitizeHtml } from './sanitize.js'
 *   element.innerHTML = sanitizeHtml(untrustedString)
 */
import { LINK_ATTRS } from '@/core/tokens/attrs/link.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { DOM_STRINGS } from '@/core/tokens/strings/dom.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'

/** Elements whose tag name is allowed to remain in the output */
const ALLOWED_TAGS = new Set([
  'b',
  'strong',
  'i',
  'em',
  'u',
  'mark',
  's',
  'del',
  'br',
  'wbr',
  'span',
  'p',
  'a',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'abbr',
  'cite',
  'code',
  'kbd',
  'q',
  'sup',
  'sub',
  'time',
])

/** Attributes that are safe when applied to allowed tags */
const ALLOWED_ATTRS = new Set([
  'href',
  'title',
  'target',
  'rel',
  'class',
  'id',
  'aria-label',
  'aria-hidden',
  'role',
  'datetime',
  'cite',
])

/**
 * Sanitize an HTML string, preserving allowed tags and attributes only.
 *
 * @param {string} html - Raw HTML string (possibly from CMS / i18n store).
 * @returns {string} Safe HTML string ready for use in innerHTML.
 */

export const sanitizeHtml = (html: string): string => {
  if (typeof html !== TYPE_STRINGS.STRING) return ATTR_VALUES.EMPTY
  if (!html.trim()) return ATTR_VALUES.EMPTY

  // SSR / worker environments: fall back to plain-text stripping
  if (typeof document === TYPE_STRINGS.UNDEFINED || typeof DOMParser === TYPE_STRINGS.UNDEFINED) {
    return html.replace(/<[^>]*>/g, ATTR_VALUES.EMPTY)
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(`<body>${html}</body>`, 'text/html')

  sanitizeNode(doc.body)

  return doc.body.innerHTML
}

/**
 * Recursively walk a DOM node, removing disallowed elements and attributes.
 * Disallowed elements are replaced with their text content.
 *
 * @param node - DOM node to scrub in place
 */
function sanitizeNode(node: Node): void {
  const children = Array.from(node.childNodes)

  for (const child of children) {
    if (child.nodeType === Node.TEXT_NODE) continue

    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as Element

      const tag = el.tagName.toLowerCase()

      if (!ALLOWED_TAGS.has(tag)) {
        // Replace disallowed element with its text content
        const text = document.createTextNode(el.textContent || ATTR_VALUES.EMPTY)

        node.replaceChild(text, child)

        continue
      }

      // Strip disallowed attributes on allowed elements
      const attrNames = Array.from(el.attributes).map((a) => a.name)

      for (const attr of attrNames) {
        if (!ALLOWED_ATTRS.has(attr)) {
          el.removeAttribute(attr)
        }
      }

      // Force external links to open safely
      if (tag === 'a') {
        const href = el.getAttribute('href') || ATTR_VALUES.EMPTY

        if (href.startsWith('http') || href.startsWith('//')) {
          el.setAttribute(LINK_ATTRS.TARGET, DOM_STRINGS.BLANK)

          el.setAttribute(LINK_ATTRS.REL, DOM_STRINGS.NOOPENER)
        }

        // Strip javascript: and data: URIs
        if (/^(javascript|data|vbscript):/i.test(href)) {
          el.removeAttribute('href')
        }
      }

      // Recurse into allowed children
      sanitizeNode(el)
    } else {
      // Remove comments, processing instructions, etc.
      node.removeChild(child)
    }
  }
}
