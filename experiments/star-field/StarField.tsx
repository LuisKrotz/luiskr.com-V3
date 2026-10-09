/**
 * @file StarField.tsx
 * @description <view-star-field> — the star-field experiment route: a
 * three.js voyage from the Solar System out through the Milky Way's
 * famous systems and nebulae to the Andromeda galaxy. Bodies are
 * reachable two ways — pointer picking on the canvas, or the navigator
 * drawer (one focusable button per body, the keyboard/AT path) — and each
 * lazy-loads its dossier JSON into the info panel on approach/select.
 * The loader stays up until the first rendered frame; when WebGL can't
 * boot a CSS starfield fallback renders instead.
 */
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { SF_CLASSES } from '@core/tokens/classes/starfield.js'
import { KEYS } from '@core/tokens/primitives.js'
import { KEYBOARD_EVENTS } from '@core/tokens/events/dom.js'
import { h } from '@core/jsx.js'
import { BaseComponent } from '@core/Component.js'
import store from '@core/store.js'
import { StarFieldEngine } from './starfield-engine.js'
import { renderStarField } from './star/render.js'
import { dismissStarLoader, initStarFieldEngine, updateStarLoader } from './star/boot.js'
import { applyStarTranslations, loadStarTranslations } from './star/i18n.js'
import { loadDossier } from './star/dossier.js'
import { sfCatalogByGroup } from './engine/catalog.js'
import type { SFDossier } from './engine/types.js'
import sfStyles from './star-field.scss?inline'

// ─── Star Field ──────────────────────────────────────────────────────────────
// Immersive full-screen star chart as a standalone experience. Facade/state
// holder — boot/i18n/dossier/render split under star/ and the three.js scene
// under engine/.

/** Pre-built id → display-name lookup for live announcements. */
const _NAME_BY_ID = new Map(
  [...sfCatalogByGroup().values()].flat().map((def) => [def.id, def.name])
)

/**
 * The StarField — a full-viewport explorable star chart.
 */
export class StarField extends BaseComponent {
  _engine: StarFieldEngine | null = null // three.js engine instance
  _canvasEl: HTMLCanvasElement | null = null // persistent render canvas
  _isInitializing = false // re-entrancy guard while init() is in flight
  _sfReady = false // first usable frame delivered — loader dismisses
  _sfFailed = false // engine boot failed — CSS fallback renders instead
  _navOpen = false // navigator drawer open state
  _selectedId: string | null = null // dossier panel body id
  _dossier: SFDossier | null = null // resolved dossier JSON
  _dossierLoading = false // dossier fetch in flight — panel shows loading
  _liveText = '' // aria-live announcements (hover/selection names)
  _lastLocale: string | null = null // locale the labels were last fetched for
  translations: Record<string, unknown> | null = null // pages/star-field label node
  _onKeyDown: ((e: Event) => void) | null = null // Escape handler

  constructor() {
    super(sfStyles)
  }

  /** The render canvas the engine draws into — kept across re-renders. */

  _getCanvasEl() {
    if (!this._canvasEl) {
      this._canvasEl = document.createElement(HTML_TAGS.CANVAS)

      this._canvasEl.className = SF_CLASSES.SF_CANVAS

      this._canvasEl.setAttribute(ARIA_ATTRS.ARIA_HIDDEN, ATTR_VALUES.TRUE)
    }

    return this._canvasEl
  }

  /** Lifecycle: subscribes, mounts the canvas, loads labels, boots the engine. */

  override onMounted() {
    this.subscribe(store)

    const canvas = this._getCanvasEl()

    if (this.shadowRoot && !this.shadowRoot.contains(canvas)) {
      this.shadowRoot?.insertBefore(canvas, this._contentNode)
    }

    this._loadTranslations()

    this._initEngine()

    this._bindKeys()
  }

  /** Lifecycle: re-mounts the canvas after re-render + re-inits if needed. */

