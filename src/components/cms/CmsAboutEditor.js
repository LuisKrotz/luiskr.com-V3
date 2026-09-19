import { BaseComponent } from '../../core/Component.js'
import { getDbInstance } from '../../firebase.js'
import { ref, child, get, set } from 'firebase/database'
import cmsStyles from '../../sass/cms.scss?inline'

export class CmsAboutEditor extends BaseComponent {
  constructor() {
    super(cmsStyles)
    this.languages = ['en', 'br', 'es', 'de', 'hrk', 'cas', 'riv', 'gn', 'it', 'ru', 'fr', 'tln']
    this.selectedLang = 'en'
    this.aboutData = {
      title: 'About',
      profilePicture: '',
      col1: [],
      col2: [],
      mentions: 'Some mentions',
      mention_items: [],
    }
    this.saving = false
  }

  onMounted() {
    this.loadAboutData()
  }

  async loadAboutData() {
    try {
      const db = await getDbInstance()
      const [aboutSnap, picSnap] = await Promise.all([
        get(child(ref(db), `translations/${this.selectedLang}/pages/about`)),
        get(child(ref(db), `translations/${this.selectedLang}/pages/about/profilePicture`)),
      ])

      if (aboutSnap.exists()) {
        const val = aboutSnap.val()
        this.aboutData = {
          title: val.title || 'About',
          profilePicture: picSnap.exists() ? picSnap.val() : val.profilePicture || '',
          col1: Array.isArray(val.col1) ? [...val.col1] : [],
          col2: Array.isArray(val.col2) ? [...val.col2] : [],
          mentions: val.mentions || 'Some mentions',
          mention_items: Array.isArray(val.mention_items) ? [...val.mention_items] : [],
        }
      }
      this._updateDom()
      this._bindEvents()
    } catch (err) {
      console.error('Error loading about data:', err)
    }
  }

  async saveAboutData() {
    this.saving = true
    this._updateDom()
    try {
      const db = await getDbInstance()
      await set(ref(db, `translations/${this.selectedLang}/pages/about`), this.aboutData)
      if (this.aboutData.profilePicture) {
        await set(
          ref(db, `translations/${this.selectedLang}/pages/about/profilePicture`),
          this.aboutData.profilePicture
        )
      }
      this.dispatchEvent(
        new CustomEvent('notify', {
          bubbles: true,
          composed: true,
          detail: `About section for [${this.selectedLang.toUpperCase()}] saved!`,
        })
      )
    } catch (err) {
      console.error('Error saving about data:', err)
      alert('Failed to save about data: ' + (err.message || err))
    } finally {
      this.saving = false
      this._updateDom()
      this._bindEvents()
    }
  }

  _bindEvents() {
    const saveBtn = this.$('#btn-save-about')
    if (saveBtn) this.addScopedListener(saveBtn, 'click', () => this.saveAboutData())

    const langSel = this.$('#select-about-lang')
    if (langSel) {
      this.addScopedListener(langSel, 'change', (e) => {
        this.selectedLang = e.target.value
        this.loadAboutData()
      })
    }

    const titleInput = this.$('#about-title-input')
    if (titleInput) {
      this.addScopedListener(titleInput, 'input', (e) => {
        this.aboutData.title = e.target.value
      })
    }

    const picInput = this.$('#about-pic-input')
    if (picInput) {
      this.addScopedListener(picInput, 'input', (e) => {
        this.aboutData.profilePicture = e.target.value
      })
    }
  }

  render() {
    return `
      <div class="cms-about-manager">
        <div class="cms-card" style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;">
          <div>
            <h2 class="cms-card-title">About Section & Profile Editor</h2>
            <p style="color:#8892b0; font-size:0.88rem;">Manage your bio, profile picture, intro text, and mentions.</p>
          </div>
          <button class="cms-btn" id="btn-save-about" ${this.saving ? 'disabled' : ''} type="button">
            ${this.saving ? 'Saving...' : '💾 Save to Firebase'}
          </button>
        </div>

        <div class="cms-card" style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
          <label style="color:#8892b0; font-weight:500;">Target Language:</label>
          <select id="select-about-lang" class="cms-select" style="max-width:220px;">
            ${this.languages.map((l) => `<option value="${l}" ${this.selectedLang === l ? 'selected' : ''}>${l.toUpperCase()}</option>`).join('')}
          </select>
        </div>

        <div class="cms-card">
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1.2rem;">
            <div class="cms-field-group">
              <label>About Section Title</label>
              <input id="about-title-input" class="cms-input" value="${this.aboutData.title || ''}" placeholder="About" />
            </div>

            <div class="cms-field-group">
              <label>Profile Picture URL / Gravatar</label>
              <input id="about-pic-input" class="cms-input" value="${this.aboutData.profilePicture || ''}" placeholder="https://..." />
            </div>
          </div>
        </div>
      </div>
    `
  }
}

if (!customElements.get('cms-about-editor')) {
  customElements.define('cms-about-editor', CmsAboutEditor)
}
