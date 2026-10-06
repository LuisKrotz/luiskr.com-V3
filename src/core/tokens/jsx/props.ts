/**
 * @file tokens/jsx/props.js
 * @description JSX prop-application dictionaries — boolean-attribute set,
 * camelCase→lowercase attribute map, DOM-property set, and the special prop
 * names `h()` handles before the generic setAttribute fallback.
 */

/**
 * Boolean attributes — presence means `true`, absence means `false`
 * (`muted`, `disabled`, `hidden`, `checked`, …). `h()` maps
 * `prop={true}` → bare attribute + property assignment.
 */
export const BOOL_PROPS = Object.freeze(
  new Set([
    'muted',
    'loop',
    'controls',
    'autoplay',
    'disabled',
    'checked',
    'readonly',
    'required',
    'multiple',
    'selected',
    'default',
    'hidden',
    'novalidate',
    'reversed',
    'autofocus',
    'inert',
    'open',
  ])
)

/**
 * camelCase JSX prop → lowercase HTML attribute spelling. The DOM accepts
 * only the lowercase form (`playsinline`, `readonly`, `tabindex`, `for`).
 */
export const PROP_ATTR_MAP = Object.freeze({
  playsInline: 'playsinline',
  autoPlay: 'autoplay',
  readOnly: 'readonly',
  noValidate: 'novalidate',
  htmlFor: 'for',
  tabIndex: 'tabindex',
  crossOrigin: 'crossorigin',
})

/**
 * Properties that must be set via the DOM property (el[key] = val)
 * rather than el.setAttribute(key, val) so the browser reflects
 * the live state (e.g. slider thumb position, input text).
 */
export const DOM_PROPS = Object.freeze(new Set(['value', 'selectedIndex', 'innerHTML']))

/**
 * Special prop names handled by `h()` before the generic setAttribute
 * fallback — event prefix detection, ref callbacks, sanitized HTML
 * injection, and the iOS playsinline quirk.
 */
export const JSX_PROPS = Object.freeze({
  CLASS_NAME: 'className',
  CLASS: 'class',
  STYLE: 'style',
  REF: 'ref',
  DANGEROUSLY_SET_INNER_HTML: 'dangerouslySetInnerHTML',
  PLAYS_INLINE: 'playsInline',
  PLAYSINLINE_ATTR: 'playsinline',
  ON_PREFIX: 'on',
})
