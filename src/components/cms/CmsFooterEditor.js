import { BaseComponent } from '../../core/Component.js'
import { getDbInstance } from '../../firebase.js'
import { ref, child, get, set } from 'firebase/database'
import { h } from '../../core/jsx.js'
import cmsStyles from '../../sass/cms.scss?inline'

const LANGS = ['en', 'br', 'es', 'de', 'hrk', 'cas', 'riv', 'gn', 'it', 'ru', 'fr', 'tln']

export class CmsFooterEditor extends BaseComponent {
  constructor() {
    super(cmsStyles)
    this.languages = LANGS
    this.selectedLang = 'en'
    this.saving = false
    this.syncing = false

    // Section 1: Main Contact Footer
    this.contactData = { title: 'Contact', line1: [], line2: [] }
    // Section 2: Legal Footer Navigation
    this.legalLinks = []
    // Section 3: Project Case Study Footer
    this.relatedFooter = { title: 'Related', disclaimer: '', socials: [] }
  }

  onMounted() {
    this.loadAllData()
  }

  onUpdated() {
    this._bindEvents()
  }

  // ─── Data loading ──────────────────────────────────────────────────────────
  async loadAllData() {
    try {
      const db = await getDbInstance()
      const [contactSnap, legalSnap, relatedSnap] = await Promise.all([
        get(child(ref(db), `translations/${this.selectedLang}/components/contact`)),
        get(child(ref(db), `translations/${this.selectedLang}/components/legal-footer`)),
        get(child(ref(db), `translations/${this.selectedLang}/components/related-footer`)),
      ])

      this.contactData = contactSnap.exists()
        ? {
            title: contactSnap.val().title || 'Contact',
            line1: Array.isArray(contactSnap.val().line1) ? [...contactSnap.val().line1] : [],
            line2: Array.isArray(contactSnap.val().line2) ? [...contactSnap.val().line2] : [],
          }
        : { title: 'Contact', line1: [], line2: [] }

      this.legalLinks = legalSnap.exists() && Array.isArray(legalSnap.val().links)
        ? [...legalSnap.val().links]
        : []

      if (relatedSnap.exists()) {
        const rv = relatedSnap.val()
        this.relatedFooter = {
          title: rv.title || 'Related',
          disclaimer: rv.disclaimer || '',
          socials: Array.isArray(rv.socials) ? [...rv.socials] : [],
        }
      } else {
        this.relatedFooter = { title: 'Related', disclaimer: '', socials: [] }
      }

      this._updateDom()
    } catch (err) {
      console.error('Error loading footer data:', err)
    }
  }

  // ─── Save ──────────────────────────────────────────────────────────────────
  async saveAll() {
    this.saving = true
    this._updateDom()
    try {
      const db = await getDbInstance()
      await Promise.all([
        set(ref(db, `translations/${this.selectedLang}/components/contact`), this.contactData),
        set(ref(db, `translations/${this.selectedLang}/components/legal-footer`), { links: this.legalLinks }),
        set(ref(db, `translations/${this.selectedLang}/components/related-footer`), this.relatedFooter),
      ])
      this._notify(`Footers & Contact for [${this.selectedLang.toUpperCase()}] saved!`)
    } catch (err) {
      alert('Failed to save: ' + (err.message || err))
    } finally {
      this.saving = false
      this._updateDom()
    }
  }

  // ─── Sync operations ───────────────────────────────────────────────────────
  async syncLine1ToAllLangs() {
    if (!confirm(`Apply contact channels (Line 1) to ALL ${this.languages.length} languages?`)) return
    this.syncing = true
    this._updateDom()
    try {
      const db = await getDbInstance()
      for (const lang of this.languages) {
        if (lang === this.selectedLang) continue
        const snap = await get(child(ref(db), `translations/${lang}/components/contact`))
        const existing = snap.exists() ? snap.val() : {}
        await set(ref(db, `translations/${lang}/components/contact`), {
          ...existing,
          line1: this.contactData.line1,
        })
      }
      this._notify(`Contact channels synced to all ${this.languages.length} languages!`)
    } catch (err) {
      alert('Sync failed: ' + (err.message || err))
    } finally {
      this.syncing = false
      this._updateDom()
    }
  }

  async syncSocialsToAllLangs() {
    if (!confirm(`Apply case study footer socials and disclaimer to ALL ${this.languages.length} languages?`)) return
    this.syncing = true
    this._updateDom()
    try {
      const db = await getDbInstance()
      for (const lang of this.languages) {
        if (lang === this.selectedLang) continue
        const snap = await get(child(ref(db), `translations/${lang}/components/related-footer`))
        const existing = snap.exists() ? snap.val() : {}
        await set(ref(db, `translations/${lang}/components/related-footer`), {
          ...existing,
          socials: this.relatedFooter.socials,
          disclaimer: this.relatedFooter.disclaimer,
        })
      }
      this._notify(`Case study footer socials synced to all ${this.languages.length} languages!`)
    } catch (err) {
      alert('Sync failed: ' + (err.message || err))
    } finally {
      this.syncing = false
      this._updateDom()
    }
  }

