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
  /** Boot-loader overlay copy — mirrors the space playground's system
   *  boot sequence with docs-context wording (English-only portal). */
  LOADER_TITLE: 'Docs system boot',
  LOADER_MSG_INIT: 'Opening the documentation archive',
  LOADER_MSG_MANIFEST: 'Indexing modules and reports',
  LOADER_MSG_SCENE: 'Mounting the architecture graph',
  LOADER_MSG_FILE: 'Loading the document payload',
  LOADER_MSG_READY: 'Portal online',
})

/**
 * Staged boot-loader progress marks — the manifest is inlined at build
 * time so real fetch percentages don't exist; discrete stage numbers
 * keep the bar honest (manifest scanned → scene mounted → file fetched
 * → portal usable).
 */
export const DOCS_LOADER_PCT = Object.freeze({
  MANIFEST: 25,
  SCENE: 60,
  FILE: 80,
  READY: 100,
})

/** Unit tokens used by docs layout/scene math. */
export const DOCS_UNITS = Object.freeze({
  /** gl-strip thread-field drift — 1/16 real-time so lines barely move */
  GL_STRIP_TIME_SCALE: 0.0625,
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
  /** slow backdrop motion — autorotate deg/frame-ish + node pulse.
   *  Speeds run at 1/16 of the original values so the graph reads as a
   *  calm ambient layer, not a spinner. */
  SCENE_ROTATE_SPEED: 0.009375,
  SCENE_PULSE_SPEED: 0.021875,
  SCENE_PULSE_AMP: 0.05,
  /** node/edge alpha — kept faint so the graph stays a backdrop layer */
  SCENE_DIR_OPACITY: 0.34,
  SCENE_FILE_OPACITY: 0.18,
  SCENE_LINE_OPACITY: 0.14,
  /** active-location highlight — the node matching the open docsPath pops
   *  to near-full alpha with a larger pulse; ancestor dirs along its path
   *  lift a notch above the base dir alpha so the branch reads. */
  SCENE_ACTIVE_OPACITY: 0.95,
  SCENE_ANCESTOR_OPACITY: 0.55,
  SCENE_ACTIVE_SCALE: 1.8,
  /** intro settle — a first (unrestored) mount eases the whole graph in
   *  from SCENE_INTRO_TURN radians over SCENE_INTRO_MS, then hands off to
   *  the ambient autorotate. Restored poses skip the intro entirely. */
  SCENE_INTRO_TURN: -Math.PI * 0.75,
  SCENE_INTRO_MS: 6000,
})
