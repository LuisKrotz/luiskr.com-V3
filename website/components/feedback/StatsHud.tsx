/**
 * @file StatsHud.js
 * @description <stats-hud> — the stats-for-nerds overlay: a compact HUD in
 * the corner rendering FPS/network/CPU/memory/latency plus the NPU
 * acceleration tier, fed by statsEngine on a subscription that starts only
 * while the HUD is enabled.
 */

import { STATS_CLASSES } from '@core/tokens/classes/stats.js'
import { ENGINE_UI_KEYS, STATS_UI_KEYS } from '@core/tokens/data/ui-keys.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { UNIT_TEXT } from '@core/tokens/strings/text.js'
import { h } from '@core/jsx.js'
import { BaseComponent } from '@core/Component.js'
import store from '@core/store.js'
import { appText } from '@core/locale/ui-text.js'
import { statsEngine } from '@core/utils/perf/stats-engine.js'
import type { StatsSnapshot } from '@core/utils/perf/stats-engine.js'
import { npuPredict } from '@core/utils/gpu/npu-predict.js'
import statsHudStyles from '@core/sass/components/feedback/stats-hud.scss?inline'

// ─── Stats & Controls HUD ───────────────────────────────────────────────────
// Fixed pill overlay anchored above the bottom nav.
// When stats for nerds is enabled in preferences, performance stats display in this panel.

class StatsHud extends BaseComponent {
  // Last metrics snapshot from statsEngine — seeded at zero so render()
  // has a shape to read before the first sample lands.
  private _stats: StatsSnapshot = {
    fps: 0,
    networkBytesPerSec: 0,
    pendingRequests: 0,
    memoryMB: 0,
    cpuPercent: 0,
    latencyMs: 0,
  }

  private _statsCb: ((_snap: StatsSnapshot) => void) | null = null

  constructor() {
    super(statsHudStyles)
  }

  /** Whether the HUD is enabled in preferences. */

  get showStats() {
    return store.getters.getStatsForNerds()
  }

  /**
   * Lifecycle: store subscription drives show/hide re-renders; the engine
   * subscription is a *direct* channel — stats update every ~500ms, far
   * too hot for the store's full-subscriber broadcast, so _updateStatsDom
   * patches text nodes imperatively without re-running render().
   */
  override onMounted() {
    this.subscribe(store)

    this._statsCb = (snap) => {
      this._stats = snap

      this._updateStatsDom()
    }

    statsEngine.subscribe(this._statsCb)
  }

  /** Lifecycle: stops the engine feed so the subscription outlives no element. */
  override onDestroy() {
    if (this._statsCb) {
      statsEngine.unsubscribe(this._statsCb)

      this._statsCb = null
    }
  }

  /** Store change → full re-render (covers the HUD's show/hide toggle). */
  override onStoreUpdate() {
    this._updateDom()
  }

  /**
   * Resolves the live acceleration label/class. This is intentionally read
   * at every stats tick: the HUD can mount before the lazy shared WebGL
   * accelerator creates its context, so caching the initial result would
   * leave capable desktop GPUs displayed as permanently off.
   */
  private _accelerationDisplay(): { label: string; className: string } {
    const npu = npuPredict.getNpuAnalytics()

    const active = npu.hasNPU || npu.hasGPU

    const label = appText(active ? ENGINE_UI_KEYS.ENGINE_ON : ENGINE_UI_KEYS.ENGINE_OFF)

    return {
      label: String(label),
      className: active
        ? `${STATS_CLASSES.STATS_HUD_VALUE} ${STATS_CLASSES.STATS_HUD_BASE}-fps-good`
        : `${STATS_CLASSES.STATS_HUD_VALUE} ${STATS_CLASSES.STATS_HUD_BASE}-fps-bad`,
    }
  }

  /**
   * Pushes the latest metrics snapshot into the HUD's DOM fields (called
   * by statsEngine at its sampling cadence). Color-class thresholds:
   *   fps     ≥55 good / ≥30 mid / below bad  (60Hz budget ≈ 55 usable)
   *   cpu     <30% good / <70% mid / else bad
   *   latency <100ms good / <400ms mid / else bad (0 = no sample → dash)
   * Throughput is bytes/sec → kB/s with one decimal.
   */
  private _updateStatsDom(): void {
    if (!this.showStats) return

    const { fps, networkBytesPerSec, pendingRequests, memoryMB, cpuPercent, latencyMs } =
      this._stats

    const kb = (networkBytesPerSec / 1024).toFixed(1)

    const acceleration = this._accelerationDisplay()

    const statUpdates: Array<{ key: string; text: string; className?: string }> = [
      {
        key: 'fps',
        text: String(fps),
        className: `${STATS_CLASSES.STATS_HUD_VALUE} ${fps >= 55 ? `${STATS_CLASSES.STATS_HUD_BASE}-fps-good` : fps >= 30 ? `${STATS_CLASSES.STATS_HUD_BASE}-fps-mid` : `${STATS_CLASSES.STATS_HUD_BASE}-fps-bad`}`,
      },
      {
        key: 'cpu',
        text: `${cpuPercent}%`,
        className: `${STATS_CLASSES.STATS_HUD_VALUE} ${cpuPercent < 30 ? `${STATS_CLASSES.STATS_HUD_BASE}-fps-good` : cpuPercent < 70 ? `${STATS_CLASSES.STATS_HUD_BASE}-fps-mid` : `${STATS_CLASSES.STATS_HUD_BASE}-fps-bad`}`,
      },
      { key: 'net', text: `${kb} ${UNIT_TEXT.KB_S}` },
      {
        key: 'lat',
        text: latencyMs > 0 ? `${latencyMs}${UNIT_TEXT.MS}` : CHAR_STRINGS.DASH,
        className:
          latencyMs === 0
            ? STATS_CLASSES.STATS_HUD_VALUE
            : latencyMs < 100
              ? `${STATS_CLASSES.STATS_HUD_VALUE} ${STATS_CLASSES.STATS_HUD_BASE}-fps-good`
              : latencyMs < 400
                ? `${STATS_CLASSES.STATS_HUD_VALUE} ${STATS_CLASSES.STATS_HUD_BASE}-fps-mid`
                : `${STATS_CLASSES.STATS_HUD_VALUE} ${STATS_CLASSES.STATS_HUD_BASE}-fps-bad`,
      },
      { key: 'pend', text: String(pendingRequests) },
      { key: 'mem', text: memoryMB > 0 ? `${memoryMB} ${UNIT_TEXT.MB}` : CHAR_STRINGS.DASH },
      { key: 'accel', text: acceleration.label, className: acceleration.className },
    ]

    for (const { key, text, className } of statUpdates) {
      const el = this.$(`[data-stat="${key}"]`)

      if (el) {
        el.textContent = text

        if (className) el.className = className
      }
    }
  }

