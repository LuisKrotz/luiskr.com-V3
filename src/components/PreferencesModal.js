import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import { TAGS, THEME, MOTION } from '../core/constants.js'
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
      this.classList.add('is-open')
    } else {
      this.removeAttribute('open')
      this.classList.remove('is-open')
    }
  }

  onStoreUpdate() {
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

  onUpdated() {
    this._syncOpenState()
    this._bindEvents()
  }

  _bindEvents() {
    if (!this.isOpen) return

    const backdrop = this.$('.pref-backdrop')
    if (backdrop) {
      this.addScopedListener(backdrop, 'click', (e) => {
        if (e.target === backdrop) this.close()
      })
    }
    this.addScopedListener(window, 'keydown', (e) => {
      if (e.key === 'Escape') this.close()
    })

    const closeBtn = this.$('.pref-close-btn')
    if (closeBtn) this.addScopedListener(closeBtn, 'click', () => this.close())

    const doneBtn = this.$('.pref-done-btn')
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

    return (
      <div
        className="pref-backdrop"
        tabIndex="-1"
        onClick={(e) => {
          if (e.target === e.currentTarget) this.close()
        }}
      >
        <div className="pref-dialog" role="dialog" aria-modal="true" aria-labelledby="pref-title">
          <header className="pref-header">
            <h2 id="pref-title" className="pref-title">{t.title}</h2>
            <button
              className="pref-close-btn"
              aria-label={t.title}
              type="button"
              onClick={() => this.close()}
            >
              ✕
            </button>
          </header>
          <div className="pref-body">
            <section className="pref-section">
              <h3 className="pref-section-title">{t.appearance.title}</h3>
              <p className="pref-section-desc">{t.appearance.desc}</p>
              <div className="pref-options pref-options--3">
                <button
                  className={`pref-option-btn ${theme === THEME.SYSTEM ? 'active' : ''}`}
                  data-theme={THEME.SYSTEM}
                  type="button"
                  onClick={() => store.commit('setTheme', THEME.SYSTEM)}
                >
                  <span className="pref-option-icon">⚙️</span>
                  <span className="pref-option-label">{t.appearance.system.label}</span>
                  <span className="pref-option-sub">{t.appearance.system.sub}</span>
                </button>
                <button
                  className={`pref-option-btn ${theme === THEME.DARK ? 'active' : ''}`}
                  data-theme={THEME.DARK}
                  type="button"
                  onClick={() => store.commit('setTheme', THEME.DARK)}
                >
                  <span className="pref-option-icon">🌙</span>
                  <span className="pref-option-label">{t.appearance.dark.label}</span>
                  <span className="pref-option-sub">{t.appearance.dark.sub}</span>
                </button>
                <button
                  className={`pref-option-btn ${theme === THEME.LIGHT ? 'active' : ''}`}
                  data-theme={THEME.LIGHT}
                  type="button"
                  onClick={() => store.commit('setTheme', THEME.LIGHT)}
                >
                  <span className="pref-option-icon">☀️</span>
                  <span className="pref-option-label">{t.appearance.light.label}</span>
                  <span className="pref-option-sub">{t.appearance.light.sub}</span>
                </button>
              </div>
            </section>

            <section className="pref-section">
              <h3 className="pref-section-title">{t.motion.title}</h3>
              <p className="pref-section-desc">{t.motion.desc}</p>
              <div className="pref-options pref-options--2">
                <button
                  className={`pref-option-btn ${!reduced ? 'active' : ''}`}
                  data-motion={MOTION.FULL}
                  type="button"
                  onClick={() => {
                    if (this.reducedMotion) store.commit('toggleReducedMotion')
                  }}
                >
                  <span className="pref-option-icon">⚡</span>
                  <span className="pref-option-label">{t.motion.full.label}</span>
                  <span className="pref-option-sub">{t.motion.full.sub}</span>
                </button>
                <button
                  className={`pref-option-btn ${reduced ? 'active' : ''}`}
                  data-motion={MOTION.REDUCED}
                  type="button"
                  onClick={() => {
                    if (!this.reducedMotion) store.commit('toggleReducedMotion')
                  }}
                >
                  <span className="pref-option-icon">🍃</span>
                  <span className="pref-option-label">{t.motion.reduced.label}</span>
                  <span className="pref-option-sub">{t.motion.reduced.sub}</span>
                </button>
              </div>
            </section>

            <section className="pref-section">
              <h3 className="pref-section-title">Hardware Acceleration & AI</h3>
              <p className="pref-section-desc">NPU Neural Prediction & WASM Multi-Threaded Engine</p>
              <div className="pref-options pref-options--2">
                <div className="pref-stat-card">
                  <span className="pref-option-label">Engine / Acceleration</span>
                  <span className="pref-option-sub">{this.npuStatus}</span>
                </div>
                <div className="pref-stat-card">
                  <span className="pref-option-label">Predictive Preloads</span>
                  <span className="pref-option-sub">
                    {analytics.successfulPreloads} / {analytics.totalPredictions}
                  </span>
                </div>
              </div>
            </section>

            <section className="pref-section">
              <h3 className="pref-section-title">Stats for Nerds</h3>
              <p className="pref-section-desc">Live performance overlay above the nav — FPS, network throughput, pending requests, memory</p>
              <div className="pref-options pref-options--2">
                <button
                  className={`pref-option-btn ${!statsForNerds ? 'active' : ''}`}
                  type="button"
                  onClick={() => { if (statsForNerds) store.commit('toggleStatsForNerds') }}
                >
                  <span className="pref-option-icon">📊</span>
                  <span className="pref-option-label">Hidden</span>
                  <span className="pref-option-sub">No overlay shown</span>
                </button>
                <button
                  className={`pref-option-btn ${statsForNerds ? 'active' : ''}`}
                  type="button"
                  onClick={() => { if (!statsForNerds) store.commit('toggleStatsForNerds') }}
                >
                  <span className="pref-option-icon">🔬</span>
                  <span className="pref-option-label">Visible</span>
                  <span className="pref-option-sub">Show HUD above nav</span>
                </button>
              </div>
            </section>
          </div>

          <footer className="pref-footer">
            <button
              className="pref-done-btn"
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
