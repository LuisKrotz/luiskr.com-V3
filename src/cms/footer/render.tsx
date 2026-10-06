/**
 * @file cms/footer/render.tsx — JSX for the footer editor: header +
 * language picker, then the three section cards (contact footer, legal
 * links, case-study footer) each hosting a channel list.
 */

import { CMS_LIST_PREFIXES } from '@/cms/tokens.js'
import { FORM_ATTRS } from '@/core/tokens/attrs/form.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { NAV_TEXT } from '@/core/tokens/strings/text.js'
import { h } from '@/core/jsx.js'
import type { CmsFooterEditor } from './CmsFooterEditor.js'
import { CMS_BUTTON_CLASSES, CMS_CARD_CLASSES, CMS_FORM_CLASSES } from '@/cms/tokens.js'

/** Section card shell: numbered title + subtitle + optional header action. */
const sectionCard = (title: string, subtitle: string, action: unknown, ...children: unknown[]) =>
  h(
    HTML_TAGS.DIV,
    { class: CMS_CARD_CLASSES.CMS_CARD },
    h(
      HTML_TAGS.DIV,
      { class: CMS_CARD_CLASSES.CMS_SECTION_HEADER },
      h(
        HTML_TAGS.DIV,
        null,
        h(HTML_TAGS.H3, { class: CMS_CARD_CLASSES.CMS_SECTION_TITLE }, title),
        h(HTML_TAGS.P, { class: CMS_CARD_CLASSES.CMS_CARD_SUBTITLE }, subtitle)
      ),
      action
    ),
    ...children
  )

/** Titled subsection wrapping one channel list. */
const listSection = (
  host: CmsFooterEditor,
  title: string,
  arr: unknown[],
  prefix: string,
  addLabel: string,
  labelField?: string
) =>
  h(
    HTML_TAGS.DIV,
    { class: CMS_FORM_CLASSES.CMS_SUBSECTION },
    h(
      HTML_TAGS.DIV,
      { class: CMS_FORM_CLASSES.CMS_SUBSECTION_HEADER },
      h(HTML_TAGS.SPAN, { class: CMS_FORM_CLASSES.CMS_SUBSECTION_TITLE }, title)
    ),
    host._renderChannelList(arr as never, prefix, addLabel, labelField as string)
  )

