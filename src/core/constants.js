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

// ─── Image Responsive Sizes ──────────────────────────────────────────────────
export const IMAGE_SIZES = Object.freeze({
  HOME_MOSAIC: '(max-width: 540px) 100vw, (max-width: 960px) 50vw, (max-width: 1440px) 33vw, 25vw',
  RELATED_MOSAIC: '(max-width: 768px) 100vw, 50vw',
  PROFILE_PICTURE: '200px',
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

export const SECTIONS = Object.freeze({
  HOME: 'home',
  ABOUT: 'about',
  CONTACT: 'contact',
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

// ─── Predictive Prefetching Configuration ─────────────────────────────────────
export const PREFETCH_CONFIG = Object.freeze({
  IDLE_TIMEOUT: 2000,
  FALLBACK_DELAY: 120,
  ROOT_MARGIN: '200px 0px',
  THRESHOLD: 0.1,
  PORTFOLIO_REGEX: /\/portfolio\/([^/?#]+)/,
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
  FHD_WIDTH: 1920,
  FHD_HEIGHT: 1080,
  COVER_HEIGHT_WIDE: 798,
  MOSAIC_DESKTOP_WIDTH: 1920,
  MOSAIC_MOBILE_WIDTH: 768,
  MOSAIC_DESKTOP_HEIGHT: 913,
  MOSAIC_MOBILE_HEIGHT: 340,
  GRAVATAR_SIZE_1X: 200,
  GRAVATAR_SIZE_2X: 300,
  GRAVATAR_SIZE_3X: 400,
  FHD_WIDTH_STR: '1920',
  MOSAIC_MOBILE_WIDTH_STR: '768',
  MOSAIC_DESKTOP_HEIGHT_STR: '913',
  MOSAIC_MOBILE_HEIGHT_STR: '340',
  VIDEO_DEFAULT_WIDTH: 640,
  VIDEO_DEFAULT_HEIGHT: 360,
  SCROLL_DURATION_FULL: 1000,
  SCROLL_DURATION_REDUCED: 2500,
  DRAW_ANIM_EXTRA_MS: 800,
  DRAW_ANIM_MAX_MS: 2000,
  DRAW_WORD_MAX_DELAY: 120,
  DRAW_DEFAULT_DELAY: 100,
  DRAW_OBSERVER_THRESHOLD: 0.05,
  SCROLL_INIT_DELAY: 500,
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
  EMPTY: "",
  TRUE: "true",
  FALSE: "false",
  NONE: "none",
  BLOCK: "block",
  AUTO: "auto",
  DECODING_ASYNC: "async",
  DECODING_SYNC: "sync",
  LOADING_LAZY: "lazy",
  LOADING_EAGER: "eager",
  FETCH_PRIORITY_HIGH: "high",
  FETCH_PRIORITY_LOW: "low",
  TRIGGER_VIEWPORT: "viewport",
  CAPTIONS: "captions",
  ARIA_LABEL: "aria-label",
  SMOOTH: "smooth",
  INSTANT: "instant",
  BUTTON: "button",
  TEXT: "text",
  CHECKBOX: "checkbox",
  DEFAULT_LANG: "en",
  SOURCE: "source",
  THUMB: "thumb",
  ALT: "alt",
  WIDTH: "width",
  HEIGHT: "height",
  IS_VIDEO: "is-video",
  CAN_EXPAND: "can-expand",
  AUTO_PLAY: "auto-play",
  CLASSES: "classes",
  DELAY: "delay",
  OFFSET: "offset",
  TRIGGER: "trigger",
  VISIBLE: "visible",
  PROP: "prop",
  SECTION: "section",
  PX: "px",
  VIDEO_MP4: "video/mp4",
  SRC: "src",
  HREF: "href",
  TYPE: "type",
  NAME: "name",
  VALUE: "value",
  OPEN: "open",
  LABEL: "label",
  TOUCH: "touch",
  POINTER: "pointer",
  DATA_INDEX: "data-index",
  DATA_LANG: "data-lang",
  CLASS_NAME: "className",
  CLASS: "class",
  ID: "id",
  ROLE_DIALOG: "dialog",
  ROLE_GROUP: "group",
  ROLE_SWITCH: "switch",
  ARIA_LABELLEDBY: "aria-labelledby",
  ARIA_MODAL: "aria-modal",
  TABINDEX: "tabindex",
  DATA_IDX: "data-idx",
  DATA_SEC: "data-sec",
  DATA_COL: "data-col",
  DATA_MIDX: "data-midx",
  DATA_SIZE: "data-size",
  DATA_ACTION: "data-action",
  DATA_FIELD: "data-field",
  DATA_DIM_IDX: "data-dim-idx",
  DATA_PROP: "data-prop",
  DATA_THEME: "data-theme",
  DATA_CONTENT: "data-content",
  ARIA_HIDDEN: "aria-hidden",
  HIDDEN: "hidden",
})

// ─── Media Query Tokens ─────────────────────────────────────────────────────
export const MEDIA_QUERIES = Object.freeze({
  POINTER_FINE: '(pointer: fine)',
  PREFERS_COLOR_DARK: '(prefers-color-scheme: dark)',
  PREFERS_REDUCED_MOTION: '(prefers-reduced-motion: reduce)',
})

// ─── Shared Primitive Strings ───────────────────────────────────────────────
export const STRINGS = Object.freeze({
  UNDEFINED: 'undefined',
  FUNCTION: 'function',
  OBJECT: 'object',
  STRING: 'string',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
  APPLE_VENDOR: 'Apple Computer, Inc.',
  CONTAINER_TYPE: 'container-type',
  INLINE_SIZE: 'inline-size',
  GESTURE_EVENT: 'GestureEvent',
  BR_TAG: '<br>',
  DELAY_30: '30',
  EMPTY: '',
  SLASH: '/',
  DOUBLE_SLASH: '//',
  COLON: ':',
  SEMICOLON: ';',
  COMMA: ',',
  DOT: '.',
  DASH: '-',
  UNDERSCORE: '_',
  EQUALS: '=',
  QUESTION: '?',
  AMPERSAND: '&',
  HASH: '#',
  PERCENT: '%',
  ZERO: '0',
  ONE: '1',
  PX: 'px',
  REM: 'rem',
  NONE: 'none',
  BLOCK: 'block',
  AUTO: 'auto',
  SMOOTH: 'smooth',
  INSTANT: 'instant',
  TRUE: 'true',
  FALSE: 'false',
  OPEN: 'open',
  CLASS: 'class',
  CLASS_NAME: 'className',
  ID: 'id',
  SRC: 'src',
  HREF: 'href',
  ALT: 'alt',
  TYPE: 'type',
  NAME: 'name',
  VALUE: 'value',
  EN: 'en',
  BR: 'br',
  PT: 'pt',
  ES: 'es',
  DE: 'de',
  FR: 'fr',
  IT: 'it',
  RU: 'ru',
  HRX: 'hrx',
  HRK: 'hrk',
  CAS: 'cas',
  RIV: 'riv',
  GN: 'gn',
  TLI: 'tli',
  TLN: 'tln',
  ADMIN: 'admin',
  CMS: 'cms',
  FIXED: 'fixed',
  PERCENT_100: '100%',
  MOUSE: 'mouse',
  PEN: 'pen',
  TOUCH: 'touch',
  POINTER: 'pointer',
  SYSTEM: 'system',
  DARK_SCHEME_QUERY: '(prefers-color-scheme: dark)',
  PORTFOLIO: 'portfolio',
  PRIVACY: 'privacy',
  GDPR: 'gdpr',
  TERMS: 'terms',
  TERMS_OF_USE: 'terms-of-use',
  PRIVACY_POLICY: 'privacy-policy',
  ABOUT: 'about',
  CONTACT: 'contact',
  POINTERENTER: 'pointerenter',
  TOUCHSTART: 'touchstart',
  ONTOUCHSTART: 'ontouchstart',
  FOCUS: 'focus',
  ROOT_MARGIN_200: '200px 0px',
  ROOT_MARGIN_100: '100px 0px',
  ROOT_MARGIN_50: '50px 0px',
  SELECTOR_LINKS: 'a[href^="/"], [data-route]',
  DATA_ROUTE: 'data-route',
  LINK_CANONICAL: 'link[rel="canonical"]',
  REL_CANONICAL: 'canonical',
  REL: 'rel',
  SITE_URL: 'https://luiskr.com',
  GRAVATAR_BASE: 'https://www.gravatar.com/avatar/',
  ONE_EM: '1em',
  VAR_RADIUS_FULL: 'var(--radius-full)',
  VAR_RADIUS_2XS: 'var(--radius-2xs)',
  MINUS_ONE: '-1',
  ABSOLUTE: 'absolute',
  RELATIVE: 'relative',
  HIDDEN: 'hidden',
  MOSAIC_CARD: 'mosaic_card',
  DELAY_8: '8',
  BATCH_LAYOUT: 'BATCH_LAYOUT',
  SVG_XMLNS: 'http://www.w3.org/2000/svg',
  SVG_DATA_URI_PREFIX: 'data:image/svg+xml,',
  SVG_EXT: '.svg',
  HTTP_LOCALHOST: 'http://localhost',
  GRAVATAR_HOSTNAME: 'gravatar.com',
  GRAVATAR_HOSTNAME_SUFFIX: '.gravatar.com',
  TOKEN_WORD: 'word',
  TOKEN_SPACE: 'space',
  TOKEN_BR: 'br',
  TOKEN_TAG: 'tag',
  SPACE_CHAR: ' ',
  A_TAG: 'a',
  SCHEMA_CONTEXT: 'https://schema.org',
  NOINDEX_NOFOLLOW: 'noindex, nofollow',
  META_ROBOTS: 'meta[name="robots"]',
  JSON_LD_SCRIPT_TYPE: 'application/ld+json',
  JSON_LD_SCRIPT_ID: 'jsonld-graph',
  SCHEMA_PUBLISHED_DATE: '2021-01-01T00:00:00+00:00',
  SCHEMA_VIDEO_DURATION: 'PT1M00S',
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
  STATS_HUD: 'stats-hud',
  FIGURE: 'figure',
  VIDEO: 'video',
  IMG: 'img',
  BUTTON: 'button',
  LINK: 'link',
  STYLE: 'style',
  DIV: 'div',
  SPAN: 'span',
  A: 'a',
})

// ─── URL constants ───────────────────────────────────────────────────
// All external base URLs declared once — never inline in components.
export const URLS = Object.freeze({
  CDN_BASE: 'https://storage.googleapis.com/luiskr.com/public/_v3/',
  FLAG_CDN: 'https://flagcdn.com/',
  SITE: 'https://luiskr.com',
  FIREBASE_DB: 'https://luiskr-com.firebaseio.com',
  GITHUB: 'https://github.com/LuisKrotz',
  LINKEDIN: 'https://www.linkedin.com/in/luis-kr%C3%B6tz/?locale=en_US',
})

// ─── Path constants ───────────────────────────────────────────────────
// URL path segments and Firebase path suffixes — never inline in components.
export const PATHS = Object.freeze({
  ROOT: "/",
  COVERS: "covers/",
  COMPONENTS_RELATED: "/components/related",
  COMPONENTS_RELATED_PROJECTS: "/components/related/projects",
  TRANSLATIONS: "translations/",
  PAGES: "/pages/",
  PROJECTS: "/projects/",
  PORTFOLIO: "/portfolio/",
  PORTFOLIO_SEGMENT: "portfolio",
  ADMIN: "/admin",
  CMS: "/cms",
  PRIVACY_POLICY: "/privacy-policy",
  GDPR: "/gdpr",
  TERMS_OF_USE: "/terms-of-use",
  NOT_FOUND: "not-found",
})

// ─── CMS data-key constants ───────────────────────────────────────────────
// Keys used to read from the Firebase translation / CMS data objects.

// ─── Route Meta Translation Keys ──────────────────────────────────────────────
// Values used in route.meta.translation to identify the Firebase translation doc.
export const TRANSLATION_KEYS = Object.freeze({
  HOME: 'HOME',
  PRIVACY_POLICY: 'privacy-policy',
  GDPR: 'GDPR',
  TERMS_OF_USE: 'terms-of-use',
  NOT_FOUND: 'not-found',
})

// ─── Route Name Tokens ────────────────────────────────────────────────────────
export const ROUTE_NAMES = Object.freeze({
  HOME: "Home",
  ABOUT: "About",
  CONTACT: "Contact",
  PRIVACY: "Privacy Policy",
  GDPR: "GDPR",
  TERMS: "Terms of Use",
  PROJECT: "DynamicProject",
  NOT_FOUND: "Not Found",
  ADMIN_LOGIN: "Admin Login",
  CMS_DASHBOARD: "CMS Dashboard",
})

export const ROUTE_PREFIXES = Object.freeze({
  HOME: "Home",
  ABOUT: "About",
  CONTACT: "Contact",
  PRIVACY: "Privacy",
  GDPR: "GDPR",
  TERMS: "Terms",
})

export const CMS_KEYS = Object.freeze({
  ABOUT_SECTION: 'about-section',
  LEGAL_FOOTER: 'legal-footer',
  RELATED_FOOTER: 'related-footer',
  AUTOPLAY: 'autoplay',
  RELATED: 'related',
  CONTACT: 'contact',
  LANG_DIALOG: 'lang-dialog',
  APP: 'APP',
  HOME: 'HOME',
  ABOUT: 'about',
  PORTFOLIOLIST: 'portfoliolist',
  MEDIA: 'media',
})

// ─── LocalStorage Key constants ─────────────────────────────────────────────
export const STORAGE_KEYS = Object.freeze({
  VIDEO_AUTOPLAY: 'videoAutoplay',
  LOCALE: 'locale',
  REDUCED_MOTION: 'reducedMotion',
  THEME: 'theme',
  STATS_FOR_NERDS: 'statsForNerds',
  SHOW_GRID: 'showGrid',
  COOKIE: 'cookie',
  FB_CACHE_PREFIX: 'fb_',
  SESSION_FB_CACHE_PREFIX: 'fb_cache_',
})

// ─── CSS Custom Properties ──────────────────────────────────────────────────
export const CSS_PROPS = Object.freeze({
  CAROUSEL_ITEM_HEIGHT: '--carousel-item-height',
})

// ─── IndexedDB & Network Cache Tokens ─────────────────────────────────────────
export const IDB_CONFIG = Object.freeze({
  MEDIA_DB_NAME: 'luiskr_media_disk_cache_v1',
  MEDIA_DB_VERSION: 1,
  MEDIA_STORE: 'media_blobs',
  READONLY: 'readonly',
  READWRITE: 'readwrite',
})

export const CACHE_CONFIG = Object.freeze({
  FORCE_CACHE: 'force-cache',
})

// ─── WASM Worker Action Tokens ───────────────────────────────────────────────
const _WASM_ACTION_LIST = [
  'DECODE_IMAGE_WASM',
  'DECODE_IMAGE_BATCH_WASM',
  'PROCESS_MEDIA_ANALYTICS',
  'COMPUTE_MEDIA_HASH',
  'COMPUTE_SPRING_PHYSICS',
  'DECODE_MEDIA_URL_WASM',
  'PROBE_VIDEO_WASM',
  'PREFETCH_VIDEO_WASM',
  'DECODE_VIDEO_SEGMENT_WASM',
  'DECODE_SVG_WASM',
]

export const WASM_ACTIONS = Object.freeze(
  Object.fromEntries(_WASM_ACTION_LIST.map((key) => [key, key]))
)

// ─── Centralized CSS class name tokens ──────────────────────────────────────
// Base block identifiers defined once and composed
const _B_SKELETON = 'skeleton'
const _B_SKELETON_ABOUT = `${_B_SKELETON}-about`
const _B_SKELETON_ABOUT_P = `${_B_SKELETON_ABOUT}-p`
const _B_SKELETON_FOOTER = `${_B_SKELETON}--footer`
const _B_RENDER = 'render'
const _B_RENDER_MEDIA = `${_B_RENDER}-media`
const _B_RENDER_PLACEHOLDER = `${_B_RENDER}-placeholder`
const _B_HOME_MOSAIC = 'home-mosaic'
const _B_CAROUSEL = 'carousel'
const _B_CAROUSEL_BTN = `${_B_CAROUSEL}-btn`
const _B_CAROUSEL_SLIDE = `${_B_CAROUSEL}-slide`
const _B_ABOUT = 'about'
const _B_ABOUT_PROFILE = `${_B_ABOUT}-profile`
const _B_ABOUT_PROFILE_PICTURE = `${_B_ABOUT_PROFILE}-picture`
const _B_ABOUT_PROFILE_TEXT = `${_B_ABOUT_PROFILE}-text`
const _B_AWARDS_FOOTER = 'awards-footer'
const _B_AWARDS_FOOTER_PROGRESS = `${_B_AWARDS_FOOTER}-progress`
const _B_AWARDS_FOOTER_PROGRESS_FILL = `${_B_AWARDS_FOOTER_PROGRESS}-fill`
const _B_CONTACT = 'contact'
const _B_MODAL = 'modal'
const _B_EXPAND_MODAL = 'expand-modal'
const _B_EXPAND_MODAL_CONTENT = `${_B_EXPAND_MODAL}-content`
const _B_EXPAND_MODAL_CLOSE = `${_B_EXPAND_MODAL}-close`
const _B_EXPAND_MODAL_CLOSE_BAR = `${_B_EXPAND_MODAL_CLOSE}-bar`
const _B_EXPAND_MODAL_MEDIA = `${_B_EXPAND_MODAL}-media`
const _B_EXPAND_MODAL_MEDIA_FIGURE = `${_B_EXPAND_MODAL_MEDIA}-figure`
const _B_EXPAND_MODAL_MEDIA_ITEM = `${_B_EXPAND_MODAL_MEDIA}-item`
const _B_INTERNAL = 'internal'
const _B_INTERNAL_DESCRIPTION = `${_B_INTERNAL}-description`
const _B_INTERNAL_EXTRA = `${_B_INTERNAL}-extra`
const _B_INTERNAL_FOOTER = `${_B_INTERNAL}-footer`
const _B_INTERNAL_FOOTER_ITEMS = `${_B_INTERNAL_FOOTER}-items`
const _B_DRAW_TEXT = 'draw-text'
const _B_RELATED = 'related-mosaic'
const _B_HC = 'hc'
const _B_NOT_FOUND = 'not-found'
const _B_ADMIN = 'admin'
const _B_CMS = 'cms'
const _B_NAV = 'nav'
const _B_PREF = 'pref'
const _B_PREF_OPTIONS = `${_B_PREF}-options`
const _B_PREF_OPTION = `${_B_PREF}-option`
const _B_PREF_SWITCH = `${_B_PREF}-switch`
const _B_COOKIES = 'cookies'
const _B_COOKIES_BUTTONS = `${_B_COOKIES}-buttons`
const _B_HUD = 'stats-hud'

export const CLASSES = Object.freeze({
  // Skeleton & Media
  SR_ONLY: 'sr-only',
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
  SKELETON_ABOUT_TITLE: `${_B_SKELETON_ABOUT}-title`,
  SKELETON_ABOUT_P1: `${_B_SKELETON_ABOUT_P}1`,
  SKELETON_ABOUT_P2: `${_B_SKELETON_ABOUT_P}2`,
  SKELETON_ABOUT_P3: `${_B_SKELETON_ABOUT_P}3`,
  SKELETON_ABOUT_P4: `${_B_SKELETON_ABOUT_P}4`,
  SKELETON_ABOUT_P5: `${_B_SKELETON_ABOUT_P}5`,
  SKELETON_FOOTER_LINK: `${_B_SKELETON_FOOTER}-link`,
  SKELETON_FOOTER_NOTE_1: `${_B_SKELETON_FOOTER}-note-1`,
  SKELETON_FOOTER_NOTE_2: `${_B_SKELETON_FOOTER}-note-2`,
  RENDER_MEDIA: _B_RENDER_MEDIA,
  RENDER_MEDIA_HIGH: `${_B_RENDER_MEDIA}--high`,
  RENDER_MEDIA_EXPAND: `${_B_RENDER_MEDIA}--can-expand`,
  RENDER_MEDIA_THUMB: `${_B_RENDER_MEDIA}--thumb`,
  RENDER_MEDIA_LOADED: `${_B_RENDER_MEDIA}--loaded`,
  RENDER_PLACEHOLDER: _B_RENDER_PLACEHOLDER,
  RENDER_PLACEHOLDER_FIGURE: `${_B_RENDER_PLACEHOLDER}-figure`,
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
  ABOUT_PROFILE_SECTION: `${_B_ABOUT_PROFILE}-section`,
  ABOUT_PROFILE_PICTURE: _B_ABOUT_PROFILE_PICTURE,
  ABOUT_PROFILE_PICTURE_IMG: `${_B_ABOUT_PROFILE_PICTURE}-img`,
  ABOUT_PROFILE_PICTURE_PLACEHOLDER: `${_B_ABOUT_PROFILE_PICTURE}-placeholder`,
  ABOUT_PROFILE_TEXT: _B_ABOUT_PROFILE_TEXT,
  ABOUT_PROFILE_TEXT_COL: `${_B_ABOUT_PROFILE_TEXT}-col`,
  ABOUT_ITEM: `${_B_ABOUT}-item`,
  ABOUT_ITEM_TEXT: `${_B_ABOUT}-item-text`,
  AWARDS_FOOTER: _B_AWARDS_FOOTER,
  AWARDS_FOOTER_TITLE: `${_B_AWARDS_FOOTER}-title`,
  AWARDS_FOOTER_HEADER: `${_B_AWARDS_FOOTER}-header`,
  AWARDS_FOOTER_PROGRESS:             _B_AWARDS_FOOTER_PROGRESS,
  AWARDS_FOOTER_PROGRESS_FILL:        _B_AWARDS_FOOTER_PROGRESS_FILL,
  AWARDS_FOOTER_PROGRESS_FILL_RUNNING:`${_B_AWARDS_FOOTER_PROGRESS_FILL}--running`,
  AWARDS_FOOTER_PROGRESS_HIDDEN:      `${_B_AWARDS_FOOTER_PROGRESS}--hidden`,
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
  PROJECT: 'project',
  MODAL_CLOSE_BAR: `${_B_MODAL}-close-bar`,
  MODAL_BTN: `${_B_MODAL}-btn`,
  EXPAND_MODAL_CONTENT: _B_EXPAND_MODAL_CONTENT,
  EXPAND_MODAL_CONTENT_VIDEO: `${_B_EXPAND_MODAL_CONTENT}--video`,
  EXPAND_MODAL_CLOSING: `${_B_EXPAND_MODAL}--closing`,
  EXPAND_MODAL_CLOSE_BAR: _B_EXPAND_MODAL_CLOSE_BAR,
  EXPAND_MODAL_CLOSE_BAR_TITLE: `${_B_EXPAND_MODAL_CLOSE_BAR}-title`,
  EXPAND_MODAL_CLOSE_BAR_BUTTON: `${_B_EXPAND_MODAL_CLOSE_BAR}-button`,
  EXPAND_MODAL_CLOSE_AREA: `${_B_EXPAND_MODAL_CLOSE}-area`,
  EXPAND_MODAL_CLOSE_BOTTOM: `${_B_EXPAND_MODAL_CLOSE}-bottom`,
  EXPAND_MODAL_MEDIA_FIGURE: _B_EXPAND_MODAL_MEDIA_FIGURE,
  EXPAND_MODAL_MEDIA_FIGURE_VIDEO: `${_B_EXPAND_MODAL_MEDIA_FIGURE}--video`,
  EXPAND_MODAL_MEDIA_PLACEHOLDER: `${_B_EXPAND_MODAL_MEDIA}-placeholder`,
  EXPAND_MODAL_MEDIA_ITEM: _B_EXPAND_MODAL_MEDIA_ITEM,
  EXPAND_MODAL_MEDIA_ITEM_VIDEO: `${_B_EXPAND_MODAL_MEDIA_ITEM}--video`,
  EXPAND_MODAL_OPEN_1: `${_B_EXPAND_MODAL}-open-1`,
  EXPAND_MODAL_OPEN_2: `${_B_EXPAND_MODAL}-open-2`,

  // Internal / Project
  INTERNAL: _B_INTERNAL,
  INTERNAL_TITLE: `${_B_INTERNAL}-title`,
  INTERNAL_MAIN: `${_B_INTERNAL}-main`,
  INTERNAL_MAIN_ITEM: `${_B_INTERNAL}-main-item`,
  // Zoom-to-fill modifier: cover video that intentionally fills and crops the frame.
  // Apply alongside INTERNAL_MAIN_ITEM when the video should use object-fit:cover.
  ZTF_VIDEO: 'ztf-video',
  INTERNAL_DESCRIPTION: _B_INTERNAL_DESCRIPTION,
  INTERNAL_DESCRIPTION_TEXT: `${_B_INTERNAL_DESCRIPTION}-text`,
  INTERNAL_EXTRA: _B_INTERNAL_EXTRA,
  INTERNAL_EXTRA_SCROLL: `${_B_INTERNAL_EXTRA}-scroll`,
  INTERNAL_EXTRA_ITEM: `${_B_INTERNAL_EXTRA}-item`,
  INTERNAL_FOOTER: _B_INTERNAL_FOOTER,
  INTERNAL_FOOTER_TITLE: `${_B_INTERNAL_FOOTER}-title`,
  INTERNAL_FOOTER_RELATED: `${_B_INTERNAL_FOOTER}-related`,
  INTERNAL_FOOTER_ITEMS: _B_INTERNAL_FOOTER_ITEMS,
  INTERNAL_FOOTER_ITEMS_LINK: `${_B_INTERNAL_FOOTER_ITEMS}-link`,
  INTERNAL_FOOTER_ITEMS_SEP: `${_B_INTERNAL_FOOTER_ITEMS}-separator`,
  INTERNAL_FOOTER_ITEMS_NOTE: `${_B_INTERNAL_FOOTER_ITEMS}-note`,

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
  DRAW_TEXT_SPACE: `${_B_DRAW_TEXT}__space`,
  DRAW_TEXT_VISIBLE: `${_B_DRAW_TEXT}--visible`,
  DRAW_TEXT_DONE: `${_B_DRAW_TEXT}--done`,

  // Navigation buttons
  NAV: _B_NAV,
  NAV_LINK: `${_B_NAV}-link`,
  NAV_LINK_ACTIVE: 'router-link-exact-active',
  NAV_DESKTOP: `${_B_NAV}-desktop`,
  NAV_SEPARATOR: `${_B_NAV}-separator`,
  NAV_MOBILE_STRIP: `${_B_NAV}-mobile-strip`,
  NAV_LOGO_BTN: `${_B_NAV}-logo-btn`,
  NAV_ABOUT_BTN: `${_B_NAV}-about-btn`,
  NAV_ACTION_BTN: `${_B_NAV}-action-btn`,
  NAV_PREF_BTN: `${_B_NAV}-pref-btn`,
  NAV_LANG_OPEN_BTN: `${_B_NAV}-lang-open-btn`,
  // Flag images — SVG from flagcdn.com
  FLAG_IMG: 'flag-img',
  FLAG_SPLIT: 'flag-split',

  // Preferences & Lang modal — ALL class names composed from _B_PREF
  PREF_BACKDROP:        `${_B_PREF}-backdrop`,
  PREF_DIALOG:          `${_B_PREF}-dialog`,
  PREF_HEADER:          `${_B_PREF}-header`,
  PREF_TITLE:           `${_B_PREF}-title`,
  PREF_CLOSE_BTN:       `${_B_PREF}-close-btn`,
  PREF_BODY:            `${_B_PREF}-body`,
  PREF_SECTION:         `${_B_PREF}-section`,
  PREF_SECTION_TITLE:   `${_B_PREF}-section-title`,
  PREF_SECTION_DESC:    `${_B_PREF}-section-desc`,
  PREF_OPTIONS:         _B_PREF_OPTIONS,
  PREF_OPTIONS_2:       `${_B_PREF_OPTIONS} ${_B_PREF_OPTIONS}--2`,
  PREF_OPTIONS_3:       `${_B_PREF_OPTIONS} ${_B_PREF_OPTIONS}--3`,
  PREF_OPTIONS_4:       `${_B_PREF_OPTIONS} ${_B_PREF_OPTIONS}--4`,
  PREF_OPTION_BTN:      `${_B_PREF_OPTION}-btn`,
  PREF_OPTION_ICON:     `${_B_PREF_OPTION}-icon`,
  PREF_OPTION_LABEL:    `${_B_PREF_OPTION}-label`,
  PREF_OPTION_SUB:      `${_B_PREF_OPTION}-sub`,
  PREF_STAT_CARD:       `${_B_PREF}-stat-card`,
  PREF_FOOTER:          `${_B_PREF}-footer`,
  PREF_DONE_BTN:        `${_B_PREF}-done-btn`,
  PREF_SWITCH_ROW:      `${_B_PREF_SWITCH}-row`,
  PREF_SWITCH_INFO:     `${_B_PREF_SWITCH}-info`,
  PREF_SWITCH_LABEL:    `${_B_PREF_SWITCH}-label`,
  PREF_SWITCH_DESC:     `${_B_PREF_SWITCH}-desc`,
  PREF_SWITCH:          _B_PREF_SWITCH,
  PREF_SWITCH_ON:       `${_B_PREF_SWITCH} ${_B_PREF_SWITCH}--on`,
  LANG_DIALOG:          'lang-dialog',

  // Cookie banner
  COOKIES: _B_COOKIES,
  COOKIES_INFO: `${_B_COOKIES}-info`,
  COOKIES_BUTTONS: _B_COOKIES_BUTTONS,
  COOKIES_BUTTONS_ACCEPT: `${_B_COOKIES_BUTTONS}-accept`,
  COOKIES_BUTTONS_REFUSE: `${_B_COOKIES_BUTTONS}-refuse`,

  // App layout
  PROGRESS_BAR: 'progress-bar',
  PROGRESS_BAR_ACTIVE: 'progress-bar--active',
  VIEW_OUTLET: 'view-outlet',
  SHOW_GRID: 'show-grid',
  PAGE_FADE_IN: 'page-fade-in',
  PAGE_FADE_OUT: 'page-fade-out',
  CMS_BADGE: `${_B_CMS}-badge`,

  // Additional Carousel (all composed from _B_CAROUSEL_BTN / _B_CAROUSEL_SLIDE)
  CAROUSEL_IN_VIEW: `${_B_CAROUSEL}--in-view`,
  CAROUSEL_FALLBACK: `${_B_CAROUSEL}-fallback`,
  CAROUSEL_FALLBACK_SIDE: `${_B_CAROUSEL}-fallback ${_B_CAROUSEL}-fallback--side`,
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
  HC_AWARDS: `${_B_HC}--awards`,

  // Navigation sub-class modifiers (used by AppNav delegated event handler)
  NAV_LOGO_BTN: `${_B_NAV}-logo-btn`,
  NAV_ABOUT_BTN: `${_B_NAV}-about-btn`,
  NAV_ACTION_BTN: `${_B_NAV}-action-btn`,
  NAV_PREF_BTN: `${_B_NAV}-pref-btn`,
  NAV_LANG_OPEN_BTN: `${_B_NAV}-lang-open-btn`,
  NAV_BACK: 'back',
  NAV_SCROLL_UP: 'scroll-up',
  NAV_SCROLL_DOWN: 'scroll-down',
  NAV_ACTIVE: 'active',

  // Router active-link classes (used by AppNav, Footer, Related)
  ROUTER_LINK_ACTIVE: 'router-link-active',
  ROUTER_LINK_EXACT_ACTIVE: 'router-link-exact-active',
  ACTIVE: 'active',
  IS_OPEN: 'is-open',
  IS_SAFARI: 'is-safari',
  REDUCED_MOTION: 'reduced-motion',
  DARK_MODE: 'dark-mode',
  SHOW_GRID: 'show-grid',

  // Stats HUD & Autoplay Toggle
  STATS_HUD_BASE: _B_HUD,
  STATS_HUD_VISIBLE: `${_B_HUD}--visible`,
  STATS_HUD_SEGMENT: `${_B_HUD}-segment`,
  STATS_HUD_LABEL: `${_B_HUD}-label`,
  STATS_HUD_VALUE: `${_B_HUD}-value`,
  STATS_HUD_TOGGLE: `${_B_HUD}-toggle`,
  STATS_HUD_SWITCH: `${_B_HUD}-switch`,
  STATS_HUD_SWITCH_ON: `${_B_HUD}-switch--on`,
})

// ─── Centralized DOM Selectors ──────────────────────────────────────────────
export const SELECTORS = Object.freeze({
  HOME_MOSAIC_ITEM: `.${_B_HOME_MOSAIC}-item`,
  CAROUSEL: `.${_B_CAROUSEL}`,
  CAROUSEL_TRACK: `.${_B_CAROUSEL}-track`,
  CAROUSEL_FALLBACK: `.${_B_CAROUSEL}-fallback`,
  CAROUSEL_BTN_PREV: `.${_B_CAROUSEL_BTN}--prev`,
  CAROUSEL_BTN_NEXT: `.${_B_CAROUSEL_BTN}--next`,
  CAROUSEL_BTN_RING_FILL: `.${_B_CAROUSEL_BTN}-ring-fill`,
  CAROUSEL_DOT: `.${_B_CAROUSEL}-dot`,
  CAROUSEL_COUNTER: `.${_B_CAROUSEL}-counter`,
  CAROUSEL_SLIDE_CLONE_FIRST: `.${_B_CAROUSEL_SLIDE}--clone-first`,
  CAROUSEL_SLIDE_CLONE_LAST: `.${_B_CAROUSEL_SLIDE}--clone-last`,
  CAROUSEL_SLIDES_NOT_CLONE: `.${_B_CAROUSEL_SLIDE}:not(.${_B_CAROUSEL_SLIDE}--clone)`,
  DRAW_TEXT: `.${_B_DRAW_TEXT}`,
  COOKIES_BUTTONS_ACCEPT: `.${_B_COOKIES}-buttons-accept`,
  COOKIES_BUTTONS_REFUSE: `.${_B_COOKIES}-buttons-refuse`,
  STYLE: 'style',
  DATA_CONTENT: '[data-content]',
})

// ─── UI text tokens (used by both app and tests) ──────────────────────────────

export const IDS = Object.freeze({
  APP: "app",
  MAIN: "main",
  MAIN_CONTENT: "main-content",
  VIEW_OUTLET: "view-outlet",
  ABOUT: "about",
  CONTACT: "contact",
  LANG_DIALOG_TITLE: "lang-dialog-title",
  PREF_TITLE: "pref-title",
  CRITICAL_CSS: "critical-css",
})

export const TEXT = Object.freeze({
  // Navigation actions
  SCROLL_UP: 'Back to Top',
  SCROLL_UP_ALT: 'Scroll up',
  CONTACT: 'Contact',
  RELATED: 'Related',
  ABOUT: 'About',
  ABOUT_ME: 'About Me',
  GET_IN_TOUCH: 'Get in Touch',
  LK_MONOGRAM: 'LK',
  CLICK_LABEL: 'Click',
  TAP_LABEL: 'Tap',
  SOME_MENTIONS: 'Some mentions',
  PREV_ITEM: 'Previous item',
  NEXT_ITEM: 'Next item',
  OF: 'of',
  HOME: 'Home',
  INICIO: 'Início',
  INICIO_ES: 'Inicio',
  STARTSEITE: 'Startseite',
  PRIVACY_POLICY: 'Privacy Policy',
  POLITICA_DE_PRIVACIDADE: 'Política de Privacidade',
  POLITICA_DE_PRIVACIDAD: 'Política de Privacidad',
  DATENSCHUTZ: 'Datenschutz',
  GDPR: 'GDPR',
  TERMS: 'Terms',
  PRIVACY: 'Privacy',
  TERMS_OF_USE: 'Terms of Use',
  TERMOS_DE_USO: 'Termos de Uso',
  TERMINOS_DE_USO: 'Términos de Uso',
  NUTZUNGSBEDINGUNGEN: 'Nutzungsbedingungen',
  DOT_SEP: '•',
  PIPE_SEP: '|',
  ADMIN_LOGIN: 'Admin Login',
  CMS_DASHBOARD: 'CMS Dashboard',
  PAGE_NOT_FOUND: 'Page not found',
  CARREGANDO: 'Carregando',
  CARGANDO: 'Cargando',
  LADT: 'Lädt',
  ELLIPSIS: '...',
  MSG_LOADING_BR: 'Buscando dados no servidor… Aguarde um momento!',
  MSG_LOADING_EN: 'Gathering some data on the server … Hold on just a second!',
  MSG_LOADING_EN_WS: 'Gathering some data on the server ... Hold on just a second while the Websockets are working!',
  MSG_LOADING_ES: '¡Obteniendo datos del servidor… Un momento!',
  MSG_LOADING_DE: 'Daten werden abgerufen… Bitte warten!',
  EXPLORE: 'Explore',
  CHECK_OUT: 'Check out',
  PREFERENCES: 'Preferences',
  LANGUAGE: 'Language',
  CLOSE_LANG_SELECTOR: 'Close language selector',
  CLOSE: 'Close',
  // Common labels
  FEATURED: 'Featured',
  LOADING: 'Loading',
  LOADING_DOTS: 'Loading...',
  SAVING: 'Saving...',
  SIGNING_IN: 'Signing in...',
  SIGN_IN_GOOGLE: 'Sign in with Google',
  LOGOUT: 'Logout',
  // Controls & HUD
  VIDEO_AUTOPLAY: 'Video autoplay',
  PERFORMANCE: 'Performance',
  MEMORY: 'Memory',
  NETWORK: 'Network',
  LATENCY: 'Latency',
  AI_ENGINE: 'AI Engine',
  ACCEPT: 'Accept',
  REFUSE: 'Refuse',
  TO_EXPAND: 'to expand',
  PERF_STATS_AND_CONTROLS: 'Performance stats and controls',
  VIDEO_CONTROLS: 'Video controls',
  ON: 'ON',
  OFF: 'OFF',
  FPS: 'FPS',
  CPU: 'CPU',
  NET: 'NET',
  LAT: 'LAT',
  REQ: 'REQ',
  MEM: 'MEM',
  GPU: 'GPU',
  KB_S: 'KB/s',
  MS: 'ms',
  MB: 'MB',
  DASH: '—',
  SITE_PREFERENCES: 'Site preferences (Theme & Motion)',
  GO_TO_SLIDE: 'Go to slide',
  MEDIA_PREVIEW: 'Media preview',
  LK_TITLE_PREFIX: 'Luis Krötz | ',
})

// ─── DOM Event name tokens ────────────────────────────────────────────────────
export const EVENTS = Object.freeze({
  CLICK: 'click',
  MOUSEENTER: 'mouseenter',
  MOUSELEAVE: 'mouseleave',
  MOUSEOVER: 'mouseover',
  MOUSEOUT: 'mouseout',
  MOUSEDOWN: 'mousedown',
  MOUSEUP: 'mouseup',
  SCROLL: 'scroll',
  SCROLLEND: 'scrollend',
  RESIZE: 'resize',
  TOUCHSTART: 'touchstart',
  TOUCHEND: 'touchend',
  TOUCHMOVE: 'touchmove',
  POINTERDOWN: 'pointerdown',
  KEYDOWN: 'keydown',
  KEYUP: 'keyup',
  POINTERENTER: 'pointerenter',
  FOCUS: 'focus',
  BLUR: 'blur',
  CHANGE: 'change',
  INPUT: 'input',
  SUBMIT: 'submit',
  TRANSITIONEND: 'transitionend',
  ANIMATIONEND: 'animationend',
  POPSTATE: 'popstate',
  LOADEDDATA: 'loadeddata',
  ERROR: 'error',
  COOKIE_ACTION: 'cookieAction',
  SLIDE_CHANGE:    'slidechange',
  AUTOPLAY_STOP:   'autoplaystop',
  AUTOPLAY_START:  'autoplaystart',
  CANCEL:          'cancel',
  CLOSE:           'close',
  OPEN_LANG_DIALOG: 'open-lang-dialog',
  OPEN_PREFERENCES_MODAL: 'open-preferences-modal',
  NOTIFY: 'notify',
})

// ─── Keyboard Key Tokens ──────────────────────────────────────────────────────
export const KEYS = Object.freeze({
  ESCAPE: 'Escape',
})


export { LOCALES } from './tokens/locales.js'

export const MUTATIONS = Object.freeze({
  TOGGLE_LANG_DIALOG: "toggleLangDialog",
  TOGGLE_PREFERENCES_MODAL: "togglePreferencesModal",
  TOGGLE_STATS_FOR_NERDS: "toggleStatsForNerds",
  TOGGLE_SHOW_GRID: "toggleShowGrid",
  TOGGLE_REDUCED_MOTION: "toggleReducedMotion",
  SET_LANG: "setLang",
  SET_COMPONENT_LANG: "setComponentLang",
  SET_STORAGE: "setStorage",
  SET_THEME: "setTheme",
  SET_MODAL: "setModal",
  INIT_THEME: "initTheme",
  INIT_REDUCED_MOTION: "initReducedMotion",
  APPLY_THEME: "applyTheme",
  SET_CLICK_OR_TAP: "setClickOrTap",
  SET_CAROUSEL_LANG: "setCarouselLang",
  SET_STATS_HUD_LANG: "setStatsHudLang",
  SET_INPUT_METHOD: "setInputMethod",
  SET_PORTFOLIO_LIST: "setPortfolioList",
  SET_MENTIONS: "setMentions",
  TOGGLE_VIDEO_AUTOPLAY: "toggleVideoAutoplay",
  SET_VIDEO_AUTOPLAY: "setVideoAutoplay",
  SET_HOVER: "setHover",
  SET_CLEAR: "setClear",
  SET_MARQUEE_AMOUNT: "setMarqueeAmount",
  SET_MODAL: "setModal",
  SET_ON_MOUSE_MOVE: "setOnMouseMove",
  SET_MENTIONS_ITEMS: "setMentionsItems",
})

export { BASE_HOST_STYLES } from './tokens/styles.js'
