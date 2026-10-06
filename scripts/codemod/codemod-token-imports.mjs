#!/usr/bin/env node
/**
 * @file codemod-token-imports.mjs
 * @description Rewrites `import { X } from '@/core/constants.js'` (and
 * relative/`@/cms/tokens.js` variants) so call sites pull only the granular
 * token modules they actually use.
 *
 * For each imported name:
 *  - leaf export (defined in a `tokens/<domain>/<group>.js` file) → rewrite
 *    the import path to that leaf module.
 *  - composed registry (CLASSES, ATTRS, STRINGS, …) → scan the file for
 *    `NAME.KEY` member accesses; map each key to its leaf group's exported
 *    object; rewrite every occurrence to `GROUP_EXPORT.KEY` and import
 *    those group objects. If the name is used dynamically (`NAME[...]`,
 *    `Object.keys(NAME)`, passed whole), the composed import is kept.
 *
 * Usage: node scripts/codemod/codemod-token-imports.mjs [--dry]
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, relative, sep, posix, dirname } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const SRC = join(ROOT, 'src')
const DRY = process.argv.includes('--dry')

const CORE_TOKENS_DIR = join(SRC, 'core/tokens')
const CMS_TOKENS_DIR = join(SRC, 'cms/tokens')
const CORE_COMPOSERS = readdirSync(CORE_TOKENS_DIR)
  .filter((f) => f.endsWith('.js'))
  .filter((f) => readFileSync(join(CORE_TOKENS_DIR, f), 'utf8').includes('export *'))
const CMS_COMPOSER = join(SRC, 'cms/tokens.js')

const walk = (dir, out = []) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)

    statSync(p).isDirectory() ? walk(p, out) : out.push(p)
  }

  return out
}

const leafFiles = (dir) =>
  walk(dir).filter((p) => p.endsWith('.js') && !readFileSync(p, 'utf8').includes('export *'))

const exportedNames = (file) =>
  [...readFileSync(file, 'utf8').matchAll(/export const (\w+)/g)].map((m) => m[1])

const aliasFor = (absPath) => {
  const rel = relative(SRC, absPath).split(sep).join(posix.sep)

  return rel.startsWith('cms/') ? `@/cms/${rel.slice(4)}` : `@/${rel}`
}

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Build a per-domain token index:
 *  - nameToLeaf: leaf export name → { module, name }
 *  - composed: composer name → { name → { module, export } } key map
 * Core and CMS token layers keep separate indexes — names like CMS_TAGS /
 * CMS_CLASSES exist in both domains with different contents.
 */
