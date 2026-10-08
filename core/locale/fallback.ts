/**
 * @file locale/fallback.ts
 * @description Build-time English translation snapshot. The Vite plugin
 * `virtual:i18n-fallback` inlines `database.json`'s `translations/en` node
 * at build time, so every component has instantly-renderable English copy
 * before (and if) the Firebase fetch resolves — first paint never shows
 * empty labels, and no user-facing string lives in JS source.
 */

import snapshot from 'virtual:i18n-fallback'

/** Shape of the translations/<locale> DB node inlined by the Vite plugin. */
interface FallbackSnapshot {
  APP: {
    actions: { click: string; tap: string }
    carousel: Record<string, unknown>
    statsHud: Record<string, unknown>
    loader: { lines: string[] }
    [key: string]: unknown
  }
  components: Record<string, unknown>
  pages: Record<string, unknown>
  [key: string]: unknown
}

/**
 * English UI copy snapshotted from database.json at build time.
 * Components read live translations from the store first and fall back to
 * this snapshot, so no user-visible string lives in JavaScript source.
 */
export const FALLBACK = Object.freeze(snapshot as FallbackSnapshot)

/**
 * The APP subtree of the fallback snapshot — app-shell copy (actions,
 * carousel labels, loader lines) consumed before Firebase resolves.
 */
export const FALLBACK_APP = FALLBACK.APP

/**
 * The components subtree — per-component copy fallbacks keyed by component
 * token (e.g. aboutSection, siteToast).
 */
export const FALLBACK_COMPONENTS = FALLBACK.components

/**
 * The pages subtree — per-page fallback nodes (home, about, legal…).
 */
export const FALLBACK_PAGES = FALLBACK.pages
