/**
 * @file utils/string.ts
 * @description Small pure string transforms — HTML stripping for
 * plain-text contexts (schema.org, meta descriptions, aria labels) and
 * slug/case helpers for id generation.
 */
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'

/**
 * Strips HTML tags iteratively to prevent malformed or nested tags from leaking.
 * A single `replace(/<[^>]*>/)` pass can leave a reconstructed tag behind
 * (input like `<scr<script>ipt>` collapses into `<script>`), so the loop
 * re-runs until the string is stable.
 * Pure ESM utility function, tree-shakeable.
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
 * Converts a string into a clean, URL-safe and DOM-id-safe slug.
 * Pipeline: lowercase → drop non-word/non-space/non-dash chars → collapse
 * whitespace+underscores to `-` → collapse consecutive dashes. e.g.
 * "METCHA — Leather!" → "metcha-leather".
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
