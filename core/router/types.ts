/**
 * @file routes/types.ts — route descriptor shape + hook/listener
 * signatures shared by parse-path, navigate and the Router facade.
 */
/* istanbul ignore file */

/**
 * Metadata one route contributes to the document — `title`/`translation` feed
 * the head, `scrollTo` a post-nav anchor, `projectRoute`/`legalRoute` classify the
 * page for schema/analytics treatment.
 */
export interface RouteMeta {
  title?: string
  translation?: string
  scrollTo?: string
  projectRoute?: boolean
  legalRoute?: boolean
  /** English-only docs portal — suppresses the language switcher. */
  docsRoute?: boolean
}

/** A resolved route — everything the nav pipeline and views need. */
export interface RouteDescriptor {
  /** Route table name ('home', 'project', 'legal', 'not-found', …). */
  name: string
  /** Custom-element tag of the view to mount. */
  view: string
  /** Resolved locale id ('en', 'pt', …). */
  lang: string
  /** The matched URL path (kept for locale detection and analytics). */
  path: string
  /** Head/scroll classification metadata. */
  meta: RouteMeta
  /** Extracted params — `slug` on project routes, etc. */
  params: Record<string, string | undefined>
}

/** Subscriber signature — fired on every successful navigation. */
export type RouteListener = (_to: RouteDescriptor, from: RouteDescriptor | null) => void

/** Guard/hook signature — a returned string/{path} short-circuits into a redirect. */
export type NavHook = (_to: RouteDescriptor, from: RouteDescriptor | null) => unknown
