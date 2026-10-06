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
 * The fallback app constant.
 */
export const FALLBACK_APP = FALLBACK.APP

/**
 * The FALLBACK_COMPONENTS constant.
 */
export const FALLBACK_COMPONENTS = FALLBACK.components

/**
 * The fallback pages constant.
 */
export const FALLBACK_PAGES = FALLBACK.pages
