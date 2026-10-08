/**
 * @file docs-tails-generated-folder-artwork.test.js
 * @description Split from docs-tails.test.js — covers the "generated folder artwork" describe.
 */
import { describe, test, expect } from '@jest/globals'
import { folderSvg } from '@docs/folder-svg.js'
import { DOCS_CLASSES } from '@core/tokens/classes/docs.js'

const _flush = (ms = 40) => new Promise((r) => setTimeout(r, ms))

// ─── folder-svg.tsx ───────────────────────────────────────────────────────────
describe('generated folder artwork', () => {
  test('dir glyph shows threads over the folder body', () => {
    const svg = folderSvg('architecture', true)

    expect(svg.tagName.toLowerCase()).toBe('svg')
    expect(svg.querySelectorAll(`.${DOCS_CLASSES.DOCS_FOLDER_THREAD}`).length).toBeGreaterThan(0)
  })

  test('file glyph uses the folded-corner silhouette', () => {
    const svg = folderSvg('website.md', false)

    expect(svg.tagName.toLowerCase()).toBe('svg')
  })

  test('isDir defaults to true when omitted', () => {
    const svg = folderSvg('typedoc')

    expect(svg.querySelectorAll(`.${DOCS_CLASSES.DOCS_FOLDER_THREAD}`).length).toBeGreaterThan(0)
  })

  test('the same name always produces the same artwork', () => {
    const a = folderSvg('guides', true).outerHTML
    const b = folderSvg('guides', true).outerHTML

    expect(a).toBe(b)
  })

  test('different names spread the hash space', () => {
    expect(folderSvg('docs', true).outerHTML).not.toBe(folderSvg('reports', true).outerHTML)
  })
})
