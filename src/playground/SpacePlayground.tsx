/**
 * @file SpacePlayground.js
 * @description <view-space-playground> — the space/earth playground route:
 * a Three.js WebGPU Earth rendered behind a control panel of sliders,
 * checkboxes and actions (screenshot, reset view, music). Settings persist
 * to localStorage; the loader stays visible until the first usable frame.
 */

import { ARIA_ATTRS } from '@/core/tokens/attrs/aria.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { VIEW_TAGS } from '@/core/tokens/elements/views.js'
import { h } from '@/core/jsx.js'
import { BaseComponent } from '@/core/Component.js'
import store from '@/core/store.js'
import { EarthBackground } from './earth-background.js'
import { CheckboxWebGL } from './space/checkbox-webgl.js'
import { SP_CLASSES } from '@/core/tokens/classes/playground.js'
import {
  loadSpaceSettings,
  type SpAction,
  type SpControl,
  type SpParamValue,
  type SpSavedSettings,
} from './space/controls.js'
import { renderSpAction, renderSpControl } from './space/panel-render.js'
import { renderSpacePlayground } from './space/render.js'
import {
  applyPersistedSettings,
  dismissSpaceLoader,
  initSpaceEarth,
  updateSpaceLoader,
} from './space/boot.js'
import {
  applySpaceDbDefaults,
  applySpaceTranslations,
  loadSpaceTranslations,
} from './space/i18n.js'
import {
  bindSpaceControls,
  destroySpaceCheckboxCanvases,
  handleSpaceAction,
  handleSpaceInput,
  mountSpaceCheckboxCanvases,
  persistSpaceParam,
  startSpacePositionLoop,
  syncSpacePanel,
} from './space/wiring.js'
import spStyles from './space-playground.scss?inline'

// ─── Space / Earth Playground ────────────────────────────────────────────────
// Immersive full-screen Earth/Moon background as a standalone experience.
// Full controls panel with collapsible groups, scroll-to-zoom, and localStorage persistence.

// BEM roots — keep the panel block a compound of `sp` so every class
// (sp-panel-row, sp-panel-group…) stays scannable in space-playground.scss.
/**
 * The SpacePlayground — playground class.
 */
export class SpacePlayground extends BaseComponent {
  _earthBg: EarthBackground | null = null // EarthBackground engine instance (WebGPU/WebGL)
  _panelOpen = true // control panel expanded vs collapsed
  _isDark = true // cached theme state for store-change detection
  _lastLocale: string | null = null // locale the labels were last fetched for
  translations: Record<string, unknown> | null = null // earth-playground label node (labels only; `defaults` is split off)
  _collapsedMap: Record<string, boolean> = {} // per-group fold state (reserved for persisted collapse)
  _savedSettings: SpSavedSettings = {} // merged localStorage param map — wins over defaults
  _posRafId: number | null = null // RAF id for the position/target readout loop
  _checkboxes: Record<string, CheckboxWebGL> = {} // param → CheckboxWebGL widget map
  _canvasEl: HTMLCanvasElement | null = null // persistent render canvas (kept across re-renders)
  _isInitializingEarth = false // re-entrancy guard while init() is in flight
  _earthReady = false // first usable frame delivered — loader dismisses

  constructor() {
    super(spStyles)
  }

  /** The WebGL canvas the EarthBackground engine renders into. */

  _getCanvasEl() {
    if (!this._canvasEl) {
      this._canvasEl = document.createElement(HTML_TAGS.CANVAS)

      this._canvasEl.className = SP_CLASSES.SP_CANVAS

      this._canvasEl.setAttribute(ARIA_ATTRS.ARIA_HIDDEN, ATTR_VALUES.TRUE)
    }

    return this._canvasEl
  }

  /** Lifecycle: loads translations, binds controls, boots the Earth engine. */

  override onMounted() {
    this.subscribe(store)

    this._isDark = document.documentElement.classList.contains(STATE_CLASSES.DARK_MODE)

    const canvas = this._getCanvasEl()

    if (this.shadowRoot && !this.shadowRoot.contains(canvas)) {
      this.shadowRoot?.insertBefore(canvas, this._contentNode)
    }

    // Load persisted settings
    const saved = loadSpaceSettings()

    if (saved) this._savedSettings = saved

    this._loadTranslations()

    this._initEarth()

    this._bindControls()

    // Start position readout loop
    this._startPositionLoop()

    // Autoplay native audio if allowed
    const audioEl = this.$<HTMLAudioElement>(`.${SP_CLASSES.SP_AUDIO}`)

    if (audioEl) {
      audioEl.play().catch(() => {})
    }

    this._mountCheckboxCanvases()
  }

  /** Lifecycle: re-mounts checkbox canvases after re-render. */

