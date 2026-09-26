import { CMS_CLASSES, CMS_TAGS, CMS_EVENTS } from "../../core/cms/tokens.js"
import { BaseComponent } from '../../core/Component.js'
import { getDbInstance } from '../../firebase.js'
import { ref, child, get, set } from 'firebase/database'
import { LOCALES, PATHS } from '../../core/constants.js'
import { VALID_LANGS } from '../../core/i18n.js'
import cmsStyles from '../../sass/views/cms.scss?inline'

export class CmsLangEditor extends BaseComponent {
  constructor() {
    super(cmsStyles)
    this.languages = VALID_LANGS
    this.selectedLang = LOCALES.EN
    this.jsonContent = ''
    this.saving = false
  }

  onMounted() {
    this.loadData()
  }

  async loadData() {
    try {
      const db = await getDbInstance()
      const snap = await get(child(ref(db), `${PATHS.TRANSLATIONS}${this.selectedLang}/APP`))
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

  async saveData() {
    try {
      const parsed = JSON.parse(this.jsonContent)
      this.saving = true
      this._updateDom()
      const db = await getDbInstance()
      await set(ref(db, `${PATHS.TRANSLATIONS}${this.selectedLang}/APP`), parsed)
      this.dispatchEvent(
        new CustomEvent(CMS_EVENTS.NOTIFY, {
          bubbles: true,
          composed: true,
          detail: `Dictionary for [${this.selectedLang.toUpperCase()}] saved!`,
        })
      )
    } catch (err) {
      alert('Invalid JSON: ' + (err.message || err))
    } finally {
      this.saving = false
      this._updateDom()
      this._bindEvents()
    }
  }

  _bindEvents() {
    const saveBtn = this.$('#btn-save-lang')
    if (saveBtn) this.addScopedListener(saveBtn, EVENTS.CLICK, () => this.saveData())

    const langSel = this.$('#select-dict-lang')
    if (langSel) {
      this.addScopedListener(langSel, EVENTS.CHANGE, (e) => {
        this.selectedLang = e.target.value
        this.loadData()
      })
    }

    const textarea = this.$('#json-editor')
    if (textarea) {
      this.addScopedListener(textarea, EVENTS.INPUT, (e) => {
        this.jsonContent = e.target.value
      })
    }
  }

  render() {
    return `
      <div class="cms-lang-manager">
        <div class="cms-card" style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;">
          <div>
            <h2 class="cms-card-title">Language Dictionary & Strings</h2>
            <p style="color:#8892b0; font-size:0.88rem;">Directly edit JSON translation keys for UI strings and navigation.</p>
          </div>
          <button class="cms-btn" id="btn-save-lang" ${this.saving ? 'disabled' : ''} type="button">
            ${this.saving ? 'Saving...' : '💾 Save to Firebase'}
          </button>
        </div>

        <div class="cms-card" style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
          <label style="color:#8892b0; font-weight:500;">Target Language:</label>
          <select id="select-dict-lang" class="cms-select" style="max-width:220px;">
            ${this.languages.map((l) => `<option value="${l}" ${this.selectedLang === l ? 'selected' : ''}>${l.toUpperCase()}</option>`).join('')}
          </select>
        </div>

        <div class="cms-card">
          <div class="cms-field-group">
            <label>JSON Content (APP)</label>
            <textarea id="json-editor" class="cms-textarea" style="font-family:monospace; min-height:400px;">${this.jsonContent}</textarea>
          </div>
        </div>
      </div>
    `
  }
}

if (!customElements.get(CMS_TAGS.CMS_LANG_EDITOR)) {
  customElements.define(CMS_TAGS.CMS_LANG_EDITOR, CmsLangEditor)
}
