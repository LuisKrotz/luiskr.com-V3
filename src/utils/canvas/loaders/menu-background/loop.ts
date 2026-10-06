/**
 * @file menu-background-loop.ts — render loop for the menu background:
 * the timed reveal ease (easeOutQuint open / easeInOutQuart close),
 * viewport-resize buffer sync, the rAF loop, and the per-frame draw
 * (uniform updates + the theme-flip resample).
 */

import { MEDIA_QUERIES } from '@/core/tokens/primitives.js'
import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import type { MenuBackgroundWebGL } from '../menu-background-webgl.js'

/** Reveal durations: slow bloom on open, quicker dissolve on close. */
const REVEAL_OPEN_MS = 2600
const REVEAL_CLOSE_MS = 1100

/**
 * Line alpha per theme — the field is a background texture, not content:
 * dark mode keeps a touch more since white hairlines on black blend
 * harder than deep blue on foam.
 */
const ALPHA_DARK = 0.1
const ALPHA_LIGHT = 0.11

/**
 * Begins the render loop on menu open: resamples theme inks, sizes the
 * buffer, attaches the ResizeObserver, and either starts RAF or — under
 * reduced motion — draws one fully-revealed static frame.
 */
export function start(host: MenuBackgroundWebGL): void {
  if (host.isActive || !host.useWebGL) return

  host.isActive = true

  host._lastFrame = performance.now()

  host._animateReveal(1, REVEAL_OPEN_MS)

  host._sampleTheme()

  host._handleResize()

  if (typeof ResizeObserver !== TYPE_STRINGS.UNDEFINED) {
    host._ro = new ResizeObserver(() => host._handleResize())

    host._ro.observe(host.canvas.parentElement || host.canvas)
  }

  const reduced =
    document.documentElement.classList.contains(STATE_CLASSES.REDUCED_MOTION) ||
    (window.matchMedia && window.matchMedia(MEDIA_QUERIES.PREFERS_REDUCED_MOTION).matches)

  if (reduced) {
    host._reveal = 1

    host._renderFrame(0)

    return
  }

  host._loop()
}

/**
 * Eases the reveal back to 0 — used when the menu closes so the field
 * dissolves instead of cutting out. Rendering continues until stop()
 * lets the dissolve finish before the GPU goes idle.
 */
export function release(host: MenuBackgroundWebGL): void {
  host._animateReveal(0, REVEAL_CLOSE_MS)
}

/**
 * Starts (or restarts mid-flight) a timed reveal ease. Capturing the
 * current value as `_revealFrom` means an open→close→open sequence
 * reverses from wherever the field is, with no jump.
 */
export function animateReveal(host: MenuBackgroundWebGL, target: number, dur: number): void {
  host._revealFrom = host._reveal
  host._revealTarget = target
  host._revealT0 = performance.now()
  host._revealDur = dur
}

/**
 * Advances the reveal ease to the current timestamp. easeOutQuint
 * (1-(1-p)^5) opens: a fast bloom that settles gently; easeInOutQuart
 * closes: symmetric gather-and-vanish.
 */
export function tickReveal(host: MenuBackgroundWebGL, now: number): void {
  if (host._revealDur <= 0) {
    host._reveal = host._revealTarget
    return
  }

  const p = Math.min(Math.max((now - host._revealT0) / host._revealDur, 0), 1)

  const e =
    host._revealTarget === 1
      ? 1 - Math.pow(1 - p, 5)
      : p < 0.5
        ? 8 * p * p * p * p
        : 1 - Math.pow(-2 * p + 2, 4) / 2

  host._reveal = host._revealFrom + (host._revealTarget - host._revealFrom) * e

  if (p >= 1) host._revealDur = 0
}

/** Stops the rAF loop + the resize observer. */
export function stop(host: MenuBackgroundWebGL): void {
  host.isActive = false

  if (host.animId) {
    cancelAnimationFrame(host.animId)

    host.animId = null
  }

  if (host._ro) {
    host._ro.disconnect()

    host._ro = null
  }
}

/** Syncs buffer size + u_res uniform with the viewport. */
export function handleResize(host: MenuBackgroundWebGL): void {
  const parent = host.canvas.parentElement || host.canvas

  const rect = parent.getBoundingClientRect()

  // Supersample ×2 past DPR: the buffer renders ~4× the displayed pixels
  // and the browser's CSS downsample provides heavy AA on top of the
  // shader's analytic line AA. The 2560 cap keeps the backing store at
  // ≤26MB — the old 3072 cap (37MB) was the OOM/context-loss vector on
  // constrained GPUs. A zero-size parent (menu opened before layout)
  // falls back to the viewport so the field never draws into a
  // degenerate 0×0 buffer.
  const dpr = Math.min(window.devicePixelRatio || 1, 2) * 2

  const w = rect.width > 0 ? rect.width : window.innerWidth
  const h = rect.height > 0 ? rect.height : window.innerHeight

  host.width = Math.min(Math.round(w * dpr), 2560)

  host.height = Math.min(Math.round(h * dpr), 2560)

  host.canvas.width = host.width

  host.canvas.height = host.height

  if (host.gl) {
    host.gl.viewport(0, 0, host.width, host.height)
  }
}

/** rAF callback — draws the animated contour field each frame. */
export function loop(host: MenuBackgroundWebGL): void {
  if (!host.isActive || !host.gl || !host.useWebGL) return

  host.animId = requestAnimationFrame(() => host._loop())

  host._renderFrame()
}

/** Renders the noise field; a fixed staticTime renders one settled frame. */
export function renderFrame(host: MenuBackgroundWebGL, staticTime?: number | null): void {
  const gl = host.gl

  if (!gl) return

  const now = performance.now()

  // Frame-time delta, clamped at 50ms — a backgrounded tab returns with
  // a huge dt that would snap the reveal instead of easing it.
  const dt = Math.min((now - host._lastFrame) / 1000, 0.05)

  host._lastFrame = now

  // Field time accumulates by dt so reopening the menu continues the
  // drift from where it dissolved instead of jumping to t=0.
  host._elapsed += dt

  const t = staticTime ?? host._elapsed

  host._tickReveal(now)

  const isDark = document.documentElement.classList.contains(STATE_CLASSES.DARK_MODE)

  if (isDark !== host._darkAtStart) {
    host._sampleTheme()
  }

  gl.clearColor(0, 0, 0, 0)

  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(host.program)

  gl.uniform1f(host.uTime, t)

  gl.uniform2f(host.uResolution, host.width, host.height)

  gl.uniform3f(host.uColor, host._color[0], host._color[1], host._color[2])

  gl.uniform3f(host.uColor2, host._color2[0], host._color2[1], host._color2[2])

  gl.uniform1f(host.uReveal, host._reveal)

  gl.uniform1f(host.uAlpha, isDark ? ALPHA_DARK : ALPHA_LIGHT)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}
