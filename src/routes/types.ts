/**
 * @file routes/types.ts — route descriptor shape + hook/listener
 * signatures shared by parse-path, navigate and the Router facade.
 */
/* istanbul ignore file */

export interface RouteMeta {
  title?: string
  translation?: string
  scrollTo?: string
  projectRoute?: boolean
  legalRoute?: boolean
}

/**
 * routes descriptor.
 */
export interface RouteDescriptor {
  name: string
  view: string
  lang: string
  path: string
  meta: RouteMeta
  params: Record<string, string | undefined>
}

/**
 * routes listener.
 * @param _to — the value
 * @param from — the value
 */
export type RouteListener = (_to: RouteDescriptor, from: RouteDescriptor | null) => void
/**
 * Type contract for nav hook.
 */
export type NavHook = (_to: RouteDescriptor, from: RouteDescriptor | null) => unknown
