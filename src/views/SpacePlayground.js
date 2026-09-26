import { h, Fragment } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import { CLASSES, EVENTS, ATTRS, TEXT, TAGS, TRANSLATION_KEYS, LOCALES, SP_ACTIONS, SP_PARAMS, SP_MUSIC, STORAGE_KEYS, CSS_PROPS, STRINGS } from '../core/constants.js'
import { EarthBackground } from '../utils/canvas/earth-background.js'
import { CheckboxWebGL } from '../utils/canvas/checkbox-webgl.js'
import { fetchFirebaseDb } from '../utils/db.js'
import spStyles from '../sass/views/space-playground.scss?inline'

// ─── Space / Earth Playground ────────────────────────────────────────────────
// Immersive full-screen Earth/Moon background as a standalone experience.
// Full controls panel with collapsible groups, scroll-to-zoom, and localStorage persistence.

const _B_SP  = 'sp'
const _B_SPP = `${_B_SP}-panel`

// ─── English defaults (overwritten by CMS translations when loaded) ──────────
const SP_DEFAULTS = Object.freeze({
  title:           TEXT.EARTH_PLAYGROUND,
  camera:          TEXT.SP_CAMERA,
  fov:             TEXT.SP_FOV,
  rotateSpeed:     TEXT.SP_ROTATE_SPEED,
  autoRotate:      TEXT.SP_AUTO_ROTATE,
  resetView:       TEXT.SP_RESET_VIEW,
  earth:           TEXT.SP_EARTH,
  spinSpeed:       TEXT.SP_SPIN_SPEED,
  engine:          TEXT.SP_ENGINE,
  waterMetalness:  TEXT.SP_WATER_METALNESS,
  terrain:         TEXT.SP_TERRAIN,
  bumpScale:       TEXT.SP_BUMP_SCALE,
  selfShadow:      TEXT.SP_SELF_SHADOW,
  selfShadowOff:   TEXT.SP_SELF_SHADOW_OFFSET,
  postFx:          TEXT.SP_POST_FX,
  bloom:           TEXT.SP_BLOOM,
  bloomStr:        TEXT.SP_BLOOM_STR,
  bloomRadius:     TEXT.SP_BLOOM_RADIUS,
  bloomThreshold:  TEXT.SP_BLOOM_THRESHOLD,
  vignette:        TEXT.SP_VIGNETTE,
  vigDarkness:     TEXT.SP_VIGNETTE_DARKNESS,
  vigOffset:       TEXT.SP_VIGNETTE_OFFSET,
  chromaticAb:     TEXT.SP_CHROMATIC_AB,
  caStrength:      TEXT.SP_CA_STRENGTH,
  filmGrain:       TEXT.SP_FILM_GRAIN,
  color:           TEXT.SP_COLOR,
  contrast:        TEXT.SP_CONTRAST,
  saturation:      TEXT.SP_SATURATION,
  blackLevel:      TEXT.SP_BLACK_LEVEL,
  sunAutoRotate:   TEXT.SP_SUN_AUTO_ROTATE,
  displayDebug:    TEXT.SP_DISPLAY_DEBUG,
  showStats:       TEXT.SP_SHOW_STATS,
  resScale:        TEXT.SP_RES_SCALE,
  screenshot:      TEXT.SP_SCREENSHOT,
  copyConstants:   TEXT.SP_COPY_CONSTANTS,
  position:        TEXT.SP_POSITION,
  target:          TEXT.SP_TARGET,
  experienceSettings: TEXT.SP_EXPERIENCE_SETTINGS,
  systemBoot:      TEXT.SP_SYSTEM_BOOT,
})

// ─── Collapsible groups with controls ────────────────────────────────────────
const _R = TEXT.INPUT_RANGE
const _C = TEXT.INPUT_CHECKBOX

