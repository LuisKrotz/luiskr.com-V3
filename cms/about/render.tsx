/**
 * @file about/render.tsx — editor JSX templates.
 */

import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { NAV_TEXT } from '@core/tokens/strings/text.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { CMS_ABOUT_IDS } from '@cms/tokens.js'
import { h } from '@core/jsx.js'
import type { CmsAboutEditor } from './CmsAboutEditor.js'
import { SIZE_PRESETS, type BioColumn } from './types.js'
import {
  CMS_ABOUT_CLASSES,
  CMS_BUTTON_CLASSES,
  CMS_CARD_CLASSES,
  CMS_FORM_CLASSES,
  CMS_ITEM_CLASSES,
} from '@cms/tokens.js'

/**
 * Renders paragraph list.
 * @param host — the host component
 * @param col — the value
 */
export function renderParagraphList(host: CmsAboutEditor, col: BioColumn) {
  const arr = host.aboutData[col] || []
  return h(
    HTML_TAGS.DIV,
    { class: CMS_ABOUT_CLASSES.CMS_PARA_LIST },
    ...arr.map((p, idx) =>
      h(
        HTML_TAGS.DIV,
        { class: CMS_ITEM_CLASSES.CMS_PARA_ITEM },
        h(
          HTML_TAGS.DIV,
          { class: CMS_ABOUT_CLASSES.CMS_PARA_CONTROLS },
          h(
            HTML_TAGS.BUTTON,
            {
              class: `${CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY} ${CMS_ABOUT_CLASSES.PARA_UP_BTN}`,
              [DATA_ATTRS.DATA_COL]: col,
              [DATA_ATTRS.DATA_IDX]: idx,
              type: FORM_ATTRS.TYPE_BUTTON,
              disabled: idx === 0 ? '' : null,
            },
            '▲'
          ),
          h(
            HTML_TAGS.BUTTON,
            {
              class: `${CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY} ${CMS_ABOUT_CLASSES.PARA_DOWN_BTN}`,
              [DATA_ATTRS.DATA_COL]: col,
              [DATA_ATTRS.DATA_IDX]: idx,
              type: FORM_ATTRS.TYPE_BUTTON,
              disabled: idx === arr.length - 1 ? '' : null,
            },
            '▼'
          ),
          h(
            HTML_TAGS.BUTTON,
            {
              class: `${CMS_BUTTON_CLASSES.CMS_BTN_DANGER} ${CMS_ABOUT_CLASSES.PARA_REMOVE_BTN}`,
              [DATA_ATTRS.DATA_COL]: col,
              [DATA_ATTRS.DATA_IDX]: idx,
              type: FORM_ATTRS.TYPE_BUTTON,
            },
            '✕'
          )
        ),
        h(HTML_TAGS.TEXTAREA, {
          class: `${CMS_FORM_CLASSES.CMS_TEXTAREA} ${CMS_ABOUT_CLASSES.PARA_INPUT}`,
          [DATA_ATTRS.DATA_COL]: col,
          [DATA_ATTRS.DATA_IDX]: idx,
          rows: '3',
          innerHTML: p,
        })
      )
    ),
    h(
      HTML_TAGS.BUTTON,
      {
        class: `${CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY} ${CMS_ABOUT_CLASSES.COL_ADD_BTN}`,
        [DATA_ATTRS.DATA_COL]: col,
        type: FORM_ATTRS.TYPE_BUTTON,
      },
      '+ Add Paragraph'
    )
  )
}

/**
 * Renders mention items.
 * @param host — the host component
 */
