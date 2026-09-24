/**
 * @file @core/tokens/classes.js
 * @description Centralized CSS class name tokens for the public site.
 * Composed 100% DRY from base blocks. No CMS classes here.
 */

const _B_SKELETON = 'skeleton'
const _B_SKELETON_ABOUT = `${_B_SKELETON}-about`
const _B_SKELETON_ABOUT_P = `${_B_SKELETON_ABOUT}-p`
const _B_SKELETON_FOOTER = `${_B_SKELETON}-footer`
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
  SKELETON: _B_SKELETON,
  SKELETON_SHIMMER: `${_B_SKELETON}--shimmer`,
  SKELETON_MEDIA: `${_B_SKELETON}--media`,
  SKELETON_ROUND: `${_B_SKELETON}--round`,
  SKELETON_BLOCK: `${_B_SKELETON}--block`,
  SKELETON_TITLE_SM: `${_B_SKELETON}--title-sm`,
  SKELETON_TITLE_MD: `${_B_SKELETON}--title-md`,
  SKELETON_SECTION_TITLE: `${_B_SKELETON}--section-title`,
  SKELETON_PARA_FULL: `${_B_SKELETON}--para-full`,
  SKELETON_PARA_THREE_Q: `${_B_SKELETON}--para-3q`,
  SKELETON_PARA_HALF: `${_B_SKELETON}--para-half`,
  SKELETON_CARD: `${_B_SKELETON}-card`,
  SKELETON_TEXT_GROUP: `${_B_SKELETON}-text-group`,
  SKELETON_GRID_HOME: `${_B_SKELETON}-grid-home`,
  SKELETON_MEDIA_ITEM: `${_B_SKELETON}-media-item`,
  SKELETON_MEDIA_THUMB: `${_B_SKELETON}-media-thumb`,
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
  RENDER_MEDIA_THUMB: `${_B_RENDER_MEDIA}--thumb`,
  RENDER_MEDIA_HIGH: `${_B_RENDER_MEDIA}--high`,
  RENDER_MEDIA_LOADED: `${_B_RENDER_MEDIA}--loaded`,
  RENDER_MEDIA_EXPAND: `${_B_RENDER_MEDIA}--expand`,
  RENDER_PLACEHOLDER: _B_RENDER_PLACEHOLDER,
  RENDER_PLACEHOLDER_FIGURE: `${_B_RENDER_PLACEHOLDER}-figure`,
  MEDIA_FIGURE: 'media-figure',

  // Home Mosaic
  HOME_MOSAIC: _B_HOME_MOSAIC,
  HOME_MOSAIC_ITEM: `${_B_HOME_MOSAIC}-item`,
  HOME_MOSAIC_ITEM_FEATURED: `${_B_HOME_MOSAIC}-item--featured`,
  HOME_MOSAIC_ITEM_EXPANDED: `${_B_HOME_MOSAIC}-item--expanded`,
  HOME_MOSAIC_MEDIA: `${_B_HOME_MOSAIC}-media`,
  HOME_MOSAIC_PLACEHOLDER: `${_B_HOME_MOSAIC}-placeholder`,
  HOME_MOSAIC_IMG: `${_B_HOME_MOSAIC}-img`,
  HOME_MOSAIC_BOTTOM: `${_B_HOME_MOSAIC}-bottom`,
  HOME_MOSAIC_TITLE: `${_B_HOME_MOSAIC}-title`,
  HOME_MOSAIC_TITLE_OVERLAY: `${_B_HOME_MOSAIC}-title-overlay`,
  HOME_MOSAIC_DESC: `${_B_HOME_MOSAIC}-desc`,
  HOME_MOSAIC_DETAILS: `${_B_HOME_MOSAIC}-details`,
  HOME_MOSAIC_BTN: `${_B_HOME_MOSAIC}-btn`,
  HOME_PORTFOLIO_SECTION: 'home-portfolio-section',
  HOME_SECTION_TITLE: 'home-section-title',

  // About Section
  ABOUT: _B_ABOUT,
  ABOUT_HERO: `${_B_ABOUT}-hero`,
  ABOUT_HERO_MEDIA: `${_B_ABOUT}-hero-media`,
  ABOUT_HERO_IMG: `${_B_ABOUT}-hero-img`,
  ABOUT_CONTENT: `${_B_ABOUT}-content`,
  ABOUT_TITLE: `${_B_ABOUT}-title`,
  ABOUT_MENTIONS_TITLE: `${_B_ABOUT}-mentions-title`,
  ABOUT_BODY: `${_B_ABOUT}-body`,
  ABOUT_COLUMN: `${_B_ABOUT}-column`,
  ABOUT_COLUMN_FIRST: `${_B_ABOUT}-column--first`,
  ABOUT_COLUMN_SECOND: `${_B_ABOUT}-column--second`,
  ABOUT_COLUMN_LAST: `${_B_ABOUT}-column--last`,
  ABOUT_PARAGRAPH: `${_B_ABOUT}-paragraph`,
  ABOUT_PROFILE_SECTION: `${_B_ABOUT_PROFILE}-section`,
  ABOUT_PROFILE_PICTURE: _B_ABOUT_PROFILE_PICTURE,
  ABOUT_PROFILE_PICTURE_IMG: `${_B_ABOUT_PROFILE_PICTURE}-img`,
  ABOUT_PROFILE_PICTURE_PLACEHOLDER: `${_B_ABOUT_PROFILE_PICTURE}-placeholder`,
  ABOUT_PROFILE_TEXT: _B_ABOUT_PROFILE_TEXT,
  ABOUT_PROFILE_TEXT_COL: `${_B_ABOUT_PROFILE_TEXT}-col`,
  ABOUT_ITEM: `${_B_ABOUT}-item`,
  ABOUT_ITEM_TEXT: `${_B_ABOUT}-item-text`,

  // Awards & Mentions
  AWARDS_FOOTER: _B_AWARDS_FOOTER,
  AWARDS_FOOTER_TITLE: `${_B_AWARDS_FOOTER}-title`,
  AWARDS_FOOTER_HEADER: `${_B_AWARDS_FOOTER}-header`,
  AWARDS_FOOTER_PROGRESS: _B_AWARDS_FOOTER_PROGRESS,
  AWARDS_FOOTER_PROGRESS_FILL: _B_AWARDS_FOOTER_PROGRESS_FILL,
  AWARDS_FOOTER_PROGRESS_FILL_RUNNING: `${_B_AWARDS_FOOTER_PROGRESS_FILL}--running`,
  AWARDS_FOOTER_PROGRESS_HIDDEN: `${_B_AWARDS_FOOTER_PROGRESS}--hidden`,
  AWARDS_FOOTER_LINKS: `${_B_AWARDS_FOOTER}-links`,
  AWARDS_FOOTER_ITEM: `${_B_AWARDS_FOOTER}-links-item`,
  AWARDS_FOOTER_SEP: `${_B_AWARDS_FOOTER}-links-sep`,
  AWARDS_MENTIONS: _B_AWARDS_FOOTER,
  AWARDS_LIST: `${_B_AWARDS_FOOTER}-list`,
  AWARDS_ITEM: `${_B_AWARDS_FOOTER}-item`,
  AWARDS_LINK: `${_B_AWARDS_FOOTER}-link`,
  AWARDS_TITLE: `${_B_AWARDS_FOOTER}-title`,

  // Contact Section
  CONTACT: _B_CONTACT,
  CONTACT_HERO: `${_B_CONTACT}-hero`,
  CONTACT_HERO_TITLE: `${_B_CONTACT}-hero-title`,
  CONTACT_TITLE: `${_B_CONTACT}-title`,
  CONTACT_BODY: `${_B_CONTACT}-body`,
  CONTACT_ITEM: `${_B_CONTACT}-item`,
  CONTACT_LINK: `${_B_CONTACT}-link`,
  CONTACT_LABEL: `${_B_CONTACT}-label`,
  CONTACT_VALUE: `${_B_CONTACT}-value`,
  CONTACT_SOCIAL: `${_B_CONTACT}-social`,
  CONTACT_SOCIAL_LINK: `${_B_CONTACT}-social-link`,
  CONTACT_OTHER: `${_B_CONTACT}-other`,
  CONTACT_OTHER_LINK: `${_B_CONTACT}-other-link`,
  CONTACT_SEPARATOR: `${_B_CONTACT}-social-separator`,

  // Modal Above & Media Expanded
  MODAL: _B_MODAL,
  MODAL_ABOVE: `${_B_MODAL}-above`,
  MODAL_BELOW: `${_B_MODAL}-below`,
  MODAL_OPEN: `${_B_MODAL}-open`,
  MODAL_CLOSE_BAR: `${_B_MODAL}-close-bar`,
  MODAL_BTN: `${_B_MODAL}-btn`,
  EXPAND_MODAL_CONTENT: _B_EXPAND_MODAL_CONTENT,
  EXPAND_MODAL_CONTENT_VIDEO: `${_B_EXPAND_MODAL_CONTENT}--video`,
  EXPAND_MODAL_CLOSING: `${_B_EXPAND_MODAL_CONTENT}--closing`,
  EXPAND_MODAL_CLOSE_BAR: _B_EXPAND_MODAL_CLOSE_BAR,
  EXPAND_MODAL_CLOSE_BAR_TITLE: `${_B_EXPAND_MODAL_CLOSE_BAR}-title`,
  EXPAND_MODAL_CLOSE_BAR_BUTTON: `${_B_EXPAND_MODAL_CLOSE_BAR}-button`,
  EXPAND_MODAL_CLOSE_AREA: `${_B_EXPAND_MODAL_CLOSE}-area`,
  EXPAND_MODAL_MEDIA_FIGURE: _B_EXPAND_MODAL_MEDIA_FIGURE,
  EXPAND_MODAL_MEDIA_FIGURE_VIDEO: `${_B_EXPAND_MODAL_MEDIA_FIGURE}--video`,
  EXPAND_MODAL_MEDIA_PLACEHOLDER: `${_B_EXPAND_MODAL_MEDIA}-placeholder`,
  EXPAND_MODAL_MEDIA_ITEM: _B_EXPAND_MODAL_MEDIA_ITEM,
  EXPAND_MODAL_MEDIA_ITEM_VIDEO: `${_B_EXPAND_MODAL_MEDIA_ITEM}--video`,
  EXPAND_MODAL_CLOSE_BOTTOM: `${_B_EXPAND_MODAL_CLOSE}-bottom`,
  EXPAND_MODAL_OPEN_1: `${_B_EXPAND_MODAL}-open-1`,
  EXPAND_MODAL_OPEN_2: `${_B_EXPAND_MODAL}-open-2`,

  // Project Internal Views
  INTERNAL: _B_INTERNAL,
  INTERNAL_TITLE: `${_B_INTERNAL}-title`,
  INTERNAL_MAIN: `${_B_INTERNAL}-main`,
  INTERNAL_MAIN_ITEM: `${_B_INTERNAL}-main-item`,
  INTERNAL_MAIN_MEDIA: `${_B_INTERNAL}-main-media`,
  INTERNAL_MAIN_MEDIA_VIDEO: `${_B_INTERNAL}-main-media--video`,
  INTERNAL_MAIN_MEDIA_CONTAINER: `${_B_INTERNAL}-main-media-container`,
  INTERNAL_MAIN_IMG: `${_B_INTERNAL}-main-img`,
  INTERNAL_MAIN_PLACEHOLDER: `${_B_INTERNAL}-main-placeholder`,
  INTERNAL_MAIN_VIDEO: `${_B_INTERNAL}-main-video`,
  INTERNAL_MAIN_BUTTON: `${_B_INTERNAL}-main-button`,
  INTERNAL_EXPAND: `${_B_INTERNAL}-expand`,
  ZTF_CONTAINER: 'ztf-container',
  ZTF_WRAPPER: 'ztf-wrapper',
  ZTF_SLIDE: 'ztf-slide',
  ZTF_SLIDE_VIDEO: 'ztf-slide--video',
  ZTF_MEDIA_EXPAND: 'ztf-media-expand',
  ZTF_PLACEHOLDER: 'ztf-placeholder',
  ZTF_MEDIA: 'ztf-media',
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
  FLAG_IMG: 'flag-img',
  FLAG_SPLIT: 'flag-split',

  // Preferences & Lang modal
  PREF_BACKDROP: `${_B_PREF}-backdrop`,
  PREF_DIALOG: `${_B_PREF}-dialog`,
  PREF_HEADER: `${_B_PREF}-header`,
  PREF_TITLE: `${_B_PREF}-title`,
  PREF_CLOSE_BTN: `${_B_PREF}-close-btn`,
  PREF_BODY: `${_B_PREF}-body`,
  PREF_SECTION: `${_B_PREF}-section`,
  PREF_SECTION_TITLE: `${_B_PREF}-section-title`,
  PREF_SECTION_DESC: `${_B_PREF}-section-desc`,
  PREF_OPTIONS: _B_PREF_OPTIONS,
  PREF_OPTIONS_2: `${_B_PREF_OPTIONS} ${_B_PREF_OPTIONS}--2`,
  PREF_OPTIONS_3: `${_B_PREF_OPTIONS} ${_B_PREF_OPTIONS}--3`,
  PREF_OPTIONS_4: `${_B_PREF_OPTIONS} ${_B_PREF_OPTIONS}--4`,
  PREF_OPTION_BTN: `${_B_PREF_OPTION}-btn`,
  PREF_OPTION_ICON: `${_B_PREF_OPTION}-icon`,
  PREF_OPTION_LABEL: `${_B_PREF_OPTION}-label`,
  PREF_OPTION_SUB: `${_B_PREF_OPTION}-sub`,
  PREF_STAT_CARD: `${_B_PREF}-stat-card`,
  PREF_FOOTER: `${_B_PREF}-footer`,
  PREF_DONE_BTN: `${_B_PREF}-done-btn`,
  PREF_SWITCH_ROW: `${_B_PREF_SWITCH}-row`,
  PREF_SWITCH_INFO: `${_B_PREF_SWITCH}-info`,
  PREF_SWITCH_LABEL: `${_B_PREF_SWITCH}-label`,
  PREF_SWITCH_DESC: `${_B_PREF_SWITCH}-desc`,
  PREF_SWITCH: _B_PREF_SWITCH,
  PREF_SWITCH_ON: `${_B_PREF_SWITCH} ${_B_PREF_SWITCH}--on`,
  LANG_DIALOG: 'lang-dialog',

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

  // Additional Carousel
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

  // Legal
  LEGAL: 'legal',

  // Not Found
  NOT_FOUND: _B_NOT_FOUND,
  NOT_FOUND_TITLE: `${_B_NOT_FOUND}-title`,
  NOT_FOUND_SUBTITLE: `${_B_NOT_FOUND}-subtitle`,
  NOT_FOUND_LINK: `${_B_NOT_FOUND}-link`,

  // Router active-link classes
  ROUTER_LINK_ACTIVE: 'router-link-active',
  ROUTER_LINK_EXACT_ACTIVE: 'router-link-exact-active',
  ACTIVE: 'active',
  IS_OPEN: 'is-open',
  IS_SAFARI: 'is-safari',
  REDUCED_MOTION: 'reduced-motion',
  DARK_MODE: 'dark-mode',
  SHOW_GRID: 'show-grid',

  // Stats HUD
  STATS_HUD_BASE: _B_HUD,
  STATS_HUD_VISIBLE: `${_B_HUD}--visible`,
  STATS_HUD_SEGMENT: `${_B_HUD}-segment`,
  STATS_HUD_LABEL: `${_B_HUD}-label`,
  STATS_HUD_VALUE: `${_B_HUD}-value`,
  STATS_HUD_TOGGLE: `${_B_HUD}-toggle`,
  STATS_HUD_SWITCH: `${_B_HUD}-switch`,
  STATS_HUD_SWITCH_ON: `${_B_HUD}-switch--on`,
})
