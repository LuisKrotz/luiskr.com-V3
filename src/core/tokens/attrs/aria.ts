/**
 * @file tokens/attrs/aria.js
 * @description ARIA attribute + role-value tokens — token group.
 */

import { _K_DIALOG } from '../base.js'

/**
 * The ARIA_ATTRS constant.
 */
export const ARIA_ATTRS = Object.freeze({
  ARIA_LABEL: 'aria-label',
  ARIA_EXPANDED: 'aria-expanded',
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
  TABINDEX: 'tabindex',
})
