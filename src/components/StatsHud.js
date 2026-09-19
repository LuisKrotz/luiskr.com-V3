import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import { CLASSES, TAGS } from '../core/constants.js'
import { statsEngine } from '../utils/stats-engine.js'
import { npuPredict } from '../utils/npu-predict.js'
import statsHudStyles from '../sass/stats-hud.scss?inline'

const _B = 'stats-hud'

// ─── Stats for Nerds HUD ────────────────────────────────────────────────────
// Fixed pill overlay above the bottom nav displaying live FPS, network
// throughput, pending requests, and JS heap memory.
// Visible only when store.getters.getStatsForNerds() is true.

class StatsHud extends BaseComponent {
  constructor() {
    super(statsHudStyles)
    this._stats = { fps: 0, networkBytesPerSec: 0, pendingRequests: 0, memoryMB: 0 }
    this._statsCb = null
  }

  get visible() {
    return store.getters.getStatsForNerds()
  }

  onMounted() {
    this.subscribe(store)

    this._statsCb = (snap) => {
      this._stats = snap
      this._updateStatsDom()
    }

    statsEngine.subscribe(this._statsCb)
  }

  onDestroy() {
    if (this._statsCb) {
      statsEngine.unsubscribe(this._statsCb)
      this._statsCb = null
    }
  }

  onStoreUpdate() {
    this._updateVisibility()
  }

  _updateVisibility() {
    const root = this.$('.' + _B)
    if (!root) return

    if (this.visible) {
      root.classList.add(`${_B}--visible`)
    } else {
      root.classList.remove(`${_B}--visible`)
    }
  }

  _updateStatsDom() {
    const fpsEl = this.$(`[data-stat="fps"]`)
    const netEl = this.$(`[data-stat="net"]`)
    const pendEl = this.$(`[data-stat="pend"]`)
    const memEl = this.$(`[data-stat="mem"]`)

    const { fps, networkBytesPerSec, pendingRequests, memoryMB } = this._stats

    if (fpsEl) {
      fpsEl.textContent = String(fps)

      fpsEl.className = `${_B}-value ${fps >= 55 ? `${_B}-fps-good` : fps >= 30 ? `${_B}-fps-mid` : `${_B}-fps-bad`}`
    }

    if (netEl) {
      const kb = (networkBytesPerSec / 1024).toFixed(1)
      netEl.textContent = `${kb} KB/s`
    }

    if (pendEl) {
      pendEl.textContent = String(pendingRequests)
    }

    if (memEl && memoryMB > 0) {
      memEl.textContent = `${memoryMB} MB`
    }
  }

  render() {
    const { fps, networkBytesPerSec, pendingRequests, memoryMB } = this._stats
    const fpsClass = fps >= 55 ? `${_B}-fps-good` : fps >= 30 ? `${_B}-fps-mid` : `${_B}-fps-bad`
    const kb = (networkBytesPerSec / 1024).toFixed(1)
    const visible = this.visible
    const npu = npuPredict.getNpuAnalytics()
    const accelLabel = npu.hasNPU ? 'NPU' : npu.hasGPU ? 'GPU' : 'WASM'
    const accelClass = npu.hasNPU
      ? `${_B}-value ${_B}-accel-npu`
      : npu.hasGPU
      ? `${_B}-value ${_B}-accel-gpu`
      : `${_B}-value ${_B}-accel-wasm`

    return (
      <div className={`${_B}${visible ? ` ${_B}--visible` : ''}`} role="status" aria-live="off" aria-label="Performance stats">
        <span className={`${_B}-segment`}>
          <span className={`${_B}-label`}>FPS</span>
          <span className={`${_B}-value ${fpsClass}`} data-stat="fps">{String(fps)}</span>
        </span>

        <span className={`${_B}-segment`}>
          <span className={`${_B}-label`}>NET</span>
          <span className={`${_B}-value`} data-stat="net">{`${kb} KB/s`}</span>
        </span>

        <span className={`${_B}-segment`}>
          <span className={`${_B}-label`}>REQ</span>
          <span className={`${_B}-value`} data-stat="pend">{String(pendingRequests)}</span>
        </span>

        <span className={`${_B}-segment`}>
          <span className={`${_B}-label`}>MEM</span>
          <span className={`${_B}-value`} data-stat="mem">{memoryMB > 0 ? `${memoryMB} MB` : '—'}</span>
        </span>

        <span className={`${_B}-segment`}>
          <span className={`${_B}-label`}>AI</span>
          <span className={accelClass} data-stat="accel">{accelLabel}</span>
        </span>
      </div>
    )
  }
}

if (!customElements.get(TAGS.STATS_HUD)) {
  customElements.define(TAGS.STATS_HUD, StatsHud)
}
