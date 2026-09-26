import { CMS_CLASSES, CMS_TAGS, CMS_EVENTS } from "../../core/cms/tokens.js"
import { BaseComponent } from '../../core/Component.js'
import { getDbInstance } from '../../firebase.js'
import { ref, child, get, set, remove } from 'firebase/database'
import { h } from '../../core/jsx.js'
import { LOCALES, PATHS, URLS, MEDIA_DIMENSIONS } from '../../core/constants.js'
import { VALID_LANGS } from '../../core/i18n.js'
import cmsStyles from '../../sass/views/cms.scss?inline'

function gcs(filename) {
  return `${URLS.CDN_BASE}${filename}`
}

export class CmsProjectsList extends BaseComponent {
  constructor() {
    super(cmsStyles)
    this.languages = VALID_LANGS
    this.selectedLang = LOCALES.EN
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
      const snap = await get(child(ref(db), `${PATHS.TRANSLATIONS}${this.selectedLang}/projects`))
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
        child(ref(db), `${PATHS.TRANSLATIONS}${this.selectedLang}/projects/${this.selectedProjectKey}`)
      )
      if (snap.exists()) {
        const val = snap.val()
        this.currentProject = {
          title: val.title || '',
          folder: val.folder || '',
          seo: val.seo || { noIndex: false },
          cover: val.cover || { src: 'cover', label: '', size: [MEDIA_DIMENSIONS.FHD_WIDTH, MEDIA_DIMENSIONS.COVER_HEIGHT_WIDE], isVideo: false },
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
      cover: { src: 'cover', label: `${cleanKey.toUpperCase()} Cover`, size: [MEDIA_DIMENSIONS.FHD_WIDTH, MEDIA_DIMENSIONS.COVER_HEIGHT_WIDE], isVideo: false },
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
        await remove(ref(db, `${PATHS.TRANSLATIONS}${lang}/projects/${this.selectedProjectKey}`))
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
        ref(db, `${PATHS.TRANSLATIONS}${this.selectedLang}/projects/${this.selectedProjectKey}`),
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
    this.currentProject.sections[sIdx].media.push({ src: '', label: '', isVideo: false, size: [MEDIA_DIMENSIONS.FHD_WIDTH, MEDIA_DIMENSIONS.FHD_HEIGHT] })
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
    this.dispatchEvent(new CustomEvent(CMS_EVENTS.NOTIFY, { bubbles: true, composed: true, detail: msg }))
  }

  // ─── Render helpers ────────────────────────────────────────────────────────
  _renderSection(sec, sIdx, total) {
    const texts = Array.isArray(sec.texts) ? sec.texts : (Array.isArray(sec[0]) ? sec[0] : [])
    const media = Array.isArray(sec.media) ? sec.media : (Array.isArray(sec[1]) ? sec[1] : [])

    return h(TAGS.DIV, { class: 'cms-card cms-section-card', key: `sec-${sIdx}` },
      // Section header
      h(TAGS.DIV, { class: 'cms-section-header' },
        h(TAGS.SPAN, { class: CMS_CLASSES.CMS_SECTION_TITLE }, `Section #${sIdx + 1}`),
        h(TAGS.DIV, { class: 'cms-item-controls' },
          h(TAGS.BUTTON, { class: 'cms-btn cms-btn--secondary sec-up-btn', [ATTRS.DATA_IDX]: sIdx, type: 'button', disabled: sIdx === 0 }, '▲'),
          h(TAGS.BUTTON, { class: 'cms-btn cms-btn--secondary sec-down-btn', [ATTRS.DATA_IDX]: sIdx, type: 'button', disabled: sIdx === total - 1 }, '▼'),
          h(TAGS.BUTTON, { class: 'cms-btn cms-btn--danger sec-del-btn', [ATTRS.DATA_IDX]: sIdx, type: 'button' }, '✕ Remove'),
        ),
      ),

      // Text paragraphs
      h(TAGS.DIV, { class: 'cms-subsection' },
        h(TAGS.SPAN, { class: 'cms-subsection-title' }, 'Text Paragraphs'),
        ...texts.map((t, tIdx) =>
          h(TAGS.DIV, { class: 'cms-para-item', key: `t-${sIdx}-${tIdx}` },
            h(TAGS.TEXTAREA, {
              class: 'cms-textarea sec-text-input',
              [ATTRS.DATA_SEC]: sIdx, 'data-tidx': tIdx,
              rows: '3',
              innerHTML: t,
            }),
            h(TAGS.BUTTON, { class: 'cms-btn cms-btn--danger sec-text-del', [ATTRS.DATA_SEC]: sIdx, 'data-tidx': tIdx, type: 'button' }, '✕'),
          )
        ),
        h(TAGS.BUTTON, { class: 'cms-btn cms-btn--secondary sec-add-text', [ATTRS.DATA_SEC]: sIdx, type: 'button' }, '+ Add Paragraph'),
      ),

      // Media items
      h(TAGS.DIV, { class: 'cms-subsection' },
        h(TAGS.SPAN, { class: 'cms-subsection-title' }, 'Media Items'),
        ...media.map((m, mIdx) =>
          h(TAGS.DIV, { class: 'cms-media-item', key: `m-${sIdx}-${mIdx}` },
            m.src
              ? h('img', {
                  src: gcs(`${this.currentProject.folder || ''}${m.src}`),
                  class: 'cms-media-thumb', alt: 'thumb', loading: 'lazy',
                })
              : h(TAGS.DIV, { class: 'cms-media-thumb-placeholder' }, '📷'),
            h(TAGS.DIV, { class: 'cms-media-fields' },
              h(TAGS.DIV, { class: 'cms-field-row' },
                h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
                  h(TAGS.LABEL, null, 'Filename (no ext)'),
                  h(TAGS.INPUT, { class: 'cms-input media-src', [ATTRS.DATA_SEC]: sIdx, [ATTRS.DATA_MIDX]: mIdx, value: m.src || '', placeholder: 'image-name' }),
                ),
                h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
                  h(TAGS.LABEL, null, 'Label / Alt'),
                  h(TAGS.INPUT, { class: 'cms-input media-label', [ATTRS.DATA_SEC]: sIdx, [ATTRS.DATA_MIDX]: mIdx, value: m.label || '', placeholder: 'Description' }),
                ),
                h(TAGS.DIV, { class: 'cms-field-group cms-field-group--small' },
                  h(TAGS.LABEL, null, 'Type'),
                  h(TAGS.SELECT, { class: 'cms-select media-type', [ATTRS.DATA_SEC]: sIdx, [ATTRS.DATA_MIDX]: mIdx },
                    h(TAGS.OPTION, { value: 'false', selected: !m.isVideo ? '' : null }, 'Image'),
                    h(TAGS.OPTION, { value: 'true', selected: m.isVideo ? '' : null }, 'Video'),
                  ),
                ),
              ),
              h(TAGS.DIV, { class: 'cms-field-row' },
                h(TAGS.DIV, { class: 'cms-field-group cms-field-group--small' },
                  h(TAGS.LABEL, null, 'Width'),
                  h(TAGS.INPUT, { class: 'cms-input media-w', [ATTRS.DATA_SEC]: sIdx, [ATTRS.DATA_MIDX]: mIdx, value: String((m.size && m.size[0]) || MEDIA_DIMENSIONS.FHD_WIDTH) }),
                ),
                h(TAGS.DIV, { class: 'cms-field-group cms-field-group--small' },
                  h(TAGS.LABEL, null, 'Height'),
                  h(TAGS.INPUT, { class: 'cms-input media-h', [ATTRS.DATA_SEC]: sIdx, [ATTRS.DATA_MIDX]: mIdx, value: String((m.size && m.size[1]) || MEDIA_DIMENSIONS.FHD_HEIGHT) }),
                ),
                h(TAGS.BUTTON, { class: 'cms-btn cms-btn--danger media-del', [ATTRS.DATA_SEC]: sIdx, [ATTRS.DATA_MIDX]: mIdx, type: 'button' }, '✕ Remove'),
              ),
            ),
          )
        ),
        h(TAGS.BUTTON, { class: 'cms-btn cms-btn--secondary sec-add-media', [ATTRS.DATA_SEC]: sIdx, type: 'button' }, '+ Add Media Item'),
      ),
    )
  }

  // ─── Events ────────────────────────────────────────────────────────────────
  _bindEvents() {
    const on = (sel, ev, fn) => { const el = this.$(sel); if (el) this.addScopedListener(el, ev, fn) }
    const all = (sel, fn) => this.$$(sel).forEach(fn)

    on('#btn-create-proj', EVENTS.CLICK, () => this.createProjectPrompt())
    on('#btn-delete-proj', EVENTS.CLICK, () => this.deleteProject())
    on('#btn-save-proj', EVENTS.CLICK, () => this.saveProjectData())
    on('#btn-add-section', EVENTS.CLICK, () => this.addSection())

    on('#select-proj-lang', EVENTS.CHANGE, (e) => { this.selectedLang = e.target.value; this.loadProjectData() })
    on('#select-proj-key', EVENTS.CHANGE, (e) => { this.selectedProjectKey = e.target.value; this.loadProjectData() })

    if (this.currentProject) {
      on('#proj-title-input', EVENTS.INPUT, (e) => { this.currentProject.title = e.target.value })
      on('#proj-folder-input', EVENTS.INPUT, (e) => { this.currentProject.folder = e.target.value })
      on('#proj-noindex', EVENTS.CHANGE, (e) => { this.currentProject.seo.noIndex = e.target.checked })
      on('#cover-src-input', EVENTS.INPUT, (e) => { this.currentProject.cover.src = e.target.value })
      on('#cover-label-input', EVENTS.INPUT, (e) => { this.currentProject.cover.label = e.target.value })
      on('#cover-isvideo', EVENTS.CHANGE, (e) => { this.currentProject.cover.isVideo = e.target.value === 'true' })
      on('#cover-w-input', EVENTS.INPUT, (e) => { this.currentProject.cover.size[0] = parseInt(e.target.value, 10) || MEDIA_DIMENSIONS.FHD_WIDTH })
      on('#cover-h-input', EVENTS.INPUT, (e) => { this.currentProject.cover.size[1] = parseInt(e.target.value, 10) || MEDIA_DIMENSIONS.COVER_HEIGHT_WIDE })
    }

    // Section controls
    all('.sec-up-btn', (btn) => { const i = parseInt(btn.getAttribute(ATTRS.DATA_IDX), 10); this.addScopedListener(btn, EVENTS.CLICK, () => this.moveSection(i, -1)) })
    all('.sec-down-btn', (btn) => { const i = parseInt(btn.getAttribute(ATTRS.DATA_IDX), 10); this.addScopedListener(btn, EVENTS.CLICK, () => this.moveSection(i, 1)) })
    all('.sec-del-btn', (btn) => { const i = parseInt(btn.getAttribute(ATTRS.DATA_IDX), 10); this.addScopedListener(btn, EVENTS.CLICK, () => this.removeSection(i)) })
    all('.sec-add-text', (btn) => { const s = parseInt(btn.getAttribute(ATTRS.DATA_SEC), 10); this.addScopedListener(btn, EVENTS.CLICK, () => this.addSectionText(s)) })
    all('.sec-add-media', (btn) => { const s = parseInt(btn.getAttribute(ATTRS.DATA_SEC), 10); this.addScopedListener(btn, EVENTS.CLICK, () => this.addSectionMedia(s)) })

    // Section text editing
    all('.sec-text-input', (ta) => {
      const s = parseInt(ta.getAttribute(ATTRS.DATA_SEC), 10)
      const t = parseInt(ta.getAttribute('data-tidx'), 10)
      this.addScopedListener(ta, EVENTS.INPUT, (e) => {
        this._ensureSectionShape(s)
        this.currentProject.sections[s].texts[t] = e.target.value
      })
    })
    all('.sec-text-del', (btn) => {
      const s = parseInt(btn.getAttribute(ATTRS.DATA_SEC), 10)
      const t = parseInt(btn.getAttribute('data-tidx'), 10)
      this.addScopedListener(btn, EVENTS.CLICK, () => this.removeSectionText(s, t))
    })

    // Media field editing
    all('.media-src', (inp) => {
      const s = parseInt(inp.getAttribute(ATTRS.DATA_SEC), 10); const m = parseInt(inp.getAttribute(ATTRS.DATA_MIDX), 10)
      this.addScopedListener(inp, EVENTS.INPUT, (e) => { this.currentProject.sections[s].media[m].src = e.target.value; this._updateDom() })
    })
    all('.media-label', (inp) => {
      const s = parseInt(inp.getAttribute(ATTRS.DATA_SEC), 10); const m = parseInt(inp.getAttribute(ATTRS.DATA_MIDX), 10)
      this.addScopedListener(inp, EVENTS.INPUT, (e) => { this.currentProject.sections[s].media[m].label = e.target.value })
    })
    all('.media-type', (sel) => {
      const s = parseInt(sel.getAttribute(ATTRS.DATA_SEC), 10); const m = parseInt(sel.getAttribute(ATTRS.DATA_MIDX), 10)
      this.addScopedListener(sel, EVENTS.CHANGE, (e) => { this.currentProject.sections[s].media[m].isVideo = e.target.value === 'true' })
    })
    all('.media-w', (inp) => {
      const s = parseInt(inp.getAttribute(ATTRS.DATA_SEC), 10); const m = parseInt(inp.getAttribute(ATTRS.DATA_MIDX), 10)
      this.addScopedListener(inp, EVENTS.INPUT, (e) => { this.currentProject.sections[s].media[m].size[0] = parseInt(e.target.value, 10) || MEDIA_DIMENSIONS.FHD_WIDTH })
    })
    all('.media-h', (inp) => {
      const s = parseInt(inp.getAttribute(ATTRS.DATA_SEC), 10); const m = parseInt(inp.getAttribute(ATTRS.DATA_MIDX), 10)
      this.addScopedListener(inp, EVENTS.INPUT, (e) => { this.currentProject.sections[s].media[m].size[1] = parseInt(e.target.value, 10) || MEDIA_DIMENSIONS.FHD_HEIGHT })
    })
    all('.media-del', (btn) => {
      const s = parseInt(btn.getAttribute(ATTRS.DATA_SEC), 10); const m = parseInt(btn.getAttribute(ATTRS.DATA_MIDX), 10)
      this.addScopedListener(btn, EVENTS.CLICK, () => this.removeSectionMedia(s, m))
    })
  }

  render() {
    const p = this.currentProject

    const root = h(TAGS.DIV, { class: 'cms-projects-manager' },
      // ── Header ──────────────────────────────────────────────────────────────
      h(TAGS.DIV, { class: 'cms-card cms-card--header' },
        h(TAGS.DIV, null,
          h('h2', { class: 'cms-card-title' }, 'Project Case Studies Manager'),
          h(TAGS.P, { class: 'cms-card-subtitle' }, 'Manage sections, text paragraphs, and image/video carousels for all project case studies.'),
        ),
        h(TAGS.DIV, { class: 'cms-btn-group' },
          h(TAGS.BUTTON, { id: 'btn-create-proj', class: CMS_CLASSES.CMS_BTN_SECONDARY, type: 'button' }, '+ Create New Project'),
          h(TAGS.BUTTON, { id: 'btn-delete-proj', class: CMS_CLASSES.CMS_BTN_DANGER, type: 'button', disabled: !this.selectedProjectKey }, '🗑️ Delete Project'),
          h(TAGS.BUTTON, { id: 'btn-save-proj', class: CMS_CLASSES.CMS_BTN, type: 'button', disabled: this.saving || !p }, this.saving ? 'Saving...' : '💾 Save Project to Firebase'),
        ),
      ),

      // ── Selectors ────────────────────────────────────────────────────────────
      h(TAGS.DIV, { class: CMS_CLASSES.CMS_CARD },
        h(TAGS.DIV, { class: 'cms-field-row' },
          h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
            h(TAGS.LABEL, null, 'Target Language'),
            h(TAGS.SELECT, { id: 'select-proj-lang', class: CMS_CLASSES.CMS_SELECT },
              ...this.languages.map((l) =>
                h(TAGS.OPTION, { value: l, selected: this.selectedLang === l ? '' : null }, l.toUpperCase())
              ),
            ),
          ),
          h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
            h(TAGS.LABEL, null, `Select Project (${this.projectKeys.length} total)`),
            h(TAGS.SELECT, { id: 'select-proj-key', class: CMS_CLASSES.CMS_SELECT },
              ...this.projectKeys.map((pk) =>
                h(TAGS.OPTION, { value: pk, selected: this.selectedProjectKey === pk ? '' : null }, pk.toUpperCase())
              ),
            ),
          ),
        ),
      ),

      // ── Project Editor ───────────────────────────────────────────────────────
      p ? h(TAGS.DIV, null,
        // Basic fields
        h(TAGS.DIV, { class: CMS_CLASSES.CMS_CARD },
          h(TAGS.H3, { class: CMS_CLASSES.CMS_SECTION_TITLE }, `Editing: [${this.selectedProjectKey.toUpperCase()}] — ${this.selectedLang.toUpperCase()}`),
          h(TAGS.DIV, { class: 'cms-field-row' },
            h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
              h(TAGS.LABEL, null, 'Project Title'),
              h(TAGS.INPUT, { id: 'proj-title-input', class: CMS_CLASSES.CMS_INPUT, value: p.title || '', placeholder: 'METCHA' }),
            ),
            h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
              h(TAGS.LABEL, null, 'Assets Folder'),
              h(TAGS.INPUT, { id: 'proj-folder-input', class: CMS_CLASSES.CMS_INPUT, value: p.folder || '', placeholder: 'metcha/' }),
            ),
            h(TAGS.DIV, { class: 'cms-field-group cms-field-group--small' },
              h(TAGS.LABEL, null, 'SEO'),
              h(TAGS.LABEL, { class: 'cms-checkbox-label' },
                h(TAGS.INPUT, { id: 'proj-noindex', type: 'checkbox', checked: p.seo?.noIndex ? '' : null }),
                ' noIndex',
              ),
            ),
          ),
        ),

        // Cover
        h(TAGS.DIV, { class: CMS_CLASSES.CMS_CARD },
          h(TAGS.H3, { class: CMS_CLASSES.CMS_SECTION_TITLE }, 'Cover Image / Video'),
          h(TAGS.DIV, { class: 'cms-cover-layout' },
            p.cover?.src
              ? h('img', {
                  src: gcs(`${p.folder || ''}${p.cover.src}`),
                  class: 'cms-cover-thumb', alt: 'cover', loading: 'lazy',
                })
              : h(TAGS.DIV, { class: 'cms-media-thumb-placeholder' }, '🖼️'),
            h(TAGS.DIV, { class: 'cms-cover-fields' },
              h(TAGS.DIV, { class: 'cms-field-row' },
                h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
                  h(TAGS.LABEL, null, 'Filename (no ext)'),
                  h(TAGS.INPUT, { id: 'cover-src-input', class: CMS_CLASSES.CMS_INPUT, value: p.cover?.src || 'cover', placeholder: 'cover' }),
                ),
                h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
                  h(TAGS.LABEL, null, 'Label / Alt'),
                  h(TAGS.INPUT, { id: 'cover-label-input', class: CMS_CLASSES.CMS_INPUT, value: p.cover?.label || '', placeholder: 'Cover image label' }),
                ),
                h(TAGS.DIV, { class: 'cms-field-group cms-field-group--small' },
                  h(TAGS.LABEL, null, 'Type'),
                  h(TAGS.SELECT, { id: 'cover-isvideo', class: CMS_CLASSES.CMS_SELECT },
                    h(TAGS.OPTION, { value: 'false', selected: !p.cover?.isVideo ? '' : null }, 'Image'),
                    h(TAGS.OPTION, { value: 'true', selected: p.cover?.isVideo ? '' : null }, 'Video'),
                  ),
                ),
              ),
              h(TAGS.DIV, { class: 'cms-field-row' },
                h(TAGS.DIV, { class: 'cms-field-group cms-field-group--small' },
                  h(TAGS.LABEL, null, 'Width'),
                  h(TAGS.INPUT, { id: 'cover-w-input', class: CMS_CLASSES.CMS_INPUT, value: String((p.cover?.size && p.cover.size[0]) || MEDIA_DIMENSIONS.FHD_WIDTH) }),
                ),
                h(TAGS.DIV, { class: 'cms-field-group cms-field-group--small' },
                  h(TAGS.LABEL, null, 'Height'),
                  h(TAGS.INPUT, { id: 'cover-h-input', class: CMS_CLASSES.CMS_INPUT, value: String((p.cover?.size && p.cover.size[1]) || 798) }),
                ),
              ),
            ),
          ),
        ),

        // Sections
        h(TAGS.DIV, { class: CMS_CLASSES.CMS_CARD },
          h(TAGS.DIV, { class: 'cms-section-header' },
            h(TAGS.H3, { class: CMS_CLASSES.CMS_SECTION_TITLE }, `Sections & Paragraphs (${(p.sections || []).length})`),
            h(TAGS.BUTTON, { id: 'btn-add-section', class: CMS_CLASSES.CMS_BTN_SECONDARY, type: 'button' }, '+ Add Section'),
          ),
          h(TAGS.DIV, { class: 'cms-sections-list' },
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

if (!customElements.get(CMS_TAGS.CMS_PROJECTS_LIST)) {
  customElements.define(CMS_TAGS.CMS_PROJECTS_LIST, CmsProjectsList)
}
