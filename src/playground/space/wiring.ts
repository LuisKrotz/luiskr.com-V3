/**
 * @file space/wiring.ts
 * @description Control wiring for SpacePlayground — panel event binding,
 * slider/checkbox input handling with PARAM_HANDLERS dispatch, action
 * buttons (screenshot, reset, music), the position/target readout loop,
 * panel sync, and CheckboxWebGL mount/teardown.
 */

import { ARIA_ATTRS } from '@/core/tokens/attrs/aria.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { DATA_ATTRS } from '@/core/tokens/attrs/data.js'
import { SP_CLASSES } from '@/core/tokens/classes/playground.js'
import { CAROUSEL_CSS_PROPS } from '@/core/tokens/css/carousel.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { FOCUS_EVENTS, FORM_EVENTS, MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import { SP_ACTIONS } from '@/core/tokens/playground/actions.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { CheckboxWebGL } from './checkbox-webgl.js'
import {
  PARAM_HANDLERS,
  SLIDER_GROUPS,
  SP_INPUT_TYPES,
  saveSpaceSettings,
  type SpParamValue,
} from './controls.js'
import type { SpacePlayground } from '../SpacePlayground.js'
import { PREF_STORAGE_KEYS } from '@/core/tokens/data/storage.js'

/** Synchronizes one group's collapsed class, accessibility state, and focusability. */
function setGroupCollapsed(group: Element, collapsed: boolean): void {
  group.classList.toggle(SP_CLASSES.SP_GROUP_COLLAPSED, collapsed)

  const header = group.querySelector(`.${SP_CLASSES.SP_GROUP_HEADER}`)
  const content = group.querySelector(`.${SP_CLASSES.SP_GROUP_CONTENT}`) as HTMLElement | null

  header?.setAttribute(ARIA_ATTRS.ARIA_EXPANDED, collapsed ? ATTR_VALUES.FALSE : ATTR_VALUES.TRUE)

  if (content) content.inert = collapsed
}

/**
 * Binds space controls.
 * @param c — the component
 */
export function bindSpaceControls(c: SpacePlayground): void {
  // Delegated click listener on shadowRoot
  c.addScopedListener(c.shadowRoot, MOUSE_EVENTS.CLICK, (e) => {
    const target = e.target as HTMLElement

    // Panel toggle button
    if (target.closest(`.${SP_CLASSES.SP_PANEL_TOGGLE}`)) {
      c._panelOpen = !c._panelOpen

      c._syncPanel()

      return
    }

    // Reopen button
    if (target.closest(`.${SP_CLASSES.SP_REOPEN}`)) {
      c._panelOpen = true

      c._syncPanel()

      return
    }

    // Collapsible group headers
    const header = target.closest(`.${SP_CLASSES.SP_GROUP_HEADER}`)

    if (header) {
      const group = header.closest(`.${SP_CLASSES.SP_GROUP}`)

      if (group) {
        c._keyboardExpandedGroups.delete(group)
        setGroupCollapsed(group, !group.classList.contains(SP_CLASSES.SP_GROUP_COLLAPSED))
      }

      return
    }

    // Action buttons (reset, screenshot, copy-constants)
    const btn = target.closest(`[${DATA_ATTRS.DATA_ACTION}]`)

    if (!btn) return

    const action = btn.getAttribute(DATA_ATTRS.DATA_ACTION)

    c._handleAction(action, btn)
  })

  // Keyboard traversal opens a collapsed group when its header receives
  // focus, keeps it open while focus moves through its controls, and restores
  // the collapsed state once focus leaves the whole group.
  c.addScopedListener(c.shadowRoot, FOCUS_EVENTS.FOCUSIN, (e) => {
    const target = e.target as Element | null
    const group = target?.closest?.(`.${SP_CLASSES.SP_GROUP}`)

    if (!group || !group.classList.contains(SP_CLASSES.SP_GROUP_COLLAPSED)) return

    c._keyboardExpandedGroups.add(group)
    setGroupCollapsed(group, false)
  })

  c.addScopedListener(c.shadowRoot, FOCUS_EVENTS.FOCUSOUT, (e) => {
    const target = e.target as Element | null
    const group = target?.closest?.(`.${SP_CLASSES.SP_GROUP}`)

    if (!group || !c._keyboardExpandedGroups.has(group)) return

    const next = (e as FocusEvent).relatedTarget as Node | null

    if (next && group.contains(next)) return

    c._keyboardExpandedGroups.delete(group)
    setGroupCollapsed(group, true)
  })

  // Sliders (input event)
  c.addScopedListener(c.shadowRoot, FORM_EVENTS.INPUT, (e) => {
    const input = e.target as HTMLInputElement | null

    if (!input?.matches(`[${DATA_ATTRS.DATA_PARAM}]`)) return

    c._handleInput(input)
  })

  // Checkboxes (change event)
  c.addScopedListener(c.shadowRoot, FORM_EVENTS.CHANGE, (e) => {
    const input = e.target as HTMLInputElement | null

    if (!input?.matches(`[${DATA_ATTRS.DATA_PARAM}]`)) return

    c._handleInput(input)
  })
}

