/**
 * @file tokens/attrs/form.js
 * @description Form control attribute tokens — token group. Covers the
 * `type` attribute name plus its value vocabulary (button/checkbox/range/
 * text) and the `name`/`value`/`label` fields consumed by the preferences
 * panel, CMS editors, and playground controls.
 */

export const FORM_ATTRS = Object.freeze({
  /** `type` — the input/button type attribute name itself. */
  TYPE: 'type',
  /** `type="button"` — prevents implicit submit inside <form> ancestors. */
  TYPE_BUTTON: 'button',
  /** `button` element/role token — shared by tag and role contexts. */
  BUTTON: 'button',
  /** `type="text"` — plain text input. */
  TEXT: 'text',
  /** `type="checkbox"` — boolean toggles in preferences/CMS rows. */
  CHECKBOX: 'checkbox',
  /** `type="range"` — slider inputs (playground params, volume). */
  RANGE: 'range',
  /** `name` — field name attribute. */
  NAME: 'name',
  /** `value` — field value attribute. */
  VALUE: 'value',
  /** `label` — label field/attribute name. */
  LABEL: 'label',
})
