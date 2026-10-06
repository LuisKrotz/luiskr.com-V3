/**
 * @file flag-loop.ts
 * @description Render loop + fallback transitions for FlagWebGL: the
 * requestAnimationFrame ticker, single-frame static render for reduced
 * motion, hover-level easing, and the WebGL→fallback switch on context
 * loss or init failure.
 */

import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import store from '@/core/store.js'
import { flagRenderer } from './renderer.js'
import type { FlagWebGL } from '../flag-webgl.js'

/** Switches to the non-WebGL path (CSS class on the host / Canvas2D) — used on context loss or init failure. */
export function triggerFlagFallback(flag: FlagWebGL): void {
  flag.useWebGL = false

  if (flag.animId) {
    cancelAnimationFrame(flag.animId)

    flag.animId = null
  }

  if (flag.renderer) {
    flagRenderer.release()

    flag.renderer = null
  }

  // init() reaches here with no canvas at all — guard before touching it.
  if (flag.canvas) {
    flag.canvas.style.display = STATE_STRINGS.NONE

    flag.canvas.classList.add(STATE_CLASSES.IS_FALLBACK)
  }
}

/** Draws a single settled frame — used under reduced motion or when the loop is stopped. */
export function renderStaticFlag(flag: FlagWebGL): void {
  flag.hoverLevel = flag.isHovered ? 1.0 : 0.0

  const now = performance.now()

  if (flag.useWebGL && flag.isLoaded) {
    flag._renderWebGL(now)
  }
}

/** Per-frame WebGL render: updates time/hover uniforms and draws the quad. */
export function renderFlagWebGL(flag: FlagWebGL, now: number): void {
  // Purged (offscreen) flags have no renderer — not a failure, just idle.
  if (flag._paused) return

  if (!flag.renderer?.gl) {
    flag._triggerFallback()

    return
  }

  flag.renderer.draw(flag, (now - flag.startTime) * 0.001)
}

/** Starts the requestAnimationFrame render loop (skipped under reduced motion). */
export function animateFlag(flag: FlagWebGL): void {
  if (flag._paused) return

  if (store.getters.getReducedMotion()) {
    if (flag.animId) {
      cancelAnimationFrame(flag.animId)

      flag.animId = null
    }

    flag._renderStatic()

    return
  }

  flag.animId = requestAnimationFrame(() => flag.animate())

  const now = performance.now()

  const targetH = flag.isHovered ? 1.0 : 0.0

  flag.hoverLevel += (targetH - flag.hoverLevel) * 0.12

  if (flag.useWebGL && flag.isLoaded) {
    flag._renderWebGL(now)
  }
}
