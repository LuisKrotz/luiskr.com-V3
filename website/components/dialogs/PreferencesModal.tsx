/**
 * @file PreferencesModal.js
 * @description <preferences-modal> — settings dialog: theme slider
 * (light/system/dark), reduced-motion/video-autoplay/grid/stats switches,
 * and the dev-tools NPU analytics readout. Opens genie-style from its nav
 * trigger; hosts ThemeSliderWebGL and SwitchWebGL widgets.
 *
 * Behavior lives in `./preferences/*` modules (types, webgl mount/teardown,
 * UI sync, render); this class is the element facade + state holder.
 */

import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { KEYS } from '@core/tokens/primitives.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'
import { ENGINE_UI_KEYS } from '@core/tokens/data/ui-keys.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { APP_EVENTS } from '@core/tokens/events/app.js'
import { KEYBOARD_EVENTS } from '@core/tokens/events/dom.js'
import { MODAL_MUTATIONS } from '@core/tokens/events/mutations.js'
import { BaseComponent } from '@core/Component.js'
import store from '@core/store.js'
import { appText } from '@core/locale/ui-text.js'
import { npuPredict } from '@core/utils/gpu/npu-predict.js'
import type { ThemeSliderWebGL } from '@core/utils/canvas/widgets/theme-slider.js'
import type { SwitchWebGL } from '@core/utils/canvas/widgets/switch-slider.js'
import type { CloseButtonWebGL } from '@core/utils/canvas/widgets/close-button.js'
import { genieEnter, genieLeave } from '@core/utils/motion/genie.js'
import { renderPreferences } from './preferences/render.js'
import { mountWebGLControls, destroyWebGLControls } from './preferences/webgl.js'
import { syncOpenState, updateSwitchesUI, updateThemeUI } from './preferences/sync.js'
import { PREF_DEFAULTS, type PrefNode } from './preferences/types.js'
import preferencesStyles from '@core/sass/components/dialogs/preferences.scss?inline'

/**
 * The PreferencesModal — modal class.
 */
export class PreferencesModal extends BaseComponent {
  _pref: PrefNode | null = null // pref.* translation node pushed by App
  _themeSlider: ThemeSliderWebGL | null = null // ThemeSliderWebGL widget on the appearance canvas
  _switches: Record<string, SwitchWebGL> | null = null // SWITCH_TYPES → SwitchWebGL widget map
  _closeBtn: CloseButtonWebGL | null = null // CloseButtonWebGL on the header ✕ canvas
  _closing = false // genie-leave in flight — blocks re-entry

  constructor() {
    super(preferencesStyles)
  }

  /** Setter/getter — the pref.* translation node for labels. */

  set pref(val: PrefNode | null) {
    this._pref = val
    if (this._isMounted) this._updateDom()
  }

  get pref(): PrefNode | null {
    return this._pref
  }

  /** Setter/getter — controls the modal's open state. */

