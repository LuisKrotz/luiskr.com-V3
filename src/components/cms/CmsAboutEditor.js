import { BaseComponent } from '../../core/Component.js'
import { getDbInstance } from '../../firebase.js'
import { ref, child, get, set } from 'firebase/database'
import { h } from '../../core/jsx.js'
import cmsStyles from '../../sass/cms.scss?inline'

const LANGS = ['en', 'br', 'es', 'de', 'hrk', 'cas', 'riv', 'gn', 'it', 'ru', 'fr', 'tln']
const SIZE_PRESETS = [150, 200, 256, 300, 400, 512]

async function emailToGravatarHash(email) {
  const normalized = email.trim().toLowerCase()
  const msgBuf = new TextEncoder().encode(normalized)
  const hashBuf = await crypto.subtle.digest('SHA-256', msgBuf)
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export class CmsAboutEditor extends BaseComponent {
  constructor() {
    super(cmsStyles)
    this.languages = LANGS
    this.selectedLang = 'en'
    this.gravatarSize = 512
    this.emailInput = ''
    this.saving = false
    this.syncingAll = false
    this.aboutData = {
      title: 'About',
      profilePicture: '',
      col1: [],
      col2: [],
      mentions: 'Some mentions',
      mention_items: [],
    }
  }

  onMounted() {
    this.loadAboutData()
  }

  onUpdated() {
    this._bindEvents()
  }

  // ─── Data loading ──────────────────────────────────────────────────────────
  async loadAboutData() {
    try {
      const db = await getDbInstance()
      const snap = await get(child(ref(db), `translations/${this.selectedLang}/pages/about`))
      if (snap.exists()) {
        const val = snap.val()
        const rawUrl = val.profilePicture || ''
        const sizeMatch = rawUrl.match(/[?&]s=(\d+)/)
        if (sizeMatch) this.gravatarSize = parseInt(sizeMatch[1], 10)
        this.aboutData = {
          title: val.title || 'About',
          profilePicture: rawUrl,
          col1: Array.isArray(val.col1) ? [...val.col1] : [],
          col2: Array.isArray(val.col2) ? [...val.col2] : [],
          mentions: val.mentions || 'Some mentions',
          mention_items: Array.isArray(val.mention_items) ? [...val.mention_items] : [],
        }
      }
      this._updateDom()
    } catch (err) {
      console.error('Error loading about data:', err)
    }
  }

  // ─── Gravatar helpers ──────────────────────────────────────────────────────
  setGravatarSize(size) {
    this.gravatarSize = size
    const base = this.aboutData.profilePicture.replace(/[?&]s=\d+/, '').replace(/\?$/, '')
    this.aboutData.profilePicture = base + `?s=${size}`
    this._updateDom()
  }

  async generateGravatarUrl() {
    if (!this.emailInput.trim()) return
    const hash = await emailToGravatarHash(this.emailInput)
    this.aboutData.profilePicture = `https://www.gravatar.com/avatar/${hash}?s=${this.gravatarSize}`
    this._updateDom()
  }

  // ─── Paragraph editors ─────────────────────────────────────────────────────
  addParagraph(col) {
    this.aboutData[col] = [...(this.aboutData[col] || []), '']
    this._updateDom()
  }

  removeParagraph(col, idx) {
    this.aboutData[col] = this.aboutData[col].filter((_, i) => i !== idx)
    this._updateDom()
  }

  moveParagraph(col, idx, dir) {
    const arr = [...this.aboutData[col]]
    const target = idx + dir
    if (target < 0 || target >= arr.length) return
    ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
    this.aboutData[col] = arr
    this._updateDom()
  }

  // ─── Mention items ─────────────────────────────────────────────────────────
  addMentionItem() {
    this.aboutData.mention_items = [
      ...(this.aboutData.mention_items || []),
      { description: '', link: '', icon: '' },
    ]
    this._updateDom()
  }

  removeMentionItem(idx) {
    this.aboutData.mention_items = this.aboutData.mention_items.filter((_, i) => i !== idx)
    this._updateDom()
  }

  moveMentionItem(idx, dir) {
    const arr = [...(this.aboutData.mention_items || [])]
    const target = idx + dir
    if (target < 0 || target >= arr.length) return
    ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
    this.aboutData.mention_items = arr
    this._updateDom()
  }

  // ─── Sync operations ───────────────────────────────────────────────────────
  async applyPictureToAllLangs() {
    if (!confirm(`Apply current profile picture URL and size (${this.gravatarSize}px) to ALL ${this.languages.length} languages?`)) return
    this.syncingAll = true
    this._updateDom()
    try {
      const db = await getDbInstance()
      for (const lang of this.languages) {
        if (lang === this.selectedLang) continue
        await set(ref(db, `translations/${lang}/pages/about/profilePicture`), this.aboutData.profilePicture)
      }
      this._notify(`Profile picture synced to all ${this.languages.length} languages!`)
    } catch (err) {
      alert('Sync failed: ' + (err.message || err))
    } finally {
      this.syncingAll = false
      this._updateDom()
    }
  }

  async syncNonLocalizedToAllLangs() {
    if (!confirm(`Sync profile picture and awards items to ALL ${this.languages.length} languages? Localized text (bio, title) will be preserved.`)) return
    this.syncingAll = true
    this._updateDom()
    try {
      const db = await getDbInstance()
      for (const lang of this.languages) {
        if (lang === this.selectedLang) continue
        const snap = await get(child(ref(db), `translations/${lang}/pages/about`))
        const existing = snap.exists() ? snap.val() : {}
        await set(ref(db, `translations/${lang}/pages/about`), {
          ...existing,
          profilePicture: this.aboutData.profilePicture,
          mentions: this.aboutData.mentions,
          mention_items: this.aboutData.mention_items,
        })
      }
      this._notify('Non-localized fields (picture + awards) synced across all languages!')
    } catch (err) {
      alert('Sync failed: ' + (err.message || err))
    } finally {
      this.syncingAll = false
      this._updateDom()
    }
  }

  // ─── Save ──────────────────────────────────────────────────────────────────
  async saveAboutData() {
    this.saving = true
    this._updateDom()
    try {
      const db = await getDbInstance()
      await set(ref(db, `translations/${this.selectedLang}/pages/about`), this.aboutData)
      this._notify(`About section [${this.selectedLang.toUpperCase()}] saved!`)
    } catch (err) {
      alert('Failed to save: ' + (err.message || err))
    } finally {
      this.saving = false
      this._updateDom()
    }
  }

  _notify(msg) {
    this.dispatchEvent(new CustomEvent('notify', { bubbles: true, composed: true, detail: msg }))
  }

  // ─── Events ────────────────────────────────────────────────────────────────
  _bindEvents() {
    const on = (sel, ev, fn) => { const el = this.$(sel); if (el) this.addScopedListener(el, ev, fn) }
    const all = (sel, fn) => this.$$(sel).forEach(fn)

    on('#btn-save-about', 'click', () => this.saveAboutData())
    on('#btn-sync-picture', 'click', () => this.applyPictureToAllLangs())
    on('#btn-sync-all', 'click', () => this.syncNonLocalizedToAllLangs())
    on('#btn-gen-gravatar', 'click', () => this.generateGravatarUrl())
    on('#select-about-lang', 'change', (e) => { this.selectedLang = e.target.value; this.loadAboutData() })
    on('#about-title-input', 'input', (e) => { this.aboutData.title = e.target.value })
    on('#about-mentions-title', 'input', (e) => { this.aboutData.mentions = e.target.value })
    on('#email-gravatar-input', 'input', (e) => { this.emailInput = e.target.value })
    on('#about-size-input', 'input', (e) => { this.setGravatarSize(parseInt(e.target.value, 10) || 512) })
    on('#about-pic-input', 'input', (e) => {
      this.aboutData.profilePicture = e.target.value
      const previewImg = this.$('#gravatar-preview')
      if (previewImg) previewImg.src = e.target.value
    })

    all('.size-preset-btn', (btn) => {
      const size = parseInt(btn.getAttribute('data-size'), 10)
      this.addScopedListener(btn, 'click', () => this.setGravatarSize(size))
    })
    all('.col-add-btn', (btn) => {
      const col = btn.getAttribute('data-col')
      this.addScopedListener(btn, 'click', () => this.addParagraph(col))
    })
    all('.para-input', (ta) => {
      const col = ta.getAttribute('data-col')
      const idx = parseInt(ta.getAttribute('data-idx'), 10)
      this.addScopedListener(ta, 'input', (e) => { if (this.aboutData[col]) this.aboutData[col][idx] = e.target.value })
    })
    all('.para-remove-btn', (btn) => {
      const col = btn.getAttribute('data-col')
      const idx = parseInt(btn.getAttribute('data-idx'), 10)
      this.addScopedListener(btn, 'click', () => this.removeParagraph(col, idx))
    })
    all('.para-up-btn', (btn) => {
      const col = btn.getAttribute('data-col'); const idx = parseInt(btn.getAttribute('data-idx'), 10)
      this.addScopedListener(btn, 'click', () => this.moveParagraph(col, idx, -1))
    })
    all('.para-down-btn', (btn) => {
      const col = btn.getAttribute('data-col'); const idx = parseInt(btn.getAttribute('data-idx'), 10)
      this.addScopedListener(btn, 'click', () => this.moveParagraph(col, idx, 1))
    })

    on('#btn-add-mention', 'click', () => this.addMentionItem())
    all('.mention-field', (inp) => {
      const idx = parseInt(inp.getAttribute('data-idx'), 10)
      const field = inp.getAttribute('data-field')
      this.addScopedListener(inp, 'input', (e) => {
        if (this.aboutData.mention_items[idx]) this.aboutData.mention_items[idx][field] = e.target.value
      })
    })
    all('.mention-remove-btn', (btn) => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10)
      this.addScopedListener(btn, 'click', () => this.removeMentionItem(idx))
    })
    all('.mention-up-btn', (btn) => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10)
      this.addScopedListener(btn, 'click', () => this.moveMentionItem(idx, -1))
    })
    all('.mention-down-btn', (btn) => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10)
      this.addScopedListener(btn, 'click', () => this.moveMentionItem(idx, 1))
    })
  }

  // ─── Render helpers ────────────────────────────────────────────────────────
  _renderParagraphList(col) {
    const arr = this.aboutData[col] || []
    return h('div', { class: 'cms-para-list' },
      ...arr.map((p, idx) =>
        h('div', { class: 'cms-para-item' },
          h('div', { class: 'cms-para-controls' },
            h('button', { class: 'cms-btn cms-btn--secondary para-up-btn', 'data-col': col, 'data-idx': idx, type: 'button', disabled: idx === 0 ? '' : null }, '▲'),
            h('button', { class: 'cms-btn cms-btn--secondary para-down-btn', 'data-col': col, 'data-idx': idx, type: 'button', disabled: idx === arr.length - 1 ? '' : null }, '▼'),
            h('button', { class: 'cms-btn cms-btn--danger para-remove-btn', 'data-col': col, 'data-idx': idx, type: 'button' }, '✕'),
          ),
          h('textarea', { class: 'cms-textarea para-input', 'data-col': col, 'data-idx': idx, rows: '3', innerHTML: p }),
        )
      ),
      h('button', { class: 'cms-btn cms-btn--secondary col-add-btn', 'data-col': col, type: 'button' }, '+ Add Paragraph'),
    )
  }

  _renderMentionItems() {
    const items = this.aboutData.mention_items || []
    return h('div', { class: 'cms-mention-list' },
      ...items.map((item, idx) =>
        h('div', { class: 'cms-card cms-mention-item' },
          h('div', { class: 'cms-item-header' },
            h('span', { class: 'cms-item-label' }, `#${idx + 1}`),
            h('div', { class: 'cms-item-controls' },
              h('button', { class: 'cms-btn cms-btn--secondary mention-up-btn', 'data-idx': idx, type: 'button', disabled: idx === 0 ? '' : null }, '▲'),
              h('button', { class: 'cms-btn cms-btn--secondary mention-down-btn', 'data-idx': idx, type: 'button', disabled: idx === items.length - 1 ? '' : null }, '▼'),
              h('button', { class: 'cms-btn cms-btn--danger mention-remove-btn', 'data-idx': idx, type: 'button' }, '✕'),
            ),
          ),
          h('div', { class: 'cms-field-row' },
            h('div', { class: 'cms-field-group' },
              h('label', null, 'Description'),
              h('input', { class: 'cms-input mention-field', 'data-idx': idx, 'data-field': 'description', value: item.description || '', placeholder: 'e.g. Site of the Day' }),
            ),
            h('div', { class: 'cms-field-group' },
              h('label', null, 'Link URL'),
              h('input', { class: 'cms-input mention-field', 'data-idx': idx, 'data-field': 'link', value: item.link || '', placeholder: 'https://...' }),
            ),
            h('div', { class: 'cms-field-group cms-field-group--small' },
              h('label', null, 'Icon / Emoji'),
              h('input', { class: 'cms-input mention-field', 'data-idx': idx, 'data-field': 'icon', value: item.icon || '', placeholder: '🏆' }),
            ),
          ),
        )
      ),
      h('button', { id: 'btn-add-mention', class: 'cms-btn cms-btn--secondary', type: 'button' }, '+ Add Award / Mention'),
    )
  }

  // ─── render() ─────────────────────────────────────────────────────────────
  render() {
    const picUrl = this.aboutData.profilePicture || ''

    return h('div', { class: 'cms-about-manager' },
      // Header
      h('div', { class: 'cms-card cms-card--header' },
        h('div', null,
          h('h2', { class: 'cms-card-title' }, 'About Section & Gravatar Editor'),
          h('p', { class: 'cms-card-subtitle' }, 'Manage your bio, Gravatar profile picture, intro text, and awards/mentions.'),
        ),
        h('div', { class: 'cms-btn-group' },
          h('button', { id: 'btn-sync-all', class: 'cms-btn cms-btn--secondary', type: 'button', disabled: this.syncingAll ? '' : null },
            this.syncingAll ? 'Syncing...' : '🔄 Sync All Non-Localized (Gravatar + Awards)'),
          h('button', { id: 'btn-save-about', class: 'cms-btn', type: 'button', disabled: this.saving ? '' : null },
            this.saving ? 'Saving...' : '💾 Save to Firebase'),
        ),
      ),

      // Language selector
      h('div', { class: 'cms-card cms-card--lang' },
        h('label', { class: 'cms-label' }, 'Target Language:'),
        h('select', { id: 'select-about-lang', class: 'cms-select' },
          ...this.languages.map((l) =>
            h('option', { value: l, selected: this.selectedLang === l ? '' : null }, l.toUpperCase())
          ),
        ),
      ),

      // Profile Picture & Gravatar
      h('div', { class: 'cms-card' },
        h('div', { class: 'cms-section-header' },
          h('div', null,
            h('h3', { class: 'cms-section-title' }, 'Profile Picture & Gravatar'),
            h('p', { class: 'cms-card-subtitle' }, 'Non-localized: same URL using per-language profile.'),
          ),
          h('button', { id: 'btn-sync-picture', class: 'cms-btn cms-btn--secondary', type: 'button', disabled: this.syncingAll ? '' : null },
            '🔄 Apply Picture & Size to All Languages'),
        ),
        h('div', { class: 'cms-gravatar-layout' },
          h('div', { class: 'cms-gravatar-preview' },
            picUrl
              ? h('img', { id: 'gravatar-preview', src: picUrl, alt: 'Gravatar Preview', class: 'cms-gravatar-img', loading: 'lazy' })
              : h('div', { class: 'cms-gravatar-placeholder' }, '👤'),
            h('span', { class: 'cms-gravatar-label' }, 'Live Preview'),
          ),
          h('div', { class: 'cms-gravatar-controls' },
            h('div', { class: 'cms-field-group' },
              h('label', null, 'Profile Picture URL'),
              h('input', { id: 'about-pic-input', class: 'cms-input', value: picUrl, placeholder: 'https://www.gravatar.com/avatar/...' }),
            ),
            h('div', { class: 'cms-field-row cms-field-row--align' },
              h('div', { class: 'cms-field-group' },
                h('label', null, 'Gravatar Image Size (px)'),
                h('input', { id: 'about-size-input', class: 'cms-input cms-input--short', type: 'number', value: String(this.gravatarSize) }),
              ),
              h('div', { class: 'cms-field-group' },
                h('label', null, 'Quick presets:'),
                h('div', { class: 'cms-preset-row' },
                  ...SIZE_PRESETS.map((s) =>
                    h('button', {
                      class: `cms-btn cms-btn--preset size-preset-btn${s === this.gravatarSize ? ' cms-btn--active' : ''}`,
                      'data-size': s, type: 'button',
                    }, `${s}px`)
                  ),
                ),
              ),
            ),
            h('div', { class: 'cms-field-row' },
              h('input', { id: 'email-gravatar-input', class: 'cms-input', placeholder: 'Enter email to generate Gravatar URL', value: this.emailInput }),
              h('button', { id: 'btn-gen-gravatar', class: 'cms-btn cms-btn--secondary', type: 'button' }, 'Generate Gravatar URL'),
            ),
            h('p', { class: 'cms-hint' }, 'Changing size updates the ?s= query parameter on the URL in real-time. Click "Apply Picture & Size to All Languages" to sync it across all languages immediately.'),
          ),
        ),
      ),

      // Title & Intro Callout
      h('div', { class: 'cms-card' },
        h('h3', { class: 'cms-section-title' }, `Title & Intro Callout [${this.selectedLang.toUpperCase()}]`),
        h('div', { class: 'cms-field-group' },
          h('label', null, 'Section Title'),
          h('input', { id: 'about-title-input', class: 'cms-input', value: this.aboutData.title || '', placeholder: 'About me' }),
        ),
      ),

      // Bio Column 1
      h('div', { class: 'cms-card' },
        h('h3', { class: 'cms-section-title' }, `Left Column Paragraphs [${this.selectedLang.toUpperCase()}]`),
        this._renderParagraphList('col1'),
      ),

      // Bio Column 2
      h('div', { class: 'cms-card' },
        h('h3', { class: 'cms-section-title' }, `Right Column Paragraphs [${this.selectedLang.toUpperCase()}]`),
        this._renderParagraphList('col2'),
      ),

      // Awards & Mentions
      h('div', { class: 'cms-card' },
        h('h3', { class: 'cms-section-title' }, 'Awards & Mentions (Non-localized)'),
        h('div', { class: 'cms-field-group' },
          h('label', null, 'Section Title'),
          h('input', { id: 'about-mentions-title', class: 'cms-input', value: this.aboutData.mentions || '', placeholder: 'Some mentions' }),
        ),
        this._renderMentionItems(),
      ),
    )
  }
}

if (!customElements.get('cms-about-editor')) {
  customElements.define('cms-about-editor', CmsAboutEditor)
}