const SLIDER_GROUPS = Object.freeze([
  {
    label: 'engine', collapsed: true,
    controls: [
      { label: 'waterMetalness', param: SP_PARAMS.WATER_METALNESS, type: _R, min: 0, max: 1, step: 0.01, def: 0 },
    ],
  },
  {
    label: 'terrain', collapsed: true,
    controls: [
      { label: 'bumpScale',     param: SP_PARAMS.BUMP_SCALE,          type: _R, min: 0, max: 20, step: 0.5,   def: 5 },
      { label: 'selfShadow',    param: SP_PARAMS.SELF_SHADOW,         type: _R, min: 0, max: 5,  step: 0.1,   def: 1 },
      { label: 'selfShadowOff', param: SP_PARAMS.SELF_SHADOW_OFFSET,  type: _R, min: 0, max: 0.01, step: 0.0005, def: 0.002 },
    ],
  },
  {
    label: 'postFx', collapsed: true,
    controls: [
      { label: 'bloom',          param: SP_PARAMS.BLOOM,            type: _C, checked: true },
      { label: 'bloomStr',       param: SP_PARAMS.BLOOM_STRENGTH,   type: _R, min: 0,   max: 3,    step: 0.05, def: 0.1 },
      { label: 'bloomRadius',    param: SP_PARAMS.BLOOM_RADIUS,     type: _R, min: 0,   max: 2,    step: 0.05, def: 0.3 },
      { label: 'bloomThreshold', param: SP_PARAMS.BLOOM_THRESHOLD,  type: _R, min: 0,   max: 1.5,  step: 0.01, def: 0.9 },
      { label: 'vignette',       param: SP_PARAMS.VIGNETTE,         type: _C, checked: true },
      { label: 'vigDarkness',    param: SP_PARAMS.VIGNETTE_DARKNESS, type: _R, min: 0, max: 2, step: 0.05, def: 1 },
      { label: 'vigOffset',      param: SP_PARAMS.VIGNETTE_OFFSET,   type: _R, min: 0, max: 1, step: 0.01, def: 0.5 },
      { label: 'chromaticAb',    param: SP_PARAMS.CHROMATIC,          type: _C, checked: true },
      { label: 'caStrength',     param: SP_PARAMS.CA_STRENGTH,        type: _R, min: 0, max: 2, step: 0.01, def: 0.25 },
      { label: 'filmGrain',     param: SP_PARAMS.FILM_GRAIN,          type: _R, min: 0, max: 1, step: 0.01, def: 0 },
    ],
  },
  {
    label: 'camera', collapsed: false,
    controls: [
      { label: 'fov',         param: SP_PARAMS.FOV,          type: _R, min: 15, max: 90, step: 1,   def: 45 },
      { label: 'autoRotate',  param: SP_PARAMS.AUTO_ROTATE,  type: _C, checked: false },
      { label: 'rotateSpeed', param: SP_PARAMS.ROTATE_SPEED, type: _R, min: -5, max: 5,  step: 0.01, def: 1.66 },
    ],
    actions: [
      { label: 'resetView', action: SP_ACTIONS.RESET },
    ],
  },
  {
    label: 'earth', collapsed: true,
    controls: [
      { label: 'spinSpeed',      param: SP_PARAMS.EARTH_SPEED,      type: _R, min: 0, max: 50, step: 1, def: 1 },
      { label: 'sunAutoRotate',  param: SP_PARAMS.SUN_AUTO_ROTATE,  type: _C, checked: true },
    ],
  },
  {
    label: 'color', collapsed: true,
    controls: [
      { label: 'contrast',   param: SP_PARAMS.CONTRAST,    type: _R, min: 0.5, max: 2, step: 0.01, def: 1 },
      { label: 'saturation', param: SP_PARAMS.SATURATION,   type: _R, min: 0,   max: 2, step: 0.01, def: 1.5 },
      { label: 'blackLevel', param: SP_PARAMS.BLACK_LEVEL,  type: _R, min: 0,   max: 0.2, step: 0.005, def: 0.015 },
    ],
  },
  {
    label: 'displayDebug', collapsed: true,
    controls: [
      { label: 'resScale', param: SP_PARAMS.RES_SCALE, type: _R, min: 0.5, max: 4, step: 0.1, def: 2 },
    ],
    actions: [
      { label: 'copyConstants', action: SP_ACTIONS.COPY_CONSTANTS },
      { label: 'screenshot',    action: SP_ACTIONS.SCREENSHOT },
    ],
  },
])

