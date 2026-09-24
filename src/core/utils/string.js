import { ATTRS, STRINGS } from '../constants.js'

/**
 * Strips HTML tags iteratively to prevent malformed or nested tags from leaking.
 * Pure ESM utility function, tree-shakeable.
 * @param {string} str - Input HTML string
 * @returns {string} Stripped plain text
 */
export const stripHtml = (str) => {
  if (!str || typeof str !== STRINGS.STRING) return ATTRS.EMPTY

  let prev

  let curr = str

  do {
    prev = curr

    curr = curr.replace(/<[^>]*>/g, ATTRS.EMPTY)
  } while (curr !== prev)

  return curr
}

/**
 * Converts a string into a clean, URL-safe and DOM-id-safe slug.
 * @param {string} text - Raw string
 * @returns {string} Slugified string
 */
export const slugify = (text) => {
  if (!text || typeof text !== STRINGS.STRING) return ATTRS.EMPTY

  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ATTRS.EMPTY)
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/--+/g, '-')
}

/**
 * Capitalizes the first character of a string.
 * @param {string} str - Raw string
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str || typeof str !== STRINGS.STRING) return ATTRS.EMPTY

  return str.charAt(0).toUpperCase() + str.slice(1)
}
