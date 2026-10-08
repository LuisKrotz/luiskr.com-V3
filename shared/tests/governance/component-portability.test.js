/**
 * @file component-portability.test.js
 * @description Self-containment gate: a component folder must be copyable
 * (its JS/TS + SCSS) into another project and work with different data.
 * That means no inbound dependency on ANOTHER component folder, no imports
 * from routes/cms/app glue, and no deep imports into src internals that
 * aren't shared primitives (core tokens, store, jsx, Component, utils).
 * Shared helpers used by multiple components must live under core/utils or
 * core — never inside a component folder.
 */

import { describe, test, expect } from '@jest/globals'
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { resolve, dirname, join } from 'path'

const ROOT = '/home/luis/projects/luiskr.com-V3'
const COMPONENTS = resolve(ROOT, 'website/components')

/** Recursively collect every .ts/.tsx module under a directory. */
const walk = (dir, acc = []) => {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    const st = statSync(p)

    if (st.isDirectory()) walk(p, acc)
    else if (/\.(ts|tsx)$/.test(entry)) acc.push(p)
  }

  return acc
}

/**
 * Top-level owner of a component module: the first path segment under
 * website/components (feature folder) or the file itself (top-level file).
 */
const ownerOf = (abs) => {
  const rel = abs.slice(COMPONENTS.length + 1)
  const parts = rel.split('/')

  return parts.length > 1 ? parts[0] : rel
}

/** Area-alias → directory map, mirroring tsconfig paths + vite aliases. */
const ALIAS_ROOTS = {
  '@/': 'shared/src',
  '@core/': 'core',
  '@website/': 'website',
  '@cms/': 'cms',
  '@earth/': 'experiments/earth-playground',
  '@docs/': 'experiments/docs',
}

/** Resolves an import specifier to a repo path, or null for externals. */
const resolveSpec = (spec, fromFile) => {
  if (spec.startsWith('.')) return resolve(dirname(fromFile), spec)

  for (const [alias, dir] of Object.entries(ALIAS_ROOTS)) {
    if (spec.startsWith(alias)) return resolve(ROOT, dir, spec.slice(alias.length))
  }

  if (spec === '@core') return resolve(ROOT, 'core/index.ts')

  return null
}

describe('Component portability (self-contained folders)', () => {
  const files = walk(COMPONENTS)

  test('no component imports another component folder', () => {
    const violations = []

    for (const f of files) {
      const owner = ownerOf(f)
      const src = readFileSync(f, 'utf8')

      for (const m of src.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
        const resolved = resolveSpec(m[1], f)

        if (!resolved) continue

        if (resolved.startsWith(COMPONENTS + '/') && ownerOf(resolved) !== owner) {
          violations.push(`${f.slice(ROOT.length + 1)} → ${resolved.slice(ROOT.length + 1)}`)
        }
      }
    }

    expect(violations).toEqual([])
  })

  test('components never import routes, cms, or app glue', () => {
    const violations = []
    const forbidden = [
      resolve(ROOT, 'website/views'),
      resolve(ROOT, 'cms'),
      resolve(ROOT, 'shared/src/app'),
      resolve(ROOT, 'experiments'),
    ]

    // The router singleton + its descriptor types are shared infra (like the
    // store): navigation is the contract components expose, not view logic.
    const allowedRouteImports = [
      resolve(ROOT, 'core/router/router.js'),
      resolve(ROOT, 'core/router/types.js'),
    ]

    for (const f of files) {
      const src = readFileSync(f, 'utf8')

      for (const m of src.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
        const resolved = resolveSpec(m[1], f)

        if (resolved && allowedRouteImports.includes(resolved)) continue

        if (resolved && forbidden.some((dir) => resolved.startsWith(dir + '/'))) {
          violations.push(`${f.slice(ROOT.length + 1)} → ${resolved.slice(ROOT.length + 1)}`)
        }
      }
    }

    expect(violations).toEqual([])
  })

  test('every component module has a discoverable style entry or is a pure delegate', () => {
    // Component entry points import an inline .scss; leaf delegates (render/
    // data/nav helpers) legitimately have none. Assert at folder granularity:
    // each feature folder that defines an element must contain ≥1 .scss import.
    const folderScss = new Map()

    for (const f of files) {
      const owner = ownerOf(f)
      const src = readFileSync(f, 'utf8')

      if (/\.scss\?inline['"]/.test(src) || /\.scss['"]/.test(src)) {
        folderScss.set(owner, true)
      }
    }

    // Element-defining folders (contain customElements.define) must have scss
    const missing = []

    for (const f of files) {
      const src = readFileSync(f, 'utf8')

      if (src.includes('customElements.define') && !folderScss.get(ownerOf(f))) {
        missing.push(f.slice(ROOT.length + 1))
      }
    }

    expect(missing).toEqual([])
  })

  test('component imports only use shared roots (core/utils/sass/tokens/fixtures)', () => {
    const violations = []
    const sharedRoots = [
      resolve(ROOT, 'core'),
      resolve(ROOT, 'core/utils'),
      resolve(ROOT, 'core/sass'),
      resolve(ROOT, 'core/firebase'),
      resolve(ROOT, 'shared/src/data'),
      resolve(ROOT, 'core/legacy-polyfills/polyfills.ts'),
      // Shared navigation infra — components expose router.push as their
      // link contract; the router singleton itself is not view logic.
      resolve(ROOT, 'core/router/router.js'),
      resolve(ROOT, 'core/router/types.js'),
    ]

    for (const f of files) {
      const owner = ownerOf(f)
      const src = readFileSync(f, 'utf8')

      for (const m of src.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
        const resolved = resolveSpec(m[1], f)

        if (!resolved) continue

        const inOwnFolder = resolved.startsWith(COMPONENTS + '/' + owner)

        if (inOwnFolder) continue

        const shared = sharedRoots.some((r) => resolved === r || resolved.startsWith(r + '/'))

        if (
          (!shared && existsSync(resolved.replace(/\.js$/, '.ts'))) ||
          (!shared && existsSync(resolved.replace(/\.js$/, '.tsx'))) ||
          (!shared && existsSync(resolved))
        ) {
          violations.push(`${f.slice(ROOT.length + 1)} → ${resolved.slice(ROOT.length + 1)}`)
        }
      }
    }

    expect(violations).toEqual([])
  })
})
