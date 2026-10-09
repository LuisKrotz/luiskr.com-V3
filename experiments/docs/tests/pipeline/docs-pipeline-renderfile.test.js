/**
 * @file docs-pipeline-renderfile.test.js
 * @description Split from docs-pipeline.test.js — covers the "renderFile" describe.
 */
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { MEDIA_INLINE_LIMIT } from '@build/docs/scan.mjs'
import { renderFile, escapeHtml } from '@build/docs/render.mjs'

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
    // body/html selectors are remapped onto the .docs-html wrapper — they
    // can't match inside the viewer's shadow root.
    expect(html).toContain('<style>.docs-html{margin:0}</style>')
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