// ─── Param → earthBg method mapper ───────────────────────────────────────────
const PARAM_HANDLERS = Object.freeze({
  [SP_PARAMS.FOV]:              (bg, v) => bg.updateCamera({ fov: v }),
  [SP_PARAMS.ROTATE_SPEED]:     (bg, v) => bg.updateCamera({ autoRotateSpeed: v }),
  [SP_PARAMS.AUTO_ROTATE]:      (bg, v) => bg.updateCamera({ autoRotate: v }),
  [SP_PARAMS.EARTH_SPEED]:      (bg, v) => bg.updateEarth({ rotationSpeed: v / 10000 }),
  [SP_PARAMS.BLOOM]:            (bg, v) => bg.updateBloom({ enabled: v }),
  [SP_PARAMS.BLOOM_STRENGTH]:   (bg, v) => bg.updateBloom({ strength: v }),
  [SP_PARAMS.BLOOM_RADIUS]:     (bg, v) => bg.updateBloom({ radius: v }),
  [SP_PARAMS.BLOOM_THRESHOLD]:  (bg, v) => bg.updateBloom({ threshold: v }),
  [SP_PARAMS.VIGNETTE]:         (bg, v) => bg.updateVignette({ enabled: v }),
  [SP_PARAMS.VIGNETTE_DARKNESS]: (bg, v) => bg.updateVignette({ darkness: v }),
  [SP_PARAMS.VIGNETTE_OFFSET]:  (bg, v) => bg.updateVignette({ offset: v }),
  [SP_PARAMS.CHROMATIC]:        (bg, v) => bg.updateChromatic({ enabled: v }),
  [SP_PARAMS.CA_STRENGTH]:      (bg, v) => bg.updateChromatic({ strength: v }),
  [SP_PARAMS.CONTRAST]:         (bg, v) => bg.updateColorGrading({ contrast: v }),
  [SP_PARAMS.SATURATION]:       (bg, v) => bg.updateColorGrading({ saturation: v }),
  [SP_PARAMS.BLACK_LEVEL]:      (bg, v) => bg.updateColorGrading({ blackLevel: v }),
  [SP_PARAMS.FILM_GRAIN]:       (bg, v) => bg.updateFilm({ enabled: v > 0, intensity: v }),
  [SP_PARAMS.RES_SCALE]:        (bg, v) => bg.updateRender({ resolutionScale: v }),
  [SP_PARAMS.SUN_AUTO_ROTATE]:  (bg, v) => bg.updateSun({ autoRotate: v }),
  [SP_PARAMS.WATER_METALNESS]:  (bg, v) => bg.updateEarthMaterial({ waterMetalness: v }),
  [SP_PARAMS.BUMP_SCALE]:       (bg, v) => bg.updateEarthMaterial({ bumpScale: v }),
  [SP_PARAMS.SELF_SHADOW]:      (bg, v) => bg.updateEarthMaterial({ terrainShadowIntensity: v }),
  [SP_PARAMS.SELF_SHADOW_OFFSET]: (bg, v) => bg.updateEarthMaterial({ terrainShadowOffset: v }),
})

// ─── localStorage helpers ────────────────────────────────────────────────────
const SP_VERSION = '3.2'

const _loadSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SPACE_PLAYGROUND)

    if (!raw) return null

    const parsed = JSON.parse(raw)

    return parsed?._v === SP_VERSION ? parsed.settings : null
  } catch { return null }
}

const _saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SPACE_PLAYGROUND, JSON.stringify({ _v: SP_VERSION, settings }))
  } catch { /* quota exceeded — silently ignore */ }
}

