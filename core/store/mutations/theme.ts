/**
 * @file store/mutations/theme.ts
 * @description Theme + reduced-motion mutations: stored preference
 * resolution ('dark'|'light'|'system'), the single <html> dark-mode /
 * reduced-motion class flip every themed CSS rule keys off, and their
 * localStorage persistence.
 */

import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { MEDIA_QUERIES } from '@core/tokens/primitives.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { THEME } from '@core/tokens/theme/theme.js'
import type { MutationMap } from '../state.js'
import type { Store } from '../../store.js'
import { PREF_STORAGE_KEYS } from '@core/tokens/data/storage.js'

/** Theme + reduced-motion mutation group. */
export const themeMutations = (store: Store): MutationMap => ({
  initTheme: () => {
    // Persisted choice wins; absent/unreadable storage → 'system' so the OS
    // scheme decides. `||` (not `??`) also treats '' as missing — an empty
    // stored value is never a valid theme.
    const stored =
      (typeof localStorage !== TYPE_STRINGS.UNDEFINED &&
        localStorage.getItem(PREF_STORAGE_KEYS.THEME)) ||
      THEME.SYSTEM

    store.state.theme = stored

    // Direct mutator call (not commit) — the outer commit still owes one
    // notify() for this mutation, and a nested commit would double-fan-out.
    store.mutations.applyTheme()
  },
  setTheme: (payload) => {
    store.state.theme = String(payload)

    // Persist before resolving so a mid-flight failure can't leave the
    // visible theme and the remembered choice diverged.
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
      // 'system' (or any unrecognized value): re-probe the OS scheme live —
      // matchMedia is evaluated per call so an OS-level flip while the page
      // is open applies on the next notify cycle.
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

    // Only an explicit stored choice overrides the OS-derived seed from
    // createInitialState — absent storage leaves the media-query default.
    // (getItem returns string|null, so `!== false` is belt-and-suspenders
    // for non-browser shims that return booleans.)
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
    // Boolean payload sets explicitly; anything else (click events pass the
    // event object) toggles — the toggle arm exists because callers don't
    // always know the current value.
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
