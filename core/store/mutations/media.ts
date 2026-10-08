/**
 * @file store/mutations/media.ts
 * @description Media + debug-display mutations: stats-for-nerds, the
 * debug grid overlay, and the persisted autoplay toggle — turning it
 * OFF sweeps the page and pauses every playing video (light DOM, inside
 * <media-figure> shadow roots, and the expand-modal) so the preference
 * is honored immediately, not just on next load.
 */

import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import type { MutationMap } from '../state.js'
import type { Store } from '../../store.js'
import { PREF_STORAGE_KEYS } from '@core/tokens/data/storage.js'

/**
 * Pauses one video element, tolerating detached/unloaded nodes. `pause()`
 * can throw on elements whose media was released between query and call
 * (spec allows DOMException on invalid state) — a stale node must never
 * abort the sweep that pauses the remaining videos.
 * @param v The video element, or nullish.
 */
const pauseEl = (v: HTMLVideoElement | null | undefined): void => {
  if (!v) return

  try {
    v.pause()
  } catch {
    // element already detached or source unloaded
  }
}

/** Media + display mutation group. */
export const mediaMutations = (store: Store): MutationMap => ({
  toggleStatsForNerds: () => {
    store.state.showStatsForNerds = !store.state.showStatsForNerds

    if (typeof localStorage !== TYPE_STRINGS.UNDEFINED) {
      localStorage.setItem(PREF_STORAGE_KEYS.STATS_FOR_NERDS, String(store.state.showStatsForNerds))
    }

    // Direct notify() pushes the flag change synchronously — the outer
    // commit() will push once more (mutations return void, not false).
    store.notify()
  },
  toggleShowGrid: () => {
    store.state.showGrid = !store.state.showGrid

    if (typeof localStorage !== TYPE_STRINGS.UNDEFINED) {
      localStorage.setItem(PREF_STORAGE_KEYS.SHOW_GRID, String(store.state.showGrid))
    }

    if (typeof document !== TYPE_STRINGS.UNDEFINED) {
      document.documentElement.classList.toggle(STATE_CLASSES.SHOW_GRID, store.state.showGrid)
    }

    store.notify()
  },
  setVideoAutoplay: (payload) => {
    store.state.videoAutoplay = Boolean(payload)

    if (typeof localStorage !== TYPE_STRINGS.UNDEFINED) {
      localStorage.setItem(PREF_STORAGE_KEYS.VIDEO_AUTOPLAY, String(store.state.videoAutoplay))
    }

    // OFF transition only: sweep every video surface — light DOM, inside
    // each <media-figure>/<media-expanded> shadow root (querySelectorAll
    // can't pierce shadow DOM, so each host's root is queried separately).
    // Turning autoplay back ON doesn't resume anything; the next figure
    // mount/intersection restarts playback naturally.
    if (!store.state.videoAutoplay && typeof document !== TYPE_STRINGS.UNDEFINED) {
      document.querySelectorAll<HTMLVideoElement>(HTML_TAGS.VIDEO).forEach((v) => pauseEl(v))

      document.querySelectorAll(COMPONENT_TAGS.MEDIA_FIGURE).forEach((mf) => {
        pauseEl(mf.shadowRoot?.querySelector<HTMLVideoElement>(HTML_TAGS.VIDEO))
      })

      document.querySelectorAll(COMPONENT_TAGS.MEDIA_EXPANDED).forEach((me) => {
        pauseEl(me.shadowRoot?.querySelector<HTMLVideoElement>(HTML_TAGS.VIDEO))
      })
    }

    store.notify()
  },
  toggleVideoAutoplay: () => {
    store.mutations.setVideoAutoplay(!store.state.videoAutoplay)
  },
})
