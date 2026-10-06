/**
 * @file tokens/events/mutations.js
 * @description Store mutation identifier tokens — grouped subsets of
 * MUTATIONS by functional area.
 */

export const MODAL_MUTATIONS = Object.freeze({
  SET_MODAL_ORIGIN: 'setModalOrigin',
  TOGGLE_LANG_DIALOG: 'toggleLangDialog',
  TOGGLE_PREFERENCES_MODAL: 'togglePreferencesModal',
  SET_MODAL: 'setModal',
})

/**
 * The LANG_MUTATIONS constant.
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
 * The PREF_MUTATIONS constant.
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
 * The DATA_MUTATIONS constant.
 */
export const DATA_MUTATIONS = Object.freeze({
  SET_STORAGE: 'setStorage',
  SET_PORTFOLIO_LIST: 'setPortfolioList',
  SET_MENTIONS: 'setMentions',
  SET_MENTIONS_ITEMS: 'setMentionsItems',
})

/**
 * The UI_MUTATIONS constant.
 */
export const UI_MUTATIONS = Object.freeze({
  SET_CLICK_OR_TAP: 'setClickOrTap',
  SET_INPUT_METHOD: 'setInputMethod',
  SET_HOVER: 'setHover',
  SET_CLEAR: 'setClear',
  SET_MARQUEE_AMOUNT: 'setMarqueeAmount',
  SET_ON_MOUSE_MOVE: 'setOnMouseMove',
})
