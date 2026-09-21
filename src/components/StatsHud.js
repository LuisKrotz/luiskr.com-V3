import { h, Fragment } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import { CLASSES, TAGS, TEXT } from '../core/constants.js'
import { statsEngine } from '../utils/stats-engine.js'
import { npuPredict } from '../utils/npu-predict.js'
import statsHudStyles from '../sass/stats-hud.scss?inline'

// ─── Stats & Controls HUD ───────────────────────────────────────────────────
// Fixed pill overlay anchored above the bottom nav.
// When stats for nerds is enabled in preferences, performance stats display in this panel.

class StatsHud extends BaseComponent {
  constructor() {
    super(statsHudStyles)

    this._stats = { fps: 0, networkBytesPerSec: 0, pendingRequests: 0, memoryMB: 0, cpuPercent: 0, latencyMs: 0 }

    this._statsCb = null
  }

  get showStats() {
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
    this._updateDom()
  }

  _updateStatsDom() {
    if (!this.showStats) return

    const fpsEl = this.$(`[data-stat="fps"]`)

    const cpuEl = this.$(`[data-stat="cpu"]`)

    const netEl = this.$(`[data-stat="net"]`)

    const latEl = this.$(`[data-stat="lat"]`)

    const pendEl = this.$(`[data-stat="pend"]`)

    const memEl = this.$(`[data-stat="mem"]`)

    const { fps, networkBytesPerSec, pendingRequests, memoryMB, cpuPercent, latencyMs } = this._stats

    if (fpsEl) {
      fpsEl.textContent = String(fps)

      fpsEl.className = `${CLASSES.STATS_HUD_VALUE} ${fps >= 55 ? `${CLASSES.STATS_HUD_BASE}-fps-good` : fps >= 30 ? `${CLASSES.STATS_HUD_BASE}-fps-mid` : `${CLASSES.STATS_HUD_BASE}-fps-bad`}`
    }

    if (cpuEl) {
      cpuEl.textContent = `${cpuPercent}%`

      cpuEl.className = `${CLASSES.STATS_HUD_VALUE} ${cpuPercent < 30 ? `${CLASSES.STATS_HUD_BASE}-fps-good` : cpuPercent < 70 ? `${CLASSES.STATS_HUD_BASE}-fps-mid` : `${CLASSES.STATS_HUD_BASE}-fps-bad`}`
    }

    if (netEl) {
      const kb = (networkBytesPerSec / 1024).toFixed(1)

      netEl.textContent = `${kb} ${TEXT.KB_S}`
    }

    if (latEl) {
      latEl.textContent = latencyMs > 0 ? `${latencyMs}${TEXT.MS}` : TEXT.DASH

      const latClass = latencyMs === 0
        ? CLASSES.STATS_HUD_VALUE
        : latencyMs < 100
          ? `${CLASSES.STATS_HUD_VALUE} ${CLASSES.STATS_HUD_BASE}-fps-good`
          : latencyMs < 400
            ? `${CLASSES.STATS_HUD_VALUE} ${CLASSES.STATS_HUD_BASE}-fps-mid`
            : `${CLASSES.STATS_HUD_VALUE} ${CLASSES.STATS_HUD_BASE}-fps-bad`

      latEl.className = latClass
    }

    if (pendEl) {
      pendEl.textContent = String(pendingRequests)
    }

    if (memEl && memoryMB > 0) {
      memEl.textContent = `${memoryMB} ${TEXT.MB}`
    }
  }