export function renderMentionItems(host: CmsAboutEditor) {
  const items = host.aboutData.mention_items || []
  return h(
    HTML_TAGS.DIV,
    { class: CMS_ABOUT_CLASSES.CMS_MENTION_LIST },
    ...items.map((item, idx) =>
      h(
        HTML_TAGS.DIV,
        { class: `${CMS_CARD_CLASSES.CMS_CARD} ${CMS_ABOUT_CLASSES.CMS_MENTION_ITEM}` },
        h(
          HTML_TAGS.DIV,
          { class: CMS_ABOUT_CLASSES.CMS_ITEM_HEADER },
          h(HTML_TAGS.SPAN, { class: CMS_ABOUT_CLASSES.CMS_ITEM_LABEL }, `#${idx + 1}`),
          h(
            HTML_TAGS.DIV,
            { class: CMS_ITEM_CLASSES.CMS_ITEM_CONTROLS },
            h(
              HTML_TAGS.BUTTON,
              {
                class: `${CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY} ${CMS_ABOUT_CLASSES.MENTION_UP_BTN}`,
                [DATA_ATTRS.DATA_IDX]: idx,
                type: FORM_ATTRS.TYPE_BUTTON,
                disabled: idx === 0 ? '' : null,
              },
              '▲'
            ),
            h(
              HTML_TAGS.BUTTON,
              {
                class: `${CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY} ${CMS_ABOUT_CLASSES.MENTION_DOWN_BTN}`,
                [DATA_ATTRS.DATA_IDX]: idx,
                type: FORM_ATTRS.TYPE_BUTTON,
                disabled: idx === items.length - 1 ? '' : null,
              },
              '▼'
            ),
            h(
              HTML_TAGS.BUTTON,
              {
                class: `${CMS_BUTTON_CLASSES.CMS_BTN_DANGER} ${CMS_ABOUT_CLASSES.MENTION_REMOVE_BTN}`,
                [DATA_ATTRS.DATA_IDX]: idx,
                type: FORM_ATTRS.TYPE_BUTTON,
              },
              '✕'
            )
          )
        ),
        h(
          HTML_TAGS.DIV,
          { class: CMS_FORM_CLASSES.CMS_FIELD_ROW },
          h(
            HTML_TAGS.DIV,
            { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
            h(HTML_TAGS.LABEL, null, 'Description'),
            h(HTML_TAGS.INPUT, {
              class: `${CMS_FORM_CLASSES.CMS_INPUT} ${CMS_ABOUT_CLASSES.MENTION_FIELD}`,
              [DATA_ATTRS.DATA_IDX]: idx,
              [DATA_ATTRS.DATA_FIELD]: 'description',
              value: item.description || '',
              placeholder: 'e.g. Site of the Day',
            })
          ),
          h(
            HTML_TAGS.DIV,
            { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
            h(HTML_TAGS.LABEL, null, 'Link URL'),
            h(HTML_TAGS.INPUT, {
              class: `${CMS_FORM_CLASSES.CMS_INPUT} ${CMS_ABOUT_CLASSES.MENTION_FIELD}`,
              [DATA_ATTRS.DATA_IDX]: idx,
              [DATA_ATTRS.DATA_FIELD]: 'link',
              value: item.link || '',
              placeholder: 'https://...',
            })
          ),
          h(
            HTML_TAGS.DIV,
            { class: `${CMS_FORM_CLASSES.CMS_FIELD_GROUP} cms-field-group--small` },
            h(HTML_TAGS.LABEL, null, 'Icon / Emoji'),
            h(HTML_TAGS.INPUT, {
              class: `${CMS_FORM_CLASSES.CMS_INPUT} ${CMS_ABOUT_CLASSES.MENTION_FIELD}`,
              [DATA_ATTRS.DATA_IDX]: idx,
              [DATA_ATTRS.DATA_FIELD]: 'icon',
              value: item.icon || '',
              placeholder: '🏆',
            })
          )
        )
      )
    ),
    h(
      HTML_TAGS.BUTTON,
      {
        id: CMS_ABOUT_IDS.ADD_MENTION,
        class: CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY,
        type: FORM_ATTRS.TYPE_BUTTON,
      },
      '+ Add Award / Mention'
    )
  )
}

/**
 * Renders about.
 * @param host — the host component
 */
export function renderAbout(host: CmsAboutEditor) {
  const picUrl = host.aboutData.profilePicture || CHAR_STRINGS.EMPTY

  return h(
    HTML_TAGS.DIV,
    { class: CMS_ABOUT_CLASSES.CMS_ABOUT_MANAGER },
    // Header
    h(
      HTML_TAGS.DIV,
      { class: `${CMS_CARD_CLASSES.CMS_CARD} cms-card--header` },
      h(
        HTML_TAGS.DIV,
        null,
        h('h2', { class: CMS_CARD_CLASSES.CMS_CARD_TITLE }, 'About Section & Gravatar Editor'),
        h(
          HTML_TAGS.P,
          { class: CMS_CARD_CLASSES.CMS_CARD_SUBTITLE },
          'Manage your bio, Gravatar profile picture, intro text, and awards/mentions.'
        )
      ),
      h(
        HTML_TAGS.DIV,
        { class: CMS_BUTTON_CLASSES.CMS_BTN_GROUP },
        h(
          HTML_TAGS.BUTTON,
          {
            id: CMS_ABOUT_IDS.SYNC_ALL,
            class: CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY,
            type: FORM_ATTRS.TYPE_BUTTON,
            disabled: host.syncingAll ? '' : null,
          },
          host.syncingAll ? 'Syncing...' : '🔄 Sync All Non-Localized (Gravatar + Awards)'
        ),
        h(
          HTML_TAGS.BUTTON,
          {
            id: CMS_ABOUT_IDS.SAVE,
            class: CMS_BUTTON_CLASSES.CMS_BTN,
            type: FORM_ATTRS.TYPE_BUTTON,
            disabled: host.saving ? '' : null,
          },
          host.saving ? 'Saving...' : '💾 Save to Firebase'
        )
      )
    ),

    // Language selector
    h(
      HTML_TAGS.DIV,
      { class: `${CMS_CARD_CLASSES.CMS_CARD} ${CMS_ABOUT_CLASSES.CMS_CARD_LANG}` },
      h(HTML_TAGS.LABEL, { class: CMS_FORM_CLASSES.CMS_LABEL }, 'Target Language:'),
      h(
        HTML_TAGS.SELECT,
        { id: CMS_ABOUT_IDS.SELECT_LANG, class: CMS_FORM_CLASSES.CMS_SELECT },
        ...host.languages.map((l) =>
          h(
            HTML_TAGS.OPTION,
            { value: l, selected: host.selectedLang === l ? '' : null },
            l.toUpperCase()
          )
        )
      )
    ),

    // Profile Picture & Gravatar
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
            'Profile Picture & Gravatar'
          ),
          h(
            HTML_TAGS.P,
            { class: CMS_CARD_CLASSES.CMS_CARD_SUBTITLE },
            'Non-localized: same URL using per-language profile.'
          )
        ),
        h(
          HTML_TAGS.BUTTON,
          {
            id: CMS_ABOUT_IDS.SYNC_PICTURE,
            class: CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY,
            type: FORM_ATTRS.TYPE_BUTTON,
            disabled: host.syncingAll ? '' : null,
          },
          '🔄 Apply Picture & Size to All Languages'
        )
      ),
      h(
        HTML_TAGS.DIV,
        { class: CMS_ABOUT_CLASSES.CMS_GRAVATAR_LAYOUT },
        h(
          HTML_TAGS.DIV,
          { class: CMS_ABOUT_CLASSES.CMS_GRAVATAR_PREVIEW },
          picUrl
            ? h('img', {
                id: CMS_ABOUT_IDS.GRAVATAR_PREVIEW,
                src: picUrl,
                alt: 'Gravatar Preview',
                class: 'cms-gravatar-img',
                loading: 'lazy',
              })
            : h(HTML_TAGS.DIV, { class: 'cms-gravatar-placeholder' }, '👤'),
          h(HTML_TAGS.SPAN, { class: 'cms-gravatar-label' }, 'Live Preview')
        ),
        h(
          HTML_TAGS.DIV,
          { class: 'cms-gravatar-controls' },
          h(
            HTML_TAGS.DIV,
            { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
            h(HTML_TAGS.LABEL, null, 'Profile Picture URL'),
            h(HTML_TAGS.INPUT, {
              id: CMS_ABOUT_IDS.PIC_INPUT,
              class: CMS_FORM_CLASSES.CMS_INPUT,
              value: picUrl,
              placeholder: 'https://www.gravatar.com/avatar/...',
            })
          ),
          h(
            HTML_TAGS.DIV,
            { class: `${CMS_FORM_CLASSES.CMS_FIELD_ROW} cms-field-row--align` },
            h(
              HTML_TAGS.DIV,
              { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
              h(HTML_TAGS.LABEL, null, 'Gravatar Image Size (px)'),
              h(HTML_TAGS.INPUT, {
                id: CMS_ABOUT_IDS.SIZE_INPUT,
                class: `${CMS_FORM_CLASSES.CMS_INPUT} cms-input--short`,
                type: TYPE_STRINGS.NUMBER,
                value: String(host.gravatarSize),
              })
            ),
            h(
              HTML_TAGS.DIV,
              { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
              h(HTML_TAGS.LABEL, null, 'Quick presets:'),
              h(
                HTML_TAGS.DIV,
                { class: CMS_ABOUT_CLASSES.CMS_PRESET_ROW },
                ...SIZE_PRESETS.map((s) =>
                  h(
                    HTML_TAGS.BUTTON,
                    {
                      class: `${CMS_BUTTON_CLASSES.CMS_BTN} ${CMS_BUTTON_CLASSES.CMS_BTN_PRESET} ${CMS_ABOUT_CLASSES.SIZE_PRESET_BTN}${s === host.gravatarSize ? ` ${CMS_BUTTON_CLASSES.CMS_BTN_ACTIVE}` : CHAR_STRINGS.EMPTY}`,
                      [DATA_ATTRS.DATA_SIZE]: s,
                      type: FORM_ATTRS.TYPE_BUTTON,
                    },
                    `${s}px`
                  )
                )
              )
            )
          ),
          h(
            HTML_TAGS.DIV,
            { class: CMS_FORM_CLASSES.CMS_FIELD_ROW },
            h(HTML_TAGS.INPUT, {
              id: CMS_ABOUT_IDS.EMAIL_INPUT,
              class: CMS_FORM_CLASSES.CMS_INPUT,
              placeholder: 'Enter email to generate Gravatar URL',
              value: host.emailInput,
            }),
            h(
              HTML_TAGS.BUTTON,
              {
                id: CMS_ABOUT_IDS.GEN_GRAVATAR,
                class: CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY,
                type: FORM_ATTRS.TYPE_BUTTON,
              },
              'Generate Gravatar URL'
            )
          ),
          h(
            HTML_TAGS.P,
            { class: CMS_FORM_CLASSES.CMS_HINT },
            'Changing size updates the ?s= query parameter on the URL in real-time. Click "Apply Picture & Size to All Languages" to sync it across all languages immediately.'
          )
        )
      )
    ),

    // Title & Intro Callout
    h(
      HTML_TAGS.DIV,
      { class: CMS_CARD_CLASSES.CMS_CARD },
      h(
        HTML_TAGS.H3,
        { class: CMS_CARD_CLASSES.CMS_SECTION_TITLE },
        `Title & Intro Callout [${host.selectedLang.toUpperCase()}]`
      ),
      h(
        HTML_TAGS.DIV,
        { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
        h(HTML_TAGS.LABEL, null, 'Section Title'),
        h(HTML_TAGS.INPUT, {
          id: CMS_ABOUT_IDS.TITLE_INPUT,
          class: CMS_FORM_CLASSES.CMS_INPUT,
          value: host.aboutData.title || '',
          placeholder: 'About me',
        })
      )
    ),

    // Bio Column 1
    h(
      HTML_TAGS.DIV,
      { class: CMS_CARD_CLASSES.CMS_CARD },
      h(
        HTML_TAGS.H3,
        { class: CMS_CARD_CLASSES.CMS_SECTION_TITLE },
        `Left Column Paragraphs [${host.selectedLang.toUpperCase()}]`
      ),
      renderParagraphList(host, 'col1')
    ),

    // Bio Column 2
    h(
      HTML_TAGS.DIV,
      { class: CMS_CARD_CLASSES.CMS_CARD },
      h(
        HTML_TAGS.H3,
        { class: CMS_CARD_CLASSES.CMS_SECTION_TITLE },
        `Right Column Paragraphs [${host.selectedLang.toUpperCase()}]`
      ),
      renderParagraphList(host, 'col2')
    ),

    // Awards & Mentions
    h(
      HTML_TAGS.DIV,
      { class: CMS_CARD_CLASSES.CMS_CARD },
      h(
        HTML_TAGS.H3,
        { class: CMS_CARD_CLASSES.CMS_SECTION_TITLE },
        'Awards & Mentions (Non-localized)'
      ),
      h(
        HTML_TAGS.DIV,
        { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
        h(HTML_TAGS.LABEL, null, 'Section Title'),
        h(HTML_TAGS.INPUT, {
          id: CMS_ABOUT_IDS.MENTIONS_TITLE,
          class: CMS_FORM_CLASSES.CMS_INPUT,
          value: host.aboutData.mentions || CHAR_STRINGS.EMPTY,
          placeholder: NAV_TEXT.SOME_MENTIONS,
        })
      ),
      renderMentionItems(host)
    )
  )
}
