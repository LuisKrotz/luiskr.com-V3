/**
 * @file constants.js
 * @description Single source of truth for all shared constants used across
 * the vanilla JS + Web Components codebase. Import from here — never
 * re-declare in individual component files.
 */

// ─── Media asset suffix tokens ────────────────────────────────────────────────
// All suffixes match the exact Firebase Storage naming convention used by the
// Kodak MSSIM blur-up pipeline and mozjpeg encoding passes.
export const MEDIA = Object.freeze({
  /** Base mozjpeg prefix used in all derived filenames */
  MOZ: '-mozjpg',
  /** Thumb quality suffix → kodak MSSIM-tuned q=3 */
  THUMB_SUFFIX: '3-MSSIM-tuned-kodak',
  /** Q50 medium-res suffix */
  Q50: '-50',
  /** Q100 / uncompressed lossless suffix */
  Q100: '-uncompressed',
  /** Static image extension */
  EXT: '.jpg',
  /** Video extension */
  VIDEO_EXT: '.mp4',
  /** Video poster/thumb extension (appended after .mp4) */
  VIDEO_THUMB_EXT: '.mp4.jpg-thumb.jpg',
  /** 2× scale-down video variant suffix */
  VIDEO_SCALE: '.mp4-scaledown-2x',
})

// ─── Masonry layout constants ─────────────────────────────────────────────────
// These match the Vue source values exactly. Any change must be reflected in
// both the WASM layout worker and these constants.
export const LAYOUT = Object.freeze({
  /** Aspect ratio multiplier for featured (wide) cards */
  FEAT_MULT: 0.48,
  /** Cycling aspect ratio multipliers for standard cards */
  COMP_MULTS: Object.freeze([0.56, 0.58, 0.54, 0.57, 0.55]),
  /** Inter-card gap in pixels */
  GAP: 16,
})

// ─── Carousel constants ───────────────────────────────────────────────────────
export const CAROUSEL = Object.freeze({
  /** Autoplay interval in milliseconds before advancing to next slide */
  AUTOPLAY_DURATION: 5000,
  /** SVG countdown ring circumference: 2π × r (r=19) */
  CIRCUMFERENCE: 2 * Math.PI * 19,
  /** Viewport width below which mobile behaviour applies */
  MOBILE_BREAKPOINT: 768,
  /** Minimum swipe distance (px) required to trigger a slide change */
  SWIPE_THRESHOLD: 40,
  /** Teleport animation duration (ms) — must match CSS transition */
  TELEPORT_DELAY: 420,
})

// ─── Animation constants ──────────────────────────────────────────────────────
export const ANIMATION = Object.freeze({
  /** Smooth cubic-bezier used throughout the design system */
  EASING: 'cubic-bezier(0.22, 1, 0.36, 1)',
  /** Page transition easing */
  PAGE_EASING: 'cubic-bezier(0.16, 1, 0.3, 1)',
  /** Route transition duration (ms) */
  ROUTE_DURATION: 450,
  /** Mosaic expand/collapse transition duration (ms) */
  MOSAIC_DURATION: 420,
  /** Carousel fade-in transition duration (ms) */
  CAROUSEL_FADE_DURATION: 800,
})

// ─── Application constants ────────────────────────────────────────────────────
export const BASE_TITLE = 'Luis Krötz'

// ─── Legacy project slug aliases ──────────────────────────────────────────────
// Maps old URL slugs to canonical project keys. Used in router and Project view.
export const PROJECT_ALIASES = Object.freeze({
  'brazilian-leather': 'cicb',
  'clinica-de-desenvolvimento-nathalia-bond': 'nathalia-bond',
  'genesysinf-sageweb': 'sage',
  'minimelissa': 'mini-melissa',
})

// ─── Standard Media Dimensions ───────────────────────────────────────────────
export const MEDIA_DIMENSIONS = Object.freeze({
  COVER_WIDTH: 1600,
  COVER_HEIGHT: 900,
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 450,
  PROFILE_SIZE: 200,
})

