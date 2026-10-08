/**
 * @file tokens/events/mutations.js
 * @description Store mutation identifier tokens — grouped subsets of
 * MUTATIONS by functional area.
 */

/**
 * Store mutation identifier tokens. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const MODAL_MUTATIONS = Object.freeze({
  SET_MODAL_ORIGIN: 'setModalOrigin',
  TOGGLE_LANG_DIALOG: 'toggleLangDialog',
  TOGGLE_PREFERENCES_MODAL: 'togglePreferencesModal',
  SET_MODAL: 'setModal',
})

/**
 * Frozen lang store-mutation name map — sole declaration site for these tokens; consumers
 * read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
 * makes the token contract immutable at runtime.
 */
export const LANG_MUTATIONS = Object.freeze({
  SET_APP_LANG: 'setAppLang',
  SET_LANG: 'setLang',
  SET_COMPONENT_LANG: 'setComponentLang',
  SET_SLUGS_LANG: 'setSlugsLang',
  SET_CAROUSEL_LANG: 'setCarouselLang',
  SET_STATS_HUD_LANG: 'setStatsHudLang',
})

/**
 * Frozen pref store-mutation name map — sole declaration site for these tokens; consumers
 * read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
 * makes the token contract immutable at runtime.
 */
export const PREF_MUTATIONS = Object.freeze({
  TOGGLE_STATS_FOR_NERDS: 'toggleStatsForNerds',
  TOGGLE_SHOW_GRID: 'toggleShowGrid',
  TOGGLE_REDUCED_MOTION: 'toggleReducedMotion',
  SET_REDUCED_MOTION: 'setReducedMotion',
  SET_THEME: 'setTheme',
  INIT_THEME: 'initTheme',
  INIT_REDUCED_MOTION: 'initReducedMotion',
  APPLY_THEME: 'applyTheme',
  TOGGLE_VIDEO_AUTOPLAY: 'toggleVideoAutoplay',
  SET_VIDEO_AUTOPLAY: 'setVideoAutoplay',
})

/**
 * Frozen data store-mutation name map — sole declaration site for these tokens; consumers
 * read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
 * makes the token contract immutable at runtime.
 */
export const DATA_MUTATIONS = Object.freeze({
  SET_STORAGE: 'setStorage',
  SET_PORTFOLIO_LIST: 'setPortfolioList',
  SET_MENTIONS: 'setMentions',
  SET_MENTIONS_ITEMS: 'setMentionsItems',
})

/**
 * Frozen ui store-mutation name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const UI_MUTATIONS = Object.freeze({
  SET_CLICK_OR_TAP: 'setClickOrTap',
  SET_INPUT_METHOD: 'setInputMethod',
  SET_HOVER: 'setHover',
  SET_CLEAR: 'setClear',
  SET_MARQUEE_AMOUNT: 'setMarqueeAmount',
  SET_ON_MOUSE_MOVE: 'setOnMouseMove',
})
