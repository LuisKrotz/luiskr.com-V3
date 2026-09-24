import { CMS_CLASSES, CMS_TAGS, CMS_EVENTS } from "../../core/cms/tokens.js"
import { BaseComponent } from '../../core/Component.js'
import { getDbInstance } from '../../firebase.js'
import { ref, child, get, set } from 'firebase/database'
import { h } from '../../core/jsx.js'
import { TAGS, ATTRS, EVENTS, STRINGS, LOCALES, TEXT, PATHS } from "../../core/constants.js"
import { VALID_LANGS } from '../../core/i18n.js'
import cmsStyles from '../../sass/cms.scss?inline'

const SIZE_PRESETS = Object.freeze([150, 200, 256, 300, 400, 512])

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
    this.languages = VALID_LANGS
    this.selectedLang = LOCALES.EN
    this.gravatarSize = 512
    this.emailInput = ''
    this.saving = false
    this.syncingAll = false
    this.aboutData = {
      title: TEXT.ABOUT,
      profilePicture: STRINGS.EMPTY,
      col1: [],
      col2: [],
      mentions: TEXT.SOME_MENTIONS,
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
      const snap = await get(child(ref(db), `${PATHS.TRANSLATIONS}${this.selectedLang}/pages/about`))
      if (snap.exists()) {
        const val = snap.val()
        const rawUrl = val.profilePicture || STRINGS.EMPTY
        const sizeMatch = rawUrl.match(/[?&]s=(\d+)/)
        if (sizeMatch) this.gravatarSize = parseInt(sizeMatch[1], 10)
        this.aboutData = {
          title: val.title || TEXT.ABOUT,
          profilePicture: rawUrl,
          col1: Array.isArray(val.col1) ? [...val.col1] : [],
          col2: Array.isArray(val.col2) ? [...val.col2] : [],
          mentions: val.mentions || TEXT.SOME_MENTIONS,
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
        await set(ref(db, `${PATHS.TRANSLATIONS}${lang}/pages/about/profilePicture`), this.aboutData.profilePicture)
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
        const snap = await get(child(ref(db), `${PATHS.TRANSLATIONS}${lang}/pages/about`))
        const existing = snap.exists() ? snap.val() : {}
        await set(ref(db, `${PATHS.TRANSLATIONS}${lang}/pages/about`), {
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
      await set(ref(db, `${PATHS.TRANSLATIONS}${this.selectedLang}/pages/about`), this.aboutData)
      this._notify(`About section [${this.selectedLang.toUpperCase()}] saved!`)
    } catch (err) {
      alert('Failed to save: ' + (err.message || err))
    } finally {
      this.saving = false
      this._updateDom()
    }
  }

  _notify(msg) {
    this.dispatchEvent(new CustomEvent(CMS_EVENTS.NOTIFY, { bubbles: true, composed: true, detail: msg }))
  }

  // ─── Events ────────────────────────────────────────────────────────────────
  _bindEvents() {
    const on = (sel, ev, fn) => { const el = this.$(sel); if (el) this.addScopedListener(el, ev, fn) }
    const all = (sel, fn) => this.$$(sel).forEach(fn)

    on('#btn-save-about', EVENTS.CLICK, () => this.saveAboutData())
    on('#btn-sync-picture', EVENTS.CLICK, () => this.applyPictureToAllLangs())
    on('#btn-sync-all', EVENTS.CLICK, () => this.syncNonLocalizedToAllLangs())
    on('#btn-gen-gravatar', EVENTS.CLICK, () => this.generateGravatarUrl())
    on('#select-about-lang', EVENTS.CHANGE, (e) => { this.selectedLang = e.target.value; this.loadAboutData() })
    on('#about-title-input', EVENTS.INPUT, (e) => { this.aboutData.title = e.target.value })
    on('#about-mentions-title', EVENTS.INPUT, (e) => { this.aboutData.mentions = e.target.value })
    on('#email-gravatar-input', EVENTS.INPUT, (e) => { this.emailInput = e.target.value })
    on('#about-size-input', EVENTS.INPUT, (e) => { this.setGravatarSize(parseInt(e.target.value, 10) || 512) })
    on('#about-pic-input', EVENTS.INPUT, (e) => {
      this.aboutData.profilePicture = e.target.value
      const previewImg = this.$('#gravatar-preview')
      if (previewImg) previewImg.src = e.target.value
    })

    all('.size-preset-btn', (btn) => {
      const size = parseInt(btn.getAttribute(ATTRS.DATA_SIZE), 10)
      this.addScopedListener(btn, EVENTS.CLICK, () => this.setGravatarSize(size))
    })
    all('.col-add-btn', (btn) => {
      const col = btn.getAttribute(ATTRS.DATA_COL)
      this.addScopedListener(btn, EVENTS.CLICK, () => this.addParagraph(col))
    })
    all('.para-input', (ta) => {
      const col = ta.getAttribute(ATTRS.DATA_COL)
      const idx = parseInt(ta.getAttribute(ATTRS.DATA_IDX), 10)
      this.addScopedListener(ta, EVENTS.INPUT, (e) => { if (this.aboutData[col]) this.aboutData[col][idx] = e.target.value })
    })
    all('.para-remove-btn', (btn) => {
      const col = btn.getAttribute(ATTRS.DATA_COL)
      const idx = parseInt(btn.getAttribute(ATTRS.DATA_IDX), 10)
      this.addScopedListener(btn, EVENTS.CLICK, () => this.removeParagraph(col, idx))
    })
    all('.para-up-btn', (btn) => {
      const col = btn.getAttribute(ATTRS.DATA_COL); const idx = parseInt(btn.getAttribute(ATTRS.DATA_IDX), 10)
      this.addScopedListener(btn, EVENTS.CLICK, () => this.moveParagraph(col, idx, -1))
    })
    all('.para-down-btn', (btn) => {
      const col = btn.getAttribute(ATTRS.DATA_COL); const idx = parseInt(btn.getAttribute(ATTRS.DATA_IDX), 10)
      this.addScopedListener(btn, EVENTS.CLICK, () => this.moveParagraph(col, idx, 1))
    })

    on('#btn-add-mention', EVENTS.CLICK, () => this.addMentionItem())
    all('.mention-field', (inp) => {
      const idx = parseInt(inp.getAttribute(ATTRS.DATA_IDX), 10)
      const field = inp.getAttribute(ATTRS.DATA_FIELD)
      this.addScopedListener(inp, EVENTS.INPUT, (e) => {
        if (this.aboutData.mention_items[idx]) this.aboutData.mention_items[idx][field] = e.target.value
      })
    })
    all('.mention-remove-btn', (btn) => {
      const idx = parseInt(btn.getAttribute(ATTRS.DATA_IDX), 10)
      this.addScopedListener(btn, EVENTS.CLICK, () => this.removeMentionItem(idx))
    })
    all('.mention-up-btn', (btn) => {
      const idx = parseInt(btn.getAttribute(ATTRS.DATA_IDX), 10)
      this.addScopedListener(btn, EVENTS.CLICK, () => this.moveMentionItem(idx, -1))
    })
    all('.mention-down-btn', (btn) => {
      const idx = parseInt(btn.getAttribute(ATTRS.DATA_IDX), 10)
      this.addScopedListener(btn, EVENTS.CLICK, () => this.moveMentionItem(idx, 1))
    })
  }

  // ─── Render helpers ────────────────────────────────────────────────────────
  _renderParagraphList(col) {
    const arr = this.aboutData[col] || []
    return h(TAGS.DIV, { class: 'cms-para-list' },
      ...arr.map((p, idx) =>
        h(TAGS.DIV, { class: 'cms-para-item' },
          h(TAGS.DIV, { class: 'cms-para-controls' },
            h(TAGS.BUTTON, { class: 'cms-btn cms-btn--secondary para-up-btn', [ATTRS.DATA_COL]: col, [ATTRS.DATA_IDX]: idx, type: 'button', disabled: idx === 0 ? '' : null }, '▲'),
            h(TAGS.BUTTON, { class: 'cms-btn cms-btn--secondary para-down-btn', [ATTRS.DATA_COL]: col, [ATTRS.DATA_IDX]: idx, type: 'button', disabled: idx === arr.length - 1 ? '' : null }, '▼'),
            h(TAGS.BUTTON, { class: 'cms-btn cms-btn--danger para-remove-btn', [ATTRS.DATA_COL]: col, [ATTRS.DATA_IDX]: idx, type: 'button' }, '✕'),
          ),
          h(TAGS.TEXTAREA, { class: 'cms-textarea para-input', [ATTRS.DATA_COL]: col, [ATTRS.DATA_IDX]: idx, rows: '3', innerHTML: p }),
        )
      ),
      h(TAGS.BUTTON, { class: 'cms-btn cms-btn--secondary col-add-btn', [ATTRS.DATA_COL]: col, type: 'button' }, '+ Add Paragraph'),
    )
  }

  _renderMentionItems() {
    const items = this.aboutData.mention_items || []
    return h(TAGS.DIV, { class: 'cms-mention-list' },
      ...items.map((item, idx) =>
        h(TAGS.DIV, { class: 'cms-card cms-mention-item' },
          h(TAGS.DIV, { class: 'cms-item-header' },
            h(TAGS.SPAN, { class: 'cms-item-label' }, `#${idx + 1}`),
            h(TAGS.DIV, { class: 'cms-item-controls' },
              h(TAGS.BUTTON, { class: 'cms-btn cms-btn--secondary mention-up-btn', [ATTRS.DATA_IDX]: idx, type: 'button', disabled: idx === 0 ? '' : null }, '▲'),
              h(TAGS.BUTTON, { class: 'cms-btn cms-btn--secondary mention-down-btn', [ATTRS.DATA_IDX]: idx, type: 'button', disabled: idx === items.length - 1 ? '' : null }, '▼'),
              h(TAGS.BUTTON, { class: 'cms-btn cms-btn--danger mention-remove-btn', [ATTRS.DATA_IDX]: idx, type: 'button' }, '✕'),
            ),
          ),
          h(TAGS.DIV, { class: 'cms-field-row' },
            h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
              h(TAGS.LABEL, null, 'Description'),
              h(TAGS.INPUT, { class: 'cms-input mention-field', [ATTRS.DATA_IDX]: idx, 'data-field': 'description', value: item.description || '', placeholder: 'e.g. Site of the Day' }),
            ),
            h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
              h(TAGS.LABEL, null, 'Link URL'),
              h(TAGS.INPUT, { class: 'cms-input mention-field', [ATTRS.DATA_IDX]: idx, 'data-field': 'link', value: item.link || '', placeholder: 'https://...' }),
            ),
            h(TAGS.DIV, { class: 'cms-field-group cms-field-group--small' },
              h(TAGS.LABEL, null, 'Icon / Emoji'),
              h(TAGS.INPUT, { class: 'cms-input mention-field', [ATTRS.DATA_IDX]: idx, 'data-field': 'icon', value: item.icon || '', placeholder: '🏆' }),
            ),
          ),
        )
      ),
      h(TAGS.BUTTON, { id: 'btn-add-mention', class: CMS_CLASSES.CMS_BTN_SECONDARY, type: 'button' }, '+ Add Award / Mention'),
    )
  }

  // ─── render() ─────────────────────────────────────────────────────────────
  render() {
    const picUrl = this.aboutData.profilePicture || STRINGS.EMPTY

    return h(TAGS.DIV, { class: 'cms-about-manager' },
      // Header
      h(TAGS.DIV, { class: 'cms-card cms-card--header' },
        h(TAGS.DIV, null,
          h('h2', { class: 'cms-card-title' }, 'About Section & Gravatar Editor'),
          h(TAGS.P, { class: 'cms-card-subtitle' }, 'Manage your bio, Gravatar profile picture, intro text, and awards/mentions.'),
        ),
        h(TAGS.DIV, { class: 'cms-btn-group' },
          h(TAGS.BUTTON, { id: 'btn-sync-all', class: CMS_CLASSES.CMS_BTN_SECONDARY, type: 'button', disabled: this.syncingAll ? '' : null },
            this.syncingAll ? 'Syncing...' : '🔄 Sync All Non-Localized (Gravatar + Awards)'),
          h(TAGS.BUTTON, { id: 'btn-save-about', class: CMS_CLASSES.CMS_BTN, type: 'button', disabled: this.saving ? '' : null },
            this.saving ? 'Saving...' : '💾 Save to Firebase'),
        ),
      ),

      // Language selector
      h(TAGS.DIV, { class: 'cms-card cms-card--lang' },
        h(TAGS.LABEL, { class: 'cms-label' }, 'Target Language:'),
        h(TAGS.SELECT, { id: 'select-about-lang', class: CMS_CLASSES.CMS_SELECT },
          ...this.languages.map((l) =>
            h(TAGS.OPTION, { value: l, selected: this.selectedLang === l ? '' : null }, l.toUpperCase())
          ),
        ),
      ),

      // Profile Picture & Gravatar
      h(TAGS.DIV, { class: CMS_CLASSES.CMS_CARD },
        h(TAGS.DIV, { class: 'cms-section-header' },
          h(TAGS.DIV, null,
            h(TAGS.H3, { class: CMS_CLASSES.CMS_SECTION_TITLE }, 'Profile Picture & Gravatar'),
            h(TAGS.P, { class: 'cms-card-subtitle' }, 'Non-localized: same URL using per-language profile.'),
          ),
          h(TAGS.BUTTON, { id: 'btn-sync-picture', class: CMS_CLASSES.CMS_BTN_SECONDARY, type: 'button', disabled: this.syncingAll ? '' : null },
            '🔄 Apply Picture & Size to All Languages'),
        ),
        h(TAGS.DIV, { class: 'cms-gravatar-layout' },
          h(TAGS.DIV, { class: 'cms-gravatar-preview' },
            picUrl
              ? h('img', { id: 'gravatar-preview', src: picUrl, alt: 'Gravatar Preview', class: 'cms-gravatar-img', loading: 'lazy' })
              : h(TAGS.DIV, { class: 'cms-gravatar-placeholder' }, '👤'),
            h(TAGS.SPAN, { class: 'cms-gravatar-label' }, 'Live Preview'),
          ),
          h(TAGS.DIV, { class: 'cms-gravatar-controls' },
            h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
              h(TAGS.LABEL, null, 'Profile Picture URL'),
              h(TAGS.INPUT, { id: 'about-pic-input', class: CMS_CLASSES.CMS_INPUT, value: picUrl, placeholder: 'https://www.gravatar.com/avatar/...' }),
            ),
            h(TAGS.DIV, { class: 'cms-field-row cms-field-row--align' },
              h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
                h(TAGS.LABEL, null, 'Gravatar Image Size (px)'),
                h(TAGS.INPUT, { id: 'about-size-input', class: 'cms-input cms-input--short', type: STRINGS.NUMBER, value: String(this.gravatarSize) }),
              ),
              h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
                h(TAGS.LABEL, null, 'Quick presets:'),
                h(TAGS.DIV, { class: 'cms-preset-row' },
                  ...SIZE_PRESETS.map((s) =>
                    h(TAGS.BUTTON, {
                      class: `cms-btn cms-btn--preset size-preset-btn${s === this.gravatarSize ? ' cms-btn--active' : ''}`,
                      [ATTRS.DATA_SIZE]: s, type: 'button',
                    }, `${s}px`)
                  ),
                ),
              ),
            ),
            h(TAGS.DIV, { class: 'cms-field-row' },
              h(TAGS.INPUT, { id: 'email-gravatar-input', class: CMS_CLASSES.CMS_INPUT, placeholder: 'Enter email to generate Gravatar URL', value: this.emailInput }),
              h(TAGS.BUTTON, { id: 'btn-gen-gravatar', class: CMS_CLASSES.CMS_BTN_SECONDARY, type: 'button' }, 'Generate Gravatar URL'),
            ),
            h(TAGS.P, { class: 'cms-hint' }, 'Changing size updates the ?s= query parameter on the URL in real-time. Click "Apply Picture & Size to All Languages" to sync it across all languages immediately.'),
          ),
        ),
      ),

      // Title & Intro Callout
      h(TAGS.DIV, { class: CMS_CLASSES.CMS_CARD },
        h(TAGS.H3, { class: CMS_CLASSES.CMS_SECTION_TITLE }, `Title & Intro Callout [${this.selectedLang.toUpperCase()}]`),
        h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
          h(TAGS.LABEL, null, 'Section Title'),
          h(TAGS.INPUT, { id: 'about-title-input', class: CMS_CLASSES.CMS_INPUT, value: this.aboutData.title || '', placeholder: 'About me' }),
        ),
      ),

      // Bio Column 1
      h(TAGS.DIV, { class: CMS_CLASSES.CMS_CARD },
        h(TAGS.H3, { class: CMS_CLASSES.CMS_SECTION_TITLE }, `Left Column Paragraphs [${this.selectedLang.toUpperCase()}]`),
        this._renderParagraphList('col1'),
      ),

      // Bio Column 2
      h(TAGS.DIV, { class: CMS_CLASSES.CMS_CARD },
        h(TAGS.H3, { class: CMS_CLASSES.CMS_SECTION_TITLE }, `Right Column Paragraphs [${this.selectedLang.toUpperCase()}]`),
        this._renderParagraphList('col2'),
      ),

      // Awards & Mentions
      h(TAGS.DIV, { class: CMS_CLASSES.CMS_CARD },
        h(TAGS.H3, { class: CMS_CLASSES.CMS_SECTION_TITLE }, 'Awards & Mentions (Non-localized)'),
        h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
          h(TAGS.LABEL, null, 'Section Title'),
          h(TAGS.INPUT, { id: 'about-mentions-title', class: CMS_CLASSES.CMS_INPUT, value: this.aboutData.mentions || STRINGS.EMPTY, placeholder: TEXT.SOME_MENTIONS }),
        ),
        this._renderMentionItems(),
      ),
    )
  }
}

if (!customElements.get(CMS_TAGS.CMS_ABOUT_EDITOR)) {
  customElements.define(CMS_TAGS.CMS_ABOUT_EDITOR, CmsAboutEditor)
}
