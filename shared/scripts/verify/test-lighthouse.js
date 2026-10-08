/**
 * @file test-lighthouse.js
 * @description Backward-compatible Lighthouse entry point. Delegates to the
 * production build's explicit post-build audit flag so Lighthouse never runs
 * before the verified artifacts exist.
 */

import { execFileSync } from 'node:child_process'

try {
  execFileSync('yarn', ['build', '--verify-lighthouse'], {
    cwd: process.cwd(),
    stdio: 'inherit',
  })
} catch {
  process.exit(1)
}
