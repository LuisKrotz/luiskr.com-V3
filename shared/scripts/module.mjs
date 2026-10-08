#!/usr/bin/env node
/**
 * @file module.mjs — workspace module orchestrator.
 * Runs a lifecycle command (`install`, `dev`, `build`, `test`, `preview`,
 * `test:coverage`) inside one module or every module that defines the
 * matching package.json script. Modules are yarn workspaces, so `install`
 * always performs a single hoisted root install — per-module lockfiles are
 * not used. `dev` runs all module servers in parallel (each binds its own
 * port); every other command runs sequentially in registry order.
 *
 * Usage:
 *   node shared/scripts/module.mjs <command> [module-name]
 *   yarn modules dev            — all module dev servers in parallel
 *   yarn modules build website  — a single module build
 */

import { spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { discoverModules, REPO_ROOT } from './modules.mjs'

const COMMANDS = new Set(['install', 'dev', 'build', 'test', 'test:coverage', 'preview'])

const [command, filter] = process.argv.slice(2)

if (!COMMANDS.has(command)) {
  process.stderr.write(`usage: yarn modules <${[...COMMANDS].join('|')}> [module-name]\n`)
  process.exit(1)
}

// Workspaces hoist every dependency into the root node_modules — a single
// `yarn install` at the repo root installs all modules at once.
if (command === 'install') {
  process.stdout.write('[modules] workspaces: running a single hoisted root install\n')
  process.exit(spawnSync('yarn', ['install'], { cwd: REPO_ROOT, stdio: 'inherit' }).status ?? 1)
}

/**
 * Reads a module's package.json script table (empty object when absent).
 * @param {string} root Module directory relative to the repo root.
 * @returns {Record<string, string>} The scripts map.
 */
const moduleScripts = (root) => {
  const pkgPath = path.join(REPO_ROOT, root, 'package.json')
  if (!fs.existsSync(pkgPath)) return {}

  return JSON.parse(fs.readFileSync(pkgPath, 'utf8')).scripts ?? {}
}

const targets = discoverModules()
  .filter((m) => m.name !== 'shared' || command === 'test' || command === 'test:coverage')
  .filter((m) => !filter || m.name === filter)
  .filter((m) => moduleScripts(m.root)[command])

if (filter && targets.length === 0) {
  process.stderr.write(`[modules] no module "${filter}" with a "${command}" script\n`)
  process.exit(1)
}

if (targets.length === 0) {
  process.stderr.write(`[modules] no modules define a "${command}" script\n`)
  process.exit(1)
}

const run = (m) => ['yarn', ['--cwd', m.root, command], { cwd: REPO_ROOT }]

if (command === 'dev') {
  // Dev servers are long-lived — spawn every module in parallel, prefix each
  // line with the module name, and forward SIGINT so Ctrl+C stops them all.
  const children = targets.map((m) => {
    const [cmd, args, opts] = run(m)

    const child = spawn(cmd, args, { ...opts, stdio: ['ignore', 'pipe', 'pipe'] })
    const tag = `[${m.name}]`

    child.stdout.on('data', (d) => process.stdout.write(`${tag} ${d}`))
    child.stderr.on('data', (d) => process.stderr.write(`${tag} ${d}`))

    return child
  })

  process.on('SIGINT', () => {
    for (const child of children) child.kill('SIGINT')
  })
} else {
  for (const m of targets) {
    const [cmd, args, opts] = run(m)
    const res = spawnSync(cmd, args, { ...opts, stdio: 'inherit' })

    if (res.status !== 0) process.exit(res.status ?? 1)
  }
}
