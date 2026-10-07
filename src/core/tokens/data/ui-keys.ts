/**
 * @file tokens/data/ui-keys.js
 * @description UI copy keys — dotted paths into translations/<locale>/APP,
 * grouped by feature. Every user-visible string resolves through
 * `appText(UI_KEYS.X)`; the English values live in database.json
 * (virtual:i18n-fallback snapshot), never here.
 */

import {
  _B_CONTACT,
  _B_PREF,
  _K_CLOSE,
  _K_EARTH_PLAYGROUND,
  _K_RELATED,
  _K_TITLE,
} from '../base.js'

/**
 * Frozen section ui key map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const SECTION_UI_KEYS = Object.freeze({
  ABOUT_DESCRIPTION: 'about.description',
  ABOUT_MORE_INFO: 'about.moreInfo',
  CONTACT: _B_CONTACT,
  RELATED: _K_RELATED,
  TITLE: _K_TITLE,
  NOT_FOUND: 'notFound',
  EARTH_PLAYGROUND: _K_EARTH_PLAYGROUND,
  LOADING: 'loading',
})

/**
 * Frozen nav ui key map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const NAV_UI_KEYS = Object.freeze({
  SCROLL_UP: 'scrollup',
  PREFERENCES: 'preferences',
  LANGUAGE: 'language',
  MENU: 'menu',
  CLOSE: _K_CLOSE,
  SITE_PREFERENCES: 'sitePreferences',
})

/**
 * Frozen cookie ui key map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const COOKIE_UI_KEYS = Object.freeze({
  COOKIES_ACCEPT: 'cookies.accept',
  COOKIES_REFUSE: 'cookies.refuse',
  COOKIES_MESSAGE: 'cookies.message',
})

/**
 * Frozen pref ui key map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const PREF_UI_KEYS = Object.freeze({
  PREF: _B_PREF,
  PREF_TITLE: `${_B_PREF}.title`,
})

/**
 * Frozen carousel ui key map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const CAROUSEL_UI_KEYS = Object.freeze({
  CAROUSEL_PREV: 'carousel.prev',
  CAROUSEL_NEXT: 'carousel.next',
  CAROUSEL_OF: 'carousel.ofLabel',
})

/**
 * Frozen stats ui key map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const STATS_UI_KEYS = Object.freeze({
  STATS_TITLE: 'statsHud.title',
  STATS_FPS: 'statsHud.fps',
  STATS_CPU: 'statsHud.cpu',
  STATS_NET: 'statsHud.network',
  STATS_LAT: 'statsHud.latency',
  STATS_REQ: 'statsHud.requests',
  STATS_MEM: 'statsHud.memory',
  STATS_GPU: 'statsHud.gpu',
})

/**
 * Frozen loader ui key map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const LOADER_UI_KEYS = Object.freeze({
  LOADER_LINES: 'loader.lines',
  LOADER_INIT_WEBGPU: 'loader.initWebGpu',
})

/**
 * Frozen engine ui key map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const ENGINE_UI_KEYS = Object.freeze({
  ENGINE_TITLE: 'engine.title',
  ENGINE_NPU: 'engine.npu',
  ENGINE_GPU: 'engine.gpu',
  ENGINE_WASM: 'engine.wasm',
  ENGINE_ON: 'engine.on',
  ENGINE_OFF: 'engine.off',
  ENGINE_CONTROLS: 'engine.controls',
})

/**
 * Frozen media ui key map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const MEDIA_UI_KEYS = Object.freeze({
  MEDIA_PREVIEW: 'media.preview',
  MEDIA_VIDEO_CONTROLS: 'media.videoControls',
  MEDIA_AUTOPLAY: 'media.autoplay',
  MEDIA_GO_TO_SLIDE: 'media.goToSlide',
  MEDIA_TO_EXPAND: 'media.toExpand',
})

/**
 * Frozen awards ui key map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const AWARDS_UI_KEYS = Object.freeze({
  AWARDS_NEXT: 'awards.nextAward',
  AWARDS_LEGAL_NAV: 'awards.legalNav',
})

/**
 * Notifies ui keys.
 */
export const NOTIFY_UI_KEYS = Object.freeze({
  NOTIFY_ERROR: 'notify.error',
  NOTIFY_LOAD_FAILED: 'notify.loadFailed',
  NOTIFY_TITLE: 'notify.title',
  NOTIFY_DISMISS: 'notify.dismiss',
})
