/**
 * @file docs-pipeline-scanmanifest.test.js
 * @description Split from docs-pipeline.test.js — covers the "scanManifest" describe.
 */
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { scanManifest, MEDIA_INLINE_LIMIT } from '@build/docs/scan.mjs'

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

describe('scanManifest', () => {
  test('builds roots for present dirs, skipping missing ones', () => {
    const manifest = scanManifest(tmpRoot)

    expect(manifest.roots.map((r) => r.root)).toEqual(['docs', 'reports', 'src'])
    expect(Date.parse(manifest.generated)).not.toBeNaN()
  })

  test('dirs sort before files; hidden + skip-dirs excluded; empty dirs dropped', () => {
    const docs = scanManifest(tmpRoot).roots.find((r) => r.root === 'docs')

    expect(docs.children[0].type).toBe('dir')
    expect(docs.children[0].name).toBe('guides')
    expect(docs.children.map((n) => n.name)).not.toContain('node_modules')
    expect(docs.children.map((n) => n.name)).not.toContain('empty-dir')
    expect(docs.children.map((n) => n.name)).not.toContain('.hidden.md')
  })

  test('database.json is never listed', () => {
    const src = scanManifest(tmpRoot).roots.find((r) => r.root === 'src')

    expect(src.children.map((n) => n.name)).not.toContain('database.json')
  })

  test('media over the inline cap is listed but flagged unembedded', () => {
    const src = scanManifest(tmpRoot).roots.find((r) => r.root === 'src')
    const byName = Object.fromEntries(src.children.map((n) => [n.name, n]))

    expect(byName['tiny.png'].embedded).toBe(true)
    expect(byName['big.png'].embedded).toBe(false)
    expect(byName['main.ts'].embedded).toBe(true)
  })

  test('format tags come from the extension map', () => {
    const src = scanManifest(tmpRoot).roots.find((r) => r.root === 'src')

    expect(src.children.find((n) => n.name === 'main.ts').format).toBe('code')
  })
})
