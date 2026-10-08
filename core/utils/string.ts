/**
 * @file utils/string.ts
 * @description Small pure string transforms — HTML stripping for
 * plain-text contexts (schema.org, meta descriptions, aria labels) and
 * slug/case helpers for id generation.
 */
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

/**
 * Strips HTML tags iteratively to prevent malformed or nested tags from leaking.
 * A single `replace(/<[^>]*>/)` pass can leave a reconstructed tag behind
 * (input like `<scr<script>ipt>` collapses into `<script>`), so the loop
 * re-runs until the string is stable — this is the classic "iterated
 * sanitization" defense: each pass may expose a tag assembled from
 * fragments of the previous pass.
 * Pure ESM utility function, tree-shakeable.
 * @param str Raw markup-bearing text.
 * @returns Text with every `<…>` span removed.
 */
export const stripHtml = (str: string): string => {
  if (!str || typeof str !== TYPE_STRINGS.STRING) return ATTR_VALUES.EMPTY

  let prev: string

  let curr = str

  do {
    prev = curr

    curr = curr.replace(/<[^>]*>/g, ATTR_VALUES.EMPTY)
  } while (curr !== prev)

  return curr
}

/**
 * Escapes HTML-significant characters for safe insertion into innerHTML or
 * double-quoted attributes. `&` must be replaced first so the entities
 * emitted by the later replacements are not double-escaped.
 * Pure ESM utility function, tree-shakeable.
 * @param {string} str — raw text that may contain &, <, >, ", '
 * @returns {string} entity-escaped text safe for markup contexts
 */
export const escapeHtml = (str: string): string => {
  if (!str || typeof str !== TYPE_STRINGS.STRING) return ATTR_VALUES.EMPTY

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Converts a string into a clean, URL-safe and DOM-id-safe slug.
 * Pipeline: lowercase → drop non-word/non-space/non-dash chars → collapse
 * whitespace+underscores to `-` → collapse consecutive dashes. e.g.
 * "METCHA — Leather!" → "metcha-leather". `\w` is ASCII-only
 * ([a-z0-9_]) — accented characters are dropped, which intentionally
 * mirrors the ASCII-folded LANG_SLUGS convention for URL safety.
 * @param text Display text to slug.
 * @returns URL/id-safe slug, or '' for non-string input.
 */
export const slugify = (text: string): string => {
  if (!text || typeof text !== TYPE_STRINGS.STRING) return ATTR_VALUES.EMPTY

  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ATTR_VALUES.EMPTY)
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/--+/g, '-')
}
