#!/usr/bin/env node
/**
 * Reports uncovered statements / branches / functions for a source file from
 * coverage/coverage-final.json. Coordinates are transformed-space; use the
 * --source-map decode when the JSX transformer emits maps.
 *
 * Reads every module's reports/coverage/coverage-final.json (per-module
 * reports — see shared/tests/jest.preset.mjs) and searches them all.
 *
 * Usage: node shared/scripts/verify/coverage-gaps.mjs <src-relative-path...>
 */

import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

const MODULES = [
  'shared',
  'core',
  'website',
  'cms',
  'experiments/earth-playground',
  'experiments/docs',
]

const covFiles = MODULES.map((m) => join(root, m, 'reports/coverage/coverage-final.json')).filter(
  existsSync
)

const cov = Object.assign({}, ...covFiles.map((f) => JSON.parse(readFileSync(f, 'utf8'))))

for (const arg of process.argv.slice(2)) {
  const key = Object.keys(cov).find(
    (k) =>
      ['shared/src', 'core', 'website', 'cms', 'experiments', 'local-modules'].some((d) =>
        k.endsWith(`/${d}/${arg}`)
      ) || k.endsWith(`/${arg}`)
  )

  if (!key) {
    console.log(`## ${arg}: no coverage entry`)
    continue
  }

  const d = cov[key]
  const out = [`## ${arg}`]

  for (const [id, hits] of Object.entries(d.s)) {
    if (!hits) {
      const loc = d.statementMap[id]
      out.push(`  stmt L${loc.start.line}-${loc.end.line} c${loc.start.column}`)
    }
  }

  for (const [id, hits] of Object.entries(d.f)) {
    if (!hits) {
      const loc = d.fnMap[id].loc
      out.push(`  func L${loc.start.line}-${loc.end.line} c${loc.start.column}`)
    }
  }

  for (const [id, arms] of Object.entries(d.b)) {
    arms.forEach((hits, i) => {
      if (!hits) {
        const loc = d.branchMap[id].locations?.[i] || d.branchMap[id].loc
        out.push(
          `  br#${id} arm${i} ${d.branchMap[id].type} L${loc?.start?.line}-${loc?.end?.line} c${loc?.start?.column}`
        )
      }
    })
  }

  console.log(out.join('\n'))
}
