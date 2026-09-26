import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import { TAGS, THEME, MOTION, CLASSES, EVENTS, KEYS, ATTRS, MUTATIONS, STRINGS, IDS } from '../core/constants.js'
import { npuPredict } from '../utils/npu-predict.js'
import { ThemeSliderWebGL } from '../utils/canvas/theme-slider.js'
import { SwitchWebGL } from '../utils/canvas/switch-slider.js'
import { CloseButtonWebGL } from '../utils/canvas/close-button.js'
import preferencesStyles from '../sass/components/preferences.scss?inline'

const DEFAULTS = {
  title: 'Preferences',
  done: 'Done',
  appearance: {
    title: 'Appearance',
    desc: 'Choose how the site looks',
    system: { label: 'System', sub: 'Follow OS' },
    dark:   { label: 'Dark',   sub: 'Dark mode' },
    light:  { label: 'Light',  sub: 'Light mode' },
  },
  devTools: {
    title:              'Developer Tools',
    statsForNerds:      'Stats for Nerds',
    statsForNerdsDesc:  'Live FPS, network, memory HUD — bottom-right corner',
    showGrid:           'Show Grid',
    showGridDesc:       'Overlay columns, gutters and max-area at every breakpoint',
    reducedMotion:      'Reduced Motion',
    reducedMotionDesc:  'Disable animations and transitions',
  },
  closeLabel: 'Close preferences',
}

export class PreferencesModal extends BaseComponent {
  constructor() {
    super(preferencesStyles)

    this._pref = null

    this._themeSlider = null

    this._switches = null

    this._closeBtn = null
  }

  set pref(val) {
    this._pref = val
    if (this._isMounted) this._updateDom()
  }

  get pref() {
    return this._pref
  }

  set open(val) {
    store.commit(MUTATIONS.TOGGLE_PREFERENCES_MODAL, !!val)
    if (this._isMounted) {
      this._syncOpenState()
      this._updateDom()
      if (this.isOpen) {
        requestAnimationFrame(() => {
          const backdrop = this.$(`.${CLASSES.PREF_BACKDROP}`)
          if (backdrop) backdrop.focus()
        })
      }
    }
  }

  get open() {
    return this.isOpen
  }

  get t() {
    const p = this.pref || {}
    return {
      title:      p.title      ?? DEFAULTS.title,
      done:       p.done       ?? DEFAULTS.done,
      closeLabel: p.closeLabel ?? DEFAULTS.closeLabel,
      appearance: { ...DEFAULTS.appearance, ...(p.appearance ?? {}) },
      devTools:   { ...DEFAULTS.devTools,   ...(p.devTools   ?? {}) },
      earth:      { ...DEFAULTS.earth,      ...(p.earth      ?? {}) },
    }
  }

  get isOpen() {
    return store.getters.getPreferencesOpen()
  }

  get currentTheme() {
    return store.getters.getTheme()
  }

  get reducedMotion() {
    return store.getters.getReducedMotion()
  }

  get npuAnalytics() {
    return npuPredict.getNpuAnalytics()
  }

  get npuStatus() {
    if (this.npuAnalytics.hasNPU) return 'NPU Hardware Active'
    if (this.npuAnalytics.hasGPU) return 'GPU Hardware Active'
    return 'WASM Worker Active'
  }

