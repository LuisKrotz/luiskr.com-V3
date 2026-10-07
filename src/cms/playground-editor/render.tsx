/**
 * @file cms/playground-editor/render.tsx
 * @description JSX sections for <cms-playground-editor>: the playground
 * label key rows, the typed control-defaults rows (numbers → range
 * inputs, booleans → toggles), the per-locale slug editor rows, and the
 * full card layout.
 */

import { DATA_ATTRS } from '@/core/tokens/attrs/data.js'
import { FORM_ATTRS } from '@/core/tokens/attrs/form.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { h } from '@/core/jsx.js'
import type { CmsPlaygroundEditor } from './CmsPlaygroundEditor.js'
import {
  CMS_BUTTON_CLASSES,
  CMS_CARD_CLASSES,
  CMS_FORM_CLASSES,
  CMS_ITEM_CLASSES,
} from '@/cms/tokens.js'

// Canonical slug keys edited under translations/<locale>/slugs.
// Order mirrors i18n LANG_SLUGS so the form is stable across locales.
/**
 * Frozen slug list — the ordered source for this token set.
 */
export const SLUG_KEYS = Object.freeze([
  'about',
  'contact',
  'privacy',
  'gdpr',
  'terms',
  'earthPlayground',
])

/** JSX for the playground label key rows. */
export function renderLabelRows(ed: CmsPlaygroundEditor) {
  if (!ed.epKeys.length) {
    return h(
      HTML_TAGS.P,
      { class: CMS_FORM_CLASSES.CMS_HINT },
      'No earth-playground page data for this language yet. Add keys below or switch language.'
    )
  }

  return h(
    HTML_TAGS.DIV,
    { class: CMS_ITEM_CLASSES.CMS_KV_LIST },
    ...ed.epKeys.map((key) =>
      h(
        HTML_TAGS.DIV,
        { class: CMS_ITEM_CLASSES.CMS_KV_ITEM, key },
        h(HTML_TAGS.SPAN, { class: CMS_ITEM_CLASSES.CMS_KV_KEY }, key),
        h(HTML_TAGS.INPUT, {
          class: `${CMS_FORM_CLASSES.CMS_INPUT} ep-value`,
          [DATA_ATTRS.DATA_FIELD]: key,
          value: String(ed.epData[key] ?? ''),
        }),
        h(
          HTML_TAGS.BUTTON,
          {
            class: `${CMS_BUTTON_CLASSES.CMS_BTN_DANGER} ep-del`,
            [DATA_ATTRS.DATA_FIELD]: key,
            type: FORM_ATTRS.TYPE_BUTTON,
          },
          '✕'
        )
      )
    )
  )
}

/** JSX for the playground control defaults (typed per stored value). */
export function renderDefaults(ed: CmsPlaygroundEditor) {
  const keys = Object.keys(ed.epDefaults)

  if (!keys.length) {
    return h(
      HTML_TAGS.P,
      { class: CMS_FORM_CLASSES.CMS_HINT },
      'No defaults object yet — it is created on first save.'
    )
  }

  return h(
    HTML_TAGS.DIV,
    { class: CMS_ITEM_CLASSES.CMS_KV_LIST },
    ...keys.map((key) => {
      const val = ed.epDefaults[key]

      return h(
        HTML_TAGS.DIV,
        { class: CMS_ITEM_CLASSES.CMS_KV_ITEM, key },
        h(HTML_TAGS.SPAN, { class: CMS_ITEM_CLASSES.CMS_KV_KEY }, key),
        typeof val === 'boolean'
          ? h(HTML_TAGS.INPUT, {
              class: 'cms-checkbox ep-def-bool',
              [DATA_ATTRS.DATA_FIELD]: key,
              type: FORM_ATTRS.CHECKBOX,
              checked: val ? '' : null,
            })
          : h(HTML_TAGS.INPUT, {
              class: `${CMS_FORM_CLASSES.CMS_INPUT} ep-def-num`,
              [DATA_ATTRS.DATA_FIELD]: key,
              type: TYPE_STRINGS.NUMBER,
              step: 'any',
              value: String(val),
            })
      )
    }),
    h(
      HTML_TAGS.P,
      { class: CMS_FORM_CLASSES.CMS_HINT },
      'Initial slider/checkbox values applied to the playground control panel. Keys map to the control labels — numbers land on range inputs, booleans on toggles. User-saved overrides still win per visitor.'
    )
  )
}

/** JSX for the per-locale slug editor rows. */
export function renderSlugRows(ed: CmsPlaygroundEditor) {
  return h(
    HTML_TAGS.DIV,
    { class: CMS_ITEM_CLASSES.CMS_KV_LIST },
    ...SLUG_KEYS.map((key) =>
      h(
        HTML_TAGS.DIV,
        { class: CMS_ITEM_CLASSES.CMS_KV_ITEM, key },
        h(HTML_TAGS.SPAN, { class: CMS_ITEM_CLASSES.CMS_KV_KEY }, key),
        h(HTML_TAGS.INPUT, {
          class: `${CMS_FORM_CLASSES.CMS_INPUT} slug-value`,
          [DATA_ATTRS.DATA_FIELD]: key,
          value: ed.slugs[key] || '',
          placeholder: `${key}-slug`,
        })
      )
    ),
    h(
      HTML_TAGS.P,
      { class: CMS_FORM_CLASSES.CMS_HINT },
      'URL slugs used by the router and language switcher for this locale, e.g. /br/playground-da-terra. Leave a field empty to keep the code default.'
    )
  )
}