export class SpacePlayground extends BaseComponent {
  constructor() {
    super(spStyles)
    this._earthBg       = null
    this._panelOpen     = true
    this._isDark        = true
    this._lastLocale    = null
    this.translations   = null
    this._collapsedMap  = {}
    this._savedSettings = {}
    this._posRafId      = null
    this._checkboxes    = {}
    this._canvasEl      = null
  }

  _getCanvasEl() {
    if (!this._canvasEl) {
      this._canvasEl = document.createElement(TAGS.CANVAS)

      this._canvasEl.className = `${_B_SP}-canvas`

      this._canvasEl.setAttribute(ATTRS.ARIA_HIDDEN, ATTRS.TRUE)
    }

    return this._canvasEl
  }

  onMounted() {
    this.subscribe(store)

    this._isDark = document.documentElement.classList.contains(CLASSES.DARK_MODE)

    // Load persisted settings
    const saved = _loadSettings()

    if (saved) this._savedSettings = saved

    this._loadTranslations()

    this._initEarth()

    this._bindControls()

    // Start position readout loop
    this._startPositionLoop()

    // Autoplay native audio if allowed
    const audioEl = this.$(`.${_B_SP}-audio`)

    if (audioEl) {
      audioEl.play().catch(() => {})
    }

    this._mountCheckboxCanvases()
  }

  onUpdated() {
    this._syncPanel()

    this._mountCheckboxCanvases()

    if (!this._earthBg) {
      this._initEarth()
    }
  }

  onDestroy() {
    this._destroyCheckboxCanvases()

    this._earthBg?.destroy()

    this._earthBg = null

    this._canvasEl = null

    if (this._posRafId) cancelAnimationFrame(this._posRafId)

    const audioEl = this.$(`.${_B_SP}-audio`)

    if (audioEl) {
      audioEl.pause()
    }
  }

  onStoreUpdate() {
    const isDark = document.documentElement.classList.contains(CLASSES.DARK_MODE)

    if (isDark !== this._isDark) {
      this._isDark = isDark
    }

    const currentLocale = store.getters.getLang()

    if (this._lastLocale && this._lastLocale !== currentLocale) {
      this._loadTranslations()
    }
  }

  _loadTranslations() {
    const lang = store.getters.getlang()

    const currentLocale = lang?.locale || LOCALES.EN

    this._lastLocale = currentLocale

    const dbpath = `${lang.database}${currentLocale}${lang.pagesPath}${TRANSLATION_KEYS.EARTH_PLAYGROUND}`

    fetchFirebaseDb(dbpath)
      .then((snapshot) => {
        if (snapshot?.exists()) {
          this.translations = snapshot.val()

          this._updateDom()
        } else {
          const fallbackPath = `${lang.database}${currentLocale}${lang.pagesPath}${TRANSLATION_KEYS.SPACE_PLAYGROUND}`

          fetchFirebaseDb(fallbackPath).then((fallbackSnap) => {
            if (fallbackSnap?.exists()) {
              this.translations = fallbackSnap.val()

              this._updateDom()
            }
          })
        }
      })
      .catch(console.error)
  }

  _initEarth() {
    const canvas = this._getCanvasEl()

    if (!canvas || this._earthBg) return

    this._earthBg = new EarthBackground(canvas, {
      onProgress: (msg, pct) => {
        const loaderMsg  = this.$(`.${_B_SP}-loader-msg`)
        const loaderVal  = this.$(`.${_B_SP}-loader-val`)
        const loaderBar  = this.$(`.${_B_SP}-loader-bar-fill`)

        if (loaderMsg) loaderMsg.textContent = msg
        if (loaderVal) loaderVal.textContent = String(Math.round(pct))
        if (loaderBar) loaderBar.style.width = `${pct}%`
      },
      onReady: () => {
        this._earthBg.setReducedMotion(store.getters.getReducedMotion())

        // Apply persisted settings
        this._applyPersistedSettings()

        this._syncPanel()

        // Fade out loader
        const loader = this.$(`.${_B_SP}-loader`)

        if (loader) {
          loader.style.opacity = '0'
          loader.style.filter = 'blur(4px)'

          setTimeout(() => loader.remove(), 800)
        }
      },
    })

    this._earthBg.init()
  }