const buildIndex = async (tokenDirs, composerPaths) => {
  const nameToLeaf = new Map()
  const composed = new Map()
  const allLeafs = tokenDirs.flatMap((d) => leafFiles(d))

  for (const leaf of allLeafs) {
    for (const name of exportedNames(leaf)) {
      nameToLeaf.set(name, { module: aliasFor(leaf), name })
    }
  }

  for (const composerPath of composerPaths) {
    const composerText = readFileSync(composerPath, 'utf8')
    const subdirs = [...composerText.matchAll(/from\s*'\.\/(\w+)\//g)].map((m) =>
      join(dirname(composerPath), m[1])
    )
    const domainLeafs = [...new Set(subdirs.flatMap((d) => leafFiles(d)))]
    const composerMod = await import(pathToFileURL(composerPath).href)

    // A composer may still define its own exports (BASE_TITLE, KEYS, …) —
    // treat those as leaf exports living on the composer module itself,
    // unless the export is a `...spread` merge of group objects (composed).
    const composedNames = new Set(
      [...composerText.matchAll(/export const (\w+) = Object\.freeze\(\{([\s\S]*?)\}\)/g)]
        .filter((m) => m[2].includes('...'))
        .map((m) => m[1])
    )

    for (const name of exportedNames(composerPath)) {
      if (!nameToLeaf.has(name) && !composedNames.has(name)) {
        nameToLeaf.set(name, { module: aliasFor(composerPath), name })
      }
    }

    for (const [name, value] of Object.entries(composerMod)) {
      if (nameToLeaf.has(name) || !value || typeof value !== 'object') continue

      const keyMap = new Map()

      for (const leaf of domainLeafs) {
        const leafMod = await import(pathToFileURL(leaf).href)

        for (const [exportName, groupObj] of Object.entries(leafMod)) {
          if (!groupObj || typeof groupObj !== 'object') continue

          for (const key of Object.keys(groupObj)) {
            if (key in value && !keyMap.has(key)) {
              keyMap.set(key, { module: aliasFor(leaf), export: exportName })
            }
          }
        }
      }

      composed.set(name, keyMap)
    }
  }

  return { nameToLeaf, composed }
}

/** True when `name` appears in `body` outside `name.KEY` member access. */
const isDynamic = (body, name) => {
  const re = new RegExp(`(?<![.\\w])${escapeRegExp(name)}\\b(?!\\s*\\.)`, 'g')

  return re.test(body)
}

const codemod = async () => {
  const coreIndex = await buildIndex(
    [CORE_TOKENS_DIR],
    CORE_COMPOSERS.map((f) => join(CORE_TOKENS_DIR, f))
  )
  const cmsIndex = await buildIndex([CMS_TOKENS_DIR], [CMS_COMPOSER])
  const importRe =
    /import\s*\{([^}]+)\}\s*from\s*'(@\/core\/constants\.js|@\/core\/constants|@\/cms\/tokens\.js|\.{0,2}(?:\/\.{1,2})*\/core\/constants\.js|\.{0,2}(?:\/\.{1,2})*\/tokens\.js|\.{0,2}\/constants\.js)'/g
  const files = walk(SRC).filter((p) => p.endsWith('.js'))
  let changed = 0
  let kept = 0

  for (const file of files) {
    if (file.includes(`${sep}tokens${sep}`) || file.endsWith(`${sep}constants.js`)) continue

    let text = readFileSync(file, 'utf8')
    const matches = [...text.matchAll(importRe)]

    if (!matches.length) continue

    let newText = text
    const newImports = new Map() // module → Set(names)
    const addImport = (module, name) => {
      if (!newImports.has(module)) newImports.set(module, new Set())

      newImports.get(module).add(name)
    }

    for (const m of matches) {
      const isCmsBarrel = m[2].includes('cms/tokens') || /(?:^|\/)tokens\.js$/.test(m[2])
      const { nameToLeaf, composed } = isCmsBarrel ? cmsIndex : coreIndex
      const names = m[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const body = text.replace(importRe, '')
      const keptNames = []

      for (const spec of names) {
        const asMatch = spec.match(/^(\w+)\s+as\s+(\w+)$/)
        const orig = asMatch ? asMatch[1] : spec
        const local = asMatch ? asMatch[2] : spec

        if (nameToLeaf.has(orig)) {
          addImport(nameToLeaf.get(orig).module, orig === local ? orig : `${orig} as ${local}`)

          continue
        }

        if (composed.has(orig)) {
          if (isDynamic(body, local)) {
            keptNames.push(spec)

            continue
          }

          const keyRe = new RegExp(`(?<![.\\w])${escapeRegExp(local)}\\.([A-Z0-9_]+)`, 'g')
          const unresolved = []
          const replacements = []

          for (const km of body.matchAll(keyRe)) {
            const target = composed.get(orig).get(km[1])

            target
              ? replacements.push({ key: km[1], export: target.export, module: target.module })
              : unresolved.push(km[1])
          }

          if (unresolved.length) {
            keptNames.push(spec)

            continue
          }

          for (const r of replacements) addImport(r.module, r.export)

          newText = newText.replace(keyRe, (full, key) => {
            const t = composed.get(orig).get(key)

            return `${t.export}.${key}`
          })

          continue
        }

        keptNames.push(spec)
      }

      if (keptNames.length) {
        kept += keptNames.length

        newText = newText.replace(
          m[0],
          `import { ${keptNames.join(', ')} } from '${m[2].startsWith('@') || m[2].startsWith('.') ? (m[2].includes('cms') || m[2].includes('tokens.js') ? '@/cms/tokens.js' : '@/core/constants.js') : m[2]}'`
        )
      } else {
        newText = newText.replace(m[0], '__REMOVE_IMPORT__')
      }
    }

    const importLines = [...newImports.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mod, names]) => `import { ${[...names].sort().join(', ')} } from '${mod}'`)
      .join('\n')

    newText = newText.replace(/__REMOVE_IMPORT__\n?/, '')
    newText = newText.replace(/__REMOVE_IMPORT__/g, '')

    const insertion = importLines ? `${importLines}\n` : ''

    if (insertion) {
      let insertAt = newText.search(/^import /m)

      if (insertAt < 0) {
        const docEnd = newText.match(/^\/\*\*[\s\S]*?\*\//)

        insertAt = docEnd ? docEnd[0].length + 1 : 0
      }

      newText = `${newText.slice(0, insertAt)}${insertion}${newText.slice(insertAt)}`
    }

    if (newText !== text) {
      changed++
      if (!DRY) writeFileSync(file, newText)
    }
  }

  console.log(`${DRY ? '[dry] ' : ''}rewrote ${changed} files, kept ${kept} composed imports`)
}

codemod().catch((err) => {
  console.error(err)
  process.exit(1)
})
