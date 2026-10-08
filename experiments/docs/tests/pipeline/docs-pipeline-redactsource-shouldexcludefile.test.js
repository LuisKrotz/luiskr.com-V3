/**
 * @file docs-pipeline-redactsource-shouldexcludefile.test.js
 * @description Split from docs-pipeline.test.js — covers the "redactSource / shouldExcludeFile" describe.
 */
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { MEDIA_INLINE_LIMIT } from '@build/docs/scan.mjs'
import { shouldExcludeFile, redactSource } from '@build/docs/redact.mjs'

let tmpRoot

beforeAll(() => {
  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-pipeline-'))

  // Fixture tree — one of each format + excluded entries.
  fs.mkdirSync(path.join(tmpRoot, 'shared', 'docs', 'guides'), { recursive: true })
  fs.writeFileSync(path.join(tmpRoot, 'shared', 'docs', 'README.md'), '# Title\n\nbody')
  fs.writeFileSync(path.join(tmpRoot, 'shared', 'docs', 'guides', 'setup.md'), '## Setup\n')
  fs.writeFileSync(path.join(tmpRoot, 'shared', 'docs', '.hidden.md'), 'hidden')
  fs.mkdirSync(path.join(tmpRoot, 'shared', 'docs', 'node_modules', 'pkg'), { recursive: true })
  fs.writeFileSync(path.join(tmpRoot, 'shared', 'docs', 'node_modules', 'pkg', 'x.js'), 'x')
  fs.mkdirSync(path.join(tmpRoot, 'shared', 'docs', 'empty-dir'))

  fs.mkdirSync(path.join(tmpRoot, 'experiments', 'docs', 'reports'), { recursive: true })
  fs.writeFileSync(path.join(tmpRoot, 'experiments', 'docs', 'reports', 'axe.json'), '{"a":1}')

  fs.mkdirSync(path.join(tmpRoot, 'shared', 'src'), { recursive: true })
  fs.writeFileSync(path.join(tmpRoot, 'shared', 'src', 'main.ts'), 'export const x = 1\n')
  fs.writeFileSync(path.join(tmpRoot, 'shared', 'src', 'database.json'), '{"secret":true}')
  fs.writeFileSync(path.join(tmpRoot, 'shared', 'src', 'tiny.png'), Buffer.alloc(16, 7))
  fs.writeFileSync(
    path.join(tmpRoot, 'shared', 'src', 'big.png'),
    Buffer.alloc(MEDIA_INLINE_LIMIT + 8, 7)
  )

  // coverage/ intentionally absent — the missing-root arm.
})

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true })
})

describe('redactSource / shouldExcludeFile', () => {
  test('excludes database.json, env files, minified builds, keys, debug logs', () => {
    expect(shouldExcludeFile('database.json')).toBe(true)
    expect(shouldExcludeFile('.env')).toBe(true)
    expect(shouldExcludeFile('.env.local')).toBe(true)
    expect(shouldExcludeFile('bundle.min.js')).toBe(true)
    expect(shouldExcludeFile('styles.min.css')).toBe(true)
    expect(shouldExcludeFile('firebase-debug.log')).toBe(true)
    expect(shouldExcludeFile('cert.pem')).toBe(true)
    expect(shouldExcludeFile('id_rsa.key')).toBe(true)
    expect(shouldExcludeFile('main.ts')).toBe(false)
  })

  test('masks google api keys, atob blobs and JWTs', () => {
    const code = [
      'const key = "AIzaSyA' + 'x'.repeat(33) + '"',
      "const k = atob('QUl6YVN5QWJjZGVmZ2hpamtsbW5vcA==')",
      'const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abc12345"',
    ].join('\n')

    const out = redactSource(code)

    expect(out).not.toContain('AIzaSyA')
    expect(out).not.toContain('QUl6YVN5')
    expect(out).not.toContain('eyJhbGci')
    expect(out.match(/\[redacted\]/gu).length).toBe(3)
  })

  test('leaves ordinary source untouched', () => {
    const code = 'export const meaning = 42\n'

    expect(redactSource(code)).toBe(code)
  })
})