  _applyPersistedSettings() {
    const saved = this._savedSettings

    if (!saved || !this._earthBg) return

    Object.entries(saved).forEach(([param, val]) => {
      const handler = PARAM_HANDLERS[param]

      if (handler) handler(this._earthBg, val)

      // Sync input value in the DOM
      const input = this.shadowRoot?.querySelector(`[${ATTRS.DATA_PARAM}="${param}"]`)

      if (input) {
        if (input.type === _C) {
          input.checked = Boolean(val)
        } else {
          input.value = val

          const min = Number(input.min)

          const max = Number(input.max)

          const pct = Math.max(0, Math.min(100, ((Number(val) - min) / (max - min)) * 100))

          input.style.setProperty(CSS_PROPS.RANGE_PCT, `${pct}%`)

          const row = input.closest(`.${_B_SPP}-row`)

          const valEl = row?.querySelector(`.${CLASSES.SP_VAL}`)

          if (valEl) valEl.textContent = val
        }
      }
    })
  }

  _bindControls() {
    // Delegated click listener on shadowRoot
    this.addScopedListener(this.shadowRoot, EVENTS.CLICK, (e) => {
      // Panel toggle button
      if (e.target.closest(`.${_B_SPP}-toggle`)) {
        this._panelOpen = !this._panelOpen

        this._syncPanel()

        return
      }

      // Reopen button
      if (e.target.closest(`.${_B_SP}-reopen`)) {
        this._panelOpen = true

        this._syncPanel()

        return
      }

      // Collapsible group headers
      const header = e.target.closest(`.${_B_SPP}-group-header`)

      if (header) {
        const group = header.closest(`.${_B_SPP}-group`)

        if (group) group.classList.toggle(`${_B_SPP}-group--collapsed`)

        return
      }

      // Action buttons (reset, screenshot, copy-constants)
      const btn = e.target.closest(`[${ATTRS.DATA_ACTION}]`)

      if (!btn) return

      const action = btn.getAttribute(ATTRS.DATA_ACTION)

      this._handleAction(action, btn)
    })

    // Sliders (input event)
    this.addScopedListener(this.shadowRoot, EVENTS.INPUT, (e) => {
      const input = e.target

      if (!input.matches(`[${ATTRS.DATA_PARAM}]`)) return

      this._handleInput(input)
    })

    // Checkboxes (change event)
    this.addScopedListener(this.shadowRoot, EVENTS.CHANGE, (e) => {
      const input = e.target

      if (!input.matches(`[${ATTRS.DATA_PARAM}]`)) return

      this._handleInput(input)
    })
  }

  _startPositionLoop() {
    const update = () => {
      this._posRafId = requestAnimationFrame(update)

      if (!this._earthBg) return

      const state = this._earthBg.getCameraState()

      if (!state) return

      const posEl = this.$(`.${_B_SPP}-pos`)

      const tgtEl = this.$(`.${_B_SPP}-tgt`)

      if (posEl) posEl.textContent = `X: ${state.position.x}   Y: ${state.position.y}   Z: ${state.position.z}`

      if (tgtEl) tgtEl.textContent = `X: ${state.target.x}   Y: ${state.target.y}   Z: ${state.target.z}`
    }

    update()
  }

