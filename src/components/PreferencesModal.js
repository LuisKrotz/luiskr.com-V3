import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import { TAGS, THEME, MOTION, CLASSES } from '../core/constants.js'
import { npuPredict } from '../utils/npu-predict.js'
import preferencesStyles from '../sass/preferences.scss?inline'

const DEFAULTS = {
  title: 'Preferences',
  done: 'Done',
  appearance: {
    title: 'Appearance',
    desc: 'Choose how the site looks',
    system: { label: 'System', sub: 'Follow OS' },
    dark: { label: 'Dark', sub: 'Dark mode' },
    light: { label: 'Light', sub: 'Light mode' },
  },
  motion: {
    title: 'Motion',
    desc: 'Control animations and transitions',
    full: { label: 'Normal', sub: 'Full motion' },
    reduced: { label: 'Reduced', sub: 'Less motion' },
  },
}

export class PreferencesModal extends BaseComponent {
  constructor() {
    super(preferencesStyles)
    this._pref = null
  }

  set pref(val) {
    this._pref = val
    if (this._isMounted) this._updateDom()
  }

  get pref() {
    return this._pref
  }

  set open(val) {
    store.commit('togglePreferencesModal', !!val)
    if (this._isMounted) {
      this._syncOpenState()
      this._updateDom()
      this._bindEvents()
      if (this.isOpen) {
        requestAnimationFrame(() => {
          const backdrop = this.$('.pref-backdrop')
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
      title: p.title ?? DEFAULTS.title,
      done: p.done ?? DEFAULTS.done,
      appearance: { ...DEFAULTS.appearance, ...(p.appearance ?? {}) },
      motion: { ...DEFAULTS.motion, ...(p.motion ?? {}) },
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
    this._bindEvents()
    this.addScopedListener(window, 'open-preferences-modal', () => {
      store.commit('togglePreferencesModal', true)
    })
  }

  _syncOpenState() {
    if (this.isOpen) {
      this.setAttribute('open', '')
      this.classList.add(CLASSES.IS_OPEN)
    } else {
      this.removeAttribute('open')
      this.classList.remove(CLASSES.IS_OPEN)
    }
  }

  onStoreUpdate() {
    this._syncOpenState()
    this._updateDom()
    this._bindEvents()
    if (this.isOpen) {
      requestAnimationFrame(() => {
        const backdrop = this.$(`.${CLASSES.PREF_BACKDROP}`)
        if (backdrop) backdrop.focus()
      })
    }
  }

  onUpdated() {
    this._syncOpenState()
    this._bindEvents()
  }

  _bindEvents() {
    if (!this.isOpen) return

    const backdrop = this.$(`.${CLASSES.PREF_BACKDROP}`)
    if (backdrop) {
      this.addScopedListener(backdrop, 'click', (e) => {
        if (e.target === backdrop) this.close()
      })
    }
    this.addScopedListener(window, 'keydown', (e) => {
      if (e.key === 'Escape') this.close()
    })

    const closeBtn = this.$(`.${CLASSES.PREF_CLOSE_BTN}`)
    if (closeBtn) this.addScopedListener(closeBtn, 'click', () => this.close())

    const doneBtn = this.$(`.${CLASSES.PREF_DONE_BTN}`)
    if (doneBtn) this.addScopedListener(doneBtn, 'click', () => this.close())

    const themeBtns = this.$$('[data-theme]')
    themeBtns.forEach((btn) => {
      this.addScopedListener(btn, 'click', () => {
        const mode = btn.getAttribute('data-theme')
        store.commit('setTheme', mode)
      })
    })

    const motionBtns = this.$$('[data-motion]')
    motionBtns.forEach((btn) => {
      this.addScopedListener(btn, 'click', () => {
        const reduced = btn.getAttribute('data-motion') === 'reduced'
        if (this.reducedMotion !== reduced) {
          store.commit('toggleReducedMotion')
        }
      })
    })
  }

  close() {
    store.commit('togglePreferencesModal', false)
    this._syncOpenState()
  }

  render() {
    if (!this.isOpen) return null

    const t = this.t
    const theme = this.currentTheme
    const reduced = this.reducedMotion
    const analytics = this.npuAnalytics
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
        <div className={CLASSES.PREF_DIALOG} role="dialog" aria-modal="true" aria-labelledby="pref-title">
          <header className={CLASSES.PREF_HEADER}>
            <h2 id="pref-title" className={CLASSES.PREF_TITLE}>{t.title}</h2>
            <button
              className={CLASSES.PREF_CLOSE_BTN}
              aria-label={t.title}
              type="button"
              onClick={() => this.close()}
            >
              ✕
            </button>
          </header>

          <div className={CLASSES.PREF_BODY}>
            <section className={CLASSES.PREF_SECTION}>
              <h3 className={CLASSES.PREF_SECTION_TITLE}>{t.appearance.title}</h3>
              <p className={CLASSES.PREF_SECTION_DESC}>{t.appearance.desc}</p>
              <div className={CLASSES.PREF_OPTIONS_3}>
                <button
                  className={`${CLASSES.PREF_OPTION_BTN}${theme === THEME.SYSTEM ? ` ${CLASSES.ACTIVE}` : ''}`}
                  data-theme={THEME.SYSTEM}
                  type="button"
                  onClick={() => store.commit('setTheme', THEME.SYSTEM)}
                >
                  <span className={CLASSES.PREF_OPTION_ICON}>⚙️</span>
                  <span className={CLASSES.PREF_OPTION_LABEL}>{t.appearance.system.label}</span>
                  <span className={CLASSES.PREF_OPTION_SUB}>{t.appearance.system.sub}</span>
                </button>
                <button
                  className={`${CLASSES.PREF_OPTION_BTN}${theme === THEME.DARK ? ` ${CLASSES.ACTIVE}` : ''}`}
                  data-theme={THEME.DARK}
                  type="button"
                  onClick={() => store.commit('setTheme', THEME.DARK)}
                >
                  <span className={CLASSES.PREF_OPTION_ICON}>🌙</span>
                  <span className={CLASSES.PREF_OPTION_LABEL}>{t.appearance.dark.label}</span>
                  <span className={CLASSES.PREF_OPTION_SUB}>{t.appearance.dark.sub}</span>
                </button>
                <button
                  className={`${CLASSES.PREF_OPTION_BTN}${theme === THEME.LIGHT ? ` ${CLASSES.ACTIVE}` : ''}`}
                  data-theme={THEME.LIGHT}
                  type="button"
                  onClick={() => store.commit('setTheme', THEME.LIGHT)}
                >
                  <span className={CLASSES.PREF_OPTION_ICON}>☀️</span>
                  <span className={CLASSES.PREF_OPTION_LABEL}>{t.appearance.light.label}</span>
                  <span className={CLASSES.PREF_OPTION_SUB}>{t.appearance.light.sub}</span>
                </button>
              </div>
            </section>

            <section className={CLASSES.PREF_SECTION}>
              <h3 className={CLASSES.PREF_SECTION_TITLE}>{t.motion.title}</h3>
              <p className={CLASSES.PREF_SECTION_DESC}>{t.motion.desc}</p>
              <div className={CLASSES.PREF_OPTIONS_2}>
                <button
                  className={`${CLASSES.PREF_OPTION_BTN}${!reduced ? ` ${CLASSES.ACTIVE}` : ''}`}
                  data-motion={MOTION.FULL}
                  type="button"
                  onClick={() => {
                    if (this.reducedMotion) store.commit('toggleReducedMotion')
                  }}
                >
                  <span className={CLASSES.PREF_OPTION_ICON}>⚡</span>
                  <span className={CLASSES.PREF_OPTION_LABEL}>{t.motion.full.label}</span>
                  <span className={CLASSES.PREF_OPTION_SUB}>{t.motion.full.sub}</span>
                </button>
                <button
                  className={`${CLASSES.PREF_OPTION_BTN}${reduced ? ` ${CLASSES.ACTIVE}` : ''}`}
                  data-motion={MOTION.REDUCED}
                  type="button"
                  onClick={() => {
                    if (!this.reducedMotion) store.commit('toggleReducedMotion')
                  }}
                >
                  <span className={CLASSES.PREF_OPTION_ICON}>🍃</span>
                  <span className={CLASSES.PREF_OPTION_LABEL}>{t.motion.reduced.label}</span>
                  <span className={CLASSES.PREF_OPTION_SUB}>{t.motion.reduced.sub}</span>
                </button>
              </div>
            </section>

            <section className={CLASSES.PREF_SECTION}>
              <h3 className={CLASSES.PREF_SECTION_TITLE}>Hardware Acceleration &amp; AI</h3>
              <p className={CLASSES.PREF_SECTION_DESC}>NPU Neural Prediction &amp; WASM Multi-Threaded Engine</p>
              <div className={CLASSES.PREF_OPTIONS_2}>
                <div className={CLASSES.PREF_STAT_CARD}>
                  <span className={CLASSES.PREF_OPTION_LABEL}>Engine / Acceleration</span>
                  <span className={CLASSES.PREF_OPTION_SUB}>{this.npuStatus}</span>
                </div>
                <div className={CLASSES.PREF_STAT_CARD}>
                  <span className={CLASSES.PREF_OPTION_LABEL}>Predictive Preloads</span>
                  <span className={CLASSES.PREF_OPTION_SUB}>
                    {analytics.successfulPreloads} / {analytics.totalPredictions}
                  </span>
                </div>
              </div>
            </section>

            <section className={CLASSES.PREF_SECTION}>
              <h3 className={CLASSES.PREF_SECTION_TITLE}>Developer Tools</h3>
              <div className={CLASSES.PREF_SWITCH_ROW} onClick={() => store.commit('toggleStatsForNerds')}>
                <div className={CLASSES.PREF_SWITCH_INFO}>
                  <span className={CLASSES.PREF_SWITCH_LABEL}>Stats for Nerds</span>
                  <span className={CLASSES.PREF_SWITCH_DESC}>Live FPS, network, memory HUD — bottom-right corner</span>
                </div>
                <span
                  className={statsForNerds ? CLASSES.PREF_SWITCH_ON : CLASSES.PREF_SWITCH}
                  aria-checked={String(statsForNerds)}
                  aria-label="Stats for Nerds"
                  role="switch"
                />
              </div>
              <div className={CLASSES.PREF_SWITCH_ROW} onClick={() => store.commit('toggleShowGrid')}>
                <div className={CLASSES.PREF_SWITCH_INFO}>
                  <span className={CLASSES.PREF_SWITCH_LABEL}>Show Grid</span>
                  <span className={CLASSES.PREF_SWITCH_DESC}>Overlay columns, gutters and max-area at every breakpoint</span>
                </div>
                <span
                  className={showGrid ? CLASSES.PREF_SWITCH_ON : CLASSES.PREF_SWITCH}
                  aria-checked={String(showGrid)}
                  aria-label="Show Grid"
                  role="switch"
                />
              </div>
            </section>
          </div>

          <footer className={CLASSES.PREF_FOOTER}>
            <button
              className={CLASSES.PREF_DONE_BTN}
              type="button"
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
