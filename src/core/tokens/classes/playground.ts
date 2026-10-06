/**
 * @file tokens/classes/playground.js
 * @description Earth/Space playground class tokens (`sp-*` block) —
 * token group.
 */

import { _B_SP, _B_SPP, _B_SPP_CHECK, _B_SPP_RANGE, _B_SPP_ROW, _B_SPP_SWITCH } from '../base.js'

/**
 * The SP_CLASSES constant.
 */
export const SP_CLASSES = Object.freeze({
  // ── Loader overlay ────────────────────────────────────────────────────────
  SP_LOADER: `${_B_SP}-loader`,
  SP_LOADER_GLOW: `${_B_SP}-loader-glow`,
  SP_LOADER_GRID: `${_B_SP}-loader-grid`,
  SP_LOADER_CONTENT: `${_B_SP}-loader-content`,
  SP_LOADER_SPINNER_OUTER: `${_B_SP}-loader-spinner-outer`,
  SP_LOADER_SPINNER_INNER: `${_B_SP}-loader-spinner-inner`,
  SP_LOADER_COUNTER: `${_B_SP}-loader-counter`,
  SP_LOADER_PERCENT: `${_B_SP}-loader-percent`,
  SP_LOADER_VAL: `${_B_SP}-loader-val`,
  SP_LOADER_SYM: `${_B_SP}-loader-sym`,
  SP_LOADER_TITLE: `${_B_SP}-loader-title`,
  SP_LOADER_MSG: `${_B_SP}-loader-msg`,
  SP_LOADER_BAR: `${_B_SP}-loader-bar`,
  SP_LOADER_BAR_FILL: `${_B_SP}-loader-bar-fill`,

  // ── Panel chrome ─────────────────────────────────────────────────────────
  SP_CONTROLS_WRAP: `${_B_SP}-controls-wrap`,
  SP_REOPEN: `${_B_SP}-reopen`,
  SP_PANEL: _B_SPP,
  SP_PANEL_HEADER: `${_B_SPP}-header`,
  SP_PANEL_TITLE: `${_B_SPP}-title`,
  SP_PANEL_TOGGLE: `${_B_SPP}-toggle`,
  SP_PANEL_BODY: `${_B_SPP}-body`,
  SP_PANEL_COLLAPSED: `${_B_SPP}--collapsed`,
  SP_CANVAS: `${_B_SP}-canvas`,

  // ── Collapsible groups ────────────────────────────────────────────────────
  SP_GROUP: `${_B_SPP}-group`,
  SP_GROUP_COLLAPSED: `${_B_SPP}-group--collapsed`,
  SP_GROUP_HEADER: `${_B_SPP}-group-header`,
  SP_GROUP_CHEVRON: `${_B_SPP}-group-chevron`,
  SP_GROUP_LABEL: `${_B_SPP}-group-label`,
  SP_GROUP_CONTENT: `${_B_SPP}-group-content`,

  // ── Position/target readouts ──────────────────────────────────────────────
  SP_READOUT: `${_B_SPP}-readout`,
  SP_POS: `${_B_SPP}-pos`,
  SP_TGT: `${_B_SPP}-tgt`,

  // ── Control rows (sliders / checkboxes / actions) ────────────────────────
  SP_ROW: _B_SPP_ROW,
  SP_ROW_CHECK: `${_B_SPP_ROW}--check`,
  SP_ROW_LABEL: `${_B_SPP_ROW}-label`,
  SP_ROW_CTRL: `${_B_SPP_ROW}-ctrl`,
  SP_RANGE: _B_SPP_RANGE,
  SP_RANGE_WRAPPER: `${_B_SPP_RANGE}-wrapper`,
  SP_RANGE_CANVAS: `${_B_SPP_RANGE}-canvas`,
  SP_CHECK_WRAPPER: `${_B_SPP_CHECK}-wrapper`,
  SP_CHECK_CANVAS: `${_B_SPP_CHECK}-canvas`,
  SP_CHECK_BOX: `${_B_SPP_CHECK}-box`,
  SP_CHECK_INPUT: `${_B_SPP_CHECK}-input`,
  SP_CHECK_ICON: `${_B_SPP_CHECK}-icon`,
  SP_ACTION_WRAP: `${_B_SPP}-action-wrap`,
  SP_BTN: `${_B_SPP}-btn`,
  SP_SWITCH: _B_SPP_SWITCH,
  SP_SWITCH_TRACK: `${_B_SPP_SWITCH}-track`,
  SP_VAL: `${_B_SPP}-val`,

  // ── Music player ─────────────────────────────────────────────────────────
  SP_MUSIC: `${_B_SP}-music`,
  SP_AUDIO: `${_B_SP}-audio`,
})
