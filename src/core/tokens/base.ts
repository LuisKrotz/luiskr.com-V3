/**
 * @file tokens/base.js
 * @description Internal shared composites for the token modules — the
 * canonical base names (`_B_*`), shared key strings (`_K_*`) and the
 * `data-` prefix composed by every domain token file. NOT re-exported by
 * the constants barrel: these are build-time fragments, not public tokens.
 */

// ─── Shared base-name tokens ──────────────────────────────────────────────
// Canonical identifiers reused across namespaces (section ids, CMS/DB keys,
// tag names, BEM class blocks). Declared once, composed everywhere below.
/**
 * The _B_ABOUT constant.
 */
export const _B_ABOUT = 'about'
/**
 * BEM block fragment "b contact" — composed by the token groups below into full class names.
 */
export const _B_CONTACT = 'contact'
/**
 * BEM block fragment "b nav" — composed by the token groups below into full class names.
 */
export const _B_NAV = 'nav'
/**
 * The _B_PREF constant.
 */
export const _B_PREF = 'pref'
/**
 * BEM block fragment "b cms" — composed by the token groups below into full class names.
 */
export const _B_CMS = 'cms'
/**
 * BEM block fragment "b admin" — composed by the token groups below into full class names.
 */
export const _B_ADMIN = 'admin'
/**
 * The _B_NOT_FOUND constant.
 */
export const _B_NOT_FOUND = 'not-found'
/**
 * BEM block fragment "b stats hud" — composed by the token groups below into full class names.
 */
export const _B_STATS_HUD = 'stats-hud'
/**
 * BEM block fragment "b draw text" — composed by the token groups below into full class names.
 */
export const _B_DRAW_TEXT = 'draw-text'
/**
 * The _B_HOME_MOSAIC constant.
 */
export const _B_HOME_MOSAIC = 'home-mosaic'
/**
 * BEM block fragment "b media figure" — composed by the token groups below into full class names.
 */
export const _B_MEDIA_FIGURE = 'media-figure'
/**
 * BEM block fragment "b lang dialog" — composed by the token groups below into full class names.
 */
export const _B_LANG_DIALOG = 'lang-dialog'
/**
 * The _B_PROGRESS_BAR constant.
 */
export const _B_PROGRESS_BAR = 'progress-bar'
/**
 * BEM block fragment "b skeleton" — composed by the token groups below into full class names.
 */
export const _B_SKELETON = 'skeleton'
/**
 * BEM block fragment "b carousel" — composed by the token groups below into full class names.
 */
export const _B_CAROUSEL = 'carousel'
/**
 * The _B_COOKIES constant.
 */
export const _B_COOKIES = 'cookies'
/**
 * BEM block fragment "b site toast" — composed by the token groups below into full class names.
 */
export const _B_SITE_TOAST = 'site-toast'
/**
 * BEM block fragment "b modal" — composed by the token groups below into full class names.
 */
export const _B_MODAL = 'modal'
/**
 * The _B_INTERNAL constant.
 */
export const _B_INTERNAL = 'internal'
/**
 * BEM block fragment "b related" — composed by the token groups below into full class names.
 */
export const _B_RELATED = 'related-mosaic'
/**
 * BEM block fragment "b awc" — composed by the token groups below into full class names.
 */
export const _B_AWC = 'aw-c'
/**
 * The _B_FLAG constant.
 */
export const _B_FLAG = 'flag'
/**
 * BEM block fragment "b loader" — composed by the token groups below into full class names.
 */
export const _B_LOADER = 'intro-loader'
/**
 * BEM block fragment "b fluid bg" — composed by the token groups below into full class names.
 */
export const _B_FLUID_BG = 'fluid-background'
/**
 * The _B_CURSOR constant.
 */
export const _B_CURSOR = 'magnetic-cursor'
/**
 * BEM block fragment "b distort" — composed by the token groups below into full class names.
 */
export const _B_DISTORT = 'image-distort'
/**
 * BEM block fragment "b footer source" — composed by the token groups below into full class names.
 */
export const _B_FOOTER_SOURCE = 'footer-source'
/**
 * The _B_SP constant.
 */
export const _B_SP = 'sp'
/**
 * BEM block fragment "b lang glass" — composed by the token groups below into full class names.
 */
export const _B_LANG_GLASS = 'lang-glass-follower'

