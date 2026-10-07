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
 * BEM block fragment `about` — declared once here; every domain class token composes from
 * this fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `pref` — declared once here; every domain class token composes from
 * this fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `not-found` — declared once here; every domain class token composes
 * from this fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `home-mosaic` — declared once here; every domain class token composes
 * from this fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `progress-bar` — declared once here; every domain class token composes
 * from this fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `cookies` — declared once here; every domain class token composes from
 * this fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `internal` — declared once here; every domain class token composes from
 * this fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `flag` — declared once here; every domain class token composes from
 * this fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `magnetic-cursor` — declared once here; every domain class token
 * composes from this fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `sp` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
 */
export const _B_SP = 'sp'
/**
 * BEM block fragment "b lang glass" — composed by the token groups below into full class names.
 */
export const _B_LANG_GLASS = 'lang-glass-follower'

// ─── Composed blocks — declared once, reused by the per-component class ────
// groups under tokens/classes/ and the selector token files.
/**
 * BEM block fragment `…` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `render` — declared once here; every domain class token composes from
 * this fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `…` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `…` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `…` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `awards-footer` — declared once here; every domain class token composes
 * from this fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `…` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `expand-modal` — declared once here; every domain class token composes
 * from this fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `…` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `…` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `…` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `…` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `…` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `…` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `…` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `…` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `…` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `…` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
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
 * BEM block fragment `…` — declared once here; every domain class token composes from this
 * fragment (zero-hardcoding rule 9).
 */
export const _B_SPP_ROW = `${_B_SPP}-row`
/**
 * BEM block fragment "b spp switch" — composed by the token groups below into full class names.
 */
export const _B_SPP_SWITCH = `${_B_SPP}-switch`

/**
 * Shared key token `related` — single source for a literal repeated across modules
 * (zero-hardcoding rule 5).
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
 * Shared key token `active` — single source for a literal repeated across modules
 * (zero-hardcoding rule 5).
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
 * Shared key token `earthPlayground` — single source for a literal repeated across modules
 * (zero-hardcoding rule 5).
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
 * Shared key token `preferences-modal` — single source for a literal repeated across modules
 * (zero-hardcoding rule 5).
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
 * Shared key token `view-outlet` — single source for a literal repeated across modules
 * (zero-hardcoding rule 5).
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
 * Shared key token `input` — single source for a literal repeated across modules
 * (zero-hardcoding rule 5).
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
 * Shared key token `title` — single source for a literal repeated across modules
 * (zero-hardcoding rule 5).
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
 * Shared key token `focus` — single source for a literal repeated across modules
 * (zero-hardcoding rule 5).
 */
export const _K_FOCUS = 'focus'
/**
 * Token key "k site url" — single source for the repeated literal.
 */
export const _K_SITE_URL = 'https://luiskr.com'

/**
 * Internal scalar token `data-` — composed by the token groups in this module.
 */
export const _DATA = 'data-'

/**
 * Frozen sections map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const SECTIONS = Object.freeze({
  HOME: 'home',
  ABOUT: _B_ABOUT,
  CONTACT: _B_CONTACT,
})
