import { BaseComponent } from '../../core/Component.js'
import { getDbInstance } from '../../firebase.js'
import { ref, child, get, set, remove } from 'firebase/database'
import { h } from '../../core/jsx.js'
import cmsStyles from '../../sass/cms.scss?inline'

const LANGS = ['en', 'br', 'es', 'de', 'hrk', 'cas', 'riv', 'gn', 'it', 'ru', 'fr', 'tln']

function gcs(filename) {
  return `https://storage.googleapis.com/luiskr.com/public/_v3/${filename}`
}

export class CmsProjectsList extends BaseComponent {
  constructor() {
    super(cmsStyles)
    this.languages = LANGS
    this.selectedLang = 'en'
    this.projectKeys = []
    this.selectedProjectKey = ''
    this.currentProject = null
    this.saving = false
  }

  onMounted() {
    this.loadProjectKeys()
  }

  onUpdated() {
    this._bindEvents()
  }

  // ─── Data loading ──────────────────────────────────────────────────────────
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
        const val = snap.val()
        this.currentProject = {
          title: val.title || '',
          folder: val.folder || '',
          seo: val.seo || { noIndex: false },
          cover: val.cover || { src: 'cover', label: '', size: [1920, 798], isVideo: false },
          sections: Array.isArray(val.sections) ? val.sections : [],
        }
      } else {
        this.currentProject = null
      }
      this._updateDom()
      this._bindEvents()
    } catch (err) {
      console.error('Error loading project data:', err)
    }
  }

  // ─── CRUD ──────────────────────────────────────────────────────────────────
  createProjectPrompt() {
    const key = prompt('Enter project identifier slug (e.g. "metcha", "melissa"):')
    if (!key) return
    const cleanKey = key.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '')
    if (this.projectKeys.includes(cleanKey)) { alert('Project already exists!'); return }
    this.projectKeys.push(cleanKey)
    this.selectedProjectKey = cleanKey
    this.currentProject = {
      title: cleanKey.toUpperCase(),
      folder: `${cleanKey}/`,
      seo: { noIndex: false },
      cover: { src: 'cover', label: `${cleanKey.toUpperCase()} Cover`, size: [1920, 798], isVideo: false },
      sections: [],
    }
    this._updateDom(); this._bindEvents()
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
      this._notify('Project deleted across all languages.')
    } catch (err) {
      alert('Failed to delete project: ' + (err.message || err))
    } finally {
      this.saving = false
      this._updateDom(); this._bindEvents()
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
      this._notify(`Project [${this.selectedProjectKey.toUpperCase()}] saved!`)
    } catch (err) {
      alert('Failed to save project: ' + (err.message || err))
    } finally {
      this.saving = false
      this._updateDom(); this._bindEvents()
    }
  }

  // ─── Sections ──────────────────────────────────────────────────────────────
  addSection() {
    if (!this.currentProject) return
    if (!Array.isArray(this.currentProject.sections)) this.currentProject.sections = []
    this.currentProject.sections.push({ texts: [''], media: [] })
    this._updateDom(); this._bindEvents()
  }

  removeSection(sIdx) {
    if (!confirm(`Delete Section #${sIdx + 1}?`)) return
    this.currentProject.sections.splice(sIdx, 1)
    this._updateDom(); this._bindEvents()
  }

  moveSection(sIdx, dir) {
    const secs = this.currentProject.sections
    const target = sIdx + dir
    if (target < 0 || target >= secs.length) return
    ;[secs[sIdx], secs[target]] = [secs[target], secs[sIdx]]
    this._updateDom(); this._bindEvents()
  }

  // ─── Section texts ─────────────────────────────────────────────────────────
  addSectionText(sIdx) {
    this._ensureSectionShape(sIdx)
    this.currentProject.sections[sIdx].texts.push('')
    this._updateDom(); this._bindEvents()
  }

  removeSectionText(sIdx, tIdx) {
    this.currentProject.sections[sIdx].texts.splice(tIdx, 1)
    this._updateDom(); this._bindEvents()
  }

  // ─── Section media ─────────────────────────────────────────────────────────
  addSectionMedia(sIdx) {
    this._ensureSectionShape(sIdx)
    this.currentProject.sections[sIdx].media.push({ src: '', label: '', isVideo: false, size: [1920, 1080] })
    this._updateDom(); this._bindEvents()
  }

  removeSectionMedia(sIdx, mIdx) {
    this.currentProject.sections[sIdx].media.splice(mIdx, 1)
    this._updateDom(); this._bindEvents()
  }

  _ensureSectionShape(sIdx) {
    const sec = this.currentProject.sections[sIdx]
    if (!Array.isArray(sec.texts)) sec.texts = []
    if (!Array.isArray(sec.media)) sec.media = []
  }

  _notify(msg) {
    this.dispatchEvent(new CustomEvent('notify', { bubbles: true, composed: true, detail: msg }))
  }

  // ─── Render helpers ────────────────────────────────────────────────────────
  _renderSection(sec, sIdx, total) {
    const texts = Array.isArray(sec.texts) ? sec.texts : (Array.isArray(sec[0]) ? sec[0] : [])
    const media = Array.isArray(sec.media) ? sec.media : (Array.isArray(sec[1]) ? sec[1] : [])

    return h('div', { class: 'cms-card cms-section-card', key: `sec-${sIdx}` },
      // Section header
      h('div', { class: 'cms-section-header' },
        h('span', { class: 'cms-section-title' }, `Section #${sIdx + 1}`),
        h('div', { class: 'cms-item-controls' },
          h('button', { class: 'cms-btn cms-btn--secondary sec-up-btn', 'data-idx': sIdx, type: 'button', disabled: sIdx === 0 }, '▲'),
          h('button', { class: 'cms-btn cms-btn--secondary sec-down-btn', 'data-idx': sIdx, type: 'button', disabled: sIdx === total - 1 }, '▼'),
          h('button', { class: 'cms-btn cms-btn--danger sec-del-btn', 'data-idx': sIdx, type: 'button' }, '✕ Remove'),
        ),
      ),

      // Text paragraphs
      h('div', { class: 'cms-subsection' },
        h('span', { class: 'cms-subsection-title' }, 'Text Paragraphs'),
        ...texts.map((t, tIdx) =>
          h('div', { class: 'cms-para-item', key: `t-${sIdx}-${tIdx}` },
            h('textarea', {
              class: 'cms-textarea sec-text-input',
              'data-sec': sIdx, 'data-tidx': tIdx,
              rows: '3',
              innerHTML: t,
            }),
            h('button', { class: 'cms-btn cms-btn--danger sec-text-del', 'data-sec': sIdx, 'data-tidx': tIdx, type: 'button' }, '✕'),
          )
        ),
        h('button', { class: 'cms-btn cms-btn--secondary sec-add-text', 'data-sec': sIdx, type: 'button' }, '+ Add Paragraph'),
      ),

      // Media items
      h('div', { class: 'cms-subsection' },
        h('span', { class: 'cms-subsection-title' }, 'Media Items'),
        ...media.map((m, mIdx) =>
          h('div', { class: 'cms-media-item', key: `m-${sIdx}-${mIdx}` },
            m.src
              ? h('img', {
                  src: gcs(`${this.currentProject.folder || ''}${m.src}`),
                  class: 'cms-media-thumb', alt: 'thumb', loading: 'lazy',
                })
              : h('div', { class: 'cms-media-thumb-placeholder' }, '📷'),
            h('div', { class: 'cms-media-fields' },
              h('div', { class: 'cms-field-row' },
                h('div', { class: 'cms-field-group' },
                  h('label', null, 'Filename (no ext)'),
                  h('input', { class: 'cms-input media-src', 'data-sec': sIdx, 'data-midx': mIdx, value: m.src || '', placeholder: 'image-name' }),
                ),
                h('div', { class: 'cms-field-group' },
                  h('label', null, 'Label / Alt'),
                  h('input', { class: 'cms-input media-label', 'data-sec': sIdx, 'data-midx': mIdx, value: m.label || '', placeholder: 'Description' }),
                ),
                h('div', { class: 'cms-field-group cms-field-group--small' },
                  h('label', null, 'Type'),
                  h('select', { class: 'cms-select media-type', 'data-sec': sIdx, 'data-midx': mIdx },
                    h('option', { value: 'false', selected: !m.isVideo ? '' : null }, 'Image'),
                    h('option', { value: 'true', selected: m.isVideo ? '' : null }, 'Video'),
                  ),
                ),
              ),
              h('div', { class: 'cms-field-row' },
                h('div', { class: 'cms-field-group cms-field-group--small' },
                  h('label', null, 'Width'),
                  h('input', { class: 'cms-input media-w', 'data-sec': sIdx, 'data-midx': mIdx, value: String((m.size && m.size[0]) || 1920) }),
                ),
                h('div', { class: 'cms-field-group cms-field-group--small' },
                  h('label', null, 'Height'),
                  h('input', { class: 'cms-input media-h', 'data-sec': sIdx, 'data-midx': mIdx, value: String((m.size && m.size[1]) || 1080) }),
                ),
                h('button', { class: 'cms-btn cms-btn--danger media-del', 'data-sec': sIdx, 'data-midx': mIdx, type: 'button' }, '✕ Remove'),
              ),
            ),
          )
        ),
        h('button', { class: 'cms-btn cms-btn--secondary sec-add-media', 'data-sec': sIdx, type: 'button' }, '+ Add Media Item'),
      ),
    )
  }

  // ─── Events ────────────────────────────────────────────────────────────────
  _bindEvents() {
    const on = (sel, ev, fn) => { const el = this.$(sel); if (el) this.addScopedListener(el, ev, fn) }
    const all = (sel, fn) => this.$$(sel).forEach(fn)

    on('#btn-create-proj', 'click', () => this.createProjectPrompt())
    on('#btn-delete-proj', 'click', () => this.deleteProject())
    on('#btn-save-proj', 'click', () => this.saveProjectData())
    on('#btn-add-section', 'click', () => this.addSection())

    on('#select-proj-lang', 'change', (e) => { this.selectedLang = e.target.value; this.loadProjectData() })
    on('#select-proj-key', 'change', (e) => { this.selectedProjectKey = e.target.value; this.loadProjectData() })

    if (this.currentProject) {
      on('#proj-title-input', 'input', (e) => { this.currentProject.title = e.target.value })
      on('#proj-folder-input', 'input', (e) => { this.currentProject.folder = e.target.value })
      on('#proj-noindex', 'change', (e) => { this.currentProject.seo.noIndex = e.target.checked })
      on('#cover-src-input', 'input', (e) => { this.currentProject.cover.src = e.target.value })
      on('#cover-label-input', 'input', (e) => { this.currentProject.cover.label = e.target.value })
      on('#cover-isvideo', 'change', (e) => { this.currentProject.cover.isVideo = e.target.value === 'true' })
      on('#cover-w-input', 'input', (e) => { this.currentProject.cover.size[0] = parseInt(e.target.value, 10) || 1920 })
      on('#cover-h-input', 'input', (e) => { this.currentProject.cover.size[1] = parseInt(e.target.value, 10) || 798 })
    }

    // Section controls
    all('.sec-up-btn', (btn) => { const i = parseInt(btn.getAttribute('data-idx'), 10); this.addScopedListener(btn, 'click', () => this.moveSection(i, -1)) })
    all('.sec-down-btn', (btn) => { const i = parseInt(btn.getAttribute('data-idx'), 10); this.addScopedListener(btn, 'click', () => this.moveSection(i, 1)) })
    all('.sec-del-btn', (btn) => { const i = parseInt(btn.getAttribute('data-idx'), 10); this.addScopedListener(btn, 'click', () => this.removeSection(i)) })
    all('.sec-add-text', (btn) => { const s = parseInt(btn.getAttribute('data-sec'), 10); this.addScopedListener(btn, 'click', () => this.addSectionText(s)) })
    all('.sec-add-media', (btn) => { const s = parseInt(btn.getAttribute('data-sec'), 10); this.addScopedListener(btn, 'click', () => this.addSectionMedia(s)) })

    // Section text editing
    all('.sec-text-input', (ta) => {
      const s = parseInt(ta.getAttribute('data-sec'), 10)
      const t = parseInt(ta.getAttribute('data-tidx'), 10)
      this.addScopedListener(ta, 'input', (e) => {
        this._ensureSectionShape(s)
        this.currentProject.sections[s].texts[t] = e.target.value
      })
    })
    all('.sec-text-del', (btn) => {
      const s = parseInt(btn.getAttribute('data-sec'), 10)
      const t = parseInt(btn.getAttribute('data-tidx'), 10)
      this.addScopedListener(btn, 'click', () => this.removeSectionText(s, t))
    })

    // Media field editing
    all('.media-src', (inp) => {
      const s = parseInt(inp.getAttribute('data-sec'), 10); const m = parseInt(inp.getAttribute('data-midx'), 10)
      this.addScopedListener(inp, 'input', (e) => { this.currentProject.sections[s].media[m].src = e.target.value; this._updateDom() })
    })
    all('.media-label', (inp) => {
      const s = parseInt(inp.getAttribute('data-sec'), 10); const m = parseInt(inp.getAttribute('data-midx'), 10)
      this.addScopedListener(inp, 'input', (e) => { this.currentProject.sections[s].media[m].label = e.target.value })
    })
    all('.media-type', (sel) => {
      const s = parseInt(sel.getAttribute('data-sec'), 10); const m = parseInt(sel.getAttribute('data-midx'), 10)
      this.addScopedListener(sel, 'change', (e) => { this.currentProject.sections[s].media[m].isVideo = e.target.value === 'true' })
    })
    all('.media-w', (inp) => {
      const s = parseInt(inp.getAttribute('data-sec'), 10); const m = parseInt(inp.getAttribute('data-midx'), 10)
      this.addScopedListener(inp, 'input', (e) => { this.currentProject.sections[s].media[m].size[0] = parseInt(e.target.value, 10) || 1920 })
    })
    all('.media-h', (inp) => {
      const s = parseInt(inp.getAttribute('data-sec'), 10); const m = parseInt(inp.getAttribute('data-midx'), 10)
      this.addScopedListener(inp, 'input', (e) => { this.currentProject.sections[s].media[m].size[1] = parseInt(e.target.value, 10) || 1080 })
    })
    all('.media-del', (btn) => {
      const s = parseInt(btn.getAttribute('data-sec'), 10); const m = parseInt(btn.getAttribute('data-midx'), 10)
      this.addScopedListener(btn, 'click', () => this.removeSectionMedia(s, m))
    })
  }

  render() {
    const p = this.currentProject

    const root = h('div', { class: 'cms-projects-manager' },
      // ── Header ──────────────────────────────────────────────────────────────
      h('div', { class: 'cms-card cms-card--header' },
        h('div', null,
          h('h2', { class: 'cms-card-title' }, 'Project Case Studies Manager'),
          h('p', { class: 'cms-card-subtitle' }, 'Manage sections, text paragraphs, and image/video carousels for all project case studies.'),
        ),
        h('div', { class: 'cms-btn-group' },
          h('button', { id: 'btn-create-proj', class: 'cms-btn cms-btn--secondary', type: 'button' }, '+ Create New Project'),
          h('button', { id: 'btn-delete-proj', class: 'cms-btn cms-btn--danger', type: 'button', disabled: !this.selectedProjectKey }, '🗑️ Delete Project'),
          h('button', { id: 'btn-save-proj', class: 'cms-btn', type: 'button', disabled: this.saving || !p }, this.saving ? 'Saving...' : '💾 Save Project to Firebase'),
        ),
      ),

      // ── Selectors ────────────────────────────────────────────────────────────
      h('div', { class: 'cms-card' },
        h('div', { class: 'cms-field-row' },
          h('div', { class: 'cms-field-group' },
            h('label', null, 'Target Language'),
            h('select', { id: 'select-proj-lang', class: 'cms-select' },
              ...this.languages.map((l) =>
                h('option', { value: l, selected: this.selectedLang === l ? '' : null }, l.toUpperCase())
              ),
            ),
          ),
          h('div', { class: 'cms-field-group' },
            h('label', null, `Select Project (${this.projectKeys.length} total)`),
            h('select', { id: 'select-proj-key', class: 'cms-select' },
              ...this.projectKeys.map((pk) =>
                h('option', { value: pk, selected: this.selectedProjectKey === pk ? '' : null }, pk.toUpperCase())
              ),
            ),
          ),
        ),
      ),

      // ── Project Editor ───────────────────────────────────────────────────────
      p ? h('div', null,
        // Basic fields
        h('div', { class: 'cms-card' },
          h('h3', { class: 'cms-section-title' }, `Editing: [${this.selectedProjectKey.toUpperCase()}] — ${this.selectedLang.toUpperCase()}`),
          h('div', { class: 'cms-field-row' },
            h('div', { class: 'cms-field-group' },
              h('label', null, 'Project Title'),
              h('input', { id: 'proj-title-input', class: 'cms-input', value: p.title || '', placeholder: 'METCHA' }),
            ),
            h('div', { class: 'cms-field-group' },
              h('label', null, 'Assets Folder'),
              h('input', { id: 'proj-folder-input', class: 'cms-input', value: p.folder || '', placeholder: 'metcha/' }),
            ),
            h('div', { class: 'cms-field-group cms-field-group--small' },
              h('label', null, 'SEO'),
              h('label', { class: 'cms-checkbox-label' },
                h('input', { id: 'proj-noindex', type: 'checkbox', checked: p.seo?.noIndex ? '' : null }),
                ' noIndex',
              ),
            ),
          ),
        ),

        // Cover
        h('div', { class: 'cms-card' },
          h('h3', { class: 'cms-section-title' }, 'Cover Image / Video'),
          h('div', { class: 'cms-cover-layout' },
            p.cover?.src
              ? h('img', {
                  src: gcs(`${p.folder || ''}${p.cover.src}`),
                  class: 'cms-cover-thumb', alt: 'cover', loading: 'lazy',
                })
              : h('div', { class: 'cms-media-thumb-placeholder' }, '🖼️'),
            h('div', { class: 'cms-cover-fields' },
              h('div', { class: 'cms-field-row' },
                h('div', { class: 'cms-field-group' },
                  h('label', null, 'Filename (no ext)'),
                  h('input', { id: 'cover-src-input', class: 'cms-input', value: p.cover?.src || 'cover', placeholder: 'cover' }),
                ),
                h('div', { class: 'cms-field-group' },
                  h('label', null, 'Label / Alt'),
                  h('input', { id: 'cover-label-input', class: 'cms-input', value: p.cover?.label || '', placeholder: 'Cover image label' }),
                ),
                h('div', { class: 'cms-field-group cms-field-group--small' },
                  h('label', null, 'Type'),
                  h('select', { id: 'cover-isvideo', class: 'cms-select' },
                    h('option', { value: 'false', selected: !p.cover?.isVideo ? '' : null }, 'Image'),
                    h('option', { value: 'true', selected: p.cover?.isVideo ? '' : null }, 'Video'),
                  ),
                ),
              ),
              h('div', { class: 'cms-field-row' },
                h('div', { class: 'cms-field-group cms-field-group--small' },
                  h('label', null, 'Width'),
                  h('input', { id: 'cover-w-input', class: 'cms-input', value: String((p.cover?.size && p.cover.size[0]) || 1920) }),
                ),
                h('div', { class: 'cms-field-group cms-field-group--small' },
                  h('label', null, 'Height'),
                  h('input', { id: 'cover-h-input', class: 'cms-input', value: String((p.cover?.size && p.cover.size[1]) || 798) }),
                ),
              ),
            ),
          ),
        ),

        // Sections
        h('div', { class: 'cms-card' },
          h('div', { class: 'cms-section-header' },
            h('h3', { class: 'cms-section-title' }, `Sections & Paragraphs (${(p.sections || []).length})`),
            h('button', { id: 'btn-add-section', class: 'cms-btn cms-btn--secondary', type: 'button' }, '+ Add Section'),
          ),
          h('div', { class: 'cms-sections-list' },
            ...(p.sections || []).map((sec, sIdx) => this._renderSection(sec, sIdx, p.sections.length)),
          ),
        ),
      ) : null,
    )

    this.shadowRoot.innerHTML = `<style>${cmsStyles}</style>`
    this.shadowRoot.appendChild(root)
    this._bindEvents()
  }
}

if (!customElements.get('cms-projects-list')) {
  customElements.define('cms-projects-list', CmsProjectsList)
}
