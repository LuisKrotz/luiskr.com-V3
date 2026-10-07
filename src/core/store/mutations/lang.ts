/**
 * @file store/mutations/lang.ts
 * @description Locale + translation-dictionary mutations: setLang
 * persists the locale and resets the localized caches so the next fetch
 * repopulates them; the setters push component/app/slug/carousel/stats
 * dictionaries fetched per locale; setMentions feeds the awards strip.
 */

import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import type { MutationMap } from '../state.js'
import type { Store } from '../../store.js'
import { PREF_STORAGE_KEYS } from '@/core/tokens/data/storage.js'

/** Locale + dictionary mutation group. */
export const langMutations = (store: Store): MutationMap => ({
  setMentions: (payload) => {
    const p = payload as { title?: string | null; items?: unknown[] | null }

    // Asymmetric merge on purpose: a missing title keeps the previous value
    // (title arrives on a later node), while missing items reset to null —
    // items drive the list render, so a stale array would show the wrong
    // locale's awards during reload.
    store.state.mentions.title = p.title ?? store.state.mentions.title

    store.state.mentions.items = p.items ?? null
  },
  setComponentLang: (payload) => {
    store.state.lang.components = payload
  },
  setAppLang: (payload) => {
    // Object-shape guard: Firebase returns primitives for missing nodes and
    // callers pass snapshot.val() verbatim — a non-object must collapse to
    // null ("load pending") rather than corrupt the dictionary slot.
    store.state.lang.app =
      payload && typeof payload === TYPE_STRINGS.OBJECT
        ? (payload as Record<string, unknown>)
        : null
  },
  setSlugsLang: (payload) => {
    store.state.lang.slugs =
      payload && typeof payload === TYPE_STRINGS.OBJECT
        ? (payload as Record<string, unknown>)
        : null
  },
  setCarouselLang: (payload) => {
    // Shallow-merge over the seeded EN snapshot — a partial CMS payload
    // overlays keys without deleting snapshot keys the fetch didn't include.
    store.state.lang.carousel = {
      ...store.state.lang.carousel,
      ...(payload as Record<string, unknown>),
    }
  },
  setStatsHudLang: (payload) => {
    // Same overlay semantics as setCarouselLang.
    store.state.lang.statsHud = {
      ...store.state.lang.statsHud,
      ...(payload as Record<string, unknown>),
    }
  },
  setLang: (payload) => {
    if (!payload) return

    // Persist first — the choice must survive reload even if the refetch
    // below never resolves.
    if (typeof localStorage !== TYPE_STRINGS.UNDEFINED)
      localStorage.setItem(PREF_STORAGE_KEYS.LOCALE, String(payload))

    // Same-locale setLang with dictionaries already loaded is a no-op —
    // skip the cache reset so subscribers don't flash skeletons.
    if (store.state.lang.locale === payload && store.state.lang.components) return

    store.state.lang.locale = String(payload)

    // Reset every locale-derived cache to its pending sentinel so the next
    // fetch cycle repopulates cleanly and subscribers render skeletons
    // rather than the previous locale's copy.
    store.state.lang.components = false

    store.state.lang.app = null

    store.state.lang.slugs = null

    store.state.portfoliolist = []

    store.state.mentions = { title: null, items: null }
  },
})
