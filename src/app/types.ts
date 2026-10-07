/**
 * @file app/types.ts
 * @description Shared structural types for the App shell — the APP
 * translation dictionary plus the augmented element types used when
 * reaching into nav/cookie/pref/lang children and routable views.
 */
/* istanbul ignore file */

import type { RouteDescriptor } from '@/routes/router.js'

/** Shape of the translations/<locale>/APP dictionary node. */
export interface AppTranslations {
  actions?: { click?: string; tap?: string }
  pref?: Record<string, unknown>
  carousel?: Record<string, unknown>
  statsHud?: Record<string, unknown>
  [key: string]: unknown
}

/**
 * Type contract for AppNavEl — the shape consumers rely on.
 */
export type AppNavEl = HTMLElement & {
  translations: AppTranslations | null
  updateScrollState: (_section: string, onBottom: boolean) => void
}
/**
 * Type contract for CookieBannerEl — the shape consumers rely on.
 */
export type CookieBannerEl = HTMLElement & { translations: AppTranslations | null }
/**
 * Type contract for pref modal el.
 */
export type PrefModalEl = HTMLElement & { pref: unknown; open: boolean }
/**
 * Type contract for lang dialog el.
 */
export type LangDialogEl = HTMLElement & { open: boolean }
/**
 * Type contract for RoutableView — the shape consumers rely on.
 */
export type RoutableView = Element & {
  onRouteParamChange?: (_route: RouteDescriptor | null) => void
}
