/**
 * @file playground/space/panel-render.tsx
 * @description Pure JSX renderers for the space-playground control panel,
 * extracted from SpacePlayground.tsx: one range/checkbox row and one
 * group action button. State comes in as params; the bound inputs carry
 * data-param/data-check attrs the component's delegated handlers read.
 */

import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { SP_CLASSES } from '@core/tokens/classes/playground.js'
import { CAROUSEL_CSS_PROPS } from '@core/tokens/css/carousel.js'
import { h } from '@core/jsx.js'
import { SP_INPUT_TYPES, type SpAction, type SpControl, type SpParamValue } from './controls.js'

/**
 * One control row. Checkboxes render a WebGL check canvas + SVG check icon;
 * ranges render a slider with the range-fill CSS var + a value readout.
 * `savedVal` (persisted user value) wins over the control's shipped default.
 */
export const renderSpControl = (
  ctrl: SpControl,
  t: Record<string, unknown>,
  savedVal: SpParamValue | undefined
) => {
  const labelText = (t[ctrl.label] as string | undefined) || ctrl.label

  if (ctrl.type === SP_INPUT_TYPES.CHECKBOX) {
    const isChecked = savedVal !== undefined ? Boolean(savedVal) : ctrl.checked

    return (
      <label className={`${SP_CLASSES.SP_ROW} ${SP_CLASSES.SP_ROW_CHECK}`}>
        <span className={SP_CLASSES.SP_ROW_LABEL}>{labelText}</span>
        <span className={SP_CLASSES.SP_CHECK_WRAPPER}>
          <input
            type={SP_INPUT_TYPES.CHECKBOX}
            className={SP_CLASSES.SP_CHECK_INPUT}
            data-param={ctrl.param}
            checked={isChecked}
          />
          <span className={SP_CLASSES.SP_CHECK_BOX}>
            <canvas className={SP_CLASSES.SP_CHECK_CANVAS} data-check={ctrl.param} />
            <svg
              className={SP_CLASSES.SP_CHECK_ICON}
              viewBox="0 0 16 16"
              aria-hidden={ATTR_VALUES.TRUE}
            >
              <polyline points="3 8 6.5 11.5 13 4" />
            </svg>
          </span>
        </span>
      </label>
    )
  }

  const val = savedVal !== undefined ? savedVal : ctrl.def

  const numVal = Number(val)

  const pct = Math.max(
    0,
    Math.min(100, ((numVal - (ctrl.min ?? 0)) / ((ctrl.max ?? 1) - (ctrl.min ?? 0))) * 100)
  )

  return (
    <label className={SP_CLASSES.SP_ROW}>
      <span className={SP_CLASSES.SP_ROW_LABEL}>{labelText}</span>
      <div className={SP_CLASSES.SP_ROW_CTRL}>
        <input
          type={SP_INPUT_TYPES.RANGE}
          className={SP_CLASSES.SP_RANGE}
          data-param={ctrl.param}
          min={String(ctrl.min)}
          max={String(ctrl.max)}
          step={String(ctrl.step)}
          value={String(val)}
          style={`${CAROUSEL_CSS_PROPS.RANGE_PCT}:${pct}%;`}
        />
        <span className={SP_CLASSES.SP_VAL}>{val}</span>
      </div>
    </label>
  )
}

/** One group-level action button (reset view / screenshot / copy settings). */
export const renderSpAction = (act: SpAction, t: Record<string, unknown>) => {
  const labelText = (t[act.label] as string | undefined) || act.label

  const props: Record<string, unknown> = {
    className: SP_CLASSES.SP_BTN,
    type: FORM_ATTRS.BUTTON,
    'data-action': act.action,
  }

  if (act.pressed !== undefined) {
    props[ARIA_ATTRS.ARIA_PRESSED] = ATTR_VALUES.TRUE
  }

  return (
    <div className={SP_CLASSES.SP_ACTION_WRAP}>
      <button {...props}>{labelText}</button>
    </div>
  )
}
