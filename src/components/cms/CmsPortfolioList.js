import { CMS_CLASSES, CMS_TAGS, CMS_EVENTS } from "../../core/cms/tokens.js"
import { BaseComponent } from '../../core/Component.js'
import { getDbInstance } from '../../firebase.js'
import { ref, child, get, set } from 'firebase/database'
import { LOCALES, PATHS, URLS, MEDIA_DIMENSIONS } from '../../core/constants.js'
import { VALID_LANGS } from '../../core/i18n.js'
import cmsStyles from '../../sass/views/cms.scss?inline'

export class CmsPortfolioList extends BaseComponent {
  constructor() {
    super(cmsStyles)
    this.languages = VALID_LANGS
    this.selectedLang = LOCALES.EN
    this.items = []
    this.saving = false
  }

  onMounted() {
    this.loadLangPortfolio()
  }

  getImagePreview(imgName) {
    if (!imgName) return ''
    if (imgName.startsWith('http')) return imgName
    return `${URLS.CDN_BASE}covers/${imgName}.jpg`
  }

  updateDim(item, prop, idx, val) {
    if (!Array.isArray(item[prop])) {
      item[prop] = idx === 0 ? [val, MEDIA_DIMENSIONS.MOSAIC_MOBILE_WIDTH_STR] : [MEDIA_DIMENSIONS.FHD_WIDTH_STR, val]
    } else {
      item[prop][idx] = val
    }
  }

  async loadLangPortfolio() {
    try {
      const db = await getDbInstance()
      const [pSnap, rSnap] = await Promise.all([
        get(child(ref(db), `${PATHS.TRANSLATIONS}${this.selectedLang}/pages/HOME/portfoliolist`)),
        get(child(ref(db), `${PATHS.TRANSLATIONS}${this.selectedLang}/components/related/projects`)),
      ])

      const relatedMap = {}
      if (rSnap.exists()) {
        const rVal = rSnap.val()
        const rArr = Array.isArray(rVal) ? rVal : Object.values(rVal)
        rArr.forEach((p) => {
          if (p.link) relatedMap[p.link] = p.featured === true
        })
      }

      if (pSnap.exists()) {
        const val = pSnap.val()
        const raw = Array.isArray(val) ? JSON.parse(JSON.stringify(val)) : Object.values(val)
        this.items = raw.map((item) => {
          const isFeat =
            item.featured !== undefined
              ? item.featured === true || item.featured === 'true'
              : relatedMap[item.link] === true
          return {
            ...item,
            featured: isFeat,
            width: Array.isArray(item.width) ? [...item.width] : [MEDIA_DIMENSIONS.FHD_WIDTH_STR, MEDIA_DIMENSIONS.MOSAIC_MOBILE_WIDTH_STR],
            height: Array.isArray(item.height) ? [...item.height] : [MEDIA_DIMENSIONS.MOSAIC_DESKTOP_HEIGHT_STR, MEDIA_DIMENSIONS.MOSAIC_MOBILE_HEIGHT_STR],
          }
        })
      } else {
        this.items = []
      }
      this._updateDom()
      this._bindEvents()
    } catch (err) {
      console.error('Error loading portfolio list:', err)
    }
  }

  addNewItem() {
    this.items.push({
      label: 'New Project',
      link: 'new-project',
      image: 'default-cover',
      description: 'New project description.',
      featured: false,
      width: [MEDIA_DIMENSIONS.FHD_WIDTH_STR, MEDIA_DIMENSIONS.MOSAIC_MOBILE_WIDTH_STR],
      height: [MEDIA_DIMENSIONS.MOSAIC_DESKTOP_HEIGHT_STR, MEDIA_DIMENSIONS.MOSAIC_MOBILE_HEIGHT_STR],
    })
    this._updateDom()
    this._bindEvents()
  }

  removeItem(idx) {
    if (confirm(`Delete "${this.items[idx]?.label || 'Item'}"?`)) {
      this.items.splice(idx, 1)
      this._updateDom()
      this._bindEvents()
    }
  }

  moveUp(idx) {
    if (idx <= 0) return
    const item = this.items.splice(idx, 1)[0]
    this.items.splice(idx - 1, 0, item)
    this._updateDom()
    this._bindEvents()
  }

  moveDown(idx) {
    if (idx >= this.items.length - 1) return
    const item = this.items.splice(idx, 1)[0]
    this.items.splice(idx + 1, 0, item)
    this._updateDom()
    this._bindEvents()
  }

