/**
 * @file tokens/attrs/aria.js
 * @description ARIA attribute + role-value tokens — token group.
 */

import { _K_DIALOG } from '../base.js'

/**
 * Frozen aria attribute-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const ARIA_ATTRS = Object.freeze({
  ARIA_LABEL: 'aria-label',
  ARIA_EXPANDED: 'aria-expanded',
  ARIA_CONTROLS: 'aria-controls',
  ARIA_LABELLEDBY: 'aria-labelledby',
  ARIA_MODAL: 'aria-modal',
  ARIA_HIDDEN: 'aria-hidden',
  ARIA_LIVE: 'aria-live',
  ARIA_PRESSED: 'aria-pressed',
  ARIA_CHECKED: 'aria-checked',
  POLITE: 'polite',
  ROLE: 'role',
  ROLE_DIALOG: _K_DIALOG,
  ROLE_GROUP: 'group',
  ROLE_SWITCH: 'switch',
  ROLE_BUTTON: 'button',
  ROLE_NAVIGATION: 'navigation',
  ROLE_ALERT: 'alert',
  ROLE_STATUS: 'status',
  /** `tree`/`treeitem`/`none` — the ARIA treeview contract for the docs nav. */
  ROLE_TREE: 'tree',
  ROLE_TREEITEM: 'treeitem',
  ROLE_NONE: 'none',
  TABINDEX: 'tabindex',
})
