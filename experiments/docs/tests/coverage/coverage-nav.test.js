/**
 * @file coverage-nav.test.js
 * @description Coverage tails for docs/coverage-nav.ts — the istanbul
 * keyboard-navigation contract (n/j forward, b/p/k back), the no-report
 * null path, modifier-key pass-through, and listener disposal.
 */

import { describe, test, expect, afterEach } from '@jest/globals'
import { attachCoverageNav } from '@docs/coverage-nav.js'
import { KEYBOARD_EVENTS } from '@core/tokens/events/dom.js'
import { DOCS_SELECTORS } from '@core/tokens/selectors/docs.js'

const makeBox = (inner) => {
  const box = document.createElement('div')

  box.innerHTML = inner

  document.body.appendChild(box)

  return box
}

const key = (k, mods = {}) => {
  const e = new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: k })

  // happy-dom ignores modifier keys in the init dict — patch them on the
  // instance so the modifier-guard arm is exercised.
  for (const [prop, val] of Object.entries(mods)) {
    Object.defineProperty(e, prop, { value: val, configurable: true })
  }

  document.dispatchEvent(e)
}

describe('docs coverage-nav', () => {
  let box

  afterEach(() => {
    box?.remove()
    box = null
  })

  test('returns null when the payload has no uncovered-block markers', () => {
    box = makeBox('<p>plain html</p>')

    expect(attachCoverageNav(box)).toBe(null)
  })

  test('n/j advance, b/p/k rewind through uncovered blocks', () => {
    box = makeBox(
      '<span class="cline-no">a</span><span class="cstat-no">b</span><span class="fstat-no">c</span>'
    )

    const seen = []
    const blocks = [...box.querySelectorAll(DOCS_SELECTORS.UNCOVERED)]

    blocks.forEach((el) => (el.scrollIntoView = () => seen.push(el.textContent)))

    const dispose = attachCoverageNav(box)

    key('n')
    key('j')
    key('b')
    key('p')
    key('k')

    // n→a, j→b, b→a, p→c (wraps), k→b.
    expect(seen).toEqual(['a', 'b', 'a', 'c', 'b'])

    dispose()

    key('n')

    expect(seen.length).toBe(5)
  })

  test('modifier chords and unrelated keys are ignored', () => {
    box = makeBox('<span class="cline-no">a</span>')

    const seen = []

    box.querySelector(DOCS_SELECTORS.UNCOVERED).scrollIntoView = () => seen.push('hit')

    const dispose = attachCoverageNav(box)

    key('n', { ctrlKey: true })
    key('n', { metaKey: true })
    key('n', { altKey: true })
    key('Enter')

    expect(seen.length).toBe(0)

    dispose()
  })

  test('key nav toggles the istanbul highlighted class', () => {
    box = makeBox('<span class="cline-no">a</span><span class="cstat-no">b</span>')

    const blocks = [...box.querySelectorAll(DOCS_SELECTORS.UNCOVERED)]

    blocks.forEach((el) => (el.scrollIntoView = () => {}))

    const dispose = attachCoverageNav(box)

    key('n')

    expect(blocks[0].classList.contains(DOCS_SELECTORS.COV_HIGHLIGHT)).toBe(true)

    key('n')

    expect(blocks[0].classList.contains(DOCS_SELECTORS.COV_HIGHLIGHT)).toBe(false)
    expect(blocks[1].classList.contains(DOCS_SELECTORS.COV_HIGHLIGHT)).toBe(true)

    dispose()
  })

  test('summary table sorts asc/desc and the filter box narrows rows', () => {
    box = makeBox(
      `<template id="filterTemplate"><div><input type="search" id="fileSearch"></div></template>` +
        `<table class="coverage-summary"><thead><tr>` +
        `<th data-col="file">File</th>` +
        `<th data-col="pct" data-type="number">Pct</th>` +
        `<th data-nosort>Locked</th>` +
        `</tr></thead><tbody>` +
        `<tr><td class="file" data-value="b.ts">b</td><td data-value="50">50</td><td>x</td></tr>` +
        `<tr><td class="file" data-value="c.ts">c</td><td data-value="70">70</td><td>w</td></tr>` +
        `<tr><td class="file" data-value="a.ts">a</td><td data-value="90">90</td><td>y</td></tr>` +
        `<tr><td class="file" data-value="a.ts">a2</td><td data-value="50">50</td><td>z</td></tr>` +
        `</tbody></table>` +
        `<span class="cline-no">uncovered</span>`
    )

    const dispose = attachCoverageNav(box)

    const table = box.querySelector(DOCS_SELECTORS.COV_TABLE)
    const ths = table.querySelectorAll('th')
    const firstFile = () => table.querySelector('tbody tr td')?.getAttribute('data-value')

    // fileSearch was cloned in — regex/substring filtering live
    const search = box.querySelector(DOCS_SELECTORS.COV_SEARCH)

    expect(search).not.toBe(null)

    search.value = 'a'
    search.dispatchEvent(new Event('input'))

    const rows = [...table.querySelectorAll('tbody tr')]

    expect(rows[0].style.display).toBe('none')
    expect(rows[1].style.display).toBe('none')
    expect(rows[2].style.display).toBe('')
    expect(rows[3].style.display).toBe('')

    search.value = '['
    search.dispatchEvent(new Event('input'))

    // invalid regex falls back to substring — no row contains '['
    expect([...table.querySelectorAll('tbody tr')].every((r) => r.style.display === 'none')).toBe(
      true
    )

    search.value = ''
    search.dispatchEvent(new Event('input'))

    // istanbul starts sorted on col 0 asc — first click toggles desc;
    // the b/c/a ordering plus the a.ts tie exercise <, > and == in the
    // comparator
    ths[0].click()

    expect(firstFile()).toBe('c.ts')

    ths[0].click()

    expect(firstFile()).toBe('a.ts')

    // numeric column defaults to descending — 90 before the 50/50 tie
    ths[1].click()

    expect(firstFile()).toBe('a.ts')

    // indicators + sorter spans follow the istanbul contract
    expect(ths[1].classList.contains(DOCS_SELECTORS.COV_SORTED_DESC)).toBe(true)
    expect(ths[0].querySelector(DOCS_SELECTORS.COV_SORTER)).not.toBe(null)
    expect(ths[2].querySelector(DOCS_SELECTORS.COV_SORTER)).toBe(null)

    // search-focused guard: 'n' while typing in the filter is ignored
    const block = box.querySelector('.cline-no')

    block.scrollIntoView = () => {}

    search.focus()

    key('n')

    expect(block.classList.contains(DOCS_SELECTORS.COV_HIGHLIGHT)).toBe(false)

    search.blur()

    key('n')

    expect(block.classList.contains(DOCS_SELECTORS.COV_HIGHLIGHT)).toBe(true)

    dispose()
  })

  test('summary table alone still wires sorting when nothing is uncovered', () => {
    box = makeBox(
      `<table class="coverage-summary"><thead><tr><th data-col="f">F</th></tr></thead>` +
        `<tbody><tr><td data-value="z">z</td></tr></tbody></table>`
    )

    expect(attachCoverageNav(box)).not.toBe(null)
  })

  test('filter template without a table or without the input is inert', () => {
    box = makeBox(
      `<template id="filterTemplate"><div><input type="search" id="fileSearch"></div></template>` +
        `<span class="cline-no">a</span>`
    )

    // template present, no summary table → filter never wires
    expect(attachCoverageNav(box)).not.toBe(null)
    expect(box.querySelector(DOCS_SELECTORS.COV_SEARCH)).toBe(null)

    box.remove()

    box = makeBox(
      `<template id="filterTemplate"><div>no input</div></template>` +
        `<table class="coverage-summary"><thead><tr><th data-col="f">F</th></tr></thead>` +
        `<tbody><tr><td data-value="a">a</td></tr></tbody></table>` +
        `<span class="cline-no">a</span>`
    )

    // template without #fileSearch → nothing to wire, nav still active
    expect(attachCoverageNav(box)).not.toBe(null)
    expect(box.querySelector(DOCS_SELECTORS.COV_SEARCH)).toBe(null)
  })

  test('malformed tables without thead/tbody never wire sorting', () => {
    box = makeBox(
      `<table class="coverage-summary"><tbody><tr><td>x</td></tr></tbody></table>` +
        `<span class="cline-no">a</span>`
    )

    // table present, no thead → sorting skipped, keynav still wires
    expect(attachCoverageNav(box)).not.toBe(null)

    box.remove()

    // thead-only table → same guard path, still returns a disposer
    box = makeBox(
      `<table class="coverage-summary"><thead><tr><th>F</th></tr></thead></table>` +
        `<span class="cline-no">a</span>`
    )

    expect(attachCoverageNav(box)).not.toBe(null)
  })

  test('dispose removes the sort click listeners', () => {
    box = makeBox(
      `<table class="coverage-summary"><thead><tr><th data-col="f">F</th></tr></thead>` +
        `<tbody><tr><td data-value="b">b</td></tr><tr><td data-value="a">a</td></tr></tbody></table>`
    )

    const dispose = attachCoverageNav(box)
    const th = box.querySelector('th')

    dispose()

    th.click()

    expect(box.querySelector('tbody tr td')?.getAttribute('data-value')).toBe('b')
  })
})