// ─── Composed blocks — declared once, reused by the per-component class ────
// groups under tokens/classes/ and the selector token files.
/**
 * The _B_SKELETON_ABOUT constant.
 */
export const _B_SKELETON_ABOUT = `${_B_SKELETON}-about`
/**
 * BEM block fragment "b skeleton about p" — composed by the token groups below into full class names.
 */
export const _B_SKELETON_ABOUT_P = `${_B_SKELETON_ABOUT}-p`
/**
 * BEM block fragment "b skeleton footer" — composed by the token groups below into full class names.
 */
export const _B_SKELETON_FOOTER = `${_B_SKELETON}--footer`
/**
 * The _B_RENDER constant.
 */
export const _B_RENDER = 'render'
/**
 * BEM block fragment "b render media" — composed by the token groups below into full class names.
 */
export const _B_RENDER_MEDIA = `${_B_RENDER}-media`
/**
 * BEM block fragment "b render placeholder" — composed by the token groups below into full class names.
 */
export const _B_RENDER_PLACEHOLDER = `${_B_RENDER}-placeholder`
/**
 * The _B_CAROUSEL_BTN constant.
 */
export const _B_CAROUSEL_BTN = `${_B_CAROUSEL}-btn`
/**
 * BEM block fragment "b carousel slide" — composed by the token groups below into full class names.
 */
export const _B_CAROUSEL_SLIDE = `${_B_CAROUSEL}-slide`
/**
 * BEM block fragment "b carousel dot" — composed by the token groups below into full class names.
 */
export const _B_CAROUSEL_DOT = `${_B_CAROUSEL}-dot`
/**
 * The _B_CAROUSEL_BTN_RING constant.
 */
export const _B_CAROUSEL_BTN_RING = `${_B_CAROUSEL_BTN}-ring`
/**
 * BEM block fragment "b carousel slide clone" — composed by the token groups below into full class names.
 */
export const _B_CAROUSEL_SLIDE_CLONE = `${_B_CAROUSEL_SLIDE}--clone`
/**
 * BEM block fragment "b about profile" — composed by the token groups below into full class names.
 */
export const _B_ABOUT_PROFILE = `${_B_ABOUT}-profile`
/**
 * The _B_ABOUT_PROFILE_PICTURE constant.
 */
export const _B_ABOUT_PROFILE_PICTURE = `${_B_ABOUT_PROFILE}-picture`
/**
 * BEM block fragment "b about profile text" — composed by the token groups below into full class names.
 */
export const _B_ABOUT_PROFILE_TEXT = `${_B_ABOUT_PROFILE}-text`
/**
 * BEM block fragment "b about item" — composed by the token groups below into full class names.
 */
export const _B_ABOUT_ITEM = `${_B_ABOUT}-item`
/**
 * The _B_AWARDS_FOOTER constant.
 */
export const _B_AWARDS_FOOTER = 'awards-footer'
/**
 * BEM block fragment "b awards footer progress" — composed by the token groups below into full class names.
 */
export const _B_AWARDS_FOOTER_PROGRESS = `${_B_AWARDS_FOOTER}-progress`
/**
 * BEM block fragment "b awards footer progress fill" — composed by the token groups below into full class names.
 */
export const _B_AWARDS_FOOTER_PROGRESS_FILL = `${_B_AWARDS_FOOTER_PROGRESS}-fill`
/**
 * The _B_AWARDS_FOOTER_LINKS constant.
 */
export const _B_AWARDS_FOOTER_LINKS = `${_B_AWARDS_FOOTER}-links`
/**
 * BEM block fragment "b contact social" — composed by the token groups below into full class names.
 */
export const _B_CONTACT_SOCIAL = `${_B_CONTACT}-social`
/**
 * BEM block fragment "b contact other" — composed by the token groups below into full class names.
 */
export const _B_CONTACT_OTHER = `${_B_CONTACT}-other`
/**
 * The _B_EXPAND_MODAL constant.
 */
export const _B_EXPAND_MODAL = 'expand-modal'
/**
 * BEM block fragment "b expand modal content" — composed by the token groups below into full class names.
 */
export const _B_EXPAND_MODAL_CONTENT = `${_B_EXPAND_MODAL}-content`
/**
 * BEM block fragment "b expand modal close" — composed by the token groups below into full class names.
 */