  async syncNonLocalizedToAllLangs() {
    if (
      !confirm(
        `Apply image filenames, dimensions (width/height), links, and featured flags to ALL ${this.languages.length} languages? (Localized labels and descriptions will be preserved)`
      )
    ) {
      return
    }

    this.saving = true
    this._updateDom()
    try {
      const db = await getDbInstance()
      for (const lang of this.languages) {
        if (lang === this.selectedLang) continue

        const pSnap = await get(child(ref(db), `${PATHS.TRANSLATIONS}${lang}/pages/HOME/portfoliolist`))
        let targetItems = []
        if (pSnap.exists()) {
          const val = pSnap.val()
          targetItems = Array.isArray(val) ? JSON.parse(JSON.stringify(val)) : Object.values(val)
        }

        const merged = this.items.map((srcItem, idx) => {
          const existing = targetItems[idx] || {}
          return {
            label: existing.label || srcItem.label,
            description: existing.description || srcItem.description,
            image: srcItem.image || '',
            link: srcItem.link || '',
            featured: srcItem.featured === true,
            width: Array.isArray(srcItem.width) ? [...srcItem.width] : [MEDIA_DIMENSIONS.FHD_WIDTH_STR, MEDIA_DIMENSIONS.MOSAIC_MOBILE_WIDTH_STR],
            height: Array.isArray(srcItem.height) ? [...srcItem.height] : [MEDIA_DIMENSIONS.MOSAIC_DESKTOP_HEIGHT_STR, MEDIA_DIMENSIONS.MOSAIC_MOBILE_HEIGHT_STR],
          }
        })

        await set(ref(db, `${PATHS.TRANSLATIONS}${lang}/pages/HOME/portfoliolist`), merged)

        const rSnap = await get(child(ref(db), `${PATHS.TRANSLATIONS}${lang}/components/related/projects`))
        if (rSnap.exists()) {
          const rVal = rSnap.val()
          const rArr = Array.isArray(rVal) ? JSON.parse(JSON.stringify(rVal)) : Object.values(rVal)
          const updatedRelated = rArr.map((p) => {
            const match = this.items.find((i) => i.link === p.link)
            return {
              ...p,
              featured: match ? match.featured === true : p.featured === true,
            }
          })
          await set(ref(db, `${PATHS.TRANSLATIONS}${lang}/components/related/projects`), updatedRelated)
        }
      }

      this.dispatchEvent(
        new CustomEvent(CMS_EVENTS.NOTIFY, {
          bubbles: true,
          composed: true,
          detail: `Non-localized images, dimensions & slugs synced across all ${this.languages.length} languages!`,
        })
      )
    } catch (err) {
      console.error('Error syncing non-localized info:', err)
      alert('Failed to sync non-localized portfolio info: ' + (err.message || err))
    } finally {
      this.saving = false
      this._updateDom()
      this._bindEvents()
    }
  }

  async savePortfolio() {
    this.saving = true
    this._updateDom()
    try {
      const db = await getDbInstance()
      await set(ref(db, `${PATHS.TRANSLATIONS}${this.selectedLang}/pages/HOME/portfoliolist`), this.items)

      const rSnap = await get(child(ref(db), `${PATHS.TRANSLATIONS}${this.selectedLang}/components/related/projects`))
      if (rSnap.exists()) {
        const rVal = rSnap.val()
        const rArr = Array.isArray(rVal) ? JSON.parse(JSON.stringify(rVal)) : Object.values(rVal)
        const updatedRelated = rArr.map((p) => {
          const match = this.items.find((i) => i.link === p.link)
          return {
            ...p,
            featured: match ? match.featured === true : p.featured === true,
          }
        })
        await set(ref(db, `${PATHS.TRANSLATIONS}${this.selectedLang}/components/related/projects`), updatedRelated)
      }

      this.dispatchEvent(
        new CustomEvent(CMS_EVENTS.NOTIFY, {
          bubbles: true,
          composed: true,
          detail: `Portfolio list for [${this.selectedLang.toUpperCase()}] saved successfully!`,
        })
      )
    } catch (err) {
      console.error('Error saving portfolio list:', err)
      alert('Failed to save portfolio list to Firebase: ' + (err.message || err))
    } finally {
      this.saving = false
      this._updateDom()
      this._bindEvents()
    }
  }

