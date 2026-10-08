/**
 * @file docs-pipeline.test.js
 * @description Behavioral coverage for the build-side docs-portal
 * pipeline — scan.mjs (manifest tree, exclusions, id resolution),
 * render.mjs (every format → HTML), redact.mjs (secret scrubbing,
 * file exclusion rules). Scans run against a temp fixture tree, never
 * the real repo.
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { scanManifest, resolveFileId, MEDIA_INLINE_LIMIT } from '../../build/docs/scan.mjs'
import { renderFile, escapeHtml } from '../../build/docs/render.mjs'
import { shouldExcludeFile, redactSource } from '../../build/docs/redact.mjs'

let tmpRoot

beforeAll(() => {
  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-pipeline-'))

  // Fixture tree — one of each format + excluded entries.
  fs.mkdirSync(path.join(tmpRoot, 'docs', 'guides'), { recursive: true })
  fs.writeFileSync(path.join(tmpRoot, 'docs', 'README.md'), '# Title\n\nbody')
  fs.writeFileSync(path.join(tmpRoot, 'docs', 'guides', 'setup.md'), '## Setup\n')
  fs.writeFileSync(path.join(tmpRoot, 'docs', '.hidden.md'), 'hidden')
  fs.mkdirSync(path.join(tmpRoot, 'docs', 'node_modules', 'pkg'), { recursive: true })
  fs.writeFileSync(path.join(tmpRoot, 'docs', 'node_modules', 'pkg', 'x.js'), 'x')
  fs.mkdirSync(path.join(tmpRoot, 'docs', 'empty-dir'))

  fs.mkdirSync(path.join(tmpRoot, 'reports'), { recursive: true })
  fs.writeFileSync(path.join(tmpRoot, 'reports', 'axe.json'), '{"a":1}')

  fs.mkdirSync(path.join(tmpRoot, 'src'), { recursive: true })
  fs.writeFileSync(path.join(tmpRoot, 'src', 'main.ts'), 'export const x = 1\n')
  fs.writeFileSync(path.join(tmpRoot, 'src', 'database.json'), '{"secret":true}')
  fs.writeFileSync(path.join(tmpRoot, 'src', 'tiny.png'), Buffer.alloc(16, 7))
  fs.writeFileSync(path.join(tmpRoot, 'src', 'big.png'), Buffer.alloc(MEDIA_INLINE_LIMIT + 8, 7))

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

describe('resolveFileId', () => {
  test('resolves a published id to an absolute path', () => {
    expect(resolveFileId(tmpRoot, 'docs:README.md')).toBe(path.join(tmpRoot, 'docs', 'README.md'))
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

describe('renderFile', () => {
  test('markdown renders structure: headings, code fences, lists, tables, quotes', () => {
    const md = [
      '# H1',
      '',
      'para with `code` and **bold** and *em*',
      '',
      '```ts',
      'const x = 1',
      '```',
      '',
      '- one',
      '- two',
      '',
      '> quoted',
      '',
      '| a | b |',
      '|---|---|',
      '| 1 | 2 |',
      '',
      '---',
    ].join('\n')

    const html = renderFile('markdown', md, 'md')

    expect(html).toContain('<h1 id="h1">H1</h1>')
    expect(html).toContain('language-ts')
    expect(html).toContain('<li>one</li>')
    expect(html).toContain('<blockquote>')
    expect(html).toContain('<th>a</th>')
    expect(html).toContain('<td>1</td>')
    expect(html).toContain('<hr>')
  })

  test('markdown inline: links and lazy images; scripts stripped', () => {
    const html = renderFile(
      'markdown',
      '[text](https://x) ![alt](img.png)\n\n<script>alert(1)</script>',
      'md'
    )

    expect(html).toContain('href="https://x"')
    expect(html).toContain('src="img.png"')
    expect(html).toContain('loading="lazy"')
    expect(html).not.toContain('<script')
  })

  test('markdown mermaid fences become docs-mermaid diagram blocks', () => {
    const html = renderFile('markdown', '```mermaid\nflowchart TB\n  A-->B\n```', 'md')

    expect(html).toContain('docs-mermaid')
    expect(html).toContain('flowchart TB')
    expect(html).not.toContain('language-mermaid')
  })

  test('html reports inline local stylesheet links via the resolver', () => {
    const doc =
      '<html><head><link rel="stylesheet" href="base.css"><link rel="stylesheet" href="https://cdn.example.com/x.css"></head><body><p>r</p></body></html>'

    const html = renderFile('html', doc, 'html', {
      linkResolver: (href) => (href === 'base.css' ? '.pad1{color:red}' : null),
    })

    expect(html).toContain('<style>.pad1{color:red}</style>')
    expect(html).not.toContain('<link')
    expect(html).not.toContain('cdn.example.com')
  })

  test('html reports render inline — scripts/noscript stripped, styles kept', () => {
    const html = renderFile(
      'html',
      '<html><head><style>body{margin:0}</style></head><body><noscript>needs js</noscript><script>x()</script><p>report</p></body></html>',
      'html'
    )

    expect(html).toContain('docs-html')
    expect(html).toContain('<style>body{margin:0}</style>')
    expect(html).toContain('<p>report</p>')
    expect(html).not.toContain('noscript')
    expect(html).not.toContain('<script')
    expect(html).not.toContain('x()')
  })

  test('json parses into typed markup — numbers, keys, arrays → tables', () => {
    const html = renderFile(
      'json',
      '{"total":{"pct":85,"count":4},"rows":[{"name":"a","ok":true}]}',
      'json'
    )

    expect(html).toContain('docs-json')
    expect(html).toContain('docs-json-pct')
    expect(html).toContain('docs-json-table')
    expect(html).toContain('<th>name</th>')
    expect(html).toContain('docs-json-bool')
    expect(renderFile('json', '{bad', 'json')).toContain('{bad')
  })

  test('code wraps in <pre> with the language class', () => {
    const html = renderFile('code', 'const x = 1', 'ts')

    expect(html).toContain('lang-typescript')
    expect(html).toContain('const x = 1')
  })

  test('unknown formats land on the text fallback', () => {
    const html = renderFile('text', 'raw <x>', 'txt')

    expect(html).toContain('&lt;x&gt;')
  })

  test('escapeHtml neutralizes markup injection', () => {
    const html = renderFile('code', '<script>alert(1)</script>', 'ts')

    expect(html).not.toContain('<script>')
    expect(escapeHtml('<a "&\'">')).toContain('&lt;')
  })
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
