#!/usr/bin/env node
/**
 * @file codemod-test-alias.mjs
 * @description One-shot codemod: rewrites deep relative specifiers that reach
 * into src/ (`'../../../../core/…'`) as the `@/` alias (`'@core/…'`)
 * across tests/**. Imports that stay inside tests/ (fixtures, mocks, setup)
 * keep their relative form — `@/` maps to src/ only.
 */

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const TESTS = path.join(ROOT, 'tests')

const listFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? listFiles(p) : /\.(js|ts|tsx)$/.test(e.name) ? [p] : []
  })

// Any quoted specifier of the form (../)+src/<rest> — covers import-from,
// export-from, dynamic import(), jest.mock(), require().
const RE = /(['"])((?:\.\.\/)+)src\/([^'"]+)\1/g

let touched = 0
let rewritten = 0

for (const file of listFiles(TESTS)) {
  const src = fs.readFileSync(file, 'utf8')
  let hits = 0

  const next = src.replace(RE, (m, q, _up, rest) => {
    hits++
    return `${q}@/${rest}${q}`
  })

  if (next === src) continue

  fs.writeFileSync(file, next)
  console.log(`alias: ${path.relative(ROOT, file)} (${hits} specifier${hits > 1 ? 's' : ''})`)
  touched++
  rewritten += hits
}

console.log(`alias codemod: ${rewritten} specifiers across ${touched} files`)