/**
 * Starts space position loop.
 * @param c — the component
 */
export function startSpacePositionLoop(c: SpacePlayground): void {
  if (c._posRafId) cancelAnimationFrame(c._posRafId)

  const update = () => {
    c._posRafId = requestAnimationFrame(update)

    if (!c._earthBg) return

    const state = c._earthBg.getCameraState()

    if (!state) return

    const posEl = c.$(`.${SP_CLASSES.SP_POS}`)

    const tgtEl = c.$(`.${SP_CLASSES.SP_TGT}`)

    if (posEl)
      posEl.textContent = `X: ${state.position.x}   Y: ${state.position.y}   Z: ${state.position.z}`

    if (tgtEl)
      tgtEl.textContent = `X: ${state.target.x}   Y: ${state.target.y}   Z: ${state.target.z}`
  }

  update()
}

/**
 * Handles space action.
 * @param c — the component
 * @param action — the value
 * @param btn — the value
 */
export function handleSpaceAction(c: SpacePlayground, action: string | null, btn: Element): void {
  if (action === SP_ACTIONS.PANEL_OPEN) {
    c._panelOpen = true

    c._syncPanel()

    return
  }

  if (!c._earthBg) return

  if (action === SP_ACTIONS.RESET) {
    c._earthBg.resetView()

    c._savedSettings = {}

    try {
      localStorage.removeItem(PREF_STORAGE_KEYS.SPACE_PLAYGROUND)
    } catch {
      // storage unavailable — reset still applies to the live session
    }

    // Reset DOM inputs
    SLIDER_GROUPS.forEach((grp) => {
      grp.controls.forEach((ctrl) => {
        const input = c.shadowRoot?.querySelector<HTMLInputElement>(
          `[${DATA_ATTRS.DATA_PARAM}="${ctrl.param}"]`
        )

        if (input) {
          if (ctrl.type === SP_INPUT_TYPES.CHECKBOX) {
            input.checked = Boolean(ctrl.checked)
          } else {
            input.value = String(ctrl.def)

            const min = Number(input.min)

            const max = Number(input.max)

            const pct = Math.max(0, Math.min(100, ((Number(ctrl.def) - min) / (max - min)) * 100))

            input.style.setProperty(CAROUSEL_CSS_PROPS.RANGE_PCT, `${pct}%`)

            const valEl = input
              .closest(`.${SP_CLASSES.SP_ROW}`)
              ?.querySelector(`.${SP_CLASSES.SP_VAL}`)

            if (valEl) valEl.textContent = String(ctrl.def)
          }
        }
      })
    })
  } else if (action === SP_ACTIONS.TOGGLE_ROTATE) {
    const s = c._earthBg.settings as { controls?: { autoRotate: boolean } }

    if (s?.controls) {
      c._earthBg.updateCamera({ autoRotate: !s.controls.autoRotate })

      btn.setAttribute(ARIA_ATTRS.ARIA_PRESSED, String(s.controls?.autoRotate))
    }
  } else if (action === SP_ACTIONS.SCREENSHOT) {
    c._earthBg.takeScreenshot()
  } else if (action === SP_ACTIONS.COPY_CONSTANTS) {
    const json = JSON.stringify({ GUI: c._earthBg.settings }, null, 4)

    navigator.clipboard?.writeText(json)
  }
}