/** JSX template — header card, locale picker, labels/defaults/slug cards. */
export function renderPlaygroundEditor(ed: CmsPlaygroundEditor) {
  return h(
    HTML_TAGS.DIV,
    { class: 'cms-playground-manager' },

    h(
      HTML_TAGS.DIV,
      { class: `${CMS_CARD_CLASSES.CMS_CARD} cms-card--header` },
      h(
        HTML_TAGS.DIV,
        null,
        h(
          HTML_TAGS.H2,
          { class: CMS_CARD_CLASSES.CMS_CARD_TITLE },
          'Earth Playground & Language Keys'
        ),
        h(
          HTML_TAGS.P,
          { class: CMS_CARD_CLASSES.CMS_CARD_SUBTITLE },
          'Edit the playground control labels (pages/earth-playground) and the per-locale route slugs.'
        )
      ),
      h(
        HTML_TAGS.BUTTON,
        {
          id: 'btn-save-playground',
          class: CMS_BUTTON_CLASSES.CMS_BTN,
          type: FORM_ATTRS.TYPE_BUTTON,
          disabled: ed.saving,
        },
        ed.saving ? 'Saving...' : '💾 Save to Firebase'
      )
    ),

    h(
      HTML_TAGS.DIV,
      { class: `${CMS_CARD_CLASSES.CMS_CARD} cms-card--lang` },
      h(HTML_TAGS.LABEL, { class: CMS_FORM_CLASSES.CMS_LABEL }, 'Target Language:'),
      h(
        HTML_TAGS.SELECT,
        { id: 'select-playground-lang', class: CMS_FORM_CLASSES.CMS_SELECT },
        ...ed.languages.map((l) =>
          h(
            HTML_TAGS.OPTION,
            { value: l, selected: ed.selectedLang === l ? '' : null },
            l.toUpperCase()
          )
        )
      )
    ),

    h(
      HTML_TAGS.DIV,
      { class: CMS_CARD_CLASSES.CMS_CARD },
      h(
        HTML_TAGS.DIV,
        { class: CMS_CARD_CLASSES.CMS_SECTION_HEADER },
        h(
          HTML_TAGS.DIV,
          null,
          h(
            HTML_TAGS.H3,
            { class: CMS_CARD_CLASSES.CMS_SECTION_TITLE },
            `Earth Playground Labels [${ed.selectedLang.toUpperCase()}]`
          ),
          h(
            HTML_TAGS.P,
            { class: CMS_CARD_CLASSES.CMS_CARD_SUBTITLE },
            `Corresponds to pages/earth-playground — control panel, loader and stats labels shown on the playground route.`
          )
        ),
        h(
          HTML_TAGS.BUTTON,
          {
            id: 'btn-add-ep-key',
            class: CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY,
            type: FORM_ATTRS.TYPE_BUTTON,
          },
          '+ Add Label Key'
        )
      ),
      ed._renderLabelRows()
    ),

    h(
      HTML_TAGS.DIV,
      { class: CMS_CARD_CLASSES.CMS_CARD },
      h(
        HTML_TAGS.DIV,
        { class: CMS_CARD_CLASSES.CMS_SECTION_HEADER },
        h(
          HTML_TAGS.DIV,
          null,
          h(
            HTML_TAGS.H3,
            { class: CMS_CARD_CLASSES.CMS_SECTION_TITLE },
            'Earth Playground Defaults'
          ),
          h(
            HTML_TAGS.P,
            { class: CMS_CARD_CLASSES.CMS_CARD_SUBTITLE },
            `Corresponds to pages/earth-playground/defaults — the initial values every control panel slider and toggle starts from.`
          )
        )
      ),
      ed._renderDefaults()
    ),

    h(
      HTML_TAGS.DIV,
      { class: CMS_CARD_CLASSES.CMS_CARD },
      h(
        HTML_TAGS.DIV,
        { class: CMS_CARD_CLASSES.CMS_SECTION_HEADER },
        h(
          HTML_TAGS.DIV,
          null,
          h(HTML_TAGS.H3, { class: CMS_CARD_CLASSES.CMS_SECTION_TITLE }, 'Route Slug Keys'),
          h(
            HTML_TAGS.P,
            { class: CMS_CARD_CLASSES.CMS_CARD_SUBTITLE },
            'Corresponds to the slugs node — localized URL segments for each route.'
          )
        )
      ),
      ed._renderSlugRows()
    )
  )
}
