/**
 * @file LangDialog.js
 * @description <lang-dialog> — locale picker: a grid of language options
 * each showing its WebGL waving flag + native label, opened genie-style
 * from the nav flag trigger and layered above the menu overlay. Selection
 * rewrites the URL to the locale and reloads translations.
 *
 * Behavior lives in `./lang-dialog/*` modules (webgl mount/teardown, sync,
 * events, locale apply, render); this class is the element facade.
 */

import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { APP_EVENTS } from '@core/tokens/events/app.js'
import { MODAL_MUTATIONS } from '@core/tokens/events/mutations.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { BaseComponent } from '@core/Component.js'
import store from '@core/store.js'
import type { CloseButtonWebGL } from '@core/utils/canvas/widgets/close-button.js'
import type { FlagWebGL } from '@core/utils/canvas/widgets/flag-webgl.js'
import { genieEnter, genieLeave } from '@core/utils/motion/genie.js'
import { bindEvents } from './lang-dialog/events.js'
import { applyLang } from './lang-dialog/locale.js'
import { renderLangDialog } from './lang-dialog/render.js'
import { syncOpenState } from './lang-dialog/sync.js'
import { destroyWebGLControls, mountWebGLControls } from './lang-dialog/webgl.js'
import preferencesStyles from '@core/sass/components/dialogs/preferences.scss?inline'

/**
 * The LangDialog — dialog class.
 */
export class LangDialog extends BaseComponent {
  _isOpen = false // local open state (fallback when the store getter is absent)
  _closeBtn: CloseButtonWebGL | null = null // CloseButtonWebGL on the header ✕ canvas
  _flags: Record<string, FlagWebGL> = {} // locale code → FlagWebGL widget map
  _closing = false // genie-leave in flight — blocks re-entry/re-render
  _wasOpen = false // previous isOpen — detects the open transition for genie-enter
  _subscribedToStore = false // store subscription landed — setter skips manual sync

  constructor() {
    super(preferencesStyles)
  }

  /** Setter/getter — controls the dialog's open state. */

  set open(val: boolean) {
    this._isOpen = !!val

    // The store subscription (onStoreUpdate) renders, mounts WebGL and runs the genie entrance.
    store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, this._isOpen)

    if (this._isMounted && !this._subscribedToStore) {
      this.onStoreUpdate()
    }
  }

  get open() {
    return this.isOpen
  }

  /** Whether the dialog is currently shown. */

  get isOpen(): boolean {
    return typeof store.getters.getLangDialogOpen === TYPE_STRINGS.FUNCTION
      ? store.getters.getLangDialogOpen()
      : this._isOpen
  }

  override onMounted() {
    this.subscribe(store)

    this._subscribedToStore = true

    this._syncOpenState()

    this._bindEvents()

    this.addScopedListener(window, APP_EVENTS.OPEN_LANG_DIALOG, () => {
      this.open = true
    })
  }

  /** Reflects the open flag into DOM state (classes, genie enter/leave). */

  _syncOpenState(): void {
    syncOpenState(this)
  }

  /** Mounts FlagWebGL widgets onto each language option + the close control. */

  _mountWebGLControls(): void {
    mountWebGLControls(this)
  }

  /** Tears down the mounted flag/close GL widgets. */

  _destroyWebGLControls(): void {
    destroyWebGLControls(this)
  }

  override onDestroy() {
    this._destroyWebGLControls()
  }

  override onStoreUpdate() {
    const justOpened = this.isOpen && !this._wasOpen

    this._wasOpen = this.isOpen

    // Re-rendering while the zoom-out plays would reset the transition
    if (this._closing) return

    // Already open and rendered: a re-render would reset the genie entrance
    if (this.isOpen && !justOpened && this.hasAttribute(COMMON_ATTRS.OPEN)) return

    this._syncOpenState()

    this._updateDom()

    this._bindEvents()

    if (this.isOpen) {
      this._mountWebGLControls()

      if (justOpened) genieEnter(this)

      const isReduced = store.getters.getReducedMotion()

      this._closeBtn?.setReducedMotion(isReduced)

      Object.values(this._flags ?? {}).forEach((f) => f?.setReducedMotion(isReduced))

      requestAnimationFrame(() => {
        const backdrop = this.$(`.${PREF_CLASSES.PREF_BACKDROP}`)

        if (backdrop) backdrop.focus()
      })
    }
  }

  override onUpdated() {
    this._syncOpenState()

    this._bindEvents()

    if (this.isOpen) {
      this._mountWebGLControls()
    }
  }

  /** Binds option clicks, backdrop click and keyboard dismissal. */

  _bindEvents(): void {
    bindEvents(this)
  }

  /** Closes the dialog through the genie-leave animation, then runs done(). */

  close(done?: () => void): void {
    if (this._closing || !this.isOpen) return

    this._closing = true

    genieLeave(this, () => {
      this._closing = false

      this._isOpen = false

      this._wasOpen = false

      store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, false)

      this._syncOpenState()

      this._destroyWebGLControls()

      this._updateDom()

      this.dispatchEvent(new CustomEvent(APP_EVENTS.CLOSE))

      done?.()
    })
  }

  /**
   * Applies the chosen locale. Same-locale selection just dismisses; a
   * real switch defers _applyLang to the genie-leave callback so the
   * dialog closes INTO the flag trigger before the locale swap re-renders.
   */
  selectLang(newLang: string | null): void {
    if (!newLang) return

    const currentLang = store.getters.getLang()

    if (currentLang === newLang) {
      this.close()

      return
    }

    this.close(() => this._applyLang(newLang))
  }

  /** Locale URL rewrite + store commit (delegate — ./lang-dialog/locale.ts). */

  _applyLang(newLang: string): void {
    applyLang(newLang)
  }

  /** JSX template (delegate — ./lang-dialog/render.tsx). */

  override render() {
    return renderLangDialog(this)
  }
}

if (!customElements.get(COMPONENT_TAGS.LANG_DIALOG)) {
  customElements.define(COMPONENT_TAGS.LANG_DIALOG, LangDialog)
}
