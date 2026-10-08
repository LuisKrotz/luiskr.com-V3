/**
 * @file mermaid.test.js
 * @description Coverage tails for docs/mermaid.ts — lazy mermaid import,
 * one-time themed initialize, run() on unprocessed blocks, processed
 * blocks skipped, and the failure path degrading to plain source.
 */

import { describe, test, expect, jest } from '@jest/globals'
import { renderMermaidBlocks } from '@docs/mermaid.js'
import { DOCS_CLASSES } from '@core/tokens/classes/docs.js'
import mermaid, { __mermaidState } from 'mermaid'

describe('docs mermaid', () => {
  test('no mermaid blocks → mermaid never loads', async () => {
    const box = document.createElement('div')

    box.innerHTML = '<p>no diagrams</p>'

    const ranBefore = __mermaidState.ranNodes

    await renderMermaidBlocks(box)

    expect(__mermaidState.ranNodes).toBe(ranBefore)
  })

  // Ordering note: `initialized` latches module-side on the first render
  // attempt, so the initialize-failure case must run before the themed
  // render test — the mock still records the config the theme test asserts.
  test('an initialize failure leaves every block as plain source', async () => {
    const box = document.createElement('div')

    box.innerHTML = `<div class="${DOCS_CLASSES.DOCS_MERMAID}">flowchart TB</div>`

    const spy = jest.spyOn(mermaid, 'initialize').mockImplementationOnce((c) => {
      __mermaidState.initialized = c

      throw new Error('init')
    })

    await renderMermaidBlocks(box)

    expect(box.querySelector(`.${DOCS_CLASSES.DOCS_MERMAID}`).innerHTML).toContain('flowchart')

    spy.mockRestore()
  })

  test('renders blocks with project theme vars; processed blocks skip', async () => {
    const box = document.createElement('div')

    box.innerHTML =
      `<div class="${DOCS_CLASSES.DOCS_MERMAID}">flowchart TB</div>` +
      `<div class="${DOCS_CLASSES.DOCS_MERMAID}" data-processed="true">done</div>`

    await renderMermaidBlocks(box)

    const blocks = box.querySelectorAll(`.${DOCS_CLASSES.DOCS_MERMAID}`)

    expect(blocks[0].getAttribute('data-processed')).toBe('true')
    expect(blocks[1].innerHTML).toBe('done')
    expect(__mermaidState.initialized?.theme).toBe('base')
    expect(__mermaidState.initialized?.themeVariables?.primaryColor).toBeDefined()
  })

  test('a mermaid failure leaves the source text in place', async () => {
    const box = document.createElement('div')

    box.innerHTML = `<div class="${DOCS_CLASSES.DOCS_MERMAID}">bad syntax [[</div>`

    const spy = jest.spyOn(mermaid, 'render').mockRejectedValueOnce(new Error('parse'))

    await renderMermaidBlocks(box)

    expect(box.textContent).toContain('bad syntax')

    spy.mockRestore()
  })
})
