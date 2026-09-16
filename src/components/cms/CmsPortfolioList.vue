<template>
  <div class="cms-portfolio-manager">
    <div class="cms-card" style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;">
      <div>
        <h2 class="cms-card-title">Homepage Portfolio Items</h2>
        <p style="color:#8892b0; font-size:0.88rem;">Manage the projects featured on the main mosaic grid, image URLs, and dimensions.</p>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="cms-btn cms-btn--secondary" @click="addNewItem">+ Add New Item</button>
        <button
          class="cms-btn cms-btn--secondary"
          :disabled="saving"
          @click="syncNonLocalizedToAllLangs"
          title="Copies image filenames, dimensions (width/height), links, and featured flags to all 12 languages while preserving localized titles and descriptions"
        >
          🔄 Sync Images & Dimensions to All Languages
        </button>
        <button class="cms-btn" :disabled="saving" @click="savePortfolio">
          {{ saving ? 'Saving...' : '💾 Save to Firebase' }}
        </button>
      </div>
    </div>

    <!-- Language Selector for Portfolio Strings -->
    <div class="cms-card" style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
      <label style="color:#8892b0; font-weight:500;">Target Language:</label>
      <select v-model="selectedLang" class="cms-select" style="max-width:220px;" @change="loadLangPortfolio">
        <option v-for="l in languages" :key="l" :value="l">{{ l.toUpperCase() }}</option>
      </select>
    </div>

    <!-- Items List -->
    <div v-if="items.length" style="display:flex; flex-direction:column; gap:1.2rem;">
      <div v-for="(item, idx) in items" :key="idx" class="cms-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; flex-wrap:wrap; gap:0.5rem;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:72px; height:44px; border-radius:6px; overflow:hidden; background:#141923; border:1px solid rgba(102,252,241,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 2px 8px rgba(0,0,0,0.5);">
              <img
                v-if="item.image"
                :key="item.image"
                :src="getImagePreview(item.image)"
                alt="thumb"
                style="width:100%; height:100%; object-fit:cover;"
                @error="onImgError"
              />
              <span v-else style="font-size:0.7rem; color:#8892b0;">No img</span>
            </div>
            <h3 style="color:#66fcf1; font-size:1.1rem; font-weight:600; margin:0;">
              #{{ idx + 1 }} {{ item.label || 'Untitled Item' }}
            </h3>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="cms-btn cms-btn--secondary" style="padding:4px 10px;" :disabled="idx === 0" @click="moveUp(idx)">▲</button>
            <button class="cms-btn cms-btn--secondary" style="padding:4px 10px;" :disabled="idx === items.length - 1" @click="moveDown(idx)">▼</button>
            <button class="cms-btn cms-btn--danger" style="padding:4px 10px;" @click="removeItem(idx)">✕ Delete</button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1.2rem;">
          <div class="cms-field-group">
            <label>Label / Title (Localized)</label>
            <input v-model="item.label" class="cms-input" placeholder="e.g. METCHA" />
          </div>

          <div class="cms-field-group">
            <label>Link Slug (Non-localized)</label>
            <input v-model="item.link" class="cms-input" placeholder="e.g. metcha" />
          </div>

          <div class="cms-field-group">
            <label>Image Filename (Non-localized, without .jpg)</label>
            <div style="display:flex; gap:8px; align-items:center;">
              <input v-model="item.image" class="cms-input" placeholder="e.g. metcha" style="flex:1;" />
              <a
                v-if="item.image"
                :href="getImagePreview(item.image)"
                target="_blank"
                rel="noopener noreferrer"
                class="cms-btn cms-btn--secondary"
                style="padding:6px 10px; font-size:0.75rem; text-decoration:none; white-space:nowrap;"
                title="Open image in new tab"
              >
                ↗ View
              </a>
            </div>
          </div>

          <div class="cms-field-group">
            <label>Featured Item? (Non-localized)</label>
            <select
              :value="item.featured ? 'true' : 'false'"
              @change="item.featured = $event.target.value === 'true'"
              class="cms-select"
            >
              <option value="true">Yes (Featured Banner)</option>
              <option value="false">No (Standard Tile)</option>
            </select>
          </div>
        </div>

        <!-- Image Dimensions (Width & Height) -->
        <div style="background:rgba(0,0,0,0.25); padding:0.9rem; border-radius:8px; margin-top:1rem;">
          <span style="font-size:0.8rem; color:#8892b0; font-weight:600; display:block; margin-bottom:0.6rem;">
            Image Dimensions (Non-localized px)
          </span>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:0.9rem;">
            <div class="cms-field-group">
              <label style="font-size:0.75rem;">Desktop Width</label>
              <input
                :value="item.width && item.width[0]"
                @input="updateDim(item, 'width', 0, $event.target.value)"
                class="cms-input"
                placeholder="1920"
              />
            </div>
            <div class="cms-field-group">
              <label style="font-size:0.75rem;">Mobile Width</label>
              <input
                :value="item.width && item.width[1]"
                @input="updateDim(item, 'width', 1, $event.target.value)"
                class="cms-input"
                placeholder="768"
              />
            </div>
            <div class="cms-field-group">
              <label style="font-size:0.75rem;">Desktop Height</label>
              <input
                :value="item.height && item.height[0]"
                @input="updateDim(item, 'height', 0, $event.target.value)"
                class="cms-input"
                placeholder="913"
              />
            </div>
            <div class="cms-field-group">
              <label style="font-size:0.75rem;">Mobile Height</label>
              <input
                :value="item.height && item.height[1]"
                @input="updateDim(item, 'height', 1, $event.target.value)"
                class="cms-input"
                placeholder="340"
              />
            </div>
          </div>
        </div>

        <div class="cms-field-group" style="margin-top:1rem;">
          <label>Description (Localized, HTML allowed)</label>
          <textarea v-model="item.description" class="cms-textarea" rows="2" placeholder="Item description string..."></textarea>
        </div>
      </div>
    </div>

    <div v-else class="cms-card" style="text-align:center; color:#8892b0;">
      No portfolio items found for this language. Click "+ Add New Item" to create one.
    </div>
  </div>