  _handleAction(action, btn) {
    if (action === SP_ACTIONS.PANEL_OPEN) {
      this._panelOpen = true

      this._syncPanel()

      return
    }

    if (!this._earthBg) return

    if (action === SP_ACTIONS.RESET) {
      this._earthBg.resetView()

      this._savedSettings = {}

      try {
        localStorage.removeItem(STORAGE_KEYS.SPACE_PLAYGROUND)
      } catch {}

      // Reset DOM inputs
      SLIDER_GROUPS.forEach((grp) => {
        grp.controls.forEach((ctrl) => {
          const input = this.shadowRoot?.querySelector(`[${ATTRS.DATA_PARAM}="${ctrl.param}"]`)

          if (input) {
            if (ctrl.type === _C) {
              input.checked = Boolean(ctrl.checked)
            } else {
              input.value = ctrl.def

              const min = Number(input.min)

              const max = Number(input.max)

              const pct = Math.max(0, Math.min(100, ((Number(ctrl.def) - min) / (max - min)) * 100))

              input.style.setProperty(CSS_PROPS.RANGE_PCT, `${pct}%`)

              const valEl = input.closest(`.${_B_SPP}-row`)?.querySelector(`.${CLASSES.SP_VAL}`)

              if (valEl) valEl.textContent = ctrl.def
            }
          }
        })
      })
    } else if (action === SP_ACTIONS.TOGGLE_ROTATE) {
      const s = this._earthBg.settings

      if (s?.controls) {
        this._earthBg.updateCamera({ autoRotate: !s.controls.autoRotate })

        btn.setAttribute(ATTRS.ARIA_PRESSED, String(this._earthBg.settings.controls.autoRotate))
      }
    } else if (action === SP_ACTIONS.SCREENSHOT) {
      this._earthBg.takeScreenshot()
    } else if (action === SP_ACTIONS.COPY_CONSTANTS) {
      const s = this._earthBg.settings

      const json = JSON.stringify({ GUI: s }, null, 4)

      navigator.clipboard?.writeText(json)
    }
  }

  _handleInput(input) {
    if (!this._earthBg) return

    const param = input.getAttribute(ATTRS.DATA_PARAM)

    const isCheckbox = input.type === _C

    const val = isCheckbox ? input.checked : Number(input.value)

    if (!isCheckbox) {
      const min = Number(input.min)

      const max = Number(input.max)

      const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100))

      input.style.setProperty(CSS_PROPS.RANGE_PCT, `${pct}%`)

      const row = input.closest(`.${_B_SPP}-row`)

      const valEl = row?.querySelector(`.${CLASSES.SP_VAL}`)

