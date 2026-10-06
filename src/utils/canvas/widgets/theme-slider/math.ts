/**
 * @file theme-slider-math.ts — position mapping for the theme slider.
 * Track position is normalized 0.0–2.0 (0=dark, 1=system, 2=light);
 * these helpers convert between theme, position and knob pixel X.
 */

import { THEME } from '@/core/tokens/theme/theme.js'
import type { ThemeSliderWebGL } from '../theme-slider.js'

/** Knob travel inset — the knob radius, so it never overhangs the capsule ends. */
const KNOB_INSET = 32.0

/** Drag band edges — middle 76% of the canvas is active (12%–88%). */
const DRAG_MIN_RATIO = 0.12
const DRAG_MAX_RATIO = 0.88

/** THEME → normalized track position (integer stops; fractions only mid-animation). */
export function themeToP(theme: string): number {
  if (theme === THEME.DARK) return 0.0

  if (theme === THEME.LIGHT) return 2.0

  return 1.0
}

/** Maps a normalized track position back to the nearest THEME value. */
export function pToTheme(p: number): string {
  if (p < 0.5) return THEME.DARK

  if (p > 1.5) return THEME.LIGHT

  return THEME.SYSTEM
}

/**
 * Normalized position → knob pixel X inside the track. The knob is
 * inset 32px from each capsule end (≈ its own radius) so it never
 * overhangs the rounded border; p/2 maps 0–2 → 0–1 of that inset span.
 */
export function pToKnobX(host: ThemeSliderWebGL, p: number): number {
  const minX = KNOB_INSET

  const maxX = host.width - KNOB_INSET

  return minX + (maxX - minX) * (p / 2.0)
}

/**
 * Pointer pixel X → continuous (unclamped-drag) normalized position.
 * The active band is the middle 76% of the canvas (12%–88%) — the
 * capsule's rounded ends are dead zone so a tap near the very edge
 * still snaps to the outermost stop instead of overshooting.
 */
export function xToContinuousP(
  host: ThemeSliderWebGL,
  x: number,
  rectWidth: number | null = null
): number {
  const totalW = rectWidth && rectWidth > 0 ? rectWidth : host.width

  const minX = totalW * DRAG_MIN_RATIO

  const maxX = totalW * DRAG_MAX_RATIO

  const clampedX = Math.max(minX, Math.min(maxX, x))

  return ((clampedX - minX) / (maxX - minX)) * 2.0
}

/**
 * Pointer pixel X → normalized position using the fixed 32px insets
 * (same span as pToKnobX). Retained for non-drag hit paths.
 */
export function xToP(host: ThemeSliderWebGL, x: number): number {
  const minX = KNOB_INSET

  const maxX = host.width - KNOB_INSET

  const clampedX = Math.max(minX, Math.min(maxX, x))

  return ((clampedX - minX) / (maxX - minX)) * 2.0
}
