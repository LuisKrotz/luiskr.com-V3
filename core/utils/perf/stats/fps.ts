/**
 * @file stats/fps.ts
 * @description FPS sampler for the stats engine: counts rAF ticks and
 * derives frames/second on a rolling 1s window.
 */

import type { StatsEngine } from '../stats-engine.js'

/** Counts rAF ticks and derives frames/second on a rolling 1s window. */
export function startFpsLoop(engine: StatsEngine): void {
  const tick = (now: number) => {
    if (!engine._running) return

    engine._frameCount++

    const elapsed = now - engine._lastFrameTime

    if (elapsed >= 1000) {
      engine._fps = Math.round((engine._frameCount * 1000) / elapsed)

      engine._frameCount = 0

      engine._lastFrameTime = now
    }

    engine._rafId = requestAnimationFrame(tick)
  }

  engine._rafId = requestAnimationFrame(tick)
}
