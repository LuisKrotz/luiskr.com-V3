/**
 * @file tokens/strings/vendor.js
 * @description Vendor fingerprint + platform string tokens — grouped subset
 * of STRINGS.
 */

/**
 * Vendor fingerprint + platform string tokens. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const VENDOR_STRINGS = Object.freeze({
  APPLE_VENDOR: 'Apple Computer, Inc.',
  GESTURE_EVENT: 'GestureEvent',
  ANONYMOUS: 'anonymous',
  OTHER: 'other',
})
