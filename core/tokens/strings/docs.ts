/**
 * @file tokens/strings/docs.js
 * @description Docs-portal string tokens — English-only UI literals, the
 * content-asset path prefix and the CMS component keys.
 */

import { _B_DOCS } from '../base.js'

/**
 * Frozen docs string map — sole declaration site for these tokens;
 * consumers read members and never re-declare the strings
 * (zero-hardcoding rules 4–5). Object.freeze makes the token contract
 * immutable at runtime.
 */
export const DOCS_STRINGS = Object.freeze({
  /** Page + footer link title — English-only by product spec. */
  TITLE: 'In-depth project docs',
  /** English fallback for the CMS-provided description + toast copy. */
  DESC_FALLBACK: 'Available only in English',
  COPY_TOAST_FALLBACK:
    "This page doesn't allow copy, please refer to github to download the sourcecode or contact the page admin.",
  /** database.json component node: translations/<locale>/components/<key>. */
  CMS_COMPONENT: `${_B_DOCS}-portal`,
  /** URL prefix under which rendered file payloads are served/emitted. */
  ASSET_BASE: `/${_B_DOCS}-content/`,
  /** JSON suffix appended to every emitted content payload. */
  ASSET_EXT: '.json',
  /** Accessibility labels for the editable breadcrumb + copy feedback. */
  CRUMB_INPUT_LABEL: 'Edit path',
  CRUMB_INPUT_HINT: 'Type a docs path segment and press Enter',
  TREE_LABEL: 'Documentation tree',
  GRID_LABEL: 'Folders and files',
  NAV_TOGGLE: 'Browse the docs tree',
  VIEWER_BACK: 'Back',
  SOURCE_PROTECTED_LABEL: 'Copy protection active',
  MEDIA_UNAVAILABLE: 'Binary file too large to preview — download it from the GitHub repository.',
  NOT_FOUND_PATH: 'Not found in the documentation tree.',
  /** Keyboard key the print-screen guard reacts to. */
  KEY_PRINT_SCREEN: 'PrintScreen',
  /** Editable-breadcrumb input fallback when the URL path can't resolve. */
  CRUMB_PLACEHOLDER: 'docs/…',
  /** Root-bucket folder exempt from index-file auto-open (source tree). */
  SRC_ROOT: 'src',
  /** Index filename that auto-opens when its folder is entered. */
  INDEX_FILE: 'index.html',
  /** Analytics event name for copy-guard attempts. */
  EVENT_COPY_ATTEMPT: 'docs_copy_attempt',
  /** JSON-LD description for the portal root/folder pages. */
  SCHEMA_DESCRIPTION:
    'Source code, documentation and quality reports for luiskr.com — browsable and indexable.',
})

/** Unit tokens used by docs layout/scene math. */
export const DOCS_UNITS = Object.freeze({
  /** deterministic folder-art hash modulus */
  FOLDER_HASH_MOD: 9973,
  /** tap-vs-drag pick slop in px — taps move < this many CSS px */
  TAP_SLOP_PX: 10,
  /** label sprite canvas box (px) and font size (px) */
  LABEL_W: 256,
  LABEL_H: 64,
  LABEL_FONT_PX: 22,
  /** world-space sprite size + lift above the node sphere */
  LABEL_SCALE_X: 7,
  LABEL_SCALE_Y: 1.75,
  LABEL_LIFT_Y: 2.2,
  /** zoom reveal: labels fade in when controls distance drops under
   *  (LABEL_REVEAL_BASE − depth·LABEL_DEPTH_STEP), over LABEL_FADE px */
  LABEL_REVEAL_BASE: 44,
  LABEL_DEPTH_STEP: 7,
  LABEL_REVEAL_MIN: 16,
  LABEL_FADE: 12,
  /** radial-tree geometry shared with the wasm worker op */
  SCENE_BASE_RADIUS: 6,
  SCENE_DEPTH_STEP: 9,
  SCENE_Y_STEP: 4,
  SCENE_Y_WAVE: 1.5,
  /** slow backdrop motion — autorotate deg/frame-ish + node pulse */
  SCENE_ROTATE_SPEED: 0.15,
  SCENE_PULSE_SPEED: 0.35,
  SCENE_PULSE_AMP: 0.05,
  /** node/edge alpha — kept faint so the graph stays a backdrop layer */
  SCENE_DIR_OPACITY: 0.34,
  SCENE_FILE_OPACITY: 0.18,
  SCENE_LINE_OPACITY: 0.14,
})
