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

    store.state.mentions.title = p.title ?? store.state.mentions.title

    store.state.mentions.items = p.items ?? null
  },
  setComponentLang: (payload) => {
    store.state.lang.components = payload
  },
  setAppLang: (payload) => {
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
    store.state.lang.carousel = {
      ...store.state.lang.carousel,
      ...(payload as Record<string, unknown>),
    }
  },
  setStatsHudLang: (payload) => {
    store.state.lang.statsHud = {
      ...store.state.lang.statsHud,
      ...(payload as Record<string, unknown>),
    }
  },
  setLang: (payload) => {
    if (!payload) return

    if (typeof localStorage !== TYPE_STRINGS.UNDEFINED)
      localStorage.setItem(PREF_STORAGE_KEYS.LOCALE, String(payload))

    if (store.state.lang.locale === payload && store.state.lang.components) return

    store.state.lang.locale = String(payload)

    store.state.lang.components = false

    store.state.lang.app = null

    store.state.lang.slugs = null

    store.state.portfoliolist = []

    store.state.mentions = { title: null, items: null }
  },
})
