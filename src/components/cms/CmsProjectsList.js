import { BaseComponent } from '../../core/Component.js'
import { getDbInstance } from '../../firebase.js'
import { ref, child, get, set, remove } from 'firebase/database'
import cmsStyles from '../../sass/cms.scss?inline'

export class CmsProjectsList extends BaseComponent {
  constructor() {
    super(cmsStyles)
    this.languages = ['en', 'br', 'es', 'de', 'hrk', 'cas', 'riv', 'gn', 'it', 'ru', 'fr', 'tln']
    this.selectedLang = 'en'
    this.projectKeys = []
    this.selectedProjectKey = ''
    this.currentProject = null
    this.saving = false
  }

  onMounted() {
    this.loadProjectKeys()
  }

  async loadProjectKeys() {
    try {
      const db = await getDbInstance()
      const snap = await get(child(ref(db), `translations/${this.selectedLang}/projects`))
      if (snap.exists()) {
        const val = snap.val()
        this.projectKeys = Object.keys(val).sort()
        if (!this.selectedProjectKey && this.projectKeys.length > 0) {
          this.selectedProjectKey = this.projectKeys[0]
        }
        await this.loadProjectData()
      } else {
        this.projectKeys = []
        this.currentProject = null
        this._updateDom()
        this._bindEvents()
      }
    } catch (err) {
      console.error('Error loading project keys:', err)
    }
  }

  async loadProjectData() {
    if (!this.selectedProjectKey) return
    try {
      const db = await getDbInstance()
      const snap = await get(
        child(ref(db), `translations/${this.selectedLang}/projects/${this.selectedProjectKey}`)
      )
      if (snap.exists()) {
        this.currentProject = snap.val()
      } else {
        this.currentProject = null
      }
      this._updateDom()
      this._bindEvents()
    } catch (err) {
      console.error('Error loading project data:', err)
    }
  }

