/**
 * @file app/types.ts
 * @description Shared structural types for the App shell — the APP
 * translation dictionary plus the augmented element types used when
 * reaching into nav/cookie/pref/lang children and routable views.
 */
/* istanbul ignore file */

import type { RouteDescriptor } from '@core/router/router.js'

/** Shape of the translations/<locale>/APP dictionary node. */
export interface AppTranslations {
  actions?: { click?: string; tap?: string }
  pref?: Record<string, unknown>
  carousel?: Record<string, unknown>
  statsHud?: Record<string, unknown>
  [key: string]: unknown
}

/** <app-nav> reached through the shell — translations prop + scroll-state setter. */
export type AppNavEl = HTMLElement & {
  translations: AppTranslations | null
  updateScrollState: (_section: string, onBottom: boolean) => void
}

/** <cookie-banner> reached through the shell — only the translations prop is used. */
export type CookieBannerEl = HTMLElement & { translations: AppTranslations | null }

/** <preferences-modal> reached through the shell — `pref` node + open flag. */
export type PrefModalEl = HTMLElement & { pref: unknown; open: boolean }

/** <lang-dialog> reached through the shell — only the open flag is driven. */
export type LangDialogEl = HTMLElement & { open: boolean }

/**
 * A mounted view element that may implement onRouteParamChange — the
 * outlet calls it when a same-tag route updates params (project→project
 * navigation reuses the element).
 */
export type RoutableView = Element & {
  onRouteParamChange?: (_route: RouteDescriptor | null) => void
}
