/**
 * @file store/state.ts
 * @description StoreState shape + initial-state factory — locale nodes,
 * theme/reduced-motion prefs (persisted values win, else OS scheme),
 * modal descriptor, input method, CDN storage base, portfolio list.
 */

import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { LOCALES } from '@core/tokens/locales.js'
import { MEDIA_QUERIES } from '@core/tokens/primitives.js'
import { DB_PATHS } from '@core/tokens/routes/paths.js'
import { INPUT_STRINGS } from '@core/tokens/strings/input.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { THEME } from '@core/tokens/theme/theme.js'
import { FALLBACK_APP } from '@core/locale/fallback.js'
import { PREF_STORAGE_KEYS } from '@core/tokens/data/storage.js'
import { CDN_URLS } from '@core/tokens/media/urls.js'

/**
 * Localized action verbs for pointer hints — 'Click' on fine-pointer
 * devices, 'Tap' on touch. Loaded per locale from APP.actions.
 */
export interface ActionTextMap {
  click: string
  tap: string
}

/**
 * The locale slice of StoreState: fetched dictionary nodes (components,
 * app, slugs) plus the DB path grammar and resolved locale code.
 * `components`/`app`/`slugs` are false/null until the Firebase fetch lands —
 * readers must treat falsy as "load pending", never as "empty".
 */
export interface LangState {
  components: unknown
  app: Record<string, unknown> | null
  slugs: Record<string, unknown> | null
  carousel: Record<string, unknown>
  statsHud: Record<string, unknown>
  database: string
  locale: string
  pagesPath: string
  projectPath: string
}

/**
 * Awards-mentions strip state — null fields mean "not loaded yet" so the
 * section renders its skeleton until the fetch resolves.
 */
export interface MentionsState {
  title: string | null
  items: unknown[] | null
}

/**
 * One media item inside the expand-modal: full-size source, thumbnail,
 * accessibility alt, intrinsic dimensions (kept so the lightbox can reserve
 * the box before the asset lands), and the video discriminator.
 */
export interface ModalMedia {
  source: string
  thumb: string
  alt: string
  width: number
  height: number
  isVideo: boolean
}

/**
 * Expand-modal descriptor written by MediaExpanded and read by the modal
 * component: `open` drives mount/visibility, `class` carries the figure's
 * orientation class so the lightbox inherits aspect styling, `transform` is
 * the carousel translateX offset at open time.
 */
export interface ModalObject {
  transform: number
  class: string
  open: boolean
  media: ModalMedia | null
}

/**
 * Last known pointer position in page coordinates — feeds the magnetic
 * cursor follower and the modal-origin calculation.
 */
export interface PagePos {
  left: number
  top: number
}

/**
 * The whole reactive state bag. Field naming follows the shape the legacy
 * CMS data already uses (clickortap, marqueeamount, portfoliolist are
 * snake/flat because they mirror DB keys verbatim — renaming would break
 * the translation payload contract).
 */
export interface StoreState {
  clickortap: string
  inputMethod: string
  actionTextMap: ActionTextMap
  has_touch: boolean
  lang: LangState
  mentions: MentionsState
  marqueeamount: number
  modalObject: ModalObject
  origin: string
  page: PagePos
  showhover: boolean
  storage: string
  reducedMotion: boolean
  theme: string
  showStatsForNerds: boolean
  showGrid: boolean
  videoAutoplay: boolean
  effectiveTheme: string
  preferencesOpen: boolean
  langDialogOpen: boolean
  modalOrigin: { x: number; y: number } | null
  portfoliolist: unknown[]
}

/**
 * One named mutation: receives an optional payload, mutates store.state,
 * and returns `false` to suppress notify() for no-op writes (any other
 * return value means "state changed, fan out").
 * @param _payload Caller-supplied mutation input.
 */
export type Mutation = (_payload?: unknown) => void | boolean

/** Map of mutation name → mutator built by createMutations(). */
export type MutationMap = Record<string, Mutation>

/**
 * Subscriber callback — invoked by notify() with the state bag after every
 * commit that didn't suppress notification.
 * @param _state The post-mutation state.
 */
export type Subscriber = (_state: StoreState) => void

/**
 * The getter facade — components read state exclusively through these
 * accessors so the StoreState layout can evolve without touching every
 * consumer. getLang (lowercase-l variant `getlang` returns the full LangState
 * slice) returns just the locale code — both spellings exist for legacy
 * call-site compatibility.
 */
export interface StoreGetters {
  getTheme: () => string
  getEffectiveTheme: () => string
  getPreferencesOpen: () => boolean
  getLangDialogOpen: () => boolean
  getModalOrigin: () => { x: number; y: number } | null
  getReducedMotion: () => boolean
  getVideoAutoplay: () => boolean
  getStatsForNerds: () => boolean
  getShowGrid: () => boolean
  getMentions: () => MentionsState
  getClickOrTap: () => string
  getInputMethod: () => string
  getHover: () => boolean
  getlang: () => LangState
  getLang: () => string
  getCarouselLang: () => Record<string, unknown>
  getStatsHudLang: () => Record<string, unknown>
  getMarqueeAmount: () => number
  getModal: () => ModalObject
  getOnMouseMove: () => PagePos
  getStorage: () => string
  getTouch: () => boolean
  getPortfolioList: () => unknown[]
  getPortfoliolist: () => unknown[]
}