  _bindEvents() {
    const addBtn = this.$('#btn-add-item')
    if (addBtn) this.addScopedListener(addBtn, EVENTS.CLICK, () => this.addNewItem())

    const syncBtn = this.$('#btn-sync-items')
    if (syncBtn) this.addScopedListener(syncBtn, EVENTS.CLICK, () => this.syncNonLocalizedToAllLangs())

    const saveBtn = this.$('#btn-save-items')
    if (saveBtn) this.addScopedListener(saveBtn, EVENTS.CLICK, () => this.savePortfolio())

    const langSelect = this.$('#select-lang')
    if (langSelect) {
      this.addScopedListener(langSelect, EVENTS.CHANGE, (e) => {
        this.selectedLang = e.target.value
        this.loadLangPortfolio()
      })
    }

    this.$$('[data-action]').forEach((btn) => {
      const action = btn.getAttribute('data-action')
      const idx = parseInt(btn.getAttribute(ATTRS.DATA_IDX), 10)
      this.addScopedListener(btn, EVENTS.CLICK, () => {
        if (action === 'up') this.moveUp(idx)
        else if (action === 'down') this.moveDown(idx)
        else if (action === 'delete') this.removeItem(idx)
      })
    })

    this.$$('.item-field').forEach((input) => {
      const idx = parseInt(input.getAttribute(ATTRS.DATA_IDX), 10)
      const field = input.getAttribute('data-field')
      this.addScopedListener(input, EVENTS.INPUT, (e) => {
        if (this.items[idx]) this.items[idx][field] = e.target.value
      })
    })

    this.$$('.dim-field').forEach((input) => {
      const idx = parseInt(input.getAttribute(ATTRS.DATA_IDX), 10)
      const prop = input.getAttribute('data-prop')
      const dimIdx = parseInt(input.getAttribute('data-dim-idx'), 10)
      this.addScopedListener(input, EVENTS.INPUT, (e) => {
        if (this.items[idx]) this.updateDim(this.items[idx], prop, dimIdx, e.target.value)
      })
    })

    this.$$('.feat-select').forEach((sel) => {
      const idx = parseInt(sel.getAttribute(ATTRS.DATA_IDX), 10)
      this.addScopedListener(sel, EVENTS.CHANGE, (e) => {
        if (this.items[idx]) this.items[idx].featured = e.target.value === 'true'
      })
    })
  }

