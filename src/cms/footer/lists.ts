/**
 * @file cms/footer/lists.ts — the repeated "channel list" pattern:
 * label+link rows with move/delete/add controls, and the matching
 * convention-based event binding (prefix-label/-link/-up/-down/-del).
 */

import { CMS_FIELD_KEYS } from '@/cms/tokens.js'
import { DATA_ATTRS } from '@/core/tokens/attrs/data.js'
import { FORM_ATTRS } from '@/core/tokens/attrs/form.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { FORM_EVENTS, MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { h } from '@/core/jsx.js'
import type { FooterChannel } from './types.js'
import type { CmsFooterEditor } from './CmsFooterEditor.js'
import { CMS_BUTTON_CLASSES, CMS_FORM_CLASSES, CMS_ITEM_CLASSES } from '@/cms/tokens.js'

/** Appends an item to a channel list and re-renders. */
export function addItem(host: CmsFooterEditor, arr: FooterChannel[], item: FooterChannel): void {
  arr.push(item)

  host._updateDom()
}

/** Removes an item by index and re-renders. */
export function removeItem(host: CmsFooterEditor, arr: FooterChannel[], idx: number): void {
  arr.splice(idx, 1)

  host._updateDom()
}

/** Moves an item up/down within its list. */
export function moveItem(
  host: CmsFooterEditor,
  arr: FooterChannel[],
  idx: number,
  dir: number
): void {
  const target = idx + dir

  if (target < 0 || target >= arr.length) return

  ;[arr[idx], arr[target]] = [arr[target], arr[idx]]

  host._updateDom()

  host._bindEvents()
}

/**
 * One editable channel list: label input + link/URL input + move/delete
 * controls per row. `prefix` namespaces every class (line1-*, legal-*,
 * social-*) so bindListEvents can bind by convention; `labelField`
 * picks which property holds the row label ('description' for contact
 * channels, 'page' for legal links, 'network' for socials) — matching
 * each DB shape exactly.
 */
export function renderChannelList(
  host: CmsFooterEditor,
  arr: FooterChannel[],
  prefix: string,
  addFn: string,
  labelField: string = CMS_FIELD_KEYS.DESCRIPTION
) {
  return h(
    HTML_TAGS.DIV,
    { class: 'cms-channel-list' },
    ...arr.map((item, idx) =>
      h(
        HTML_TAGS.DIV,
        { class: 'cms-channel-item', key: `${prefix}-${idx}` },
        h(
          HTML_TAGS.DIV,
          { class: 'cms-channel-label' },
          h(HTML_TAGS.INPUT, {
            class: `${CMS_FORM_CLASSES.CMS_INPUT} cms-input--label ${prefix}-label`,
            [DATA_ATTRS.DATA_IDX]: idx,
            value: String(item[labelField] ?? CHAR_STRINGS.EMPTY),
            placeholder: 'Label (e.g. Mail)',
          })
        ),
        h(HTML_TAGS.INPUT, {
          class: `${CMS_FORM_CLASSES.CMS_INPUT} ${prefix}-link`,
          [DATA_ATTRS.DATA_IDX]: idx,
          value: item.link || CHAR_STRINGS.EMPTY,
          placeholder: 'Value / URL',
        }),
        h(
          HTML_TAGS.DIV,
          { class: CMS_ITEM_CLASSES.CMS_ITEM_CONTROLS },
          h(
            HTML_TAGS.BUTTON,
            {
              class: `${CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY} ${prefix}-up`,
              [DATA_ATTRS.DATA_IDX]: idx,
              type: FORM_ATTRS.TYPE_BUTTON,
              disabled: idx === 0,
            },
            '▲'
          ),
          h(
            HTML_TAGS.BUTTON,
            {
              class: `${CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY} ${prefix}-down`,
              [DATA_ATTRS.DATA_IDX]: idx,
              type: FORM_ATTRS.TYPE_BUTTON,
              disabled: idx === arr.length - 1,
            },
            '▼'
          ),
          h(
            HTML_TAGS.BUTTON,
            {
              class: `${CMS_BUTTON_CLASSES.CMS_BTN_DANGER} ${prefix}-del`,
              [DATA_ATTRS.DATA_IDX]: idx,
              type: FORM_ATTRS.TYPE_BUTTON,
            },
            '✕'
          )
        )
      )
    ),
    h(
      HTML_TAGS.BUTTON,
      {
        class: `${CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY} ${prefix}-add`,
        type: FORM_ATTRS.TYPE_BUTTON,
      },
      `+ Add ${addFn}`
    )
  )
}

/** Wires add/remove/move/input handlers for a rendered list. */
export function bindListEvents(
  host: CmsFooterEditor,
  prefix: string,
  arr: FooterChannel[],
  labelField: string = CMS_FIELD_KEYS.DESCRIPTION
): void {
  const idxOf = (el: Element): number =>
    parseInt(el.getAttribute(DATA_ATTRS.DATA_IDX) || CHAR_STRINGS.ZERO, 10)

  host.$$(`.${prefix}-label`).forEach((inp) => {
    const idx = idxOf(inp)

    host.addScopedListener(inp, FORM_EVENTS.INPUT, (e) => {
      if (arr[idx]) arr[idx][labelField] = (e.target as HTMLInputElement).value
    })
  })

  host.$$(`.${prefix}-link`).forEach((inp) => {
    const idx = idxOf(inp)

    host.addScopedListener(inp, FORM_EVENTS.INPUT, (e) => {
      if (arr[idx]) arr[idx].link = (e.target as HTMLInputElement).value
    })
  })

  host.$$(`.${prefix}-up`).forEach((btn) => {
    const idx = idxOf(btn)

    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host._moveItem(arr, idx, -1))
  })

  host.$$(`.${prefix}-down`).forEach((btn) => {
    const idx = idxOf(btn)

    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host._moveItem(arr, idx, 1))
  })

  host.$$(`.${prefix}-del`).forEach((btn) => {
    const idx = idxOf(btn)

    host.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => host._removeItem(arr, idx))
  })
}
