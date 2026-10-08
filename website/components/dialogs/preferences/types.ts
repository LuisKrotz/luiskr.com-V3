/**
 * @file preferences/types.ts — pref.* translation node shape + defaults.
 */

import { FALLBACK_APP } from '@core/locale/fallback.js'

/** One theme option's translated label (dark / system / light). */
export interface PrefThemeOption {
  /** Translated option label rendered next to the radio. */
  label: string
}

/** `pref.*` translation node consumed by the preferences dialog. */
export interface PrefNode {
  /** Dialog heading. */
  title: string
  /** Confirmation text after the apply action. */
  done: string
  /** aria-label for the close button. */
  closeLabel: string
  /** Appearance section — theme picker copy. */
  appearance: {
    /** Section heading. */
    title: string
    /** Section description under the heading. */
    desc: string
    /** Dark-theme radio option. */
    dark: PrefThemeOption
    /** Follow-OS radio option. */
    system: PrefThemeOption
    /** Light-theme radio option. */
    light: PrefThemeOption
  }
  /** Developer-tools section — diagnostic toggles copy. */
  devTools: {
    /** Section heading. */
    title: string
    /** Label for the stats-for-nerds toggle. */
    statsForNerds: string
    /** Description under the stats toggle. */
    statsForNerdsDesc: string
    /** Label for the layout-grid overlay toggle. */
    showGrid: string
    /** Description under the grid toggle. */
    showGridDesc: string
    /** Label for the reduced-motion override toggle. */
    reducedMotion: string
    /** Description under the reduced-motion toggle. */
    reducedMotionDesc: string
  }
}

/**
 * Build-time English copy for the dialog — used until the locale node
 * resolves so the UI never renders empty labels.
 */
export const PREF_DEFAULTS = FALLBACK_APP.pref as PrefNode
