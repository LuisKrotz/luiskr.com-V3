/**
 * @file tokens/strings/types.js
 * @description `typeof` result string tokens — token group.
 */

/**
 * `typeof` result string tokens. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const TYPE_STRINGS = Object.freeze({
  UNDEFINED: 'undefined',
  FUNCTION: 'function',
  OBJECT: 'object',
  STRING: 'string',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
} as const)