// ─── Theme & Motion Tokens ──────────────────────────────────────────────────
export const THEME = Object.freeze({
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
})

export const MOTION = Object.freeze({
  FULL: 'full',
  REDUCED: 'reduced',
})

// ─── Common Semantic Attributes ─────────────────────────────────────────────
export const ATTRS = Object.freeze({
  EMPTY: '',
  TRUE: 'true',
  FALSE: 'false',
  NONE: 'none',
  AUTO: 'auto',
})

// ─── Shared Primitive Strings ───────────────────────────────────────────────
export const STRINGS = Object.freeze({
  UNDEFINED: 'undefined',
  FUNCTION: 'function',
  OBJECT: 'object',
  STRING: 'string',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
})

// ─── Fibonacci spacing scale (unitless — use with to-rem() in SCSS or rem in JS) ─
export const SPACE = Object.freeze({
  NONE: 0,
  HAIRLINE: 1,
  PIXEL: 1,
  '2XS': 2,
  XS: 3,
  SM: 5,
  MD: 8,
  LG: 13,
  XL: 21,
  '2XL': 34,
  '3XL': 55,
  '4XL': 89,
  '5XL': 144,
  '6XL': 233,
  '7XL': 377,
  '8XL': 610,
  '9XL': 987,
})

// ─── Responsive breakpoints (px) ──────────────────────────────────────────────
export const BREAKPOINTS = Object.freeze({
  272: 272,
  320: 320,
  375: 375,
  414: 414,
  540: 540,
  768: 768,
  960: 960,
  1024: 1024,
  1280: 1280,
  1360: 1360,
  1440: 1440,
  1560: 1560,
  1680: 1680,
  1920: 1920,
  2100: 2100,
  2560: 2560,
  3840: 3840,
})

// ─── Grid padding per breakpoint (matches SASS $gap-* values) ────────────────
export const GRID_GAP = Object.freeze({
  272: 13,
  320: 21,
  375: 21,
  414: 21,
  540: 34,
  768: 55,
  960: 55,
  1024: 89,
  1280: 89,
  1440: 89,
  1680: 144,
  1920: 144,
  2560: 233,
  3840: 377,
})

// ─── Mosaic column counts per breakpoint ─────────────────────────────────────
// Must match calcColsForWidth() in wasm-layout.js
export const MOSAIC_COLS = Object.freeze({
  0: 1,    // < 540px: 1 column
  540: 2,  // 540–959px: 2 columns
  960: 3,  // 960–1279px: 3 columns
  1280: 4, // 1280–1679px: 4 columns
  1680: 5, // 1680–1919px: 5 columns
  1920: 6, // 1920–2559px: 6 columns
  2560: 7, // ≥ 2560px: 7 columns
})

// ─── Centralized Custom Element Tags ───────────────────────────────────────
export const TAGS = Object.freeze({
  MEDIA_EXPANDED: 'media-expanded',
  MEDIA_FIGURE: 'media-figure',
  DRAW_TEXT: 'draw-text',
  CUSTOM_CAROUSEL: 'custom-carousel',
  HOME_CAROUSEL: 'home-carousel',
  HOME_MOSAIC: 'home-mosaic',
  ABOUT_SECTION: 'about-section',
  CONTACT_SECTION: 'contact-section',
  AWARDS_MENTIONS: 'awards-mentions',
  PORTFOLIO_RELATED: 'portfolio-related',
  LEGAL_FOOTER: 'legal-footer',
  PREFERENCES_MODAL: 'preferences-modal',
  LANG_DIALOG: 'lang-dialog',
  COOKIE_BANNER: 'cookie-banner',
  UI_SKELETON: 'ui-skeleton',
  APP_NAV: 'app-nav',
  APP_ROOT: 'app-root',
  VIEW_HOME: 'view-home',
  VIEW_PROJECT: 'view-project',
  VIEW_LEGAL: 'view-legal',
  VIEW_NOT_FOUND: 'view-not-found',
  VIEW_ADMIN_LOGIN: 'view-admin-login',
  VIEW_CMS_DASHBOARD: 'view-cms-dashboard',
  CMS_PORTFOLIO_LIST: 'cms-portfolio-list',
  CMS_PROJECTS_LIST: 'cms-projects-list',
  CMS_ABOUT_EDITOR: 'cms-about-editor',
  CMS_FOOTER_EDITOR: 'cms-footer-editor',
  CMS_LANG_EDITOR: 'cms-lang-editor',
})