  // ─── List helpers ──────────────────────────────────────────────────────────
  _addItem(arr, item) { arr.push(item); this._updateDom() }
  _removeItem(arr, idx) { arr.splice(idx, 1); this._updateDom() }
  _moveItem(arr, idx, dir) {
    const target = idx + dir
    if (target < 0 || target >= arr.length) return
    ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
    this._updateDom(); this._bindEvents()
  }

  _notify(msg) {
    this.dispatchEvent(new CustomEvent('notify', { bubbles: true, composed: true, detail: msg }))
  }

  // ─── Render helpers ────────────────────────────────────────────────────────
  _renderChannelList(arr, prefix, addFn) {
    return h('div', { class: 'cms-channel-list' },
      ...arr.map((item, idx) =>
        h('div', { class: 'cms-channel-item', key: `${prefix}-${idx}` },
          h('div', { class: 'cms-channel-label' },
            h('input', { class: `cms-input cms-input--label ${prefix}-label`, 'data-idx': idx, value: item.description || '', placeholder: 'Label (e.g. Mail)' }),
          ),
          h('input', { class: `cms-input ${prefix}-link`, 'data-idx': idx, value: item.link || '', placeholder: 'Value / URL' }),
          h('div', { class: 'cms-item-controls' },
            h('button', { class: `cms-btn cms-btn--secondary ${prefix}-up`, 'data-idx': idx, type: 'button', disabled: idx === 0 }, '▲'),
            h('button', { class: `cms-btn cms-btn--secondary ${prefix}-down`, 'data-idx': idx, type: 'button', disabled: idx === arr.length - 1 }, '▼'),
            h('button', { class: `cms-btn cms-btn--danger ${prefix}-del`, 'data-idx': idx, type: 'button' }, '✕'),
          ),
        )
      ),
      h('button', { class: `cms-btn cms-btn--secondary ${prefix}-add`, type: 'button' }, `+ Add ${addFn}`),
    )
  }