  render() {
    return `
      <div class="cms-portfolio-manager">
        <div class="cms-card" style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;">
          <div>
            <h2 class="cms-card-title">Homepage Portfolio Items</h2>
            <p style="color:#8892b0; font-size:0.88rem;">Manage the projects featured on the main mosaic grid, image URLs, and dimensions.</p>
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button class="cms-btn cms-btn--secondary" id="btn-add-item" type="button">+ Add New Item</button>
            <button
              class="cms-btn cms-btn--secondary"
              id="btn-sync-items"
              type="button"
              ${this.saving ? 'disabled' : ''}
              title="Copies image filenames, dimensions, links, and featured flags to all 12 languages"
            >
              🔄 Sync Images & Dimensions to All Languages
            </button>
            <button class="cms-btn" id="btn-save-items" type="button" ${this.saving ? 'disabled' : ''}>
              ${this.saving ? 'Saving...' : '💾 Save to Firebase'}
            </button>
          </div>
        </div>

        <div class="cms-card" style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
          <label style="color:#8892b0; font-weight:500;">Target Language:</label>
          <select id="select-lang" class="cms-select" style="max-width:220px;">
            ${this.languages
              .map(
                (l) => `
              <option value="${l}" ${this.selectedLang === l ? 'selected' : ''}>${l.toUpperCase()}</option>
            `
              )
              .join('')}
          </select>
        </div>

        ${
          this.items.length
            ? `
          <div style="display:flex; flex-direction:column; gap:1.2rem;">
            ${this.items
              .map(
                (item, idx) => `
              <div class="cms-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; flex-wrap:wrap; gap:0.5rem;">
                  <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:72px; height:44px; border-radius:6px; overflow:hidden; background:#141923; border:1px solid rgba(102,252,241,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                      ${
                        item.image
                          ? `<img src="${this.getImagePreview(item.image)}" alt="thumb" style="width:100%; height:100%; object-fit:cover;" />`
                          : `<span style="font-size:0.7rem; color:#8892b0;">No img</span>`
                      }
                    </div>
                    <h3 style="color:#66fcf1; font-size:1.1rem; font-weight:600; margin:0;">
                      #${idx + 1} ${item.label || 'Untitled Item'}
                    </h3>
                  </div>
                  <div style="display:flex; gap:6px;">
                    <button class="cms-btn cms-btn--secondary" style="padding:4px 10px;" data-action="up" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''} type="button">▲</button>
                    <button class="cms-btn cms-btn--secondary" style="padding:4px 10px;" data-action="down" data-idx="${idx}" ${idx === this.items.length - 1 ? 'disabled' : ''} type="button">▼</button>
                    <button class="cms-btn cms-btn--danger" style="padding:4px 10px;" data-action="delete" data-idx="${idx}" type="button">✕ Delete</button>
                  </div>
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1.2rem;">
                  <div class="cms-field-group">
                    <label>Label / Title (Localized)</label>
                    <input class="cms-input item-field" data-idx="${idx}" data-field="label" value="${item.label || ''}" placeholder="e.g. METCHA" />
                  </div>

                  <div class="cms-field-group">
                    <label>Link Slug (Non-localized)</label>
                    <input class="cms-input item-field" data-idx="${idx}" data-field="link" value="${item.link || ''}" placeholder="e.g. metcha" />
                  </div>

                  <div class="cms-field-group">
                    <label>Image Filename (Non-localized, without .jpg)</label>
                    <div style="display:flex; gap:8px; align-items:center;">
                      <input class="cms-input item-field" data-idx="${idx}" data-field="image" value="${item.image || ''}" placeholder="e.g. metcha" style="flex:1;" />
                      ${
                        item.image
                          ? `
                        <a href="${this.getImagePreview(item.image)}" target="_blank" rel="noopener noreferrer" class="cms-btn cms-btn--secondary" style="padding:6px 10px; font-size:0.75rem; text-decoration:none;">↗ View</a>
                      `
                          : ''
                      }
                    </div>
                  </div>

                  <div class="cms-field-group">
                    <label>Featured Item? (Non-localized)</label>
                    <select class="cms-select feat-select" data-idx="${idx}">
                      <option value="true" ${item.featured ? 'selected' : ''}>Yes (Featured Banner)</option>
                      <option value="false" ${!item.featured ? 'selected' : ''}>No (Standard Tile)</option>
                    </select>
                  </div>
                </div>

                <div style="background:rgba(0,0,0,0.25); padding:0.9rem; border-radius:8px; margin-top:1rem;">
                  <span style="font-size:0.8rem; color:#8892b0; font-weight:600; display:block; margin-bottom:0.6rem;">Image Dimensions (Non-localized px)</span>
                  <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:0.9rem;">
                    <div class="cms-field-group">
                      <label style="font-size:0.75rem;">Desktop Width</label>
                      <input class="cms-input dim-field" data-idx="${idx}" data-prop="width" data-dim-idx="0" value="${(item.width && item.width[0]) || MEDIA_DIMENSIONS.FHD_WIDTH_STR}" />
                    </div>
                    <div class="cms-field-group">
                      <label style="font-size:0.75rem;">Mobile Width</label>
                      <input class="cms-input dim-field" data-idx="${idx}" data-prop="width" data-dim-idx="1" value="${(item.width && item.width[1]) || MEDIA_DIMENSIONS.MOSAIC_MOBILE_WIDTH_STR}" />
                    </div>
                    <div class="cms-field-group">
                      <label style="font-size:0.75rem;">Desktop Height</label>
                      <input class="cms-input dim-field" data-idx="${idx}" data-prop="height" data-dim-idx="0" value="${(item.height && item.height[0]) || MEDIA_DIMENSIONS.MOSAIC_DESKTOP_HEIGHT_STR}" />
                    </div>
                    <div class="cms-field-group">
                      <label style="font-size:0.75rem;">Mobile Height</label>
                      <input class="cms-input dim-field" data-idx="${idx}" data-prop="height" data-dim-idx="1" value="${(item.height && item.height[1]) || MEDIA_DIMENSIONS.MOSAIC_MOBILE_HEIGHT_STR}" />
                    </div>
                  </div>
                </div>

                <div class="cms-field-group" style="margin-top:1rem;">
                  <label>Description (Localized, HTML allowed)</label>
                  <textarea class="cms-textarea item-field" data-idx="${idx}" data-field="description" rows="2">${item.description || ''}</textarea>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : `
          <div class="cms-card" style="text-align:center; color:#8892b0;">
            No portfolio items found for this language. Click "+ Add New Item" to create one.
          </div>
        `
        }
      </div>
    `
  }
}

if (!customElements.get(CMS_TAGS.CMS_PORTFOLIO_LIST)) {
  customElements.define(CMS_TAGS.CMS_PORTFOLIO_LIST, CmsPortfolioList)
}