  createProjectPrompt() {
    const key = prompt('Enter project identifier slug (e.g. "metcha", "melissa"):')
    if (!key) return
    const cleanKey = key.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '')
    if (this.projectKeys.includes(cleanKey)) {
      alert('Project already exists!')
      return
    }
    this.projectKeys.push(cleanKey)
    this.selectedProjectKey = cleanKey
    this.currentProject = {
      title: cleanKey.toUpperCase(),
      folder: `${cleanKey}/`,
      seo: { noIndex: false },
      cover: {
        src: 'cover',
        label: `${cleanKey.toUpperCase()} Cover`,
        size: [1920, 798],
        isVideo: false,
      },
      sections: [],
    }
    this._updateDom()
    this._bindEvents()
  }

  async deleteProject() {
    if (!this.selectedProjectKey) return
    if (!confirm(`Delete project "${this.selectedProjectKey}" across ALL languages?`)) return

    this.saving = true
    try {
      const db = await getDbInstance()
      for (const lang of this.languages) {
        await remove(ref(db, `translations/${lang}/projects/${this.selectedProjectKey}`))
      }
      this.selectedProjectKey = ''
      this.currentProject = null
      await this.loadProjectKeys()
      this.dispatchEvent(
        new CustomEvent('notify', {
          bubbles: true,
          composed: true,
          detail: 'Project deleted across all languages.',
        })
      )
    } catch (err) {
      console.error('Error deleting project:', err)
      alert('Failed to delete project: ' + (err.message || err))
    } finally {
      this.saving = false
      this._updateDom()
      this._bindEvents()
    }
  }

  async saveProjectData() {
    if (!this.selectedProjectKey || !this.currentProject) return
    this.saving = true
    this._updateDom()
    try {
      const db = await getDbInstance()
      await set(
        ref(db, `translations/${this.selectedLang}/projects/${this.selectedProjectKey}`),
        this.currentProject
      )
      this.dispatchEvent(
        new CustomEvent('notify', {
          bubbles: true,
          composed: true,
          detail: `Project [${this.selectedProjectKey.toUpperCase()}] saved successfully!`,
        })
      )
    } catch (err) {
      console.error('Error saving project:', err)
      alert('Failed to save project: ' + (err.message || err))
    } finally {
      this.saving = false
      this._updateDom()
      this._bindEvents()
    }
  }

  addSection() {
    if (!this.currentProject) return
    if (!Array.isArray(this.currentProject.sections)) {
      this.currentProject.sections = []
    }
    this.currentProject.sections.push([
      ['Heading text', 'Body paragraph text.'],
      [],
    ])
    this._updateDom()
    this._bindEvents()
  }

  removeSection(idx) {
    if (!confirm(`Delete Section #${idx + 1}?`)) return
    this.currentProject.sections.splice(idx, 1)
    this._updateDom()
    this._bindEvents()
  }

  _bindEvents() {
    const createBtn = this.$('#btn-create-proj')
    if (createBtn) this.addScopedListener(createBtn, 'click', () => this.createProjectPrompt())

    const deleteBtn = this.$('#btn-delete-proj')
    if (deleteBtn) this.addScopedListener(deleteBtn, 'click', () => this.deleteProject())

    const saveBtn = this.$('#btn-save-proj')
    if (saveBtn) this.addScopedListener(saveBtn, 'click', () => this.saveProjectData())

    const addSecBtn = this.$('#btn-add-section')
    if (addSecBtn) this.addScopedListener(addSecBtn, 'click', () => this.addSection())

    const langSel = this.$('#select-proj-lang')
    if (langSel) {
      this.addScopedListener(langSel, 'change', (e) => {
        this.selectedLang = e.target.value
        this.loadProjectData()
      })
    }

    const projSel = this.$('#select-proj-key')
    if (projSel) {
      this.addScopedListener(projSel, 'change', (e) => {
        this.selectedProjectKey = e.target.value
        this.loadProjectData()
      })
    }

    const titleInput = this.$('#proj-title-input')
    if (titleInput) {
      this.addScopedListener(titleInput, 'input', (e) => {
        if (this.currentProject) this.currentProject.title = e.target.value
      })
    }

    const folderInput = this.$('#proj-folder-input')
    if (folderInput) {
      this.addScopedListener(folderInput, 'input', (e) => {
        if (this.currentProject) this.currentProject.folder = e.target.value
      })
    }

    this.$$('.sec-delete-btn').forEach((btn) => {
      const idx = parseInt(btn.getAttribute('data-sec-idx'), 10)
      this.addScopedListener(btn, 'click', () => this.removeSection(idx))
    })
  }

  render() {
    return `
      <div class="cms-projects-manager">
        <div class="cms-card" style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;">
          <div>
            <h2 class="cms-card-title">Project Case Studies Manager</h2>
            <p style="color:#8892b0; font-size:0.88rem;">Manage sections, text paragraphs, and image/video carousels for all project case studies.</p>
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button class="cms-btn cms-btn--secondary" id="btn-create-proj" type="button">+ Create New Project</button>
            <button class="cms-btn cms-btn--danger" id="btn-delete-proj" ${!this.selectedProjectKey ? 'disabled' : ''} type="button">🗑️ Delete Project</button>
            <button class="cms-btn" id="btn-save-proj" ${this.saving || !this.currentProject ? 'disabled' : ''} type="button">
              ${this.saving ? 'Saving...' : '💾 Save Project to Firebase'}
            </button>
          </div>
        </div>

        <div class="cms-card" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1.2rem;">
          <div class="cms-field-group">
            <label>Target Language</label>
            <select id="select-proj-lang" class="cms-select">
              ${this.languages.map((l) => `<option value="${l}" ${this.selectedLang === l ? 'selected' : ''}>${l.toUpperCase()}</option>`).join('')}
            </select>
          </div>

          <div class="cms-field-group">
            <label>Select Project (${this.projectKeys.length} total)</label>
            <select id="select-proj-key" class="cms-select">
              ${this.projectKeys.map((pk) => `<option value="${pk}" ${this.selectedProjectKey === pk ? 'selected' : ''}>${pk.toUpperCase()}</option>`).join('')}
            </select>
          </div>
        </div>

        ${
          this.currentProject
            ? `
          <div class="cms-card">
            <h3 style="color:#66fcf1; font-size:1.1rem; font-weight:600; margin-bottom:1.2rem;">
              Editing Project: [${this.selectedProjectKey.toUpperCase()}] (${this.selectedLang.toUpperCase()})
            </h3>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1.2rem; margin-bottom:1.5rem;">
              <div class="cms-field-group">
                <label>Project Title</label>
                <input id="proj-title-input" class="cms-input" value="${this.currentProject.title || ''}" placeholder="e.g. METCHA" />
              </div>

              <div class="cms-field-group">
                <label>Assets Folder</label>
                <input id="proj-folder-input" class="cms-input" value="${this.currentProject.folder || ''}" placeholder="e.g. metcha/" />
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin: 1.5rem 0 1rem;">
              <h4 style="color:#ffffff; margin:0;">Sections & Paragraphs</h4>
              <button class="cms-btn cms-btn--secondary" id="btn-add-section" type="button">+ Add Section</button>
            </div>

            <div style="display:flex; flex-direction:column; gap:1rem;">
              ${(this.currentProject.sections || [])
                .map(
                  (sec, sIdx) => `
                <div style="background:rgba(0,0,0,0.3); padding:1rem; border-radius:8px; border:1px solid rgba(255,255,255,0.08);">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
                    <span style="font-weight:600; color:#66fcf1;">Section #${sIdx + 1}</span>
                    <button class="cms-btn cms-btn--danger sec-delete-btn" data-sec-idx="${sIdx}" style="padding:3px 8px; font-size:0.75rem;" type="button">✕ Remove</button>
                  </div>
                  <p style="color:#8892b0; font-size:0.82rem; margin:0 0 0.5rem;">Text paragraphs & items in this section:</p>
                  ${
                    Array.isArray(sec[0])
                      ? sec[0]
                          .map((p, pIdx) => `<div style="color:#fff; font-size:0.88rem; margin-bottom:4px;">${pIdx + 1}. ${p}</div>`)
                          .join('')
                      : '<div style="color:#8892b0; font-size:0.8rem;">No text items</div>'
                  }
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }
      </div>
    `
  }
}

if (!customElements.get('cms-projects-list')) {
  customElements.define('cms-projects-list', CmsProjectsList)
}
