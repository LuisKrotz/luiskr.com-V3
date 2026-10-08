#!/usr/bin/env node
/**
 * @file modules.mjs
 * @description Single source of truth for the workspace module registry.
 * Core modules (shared/core/website/cms) are fixed; experiment modules are
 * discovered dynamically — any `experiments/<name>/` directory containing a
 * jest.config.mjs is a module. New experiments scaffolded via
 * shared/scripts/scaffold/new-experiment.mjs register everywhere
 * automatically: run-modules executes their suites, merge-coverage unions
 * their raw maps, coverage-gate enforces 100% on them, and the jest preset
 * instruments their sources — no registry edits needed.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** Absolute repository root (shared/scripts/../..). */
export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

/**
 * Fixed platform modules — ordered so cheap shared suites run first.
 * `root` is where reports/coverage lands; `src` lists the authored-source
 * roots (repo-relative) that enter that module's filtered coverage map.
 */
const PLATFORM_MODULES = Object.freeze([
  { name: 'shared', root: 'shared', src: ['shared/src'] },
  { name: 'core', root: 'core', src: ['core'] },
  { name: 'website', root: 'website', src: ['website'] },
  { name: 'cms', root: 'cms', src: ['cms'] },
])

/**
 * Discovers every workspace module: the fixed platform modules plus each
 * experiments/<name>/ dir that ships a jest.config.mjs (sorted for
 * deterministic run order).
 * @returns {Array<{name:string, root:string, src:string[]}>} module records.
 */
export function discoverModules() {
  const experimentsDir = path.join(REPO_ROOT, 'experiments')
  const discovered = []

  if (fs.existsSync(experimentsDir)) {
    for (const entry of fs.readdirSync(experimentsDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue

      const dir = `experiments/${entry.name}`

      if (fs.existsSync(path.join(REPO_ROOT, dir, 'jest.config.mjs'))) {
        discovered.push({ name: entry.name, root: dir, src: [dir] })
      }
    }
  }

  discovered.sort((a, b) => a.name.localeCompare(b.name))

  return [...PLATFORM_MODULES, ...discovered]
}
