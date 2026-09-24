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

    const { fps, networkBytesPerSec, pendingRequests, memoryMB, cpuPercent, latencyMs } = this._stats

    const kb = (networkBytesPerSec / 1024).toFixed(1)

    const statUpdates = [
      {
        key: 'fps',
        text: String(fps),
        className: `${CLASSES.STATS_HUD_VALUE} ${fps >= 55 ? `${CLASSES.STATS_HUD_BASE}-fps-good` : fps >= 30 ? `${CLASSES.STATS_HUD_BASE}-fps-mid` : `${CLASSES.STATS_HUD_BASE}-fps-bad`}`,
      },
      {
        key: 'cpu',
        text: `${cpuPercent}%`,
        className: `${CLASSES.STATS_HUD_VALUE} ${cpuPercent < 30 ? `${CLASSES.STATS_HUD_BASE}-fps-good` : cpuPercent < 70 ? `${CLASSES.STATS_HUD_BASE}-fps-mid` : `${CLASSES.STATS_HUD_BASE}-fps-bad`}`,
      },
      { key: 'net', text: `${kb} ${TEXT.KB_S}` },
      {
        key: 'lat',
        text: latencyMs > 0 ? `${latencyMs}${TEXT.MS}` : TEXT.DASH,
        className: latencyMs === 0
          ? CLASSES.STATS_HUD_VALUE
          : latencyMs < 100 ? `${CLASSES.STATS_HUD_VALUE} ${CLASSES.STATS_HUD_BASE}-fps-good`
          : latencyMs < 400 ? `${CLASSES.STATS_HUD_VALUE} ${CLASSES.STATS_HUD_BASE}-fps-mid`
          : `${CLASSES.STATS_HUD_VALUE} ${CLASSES.STATS_HUD_BASE}-fps-bad`,
      },
      { key: 'pend', text: String(pendingRequests) },
      { key: 'mem', text: memoryMB > 0 ? `${memoryMB} ${TEXT.MB}` : TEXT.DASH },
    ]

    for (const { key, text, className } of statUpdates) {
      const el = this.$(`[data-stat="${key}"]`)

      if (el) {
        el.textContent = text

        if (className) el.className = className
      }
    }
  }

  render() {
    const showStats = this.showStats

    if (!showStats) {
      return null
    }

    const { fps, networkBytesPerSec, pendingRequests, memoryMB, cpuPercent, latencyMs } = this._stats

    const fpsClass = `${CLASSES.STATS_HUD_VALUE} ${fps >= 55 ? `${CLASSES.STATS_HUD_BASE}-fps-good` : fps >= 30 ? `${CLASSES.STATS_HUD_BASE}-fps-mid` : `${CLASSES.STATS_HUD_BASE}-fps-bad`}`

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

    const statSegments = [
      { label: TEXT.FPS, value: String(fps), className: fpsClass, stat: 'fps' },
      { label: TEXT.CPU, value: `${cpuPercent}%`, className: cpuClass, stat: 'cpu' },
      { label: TEXT.NET, value: `${kb} ${TEXT.KB_S}`, stat: 'net' },
      { label: TEXT.LAT, value: latencyMs > 0 ? `${latencyMs}${TEXT.MS}` : TEXT.DASH, className: latClass, stat: 'lat' },
      { label: TEXT.REQ, value: String(pendingRequests), stat: 'pend' },
      { label: TEXT.MEM, value: memoryMB > 0 ? `${memoryMB} ${TEXT.MB}` : TEXT.DASH, stat: 'mem' },
      { label: TEXT.GPU, value: accelLabel, className: accelClass, stat: 'accel' },
    ]

    return (
      <aside
        className={`${CLASSES.STATS_HUD_BASE} ${CLASSES.STATS_HUD_VISIBLE}`}
        role="complementary"
        aria-label={TEXT.PERF_STATS_AND_CONTROLS}
      >
        {statSegments.map(({ label, value, className, stat }) => (
          <span key={stat} className={CLASSES.STATS_HUD_SEGMENT}>
            <span className={CLASSES.STATS_HUD_LABEL}>{label}</span>
            <span className={className || CLASSES.STATS_HUD_VALUE} data-stat={stat}>{value}</span>
          </span>
        ))}
      </aside>
    )
  }
}

if (!customElements.get(TAGS.STATS_HUD)) {
  customElements.define(TAGS.STATS_HUD, StatsHud)
}
