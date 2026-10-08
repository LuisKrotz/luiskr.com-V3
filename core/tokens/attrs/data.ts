/**
 * @file tokens/attrs/data.js
 * @description `data-*` attribute tokens — token group. Every name is
 * composed from the shared `_DATA` prefix so the `data-` string itself is
 * declared exactly once (zero-hardcoding rule 9: compose, don't repeat).
 * These attributes carry per-element bookkeeping: list indices for
 * carousels/mosaics, CMS editor bindings, and the `data-content` marker
 * BaseComponent stamps on its shadow content wrapper.
 */

import { _DATA } from '../base.js'

/**
 * Frozen data attribute-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const DATA_ATTRS = Object.freeze({
  /** `data-index` — generic positional index (lists, slides). */
  DATA_INDEX: `${_DATA}index`,
  /** `data-lang` — locale marker stamped by language UI rows. */
  DATA_LANG: `${_DATA}lang`,
  /** `data-flag` — marks flag-canvas nodes inside language rows. */
  DATA_FLAG: `${_DATA}flag`,
  /** `data-switch` — marks toggle-switch rows in preferences. */
  DATA_SWITCH: `${_DATA}switch`,
  /** `data-tab` — tab identifier for tabbed surfaces (CMS panels). */
  DATA_TAB: `${_DATA}tab`,
  /** `data-idx` — compact index variant used where `index` would collide. */
  DATA_IDX: `${_DATA}idx`,
  /** `data-sec` — section index for nav/scroll bookkeeping. */
  DATA_SEC: `${_DATA}sec`,
  /** `data-tidx` — tab index variant for nested tab groups. */
  DATA_TIDX: `${_DATA}tidx`,
  /** `data-col` — column index for grid/mosaic cell bookkeeping. */
  DATA_COL: `${_DATA}col`,
  /** `data-midx` — media index inside a figure's media list. */
  DATA_MIDX: `${_DATA}midx`,
  /** `data-size` — size variant marker on sized media items. */
  DATA_SIZE: `${_DATA}size`,
  /** `data-action` — action name bound by CMS/editor buttons. */
  DATA_ACTION: `${_DATA}action`,
  /** `data-field` — field binding name in CMS editor inputs. */
  DATA_FIELD: `${_DATA}field`,
  /** `data-dim-idx` — dimension index for multi-size media entries. */
  DATA_DIM_IDX: `${_DATA}dim-idx`,
  /** `data-prop` — property binding name in CMS property editors. */
  DATA_PROP: `${_DATA}prop`,
  /** `data-theme` — theme value marker on theme picker buttons. */
  DATA_THEME: `${_DATA}theme`,
  /** `data-content` — marker stamped on BaseComponent's persistent shadow content wrapper; reused to find the wrapper across re-mounts. */
  DATA_CONTENT: `${_DATA}content`,
  /** `data-carousel-idx` — slide index inside carousel tracks. */
  DATA_CAROUSEL_IDX: `${_DATA}carousel-idx`,
  /** `data-sec-idx` — section index variant for multi-section views. */
  DATA_SEC_IDX: `${_DATA}sec-idx`,
  /** `data-param` — parameter name bound by playground controls. */
  DATA_PARAM: `${_DATA}param`,
  /** `data-check` — checkbox binding marker in preference editors. */
  DATA_CHECK: `${_DATA}check`,
  /** `data-app-wrapper` — marks the top-level app wrapper element. */
  DATA_APP_WRAPPER: `${_DATA}app-wrapper`,
  /** `data-path` — manifest path stamped on docs tree/grid buttons. */
  DATA_PATH: `${_DATA}path`,
  /** Marks a docs-content box whose delegated link handler is attached. */
  DATA_WIRED: `${_DATA}wired`,
})