  _bindListEvents(prefix, arr, labelField = 'description') {
    this.$$(`.${prefix}-label`).forEach((inp) => {
      const idx = parseInt(inp.getAttribute('data-idx'), 10)
      this.addScopedListener(inp, 'input', (e) => { if (arr[idx]) arr[idx][labelField] = e.target.value })
    })
    this.$$(`.${prefix}-link`).forEach((inp) => {
      const idx = parseInt(inp.getAttribute('data-idx'), 10)
      this.addScopedListener(inp, 'input', (e) => { if (arr[idx]) arr[idx].link = e.target.value })
    })
    this.$$(`.${prefix}-up`).forEach((btn) => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10)
      this.addScopedListener(btn, 'click', () => this._moveItem(arr, idx, -1))
    })
    this.$$(`.${prefix}-down`).forEach((btn) => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10)
      this.addScopedListener(btn, 'click', () => this._moveItem(arr, idx, 1))
    })
    this.$$(`.${prefix}-del`).forEach((btn) => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10)
      this.addScopedListener(btn, 'click', () => this._removeItem(arr, idx))
    })
  }

  // ─── Events ────────────────────────────────────────────────────────────────
  _bindEvents() {
    const on = (sel, ev, fn) => { const el = this.$(sel); if (el) this.addScopedListener(el, ev, fn) }

    on('#btn-save-footer', 'click', () => this.saveAll())
    on('#btn-sync-line1', 'click', () => this.syncLine1ToAllLangs())
    on('#btn-sync-socials', 'click', () => this.syncSocialsToAllLangs())

    on('#select-footer-lang', 'change', (e) => { this.selectedLang = e.target.value; this.loadAllData() })
    on('#contact-title-input', 'input', (e) => { this.contactData.title = e.target.value })
    on('#related-title-input', 'input', (e) => { this.relatedFooter.title = e.target.value })
    on('#disclaimer-textarea', 'input', (e) => { this.relatedFooter.disclaimer = e.target.value })

    // Line 1 channels
    on('.line1-add', 'click', () => this._addItem(this.contactData.line1, { description: '', link: '' }))
    this._bindListEvents('line1', this.contactData.line1)

    // Line 2 sub-links
    on('.line2-add', 'click', () => this._addItem(this.contactData.line2, { description: '', link: '' }))
    this._bindListEvents('line2', this.contactData.line2)

    // Legal links
    on('.legal-add', 'click', () => this._addItem(this.legalLinks, { description: '', link: '' }))
    this._bindListEvents('legal', this.legalLinks)

    // Socials
    on('.social-add', 'click', () => this._addItem(this.relatedFooter.socials, { description: '', link: '' }))
    this._bindListEvents('social', this.relatedFooter.socials)
  }

  render() {
    const root = h('div', { class: 'cms-footer-manager' },

      // ── Header ────────────────────────────────────────────────────────────
      h('div', { class: 'cms-card cms-card--header' },
        h('div', null,
          h('h2', { class: 'cms-card-title' }, 'Footers & Contact Manager'),
          h('p', { class: 'cms-card-subtitle' }, 'Manage footer links, legal navigation, contact info, and project disclaimer notes.'),
        ),
        h('button', { id: 'btn-save-footer', class: 'cms-btn', type: 'button', disabled: this.saving },
          this.saving ? 'Saving...' : '💾 Save Footers to Firebase'
        ),
      ),

      // ── Language ──────────────────────────────────────────────────────────
      h('div', { class: 'cms-card cms-card--lang' },
        h('label', { class: 'cms-label' }, 'Target Language:'),
        h('select', { id: 'select-footer-lang', class: 'cms-select' },
          ...this.languages.map((l) =>
            h('option', { value: l, selected: this.selectedLang === l ? '' : null }, l.toUpperCase())
          ),
        ),
      ),

      // ── Section 1: Main Contact Footer ────────────────────────────────────
      h('div', { class: 'cms-card' },
        h('div', { class: 'cms-section-header' },
          h('div', null,
            h('h3', { class: 'cms-section-title' }, '1. Main Contact Footer (Homepage)'),
            h('p', { class: 'cms-card-subtitle' }, 'Corresponds to components/contact. Display social channels & contact links.'),
          ),
          h('button', {
            id: 'btn-sync-line1', class: 'cms-btn cms-btn--secondary', type: 'button', disabled: this.syncing,
          }, '🔄 Sync Channels (Line 1) to All Languages'),
        ),
        h('div', { class: 'cms-field-group' },
          h('label', null, 'Contact Title'),
          h('input', { id: 'contact-title-input', class: 'cms-input', value: this.contactData.title || '', placeholder: 'Contact' }),
        ),
        h('div', { class: 'cms-subsection' },
          h('div', { class: 'cms-subsection-header' },
            h('span', { class: 'cms-subsection-title' }, `Line 1: Contact & Social Channels (${this.contactData.line1.length})`),
          ),
          this._renderChannelList(this.contactData.line1, 'line1', 'Channel'),
        ),
        h('div', { class: 'cms-subsection' },
          h('div', { class: 'cms-subsection-header' },
            h('span', { class: 'cms-subsection-title' }, `Line 2: Sub Links (${this.contactData.line2.length})`),
          ),
          this._renderChannelList(this.contactData.line2, 'line2', 'Sub-link'),
        ),
      ),

      // ── Section 2: Legal Footer Navigation ───────────────────────────────
      h('div', { class: 'cms-card' },
        h('div', { class: 'cms-section-header' },
          h('div', null,
            h('h3', { class: 'cms-section-title' }, '2. Legal Footer Navigation Links'),
            h('p', { class: 'cms-card-subtitle' }, 'Corresponds to components/legal-footer. Displayed at the bottom of the awards section and legal pages.'),
          ),
          h('button', { class: 'cms-btn cms-btn--secondary legal-add', type: 'button' }, '+ Add Navigation Link'),
        ),
        this._renderChannelList(this.legalLinks, 'legal', 'Navigation Link'),
      ),

      // ── Section 3: Case Study Footer ──────────────────────────────────────
      h('div', { class: 'cms-card' },
        h('div', { class: 'cms-section-header' },
          h('div', null,
            h('h3', { class: 'cms-section-title' }, '3. Project Case Study Footer & Disclaimer'),
            h('p', { class: 'cms-card-subtitle' }, 'Corresponds to components/related shown at the bottom of each project (case study) detail page.'),
          ),
          h('button', {
            id: 'btn-sync-socials', class: 'cms-btn cms-btn--secondary', type: 'button', disabled: this.syncing,
          }, '🔄 Sync Socials to All Languages'),
        ),
        h('div', { class: 'cms-field-group' },
          h('label', null, 'Footer Title'),
          h('input', { id: 'related-title-input', class: 'cms-input', value: this.relatedFooter.title || '', placeholder: 'Related' }),
        ),
        h('div', { class: 'cms-field-group' },
          h('label', null, 'Project Media Disclaimer Note (HTML allowed)'),
          h('textarea', {
            id: 'disclaimer-textarea', class: 'cms-textarea', rows: '4',
            innerHTML: this.relatedFooter.disclaimer || '',
          }),
        ),
        h('div', { class: 'cms-subsection' },
          h('div', { class: 'cms-subsection-header' },
            h('span', { class: 'cms-subsection-title' }, `Case Study Footer Socials (${this.relatedFooter.socials.length})`),
          ),
          this._renderChannelList(this.relatedFooter.socials, 'social', 'Social Link'),
        ),
      ),
    )

    this.shadowRoot.innerHTML = `<style>${cmsStyles}</style>`
    this.shadowRoot.appendChild(root)
    this._bindEvents()
  }
}

if (!customElements.get('cms-footer-editor')) {
  customElements.define('cms-footer-editor', CmsFooterEditor)
}
