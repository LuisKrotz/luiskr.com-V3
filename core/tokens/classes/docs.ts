/**
 * @file tokens/classes/docs.js
 * @description Docs-portal class tokens — BEM block `docs` + modifiers.
 */

import { _B_DOCS } from '../base.js'

/**
 * Frozen docs class-name map — sole declaration site for these tokens;
 * consumers read members and never re-declare the strings
 * (zero-hardcoding rules 4–5). Object.freeze makes the token contract
 * immutable at runtime.
 */
export const DOCS_CLASSES = Object.freeze({
  DOCS: _B_DOCS,
  DOCS_HEADER: `${_B_DOCS}-header`,
  DOCS_TITLE: `${_B_DOCS}-title`,
  DOCS_UPDATED: `${_B_DOCS}-updated`,
  DOCS_GL: `${_B_DOCS}-gl`,
  DOCS_GL_FALLBACK: `${_B_DOCS}-gl-fallback`,
  DOCS_BODY: `${_B_DOCS}-body`,
  DOCS_NAV: `${_B_DOCS}-nav`,
  DOCS_TREE: `${_B_DOCS}-tree`,
  DOCS_TREE_ITEM: `${_B_DOCS}-tree-item`,
  DOCS_TREE_OPEN: `${_B_DOCS}-tree-open`,
  DOCS_MAIN: `${_B_DOCS}-main`,
  DOCS_CRUMBS: `${_B_DOCS}-crumbs`,
  DOCS_CRUMB: `${_B_DOCS}-crumb`,
  DOCS_CRUMB_EDIT: `${_B_DOCS}-crumb-edit`,
  DOCS_GRID: `${_B_DOCS}-grid`,
  DOCS_CARD: `${_B_DOCS}-card`,
  DOCS_CARD_LABEL: `${_B_DOCS}-card-label`,
  DOCS_CARD_ART: `${_B_DOCS}-card-art`,
  DOCS_FOLDER: `${_B_DOCS}-folder`,
  DOCS_FOLDER_THREAD: `${_B_DOCS}-folder-thread`,
  DOCS_VIEWER: `${_B_DOCS}-viewer`,
  DOCS_VIEWER_HEAD: `${_B_DOCS}-viewer-head`,
  DOCS_VIEWER_PATH: `${_B_DOCS}-viewer-path`,
  DOCS_VIEWER_BACK: `${_B_DOCS}-viewer-back`,
  DOCS_CONTENT: `${_B_DOCS}-content`,
  DOCS_FRAME: `${_B_DOCS}-frame`,
  DOCS_SCENE: `${_B_DOCS}-scene`,
  DOCS_SCENE_OFF: `${_B_DOCS}-scene-off`,
  DOCS_NAV_TOGGLE: `${_B_DOCS}-nav-toggle`,
  DOCS_NAV_OPEN: `${_B_DOCS}-nav-open`,
  DOCS_PROTECTED: `${_B_DOCS}-protected`,
  DOCS_MERMAID: `${_B_DOCS}-mermaid`,
  DOCS_FOOTER_NOTE: `${_B_DOCS}-footer-note`,
  /** Boot loader overlay — stays up until the portal's first usable state. */
  DOCS_LOADER: `${_B_DOCS}-loader`,
  DOCS_LOADER_GLOW: `${_B_DOCS}-loader-glow`,
  DOCS_LOADER_GRID: `${_B_DOCS}-loader-grid`,
  DOCS_LOADER_CONTENT: `${_B_DOCS}-loader-content`,
  DOCS_LOADER_SPINNER_OUTER: `${_B_DOCS}-loader-spinner-outer`,
  DOCS_LOADER_SPINNER_INNER: `${_B_DOCS}-loader-spinner-inner`,
  DOCS_LOADER_COUNTER: `${_B_DOCS}-loader-counter`,
  DOCS_LOADER_PERCENT: `${_B_DOCS}-loader-percent`,
  DOCS_LOADER_VAL: `${_B_DOCS}-loader-val`,
  DOCS_LOADER_SYM: `${_B_DOCS}-loader-sym`,
  DOCS_LOADER_TITLE: `${_B_DOCS}-loader-title`,
  DOCS_LOADER_MSG: `${_B_DOCS}-loader-msg`,
  DOCS_LOADER_BAR: `${_B_DOCS}-loader-bar`,
  DOCS_LOADER_BAR_FILL: `${_B_DOCS}-loader-bar-fill`,
})
