/**
 * @file docs/scan.mjs
 * @description Filesystem → manifest tree for the docs portal.
 *
 * Scans the publishable roots (docs/, reports/, coverage/, src/) into one
 * manifest object consumed by the `virtual:docs-manifest` module. Files are
 * addressed by a stable `id` (<root>:<relative-path>) which doubles as the
 * `virtual:docs-file/<id>` specifier — each file becomes a lazy chunk so
 * 3.5k documents never load together.
 *
 * Exclusions live in redact.mjs (secrets, database.json, minified builds);
 * node_modules/.git/hidden entries and oversized binaries are dropped here.
 */

import fs from 'node:fs'
import path from 'node:path'
import { shouldExcludeFile } from './redact.mjs'

/**
 * Publishable roots — `root` is the manifest namespace, `dir` the on-disk
 * folder, `label` the display heading shown in the portal grid.
 */
export const DOC_ROOTS = Object.freeze([
  { root: 'docs', dir: 'docs', label: 'Documentation' },
  { root: 'reports', dir: 'reports', label: 'Quality Reports' },
  { root: 'coverage', dir: 'coverage', label: 'Test Coverage' },
  { root: 'src', dir: 'src', label: 'Source Code' },
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

/** Directory entries never published, whatever the format. */
const SKIP_DIRS = new Set(['node_modules', '.git', 'coverage', 'dist'])

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

  for (const { root, dir, label } of DOC_ROOTS) {
    const absDir = path.join(repoRoot, dir)

    if (!fs.existsSync(absDir)) continue

    const children = scanDir(absDir, absDir, root)

    if (!children.length) continue

    roots.push({ root, label, children })

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
