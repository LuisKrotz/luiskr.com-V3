/**
 * @file CmsLangEditor.js
 * @description <cms-lang-editor> — raw JSON dictionary editor: any
 * translations node listed in CMS_LANG_NODES (APP, components, pages,
 * slugs…) editable as formatted JSON per locale. The escape hatch for
 * content the structured editors don't cover — parse errors block the
 * save so malformed JSON never reaches the site.
 */

import { FORM_ATTRS } from '@/core/tokens/attrs/form.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { FORM_EVENTS, MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import { LOCALES } from '@/core/tokens/locales.js'
import { DB_PATHS } from '@/core/tokens/routes/paths.js'
import { CMS_TAGS, CMS_EVENTS, CMS_LANG_NODES } from '@/cms/tokens.js'
import { BaseComponent } from '@/core/Component.js'
import { getDbInstance } from '@/firebase.js'
import { ref, child, get, set } from 'firebase/database'
import { h } from '@/core/jsx.js'
import { VALID_LANGS } from '@/core/i18n.js'
import cmsStyles from '@/cms/sass/cms.scss?inline'
import { CMS_BUTTON_CLASSES, CMS_CARD_CLASSES, CMS_FORM_CLASSES } from '@/cms/tokens.js'

/**
 * The CmsLangEditor — lang editor class.
 */
export class CmsLangEditor extends BaseComponent {
  languages: readonly string[] = VALID_LANGS // all editable locales
  selectedLang: string = LOCALES.EN // locale under edit
  selectedNode: string = CMS_LANG_NODES[0] // translations node under edit
  jsonContent = '' // pretty-printed node JSON bound to the textarea
  saving = false // Firebase write in flight

  constructor() {
    super(cmsStyles)
  }

  /** Lifecycle: loads language data. */

  override onMounted() {
    this.loadData()
  }

  /** Reads the language nodes for all locales. */

  async loadData(): Promise<void> {
    try {
      const db = await getDbInstance()
      const snap = await get(
        child(ref(db), `${DB_PATHS.TRANSLATIONS}${this.selectedLang}/${this.selectedNode}`)
      )
      if (snap.exists()) {
        this.jsonContent = JSON.stringify(snap.val(), null, 2)
      } else {
        this.jsonContent = '{}'
      }
      this._updateDom()
      this._bindEvents()
    } catch (err) {
      console.error('Error loading language dictionary:', err)
    }
  }

  /**
   * Writes the edited JSON back — parse failure aborts before the write
   * (an invalid blob would crash every consumer of that node), so the
   * editor surfaces the syntax error and keeps the stored copy intact.
   */
  async saveData(): Promise<void> {
    try {
      const parsed = JSON.parse(this.jsonContent)
      this.saving = true
      this._updateDom()
      const db = await getDbInstance()
      await set(
        ref(db, `${DB_PATHS.TRANSLATIONS}${this.selectedLang}/${this.selectedNode}`),
        parsed
      )
      this.dispatchEvent(
        new CustomEvent(CMS_EVENTS.NOTIFY, {
          bubbles: true,
          composed: true,
          detail: `Dictionary for [${this.selectedLang.toUpperCase()}] ${this.selectedNode} saved!`,
        })
      )
    } catch (err) {
      alert('Invalid JSON: ' + (err as Error).message)
    } finally {
      this.saving = false
      this._updateDom()
      this._bindEvents()
    }
  }

  /** Wires inputs + save button. */

  private _bindEvents(): void {
    const saveBtn = this.$('#btn-save-lang')
    if (saveBtn) this.addScopedListener(saveBtn, MOUSE_EVENTS.CLICK, () => this.saveData())

    const langSel = this.$('#select-dict-lang')
    if (langSel) {
      this.addScopedListener(langSel, FORM_EVENTS.CHANGE, (e) => {
        this.selectedLang = (e.target as HTMLSelectElement).value
        this.loadData()
      })
    }

    const nodeSel = this.$('#select-dict-node')
    if (nodeSel) {
      this.addScopedListener(nodeSel, FORM_EVENTS.CHANGE, (e) => {
        this.selectedNode = (e.target as HTMLSelectElement).value
        this.loadData()
      })
    }

    const textarea = this.$('#json-editor')
    if (textarea) {
      this.addScopedListener(textarea, FORM_EVENTS.INPUT, (e) => {
        this.jsonContent = (e.target as HTMLTextAreaElement).value
      })
    }
  }

  /** JSX template. */

  override render() {
    return h(
      HTML_TAGS.DIV,
      { class: 'cms-lang-manager' },
      h(
        HTML_TAGS.DIV,
        { class: `${CMS_CARD_CLASSES.CMS_CARD} cms-card--header` },
        h(
          HTML_TAGS.DIV,
          null,
          h('h2', { class: CMS_CARD_CLASSES.CMS_CARD_TITLE }, 'Language Dictionary & Strings'),
          h(
            HTML_TAGS.P,
            { class: CMS_CARD_CLASSES.CMS_CARD_SUBTITLE },
            'Directly edit JSON translation keys for UI strings and navigation.'
          )
        ),
        h(
          HTML_TAGS.BUTTON,
          {
            class: CMS_BUTTON_CLASSES.CMS_BTN,
            id: 'btn-save-lang',
            type: FORM_ATTRS.TYPE_BUTTON,
            disabled: this.saving,
          },
          this.saving ? 'Saving...' : '💾 Save to Firebase'
        )
      ),

      h(
        HTML_TAGS.DIV,
        { class: `${CMS_CARD_CLASSES.CMS_CARD} cms-card--lang` },
        h(HTML_TAGS.LABEL, { class: CMS_FORM_CLASSES.CMS_LABEL }, 'Target Language:'),
        h(
          HTML_TAGS.SELECT,
          { id: 'select-dict-lang', class: `${CMS_FORM_CLASSES.CMS_SELECT} cms-select--narrow` },
          ...this.languages.map((l) =>
            h(
              HTML_TAGS.OPTION,
              { value: l, selected: this.selectedLang === l ? '' : null },
              l.toUpperCase()
            )
          )
        ),
        h(HTML_TAGS.LABEL, { class: CMS_FORM_CLASSES.CMS_LABEL }, 'Node:'),
        h(
          HTML_TAGS.SELECT,
          { id: 'select-dict-node', class: `${CMS_FORM_CLASSES.CMS_SELECT} cms-select--wide` },
          ...CMS_LANG_NODES.map((n) =>
            h(HTML_TAGS.OPTION, { value: n, selected: this.selectedNode === n ? '' : null }, n)
          )
        )
      ),

      h(
        HTML_TAGS.DIV,
        { class: CMS_CARD_CLASSES.CMS_CARD },
        h(
          HTML_TAGS.DIV,
          { class: CMS_FORM_CLASSES.CMS_FIELD_GROUP },
          h(HTML_TAGS.LABEL, null, `JSON Content (${this.selectedNode})`),
          h(HTML_TAGS.TEXTAREA, {
            id: 'json-editor',
            class: `${CMS_FORM_CLASSES.CMS_TEXTAREA} cms-json-editor`,
            innerHTML: this.jsonContent,
          })
        )
      )
    )
  }
}

if (!customElements.get(CMS_TAGS.CMS_LANG_EDITOR)) {
  customElements.define(CMS_TAGS.CMS_LANG_EDITOR, CmsLangEditor)
}