  override onUpdated() {
    const canvas = this._getCanvasEl()

    if (this.shadowRoot && !this.shadowRoot.contains(canvas)) {
      this.shadowRoot?.insertBefore(canvas, this._contentNode)
    }

    this._syncPanel()

    this._mountCheckboxCanvases()

    if (!this._earthBg && !this._isInitializingEarth) {
      this._initEarth()
    }
  }

  /** Lifecycle: destroys the Earth engine + checkbox widgets. */

  override onDestroy() {
    this._destroyCheckboxCanvases()

    this._earthBg?.destroy()

    this._earthBg = null

    this._canvasEl = null

    this._isInitializingEarth = false

    if (this._posRafId) cancelAnimationFrame(this._posRafId)

    const audioEl = this.$<HTMLAudioElement>(`.${SP_CLASSES.SP_AUDIO}`)

    if (audioEl) {
      audioEl.pause()
    }
  }

  /** Re-syncs settings on store changes. */

  override onStoreUpdate() {
    const isDark = document.documentElement.classList.contains(STATE_CLASSES.DARK_MODE)

    if (isDark !== this._isDark) {
      this._isDark = isDark
    }

    const currentLocale = store.getters.getLang()

    if (this._lastLocale && this._lastLocale !== currentLocale) {
      this._loadTranslations()
    }
  }

  /** Loads the playground label translations via SWR. */

  _loadTranslations() {
    loadSpaceTranslations(this)
  }

  /**
   * Stores the fetched playground node, merges the CMS-managed `defaults`
   * into the slider definitions (user-saved settings still win), and
   * re-renders. `defaults` is a `{ labelKey: number|boolean }` map published
   * from translations/<loc>/pages/earth-playground/defaults.
   * @private
   */

  _applyTranslations(val: Record<string, unknown> | null | undefined): void {
    applySpaceTranslations(this, val)
  }

  /**
   * Merges CMS default values into the control definitions. Keys are the
   * control `label` tokens (bloomStr, fov, …); booleans land on checkbox
   * `checked`, numbers on range `def`. The live engine + already-rendered
   * inputs are updated unless the user has an overriding saved setting.
   * @private
   */

  _applyDbDefaults(defaults: Record<string, SpParamValue> | null | undefined): void {
    applySpaceDbDefaults(this, defaults)
  }

  /**
   * Mirrors engine bootstrap progress into the loader overlay — each node is
   * optional because the loader can already be dismissed or re-rendered away.
   * @param {string} msg - progress label
   * @param {number} pct - 0-100 progress percent
   */

  _updateLoader(msg: string, pct: number): void {
    updateSpaceLoader(this, msg, pct)
  }

  /** Creates the EarthBackground engine with ready/progress callbacks. */

  _initEarth() {
    initSpaceEarth(this)
  }

  /** Hides the loading overlay after the first usable frame. */

  _dismissLoader() {
    dismissSpaceLoader(this)
  }

  /** Replays saved localStorage settings onto the panel + engine. */

  _applyPersistedSettings() {
    applyPersistedSettings(this)
  }

  /** Wires sliders, checkboxes and action buttons. */

  _bindControls() {
    bindSpaceControls(this)
  }

  /** Periodically reports camera position for the HUD/persistence. */

  _startPositionLoop() {
    startSpacePositionLoop(this)
  }

  /** Runs a button action (screenshot, reset, music toggle). */

  _handleAction(action: string | null, btn: Element): void {
    handleSpaceAction(this, action, btn)
  }

  /** Applies a slider/checkbox input to the engine and persists it. */

  _handleInput(input: HTMLInputElement): void {
    handleSpaceInput(this, input)
  }

  /** Writes one param value into the persisted settings. */

  _persistParam(param: string, val: SpParamValue): void {
    persistSpaceParam(this, param, val)
  }

  /** Pushes engine state back into the panel controls. */

  _syncPanel() {
    syncSpacePanel(this)
  }

  /** Mounts CheckboxWebGL widgets onto the panel checkboxes. */

  _mountCheckboxCanvases() {
    mountSpaceCheckboxCanvases(this)
  }

  /** Tears down the checkbox widgets. */

  _destroyCheckboxCanvases() {
    destroySpaceCheckboxCanvases(this)
  }

  // ─── Config-driven control rendering ─────────────────────────────────────
  _renderControl(ctrl: SpControl, t: Record<string, unknown>) {
    return renderSpControl(ctrl, t, this._savedSettings[ctrl.param])
  }

  _renderAction(act: SpAction, t: Record<string, unknown>) {
    return renderSpAction(act, t)
  }

  override render() {
    return renderSpacePlayground(this)
  }
}

if (!customElements.get(VIEW_TAGS.VIEW_SPACE_PLAYGROUND)) {
  customElements.define(VIEW_TAGS.VIEW_SPACE_PLAYGROUND, SpacePlayground)
}
