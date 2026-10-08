/**
 * @file docs/manifest.ts
 * @description Build-time docs manifest access + path resolution.
 *
 * `virtual:docs-manifest` is emitted by the vite docs-portal plugin — a
 * tree of the publishable roots (docs/, reports/, coverage/, src/) with
 * per-file ids that double as `/docs-content/<id>.json` fetch paths.
 * File payloads are NOT in the manifest; they're fetched on open so the
 * route chunk stays small against ~3.5k documents.
 */

import { DOCS_STRINGS } from '@core/tokens/strings/docs.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import manifest from 'virtual:docs-manifest'

/** One manifest node — dir carries children, file carries format/size/id. */
export interface DocsNode {
  type: 'dir' | 'file'
  name: string
  path: string
  children?: DocsNode[]
  id?: string
  format?: string
  size?: number
  mtime?: string
  embedded?: boolean
}

/** A publishable root bucket (docs / reports / coverage / src). */
export interface DocsRoot {
  root: string
  label: string
  children: DocsNode[]
}

/** Manifest object emitted by the vite plugin. */
export interface DocsManifest {
  generated: string
  roots: DocsRoot[]
}

/** Rendered payload returned by /docs-content/<id>.json. */
export interface DocsFilePayload {
  name: string
  path: string
  format: string
  html: string | null
  media: string | null
  mtime: string
}

const _manifest = manifest as DocsManifest

/** The scanned manifest — the vite plugin + jest stub always emit one. */
export const getDocsManifest = (): DocsManifest => _manifest

/** ISO timestamp of the newest doc file — shown as "last docs update". */
export const docsGeneratedAt = (): string => _manifest.generated

/**
 * Resolves a docs sub-path ('docs/a/b.md' or bare 'a/b' against roots) to
 * the manifest node. Case-sensitive — the tree mirrors the real fs layout.
 * @param docsPath Route param from /docs/<path>.
 * @returns The node, or null when the path doesn't resolve.
 */
export const resolveDocsPath = (docsPath: string): DocsNode | null => {
  if (!docsPath) return null

  const segments = docsPath.split(CHAR_STRINGS.SLASH).filter(Boolean)

  // Leading segment may name a root bucket ('docs/…'); when it doesn't,
  // search every root's top-level children so '/docs/architecture' can
  // still reach 'docs/architecture'.
  const matchedRoot = _manifest.roots.find((r) => r.root === segments[0])

  const rest = matchedRoot ? segments.slice(1) : segments

  // A bare root path ('/docs/docs') resolves to a synthetic dir node so
  // the grid/breadcrumb code treats it like any other folder.
  if (matchedRoot && !rest.length) {
    return {
      type: 'dir',
      name: matchedRoot.label,
      path: matchedRoot.root,
      children: matchedRoot.children,
    }
  }

  let nodes: DocsNode[] = matchedRoot
    ? matchedRoot.children
    : _manifest.roots.flatMap((r) => r.children)

  let cur: DocsNode | null = null

  for (const seg of rest) {
    const next = nodes.find((n) => n.name === seg) || null

    if (!next) return null

    cur = next
    nodes = next.children || []
  }

  return cur
}

/**
 * Breadcrumb segments for a resolved docs path — [{label, path}] from the
 * portal root down to the node.
 * @param docsPath Route param from /docs/<path>.
 * @returns Ordered crumb trail.
 */
export const crumbsForPath = (docsPath: string): Array<{ label: string; path: string }> => {
  const segments = (docsPath || CHAR_STRINGS.EMPTY).split(CHAR_STRINGS.SLASH).filter(Boolean)

  const crumbs: Array<{ label: string; path: string }> = []

  segments.forEach((seg, i) => {
    crumbs.push({ label: seg, path: segments.slice(0, i + 1).join(CHAR_STRINGS.SLASH) })
  })

  return crumbs
}

/**
 * Lazily fetches one rendered file payload. Ids come straight from the
 * manifest, so the URL is encoded segment-wise — never user-derived.
 * @param id Manifest file id ('<root>:<relpath>').
 * @returns Parsed payload, or null on 404/network failure.
 */
export const fetchDocsFile = async (id: string): Promise<DocsFilePayload | null> => {
  const rel = id.replace(CHAR_STRINGS.COLON, CHAR_STRINGS.SLASH)

  const url = `${DOCS_STRINGS.ASSET_BASE}${rel
    .split(CHAR_STRINGS.SLASH)
    .map(encodeURIComponent)
    .join(CHAR_STRINGS.SLASH)}${DOCS_STRINGS.ASSET_EXT}`

  try {
    const res = await fetch(url)

    if (!res.ok) return null

    return (await res.json()) as DocsFilePayload
  } catch {
    return null
  }
}