// ─── Centralized CSS class name tokens ──────────────────────────────────────
// Base block identifiers defined once and composed
const _B_SKELETON = 'skeleton'
const _B_RENDER = 'render'
const _B_HOME_MOSAIC = 'home-mosaic'
const _B_CAROUSEL = 'carousel'
const _B_CAROUSEL_BTN = 'carousel-btn'
const _B_CAROUSEL_SLIDE = 'carousel-slide'
const _B_ABOUT = 'about'
const _B_AWARDS_FOOTER = 'awards-footer'
const _B_CONTACT = 'contact'
const _B_MODAL = 'modal'
const _B_INTERNAL = 'internal'
const _B_DRAW_TEXT = 'draw-text'
const _B_RELATED = 'related-mosaic'
const _B_HC = 'hc'
const _B_NOT_FOUND = 'not-found'
const _B_ADMIN = 'admin'
const _B_CMS = 'cms'
const _B_NAV = 'nav'

export const CLASSES = Object.freeze({
  // Skeleton & Media
  SKELETON: _B_SKELETON,
  SKELETON_SHIMMER: `${_B_SKELETON}--shimmer`,
  SKELETON_MEDIA: `${_B_SKELETON}--media`,
  SKELETON_ROUND: `${_B_SKELETON}--round`,
  SKELETON_BLOCK: `${_B_SKELETON}--block`,
  SKELETON_TITLE_SM: `${_B_SKELETON}--title-sm`,
  SKELETON_TITLE_MD: `${_B_SKELETON}--title-md`,
  SKELETON_SECTION_TITLE: `${_B_SKELETON}--section-title`,
  SKELETON_PARA_FULL: `${_B_SKELETON}--para-full`,
  SKELETON_PARA_94: `${_B_SKELETON}--para-94`,
  SKELETON_PARA_98: `${_B_SKELETON}--para-98`,
  SKELETON_PARA_65: `${_B_SKELETON}--para-65`,
  SKELETON_BADGE: `${_B_SKELETON}--badge`,
  SKELETON_ABOUT_TITLE: `${_B_SKELETON}-about-title`,
  SKELETON_ABOUT_P1: `${_B_SKELETON}-about-p1`,
  SKELETON_ABOUT_P2: `${_B_SKELETON}-about-p2`,
  SKELETON_ABOUT_P3: `${_B_SKELETON}-about-p3`,
  SKELETON_ABOUT_P4: `${_B_SKELETON}-about-p4`,
  SKELETON_ABOUT_P5: `${_B_SKELETON}-about-p5`,
  SKELETON_FOOTER_LINK: `${_B_SKELETON}--footer-link`,
  SKELETON_FOOTER_NOTE_1: `${_B_SKELETON}--footer-note-1`,
  SKELETON_FOOTER_NOTE_2: `${_B_SKELETON}--footer-note-2`,
  RENDER_MEDIA: `${_B_RENDER}-media`,
  RENDER_MEDIA_HIGH: `${_B_RENDER}-media--high`,
  RENDER_MEDIA_EXPAND: `${_B_RENDER}-media--can-expand`,
  RENDER_MEDIA_THUMB: `${_B_RENDER}-media--thumb`,
  RENDER_MEDIA_LOADED: `${_B_RENDER}-media--loaded`,
  RENDER_PLACEHOLDER: `${_B_RENDER}-placeholder`,
  RENDER_PLACEHOLDER_FIGURE: `${_B_RENDER}-placeholder-figure`,
  MEDIA_FIGURE: 'media-figure',

  // Home Mosaic
  HOME_PORTFOLIO_SECTION: 'home-portfolio-section',
  HOME_SECTION_TITLE: 'home-section-title',
  HOME_MOSAIC: _B_HOME_MOSAIC,
  HOME_MOSAIC_ITEM: `${_B_HOME_MOSAIC}-item`,
  HOME_MOSAIC_ITEM_FEATURED: `${_B_HOME_MOSAIC}-item--featured`,
  HOME_MOSAIC_ITEM_EXPANDED: `${_B_HOME_MOSAIC}-item--expanded`,
  HOME_MOSAIC_MEDIA: `${_B_HOME_MOSAIC}-media`,
  HOME_MOSAIC_IMG: `${_B_HOME_MOSAIC}-img`,
  HOME_MOSAIC_TITLE_OVERLAY: `${_B_HOME_MOSAIC}-title-overlay`,
  HOME_MOSAIC_TITLE: `${_B_HOME_MOSAIC}-title`,
  HOME_MOSAIC_BOTTOM: `${_B_HOME_MOSAIC}-bottom`,
  HOME_MOSAIC_DETAILS: `${_B_HOME_MOSAIC}-details`,
  HOME_MOSAIC_DESC: `${_B_HOME_MOSAIC}-desc`,
  HOME_MOSAIC_BTN: `${_B_HOME_MOSAIC}-btn`,

  // Carousel
  CAROUSEL: _B_CAROUSEL,
  CAROUSEL_CONTAINER: `${_B_CAROUSEL}-container`,
  CAROUSEL_TRACK: `${_B_CAROUSEL}-track`,
  CAROUSEL_SLIDE: `${_B_CAROUSEL}-slide`,
  CAROUSEL_SLIDE_ACTIVE: `${_B_CAROUSEL}-slide--active`,
  CAROUSEL_PREV: `${_B_CAROUSEL}-prev`,
  CAROUSEL_NEXT: `${_B_CAROUSEL}-next`,
  CAROUSEL_DOTS: `${_B_CAROUSEL}-dots`,
  CAROUSEL_DOT: `${_B_CAROUSEL}-dot`,
  CAROUSEL_DOT_ACTIVE: `${_B_CAROUSEL}-dot--active`,

  // About & Contact
  ABOUT: _B_ABOUT,
  ABOUT_TITLE: `${_B_ABOUT}-title`,
  ABOUT_PROFILE_SECTION: `${_B_ABOUT}-profile-section`,
  ABOUT_PROFILE_PICTURE: `${_B_ABOUT}-profile-picture`,
  ABOUT_PROFILE_PICTURE_IMG: `${_B_ABOUT}-profile-picture-img`,
  ABOUT_PROFILE_PICTURE_PLACEHOLDER: `${_B_ABOUT}-profile-picture-placeholder`,
  ABOUT_PROFILE_TEXT: `${_B_ABOUT}-profile-text`,
  ABOUT_PROFILE_TEXT_COL: `${_B_ABOUT}-profile-text-col`,
  ABOUT_ITEM: `${_B_ABOUT}-item`,
  ABOUT_ITEM_TEXT: `${_B_ABOUT}-item-text`,
  AWARDS_FOOTER: _B_AWARDS_FOOTER,
  AWARDS_FOOTER_TITLE: `${_B_AWARDS_FOOTER}-title`,
  AWARDS_FOOTER_LINKS: `${_B_AWARDS_FOOTER}-links`,
  AWARDS_FOOTER_ITEM: `${_B_AWARDS_FOOTER}-links-item`,
  AWARDS_FOOTER_SEP: `${_B_AWARDS_FOOTER}-links-sep`,
  CONTACT: _B_CONTACT,
  CONTACT_TITLE: `${_B_CONTACT}-title`,
  CONTACT_SOCIAL: `${_B_CONTACT}-social`,
  CONTACT_SOCIAL_LINK: `${_B_CONTACT}-social-link`,
  CONTACT_OTHER: `${_B_CONTACT}-other`,
  CONTACT_OTHER_LINK: `${_B_CONTACT}-other-link`,
  CONTACT_SEPARATOR: `${_B_CONTACT}-social-separator`,

  // Modal
  MODAL: _B_MODAL,
  MODAL_OPEN: `${_B_MODAL}-open`,
  MODAL_ABOVE: `${_B_MODAL}-above`,
  MODAL_BELOW: `${_B_MODAL}-below`,
  MODAL_CLOSE_BAR: `${_B_MODAL}-close-bar`,
  MODAL_BTN: `${_B_MODAL}-btn`,
  EXPAND_MODAL_CONTENT: 'expand-modal-content',
  EXPAND_MODAL_CONTENT_VIDEO: 'expand-modal-content--video',
  EXPAND_MODAL_CLOSING: 'expand-modal--closing',
  EXPAND_MODAL_CLOSE_BAR: 'expand-modal-close-bar',
  EXPAND_MODAL_CLOSE_BAR_TITLE: 'expand-modal-close-bar-title',
  EXPAND_MODAL_CLOSE_BAR_BUTTON: 'expand-modal-close-bar-button',
  EXPAND_MODAL_CLOSE_AREA: 'expand-modal-close-area',
  EXPAND_MODAL_CLOSE_BOTTOM: 'expand-modal-close-bottom',
  EXPAND_MODAL_MEDIA_FIGURE: 'expand-modal-media-figure',
  EXPAND_MODAL_MEDIA_FIGURE_VIDEO: 'expand-modal-media-figure--video',
  EXPAND_MODAL_MEDIA_PLACEHOLDER: 'expand-modal-media-placeholder',
  EXPAND_MODAL_MEDIA_ITEM: 'expand-modal-media-item',
  EXPAND_MODAL_MEDIA_ITEM_VIDEO: 'expand-modal-media-item--video',
  EXPAND_MODAL_OPEN_1: 'expand-modal-open-1',
  EXPAND_MODAL_OPEN_2: 'expand-modal-open-2',

  // Internal / Project
  INTERNAL: _B_INTERNAL,
  INTERNAL_TITLE: `${_B_INTERNAL}-title`,
  INTERNAL_MAIN: `${_B_INTERNAL}-main`,
  INTERNAL_MAIN_ITEM: `${_B_INTERNAL}-main-item`,
  INTERNAL_DESCRIPTION: `${_B_INTERNAL}-description`,
  INTERNAL_DESCRIPTION_TEXT: `${_B_INTERNAL}-description-text`,
  INTERNAL_EXTRA: `${_B_INTERNAL}-extra`,
  INTERNAL_EXTRA_SCROLL: `${_B_INTERNAL}-extra-scroll`,
  INTERNAL_EXTRA_ITEM: `${_B_INTERNAL}-extra-item`,
  INTERNAL_FOOTER: `${_B_INTERNAL}-footer`,
  INTERNAL_FOOTER_TITLE: `${_B_INTERNAL}-footer-title`,
  INTERNAL_FOOTER_RELATED: `${_B_INTERNAL}-footer-related`,
  INTERNAL_FOOTER_ITEMS: `${_B_INTERNAL}-footer-items`,
  INTERNAL_FOOTER_ITEMS_LINK: `${_B_INTERNAL}-footer-items-link`,
  INTERNAL_FOOTER_ITEMS_SEP: `${_B_INTERNAL}-footer-items-separator`,
  INTERNAL_FOOTER_ITEMS_NOTE: `${_B_INTERNAL}-footer-items-note`,

  // Related Mosaic
  RELATED_MOSAIC: _B_RELATED,
  RELATED_MOSAIC_ITEM: `${_B_RELATED}-item`,
  RELATED_MOSAIC_ITEM_FEATURED: `${_B_RELATED}-item--featured`,
  RELATED_MOSAIC_MEDIA: `${_B_RELATED}-media`,
  RELATED_MOSAIC_IMG: `${_B_RELATED}-img`,
  RELATED_MOSAIC_OVERLAY: `${_B_RELATED}-overlay`,
  RELATED_MOSAIC_INFO: `${_B_RELATED}-info`,
  RELATED_MOSAIC_TITLE: `${_B_RELATED}-title`,
  RELATED_MOSAIC_DESC: `${_B_RELATED}-desc`,

  // DrawText
  DRAW_TEXT: _B_DRAW_TEXT,
  DRAW_TEXT_WORD: `${_B_DRAW_TEXT}__word`,
  DRAW_TEXT_CHAR: `${_B_DRAW_TEXT}__char`,
  DRAW_TEXT_VISIBLE: `${_B_DRAW_TEXT}--visible`,

  // Navigation
  NAV: _B_NAV,
  NAV_LINK: `${_B_NAV}-link`,
  NAV_LINK_ACTIVE: 'router-link-exact-active',
  NAV_DESKTOP: `${_B_NAV}-desktop`,
  NAV_SEPARATOR: `${_B_NAV}-separator`,
  NAV_MOBILE_STRIP: `${_B_NAV}-mobile-strip`,

  // Additional Carousel (all composed from _B_CAROUSEL_BTN / _B_CAROUSEL_SLIDE)
  CAROUSEL_FALLBACK: `${_B_CAROUSEL}-fallback`,
  CAROUSEL_CONTROLS: `${_B_CAROUSEL}-controls`,
  CAROUSEL_INDICATORS: `${_B_CAROUSEL}-indicators`,
  CAROUSEL_COUNTER: `${_B_CAROUSEL}-counter`,
  CAROUSEL_BTN: _B_CAROUSEL_BTN,
  CAROUSEL_BTN_PREV: `${_B_CAROUSEL_BTN} ${_B_CAROUSEL_BTN}--prev`,
  CAROUSEL_BTN_NEXT: `${_B_CAROUSEL_BTN} ${_B_CAROUSEL_BTN}--next`,
  CAROUSEL_BTN_RING: `${_B_CAROUSEL_BTN}-ring`,
  CAROUSEL_BTN_RING_TRACK: `${_B_CAROUSEL_BTN}-ring-track`,
  CAROUSEL_BTN_RING_FILL: `${_B_CAROUSEL_BTN}-ring-fill`,
  CAROUSEL_BTN_ARROW: `${_B_CAROUSEL_BTN}-arrow`,
  CAROUSEL_SLIDE_CLONE: `${_B_CAROUSEL_SLIDE} ${_B_CAROUSEL_SLIDE}--clone`,
  CAROUSEL_SLIDE_CLONE_LAST: `${_B_CAROUSEL_SLIDE} ${_B_CAROUSEL_SLIDE}--clone ${_B_CAROUSEL_SLIDE}--clone-last`,
  CAROUSEL_SLIDE_CLONE_FIRST: `${_B_CAROUSEL_SLIDE} ${_B_CAROUSEL_SLIDE}--clone ${_B_CAROUSEL_SLIDE}--clone-first`,

  // Additional Internal
  LEGAL: 'legal',
  INTERNAL_EXPAND: `${_B_INTERNAL}-expand`,

  // Not Found
  NOT_FOUND: _B_NOT_FOUND,
  NOT_FOUND_TITLE: `${_B_NOT_FOUND}-title`,
  NOT_FOUND_SUBTITLE: `${_B_NOT_FOUND}-subtitle`,
  NOT_FOUND_LINK: `${_B_NOT_FOUND}-link`,

  // Admin & CMS
  ADMIN_LOGIN_WRAPPER: `${_B_ADMIN}-login-wrapper`,
  ADMIN_LOGIN_CARD: `${_B_ADMIN}-login-card`,
  ADMIN_TITLE: `${_B_ADMIN}-title`,
  ADMIN_SUBTITLE: `${_B_ADMIN}-subtitle`,
  GOOGLE_AUTH_BTN: 'google-auth-btn',
  GOOGLE_ICON: 'google-icon',
  ADMIN_ERROR_MSG: `${_B_ADMIN}-error-msg`,
  CMS_CONTAINER: `${_B_CMS}-container`,
  CMS_HEADER: `${_B_CMS}-header`,
  CMS_BRAND: `${_B_CMS}-brand`,
  CMS_LOGO: `${_B_CMS}-logo`,
  CMS_USER_INFO: `${_B_CMS}-user-info`,
  CMS_AVATAR: `${_B_CMS}-avatar`,
  CMS_EMAIL: `${_B_CMS}-email`,
  CMS_LOGOUT_BTN: `${_B_CMS}-logout-btn`,
  CMS_NAV_TABS: `${_B_CMS}-nav-tabs`,
  CMS_TAB_BTN: `${_B_CMS}-tab-btn`,
  CMS_MAIN_CONTENT: `${_B_CMS}-main-content`,
  CMS_TOAST: `${_B_CMS}-toast`,
  TOAST_TEXT: 'toast-text',

  // Home Carousel
  HC: _B_HC,
  HC_IN_VIEW: `${_B_HC}--in-view`,
  HC_CONTROLS: `${_B_HC}-controls`,
  HC_DOTS: `${_B_HC}-dots`,
  HC_DOT: `${_B_HC}-dot`,
  HC_DOT_ACTIVE: `${_B_HC}-dot--active`,
  HC_TRACK: `${_B_HC}-track`,
  HC_SLIDE: `${_B_HC}-slide`,
  HC_SLIDE_ACTIVE: `${_B_HC}-slide--active`,
  HC_SLIDE_CLONE: `${_B_HC}-slide--clone`,
  HC_SLIDE_CLONE_LAST: `${_B_HC}-slide--clone-last`,
  HC_SLIDE_CLONE_FIRST: `${_B_HC}-slide--clone-first`,
  HC_BTN: `${_B_HC}-btn`,
  HC_BTN_PREV: `${_B_HC}-btn--prev`,
  HC_BTN_NEXT: `${_B_HC}-btn--next`,
  HC_BTN_RING: `${_B_HC}-btn-ring`,
  HC_BTN_RING_TRACK: `${_B_HC}-btn-ring-track`,
  HC_BTN_RING_FILL: `${_B_HC}-btn-ring-fill`,
  HC_BTN_ARROW: `${_B_HC}-btn-arrow`,
  HC_SPACER: `${_B_HC}-spacer`,
  HC_AWARD: `${_B_HC}-award`,
  HC_AWARD_MEDIA: `${_B_HC}-award-media`,
  HC_AWARD_IMG: `${_B_HC}-award-img`,
  HC_AWARD_TEXT: `${_B_HC}-award-text`,
  HC_SLIDE_CONTENT: `${_B_HC}-slide-content`,
})

// ─── DOM Event name tokens ────────────────────────────────────────────────────
export const EVENTS = Object.freeze({
  CLICK: 'click',
  MOUSEENTER: 'mouseenter',
  MOUSELEAVE: 'mouseleave',
  MOUSEDOWN: 'mousedown',
  MOUSEUP: 'mouseup',
  SCROLL: 'scroll',
  RESIZE: 'resize',
  TOUCHSTART: 'touchstart',
  TOUCHEND: 'touchend',
  TOUCHMOVE: 'touchmove',
  KEYDOWN: 'keydown',
  KEYUP: 'keyup',
  FOCUS: 'focus',
  BLUR: 'blur',
  CHANGE: 'change',
  INPUT: 'input',
  SUBMIT: 'submit',
  TRANSITIONEND: 'transitionend',
  ANIMATIONEND: 'animationend',
  POPSTATE: 'popstate',
})