/**
 * Framework-free reactive state container — the app's single source of truth.
 * Components never read each other; they read `store.getters.*` / `store.state`
 * and react via `store.commit(MUTATIONS.X)` → `notify()` → every subscriber's
 * `onStoreUpdate`. That single fan-in/fan-out is what lets a nav button click
 * in one shadow root open a dialog owned by another.
 */

/** Builds the initial StoreState — device/localStorage probing lives here. */
export const createInitialState = (): StoreState => {
  // Touch detection needs BOTH signals: `ontouchstart in window` alone is true
  // on touch-capable laptops with fine pointers, so `pointer: fine` must ALSO
  // be false (MDN: the media query distinguishes primary-input precision,
  // not mere touch capability).
  const hasTouch =
    typeof window !== TYPE_STRINGS.UNDEFINED &&
    INPUT_STRINGS.ONTOUCHSTART in window &&
    !matchMedia(MEDIA_QUERIES.POINTER_FINE).matches

  return {
    // Localized "Click"/"Tap" verb for hover hints — resolved per locale.
    clickortap: ATTR_VALUES.EMPTY,
    // 'touch' when the device reports touch without a fine pointer
    // (phone/tablet), else 'pointer' — switches hint text and hit targets.
    inputMethod: hasTouch ? COMMON_ATTRS.TOUCH : COMMON_ATTRS.POINTER,
    // EN verbs until the locale's APP.actions arrives.
    actionTextMap: { click: FALLBACK_APP.actions.click, tap: FALLBACK_APP.actions.tap },
    has_touch: hasTouch,
    // Translation layer: `components`/`app`/`slugs` are the fetched DB
    // nodes (false = "load pending"); carousel/statsHud start from the
    // build-time EN snapshot so first paint is never empty.
    lang: {
      components: false,
      app: null,
      slugs: null,
      carousel: { ...FALLBACK_APP.carousel },
      statsHud: { ...FALLBACK_APP.statsHud },
      database: DB_PATHS.TRANSLATIONS,
      locale:
        (typeof localStorage !== TYPE_STRINGS.UNDEFINED &&
          localStorage.getItem(PREF_STORAGE_KEYS.LOCALE)) ||
        LOCALES.EN,
      pagesPath: DB_PATHS.PAGES,
      projectPath: DB_PATHS.PROJECTS,
    },
    // Awards strip under the about section (title + award rows).
    mentions: {
      title: null,
      items: null,
    },
    marqueeamount: 0,
    // Expanded-media lightbox descriptor — set by MediaExpanded before it
    // mounts; `media.*` describes the item to display.
    modalObject: {
      transform: 0,
      class: ATTR_VALUES.EMPTY,
      open: false,
      media: {
        source: ATTR_VALUES.EMPTY,
        thumb: ATTR_VALUES.EMPTY,
        alt: ATTR_VALUES.EMPTY,
        width: 0,
        height: 0,
        isVideo: false,
      },
    },
    origin: typeof window !== TYPE_STRINGS.UNDEFINED ? window.location.origin : ATTR_VALUES.EMPTY,
    // Last pointer position minus 60px — the magnetic-cursor follower
    // offsets the dot so it orbits rather than covers the pointer.
    page: {
      left: 0,
      top: 0,
    },
    showhover: false,
    // Active CDN base for media URLs — rewritable via setStorage so a
    // staging bucket can be pointed at without a rebuild.
    storage: CDN_URLS.CDN_BASE,
    // Persisted reduced-motion wins; otherwise seed from the OS setting.
    reducedMotion:
      typeof localStorage !== TYPE_STRINGS.UNDEFINED &&
      localStorage.getItem(PREF_STORAGE_KEYS.REDUCED_MOTION) !== null
        ? localStorage.getItem(PREF_STORAGE_KEYS.REDUCED_MOTION) === ATTR_VALUES.TRUE
        : typeof window !== TYPE_STRINGS.UNDEFINED && window.matchMedia
          ? window.matchMedia(MEDIA_QUERIES.PREFERS_REDUCED_MOTION).matches
          : false,
    theme:
      (typeof localStorage !== TYPE_STRINGS.UNDEFINED &&
        localStorage.getItem(PREF_STORAGE_KEYS.THEME)) ||
      THEME.SYSTEM,
    showStatsForNerds:
      typeof localStorage !== TYPE_STRINGS.UNDEFINED &&
      localStorage.getItem(PREF_STORAGE_KEYS.STATS_FOR_NERDS) === ATTR_VALUES.TRUE,
    showGrid:
      typeof localStorage !== TYPE_STRINGS.UNDEFINED &&
      localStorage.getItem(PREF_STORAGE_KEYS.SHOW_GRID) === ATTR_VALUES.TRUE,
    // Autoplay defaults ON unless the user explicitly opted out ('false').
    videoAutoplay:
      typeof localStorage !== TYPE_STRINGS.UNDEFINED
        ? localStorage.getItem(PREF_STORAGE_KEYS.VIDEO_AUTOPLAY) !== ATTR_VALUES.FALSE
        : true,
    effectiveTheme: THEME.LIGHT,
    preferencesOpen: false,
    langDialogOpen: false,
    // Pixel coords of the button that opened a dialog — the genie
    // zoom-out animates the dialog scaling up from exactly there.
    modalOrigin: null,
    portfoliolist: [],
  }
}