      if (valEl) valEl.textContent = val
    }

    if (isCheckbox && this._checkboxes?.[param]) {
      this._checkboxes[param].setChecked(val)
    }

    const handler = PARAM_HANDLERS[param]

    if (handler) handler(this._earthBg, val)

    this._persistParam(param, val)
  }

  _persistParam(param, val) {
    this._savedSettings[param] = val

    _saveSettings(this._savedSettings)
  }

  _syncPanel() {
    const panel = this.$(`.${_B_SPP}`)

    if (panel) {
      panel.classList.toggle(`${_B_SPP}--collapsed`, !this._panelOpen)
    }

    const reopenBtn = this.$(`.${_B_SP}-reopen`)

    if (reopenBtn) {
      reopenBtn.style.display = this._panelOpen ? 'none' : 'flex'
    }
  }

  _mountCheckboxCanvases() {
    if (typeof window === STRINGS.UNDEFINED) return

    if (!this._checkboxes) this._checkboxes = {}

    const canvases = this.$$(`.${CLASSES.SP_CHECK_CANVAS}`)

    canvases.forEach((canvas) => {
      const param = canvas.getAttribute(ATTRS.DATA_CHECK)

      if (!param) return

      const input = this.$(`input[data-param="${param}"]`)

      const isChecked = input ? input.checked : false

      const existing = this._checkboxes[param]

      if (existing && existing.canvas !== canvas) {
        existing.destroy()

        delete this._checkboxes[param]
      }

      if (!this._checkboxes[param]) {
        this._checkboxes[param] = new CheckboxWebGL(canvas, isChecked)
      } else {
        this._checkboxes[param].setChecked(isChecked)
      }
    })
  }

  _destroyCheckboxCanvases() {
    if (this._checkboxes) {
      Object.values(this._checkboxes).forEach((cb) => cb?.destroy())

      this._checkboxes = {}
    }
  }

  // ─── Config-driven control rendering ─────────────────────────────────────
  _renderControl(ctrl, t) {
    const labelText = t[ctrl.label] || ctrl.label

    const savedVal = this._savedSettings[ctrl.param]

    if (ctrl.type === _C) {
      const isChecked = savedVal !== undefined ? Boolean(savedVal) : ctrl.checked

      return (
        <label className={`${_B_SPP}-row ${_B_SPP}-row--check`}>
          <span className={CLASSES.SP_ROW_LABEL}>{labelText}</span>
          <span className={CLASSES.SP_CHECK_WRAPPER}>
            <input
              type={_C}
              className={CLASSES.SP_CHECK_INPUT}
              data-param={ctrl.param}
              defaultChecked={isChecked}
            />
            <span className={CLASSES.SP_CHECK_BOX}>
              <canvas className={CLASSES.SP_CHECK_CANVAS} data-check={ctrl.param} />
              <svg className={CLASSES.SP_CHECK_ICON} viewBox="0 0 16 16" aria-hidden={ATTRS.TRUE}>
                <polyline points="3 8 6.5 11.5 13 4" />
              </svg>
            </span>
          </span>
        </label>
      )
    }

    const val = savedVal !== undefined ? savedVal : ctrl.def

    const pct = Math.max(0, Math.min(100, ((val - ctrl.min) / (ctrl.max - ctrl.min)) * 100))

    return (
      <label className={`${_B_SPP}-row`}>
        <span className={CLASSES.SP_ROW_LABEL}>{labelText}</span>
        <div className={CLASSES.SP_ROW_CTRL}>
          <input
            type={_R}
            className={`${_B_SPP}-range`}
            data-param={ctrl.param}
            min={String(ctrl.min)}
            max={String(ctrl.max)}
            step={String(ctrl.step)}
            defaultValue={String(val)}
            style={`${CSS_PROPS.RANGE_PCT}:${pct}%;`}
          />
          <span className={CLASSES.SP_VAL}>{val}</span>
        </div>
      </label>
    )
  }

  _renderAction(act, t) {
    const labelText = t[act.label] || act.label

    const props = {
      className: `${_B_SPP}-btn`,
      type: ATTRS.BUTTON,
      'data-action': act.action,
    }

    if (act.pressed !== undefined) {
      props[ATTRS.ARIA_PRESSED] = ATTRS.TRUE
    }

    return (
      <div className={CLASSES.SP_ACTION_WRAP}>
        <button {...props}>{labelText}</button>
      </div>
    )
  }

  render() {
    const t = { ...SP_DEFAULTS, ...(this.translations ?? {}) }

    const lang = store.getters.getLang()

    const locale = lang?.locale || lang || LOCALES.EN

    const expLabel = t.experienceSettings || (locale === LOCALES.BR ? TEXT.SP_EXPERIENCE_SETTINGS_BR : (locale === LOCALES.ES || locale === LOCALES.CAS) ? TEXT.SP_EXPERIENCE_SETTINGS_ES : locale === LOCALES.DE ? TEXT.SP_EXPERIENCE_SETTINGS_DE : TEXT.SP_EXPERIENCE_SETTINGS)

    return (
      <Fragment>
        {this._getCanvasEl()}

        {/* Sci-Fi System Boot Loader */}
        <div className={`${_B_SP}-loader`}>
          <div className={`${_B_SP}-loader-glow`} />
          <div className={`${_B_SP}-loader-grid`} />
          <div className={`${_B_SP}-loader-content`}>
            <div className={`${_B_SP}-loader-spinner-outer`} />
            <div className={`${_B_SP}-loader-spinner-inner`} />
            <div className={`${_B_SP}-loader-counter`}>
              <span className={`${_B_SP}-loader-percent`}>
                <span className={`${_B_SP}-loader-val`}>0</span>
                <span className={`${_B_SP}-loader-sym`}>%</span>
              </span>
            </div>
            <div className={`${_B_SP}-loader-title`}>{t.systemBoot || TEXT.SP_SYSTEM_BOOT}</div>
            <div className={`${_B_SP}-loader-msg`}>{TEXT.SP_INIT_WEBGPU}</div>
            <div className={`${_B_SP}-loader-bar`}>
              <div className={`${_B_SP}-loader-bar-fill`} />
            </div>
          </div>
        </div>

        {/* Controls wrapper aligned with top nav %MAXAREA */}
        <div className={CLASSES.SP_CONTROLS_WRAP}>
          {/* Floating reopen button — styled like click to expand button */}
          <button
            className={`${_B_SP}-reopen`}
            data-action={SP_ACTIONS.PANEL_OPEN}
            type={ATTRS.BUTTON}
            style="display:none"
          >
            {expLabel}
          </button>

          <section className={`${_B_SPP}`} aria-label={t.title}>
            <header className={`${_B_SPP}-header`}>
              <h2 className={`${_B_SPP}-title`}>{t.title}</h2>
              <button
                className={`${_B_SPP}-toggle`}
                data-action={SP_ACTIONS.PANEL_TOGGLE}
                type={ATTRS.BUTTON}
                aria-label={TEXT.CLOSE}
              >
                ✕
              </button>
            </header>

            <div className={`${_B_SPP}-body`}>
              {SLIDER_GROUPS.map((group) => (
                <div className={`${_B_SPP}-group${group.collapsed ? ` ${_B_SPP}-group--collapsed` : ATTRS.EMPTY}`}>
                  <div className={`${_B_SPP}-group-header`}>
                    <span className={`${_B_SPP}-group-chevron`}>▶</span>
                    <span className={`${_B_SPP}-group-label`}>{t[group.label] || group.label}</span>
                  </div>

                  <div className={`${_B_SPP}-group-content`}>
                    {group.controls.map((ctrl) => this._renderControl(ctrl, t))}

                    {group.actions?.map((act) => this._renderAction(act, t))}
                  </div>
                </div>
              ))}

              {/* Position / Target readouts */}
              <div className={`${_B_SPP}-group`}>
                <div className={`${_B_SPP}-group-header`}>
                  <span className={`${_B_SPP}-group-chevron`}>▶</span>
                  <span className={`${_B_SPP}-group-label`}>{t.position}</span>
                </div>
                <div className={`${_B_SPP}-group-content`}>
                  <div className={`${_B_SPP}-readout ${_B_SPP}-pos`}>X: 0   Y: 0   Z: 0</div>
                </div>
              </div>

              <div className={`${_B_SPP}-group`}>
                <div className={`${_B_SPP}-group-header`}>
                  <span className={`${_B_SPP}-group-chevron`}>▶</span>
                  <span className={`${_B_SPP}-group-label`}>{t.target}</span>
                </div>
                <div className={`${_B_SPP}-group-content`}>
                  <div className={`${_B_SPP}-readout ${_B_SPP}-tgt`}>X: 0   Y: 0   Z: 0</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Native audio player aligned with nav */}
        <div className={`${_B_SP}-music`}>
          <audio
            className={`${_B_SP}-audio`}
            controls
            controlsList={ATTRS.NO_DOWNLOAD}
            disablePictureInPicture
            autoplay
            loop
            preload={ATTRS.AUTO}
          >
            <source src={SP_MUSIC.OGG} type={ATTRS.AUDIO_OGG} />
            <source src={SP_MUSIC.MP3} type={ATTRS.AUDIO_MPEG} />
          </audio>
        </div>
      </Fragment>
    )
  }
}

if (!customElements.get(TAGS.VIEW_SPACE_PLAYGROUND)) {
  customElements.define(TAGS.VIEW_SPACE_PLAYGROUND, SpacePlayground)
}
