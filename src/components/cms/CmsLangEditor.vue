<template>
  <div class="cms-lang-editor">
    <div class="cms-card" style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h2 class="cms-card-title">Language Keys & Translation Editor</h2>
        <p style="color:#8892b0; font-size:0.88rem;">Inspect and update dictionary keys across all 12 supported languages.</p>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="cms-btn cms-btn--secondary" @click="addKeyPrompt">+ Add Translation Key</button>
        <button class="cms-btn" :disabled="saving" @click="saveCategoryData">
          {{ saving ? 'Saving...' : '💾 Save Translations to Firebase' }}
        </button>
      </div>
    </div>

    <!-- Category & Language Selection -->
    <div class="cms-card" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1.2rem;">
      <div>
        <label style="font-size:0.8rem; color:#8892b0;">Language</label>
        <select v-model="selectedLang" class="cms-select" @change="loadCategoryData">
          <option v-for="l in languages" :key="l" :value="l">{{ l.toUpperCase() }}</option>
        </select>
      </div>

      <div>
        <label style="font-size:0.8rem; color:#8892b0;">Category Node</label>
        <select v-model="selectedCategory" class="cms-select" @change="loadCategoryData">
          <option value="APP">APP (Global UI & Navigation)</option>
          <option value="components">components (Related & Shared)</option>
          <option value="pages/about">pages/about (About Me Section)</option>
          <option value="pages/not-found">pages/not-found (404 Page)</option>
          <option value="pages/terms-of-use">pages/terms-of-use (Terms of Use)</option>
          <option value="pages/privacy-policy">pages/privacy-policy (Privacy Policy)</option>
          <option value="pages/GDPR">pages/GDPR (GDPR / LGPD)</option>
        </select>
      </div>

      <div>
        <label style="font-size:0.8rem; color:#8892b0;">Search Filter</label>
        <input v-model="searchQuery" class="cms-input" placeholder="Filter keys or values..." />
      </div>
    </div>

    <!-- Key-Value Pairs Editor -->
    <div v-if="filteredEntries.length" class="cms-card">
      <h3 style="color:#66fcf1; font-size:1.1rem; font-weight:600; margin-bottom:1rem;">
        [{{ selectedLang.toUpperCase() }}] - {{ selectedCategory }} ({{ filteredEntries.length }} keys)
      </h3>

      <div style="display:flex; flex-direction:column; gap:1rem;">
        <div
          v-for="entry in filteredEntries"
          :key="entry.keyPath"
          style="background:rgba(15,20,28,0.5); padding:1rem; border-radius:8px; border:1px solid rgba(255,255,255,0.05);"
        >
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <span style="color:#8892b0; font-family:monospace; font-size:0.85rem;">{{ entry.keyPath }}</span>
            <button class="cms-btn cms-btn--danger" style="padding:2px 6px; font-size:0.75rem;" @click="deleteKey(entry.keyPath)">✕ Delete</button>
          </div>

          <textarea
            v-if="typeof entry.val === 'string'"
            v-model="entry.val"
            class="cms-textarea"
            rows="2"
            @input="updateVal(entry.keyPath, entry.val)"
          ></textarea>
          <input
            v-else
            v-model="entry.val"
            class="cms-input"
            @input="updateVal(entry.keyPath, entry.val)"
          />
        </div>
      </div>
    </div>

    <div v-else class="cms-card" style="text-align:center; color:#8892b0;">
      No translation keys found matching search query.
    </div>
  </div>
</template>

<script>
import { getDbInstance } from '../../firebase.js'
import { ref, child, get, set } from 'firebase/database'

export default {
  name: 'CmsLangEditor',
  props: {
    languages: {
      type: Array,
      default: () => ['en', 'br', 'es', 'de', 'hrk', 'cas', 'riv', 'gn', 'it', 'ru', 'fr', 'tln']
    }
  },
  data() {
    return {
      selectedLang: 'en',
      selectedCategory: 'APP',
      searchQuery: '',
      categoryData: {},
      saving: false,
    }
  },
  computed: {
    flattenedEntries() {
      const result = []
      const flatten = (obj, prefix = '') => {
        if (!obj || typeof obj !== 'object') return
        for (const [k, v] of Object.entries(obj)) {
          const path = prefix ? `${prefix}.${k}` : k
          if (v && typeof v === 'object' && !Array.isArray(v)) {
            flatten(v, path)
          } else {
            result.push({ keyPath: path, val: v })
          }
        }
      }
      flatten(this.categoryData)
      return result
    },

    filteredEntries() {
      if (!this.searchQuery.trim()) return this.flattenedEntries
      const q = this.searchQuery.toLowerCase()
      return this.flattenedEntries.filter(e => {
        const kMatch = e.keyPath.toLowerCase().includes(q)
        const vMatch = typeof e.val === 'string' && e.val.toLowerCase().includes(q)
        return kMatch || vMatch
      })
    }
  },
  mounted() {
    this.loadCategoryData()
  },
  methods: {
    async loadCategoryData() {
      try {
        const db = await getDbInstance()
        const path = `translations/${this.selectedLang}/${this.selectedCategory}`
        const snapshot = await get(child(ref(db), path))
        if (snapshot.exists()) {
          this.categoryData = snapshot.val()
        } else {
          this.categoryData = {}
        }
      } catch (err) {
        console.error('Error loading category data:', err)
      }
    },

    updateVal(keyPath, newVal) {
      const parts = keyPath.split('.')
      let curr = this.categoryData
      for (let i = 0; i < parts.length - 1; i++) {
        if (!curr[parts[i]]) curr[parts[i]] = {}
        curr = curr[parts[i]]
      }
      curr[parts[parts.length - 1]] = newVal
    },

    deleteKey(keyPath) {
      if (confirm(`Delete key "${keyPath}"?`)) {
        const parts = keyPath.split('.')
        let curr = this.categoryData
        for (let i = 0; i < parts.length - 1; i++) {
          if (!curr[parts[i]]) return
          curr = curr[parts[i]]
        }
        delete curr[parts[parts.length - 1]]
        this.$emit('notify', `Deleted key "${keyPath}"`)
      }
    },

    addKeyPrompt() {
      const keyName = prompt("Enter new translation key name (e.g. 'welcome_banner'):")
      if (keyName && keyName.trim()) {
        const val = prompt("Enter translation string value:") || ""
        this.categoryData[keyName.trim()] = val
      }
    },

    async saveCategoryData() {
      this.saving = true
      try {
        const db = await getDbInstance()
        const path = `translations/${this.selectedLang}/${this.selectedCategory}`
        await set(ref(db, path), this.categoryData)
        this.$emit('notify', `Category [${this.selectedCategory}] saved for [${this.selectedLang.toUpperCase()}]!`)
      } catch (err) {
        console.error('Error saving category data:', err)
        alert('Failed to save translation data to Firebase.')
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
