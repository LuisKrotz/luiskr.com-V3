/**
 * @file projects/render.tsx — projects editor JSX template.
 */
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { CMS_PROJECTS_IDS } from '@cms/tokens.js'
import { h } from '@core/jsx.js'
import type { CmsProjectsList } from './CmsProjectsList.js'
import { renderSection } from './section-render.js'
import { gcs } from './types.js'
import { COVER_DIMENSIONS } from '@core/tokens/media/dimensions.js'
import {
  CMS_BUTTON_CLASSES,
  CMS_CARD_CLASSES,
  CMS_FORM_CLASSES,
  CMS_ITEM_CLASSES,
  CMS_PROJECTS_CLASSES,
} from '@cms/tokens.js'

/**
 * Renders projects.
 * @param host — the host component
 */
export function renderProjects(host: CmsProjectsList) {
  const p = host.currentProject

  const root = h(
    HTML_TAGS.DIV,
    { class: CMS_PROJECTS_CLASSES.CMS_PROJECTS_MANAGER },
    // ── Header ──────────────────────────────────────────────────────────────
    h(
      HTML_TAGS.DIV,
      { class: `${CMS_CARD_CLASSES.CMS_CARD} ${CMS_PROJECTS_CLASSES.CMS_CARD_HEADER}` },
      h(
        HTML_TAGS.DIV,
        null,
        h('h2', { class: CMS_CARD_CLASSES.CMS_CARD_TITLE }, 'Project Case Studies Manager'),
        h(
          HTML_TAGS.P,
          { class: CMS_CARD_CLASSES.CMS_CARD_SUBTITLE },
          'Manage sections, text paragraphs, and image/video carousels for all project case studies.'
        )
      ),
      h(
        HTML_TAGS.DIV,
        { class: CMS_BUTTON_CLASSES.CMS_BTN_GROUP },
        h(
          HTML_TAGS.BUTTON,
          {
            id: CMS_PROJECTS_IDS.BTN_CREATE,
            class: CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY,
            type: FORM_ATTRS.TYPE_BUTTON,
          },
          '+ Create New Project'
        ),
        h(
          HTML_TAGS.BUTTON,
          {
            id: CMS_PROJECTS_IDS.BTN_DELETE,
            class: CMS_BUTTON_CLASSES.CMS_BTN_DANGER,
            type: FORM_ATTRS.TYPE_BUTTON,
            disabled: !host.selectedProjectKey,
          },
          '🗑️ Delete Project'
        ),
        h(
          HTML_TAGS.BUTTON,
          {
            id: CMS_PROJECTS_IDS.BTN_SAVE,
            class: CMS_BUTTON_CLASSES.CMS_BTN,
            type: FORM_ATTRS.TYPE_BUTTON,
            disabled: host.saving || !p,
          },
          host.saving ? 'Saving...' : '💾 Save Project to Firebase'
        )
      )
    ),

    // ── Selectors ────────────────────────────────────────────────────────────
    h(
      HTML_TAGS.DIV,
      { class: CMS_CARD_CLASSES.CMS_CARD },
      h(
        HTML_TAGS.DIV,
        { class: CMS_FORM_CLASSES.CMS_FIELD_ROW },
        h(
          HTML_TAGS.DIV,
          { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
          h(HTML_TAGS.LABEL, null, 'Target Language'),
          h(
            HTML_TAGS.SELECT,
            { id: CMS_PROJECTS_IDS.SELECT_LANG, class: CMS_FORM_CLASSES.CMS_SELECT },
            ...host.languages.map((l) =>
              h(
                HTML_TAGS.OPTION,
                { value: l, selected: host.selectedLang === l ? '' : null },
                l.toUpperCase()
              )
            )
          )
        ),
        h(
          HTML_TAGS.DIV,
          { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
          h(HTML_TAGS.LABEL, null, `Select Project (${host.projectKeys.length} total)`),
          h(
            HTML_TAGS.SELECT,
            { id: CMS_PROJECTS_IDS.SELECT_KEY, class: CMS_FORM_CLASSES.CMS_SELECT },
            ...host.projectKeys.map((pk) =>
              h(
                HTML_TAGS.OPTION,
                { value: pk, selected: host.selectedProjectKey === pk ? '' : null },
                pk.toUpperCase()
              )
            )
          )
        )
      )
    ),

    // ── Project Editor ───────────────────────────────────────────────────────
    p
      ? h(
          HTML_TAGS.DIV,
          null,
          // Basic fields
          h(
            HTML_TAGS.DIV,
            { class: CMS_CARD_CLASSES.CMS_CARD },
            h(
              HTML_TAGS.H3,
              { class: CMS_CARD_CLASSES.CMS_SECTION_TITLE },
              `Editing: [${host.selectedProjectKey.toUpperCase()}] — ${host.selectedLang.toUpperCase()}`
            ),
            h(
              HTML_TAGS.DIV,
              { class: CMS_FORM_CLASSES.CMS_FIELD_ROW },
              h(
                HTML_TAGS.DIV,
                { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
                h(HTML_TAGS.LABEL, null, 'Project Title'),
                h(HTML_TAGS.INPUT, {
                  id: CMS_PROJECTS_IDS.PROJ_TITLE,
                  class: CMS_FORM_CLASSES.CMS_INPUT,
                  value: p.title || '',
                  placeholder: 'METCHA',
                })
              ),
              h(
                HTML_TAGS.DIV,
                { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
                h(HTML_TAGS.LABEL, null, 'Assets Folder'),
                h(HTML_TAGS.INPUT, {
                  id: CMS_PROJECTS_IDS.PROJ_FOLDER,
                  class: CMS_FORM_CLASSES.CMS_INPUT,
                  value: p.folder || '',
                  placeholder: 'metcha/',
                })
              ),
              h(
                HTML_TAGS.DIV,
                {
                  class: `${CMS_FORM_CLASSES.CMS_FIELD_GROUP} ${CMS_PROJECTS_CLASSES.CMS_FIELD_GROUP_SMALL}`,
                },
                h(HTML_TAGS.LABEL, null, 'SEO'),
                h(
                  HTML_TAGS.LABEL,
                  { class: CMS_PROJECTS_CLASSES.CMS_CHECKBOX_LABEL },
                  h(HTML_TAGS.INPUT, {
                    id: CMS_PROJECTS_IDS.PROJ_NOINDEX,
                    type: FORM_ATTRS.CHECKBOX,
                    checked: p.seo?.noIndex ? '' : null,
                  }),
                  ' noIndex'
                )
              )
            )
          ),

          // Cover
          h(
            HTML_TAGS.DIV,
            { class: CMS_CARD_CLASSES.CMS_CARD },
            h(HTML_TAGS.H3, { class: CMS_CARD_CLASSES.CMS_SECTION_TITLE }, 'Cover Image / Video'),
            h(
              HTML_TAGS.DIV,
              { class: CMS_PROJECTS_CLASSES.CMS_COVER_LAYOUT },
              p.cover?.src
                ? h('img', {
                    src: gcs(`${p.folder || ''}${p.cover.src}`, p.cover?.isVideo),
                    class: CMS_PROJECTS_CLASSES.CMS_COVER_THUMB,
                    alt: 'cover',
                    loading: 'lazy',
                  })
                : h(HTML_TAGS.DIV, { class: CMS_ITEM_CLASSES.CMS_MEDIA_THUMB_PLACEHOLDER }, '🖼️'),
              h(
                HTML_TAGS.DIV,
                { class: CMS_PROJECTS_CLASSES.CMS_COVER_FIELDS },
                h(
                  HTML_TAGS.DIV,
                  { class: CMS_FORM_CLASSES.CMS_FIELD_ROW },
                  h(
                    HTML_TAGS.DIV,
                    { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
                    h(HTML_TAGS.LABEL, null, 'Filename (no ext)'),
                    h(HTML_TAGS.INPUT, {
                      id: CMS_PROJECTS_IDS.COVER_SRC,
                      class: CMS_FORM_CLASSES.CMS_INPUT,
                      value: p.cover?.src || 'cover',
                      placeholder: 'cover',
                    })
                  ),
                  h(
                    HTML_TAGS.DIV,
                    { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
                    h(HTML_TAGS.LABEL, null, 'Label / Alt'),
                    h(HTML_TAGS.INPUT, {
                      id: CMS_PROJECTS_IDS.COVER_LABEL,
                      class: CMS_FORM_CLASSES.CMS_INPUT,
                      value: p.cover?.label || '',
                      placeholder: 'Cover image label',
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
                      { id: CMS_PROJECTS_IDS.COVER_ISVIDEO, class: CMS_FORM_CLASSES.CMS_SELECT },
                      h(
                        HTML_TAGS.OPTION,
                        { value: STATE_STRINGS.FALSE, selected: !p.cover?.isVideo ? '' : null },
                        'Image'
                      ),
                      h(
                        HTML_TAGS.OPTION,
                        { value: STATE_STRINGS.TRUE, selected: p.cover?.isVideo ? '' : null },
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
                      id: CMS_PROJECTS_IDS.COVER_W,
                      class: CMS_FORM_CLASSES.CMS_INPUT,
                      value: String(
                        (p.cover?.size && p.cover.size[0]) || COVER_DIMENSIONS.FHD_WIDTH
                      ),
                    })
                  ),
                  h(
                    HTML_TAGS.DIV,
                    {
                      class: `${CMS_FORM_CLASSES.CMS_FIELD_GROUP} ${CMS_PROJECTS_CLASSES.CMS_FIELD_GROUP_SMALL}`,
                    },
                    h(HTML_TAGS.LABEL, null, 'Height'),
                    h(HTML_TAGS.INPUT, {
                      id: CMS_PROJECTS_IDS.COVER_H,
                      class: CMS_FORM_CLASSES.CMS_INPUT,
                      value: String((p.cover?.size && p.cover.size[1]) || 798),
                    })
                  )
                )
              )
            )
          ),

          // Sections
          h(
            HTML_TAGS.DIV,
            { class: CMS_CARD_CLASSES.CMS_CARD },
            h(
              HTML_TAGS.DIV,
              { class: CMS_CARD_CLASSES.CMS_SECTION_HEADER },
              h(
                HTML_TAGS.H3,
                { class: CMS_CARD_CLASSES.CMS_SECTION_TITLE },
                `Sections & Paragraphs (${(p.sections || []).length})`
              ),
              h(
                HTML_TAGS.BUTTON,
                {
                  id: CMS_PROJECTS_IDS.BTN_ADD_SECTION,
                  class: CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY,
                  type: FORM_ATTRS.TYPE_BUTTON,
                },
                '+ Add Section'
              )
            ),
            h(
              HTML_TAGS.DIV,
              { class: CMS_PROJECTS_CLASSES.CMS_SECTIONS_LIST },
              ...(p.sections || []).map((sec, sIdx) =>
                renderSection(host, sec, sIdx, p.sections.length)
              )
            )
          )
        )
      : null
  )
  return root
}
