#!/usr/bin/env node
/**
 * @file codemod-devlog.mjs
 * @description One-shot codemod: replaces every console.warn/error/info/log
 * callsite under src/ with the matching devlog sink (devWarn/devError/
 * devInfo from '@/core/devlog.js') and injects the named import into each
 * touched file. Zero-console policy — see AGENTS.md rule 12.
 */

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SRC = path.join(ROOT, 'src')
const IMPORT_FROM = '@/core/devlog.js'
const NAME_FOR = { warn: 'devWarn', error: 'devError', info: 'devInfo', log: 'devInfo' }

const listFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? listFiles(p) : /\.(ts|tsx|js)$/.test(e.name) ? [p] : []
  })

let touched = 0

for (const file of listFiles(SRC)) {
  if (file.endsWith(path.join('core', 'devlog.ts'))) continue

  const src = fs.readFileSync(file, 'utf8')
  const used = new Set()

  const next = src.replace(
    /\bconsole\.(warn|error|info|log)\b/g,
    (m, method) => (used.add(NAME_FOR[method]), NAME_FOR[method])
  )

  if (next === src) continue

  const names = [...used].sort()
  const importLine = `import { ${names.join(', ')} } from '${IMPORT_FROM}'\n`
  const lines = next.split('\n')

  // Insert after the last top-level import so the header comment stays first.
  let lastImport = -1
  lines.forEach((l, i) => {
    if (/^import\s/.test(l)) lastImport = i
  })

  if (lastImport >= 0) lines.splice(lastImport + 1, 0, importLine.trimEnd())
  else lines.unshift(importLine.trimEnd())

  fs.writeFileSync(file, lines.join('\n'))
  console.log(`devlog: ${path.relative(ROOT, file)} ← ${names.join(', ')}`)
  touched++
}

console.log(`devlog codemod: ${touched} files updated`)