  set open(val: boolean) {
    // The store subscription (onStoreUpdate) renders, mounts WebGL and runs the genie entrance.
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, !!val)
  }

  get open(): boolean {
    return this.isOpen
  }

  /** Convenience getter — pref translations shorthand used in render. */

  get t(): PrefNode {
    const p: Partial<PrefNode> = this.pref || {}
    return {
      title: p.title ?? PREF_DEFAULTS.title,
      done: p.done ?? PREF_DEFAULTS.done,
      closeLabel: p.closeLabel ?? PREF_DEFAULTS.closeLabel,
      appearance: { ...PREF_DEFAULTS.appearance, ...(p.appearance ?? {}) },
      devTools: { ...PREF_DEFAULTS.devTools, ...(p.devTools ?? {}) },
    }
  }

  /** Whether the modal is shown. */

  get isOpen(): boolean {
    return store.getters.getPreferencesOpen()
  }

  /** The store's theme value (light/dark/system). */

  get currentTheme(): string {
    return store.getters.getTheme()
  }

  /** Whether reduced motion is enabled. */

  get reducedMotion(): boolean {
    return store.getters.getReducedMotion()
  }

  /** Live analytics from the NPU predictor for the dev-tools readout. */

  get npuAnalytics() {
    return npuPredict.getNpuAnalytics()
  }

  /**
   * Human-readable acceleration tier for the dev-tools readout. Ordered
   * best→fallback: NPU (neural inference available) → GPU → WASM — the
   * same precedence the predictive loader uses for its math backend.
   */
  get npuStatus(): unknown {
    if (this.npuAnalytics.hasNPU) return appText(ENGINE_UI_KEYS.ENGINE_NPU)
    if (this.npuAnalytics.hasGPU) return appText(ENGINE_UI_KEYS.ENGINE_GPU)
    return appText(ENGINE_UI_KEYS.ENGINE_WASM)
  }

  override onMounted() {
    this.subscribe(store)
    this._syncOpenState()
    this._bindBackdropEvents()
    this.addScopedListener(window, APP_EVENTS.OPEN_PREFERENCES_MODAL, () => {
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
    })
  }

  override onDestroy() {
    destroyWebGLControls(this)
  }

  /** Reflects the open flag into DOM/classes and runs the genie enter/leave. */

  _syncOpenState(): void {
    syncOpenState(this)
  }

  /** Mounts the WebGL widgets onto the freshly rendered canvases. */

  _mountWebGLControls(): void {
    mountWebGLControls(this)
  }

  /** Tears down the mounted GL widgets. */

  _destroyWebGLControls(): void {
    destroyWebGLControls(this)
  }

  /**
   * Store-driven sync. Two paths:
   *   open-state flipped → full re-render + mount widgets + genie-enter
   *     (the zoom-from-trigger animation) + focus the backdrop for
   *     Escape-dismiss and screen-reader context
   *   already open → in-place sync: propagate reduced-motion to the
   *     widgets and re-derive switch/theme states without a re-render
   *     (avoids destroying canvases mid-interaction)
   */
  override onStoreUpdate() {
    const wasOpen = this.hasAttribute(COMMON_ATTRS.OPEN)

    const isNowOpen = this.isOpen

    if (wasOpen !== isNowOpen) {
      this._syncOpenState()

      this._updateDom()

      if (isNowOpen) {
        this._closing = false

        this._mountWebGLControls()

        genieEnter(this)

        requestAnimationFrame(() => {
          const backdrop = this.$(`.${PREF_CLASSES.PREF_BACKDROP}`)

          if (backdrop) backdrop.focus()
        })
      }

      return
    }

    if (isNowOpen) {
      const isReduced = store.getters.getReducedMotion()

      this._themeSlider?.setReducedMotion(isReduced)

      this._closeBtn?.setReducedMotion(isReduced)

      Object.values(this._switches ?? {}).forEach((sw) => sw?.setReducedMotion(isReduced))

      this._updateThemeUI()

      this._updateSwitchesUI()

      this._themeSlider?.setTheme(this.currentTheme)
    }
  }

  /** Syncs the theme slider widget with the store's theme. */

  _updateThemeUI(): void {
    updateThemeUI(this)
  }

  /** Syncs each switch widget with its pref value. */

  _updateSwitchesUI(): void {
    updateSwitchesUI(this)
  }

  override onUpdated() {
    this._syncOpenState()

    if (this.isOpen) {
      this._mountWebGLControls()
    }
  }

  /** Wires backdrop-dismiss: Escape only — everything else is JSX onClick. */

  _bindBackdropEvents(): void {
    this.addScopedListener(window, KEYBOARD_EVENTS.KEYDOWN, (e) => {
      if ((e as KeyboardEvent).key === KEYS.ESCAPE && this.isOpen) this.close()
    })
  }

  /**
   * Close flow: play the genie-leave shrink-back-to-trigger animation
   * first, THEN commit the closed state — committing early would unmount
   * the dialog before the animation completes (a hard vanish instead of
   * the zoom-out).
   */
  close(): void {
    if (this._closing || !this.isOpen) return

    this._closing = true

    genieLeave(this, () => {
      this._closing = false

      this._destroyWebGLControls()

      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)

      this._syncOpenState()

      this._updateDom()
    })
  }

  /** JSX template (delegate — ./preferences/render.tsx). */

  override render() {
    return renderPreferences(this)
  }
}

if (!customElements.get(COMPONENT_TAGS.PREFERENCES_MODAL)) {
  customElements.define(COMPONENT_TAGS.PREFERENCES_MODAL, PreferencesModal)
}
