/**
 * @file docs/coverage-nav.ts
 * @description Istanbul coverage-report interactivity for the docs viewer.
 * Coverage HTML reports ship external scripts (`block-navigation.js` for
 * "Press n or j to go to the next uncovered block", `sorter.js` for the
 * sortable summary table and the file-search filter box) — the sanitizer
 * strips them, so this module re-implements the same contract client-side:
 *
 * - `n`/`j` jump to the next uncovered block, `b`/`p`/`k` to the previous
 *   one; the current block carries istanbul's `highlighted` class and is
 *   scrolled into view. Keys are ignored while the file-search input is
 *   focused or a modifier is held.
 * - `table.coverage-summary` columns become click-sortable (span.sorter
 *   indicator + sorted/sorted-desc header classes), driven by the same
 *   `data-col`/`data-type`/`data-value` attributes the stock sorter uses.
 * - The `filterTemplate` is cloned into the report header and its
 *   `fileSearch` input filters summary rows by regex-or-substring.
 *
 * Attached per painted payload and bound at document level (like the
 * original scripts) so keys work regardless of focus position while a
 * coverage report is open. Returns null when the payload isn't an
 * istanbul report, so the caller skips wiring entirely.
 */

import { DOCS_SELECTORS } from '@core/tokens/selectors/docs.js'
import { KEYBOARD_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

/** istanbul "next uncovered block" keys. */
const NEXT_KEYS = 'nj'

/** istanbul "previous uncovered block" keys. */
const PREV_KEYS = 'bpk'

/**
 * Clones istanbul's `filterTemplate` into the report header and wires its
 * `fileSearch` input: valid regex input filters rows by regex, otherwise
 * a case-insensitive substring match — mirroring `sorter.js`'s
 * `onFilterInput`. Scoped to `box` because the report lives in a shadow
 * root (document.getElementById can't reach it).
 * @param box Painted `.docs-content` element.
 * @param body The summary table body whose rows get filtered.
 * @returns The created input, or null when no template/table exists.
 */
const wireFileSearch = (
  box: HTMLElement,
  body: HTMLTableSectionElement | null
): HTMLInputElement | null => {
  const tpl = box.querySelector<HTMLTemplateElement>(DOCS_SELECTORS.COV_TEMPLATE)

  if (!tpl || !body) return null

  tpl.after(tpl.content.cloneNode(true))

  const input = box.querySelector<HTMLInputElement>(DOCS_SELECTORS.COV_SEARCH)

  if (!input) return null

  input.oninput = () => {
    const value = input.value

    let re: RegExp | null = null

    try {
      re = new RegExp(value, 'i')
    } catch {
      /* invalid regex → plain substring matching, like the original */
    }

    Array.from(body.children).forEach((row) => {
      // Element.textContent is non-null for real elements (null only on
      // Document/DocumentType) — String() keeps the type without a branch.
      const text = String(row.textContent)

      const match = re ? re.test(text) : text.toLowerCase().includes(value.toLowerCase())

      ;(row as HTMLElement).style.display = match ? '' : 'none'
    })
  }

  return input
}

/**
 * Re-implements istanbul's `sorter.js`: reads `th[data-col]` columns,
 * makes the sortable ones clickable (a `span.sorter` marker plus
 * sorted/sorted-desc header classes), and reorders `tbody tr` rows by
 * their `td[data-value]` cells — numeric compare for `data-type="number"`
 * columns, which default to descending like the stock report.
 * @param box Painted `.docs-content` element.
 * @returns Disposer for the column click listeners, or null without a table.
 */
const wireSorting = (box: HTMLElement): (() => void) | null => {
  const table = box.querySelector<HTMLTableElement>(DOCS_SELECTORS.COV_TABLE)

  const head = table?.querySelector('thead')

  const body = table?.querySelector('tbody')

  if (!table || !head || !body) return null

  const ths = Array.from(head.querySelectorAll('th'))

  const cols = ths.map((th) => {
    const isNum = (th.getAttribute(DOCS_SELECTORS.COV_DATA_TYPE) ?? 'string') === 'number'

    return {
      isNum,
      sortable: !th.hasAttribute(DOCS_SELECTORS.COV_DATA_NOSORT),
      defaultDesc: isNum,
    }
  })

  const disposers: Array<() => void> = []

  const sortedBy = { index: 0, desc: false }

  const applyIndicator = () => {
    ths.forEach((th, i) => {
      th.classList.remove(DOCS_SELECTORS.COV_SORTED, DOCS_SELECTORS.COV_SORTED_DESC)

      if (i === sortedBy.index) {
        th.classList.add(sortedBy.desc ? DOCS_SELECTORS.COV_SORTED_DESC : DOCS_SELECTORS.COV_SORTED)
      }
    })
  }

  ths.forEach((th, i) => {
    if (!cols[i].sortable) return

    const sorter = document.createElement(HTML_TAGS.SPAN)

    sorter.className = 'sorter'
    th.appendChild(sorter)

    const onSort = () => {
      const col = cols[i]

      const desc = sortedBy.index === i ? !sortedBy.desc : col.defaultDesc

      const rows = Array.from(body.querySelectorAll('tr'))

      rows
        .map((row) => {
          // istanbul rows always carry a td per th with data-value set —
          // the casts mirror the report contract, not defensive guards.
          const td = row.querySelectorAll('td')[i] as HTMLElement

          const raw = td.getAttribute(DOCS_SELECTORS.COV_DATA_VALUE) as string

          return { row, val: col.isNum ? Number(raw) : raw }
        })
        .sort((a, b) => {
          const cmp = a.val < b.val ? -1 : a.val > b.val ? 1 : 0

          return desc ? -cmp : cmp
        })
        .forEach(({ row }) => body.appendChild(row))

      sortedBy.index = i
      sortedBy.desc = desc

      applyIndicator()
    }

    th.addEventListener(MOUSE_EVENTS.CLICK, onSort)
    disposers.push(() => th.removeEventListener(MOUSE_EVENTS.CLICK, onSort))
  })

  applyIndicator()

  return () => disposers.forEach((d) => d())
}

/**
 * Wires the istanbul report contract when `box` holds a coverage report.
 * @param box The `.docs-content` element whose innerHTML was just painted.
 * @returns Disposer removing all listeners, or null when the payload
 *          contains no istanbul surface (no summary table and no
 *          uncovered-block markers to navigate).
 */
export const attachCoverageNav = (box: HTMLElement): (() => void) | null => {
  const blocks = Array.from(box.querySelectorAll<HTMLElement>(DOCS_SELECTORS.UNCOVERED))

  const body = box.querySelector<HTMLTableSectionElement>(`${DOCS_SELECTORS.COV_TABLE} tbody`)

  const searchInput = wireFileSearch(box, body)

  const disposeSort = wireSorting(box)

  if (!blocks.length && !disposeSort) return null

  let idx = -1

  const isSearchFocused = () => {
    const active = (box.getRootNode() as Document | ShadowRoot).activeElement

    return !!searchInput && active === searchInput
  }

  const onKey = (e: KeyboardEvent) => {
    // Never steal modified keys — Ctrl+N / Cmd+K etc. stay browser-owned.
    if (e.metaKey || e.ctrlKey || e.altKey || isSearchFocused() || !blocks.length) return

    const key = e.key.toLowerCase()

    const delta = NEXT_KEYS.includes(key) ? 1 : PREV_KEYS.includes(key) ? -1 : 0

    if (!delta) return

    e.preventDefault()

    if (idx >= 0) blocks[idx].classList.remove(DOCS_SELECTORS.COV_HIGHLIGHT)

    idx = (idx + delta + blocks.length) % blocks.length

    blocks[idx].classList.add(DOCS_SELECTORS.COV_HIGHLIGHT)
    blocks[idx].scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' })
  }

  document.addEventListener(KEYBOARD_EVENTS.KEYDOWN, onKey)

  return () => {
    document.removeEventListener(KEYBOARD_EVENTS.KEYDOWN, onKey)

    disposeSort?.()
  }
}
