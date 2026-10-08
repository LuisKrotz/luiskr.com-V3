/**
 * @file tokens/attrs/common.js
 * @description Generic DOM attribute + attribute-value tokens — the
 * cross-cutting set shared by every component: the `class`/`id`/`style`
 * attribute names, visibility/positioning values, input-method labels, and
 * the language defaults. Domain-specific groups live in sibling files
 * (aria.ts, data.ts, form.ts, …); only tokens used across multiple
 * surfaces belong here.
 */

import { _K_STYLE } from '../base.js'

/**
 * Frozen common attribute-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const COMMON_ATTRS = Object.freeze({
  /** `class` attribute name — used where setAttribute targets classes (SVG, foreign contexts). */
  CLASS: 'class',
  /** `className` IDL property name — for property-style assignment in the JSX pragma. */
  CLASS_NAME: 'className',
  /** `id` attribute name. */
  ID: 'id',
  /** `style` attribute name — shared via _K_STYLE so the literal is declared once. */
  STYLE: _K_STYLE,
  /** `lang` attribute — set on <html> when the locale changes (a11y/SEO contract). */
  LANG: 'lang',
  /** Default language code — English is the canonical un-prefixed locale. */
  DEFAULT_LANG: 'en',
  /** `open` attribute — also the ShadowRoot mode value ('open' shadow roots stay inspectable). */
  OPEN: 'open',
  /** `hidden` attribute/value — used for both the attribute and visibility checks. */
  HIDDEN: 'hidden',
  /** `visible` marker value — counterpart to HIDDEN in visibility state comparisons. */
  VISIBLE: 'visible',
  /** `prop` — generic prop identifier used by CMS editor field bindings. */
  PROP: 'prop',
  /** `section` — element/attribute name for landmark sections. */
  SECTION: 'section',
  /** `px` — the CSS pixel unit suffix for numeric style assignments. */
  PX: 'px',
  /** `delay` — animation/transition delay field name in option objects. */
  DELAY: 'delay',
  /** `offset` — geometry offset field name. */
  OFFSET: 'offset',
  /** `classes` — option-bag field carrying a class list. */
  CLASSES: 'classes',
  /** `trigger` — DrawText trigger attribute name (viewport/manual). */
  TRIGGER: 'trigger',
  /**
   * `ordered` — DrawText queue flag: marks the element as part of the
   * document-order reveal session, so its `offset` is read as a scheduled
   * start on the shared clock instead of a delay after its own trigger.
   */
  ORDERED: 'ordered',
  /** `viewport` trigger value — DrawText plays when scrolled into view. */
  TRIGGER_VIEWPORT: 'viewport',
  /** `touch` input-method value — primary-input is coarse (see store/state.ts probe). */
  TOUCH: 'touch',
  /** `pointer` input-method value — fine pointer (mouse/trackpad) primary input. */
  POINTER: 'pointer',
  /** `fit` — sizing/fit field name used by media layout contracts. */
  FIT: 'fit',
})