  override onUpdated() {
    const canvas = this._getCanvasEl()

    if (this.shadowRoot && !this.shadowRoot.contains(canvas)) {
      this.shadowRoot?.insertBefore(canvas, this._contentNode)
    }

    if (!this._engine && !this._isInitializing) {
      this._initEngine()
    }
  }

  /** Lifecycle: destroys the engine and unbinds the Escape handler. */

  override onDestroy() {
    this._engine?.destroy()

    this._engine = null

    this._canvasEl = null

    this._isInitializing = false

    this._sfReady = false

    this._sfFailed = false

    if (this._onKeyDown) {
      this.removeEventListener(KEYBOARD_EVENTS.KEYDOWN, this._onKeyDown)

      this._onKeyDown = null
    }
  }

  /** Re-fetches labels when the store pushes a locale change. */

  override onStoreUpdate() {
    const currentLocale = store.getters.getLang()

    if (this._lastLocale && this._lastLocale !== currentLocale) {
      this._loadTranslations()
    }
  }

  /** Loads the star-field label translations via SWR. */

  _loadTranslations() {
    loadStarTranslations(this)
  }

  /** Stores the fetched pages/star-field node and re-renders. */

  _applyTranslations(val: Record<string, unknown> | null | undefined): void {
    applyStarTranslations(this, val)
  }

  /** Mirrors engine bootstrap progress into the loader overlay. */

  _updateLoader(msg: string, pct: number): void {
    updateStarLoader(this, msg, pct)
  }

  /** Creates the engine with ready/select/approach/hover callbacks. */

  _initEngine() {
    initStarFieldEngine(this)
  }

  /** Hides the loading overlay after the first usable frame. */

  _dismissLoader() {
    dismissStarLoader(this)
  }

  /** Binds the Escape-key dismisser (closes panel, then the drawer). */

  _bindKeys() {
    if (this._onKeyDown) return

    this._onKeyDown = (e: Event) => {
      if ((e as KeyboardEvent).key !== KEYS.ESCAPE) return

      if (this._selectedId) {
        this._closePanel()
      } else if (this._navOpen) {
        this._toggleNav()
      }
    }

    this.addEventListener(KEYBOARD_EVENTS.KEYDOWN, this._onKeyDown)
  }

  /** Toggles the navigator drawer open/closed. */

  _toggleNav() {
    this._navOpen = !this._navOpen

    this._updateDom()
  }

  /**
   * Selection entry point — shared by nav buttons and canvas picking:
   * loads the dossier panel and flies the camera to the body.
   * @param id Catalog body id.
   */

  _selectBody(id: string) {
    this._engine?.selectBody(id)

    loadDossier(this, id)

    this._announce(id)
  }

  /** Closes the dossier panel and clears the selection. */

  _closePanel() {
    this._selectedId = null

    this._dossier = null

    this._dossierLoading = false

    this._updateDom()
  }

  /** Downloads the current frame as a PNG. */

  _takeScreenshot() {
    this._engine?.takeScreenshot()
  }

  /** Returns the camera to the overview pose. */

  _flyHome() {
    this._engine?.flyHome()
  }

  /**
   * Hover announce — updates the aria-live HUD text when the pointer
   * crosses a body so screen readers and the HUD chip both learn it.
   * @param id Hovered body id, or null on leaving.
   */

  _handleHover(id: string | null) {
    const text = id ? (_NAME_BY_ID.get(id) ?? '') : ''

    if (text === this._liveText) return

    this._liveText = text

    const live = this.$(`.${SF_CLASSES.SF_LIVE}`)

    if (live) live.textContent = text
  }

  /** Announces a selection through the same live region. */

  _announce(id: string) {
    const name = _NAME_BY_ID.get(id) ?? ''

    this._liveText = name

    const live = this.$(`.${SF_CLASSES.SF_LIVE}`)

    if (live) live.textContent = name
  }

  override render() {
    return renderStarField(this)
  }
}

if (!customElements.get(VIEW_TAGS.VIEW_STAR_FIELD)) {
  customElements.define(VIEW_TAGS.VIEW_STAR_FIELD, StarField)
}
