#!/usr/bin/env node
/**
 * @file new-experiment.mjs
 * @description Scaffolds a new experiment workspace under experiments/<name>/
 * following the established module pattern (see experiments/earth-playground):
 *
 *   experiments/<name>/
 *     package.json      @luiskr/<name>, ESM, exports ./index.ts
 *     tsconfig.json     extends the root config, tests/dist excluded
 *     vite.config.js    library build via shared/build/vite-lib.mjs
 *     jest.config.mjs   module suite via shared/tests/jest.preset.mjs
 *     index.ts          module entry (strict TS)
 *     tests/            JavaScript suite (tests are JS by design)
 *
 * Because module registries are DISCOVERED (shared/scripts/modules.mjs),
 * the new module self-registers: `yarn test` runs its suite, coverage-gate
 * enforces 100% on it, merge-coverage unions its maps, and the jest preset
 * instruments its sources — zero manual registry edits.
 *
 * This script only CREATES new files for a new module — it never rewrites
 * existing files (Rule 23).
 *
 * Usage: node shared/scripts/scaffold/new-experiment.mjs <kebab-name>
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

const name = process.argv[2]

if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error('usage: node shared/scripts/scaffold/new-experiment.mjs <kebab-name>')
  process.exit(1)
}

const dir = path.join(ROOT, 'experiments', name)

if (fs.existsSync(dir)) {
  console.error(`experiments/${name} already exists — refusing to overwrite`)
  process.exit(1)
}

const FILES = {
  'package.json': `{
  "name": "@luiskr/${name}",
  "version": "0.0.0",
  "type": "module",
  "exports": {
    ".": "./index.ts"
  },
  "sideEffects": [
    "**/*.scss",
    "**/views/**",
    "**/components/**"
  ]
}
`,
  'tsconfig.json': `{
  "extends": "../../tsconfig.json",
  "include": [
    "./**/*.ts",
    "./**/*.tsx",
    "../../shared/src/globals.d.ts",
    "../../shared/src/modules.d.ts"
  ],
  "exclude": ["./tests", "./dist", "./reports", "./node_modules"]
}
`,
  'vite.config.js': `/**
 * @file experiments/${name}/vite.config.js
 * @description Library build for the \`${name}\` experiment. Emits
 * \`experiments/${name}/dist/${name}.js\` with shared deps kept external.
 */
import { moduleConfig } from '../../shared/build/vite-lib.mjs'

export default moduleConfig({
  dir: new URL('.', import.meta.url).pathname,
  name: '${name}',
})
`,
  'jest.config.mjs': `/**
 * @file jest.config.mjs — ${name} module test config.
 * Covers the experiment code under experiments/${name}.
 * Experiments are exempt from Lighthouse performance gates by contract.
 */
import { makeConfig } from '../../shared/tests/jest.preset.mjs'

export default makeConfig({ name: '${name}', dir: 'experiments/${name}' })
`,
  'index.ts': `/**
 * @file experiments/${name}/index.ts
 * @description Entry point for the \`${name}\` experiment module.
 */

export {}
`,
  [`tests/${name}.test.js`]: `/**
 * @file tests/${name}.test.js
 * @description Smoke suite for the ${name} experiment module. Tests are
 * JavaScript by design (Rule 17) and must reach 100% per-file coverage of
 * the module's sources (coverage-gate).
 */
describe('${name} module', () => {
  it('exports its public surface', async () => {
    const mod = await import('../index.js')

    expect(mod).toBeDefined()
  })
})
`,
  'README.md': `# @luiskr/${name}

Experiment module — scaffolded via \`shared/scripts/scaffold/new-experiment.mjs\`.

- Source: \`index.ts\` + feature folders (strict TypeScript).
- Tests: \`tests/\` (JavaScript, Jest via the shared preset — 100% coverage gate).
- Build: \`vite build -c vite.config.js\` → \`dist/${name}.js\`.

Self-registered: runs in \`yarn test\`, covered by \`coverage-gate\` and
\`merge-coverage\` automatically (module discovery in \`shared/scripts/modules.mjs\`).
`,
}

fs.mkdirSync(path.join(dir, 'tests'), { recursive: true })

for (const [rel, content] of Object.entries(FILES)) {
  const file = path.join(dir, rel)

  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
  console.log(`created experiments/${name}/${rel}`)
}

console.log(`
experiments/${name} scaffolded — self-registered for tests, coverage, and
the module build. Next: implement index.ts, add public assets under
experiments/${name}/public/ if needed, and run \`yarn test ${name}\`.`)
