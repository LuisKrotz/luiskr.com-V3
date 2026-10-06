/**
 * @file tokens/attrs/common.js
 * @description Generic DOM attribute tokens — token group.
 */

import { _K_STYLE } from '../base.js'

/**
 * The COMMON_ATTRS constant.
 */
export const COMMON_ATTRS = Object.freeze({
  CLASS: 'class',
  CLASS_NAME: 'className',
  ID: 'id',
  STYLE: _K_STYLE,
  LANG: 'lang',
  DEFAULT_LANG: 'en',
  OPEN: 'open',
  HIDDEN: 'hidden',
  VISIBLE: 'visible',
  PROP: 'prop',
  SECTION: 'section',
  PX: 'px',
  DELAY: 'delay',
  OFFSET: 'offset',
  CLASSES: 'classes',
  TRIGGER: 'trigger',
  TRIGGER_VIEWPORT: 'viewport',
  TOUCH: 'touch',
  POINTER: 'pointer',
  FIT: 'fit',
})