export const _B_EXPAND_MODAL_CLOSE = `${_B_EXPAND_MODAL}-close`
/**
 * The _B_EXPAND_MODAL_CLOSE_BAR constant.
 */
export const _B_EXPAND_MODAL_CLOSE_BAR = `${_B_EXPAND_MODAL_CLOSE}-bar`
/**
 * BEM block fragment "b expand modal media" — composed by the token groups below into full class names.
 */
export const _B_EXPAND_MODAL_MEDIA = `${_B_EXPAND_MODAL}-media`
/**
 * BEM block fragment "b expand modal media figure" — composed by the token groups below into full class names.
 */
export const _B_EXPAND_MODAL_MEDIA_FIGURE = `${_B_EXPAND_MODAL_MEDIA}-figure`
/**
 * The _B_EXPAND_MODAL_MEDIA_ITEM constant.
 */
export const _B_EXPAND_MODAL_MEDIA_ITEM = `${_B_EXPAND_MODAL_MEDIA}-item`
/**
 * BEM block fragment "b internal description" — composed by the token groups below into full class names.
 */
export const _B_INTERNAL_DESCRIPTION = `${_B_INTERNAL}-description`
/**
 * BEM block fragment "b internal extra" — composed by the token groups below into full class names.
 */
export const _B_INTERNAL_EXTRA = `${_B_INTERNAL}-extra`
/**
 * The _B_INTERNAL_FOOTER constant.
 */
export const _B_INTERNAL_FOOTER = `${_B_INTERNAL}-footer`
/**
 * BEM block fragment "b internal footer items" — composed by the token groups below into full class names.
 */
export const _B_INTERNAL_FOOTER_ITEMS = `${_B_INTERNAL_FOOTER}-items`
/**
 * BEM block fragment "b internal main" — composed by the token groups below into full class names.
 */
export const _B_INTERNAL_MAIN = `${_B_INTERNAL}-main`
/**
 * The _B_PREF_OPTIONS constant.
 */
export const _B_PREF_OPTIONS = `${_B_PREF}-options`
/**
 * BEM block fragment "b pref option" — composed by the token groups below into full class names.
 */
export const _B_PREF_OPTION = `${_B_PREF}-option`
/**
 * BEM block fragment "b pref switch" — composed by the token groups below into full class names.
 */
export const _B_PREF_SWITCH = `${_B_PREF}-switch`
/**
 * The _B_PREF_THEME constant.
 */
export const _B_PREF_THEME = `${_B_PREF}-theme`
/**
 * BEM block fragment "b pref backdrop" — composed by the token groups below into full class names.
 */
export const _B_PREF_BACKDROP = `${_B_PREF}-backdrop`
/**
 * BEM block fragment "b pref close" — composed by the token groups below into full class names.
 */
export const _B_PREF_CLOSE = `${_B_PREF}-close`
/**
 * The _B_PREF_SECTION constant.
 */
export const _B_PREF_SECTION = `${_B_PREF}-section`
/**
 * BEM block fragment "b pref theme btn" — composed by the token groups below into full class names.
 */
export const _B_PREF_THEME_BTN = `${_B_PREF_THEME}-btn`
/**
 * BEM block fragment "b cookies buttons" — composed by the token groups below into full class names.
 */
export const _B_COOKIES_BUTTONS = `${_B_COOKIES}-buttons`
/**
 * The _B_FLAG_CANVAS constant.
 */
export const _B_FLAG_CANVAS = `${_B_FLAG}-canvas`
/**
 * BEM block fragment "b nav burger" — composed by the token groups below into full class names.
 */
export const _B_NAV_BURGER = `${_B_NAV}-burger`
/**
 * BEM block fragment "b nav menu modal" — composed by the token groups below into full class names.
 */
export const _B_NAV_MENU_MODAL = `${_B_NAV}-menu-modal`
/**
 * The _B_AWC_DOT constant.
 */
export const _B_AWC_DOT = `${_B_AWC}-dot`
/**
 * BEM block fragment "b awc slide" — composed by the token groups below into full class names.
 */
export const _B_AWC_SLIDE = `${_B_AWC}-slide`
/**
 * BEM block fragment "b awc slide clone" — composed by the token groups below into full class names.
 */
