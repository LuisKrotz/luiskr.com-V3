/**
 * @file docs/scan.mjs
 * @description Filesystem → manifest tree for the docs portal.
 *
 * Scans the publishable roots into one manifest object consumed by the
 * `virtual:docs-manifest` module. Files are addressed by a stable `id`
 * (<root>:<relative-path>) which doubles as the `virtual:docs-file/<id>`
 * specifier — each file becomes a lazy chunk so 3.5k documents never load
 * together.
 *
 * `kind` classifies each bucket: 'source' roots are protected (copy-guard,
 * no index.html auto-open), 'coverage' roots are per-module test reports,
 * 'docs'/'reports' are browsable content.
 *
 * Exclusions live in redact.mjs (secrets, database.json, minified builds);
 * node_modules/.git/hidden entries and oversized binaries are dropped here.
 */

import fs from 'node:fs'
import path from 'node:path'
import { shouldExcludeFile } from './redact.mjs'

/**
 * Publishable roots — `root` is the manifest namespace (also the docs URL
 * prefix), `dir` the on-disk folder, `label` the display heading shown in
 * the portal grid, `kind` the behavior class.
 */
export const DOC_ROOTS = Object.freeze([
  { root: 'docs', dir: 'shared/docs', label: 'Documentation', kind: 'docs' },
  { root: 'reports', dir: 'experiments/docs/reports', label: 'Quality Reports', kind: 'reports' },
  { root: 'src', dir: 'shared/src', label: 'App Shell Source', kind: 'source' },
  { root: 'core', dir: 'core', label: 'Core Module', kind: 'source' },
  { root: 'website', dir: 'website', label: 'Website Module', kind: 'source' },
  { root: 'cms', dir: 'cms', label: 'CMS Module', kind: 'source' },
  {
    root: 'earth',
    dir: 'experiments/earth-playground',
    label: 'Earth Playground',
    kind: 'source',
  },
  { root: 'docs-exp', dir: 'experiments/docs', label: 'Docs Module', kind: 'source' },
  {
    root: 'local-modules',
    dir: 'shared/local-modules',
    label: 'Local Modules',
    kind: 'source',
  },
  {
    root: 'coverage-app',
    dir: 'shared/reports/coverage',
    label: 'Coverage — App & Shared',
    kind: 'coverage',
  },
  {
    root: 'coverage-core',
    dir: 'core/reports/coverage',
    label: 'Coverage — Core',
    kind: 'coverage',
  },
  {
    root: 'coverage-website',
    dir: 'website/reports/coverage',
    label: 'Coverage — Website',
    kind: 'coverage',
  },
  { root: 'coverage-cms', dir: 'cms/reports/coverage', label: 'Coverage — CMS', kind: 'coverage' },
  {
    root: 'coverage-earth',
    dir: 'experiments/earth-playground/reports/coverage',
    label: 'Coverage — Earth',
    kind: 'coverage',
  },
  {
    root: 'coverage-docs',
    dir: 'experiments/docs/reports/coverage',
    label: 'Coverage — Docs',
    kind: 'coverage',
  },
])

/** Extension → portal format tag. */
const FORMAT_BY_EXT = Object.freeze({
  md: 'markdown',
  markdown: 'markdown',
  html: 'html',
  htm: 'html',
  json: 'json',
  png: 'media',
  jpg: 'media',
  jpeg: 'media',
  gif: 'media',
  webp: 'media',
  mp4: 'media',
  webm: 'media',
  ts: 'code',
  tsx: 'code',
  js: 'code',
  mjs: 'code',
  jsx: 'code',
  cjs: 'code',
  scss: 'code',
  css: 'code',
  svg: 'code',
  xml: 'code',
  yml: 'code',
  yaml: 'code',
  toml: 'code',
  sh: 'code',
  zsh: 'code',
  sql: 'code',
  map: 'code',
  txt: 'text',
})

/** Directory entries never published, whatever the format. `tests` and
 * per-module `reports`/`coverage` trees are reached through their own
 * dedicated roots instead of leaking into a source bucket. */
const SKIP_DIRS = new Set(['node_modules', '.git', 'coverage', 'dist', 'tests', 'reports'])