/**
 * Handles space input.
 * @param c — the component
 * @param input — the value
 */
export function handleSpaceInput(c: SpacePlayground, input: HTMLInputElement): void {
  if (!c._earthBg) return

  const param = input.getAttribute(DATA_ATTRS.DATA_PARAM)

  if (!param) return

  const isCheckbox = input.type === SP_INPUT_TYPES.CHECKBOX

  const val = isCheckbox ? input.checked : Number(input.value)

  if (!isCheckbox) {
    const min = Number(input.min)

    const max = Number(input.max)

    // Fill % mirrors _applyPersistedSettings — keeps thumb/label/fill
    // in sync at every entry point (load, reset, live drag).
    const pct = Math.max(0, Math.min(100, ((Number(val) - min) / (max - min)) * 100))

    input.style.setProperty(CAROUSEL_CSS_PROPS.RANGE_PCT, `${pct}%`)

    const row = input.closest(`.${SP_CLASSES.SP_ROW}`)

    const valEl = row?.querySelector(`.${SP_CLASSES.SP_VAL}`)

    if (valEl) valEl.textContent = String(val)
  }

  if (isCheckbox && c._checkboxes?.[param]) {
    c._checkboxes[param].setChecked(Boolean(val))
  }

  const handler = PARAM_HANDLERS[param]

  if (handler) handler(c._earthBg, val)

  c._persistParam(param, val)
}

/**
 * persists space param.
 * @param c — the component
 * @param param — the value
 * @param val — the value
 */
export function persistSpaceParam(c: SpacePlayground, param: string, val: SpParamValue): void {
  c._savedSettings[param] = val

  saveSpaceSettings(c._savedSettings)
}

/**
 * Syncs space panel.
 * @param c — the component
 */
export function syncSpacePanel(c: SpacePlayground): void {
  const panel = c.$(`.${SP_CLASSES.SP_PANEL}`)

  if (panel) {
    panel.classList.toggle(`${SP_CLASSES.SP_PANEL_COLLAPSED}`, !c._panelOpen)
  }

  const reopenBtn = c.$(`.${SP_CLASSES.SP_REOPEN}`)

  if (reopenBtn) {
    reopenBtn.style.display = c._panelOpen ? 'none' : 'flex'
  }
}

/**
 * Mounts space checkbox canvases.
 * @param c — the component
 */
export function mountSpaceCheckboxCanvases(c: SpacePlayground): void {
  if (typeof window === TYPE_STRINGS.UNDEFINED) return

  if (!c._checkboxes) c._checkboxes = {}

  const canvases = c.$$<HTMLCanvasElement>(`.${SP_CLASSES.SP_CHECK_CANVAS}`)

  canvases.forEach((canvas) => {
    const param = canvas.getAttribute(DATA_ATTRS.DATA_CHECK)

    if (!param) return

    const input = c.$<HTMLInputElement>(`${HTML_TAGS.INPUT}[${DATA_ATTRS.DATA_PARAM}="${param}"]`)

    const isChecked = input ? input.checked : false

    const existing = c._checkboxes[param]

    if (existing && existing.canvas !== canvas) {
      existing.destroy()

      delete c._checkboxes[param]
    }

    if (!c._checkboxes[param]) {
      c._checkboxes[param] = new CheckboxWebGL(canvas, isChecked)
    } else {
      c._checkboxes[param].setChecked(isChecked)
    }
  })
}

/**
 * The destroySpaceCheckboxCanvases value.
 * @param c — the component
 */
export function destroySpaceCheckboxCanvases(c: SpacePlayground): void {
  if (c._checkboxes) {
    Object.values(c._checkboxes).forEach((cb) => cb?.destroy())

    c._checkboxes = {}
  }
}