</template>

<script>
import { getDbInstance } from '../../firebase.js'
import { ref, child, get, set } from 'firebase/database'

export default {
  name: 'CmsPortfolioList',
  props: {
    languages: {
      type: Array,
      default: () => ['en', 'br', 'es', 'de', 'hrk', 'cas', 'riv', 'gn', 'it', 'ru', 'fr', 'tln']
    }
  },
  data() {
    return {
      selectedLang: 'en',
      items: [],
      saving: false,
    }
  },
  mounted() {
    this.loadLangPortfolio()
  },
  methods: {
    getImagePreview(imgName) {
      if (!imgName) return ''
      if (imgName.startsWith('http')) return imgName
      return `https://storage.googleapis.com/luiskr.com/public/_v3/covers/${imgName}.jpg`
    },

    onImgError(e) {
      const src = e.target.src
      if (src.includes('.jpg') && !src.includes('.png')) {
        e.target.src = src.replace('.jpg', '.png')
      } else {
        e.target.style.opacity = '0.3'
      }
    },

    updateDim(item, prop, idx, val) {
      if (!Array.isArray(item[prop])) {
        item[prop] = idx === 0 ? [val, '768'] : ['1920', val]
      } else {
        item[prop][idx] = val
      }
    },

    async loadLangPortfolio() {
      try {
        const db = await getDbInstance()
        const [pSnap, rSnap] = await Promise.all([
          get(child(ref(db), `translations/${this.selectedLang}/pages/HOME/portfoliolist`)),
          get(child(ref(db), `translations/${this.selectedLang}/components/related/projects`))
        ])

        const relatedMap = {}
        if (rSnap.exists()) {
          const rVal = rSnap.val()
          const rArr = Array.isArray(rVal) ? rVal : Object.values(rVal)
          rArr.forEach(p => {
            if (p.link) relatedMap[p.link] = p.featured === true
          })
        }

        if (pSnap.exists()) {
          const val = pSnap.val()
          const raw = Array.isArray(val) ? JSON.parse(JSON.stringify(val)) : Object.values(val)
          this.items = raw.map(item => {
            const isFeat = item.featured !== undefined
              ? (item.featured === true || item.featured === 'true')
              : (relatedMap[item.link] === true)
            return {
              ...item,
              featured: isFeat,
              width: Array.isArray(item.width) ? [...item.width] : ['1920', '768'],
              height: Array.isArray(item.height) ? [...item.height] : ['913', '340']
            }
          })
        } else {
          this.items = []
        }
      } catch (err) {
        console.error('Error loading portfolio list:', err)
      }
    },

    addNewItem() {
      this.items.push({
        label: 'New Project',
        link: 'new-project',
        image: 'default-cover',
        description: 'New project description.',
        featured: false,
        width: ['1920', '768'],
        height: ['913', '340']
      })
    },

    removeItem(idx) {
      if (confirm(`Delete "${this.items[idx]?.label || 'Item'}"?`)) {
        this.items.splice(idx, 1)
      }
    },

    moveUp(idx) {
      if (idx <= 0) return
      const item = this.items.splice(idx, 1)[0]
      this.items.splice(idx - 1, 0, item)
    },

    moveDown(idx) {
      if (idx >= this.items.length - 1) return
      const item = this.items.splice(idx, 1)[0]
      this.items.splice(idx + 1, 0, item)
    },

    async syncNonLocalizedToAllLangs() {
      if (!confirm(`Apply image filenames, dimensions (width/height), links, and featured flags to ALL ${this.languages.length} languages? (Localized labels and descriptions will be preserved)`)) {
        return
      }

      this.saving = true
      try {
        const db = await getDbInstance()

        for (const lang of this.languages) {
          if (lang === this.selectedLang) continue

          const pSnap = await get(child(ref(db), `translations/${lang}/pages/HOME/portfoliolist`))
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
              width: Array.isArray(srcItem.width) ? [...srcItem.width] : ['1920', '768'],
              height: Array.isArray(srcItem.height) ? [...srcItem.height] : ['913', '340']
            }
          })

          await set(ref(db, `translations/${lang}/pages/HOME/portfoliolist`), merged)

          // Also sync components/related/projects for this lang
          const rSnap = await get(child(ref(db), `translations/${lang}/components/related/projects`))
          if (rSnap.exists()) {
            const rVal = rSnap.val()
            const rArr = Array.isArray(rVal) ? JSON.parse(JSON.stringify(rVal)) : Object.values(rVal)
            const updatedRelated = rArr.map(p => {
              const match = this.items.find(i => i.link === p.link)
              return {
                ...p,
                featured: match ? match.featured === true : p.featured === true
              }
            })
            await set(ref(db, `translations/${lang}/components/related/projects`), updatedRelated)
          }
        }

        this.$emit('notify', `Non-localized images, dimensions & slugs synced across all ${this.languages.length} languages!`)
      } catch (err) {
        console.error('Error syncing non-localized info:', err)
        alert('Failed to sync non-localized portfolio info: ' + (err.message || err))
      } finally {
        this.saving = false
      }
    },

    async savePortfolio() {
      this.saving = true
      try {
        const db = await getDbInstance()
        await set(ref(db, `translations/${this.selectedLang}/pages/HOME/portfoliolist`), this.items)

        // Also sync components/related/projects
        const rSnap = await get(child(ref(db), `translations/${this.selectedLang}/components/related/projects`))
        if (rSnap.exists()) {
          const rVal = rSnap.val()
          const rArr = Array.isArray(rVal) ? JSON.parse(JSON.stringify(rVal)) : Object.values(rVal)
          const updatedRelated = rArr.map(p => {
            const match = this.items.find(i => i.link === p.link)
            return {
              ...p,
              featured: match ? match.featured === true : p.featured === true
            }
          })
          await set(ref(db, `translations/${this.selectedLang}/components/related/projects`), updatedRelated)
        }

        this.$emit('notify', `Portfolio list for [${this.selectedLang.toUpperCase()}] saved successfully!`)
      } catch (err) {
        console.error('Error saving portfolio list:', err)
        alert('Failed to save portfolio list to Firebase: ' + (err.message || err))
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