export const _B_AWC_SLIDE_CLONE = `${_B_AWC_SLIDE}--clone`
/**
 * The _B_AWC_BTN constant.
 */
export const _B_AWC_BTN = `${_B_AWC}-btn`
/**
 * BEM block fragment "b awc btn ring" — composed by the token groups below into full class names.
 */
export const _B_AWC_BTN_RING = `${_B_AWC_BTN}-ring`
/**
 * BEM block fragment "b awc award" — composed by the token groups below into full class names.
 */
export const _B_AWC_AWARD = `${_B_AWC}-award`
/**
 * The _B_SPP constant.
 */
export const _B_SPP = `${_B_SP}-panel`
/**
 * BEM block fragment "b spp range" — composed by the token groups below into full class names.
 */
export const _B_SPP_RANGE = `${_B_SPP}-range`
/**
 * BEM block fragment "b spp check" — composed by the token groups below into full class names.
 */
export const _B_SPP_CHECK = `${_B_SPP}-check`
/**
 * The _B_SPP_ROW constant.
 */
export const _B_SPP_ROW = `${_B_SPP}-row`
/**
 * BEM block fragment "b spp switch" — composed by the token groups below into full class names.
 */
export const _B_SPP_SWITCH = `${_B_SPP}-switch`

/**
 * The _K_RELATED constant.
 */
export const _K_RELATED = 'related'
/**
 * Token key "k home" — single source for the repeated literal.
 */
export const _K_HOME = 'HOME'
/**
 * Token key "k close" — single source for the repeated literal.
 */
export const _K_CLOSE = 'close'
/**
 * The _K_ACTIVE constant.
 */
export const _K_ACTIVE = 'active'
/**
 * Token key "k privacy policy" — single source for the repeated literal.
 */
export const _K_PRIVACY_POLICY = 'privacy-policy'
/**
 * Token key "k terms of use" — single source for the repeated literal.
 */
export const _K_TERMS_OF_USE = 'terms-of-use'
/**
 * The _K_EARTH_PLAYGROUND constant.
 */
export const _K_EARTH_PLAYGROUND = 'earthPlayground'
/**
 * Token key "k about section" — single source for the repeated literal.
 */
export const _K_ABOUT_SECTION = 'about-section'
/**
 * Token key "k legal footer" — single source for the repeated literal.
 */
export const _K_LEGAL_FOOTER = 'legal-footer'
/**
 * The _K_PREFERENCES_MODAL constant.
 */
export const _K_PREFERENCES_MODAL = 'preferences-modal'
/**
 * Token key "k media" — single source for the repeated literal.
 */
export const _K_MEDIA = 'media'
/**
 * Token key "k source code" — single source for the repeated literal.
 */
export const _K_SOURCE_CODE = 'source-code'
/**
 * The _K_VIEW_OUTLET constant.
 */
export const _K_VIEW_OUTLET = 'view-outlet'
/**
 * Token key "k router link exact active" — single source for the repeated literal.
 */
export const _K_ROUTER_LINK_EXACT_ACTIVE = 'router-link-exact-active'
/**
 * Token key "k system" — single source for the repeated literal.
 */
export const _K_SYSTEM = 'system'
/**
 * The _K_INPUT constant.
 */
export const _K_INPUT = 'input'
/**
 * Token key "k style" — single source for the repeated literal.
 */
export const _K_STYLE = 'style'
/**
 * Token key "k dialog" — single source for the repeated literal.
 */
export const _K_DIALOG = 'dialog'
/**
 * The _K_TITLE constant.
 */
export const _K_TITLE = 'title'
/**
 * Token key "k touchstart" — single source for the repeated literal.
 */
export const _K_TOUCHSTART = 'touchstart'
/**
 * Token key "k pointerenter" — single source for the repeated literal.
 */
export const _K_POINTERENTER = 'pointerenter'
/**
 * The _K_FOCUS constant.
 */
export const _K_FOCUS = 'focus'
/**
 * Token key "k site url" — single source for the repeated literal.
 */
export const _K_SITE_URL = 'https://luiskr.com'

/**
 * The _DATA constant.
 */
export const _DATA = 'data-'

/**
 * The sections helper.
 */
export const SECTIONS = Object.freeze({
  HOME: 'home',
  ABOUT: _B_ABOUT,
  CONTACT: _B_CONTACT,
})
