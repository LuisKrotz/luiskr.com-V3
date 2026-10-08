/**
 * @file flag-anim.ts
 * @description Flag geometry + animation-mode mapping for FlagWebGL:
 * natural-aspect sizing, hybrid split-point math, and the per-locale
 * shader animation table (wave / ripple / static variants).
 */

import { LOCALES } from '@core/tokens/locales.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import type { FlagWebGL } from '../flag-webgl.js'
import { FLAG_DIMENSIONS } from '@core/tokens/media/dimensions.js'

/**
 * Display aspect of the whole canvas. A split flag shows the left half of
 * the first flag and the right half of the second, each at natural scale,
 * so its width is the mean of both natural widths.
 * @returns {number} natural aspect ratio the flag should display at.
 */
export const displayAspect = (flag: FlagWebGL): number =>
  flag.lang.cc2 ? (flag.aspect1 + flag.aspect2) / 2 : flag.aspect1

/**
 * Normalized 0–1 x where a hybrid flag's two halves meet: the first
 * flag's share of the combined aspect widths (aspect1/(aspect1+aspect2))
 * so each half keeps its natural proportions instead of stretching 50/50.
 * @returns {number}
 */
export const splitPoint = (flag: FlagWebGL): number => flag.aspect1 / (flag.aspect1 + flag.aspect2)

/** Sizes the canvas to the flag's natural aspect ratio. */
export function resizeToNaturalAspect(flag: FlagWebGL): void {
  flag.width = Math.round(flag.height * flag._displayAspect())

  const dpr =
    Math.max((typeof window !== TYPE_STRINGS.UNDEFINED ? window.devicePixelRatio : 1) || 1, 2) * 2

  flag.canvas.width = Math.round(flag.width * dpr)

  flag.canvas.height = Math.round(flag.height * dpr)
}

/** Picks the shader's animation mode (wave / gentle ripple / static). */
export function getAnimType(flag: FlagWebGL): number {
  const code = flag.lang.code

  switch (code) {
    case LOCALES.EN:
      return 0.0
    case LOCALES.BR:
      return 1.0
    case LOCALES.ES:
      return 2.0
    case LOCALES.DE:
      return 3.0
    case LOCALES.HRK:
      return 4.0
    case LOCALES.CAS:
      return 5.0
    case LOCALES.RIV:
      return 6.0
    case LOCALES.GN:
      return 7.0
    case LOCALES.IT:
      return 8.0
    case LOCALES.RU:
      return 9.0
    case LOCALES.FR:
      return 10.0
    case LOCALES.TLN:
      return 11.0
    case LOCALES.GL:
      return 12.0
    case LOCALES.CA:
      return 13.0
    case LOCALES.NL:
      return 14.0
    case LOCALES.GA:
      return 15.0
    default:
      return 0.0
  }
}

/**
 * flags display aspect default.
 */
export const FLAG_DISPLAY_ASPECT_DEFAULT = FLAG_DIMENSIONS.FLAG_DEFAULT_ASPECT