/** Largest media payload inlined as a data-URL (bytes on disk). */
export const MEDIA_INLINE_LIMIT = 256 * 1024

/**
 * Resolves a file extension to its format tag; unknown/binary shapes fall
 * back to 'text' so every listed file still renders as readable HTML.
 */
const formatOf = (name) => FORMAT_BY_EXT[path.extname(name).slice(1).toLowerCase()] || 'text'

/**
 * Recursively scans one directory into manifest nodes. Hidden entries and
 * SKIP_DIRS are dropped before descent; files are sorted dirs-first, then
 * alphabetically, matching the site-wide recursive-traversal convention.
 * @param {string} absDir   Absolute directory being walked.
 * @param {string} baseDir  Absolute root dir (for relative ids).
 * @param {string} root     Manifest namespace ('docs'|'reports'|…).
 * @returns {Array<object>} Child nodes (dirs and files, stable order).
 */
const scanDir = (absDir, baseDir, root) => {
  const entries = fs.readdirSync(absDir, { withFileTypes: true })

  const dirs = []
  const files = []

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue

    const abs = path.join(absDir, entry.name)

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue

      const children = scanDir(abs, baseDir, root)

      if (children.length) {
        dirs.push({
          type: 'dir',
          name: entry.name,
          path: `${root}/${path.relative(baseDir, abs).replaceAll(path.sep, '/')}`,
          children,
        })
      }
    } else if (entry.isFile() && !shouldExcludeFile(entry.name.toLowerCase())) {
      const stat = fs.statSync(abs)

      const rel = path.relative(baseDir, abs).replaceAll(path.sep, '/')

      const format = formatOf(entry.name)

      files.push({
        type: 'file',
        name: entry.name,
        path: `${root}/${rel}`,
        id: `${root}:${rel}`,
        format,
        size: stat.size,
        mtime: stat.mtime.toISOString(),
        // Binary payloads over the inline cap are listed but not served —
        // the viewer shows a "download on GitHub" notice instead.
        embedded: format === 'media' ? stat.size <= MEDIA_INLINE_LIMIT : true,
      })
    }
  }

  return [...dirs, ...files]
}

/**
 * Builds the complete docs-portal manifest.
 * @param {string} repoRoot Absolute repository root.
 * @returns {{generated: string, roots: Array<object>}} Manifest object.
 */
export const scanManifest = (repoRoot) => {
  const roots = []

  let latest = 0

  for (const { root, dir, label, kind } of DOC_ROOTS) {
    const absDir = path.join(repoRoot, dir)

    if (!fs.existsSync(absDir)) continue

    const children = scanDir(absDir, absDir, root)

    if (!children.length) continue

    roots.push({ root, label, kind, children })

    const newest = (node) =>
      node.type === 'file' ? Date.parse(node.mtime) : Math.max(...node.children.map(newest))

    latest = Math.max(latest, Math.max(...children.map(newest)))
  }

  return { generated: new Date(latest || Date.now()).toISOString(), roots }
}

/**
 * Resolves a manifest `id` ('<root>:<relpath>') back to an absolute path,
 * with the exclusion rules re-applied so a guessed id cannot escape the
 * published tree (defense-in-depth next to route sanitization).
 * @param {string} repoRoot Absolute repository root.
 * @param {string} id       Manifest file id.
 * @returns {string|null} Absolute path, or null when not publishable.
 */
export const resolveFileId = (repoRoot, id) => {
  const sep = id.indexOf(':')

  if (sep < 1) return null

  const root = id.slice(0, sep)

  const rel = id.slice(sep + 1)

  const decl = DOC_ROOTS.find((r) => r.root === root)

  if (!decl || !rel) return null

  // Reject traversal segments before any fs hit.
  if (rel.split('/').some((seg) => seg === '..' || seg === '' || seg.startsWith('.'))) {
    return null
  }

  const absDir = path.resolve(repoRoot, decl.dir)

  const abs = path.resolve(absDir, rel)

  if (!abs.startsWith(absDir + path.sep) || !fs.existsSync(abs)) return null

  const base = path.basename(abs).toLowerCase()

  if (shouldExcludeFile(base) || !fs.statSync(abs).isFile()) return null

  return abs
}
