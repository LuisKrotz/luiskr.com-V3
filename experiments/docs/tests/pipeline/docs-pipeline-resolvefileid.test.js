/**
 * @file docs-pipeline-resolvefileid.test.js
 * @description Split from docs-pipeline.test.js — covers the "resolveFileId" describe.
 */
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { resolveFileId, MEDIA_INLINE_LIMIT } from '@build/docs/scan.mjs'

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

describe('resolveFileId', () => {
  test('resolves a published id to an absolute path', () => {
    expect(resolveFileId(tmpRoot, 'docs:README.md')).toBe(
      path.join(tmpRoot, 'shared', 'docs', 'README.md')
    )
  })

  test('rejects unknown roots, traversal, hidden and excluded files', () => {
    expect(resolveFileId(tmpRoot, 'nope:x.md')).toBe(null)
    expect(resolveFileId(tmpRoot, 'docs:../secret')).toBe(null)
    expect(resolveFileId(tmpRoot, 'docs:.hidden.md')).toBe(null)
    expect(resolveFileId(tmpRoot, 'src:database.json')).toBe(null)
    expect(resolveFileId(tmpRoot, 'docs:')).toBe(null)
    expect(resolveFileId(tmpRoot, 'badid')).toBe(null)
    expect(resolveFileId(tmpRoot, ':x')).toBe(null)
    expect(resolveFileId(tmpRoot, 'docs:missing.md')).toBe(null)
    expect(resolveFileId(tmpRoot, 'docs:guides')).toBe(null)
  })
})
