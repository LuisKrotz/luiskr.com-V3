import { CMS_CLASSES, CMS_TAGS, CMS_EVENTS } from "../../core/cms/tokens.js"
import { BaseComponent } from '../../core/Component.js'
import { getDbInstance } from '../../firebase.js'
import { ref, child, get, set } from 'firebase/database'
import { h } from '../../core/jsx.js'
import { TAGS, ATTRS, EVENTS, STRINGS, LOCALES, TEXT, PATHS } from "../../core/constants.js"
import { VALID_LANGS } from '../../core/i18n.js'
import cmsStyles from '../../sass/views/cms.scss?inline'



export class CmsFooterEditor extends BaseComponent {
  constructor() {
    super(cmsStyles)
    this.languages = VALID_LANGS
    this.selectedLang = LOCALES.EN
    this.saving = false
    this.syncing = false

    // Section 1: Main Contact Footer
    this.contactData = { title: TEXT.CONTACT, line1: [], line2: [] }
    // Section 2: Legal Footer Navigation
    this.legalLinks = []
    // Section 3: Project Case Study Footer
    this.relatedFooter = { title: TEXT.RELATED, disclaimer: STRINGS.EMPTY, socials: [] }
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
        get(child(ref(db), `${PATHS.TRANSLATIONS}${this.selectedLang}/components/contact`)),
        get(child(ref(db), `${PATHS.TRANSLATIONS}${this.selectedLang}/components/legal-footer`)),
        get(child(ref(db), `${PATHS.TRANSLATIONS}${this.selectedLang}/components/related-footer`)),
      ])

      this.contactData = contactSnap.exists()
        ? {
            title: contactSnap.val().title || TEXT.CONTACT,
            line1: Array.isArray(contactSnap.val().line1) ? [...contactSnap.val().line1] : [],
            line2: Array.isArray(contactSnap.val().line2) ? [...contactSnap.val().line2] : [],
          }
        : { title: TEXT.CONTACT, line1: [], line2: [] }

      this.legalLinks = legalSnap.exists() && Array.isArray(legalSnap.val().links)
        ? [...legalSnap.val().links]
        : []

      if (relatedSnap.exists()) {
        const rv = relatedSnap.val()
        this.relatedFooter = {
          title: rv.title || TEXT.RELATED,
          disclaimer: rv.disclaimer || STRINGS.EMPTY,
          socials: Array.isArray(rv.socials) ? [...rv.socials] : [],
        }
      } else {
        this.relatedFooter = { title: TEXT.RELATED, disclaimer: STRINGS.EMPTY, socials: [] }
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
        set(ref(db, `${PATHS.TRANSLATIONS}${this.selectedLang}/components/contact`), this.contactData),
        set(ref(db, `${PATHS.TRANSLATIONS}${this.selectedLang}/components/legal-footer`), { links: this.legalLinks }),
        set(ref(db, `${PATHS.TRANSLATIONS}${this.selectedLang}/components/related-footer`), this.relatedFooter),
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
        const snap = await get(child(ref(db), `${PATHS.TRANSLATIONS}${lang}/components/contact`))
        const existing = snap.exists() ? snap.val() : {}
        await set(ref(db, `${PATHS.TRANSLATIONS}${lang}/components/contact`), {
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
        const snap = await get(child(ref(db), `${PATHS.TRANSLATIONS}${lang}/components/related-footer`))
        const existing = snap.exists() ? snap.val() : {}
        await set(ref(db, `${PATHS.TRANSLATIONS}${lang}/components/related-footer`), {
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
    this.dispatchEvent(new CustomEvent(CMS_EVENTS.NOTIFY, { bubbles: true, composed: true, detail: msg }))
  }

  // ─── Render helpers ────────────────────────────────────────────────────────
  _renderChannelList(arr, prefix, addFn) {
    return h(TAGS.DIV, { class: 'cms-channel-list' },
      ...arr.map((item, idx) =>
        h(TAGS.DIV, { class: 'cms-channel-item', key: `${prefix}-${idx}` },
          h(TAGS.DIV, { class: 'cms-channel-label' },
            h(TAGS.INPUT, { class: `cms-input cms-input--label ${prefix}-label`, [ATTRS.DATA_IDX]: idx, value: item.description || '', placeholder: 'Label (e.g. Mail)' }),
          ),
          h(TAGS.INPUT, { class: `cms-input ${prefix}-link`, [ATTRS.DATA_IDX]: idx, value: item.link || '', placeholder: 'Value / URL' }),
          h(TAGS.DIV, { class: 'cms-item-controls' },
            h(TAGS.BUTTON, { class: `cms-btn cms-btn--secondary ${prefix}-up`, [ATTRS.DATA_IDX]: idx, type: 'button', disabled: idx === 0 }, '▲'),
            h(TAGS.BUTTON, { class: `cms-btn cms-btn--secondary ${prefix}-down`, [ATTRS.DATA_IDX]: idx, type: 'button', disabled: idx === arr.length - 1 }, '▼'),
            h(TAGS.BUTTON, { class: `cms-btn cms-btn--danger ${prefix}-del`, [ATTRS.DATA_IDX]: idx, type: 'button' }, '✕'),
          ),
        )
      ),
      h(TAGS.BUTTON, { class: `cms-btn cms-btn--secondary ${prefix}-add`, type: 'button' }, `+ Add ${addFn}`),
    )
  }

  _bindListEvents(prefix, arr, labelField = 'description') {
    this.$$(`.${prefix}-label`).forEach((inp) => {
      const idx = parseInt(inp.getAttribute(ATTRS.DATA_IDX), 10)
      this.addScopedListener(inp, EVENTS.INPUT, (e) => { if (arr[idx]) arr[idx][labelField] = e.target.value })
    })
    this.$$(`.${prefix}-link`).forEach((inp) => {
      const idx = parseInt(inp.getAttribute(ATTRS.DATA_IDX), 10)
      this.addScopedListener(inp, EVENTS.INPUT, (e) => { if (arr[idx]) arr[idx].link = e.target.value })
    })
    this.$$(`.${prefix}-up`).forEach((btn) => {
      const idx = parseInt(btn.getAttribute(ATTRS.DATA_IDX), 10)
      this.addScopedListener(btn, EVENTS.CLICK, () => this._moveItem(arr, idx, -1))
    })
    this.$$(`.${prefix}-down`).forEach((btn) => {
      const idx = parseInt(btn.getAttribute(ATTRS.DATA_IDX), 10)
      this.addScopedListener(btn, EVENTS.CLICK, () => this._moveItem(arr, idx, 1))
    })
    this.$$(`.${prefix}-del`).forEach((btn) => {
      const idx = parseInt(btn.getAttribute(ATTRS.DATA_IDX), 10)
      this.addScopedListener(btn, EVENTS.CLICK, () => this._removeItem(arr, idx))
    })
  }

  // ─── Events ────────────────────────────────────────────────────────────────
  _bindEvents() {
    const on = (sel, ev, fn) => { const el = this.$(sel); if (el) this.addScopedListener(el, ev, fn) }

    on('#btn-save-footer', EVENTS.CLICK, () => this.saveAll())
    on('#btn-sync-line1', EVENTS.CLICK, () => this.syncLine1ToAllLangs())
    on('#btn-sync-socials', EVENTS.CLICK, () => this.syncSocialsToAllLangs())

    on('#select-footer-lang', EVENTS.CHANGE, (e) => { this.selectedLang = e.target.value; this.loadAllData() })
    on('#contact-title-input', EVENTS.INPUT, (e) => { this.contactData.title = e.target.value })
    on('#related-title-input', EVENTS.INPUT, (e) => { this.relatedFooter.title = e.target.value })
    on('#disclaimer-textarea', EVENTS.INPUT, (e) => { this.relatedFooter.disclaimer = e.target.value })

    // Line 1 channels
    on('.line1-add', EVENTS.CLICK, () => this._addItem(this.contactData.line1, { description: '', link: '' }))
    this._bindListEvents('line1', this.contactData.line1)

    // Line 2 sub-links
    on('.line2-add', EVENTS.CLICK, () => this._addItem(this.contactData.line2, { description: '', link: '' }))
    this._bindListEvents('line2', this.contactData.line2)

    // Legal links
    on('.legal-add', EVENTS.CLICK, () => this._addItem(this.legalLinks, { description: '', link: '' }))
    this._bindListEvents('legal', this.legalLinks)

    // Socials
    on('.social-add', EVENTS.CLICK, () => this._addItem(this.relatedFooter.socials, { description: '', link: '' }))
    this._bindListEvents('social', this.relatedFooter.socials)
  }

  render() {
    const root = h(TAGS.DIV, { class: 'cms-footer-manager' },

      // ── Header ────────────────────────────────────────────────────────────
      h(TAGS.DIV, { class: 'cms-card cms-card--header' },
        h(TAGS.DIV, null,
          h('h2', { class: 'cms-card-title' }, 'Footers & Contact Manager'),
          h(TAGS.P, { class: 'cms-card-subtitle' }, 'Manage footer links, legal navigation, contact info, and project disclaimer notes.'),
        ),
        h(TAGS.BUTTON, { id: 'btn-save-footer', class: CMS_CLASSES.CMS_BTN, type: 'button', disabled: this.saving },
          this.saving ? 'Saving...' : '💾 Save Footers to Firebase'
        ),
      ),

      // ── Language ──────────────────────────────────────────────────────────
      h(TAGS.DIV, { class: 'cms-card cms-card--lang' },
        h(TAGS.LABEL, { class: 'cms-label' }, 'Target Language:'),
        h(TAGS.SELECT, { id: 'select-footer-lang', class: CMS_CLASSES.CMS_SELECT },
          ...this.languages.map((l) =>
            h(TAGS.OPTION, { value: l, selected: this.selectedLang === l ? '' : null }, l.toUpperCase())
          ),
        ),
      ),

      // ── Section 1: Main Contact Footer ────────────────────────────────────
      h(TAGS.DIV, { class: CMS_CLASSES.CMS_CARD },
        h(TAGS.DIV, { class: 'cms-section-header' },
          h(TAGS.DIV, null,
            h(TAGS.H3, { class: CMS_CLASSES.CMS_SECTION_TITLE }, '1. Main Contact Footer (Homepage)'),
            h(TAGS.P, { class: 'cms-card-subtitle' }, 'Corresponds to components/contact. Display social channels & contact links.'),
          ),
          h(TAGS.BUTTON, {
            id: 'btn-sync-line1', class: CMS_CLASSES.CMS_BTN_SECONDARY, type: 'button', disabled: this.syncing,
          }, '🔄 Sync Channels (Line 1) to All Languages'),
        ),
        h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
          h(TAGS.LABEL, null, 'Contact Title'),
          h(TAGS.INPUT, { id: 'contact-title-input', class: CMS_CLASSES.CMS_INPUT, value: this.contactData.title || STRINGS.EMPTY, placeholder: TEXT.CONTACT }),
        ),
        h(TAGS.DIV, { class: 'cms-subsection' },
          h(TAGS.DIV, { class: 'cms-subsection-header' },
            h(TAGS.SPAN, { class: 'cms-subsection-title' }, `Line 1: Contact & Social Channels (${this.contactData.line1.length})`),
          ),
          this._renderChannelList(this.contactData.line1, 'line1', 'Channel'),
        ),
        h(TAGS.DIV, { class: 'cms-subsection' },
          h(TAGS.DIV, { class: 'cms-subsection-header' },
            h(TAGS.SPAN, { class: 'cms-subsection-title' }, `Line 2: Sub Links (${this.contactData.line2.length})`),
          ),
          this._renderChannelList(this.contactData.line2, 'line2', 'Sub-link'),
        ),
      ),

      // ── Section 2: Legal Footer Navigation ───────────────────────────────
      h(TAGS.DIV, { class: CMS_CLASSES.CMS_CARD },
        h(TAGS.DIV, { class: 'cms-section-header' },
          h(TAGS.DIV, null,
            h(TAGS.H3, { class: CMS_CLASSES.CMS_SECTION_TITLE }, '2. Legal Footer Navigation Links'),
            h(TAGS.P, { class: 'cms-card-subtitle' }, 'Corresponds to components/legal-footer. Displayed at the bottom of the awards section and legal pages.'),
          ),
          h(TAGS.BUTTON, { class: 'cms-btn cms-btn--secondary legal-add', type: 'button' }, '+ Add Navigation Link'),
        ),
        this._renderChannelList(this.legalLinks, 'legal', 'Navigation Link'),
      ),

      // ── Section 3: Case Study Footer ──────────────────────────────────────
      h(TAGS.DIV, { class: CMS_CLASSES.CMS_CARD },
        h(TAGS.DIV, { class: 'cms-section-header' },
          h(TAGS.DIV, null,
            h(TAGS.H3, { class: CMS_CLASSES.CMS_SECTION_TITLE }, '3. Project Case Study Footer & Disclaimer'),
            h(TAGS.P, { class: 'cms-card-subtitle' }, 'Corresponds to components/related shown at the bottom of each project (case study) detail page.'),
          ),
          h(TAGS.BUTTON, {
            id: 'btn-sync-socials', class: CMS_CLASSES.CMS_BTN_SECONDARY, type: 'button', disabled: this.syncing,
          }, '🔄 Sync Socials to All Languages'),
        ),
        h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
          h(TAGS.LABEL, null, 'Footer Title'),
          h(TAGS.INPUT, { id: 'related-title-input', class: CMS_CLASSES.CMS_INPUT, value: this.relatedFooter.title || STRINGS.EMPTY, placeholder: TEXT.RELATED }),
        ),
        h(TAGS.DIV, { class: CMS_CLASSES.CMS_FIELD_GROUP },
          h(TAGS.LABEL, null, 'Project Media Disclaimer Note (HTML allowed)'),
          h(TAGS.TEXTAREA, {
            id: 'disclaimer-textarea', class: 'cms-textarea', rows: '4',
            innerHTML: this.relatedFooter.disclaimer || STRINGS.EMPTY,
          }),
        ),
        h(TAGS.DIV, { class: 'cms-subsection' },
          h(TAGS.DIV, { class: 'cms-subsection-header' },
            h(TAGS.SPAN, { class: 'cms-subsection-title' }, `Case Study Footer Socials (${this.relatedFooter.socials.length})`),
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

if (!customElements.get(CMS_TAGS.CMS_FOOTER_EDITOR)) {
  customElements.define(CMS_TAGS.CMS_FOOTER_EDITOR, CmsFooterEditor)
}