  render() {
    const showStats = this.showStats

    if (!showStats) {
      return null
    }

    const { fps, networkBytesPerSec, pendingRequests, memoryMB, cpuPercent, latencyMs } = this._stats

    const fpsClass = fps >= 55
      ? `${CLASSES.STATS_HUD_BASE}-fps-good`
      : fps >= 30
        ? `${CLASSES.STATS_HUD_BASE}-fps-mid`
        : `${CLASSES.STATS_HUD_BASE}-fps-bad`

    const cpuClass = `${CLASSES.STATS_HUD_VALUE} ${cpuPercent < 30 ? `${CLASSES.STATS_HUD_BASE}-fps-good` : cpuPercent < 70 ? `${CLASSES.STATS_HUD_BASE}-fps-mid` : `${CLASSES.STATS_HUD_BASE}-fps-bad`}`

    const latClass = latencyMs === 0
      ? CLASSES.STATS_HUD_VALUE
      : latencyMs < 100
        ? `${CLASSES.STATS_HUD_VALUE} ${CLASSES.STATS_HUD_BASE}-fps-good`
        : latencyMs < 400
          ? `${CLASSES.STATS_HUD_VALUE} ${CLASSES.STATS_HUD_BASE}-fps-mid`
          : `${CLASSES.STATS_HUD_BASE}-fps-bad`

    const kb = (networkBytesPerSec / 1024).toFixed(1)

    const npu = npuPredict.getNpuAnalytics()

    const gpuOn = npu.hasNPU || npu.hasGPU

    const accelLabel = gpuOn ? TEXT.ON : TEXT.OFF

    const accelClass = gpuOn
      ? `${CLASSES.STATS_HUD_VALUE} ${CLASSES.STATS_HUD_BASE}-fps-good`
      : `${CLASSES.STATS_HUD_VALUE} ${CLASSES.STATS_HUD_BASE}-fps-bad`

    return (
      <aside
        className={`${CLASSES.STATS_HUD_BASE} ${CLASSES.STATS_HUD_VISIBLE}`}
        role="complementary"
        aria-label={TEXT.PERF_STATS_AND_CONTROLS}
      >
        <span className={CLASSES.STATS_HUD_SEGMENT}>
          <span className={CLASSES.STATS_HUD_LABEL}>{TEXT.FPS}</span>
          <span className={`${CLASSES.STATS_HUD_VALUE} ${fpsClass}`} data-stat="fps">{String(fps)}</span>
        </span>

        <span className={CLASSES.STATS_HUD_SEGMENT}>
          <span className={CLASSES.STATS_HUD_LABEL}>{TEXT.CPU}</span>
          <span className={cpuClass} data-stat="cpu">{`${cpuPercent}%`}</span>
        </span>

        <span className={CLASSES.STATS_HUD_SEGMENT}>
          <span className={CLASSES.STATS_HUD_LABEL}>{TEXT.NET}</span>
          <span className={CLASSES.STATS_HUD_VALUE} data-stat="net">{`${kb} ${TEXT.KB_S}`}</span>
        </span>

        <span className={CLASSES.STATS_HUD_SEGMENT}>
          <span className={CLASSES.STATS_HUD_LABEL}>{TEXT.LAT}</span>
          <span className={latClass} data-stat="lat">{latencyMs > 0 ? `${latencyMs}${TEXT.MS}` : TEXT.DASH}</span>
        </span>

        <span className={CLASSES.STATS_HUD_SEGMENT}>
          <span className={CLASSES.STATS_HUD_LABEL}>{TEXT.REQ}</span>
          <span className={CLASSES.STATS_HUD_VALUE} data-stat="pend">{String(pendingRequests)}</span>
        </span>

        <span className={CLASSES.STATS_HUD_SEGMENT}>
          <span className={CLASSES.STATS_HUD_LABEL}>{TEXT.MEM}</span>
          <span className={CLASSES.STATS_HUD_VALUE} data-stat="mem">{memoryMB > 0 ? `${memoryMB} ${TEXT.MB}` : TEXT.DASH}</span>
        </span>

        <span className={CLASSES.STATS_HUD_SEGMENT}>
          <span className={CLASSES.STATS_HUD_LABEL}>{TEXT.GPU}</span>
          <span className={accelClass} data-stat="accel">{accelLabel}</span>
        </span>
      </aside>
    )
  }
}

if (!customElements.get(TAGS.STATS_HUD)) {
  customElements.define(TAGS.STATS_HUD, StatsHud)
}
