/**
 * @file preferences/types.ts — pref.* translation node shape + defaults.
 */

import { FALLBACK_APP } from '@/core/locale/fallback.js'

/**
 * The PrefThemeOption value.
 */
export interface PrefThemeOption {
  label: string
}

/**
 * The PrefNode value.
 */
export interface PrefNode {
  title: string
  done: string
  closeLabel: string
  appearance: {
    title: string
    desc: string
    dark: PrefThemeOption
    system: PrefThemeOption
    light: PrefThemeOption
  }
  devTools: {
    title: string
    statsForNerds: string
    statsForNerdsDesc: string
    showGrid: string
    showGridDesc: string
    reducedMotion: string
    reducedMotionDesc: string
  }
}

/**
 * The PREF_DEFAULTS constant.
 */
export const PREF_DEFAULTS = FALLBACK_APP.pref as PrefNode