  onMounted() {
    this.subscribe(store)
    this._syncOpenState()
    this._bindBackdropEvents()
    this.addScopedListener(window, EVENTS.OPEN_PREFERENCES_MODAL, () => {
      store.commit(MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
    })
  }

  onDestroy() {
    this._destroyWebGLControls()
  }

  _syncOpenState() {
    if (this.isOpen) {
      this.setAttribute(ATTRS.OPEN, ATTRS.EMPTY)

      this.classList.add(CLASSES.IS_OPEN)
    } else {
      this.removeAttribute(ATTRS.OPEN)

      this.classList.remove(CLASSES.IS_OPEN)

      this._destroyWebGLControls()
    }
  }

  _mountWebGLControls() {
    if (!this.isOpen) return

    if (typeof window === STRINGS.UNDEFINED) return

    const themeCanvas = this.$(`.${CLASSES.PREF_THEME_CANVAS}`)

    if (themeCanvas) {
      if (this._themeSlider && this._themeSlider.canvas !== themeCanvas) {
        this._themeSlider.destroy()

        this._themeSlider = null
      }

      if (!this._themeSlider) {
        this._themeSlider = new ThemeSliderWebGL(
          themeCanvas,
          this.currentTheme,
          (newTheme) => {
            store.commit(MUTATIONS.SET_THEME, newTheme)
          }
        )
      }
    }

    if (!this._switches) {
      this._switches = {}
    }

    const switchCanvases = this.$$(`.${CLASSES.PREF_SWITCH_CANVAS}`)

    switchCanvases.forEach((canvas) => {
      const type = canvas.getAttribute('data-switch')

      if (!type) return

      let active = false

      if (type === 'stats') active = store.getters.getStatsForNerds()
      else if (type === 'grid') active = store.getters.getShowGrid()
      else if (type === 'motion') active = this.reducedMotion

      const existing = this._switches[type]

      if (existing && existing.canvas !== canvas) {
        existing.destroy()

        delete this._switches[type]
      }

      if (!this._switches[type]) {
        this._switches[type] = new SwitchWebGL(canvas, type, active, () => {
          if (type === 'stats') store.commit(MUTATIONS.TOGGLE_STATS_FOR_NERDS)
          else if (type === 'grid') store.commit(MUTATIONS.TOGGLE_SHOW_GRID)
          else if (type === 'motion') store.commit(MUTATIONS.TOGGLE_REDUCED_MOTION)
        })
      }
    })

    const closeCanvas = this.$(`.${CLASSES.PREF_CLOSE_CANVAS}`)

    if (closeCanvas) {
      if (this._closeBtn && this._closeBtn.canvas !== closeCanvas) {
        this._closeBtn.destroy()

        this._closeBtn = null
      }

      if (!this._closeBtn) {
        this._closeBtn = new CloseButtonWebGL(closeCanvas, () => this.close())
      }
    }
  }

  _destroyWebGLControls() {
    if (this._themeSlider) {
      this._themeSlider.destroy()

      this._themeSlider = null
    }

    if (this._switches) {
      Object.values(this._switches).forEach((sw) => sw.destroy())

      this._switches = null
    }

    if (this._closeBtn) {
      this._closeBtn.destroy()

      this._closeBtn = null
    }
  }

  onStoreUpdate() {
    const wasOpen = this.hasAttribute(ATTRS.OPEN)

    const isNowOpen = this.isOpen

    if (wasOpen !== isNowOpen) {
      this._syncOpenState()

      this._updateDom()

      if (isNowOpen) {
        this._mountWebGLControls()

        requestAnimationFrame(() => {
          const backdrop = this.$(`.${CLASSES.PREF_BACKDROP}`)

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

  _updateThemeUI() {
    const theme = this.currentTheme

    const buttons = this.$$(`.${CLASSES.PREF_THEME_BTN}`)

    buttons.forEach((btn) => {
      const btnTheme = btn.getAttribute('data-theme')

      const isActive = btnTheme === theme

      btn.classList.toggle(CLASSES.PREF_THEME_BTN_ACTIVE, isActive)

      btn.classList.toggle(CLASSES.ACTIVE, isActive)
    })
  }

  _updateSwitchesUI() {
    const statsForNerds = store.getters.getStatsForNerds()

    const showGrid = store.getters.getShowGrid()

    const reduced = this.reducedMotion

    this._switches?.['stats']?.setActive(statsForNerds)

    this._switches?.['grid']?.setActive(showGrid)

    this._switches?.['motion']?.setActive(reduced)

    const nerdsBtn = this.$(`button[aria-label="${this.t.devTools.statsForNerds}"]`)

    if (nerdsBtn) {
      nerdsBtn.className = statsForNerds ? CLASSES.PREF_SWITCH_ON : CLASSES.PREF_SWITCH

      nerdsBtn.setAttribute(ATTRS.ARIA_CHECKED, String(statsForNerds))
    }

    const gridBtn = this.$(`button[aria-label="${this.t.devTools.showGrid}"]`)

    if (gridBtn) {
      gridBtn.className = showGrid ? CLASSES.PREF_SWITCH_ON : CLASSES.PREF_SWITCH

      gridBtn.setAttribute(ATTRS.ARIA_CHECKED, String(showGrid))
    }

    const motionBtn = this.$(`button[aria-label="${this.t.devTools.reducedMotion}"]`)

    if (motionBtn) {
      motionBtn.className = reduced ? CLASSES.PREF_SWITCH_ON : CLASSES.PREF_SWITCH

      motionBtn.setAttribute(ATTRS.ARIA_CHECKED, String(reduced))
    }
  }

  onUpdated() {
    this._syncOpenState()

    if (this.isOpen) {
      this._mountWebGLControls()
    }
  }

  // Only backdrop + Escape — everything else is JSX onClick
  _bindBackdropEvents() {
    this.addScopedListener(window, EVENTS.KEYDOWN, (e) => {
      if (e.key === KEYS.ESCAPE && this.isOpen) this.close()
    })
  }

  close() {
    this._destroyWebGLControls()

    store.commit(MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)

    this._syncOpenState()

    this._updateDom()
  }

  render() {
    if (!this.isOpen) return null

    const t = this.t
    const theme = this.currentTheme
    const reduced = this.reducedMotion
    const statsForNerds = store.getters.getStatsForNerds()
    const showGrid = store.getters.getShowGrid()

    return (
      <div
        className={CLASSES.PREF_BACKDROP}
        tabIndex="-1"
        onClick={(e) => {
          if (e.target === e.currentTarget) this.close()
        }}
      >
        <div className={CLASSES.PREF_DIALOG} role={ATTRS.ROLE_DIALOG} aria-modal={ATTRS.TRUE} aria-labelledby="pref-title">
          <header className={CLASSES.PREF_HEADER}>
            <h2 id="pref-title" className={CLASSES.PREF_TITLE}>{t.title}</h2>
            <button
              className={CLASSES.PREF_CLOSE_BTN}
              aria-label={t.closeLabel}
              type={ATTRS.BUTTON}
              onClick={() => this.close()}
            >
              <canvas className={CLASSES.PREF_CLOSE_CANVAS} />
            </button>
          </header>

          <div className={CLASSES.PREF_BODY}>
            <svg
              width="0"
              height="0"
              style="position:absolute;width:0;height:0;pointer-events:none;overflow:hidden;"
              aria-hidden={ATTRS.TRUE}
            >
              <filter
                id={IDS.FILTER}
                color-interpolation-filters="linearRGB"
                filterUnits="objectBoundingBox"
                primitiveUnits="userSpaceOnUse"
              >
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="SourceGraphic"
                  scale="5"
                  xChannelSelector="A"
                  yChannelSelector="A"
                  x="5"
                  y="-5"
                  width="100%"
                  height="100%"
                  result="displacementMap"
                />
              </filter>
            </svg>

            <section className={CLASSES.PREF_SECTION}>
              <h3 className={CLASSES.PREF_SECTION_TITLE}>{t.appearance.title}</h3>
              <p className={CLASSES.PREF_SECTION_DESC}>{t.appearance.desc}</p>
              <div className={CLASSES.PREF_THEME_WRAPPER}>
                <div
                  className={CLASSES.PREF_THEME_SLIDER}
                  role={ATTRS.ROLE_GROUP}
                  aria-label={t.appearance.title}
                >
                  <canvas className={CLASSES.PREF_THEME_CANVAS} />
                </div>
                <div className={CLASSES.PREF_THEME_LABELS}>
                  <button
                    className={`${CLASSES.PREF_THEME_BTN}${theme === THEME.DARK ? ` ${CLASSES.PREF_THEME_BTN_ACTIVE} ${CLASSES.ACTIVE}` : ATTRS.EMPTY}`}
                    data-theme={THEME.DARK}
                    type={ATTRS.BUTTON}
                    onClick={() => store.commit(MUTATIONS.SET_THEME, THEME.DARK)}
                  >
                    <span>🌙</span>
                    <span>{t.appearance.dark.label}</span>
                  </button>
                  <button
                    className={`${CLASSES.PREF_THEME_BTN}${theme === THEME.SYSTEM ? ` ${CLASSES.PREF_THEME_BTN_ACTIVE} ${CLASSES.ACTIVE}` : ATTRS.EMPTY}`}
                    data-theme={THEME.SYSTEM}
                    type={ATTRS.BUTTON}
                    onClick={() => store.commit(MUTATIONS.SET_THEME, THEME.SYSTEM)}
                  >
                    <span>⚙️</span>
                    <span>{t.appearance.system.label}</span>
                  </button>
                  <button
                    className={`${CLASSES.PREF_THEME_BTN}${theme === THEME.LIGHT ? ` ${CLASSES.PREF_THEME_BTN_ACTIVE} ${CLASSES.ACTIVE}` : ATTRS.EMPTY}`}
                    data-theme={THEME.LIGHT}
                    type={ATTRS.BUTTON}
                    onClick={() => store.commit(MUTATIONS.SET_THEME, THEME.LIGHT)}
                  >
                    <span>☀️</span>
                    <span>{t.appearance.light.label}</span>
                  </button>
                </div>
              </div>
            </section>

            <section className={CLASSES.PREF_SECTION}>
              <h3 className={CLASSES.PREF_SECTION_TITLE}>{t.devTools.title}</h3>
              <div
                className={CLASSES.PREF_SWITCH_ROW}
                role={ATTRS.ROLE_GROUP}
                onClick={(e) => {
                  if (!e.target.closest(TAGS.BUTTON)) store.commit(MUTATIONS.TOGGLE_STATS_FOR_NERDS)
                }}
              >
                <div className={CLASSES.PREF_SWITCH_INFO}>
                  <span className={CLASSES.PREF_SWITCH_LABEL}>{t.devTools.statsForNerds}</span>
                  <span className={CLASSES.PREF_SWITCH_DESC}>{t.devTools.statsForNerdsDesc}</span>
                </div>
                <button
                  className={statsForNerds ? CLASSES.PREF_SWITCH_ON : CLASSES.PREF_SWITCH}
                  aria-checked={String(statsForNerds)}
                  aria-label={t.devTools.statsForNerds}
                  role={ATTRS.ROLE_SWITCH}
                  type={ATTRS.BUTTON}
                  onClick={(e) => { e.stopPropagation(); store.commit(MUTATIONS.TOGGLE_STATS_FOR_NERDS) }}
                >
                  <canvas className={CLASSES.PREF_SWITCH_CANVAS} data-switch="stats" />
                </button>
              </div>
              <div
                className={CLASSES.PREF_SWITCH_ROW}
                role={ATTRS.ROLE_GROUP}
                onClick={(e) => {
                  if (!e.target.closest(TAGS.BUTTON)) store.commit(MUTATIONS.TOGGLE_SHOW_GRID)
                }}
              >
                <div className={CLASSES.PREF_SWITCH_INFO}>
                  <span className={CLASSES.PREF_SWITCH_LABEL}>{t.devTools.showGrid}</span>
                  <span className={CLASSES.PREF_SWITCH_DESC}>{t.devTools.showGridDesc}</span>
                </div>
                <button
                  className={showGrid ? CLASSES.PREF_SWITCH_ON : CLASSES.PREF_SWITCH}
                  aria-checked={String(showGrid)}
                  aria-label={t.devTools.showGrid}
                  role={ATTRS.ROLE_SWITCH}
                  type={ATTRS.BUTTON}
                  onClick={(e) => { e.stopPropagation(); store.commit(MUTATIONS.TOGGLE_SHOW_GRID) }}
                >
                  <canvas className={CLASSES.PREF_SWITCH_CANVAS} data-switch="grid" />
                </button>
              </div>
              <div
                className={CLASSES.PREF_SWITCH_ROW}
                role={ATTRS.ROLE_GROUP}
                onClick={(e) => {
                  if (!e.target.closest(TAGS.BUTTON)) store.commit(MUTATIONS.TOGGLE_REDUCED_MOTION)
                }}
              >
                <div className={CLASSES.PREF_SWITCH_INFO}>
                  <span className={CLASSES.PREF_SWITCH_LABEL}>{t.devTools.reducedMotion}</span>
                  <span className={CLASSES.PREF_SWITCH_DESC}>{t.devTools.reducedMotionDesc}</span>
                </div>
                <button
                  className={reduced ? CLASSES.PREF_SWITCH_ON : CLASSES.PREF_SWITCH}
                  aria-checked={String(reduced)}
                  aria-label={t.devTools.reducedMotion}
                  role={ATTRS.ROLE_SWITCH}
                  type={ATTRS.BUTTON}
                  onClick={(e) => { e.stopPropagation(); store.commit(MUTATIONS.TOGGLE_REDUCED_MOTION) }}
                >
                  <canvas className={CLASSES.PREF_SWITCH_CANVAS} data-switch="motion" />
                </button>
              </div>
            </section>

          </div>

          <footer className={CLASSES.PREF_FOOTER}>
            <button
              className={CLASSES.PREF_DONE_BTN}
              type={ATTRS.BUTTON}
              onClick={() => this.close()}
            >
              {t.done}
            </button>
          </footer>
        </div>
      </div>
    )
  }
}

if (!customElements.get(TAGS.PREFERENCES_MODAL)) {
  customElements.define(TAGS.PREFERENCES_MODAL, PreferencesModal)
}
