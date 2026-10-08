#!/usr/bin/env node
/**
 * @file build.mjs
 * @description Production build orchestrator. The package lifecycle runs the
 * complete verification/coverage gate in `prebuild`; this script then emits
 * all browser targets, packages deploy diagnostics, and generates JSDoc.
 * Passing `--verify-lighthouse` runs LHCI only after those build artifacts are
 * complete, then re-packages deploy diagnostics with the fresh audit output.
 */

import { execFileSync } from 'node:child_process'

const VERIFY_LIGHTHOUSE_FLAG = '--verify-lighthouse'
const verifyLighthouse = process.argv.includes(VERIFY_LIGHTHOUSE_FLAG)
const inherited = { cwd: process.cwd(), stdio: 'inherit' }

/**
 * Runs a local Node build script with inherited terminal output.
 * @param {string} script script path relative to the repository root
 * @param {string[]} args optional script arguments
 * @returns {Buffer | string | null} child-process result
 */
const runNode = (script, args = []) => execFileSync(process.execPath, [script, ...args], inherited)

/**
 * Runs a Yarn binary/script without passing through a shell.
 * @param {string[]} args Yarn command arguments
 * @returns {Buffer | string | null} child-process result
 */
const runYarn = (args) => execFileSync('yarn', args, inherited)

runNode('shared/scripts/build/build-targets.mjs')
runNode('shared/scripts/build/deploy-info.mjs')
runYarn(['docs:jsdocs'])

if (verifyLighthouse) {
  runYarn(['lhci', 'autorun'])
  runNode('shared/scripts/build/deploy-info.mjs')
}