  /**
   * JSX template — a horizontal pill of label/value segments. Returns null
   * (renders nothing) when the preference is off, so the HUD costs zero
   * DOM when disabled. Threshold classes mirror _updateStatsDom's rules.
   */
  override render() {
    const showStats = this.showStats

    if (!showStats) {
      return null
    }

    const { fps, networkBytesPerSec, pendingRequests, memoryMB, cpuPercent, latencyMs } =
      this._stats

    const fpsClass = `${STATS_CLASSES.STATS_HUD_VALUE} ${fps >= 55 ? `${STATS_CLASSES.STATS_HUD_BASE}-fps-good` : fps >= 30 ? `${STATS_CLASSES.STATS_HUD_BASE}-fps-mid` : `${STATS_CLASSES.STATS_HUD_BASE}-fps-bad`}`

    const cpuClass = `${STATS_CLASSES.STATS_HUD_VALUE} ${cpuPercent < 30 ? `${STATS_CLASSES.STATS_HUD_BASE}-fps-good` : cpuPercent < 70 ? `${STATS_CLASSES.STATS_HUD_BASE}-fps-mid` : `${STATS_CLASSES.STATS_HUD_BASE}-fps-bad`}`

    const latClass =
      latencyMs === 0
        ? STATS_CLASSES.STATS_HUD_VALUE
        : latencyMs < 100
          ? `${STATS_CLASSES.STATS_HUD_VALUE} ${STATS_CLASSES.STATS_HUD_BASE}-fps-good`
          : latencyMs < 400
            ? `${STATS_CLASSES.STATS_HUD_VALUE} ${STATS_CLASSES.STATS_HUD_BASE}-fps-mid`
            : `${STATS_CLASSES.STATS_HUD_BASE}-fps-bad`

    const kb = (networkBytesPerSec / 1024).toFixed(1)

    const acceleration = this._accelerationDisplay()

    const statSegments = [
      {
        label: appText(STATS_UI_KEYS.STATS_FPS),
        value: String(fps),
        className: fpsClass,
        stat: 'fps',
      },
      {
        label: appText(STATS_UI_KEYS.STATS_CPU),
        value: `${cpuPercent}%`,
        className: cpuClass,
        stat: 'cpu',
      },
      { label: appText(STATS_UI_KEYS.STATS_NET), value: `${kb} ${UNIT_TEXT.KB_S}`, stat: 'net' },
      {
        label: appText(STATS_UI_KEYS.STATS_LAT),
        value: latencyMs > 0 ? `${latencyMs}${UNIT_TEXT.MS}` : CHAR_STRINGS.DASH,
        className: latClass,
        stat: 'lat',
      },
      { label: appText(STATS_UI_KEYS.STATS_REQ), value: String(pendingRequests), stat: 'pend' },
      {
        label: appText(STATS_UI_KEYS.STATS_MEM),
        value: memoryMB > 0 ? `${memoryMB} ${UNIT_TEXT.MB}` : CHAR_STRINGS.DASH,
        stat: 'mem',
      },
      {
        label: appText(STATS_UI_KEYS.STATS_GPU),
        value: acceleration.label,
        className: acceleration.className,
        stat: 'accel',
      },
    ]

    return (
      <aside
        className={`${STATS_CLASSES.STATS_HUD_BASE} ${STATS_CLASSES.STATS_HUD_VISIBLE}`}
        role="complementary"
        aria-label={appText(ENGINE_UI_KEYS.ENGINE_CONTROLS)}
      >
        {statSegments.map(({ label, value, className, stat }) => (
          <span key={stat} className={STATS_CLASSES.STATS_HUD_SEGMENT}>
            <span className={STATS_CLASSES.STATS_HUD_LABEL}>{label}</span>
            <span className={className || STATS_CLASSES.STATS_HUD_VALUE} data-stat={stat}>
              {value}
            </span>
          </span>
        ))}
      </aside>
    )
  }
}

if (!customElements.get(COMPONENT_TAGS.STATS_HUD)) {
  customElements.define(COMPONENT_TAGS.STATS_HUD, StatsHud)
}
