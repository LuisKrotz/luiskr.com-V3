/**
 * @file store/mutations/theme.ts
 * @description Theme + reduced-motion mutations: stored preference
 * resolution ('dark'|'light'|'system'), the single <html> dark-mode /
 * reduced-motion class flip every themed CSS rule keys off, and their
 * localStorage persistence.
 */

import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { MEDIA_QUERIES } from '@/core/tokens/primitives.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { THEME } from '@/core/tokens/theme/theme.js'
import type { MutationMap } from '../state.js'
import type { Store } from '../../store.js'
import { PREF_STORAGE_KEYS } from '@/core/tokens/data/storage.js'

/** Theme + reduced-motion mutation group. */
export const themeMutations = (store: Store): MutationMap => ({
  initTheme: () => {
    const stored =
      (typeof localStorage !== TYPE_STRINGS.UNDEFINED &&
        localStorage.getItem(PREF_STORAGE_KEYS.THEME)) ||
      THEME.SYSTEM

    store.state.theme = stored

    store.mutations.applyTheme()
  },
  setTheme: (payload) => {
    store.state.theme = String(payload)

    if (typeof localStorage !== TYPE_STRINGS.UNDEFINED)
      localStorage.setItem(PREF_STORAGE_KEYS.THEME, store.state.theme)

    store.mutations.applyTheme()
  },
  // Resolves the stored preference ('dark'|'light'|'system') to a
  // concrete effectiveTheme and flips <html class="dark-mode"> — the
  // single flag every themed CSS rule keys off.
  applyTheme: () => {
    let isDark

    if (store.state.theme === THEME.DARK) {
      isDark = true
    } else if (store.state.theme === THEME.LIGHT) {
      isDark = false
    } else {
      isDark =
        typeof window !== TYPE_STRINGS.UNDEFINED &&
        window.matchMedia &&
        window.matchMedia(MEDIA_QUERIES.PREFERS_COLOR_DARK).matches
    }

    store.state.effectiveTheme = isDark ? THEME.DARK : THEME.LIGHT

    if (typeof document !== TYPE_STRINGS.UNDEFINED) {
      if (isDark) {
        document.documentElement.classList.add(STATE_CLASSES.DARK_MODE)
      } else {
        document.documentElement.classList.remove(STATE_CLASSES.DARK_MODE)
      }
    }
  },
  initReducedMotion: () => {
    const stored =
      typeof localStorage !== TYPE_STRINGS.UNDEFINED &&
      localStorage.getItem(PREF_STORAGE_KEYS.REDUCED_MOTION)

    if (stored !== null && stored !== false) {
      store.state.reducedMotion = stored === ATTR_VALUES.TRUE
    }

    if (typeof document !== TYPE_STRINGS.UNDEFINED) {
      if (store.state.reducedMotion) {
        document.documentElement.classList.add(STATE_CLASSES.REDUCED_MOTION)
      } else {
        document.documentElement.classList.remove(STATE_CLASSES.REDUCED_MOTION)
      }
    }
  },
  setReducedMotion: (payload) => {
    store.state.reducedMotion =
      typeof payload === TYPE_STRINGS.BOOLEAN ? (payload as boolean) : !store.state.reducedMotion

    if (typeof localStorage !== TYPE_STRINGS.UNDEFINED) {
      localStorage.setItem(PREF_STORAGE_KEYS.REDUCED_MOTION, String(store.state.reducedMotion))
    }

    store.mutations.initReducedMotion()
  },
  toggleReducedMotion: () => {
    store.mutations.setReducedMotion(!store.state.reducedMotion)
  },
})