/** JSX template. */
export function renderFooterEditor(host: CmsFooterEditor) {
  return h(
    HTML_TAGS.DIV,
    { class: 'cms-footer-manager' },

    // ── Header ────────────────────────────────────────────────────────────
    h(
      HTML_TAGS.DIV,
      { class: `${CMS_CARD_CLASSES.CMS_CARD} cms-card--header` },
      h(
        HTML_TAGS.DIV,
        null,
        h(HTML_TAGS.H2, { class: CMS_CARD_CLASSES.CMS_CARD_TITLE }, 'Footers & Contact Manager'),
        h(
          HTML_TAGS.P,
          { class: CMS_CARD_CLASSES.CMS_CARD_SUBTITLE },
          'Manage footer links, legal navigation, contact info, and project disclaimer notes.'
        )
      ),
      h(
        HTML_TAGS.BUTTON,
        {
          id: 'btn-save-footer',
          class: CMS_BUTTON_CLASSES.CMS_BTN,
          type: FORM_ATTRS.TYPE_BUTTON,
          disabled: host.saving,
        },
        host.saving ? 'Saving...' : '💾 Save Footers to Firebase'
      )
    ),

    // ── Language ──────────────────────────────────────────────────────────
    h(
      HTML_TAGS.DIV,
      { class: `${CMS_CARD_CLASSES.CMS_CARD} cms-card--lang` },
      h(HTML_TAGS.LABEL, { class: CMS_FORM_CLASSES.CMS_LABEL }, 'Target Language:'),
      h(
        HTML_TAGS.SELECT,
        { id: 'select-footer-lang', class: CMS_FORM_CLASSES.CMS_SELECT },
        ...host.languages.map((l) =>
          h(
            HTML_TAGS.OPTION,
            { value: l, selected: host.selectedLang === l ? '' : null },
            l.toUpperCase()
          )
        )
      )
    ),

    // ── Section 1: Main Contact Footer ────────────────────────────────────
    sectionCard(
      '1. Main Contact Footer (Homepage)',
      'Corresponds to components/contact. Display social channels & contact links.',
      h(
        HTML_TAGS.BUTTON,
        {
          id: 'btn-sync-line1',
          class: CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY,
          type: FORM_ATTRS.TYPE_BUTTON,
          disabled: host.syncing,
        },
        '🔄 Sync Channels (Line 1) to All Languages'
      ),
      h(
        HTML_TAGS.DIV,
        { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
        h(HTML_TAGS.LABEL, null, 'Contact Title'),
        h(HTML_TAGS.INPUT, {
          id: 'contact-title-input',
          class: CMS_FORM_CLASSES.CMS_INPUT,
          value: host.contactData.title || CHAR_STRINGS.EMPTY,
          placeholder: NAV_TEXT.CONTACT,
        })
      ),
      listSection(
        host,
        `Line 1: Contact & Social Channels (${host.contactData.line1.length})`,
        host.contactData.line1,
        CMS_LIST_PREFIXES.LINE1,
        'Channel'
      ),
      listSection(
        host,
        `Line 2: Sub Links (${host.contactData.line2.length})`,
        host.contactData.line2,
        CMS_LIST_PREFIXES.LINE2,
        'Sub-link'
      )
    ),

    // ── Section 2: Legal Footer Navigation ───────────────────────────────
    sectionCard(
      '2. Legal Footer Navigation Links',
      'Corresponds to components/legal-footer. Displayed at the bottom of the awards section and legal pages.',
      h(
        HTML_TAGS.BUTTON,
        {
          class: `${CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY} legal-add`,
          type: FORM_ATTRS.TYPE_BUTTON,
        },
        '+ Add Navigation Link'
      ),
      host._renderChannelList(host.legalLinks, CMS_LIST_PREFIXES.LEGAL, 'Navigation Link', 'page')
    ),

    // ── Section 3: Case Study Footer ──────────────────────────────────────
    sectionCard(
      '3. Project Case Study Footer & Disclaimer',
      'Corresponds to components/related shown at the bottom of each project (case study) detail page.',
      h(
        HTML_TAGS.BUTTON,
        {
          id: 'btn-sync-socials',
          class: CMS_BUTTON_CLASSES.CMS_BTN_SECONDARY,
          type: FORM_ATTRS.TYPE_BUTTON,
          disabled: host.syncing,
        },
        '🔄 Sync Socials to All Languages'
      ),
      h(
        HTML_TAGS.DIV,
        { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
        h(HTML_TAGS.LABEL, null, 'Footer Title'),
        h(HTML_TAGS.INPUT, {
          id: 'related-title-input',
          class: CMS_FORM_CLASSES.CMS_INPUT,
          value: host.relatedFooter.title || CHAR_STRINGS.EMPTY,
          placeholder: NAV_TEXT.RELATED,
        })
      ),
      h(
        HTML_TAGS.DIV,
        { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
        h(HTML_TAGS.LABEL, null, 'Project Media Disclaimer Note (HTML allowed)'),
        h(HTML_TAGS.TEXTAREA, {
          id: 'disclaimer-textarea',
          class: CMS_FORM_CLASSES.CMS_TEXTAREA,
          rows: '4',
          innerHTML: host.relatedFooter.note || CHAR_STRINGS.EMPTY,
        })
      ),
      listSection(
        host,
        `Case Study Footer Socials (${host.relatedFooter.socials.length})`,
        host.relatedFooter.socials,
        CMS_LIST_PREFIXES.SOCIAL,
        'Social Link',
        'network'
      )
    )
  )
}
