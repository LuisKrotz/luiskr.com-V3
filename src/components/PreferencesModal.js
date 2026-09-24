import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import { TAGS, THEME, MOTION, CLASSES, EVENTS, KEYS, ATTRS, MUTATIONS } from '../core/constants.js'
import { npuPredict } from '../utils/npu-predict.js'
import preferencesStyles from '../sass/preferences.scss?inline'

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

  _syncOpenState() {
    if (this.isOpen) {
      this.setAttribute(ATTRS.OPEN, ATTRS.EMPTY)
      this.classList.add(CLASSES.IS_OPEN)
    } else {
      this.removeAttribute(ATTRS.OPEN)
      this.classList.remove(CLASSES.IS_OPEN)
    }
  }

  onStoreUpdate() {
    this._syncOpenState()
    this._updateDom()
    if (this.isOpen) {
      requestAnimationFrame(() => {
        const backdrop = this.$(`.${CLASSES.PREF_BACKDROP}`)
        if (backdrop) backdrop.focus()
      })
    }
  }

  onUpdated() {
    this._syncOpenState()
  }

  // Only backdrop + Escape — everything else is JSX onClick
  _bindBackdropEvents() {
    this.addScopedListener(window, EVENTS.KEYDOWN, (e) => {
      if (e.key === KEYS.ESCAPE && this.isOpen) this.close()
    })
  }

  close() {
    store.commit(MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
    this._syncOpenState()
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
            />
          </header>

          <div className={CLASSES.PREF_BODY}>
            <section className={CLASSES.PREF_SECTION}>
              <h3 className={CLASSES.PREF_SECTION_TITLE}>{t.appearance.title}</h3>
              <p className={CLASSES.PREF_SECTION_DESC}>{t.appearance.desc}</p>
              <div className={CLASSES.PREF_OPTIONS_3}>
                <button
                  className={`${CLASSES.PREF_OPTION_BTN}${theme === THEME.SYSTEM ? ` ${CLASSES.ACTIVE}` : ATTRS.EMPTY}`}
                  data-theme={THEME.SYSTEM}
                  type={ATTRS.BUTTON}
                  onClick={() => store.commit(MUTATIONS.SET_THEME, THEME.SYSTEM)}
                >
                  <span className={CLASSES.PREF_OPTION_ICON}>⚙️</span>
                  <span className={CLASSES.PREF_OPTION_LABEL}>{t.appearance.system.label}</span>
                  <span className={CLASSES.PREF_OPTION_SUB}>{t.appearance.system.sub}</span>
                </button>
                <button
                  className={`${CLASSES.PREF_OPTION_BTN}${theme === THEME.DARK ? ` ${CLASSES.ACTIVE}` : ATTRS.EMPTY}`}
                  data-theme={THEME.DARK}
                  type={ATTRS.BUTTON}
                  onClick={() => store.commit(MUTATIONS.SET_THEME, THEME.DARK)}
                >
                  <span className={CLASSES.PREF_OPTION_ICON}>🌙</span>
                  <span className={CLASSES.PREF_OPTION_LABEL}>{t.appearance.dark.label}</span>
                  <span className={CLASSES.PREF_OPTION_SUB}>{t.appearance.dark.sub}</span>
                </button>
                <button
                  className={`${CLASSES.PREF_OPTION_BTN}${theme === THEME.LIGHT ? ` ${CLASSES.ACTIVE}` : ATTRS.EMPTY}`}
                  data-theme={THEME.LIGHT}
                  type={ATTRS.BUTTON}
                  onClick={() => store.commit(MUTATIONS.SET_THEME, THEME.LIGHT)}
                >
                  <span className={CLASSES.PREF_OPTION_ICON}>☀️</span>
                  <span className={CLASSES.PREF_OPTION_LABEL}>{t.appearance.light.label}</span>
                  <span className={CLASSES.PREF_OPTION_SUB}>{t.appearance.light.sub}</span>
                </button>
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
                />
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
                />
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
                />
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
