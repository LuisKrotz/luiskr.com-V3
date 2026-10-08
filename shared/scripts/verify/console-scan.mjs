#!/usr/bin/env node
/**
 * @file console-scan.mjs
 * @description Scans every .ts/.tsx/.js file under src/ for console usage. Policy:
 *   - EVERY console.* call → VIOLATION. The project is zero-console: all
 *     diagnostics route through core/devlog.ts (devWarn / devError /
 *     devInfo), which buffers entries for devtools inspection via the
 *     `__lkDevLog()` global handle without touching console.*.
 *
 * File-level exemptions live in ALLOWLIST below with a justification.
 * Output: reports/console-scan.json → dist/deploy-info/ via deploy-info.mjs.
 * Gate: exits 1 when any violation exists.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
// Module areas — the app shell (shared/src/) plus the exportable modules.
const SRC_DIRS = ['shared/src', 'core', 'website', 'cms', 'experiments'].map((d) =>
  path.join(ROOT, d)
)
// Scan outputs live inside the docs module — the portal serves them under
// /docs/reports/ and deploy-info bundles them from there (root stays clean).
const REPORTS_DIR = path.join(ROOT, 'experiments', 'docs', 'reports')
const REPORT_FILE = path.join(REPORTS_DIR, 'console-scan.json')

const FORBIDDEN = [
  'log',
  'debug',
  'trace',
  'table',
  'group',
  'groupEnd',
  'groupCollapsed',
  'warn',
  'error',
  'info',
]
const ALLOWED = []

// Files allowed to use forbidden methods, with justification. Empty — the
// zero-console policy has no exemptions.
const ALLOWLIST = {}

const CONSOLE_RE =
  /console\.(log|debug|trace|table|group|groupEnd|groupCollapsed|warn|error|info)\s*\(/g

// Generated/vendor trees inside module dirs are not authored app source —
// the zero-console policy targets shipping code, not test suites, reports,
// or build output.
const SKIP_DIRS = new Set(['dist', 'node_modules', 'tests', 'reports'])

const listSrcFiles = (dir) => {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) out.push(...listSrcFiles(full))
    } else if (/\.(ts|tsx|js)$/.test(entry.name)) out.push(full)
  }
  return out
}

/**
 * Per-line scanner: tracks block-comment state across lines (multi-line
 * comments preserve line numbers), blanks out line comments, then blanks
 * single-line string literals so `console.log` inside a string or comment
 * is never flagged. Single/double-quoted JS strings can't contain raw
 * newlines, so per-line stripping is safe; template literals are stripped
 * per-line too — a false-negative inside a multiline template is harmless
 * (console calls inside template text aren't real callsites anyway).
 */
const scanLines = (src) => {
  const out = []
  let inBlock = false

  for (const rawLine of src.split('\n')) {
    let line = rawLine
    let buf = ''

    // Walk the line char-by-char handling block/line comments
    for (let i = 0; i < line.length; i++) {
      const two = line[i] + line[i + 1]

      if (inBlock) {
        if (two === '*/') {
          inBlock = false
          i++
        }
        buf += ' '
        continue
      }

      if (two === '/*') {
        inBlock = true
        buf += ' '
        i++
        continue
      }

      if (two === '//') break // rest of line is a comment

      buf += line[i]
    }

    // Blank single-line string literals so console.* inside strings is ignored
    buf = buf
      .replace(/'(?:\\.|[^'\\\n])*'/g, '""')
      .replace(/"(?:\\.|[^"\\\n])*"/g, '""')
      .replace(/`(?:\\.|[^`\\\n])*`/g, '""')

    out.push(buf)
  }

  return out
}

const findings = []
const violations = []
const allowedUsage = []

for (const file of SRC_DIRS.flatMap(listSrcFiles)) {
  const rel = path.relative(ROOT, file)
  const raw = fs.readFileSync(file, 'utf-8')
  const lines = scanLines(raw)

  lines.forEach((line, i) => {
    CONSOLE_RE.lastIndex = 0
    let m
    while ((m = CONSOLE_RE.exec(line))) {
      const method = m[1]
      const entry = { file: rel, line: i + 1, method }
      findings.push(entry)

      const exemption = ALLOWLIST[rel]
      if (exemption?.methods.includes(method)) {
        allowedUsage.push({ ...entry, reason: exemption.reason })
      } else {
        violations.push(entry)
      }
    }
  })
}

const report = {
  generatedAt: new Date().toISOString(),
  policy: { forbidden: FORBIDDEN, allowed: ALLOWED, allowlist: ALLOWLIST },
  ok: violations.length === 0,
  totals: {
    callsites: findings.length,
    violations: violations.length,
    warn: findings.filter((f) => f.method === 'warn').length,
    error: findings.filter((f) => f.method === 'error').length,
    info: findings.filter((f) => f.method === 'info').length,
    exempted: allowedUsage.filter((f) => f.reason).length,
  },
  violations,
  allowedUsage,
}

fs.mkdirSync(REPORTS_DIR, { recursive: true })
fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2))

console.log(
  `🖥  console-scan: ${report.totals.callsites} callsites (${report.totals.warn} warn, ${report.totals.error} error), ${violations.length} violations, ${report.totals.exempted} exempted`
)

if (violations.length) {
  console.error('\n✗ Forbidden console.* usage (debug leftovers):')
  for (const v of violations) console.error(`  ${v.file}:${v.line} — console.${v.method}`)
  console.error(`\nReport: ${path.relative(ROOT, REPORT_FILE)}`)
  process.exit(1)
}

console.log(`✓ No forbidden console.* usage → ${path.relative(ROOT, REPORT_FILE)}`)
