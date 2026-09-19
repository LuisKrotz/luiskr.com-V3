import { BaseComponent } from '../../core/Component.js'
import { getDbInstance } from '../../firebase.js'
import { ref, child, get, set } from 'firebase/database'
import cmsStyles from '../../sass/cms.scss?inline'

export class CmsFooterEditor extends BaseComponent {
  constructor() {
    super(cmsStyles)
    this.languages = ['en', 'br', 'es', 'de', 'hrk', 'cas', 'riv', 'gn', 'it', 'ru', 'fr', 'tln']
    this.selectedLang = 'en'
    this.contactData = { title: 'Contact', line1: [] }
    this.saving = false
  }

  onMounted() {
    this.loadData()
  }

  async loadData() {
    try {
      const db = await getDbInstance()
      const snap = await get(child(ref(db), `translations/${this.selectedLang}/components/contact`))
      if (snap.exists()) {
        this.contactData = snap.val()
      }
      this._updateDom()
      this._bindEvents()
    } catch (err) {
      console.error('Error loading footer data:', err)
    }
  }

  async saveData() {
    this.saving = true
    this._updateDom()
    try {
      const db = await getDbInstance()
      await set(ref(db, `translations/${this.selectedLang}/components/contact`), this.contactData)
      this.dispatchEvent(
        new CustomEvent('notify', {
          bubbles: true,
          composed: true,
          detail: `Contact footer for [${this.selectedLang.toUpperCase()}] saved!`,
        })
      )
    } catch (err) {
      console.error('Error saving footer data:', err)
      alert('Failed to save footer data: ' + (err.message || err))
    } finally {
      this.saving = false
      this._updateDom()
      this._bindEvents()
    }
  }

  _bindEvents() {
    const saveBtn = this.$('#btn-save-footer')
    if (saveBtn) this.addScopedListener(saveBtn, 'click', () => this.saveData())

    const langSel = this.$('#select-footer-lang')
    if (langSel) {
      this.addScopedListener(langSel, 'change', (e) => {
        this.selectedLang = e.target.value
        this.loadData()
      })
    }

    const titleInput = this.$('#contact-title-input')
    if (titleInput) {
      this.addScopedListener(titleInput, 'input', (e) => {
        this.contactData.title = e.target.value
      })
    }
  }

  render() {
    return `
      <div class="cms-footer-manager">
        <div class="cms-card" style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;">
          <div>
            <h2 class="cms-card-title">Footers & Contact Info</h2>
            <p style="color:#8892b0; font-size:0.88rem;">Manage contact titles, social links, and legal links.</p>
          </div>
          <button class="cms-btn" id="btn-save-footer" ${this.saving ? 'disabled' : ''} type="button">
            ${this.saving ? 'Saving...' : '💾 Save to Firebase'}
          </button>
        </div>

        <div class="cms-card" style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
          <label style="color:#8892b0; font-weight:500;">Target Language:</label>
          <select id="select-footer-lang" class="cms-select" style="max-width:220px;">
            ${this.languages.map((l) => `<option value="${l}" ${this.selectedLang === l ? 'selected' : ''}>${l.toUpperCase()}</option>`).join('')}
          </select>
        </div>

        <div class="cms-card">
          <div class="cms-field-group">
            <label>Contact Title</label>
            <input id="contact-title-input" class="cms-input" value="${this.contactData.title || ''}" placeholder="Contact" />
          </div>
        </div>
      </div>
    `
  }
}

if (!customElements.get('cms-footer-editor')) {
  customElements.define('cms-footer-editor', CmsFooterEditor)
}
