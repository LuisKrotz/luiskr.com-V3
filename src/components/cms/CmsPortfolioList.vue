<template>
  <div class="cms-portfolio-manager">
    <div class="cms-card" style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h2 class="cms-card-title">Homepage Portfolio Items</h2>
        <p style="color:#8892b0; font-size:0.88rem;">Manage the projects featured on the main mosaic grid.</p>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="cms-btn cms-btn--secondary" @click="addNewItem">+ Add New Item</button>
        <button class="cms-btn" :disabled="saving" @click="savePortfolio">
          {{ saving ? 'Saving...' : '💾 Save to Firebase' }}
        </button>
      </div>
    </div>

    <!-- Language Selector for Portfolio Strings -->
    <div style="margin-bottom: 1.5rem; display:flex; align-items:center; gap:1rem;">
      <label style="color:#8892b0;">Target Language:</label>
      <select v-model="selectedLang" class="cms-select" style="max-width:200px;" @change="loadLangPortfolio">
        <option v-for="l in languages" :key="l" :value="l">{{ l.toUpperCase() }}</option>
      </select>
    </div>

    <!-- Items List -->
    <div v-if="items.length" style="display:flex; flex-direction:column; gap:1.2rem;">
      <div v-for="(item, idx) in items" :key="idx" class="cms-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h3 style="color:#66fcf1; font-size:1.1rem; font-weight:600;">
            #{{ idx + 1 }} {{ item.label || 'Untitled Item' }}
          </h3>
          <div style="display:flex; gap:6px;">
            <button class="cms-btn cms-btn--secondary" style="padding:4px 8px;" :disabled="idx === 0" @click="moveUp(idx)">▲</button>
            <button class="cms-btn cms-btn--secondary" style="padding:4px 8px;" :disabled="idx === items.length - 1" @click="moveDown(idx)">▼</button>
            <button class="cms-btn cms-btn--danger" style="padding:4px 8px;" @click="removeItem(idx)">✕ Delete</button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1rem;">
          <div>
            <label style="font-size:0.8rem; color:#8892b0;">Label / Title</label>
            <input v-model="item.label" class="cms-input" placeholder="e.g. METCHA" />
          </div>
          <div>
            <label style="font-size:0.8rem; color:#8892b0;">Link Slug</label>
            <input v-model="item.link" class="cms-input" placeholder="e.g. metcha" />
          </div>
          <div>
            <label style="font-size:0.8rem; color:#8892b0;">Image File (without .jpg)</label>
            <input v-model="item.image" class="cms-input" placeholder="e.g. metcha" />
          </div>
          <div>
            <label style="font-size:0.8rem; color:#8892b0;">Featured Item?</label>
            <select v-model="item.featured" class="cms-select">
              <option :value="true">Yes (Featured Banner)</option>
              <option :value="false">No (Standard Tile)</option>
            </select>
          </div>
        </div>

        <div style="margin-top:1rem;">
          <label style="font-size:0.8rem; color:#8892b0;">Description</label>
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
import { db } from '../../firebase.js'
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
    async loadLangPortfolio() {
      try {
        const snapshot = await get(child(ref(db), `translations/${this.selectedLang}/pages/HOME/portfoliolist`))
        if (snapshot.exists()) {
          const val = snapshot.val()
          this.items = Array.isArray(val) ? JSON.parse(JSON.stringify(val)) : Object.values(val)
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

    async savePortfolio() {
      this.saving = true
      try {
        await set(ref(db, `translations/${this.selectedLang}/pages/HOME/portfoliolist`), this.items)
        this.$emit('notify', `Portfolio list for [${this.selectedLang.toUpperCase()}] saved successfully!`)
      } catch (err) {
        console.error('Error saving portfolio list:', err)
        alert('Failed to save portfolio list to Firebase.')
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
