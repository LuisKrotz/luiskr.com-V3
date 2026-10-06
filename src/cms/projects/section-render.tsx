/**
 * @file projects/section-render.tsx — one editable section card JSX.
 */
import { DATA_ATTRS } from '@/core/tokens/attrs/data.js'
import { FORM_ATTRS } from '@/core/tokens/attrs/form.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { h } from '@/core/jsx.js'
import type { CmsProjectsList } from './CmsProjectsList.js'
import { normalizeSection } from './sections.js'
import { gcs, type CmsSection } from './types.js'
import { COVER_DIMENSIONS } from '@/core/tokens/media/dimensions.js'
import {
  CMS_BUTTON_CLASSES,
  CMS_CARD_CLASSES,
  CMS_FORM_CLASSES,
  CMS_ITEM_CLASSES,
  CMS_PROJECTS_CLASSES,
} from '@/cms/tokens.js'

/**
 * Renders section.
 * @param host — the host component
 * @param sec — the section
 * @param sIdx — the value
 * @param total — the value
 */
export function renderSection(host: CmsProjectsList, sec: CmsSection, sIdx: number, total: number) {
  const [texts, media] = normalizeSection(sec)

  return h(
    HTML_TAGS.DIV,
    {
      class: `${CMS_CARD_CLASSES.CMS_CARD} ${CMS_PROJECTS_CLASSES.CMS_SECTION_CARD}`,
      key: `sec-${sIdx}`,
    },
    // Section header
    h(
      HTML_TAGS.DIV,
      { class: CMS_CARD_CLASSES.CMS_SECTION_HEADER },
      h(HTML_TAGS.SPAN, { class: CMS_CARD_CLASSES.CMS_SECTION_TITLE }, `Section #${sIdx + 1}`),
      h(
        HTML_TAGS.DIV,
        { class: CMS_ITEM_CLASSES.CMS_ITEM_CONTROLS },
        h(
          HTML_TAGS.BUTTON,
          {
            class: `${CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY} ${CMS_PROJECTS_CLASSES.SEC_UP}`,
            [DATA_ATTRS.DATA_IDX]: sIdx,
            type: FORM_ATTRS.TYPE_BUTTON,
            disabled: sIdx === 0,
          },
          '▲'
        ),
        h(
          HTML_TAGS.BUTTON,
          {
            class: `${CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY} ${CMS_PROJECTS_CLASSES.SEC_DOWN}`,
            [DATA_ATTRS.DATA_IDX]: sIdx,
            type: FORM_ATTRS.TYPE_BUTTON,
            disabled: sIdx === total - 1,
          },
          '▼'
        ),
        h(
          HTML_TAGS.BUTTON,
          {
            class: `${CMS_BUTTON_CLASSES.CMS_BTN_DANGER} ${CMS_PROJECTS_CLASSES.SEC_DEL}`,
            [DATA_ATTRS.DATA_IDX]: sIdx,
            type: FORM_ATTRS.TYPE_BUTTON,
          },
          '✕ Remove'
        )
      )
    ),

    // Text paragraphs
    h(
      HTML_TAGS.DIV,
      { class: CMS_FORM_CLASSES.CMS_SUBSECTION },
      h(HTML_TAGS.SPAN, { class: CMS_FORM_CLASSES.CMS_SUBSECTION_TITLE }, 'Text Paragraphs'),
      ...texts.map((t, tIdx) =>
        h(
          HTML_TAGS.DIV,
          { class: CMS_ITEM_CLASSES.CMS_PARA_ITEM, key: `t-${sIdx}-${tIdx}` },
          h(HTML_TAGS.TEXTAREA, {
            class: `${CMS_FORM_CLASSES.CMS_TEXTAREA} ${CMS_PROJECTS_CLASSES.SEC_TEXT_INPUT}`,
            [DATA_ATTRS.DATA_SEC]: sIdx,
            [DATA_ATTRS.DATA_TIDX]: tIdx,
            rows: '3',
            innerHTML: t,
          }),
          h(
            HTML_TAGS.BUTTON,
            {
              class: `${CMS_BUTTON_CLASSES.CMS_BTN_DANGER} ${CMS_PROJECTS_CLASSES.SEC_TEXT_DEL}`,
              [DATA_ATTRS.DATA_SEC]: sIdx,
              [DATA_ATTRS.DATA_TIDX]: tIdx,
              type: FORM_ATTRS.TYPE_BUTTON,
            },
            '✕'
          )
        )
      ),
      h(
        HTML_TAGS.BUTTON,
        {
          class: `${CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY} ${CMS_PROJECTS_CLASSES.SEC_ADD_TEXT}`,
          [DATA_ATTRS.DATA_SEC]: sIdx,
          type: FORM_ATTRS.TYPE_BUTTON,
        },
        '+ Add Paragraph'
      )
    ),

    // Media items
    h(
      HTML_TAGS.DIV,
      { class: CMS_FORM_CLASSES.CMS_SUBSECTION },
      h(HTML_TAGS.SPAN, { class: CMS_FORM_CLASSES.CMS_SUBSECTION_TITLE }, 'Media Items'),
      ...media.map((m, mIdx) =>
        h(
          HTML_TAGS.DIV,
          { class: CMS_PROJECTS_CLASSES.CMS_MEDIA_ITEM, key: `m-${sIdx}-${mIdx}` },
          m.src
            ? h('img', {
                src: gcs(`${host.currentProject?.folder || ''}${m.src}`, m.isVideo),
                class: CMS_PROJECTS_CLASSES.CMS_MEDIA_THUMB,
                alt: 'thumb',
                loading: 'lazy',
              })
            : h(HTML_TAGS.DIV, { class: CMS_ITEM_CLASSES.CMS_MEDIA_THUMB_PLACEHOLDER }, '📷'),
          h(
            HTML_TAGS.DIV,
            { class: CMS_PROJECTS_CLASSES.CMS_MEDIA_FIELDS },
            h(
              HTML_TAGS.DIV,
              { class: CMS_FORM_CLASSES.CMS_FIELD_ROW },
              h(
                HTML_TAGS.DIV,
                { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
                h(HTML_TAGS.LABEL, null, 'Filename (no ext)'),
                h(HTML_TAGS.INPUT, {
                  class: `${CMS_FORM_CLASSES.CMS_INPUT} ${CMS_PROJECTS_CLASSES.MEDIA_SRC}`,
                  [DATA_ATTRS.DATA_SEC]: sIdx,
                  [DATA_ATTRS.DATA_MIDX]: mIdx,
                  value: m.src || '',
                  placeholder: 'image-name',
                })
              ),
              h(
                HTML_TAGS.DIV,
                { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
                h(HTML_TAGS.LABEL, null, 'Label / Alt'),
                h(HTML_TAGS.INPUT, {
                  class: `${CMS_FORM_CLASSES.CMS_INPUT} ${CMS_PROJECTS_CLASSES.MEDIA_LABEL}`,
                  [DATA_ATTRS.DATA_SEC]: sIdx,
                  [DATA_ATTRS.DATA_MIDX]: mIdx,
                  value: m.label || '',
                  placeholder: 'Description',
                })
              ),
              h(
                HTML_TAGS.DIV,
                {
                  class: `${CMS_FORM_CLASSES.CMS_FIELD_GROUP} ${CMS_PROJECTS_CLASSES.CMS_FIELD_GROUP_SMALL}`,
                },
                h(HTML_TAGS.LABEL, null, 'Type'),
                h(
                  HTML_TAGS.SELECT,
                  {
                    class: `cms-select ${CMS_PROJECTS_CLASSES.MEDIA_TYPE}`,
                    [DATA_ATTRS.DATA_SEC]: sIdx,
                    [DATA_ATTRS.DATA_MIDX]: mIdx,
                  },
                  h(
                    HTML_TAGS.OPTION,
                    { value: STATE_STRINGS.FALSE, selected: !m.isVideo ? '' : null },
                    'Image'
                  ),
                  h(
                    HTML_TAGS.OPTION,
                    { value: STATE_STRINGS.TRUE, selected: m.isVideo ? '' : null },
                    'Video'
                  )
                )
              )
            ),
            h(
              HTML_TAGS.DIV,
              { class: CMS_FORM_CLASSES.CMS_FIELD_ROW },
              h(
                HTML_TAGS.DIV,
                {
                  class: `${CMS_FORM_CLASSES.CMS_FIELD_GROUP} ${CMS_PROJECTS_CLASSES.CMS_FIELD_GROUP_SMALL}`,
                },
                h(HTML_TAGS.LABEL, null, 'Width'),
                h(HTML_TAGS.INPUT, {
                  class: `${CMS_FORM_CLASSES.CMS_INPUT} ${CMS_PROJECTS_CLASSES.MEDIA_W}`,
                  [DATA_ATTRS.DATA_SEC]: sIdx,
                  [DATA_ATTRS.DATA_MIDX]: mIdx,
                  value: String((m.size && m.size[0]) || COVER_DIMENSIONS.FHD_WIDTH),
                })
              ),
              h(
                HTML_TAGS.DIV,
                {
                  class: `${CMS_FORM_CLASSES.CMS_FIELD_GROUP} ${CMS_PROJECTS_CLASSES.CMS_FIELD_GROUP_SMALL}`,
                },
                h(HTML_TAGS.LABEL, null, 'Height'),
                h(HTML_TAGS.INPUT, {
                  class: `${CMS_FORM_CLASSES.CMS_INPUT} ${CMS_PROJECTS_CLASSES.MEDIA_H}`,
                  [DATA_ATTRS.DATA_SEC]: sIdx,
                  [DATA_ATTRS.DATA_MIDX]: mIdx,
                  value: String((m.size && m.size[1]) || COVER_DIMENSIONS.FHD_HEIGHT),
                })
              ),
              h(
                HTML_TAGS.BUTTON,
                {
                  class: `${CMS_BUTTON_CLASSES.CMS_BTN_DANGER} ${CMS_PROJECTS_CLASSES.MEDIA_DEL}`,
                  [DATA_ATTRS.DATA_SEC]: sIdx,
                  [DATA_ATTRS.DATA_MIDX]: mIdx,
                  type: FORM_ATTRS.TYPE_BUTTON,
                },
                '✕ Remove'
              )
            )
          )
        )
      ),
      h(
        HTML_TAGS.BUTTON,
        {
          class: `${CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY} ${CMS_PROJECTS_CLASSES.SEC_ADD_MEDIA}`,
          [DATA_ATTRS.DATA_SEC]: sIdx,
          type: FORM_ATTRS.TYPE_BUTTON,
        },
        '+ Add Media Item'
      )
    )
  )
}
