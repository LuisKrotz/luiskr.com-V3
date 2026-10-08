/**
 * @file portfolio/render.tsx — portfolio list JSX templates.
 */

import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { CMS_PORTFOLIO_IDS, CMS_ACTIONS } from '@cms/tokens.js'
import { h } from '@core/jsx.js'
import type { CmsPortfolioList } from './CmsPortfolioList.js'
import type { PortfolioItem } from './types.js'
import { COVER_DIMENSIONS, MOSAIC_DIMENSIONS } from '@core/tokens/media/dimensions.js'
import {
  CMS_ABOUT_CLASSES,
  CMS_BUTTON_CLASSES,
  CMS_CARD_CLASSES,
  CMS_FORM_CLASSES,
  CMS_ITEM_CLASSES,
  CMS_PORTFOLIO_CLASSES,
  CMS_PROJECTS_CLASSES,
} from '@cms/tokens.js'

/**
 * Renders item.
 * @param host — the host component
 * @param item — the item
 * @param idx — the index
 */
export function renderItem(host: CmsPortfolioList, item: PortfolioItem, idx: number) {
  const w = item.width || []
  const ht = item.height || []

  return h(
    HTML_TAGS.DIV,
    {
      class: `${CMS_CARD_CLASSES.CMS_CARD} ${CMS_PORTFOLIO_CLASSES.CMS_PF_ITEM}`,
      key: `pf-${idx}`,
    },
    // ── Identity row: thumb + title | controls ────────────────────────────
    h(
      HTML_TAGS.DIV,
      { class: CMS_PORTFOLIO_CLASSES.CMS_PF_HEAD },
      h(
        HTML_TAGS.DIV,
        { class: CMS_PORTFOLIO_CLASSES.CMS_PF_IDENTITY },
        h(
          HTML_TAGS.DIV,
          { class: CMS_PORTFOLIO_CLASSES.CMS_PF_THUMB },
          item.image
            ? h('img', {
                src: host.getImagePreview(item.image),
                class: CMS_PORTFOLIO_CLASSES.CMS_PF_THUMB_IMG,
                alt: item.label || 'thumb',
                loading: 'lazy',
              })
            : h(HTML_TAGS.SPAN, { class: CMS_PORTFOLIO_CLASSES.CMS_PF_NOIMG }, 'No img')
        ),
        h(
          'h3',
          { class: CMS_PORTFOLIO_CLASSES.CMS_PF_TITLE },
          `#${idx + 1} ${item.label || 'Untitled Item'}`
        )
      ),
      h(
        HTML_TAGS.DIV,
        { class: CMS_ITEM_CLASSES.CMS_ITEM_CONTROLS },
        h(
          HTML_TAGS.BUTTON,
          {
            class: `${CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY} ${CMS_PORTFOLIO_CLASSES.CMS_BTN_COMPACT}`,
            [DATA_ATTRS.DATA_ACTION]: CMS_ACTIONS.UP,
            [DATA_ATTRS.DATA_IDX]: idx,
            type: FORM_ATTRS.TYPE_BUTTON,
            disabled: idx === 0,
          },
          '▲'
        ),
        h(
          HTML_TAGS.BUTTON,
          {
            class: `${CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY} ${CMS_PORTFOLIO_CLASSES.CMS_BTN_COMPACT}`,
            [DATA_ATTRS.DATA_ACTION]: CMS_ACTIONS.DOWN,
            [DATA_ATTRS.DATA_IDX]: idx,
            type: FORM_ATTRS.TYPE_BUTTON,
            disabled: idx === host.items.length - 1,
          },
          '▼'
        ),
        h(
          HTML_TAGS.BUTTON,
          {
            class: `${CMS_BUTTON_CLASSES.CMS_BTN_DANGER} ${CMS_PORTFOLIO_CLASSES.CMS_BTN_COMPACT}`,
            [DATA_ATTRS.DATA_ACTION]: CMS_ACTIONS.DELETE,
            [DATA_ATTRS.DATA_IDX]: idx,
            type: FORM_ATTRS.TYPE_BUTTON,
          },
          '✕ Delete'
        )
      )
    ),

    // ── Localized + structural fields ─────────────────────────────────────
    h(
      HTML_TAGS.DIV,
      { class: CMS_PORTFOLIO_CLASSES.CMS_PF_FIELDS },
      h(
        HTML_TAGS.DIV,
        { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
        h(HTML_TAGS.LABEL, null, 'Label / Title (Localized)'),
        h(HTML_TAGS.INPUT, {
          class: `${CMS_FORM_CLASSES.CMS_INPUT} ${CMS_PORTFOLIO_CLASSES.ITEM_FIELD}`,
          [DATA_ATTRS.DATA_IDX]: idx,
          [DATA_ATTRS.DATA_FIELD]: 'label',
          value: item.label || CHAR_STRINGS.EMPTY,
          placeholder: 'e.g. METCHA',
        })
      ),
      h(
        HTML_TAGS.DIV,
        { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
        h(HTML_TAGS.LABEL, null, 'Link Slug (Non-localized)'),
        h(HTML_TAGS.INPUT, {
          class: `${CMS_FORM_CLASSES.CMS_INPUT} ${CMS_PORTFOLIO_CLASSES.ITEM_FIELD}`,
          [DATA_ATTRS.DATA_IDX]: idx,
          [DATA_ATTRS.DATA_FIELD]: 'link',
          value: item.link || CHAR_STRINGS.EMPTY,
          placeholder: 'e.g. metcha',
        })
      ),
      h(
        HTML_TAGS.DIV,
        { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
        h(HTML_TAGS.LABEL, null, 'Image Filename (Non-localized, without .jpg)'),
        h(
          HTML_TAGS.DIV,
          { class: CMS_PORTFOLIO_CLASSES.CMS_PF_IMAGE_ROW },
          h(HTML_TAGS.INPUT, {
            class: `${CMS_FORM_CLASSES.CMS_INPUT} ${CMS_PORTFOLIO_CLASSES.ITEM_FIELD}`,
            [DATA_ATTRS.DATA_IDX]: idx,
            [DATA_ATTRS.DATA_FIELD]: 'image',
            value: item.image || CHAR_STRINGS.EMPTY,
            placeholder: 'e.g. metcha',
          }),
          item.image
            ? h(
                HTML_TAGS.A,
                {
                  href: host.getImagePreview(item.image),
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  class: `${CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY} ${CMS_PORTFOLIO_CLASSES.CMS_BTN_COMPACT} ${CMS_PORTFOLIO_CLASSES.CMS_PF_VIEW}`,
                },
                '↗ View'
              )
            : null
        )
      ),
      h(
        HTML_TAGS.DIV,
        { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
        h(HTML_TAGS.LABEL, null, 'Featured Item? (Non-localized)'),
        h(
          HTML_TAGS.SELECT,
          {
            class: `${CMS_FORM_CLASSES.CMS_SELECT} ${CMS_PORTFOLIO_CLASSES.FEAT_SELECT}`,
            [DATA_ATTRS.DATA_IDX]: idx,
          },
          h(
            HTML_TAGS.OPTION,
            { value: 'true', selected: item.featured ? '' : null },
            'Yes (Featured Banner)'
          ),
          h(
            HTML_TAGS.OPTION,
            { value: 'false', selected: !item.featured ? '' : null },
            'No (Standard Tile)'
          )
        )
      )
    ),

    // ── Dimensions ────────────────────────────────────────────────────────
    h(
      HTML_TAGS.DIV,
      { class: CMS_PORTFOLIO_CLASSES.CMS_PF_DIMS },
      h(
        HTML_TAGS.SPAN,
        { class: CMS_PORTFOLIO_CLASSES.CMS_PF_DIMS_TITLE },
        'Image Dimensions (Non-localized px)'
      ),
      h(
        HTML_TAGS.DIV,
        { class: CMS_PORTFOLIO_CLASSES.CMS_PF_DIMS_GRID },
        h(
          HTML_TAGS.DIV,
          { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
          h(HTML_TAGS.LABEL, { class: CMS_PORTFOLIO_CLASSES.CMS_PF_DIM_LABEL }, 'Desktop Width'),
          h(HTML_TAGS.INPUT, {
            class: `${CMS_FORM_CLASSES.CMS_INPUT} ${CMS_PORTFOLIO_CLASSES.DIM_FIELD}`,
            [DATA_ATTRS.DATA_IDX]: idx,
            [DATA_ATTRS.DATA_PROP]: 'width',
            [DATA_ATTRS.DATA_DIM_IDX]: 0,
            value: w[0] || COVER_DIMENSIONS.FHD_WIDTH_STR,
          })
        ),
        h(
          HTML_TAGS.DIV,
          { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
          h(HTML_TAGS.LABEL, { class: CMS_PORTFOLIO_CLASSES.CMS_PF_DIM_LABEL }, 'Mobile Width'),
          h(HTML_TAGS.INPUT, {
            class: `${CMS_FORM_CLASSES.CMS_INPUT} ${CMS_PORTFOLIO_CLASSES.DIM_FIELD}`,
            [DATA_ATTRS.DATA_IDX]: idx,
            [DATA_ATTRS.DATA_PROP]: 'width',
            [DATA_ATTRS.DATA_DIM_IDX]: 1,
            value: w[1] || MOSAIC_DIMENSIONS.MOSAIC_MOBILE_WIDTH_STR,
          })
        ),
        h(
          HTML_TAGS.DIV,
          { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
          h(HTML_TAGS.LABEL, { class: CMS_PORTFOLIO_CLASSES.CMS_PF_DIM_LABEL }, 'Desktop Height'),
          h(HTML_TAGS.INPUT, {
            class: `${CMS_FORM_CLASSES.CMS_INPUT} ${CMS_PORTFOLIO_CLASSES.DIM_FIELD}`,
            [DATA_ATTRS.DATA_IDX]: idx,
            [DATA_ATTRS.DATA_PROP]: 'height',
            [DATA_ATTRS.DATA_DIM_IDX]: 0,
            value: ht[0] || MOSAIC_DIMENSIONS.MOSAIC_DESKTOP_HEIGHT_STR,
          })
        ),
        h(
          HTML_TAGS.DIV,
          { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
          h(HTML_TAGS.LABEL, { class: CMS_PORTFOLIO_CLASSES.CMS_PF_DIM_LABEL }, 'Mobile Height'),
          h(HTML_TAGS.INPUT, {
            class: `${CMS_FORM_CLASSES.CMS_INPUT} ${CMS_PORTFOLIO_CLASSES.DIM_FIELD}`,
            [DATA_ATTRS.DATA_IDX]: idx,
            [DATA_ATTRS.DATA_PROP]: 'height',
            [DATA_ATTRS.DATA_DIM_IDX]: 1,
            value: ht[1] || MOSAIC_DIMENSIONS.MOSAIC_MOBILE_HEIGHT_STR,
          })
        )
      )
    ),

    // ── Description ───────────────────────────────────────────────────────
    h(
      HTML_TAGS.DIV,
      { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
      h(HTML_TAGS.LABEL, null, 'Description (Localized, HTML allowed)'),
      h(HTML_TAGS.TEXTAREA, {
        class: `${CMS_FORM_CLASSES.CMS_TEXTAREA} item-field`,
        [DATA_ATTRS.DATA_IDX]: idx,
        [DATA_ATTRS.DATA_FIELD]: 'description',
        rows: '2',
        innerHTML: item.description || CHAR_STRINGS.EMPTY,
      })
    )
  )
}

/**
 * Renders portfolio list.
 * @param host — the host component
 */
export function renderPortfolioList(host: CmsPortfolioList) {
  return h(
    HTML_TAGS.DIV,
    { class: CMS_PORTFOLIO_CLASSES.CMS_PORTFOLIO_MANAGER },
    // ── Header ──────────────────────────────────────────────────────────────
    h(
      HTML_TAGS.DIV,
      { class: `${CMS_CARD_CLASSES.CMS_CARD} ${CMS_PROJECTS_CLASSES.CMS_CARD_HEADER}` },
      h(
        HTML_TAGS.DIV,
        null,
        h('h2', { class: CMS_CARD_CLASSES.CMS_CARD_TITLE }, 'Homepage Portfolio Items'),
        h(
          HTML_TAGS.P,
          { class: CMS_CARD_CLASSES.CMS_CARD_SUBTITLE },
          'Manage the projects featured on the main mosaic grid, image URLs, and dimensions.'
        )
      ),
      h(
        HTML_TAGS.DIV,
        { class: CMS_BUTTON_CLASSES.CMS_BTN_GROUP },
        h(
          HTML_TAGS.BUTTON,
          {
            class: CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY,
            id: CMS_PORTFOLIO_IDS.ADD_ITEM,
            type: FORM_ATTRS.TYPE_BUTTON,
          },
          '+ Add New Item'
        ),
        h(
          HTML_TAGS.BUTTON,
          {
            class: CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY,
            id: CMS_PORTFOLIO_IDS.SYNC_ITEMS,
            type: FORM_ATTRS.TYPE_BUTTON,
            disabled: host.saving,
            title: 'Copies image filenames, dimensions, links, and featured flags to all languages',
          },
          '🔄 Sync Images & Dimensions to All Languages'
        ),
        h(
          HTML_TAGS.BUTTON,
          {
            class: CMS_BUTTON_CLASSES.CMS_BTN,
            id: CMS_PORTFOLIO_IDS.SAVE_ITEMS,
            type: FORM_ATTRS.TYPE_BUTTON,
            disabled: host.saving,
          },
          host.saving ? 'Saving...' : '💾 Save to Firebase'
        )
      )
    ),

    // ── Language ──────────────────────────────────────────────────────────
    h(
      HTML_TAGS.DIV,
      { class: `${CMS_CARD_CLASSES.CMS_CARD} ${CMS_ABOUT_CLASSES.CMS_CARD_LANG}` },
      h(HTML_TAGS.LABEL, { class: CMS_FORM_CLASSES.CMS_LABEL }, 'Target Language:'),
      h(
        HTML_TAGS.SELECT,
        {
          id: CMS_PORTFOLIO_IDS.SELECT_LANG,
          class: `${CMS_FORM_CLASSES.CMS_SELECT} ${CMS_PORTFOLIO_CLASSES.CMS_SELECT_NARROW}`,
        },
        ...host.languages.map((l) =>
          h(
            HTML_TAGS.OPTION,
            { value: l, selected: host.selectedLang === l ? '' : null },
            l.toUpperCase()
          )
        )
      )
    ),

    // ── Items ─────────────────────────────────────────────────────────────
    host.items.length
      ? h(
          HTML_TAGS.DIV,
          { class: CMS_PORTFOLIO_CLASSES.CMS_PF_LIST },
          ...host.items.map((item, idx) => renderItem(host, item, idx))
        )
      : h(
          HTML_TAGS.DIV,
          { class: `${CMS_CARD_CLASSES.CMS_CARD} ${CMS_PORTFOLIO_CLASSES.CMS_PF_EMPTY}` },
          'No portfolio items found for this language. Click "+ Add New Item" to create one.'
        )
  )
}
