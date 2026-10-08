/**
 * @file tokens/classes/router.js
 * @description Router active-link class tokens — token group.
 */

import { _K_ROUTER_LINK_EXACT_ACTIVE } from '../base.js'

/**
 * Frozen router class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const ROUTER_CLASSES = Object.freeze({
  ROUTER_LINK_ACTIVE: 'router-link-active',
  ROUTER_LINK_EXACT_ACTIVE: _K_ROUTER_LINK_EXACT_ACTIVE,
})
