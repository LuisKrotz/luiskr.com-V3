<template>
  <div class="cms-footer-manager">
    <!-- Top Action Card -->
    <div class="cms-card" style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;">
      <div>
        <h2 class="cms-card-title">Footers & Contact Manager</h2>
        <p style="color:#8892b0; font-size:0.88rem;">Manage footer links, legal navigation, contact info, and project disclaimer notes.</p>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="cms-btn" :disabled="saving" @click="saveFooterData">
          {{ saving ? 'Saving...' : '💾 Save Footers to Firebase' }}
        </button>
      </div>
    </div>

    <!-- Language Selector -->
    <div class="cms-card" style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
      <label style="color:#8892b0; font-weight:500;">Target Language:</label>
      <select v-model="selectedLang" class="cms-select" style="max-width:220px;" @change="loadFooterData">
        <option v-for="l in languages" :key="l" :value="l">{{ l.toUpperCase() }}</option>
      </select>
    </div>

    <!-- Section 1: Main Contact Footer (components/contact) -->
    <div class="cms-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; flex-wrap:wrap; gap:0.6rem;">
        <div>
          <h3 style="color:#66fcf1; font-size:1.1rem; font-weight:600; margin:0;">
            1. Main Contact Footer (Homepage)
          </h3>
          <p style="color:#8892b0; font-size:0.85rem; margin:0.2rem 0 0;">
            Corresponds to <code>components/contact</code>. Displays social channels & contact links.
          </p>
        </div>
        <button class="cms-btn cms-btn--secondary" style="font-size:0.82rem;" @click="syncContactLine1ToAllLangs" title="Copy Line 1 contact links to all 12 languages">
          🔄 Sync Channels (Line 1) to All Languages
        </button>
      </div>

      <div class="cms-field-group" style="max-width:360px; margin-bottom:1.5rem;">
        <label>Contact Title</label>
        <input v-model="contactData.title" class="cms-input" placeholder="e.g. Contact" />
      </div>

      <!-- Line 1: Primary Contact Links -->
      <div style="margin-bottom:1.8rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
          <h4 style="color:#fff; font-size:0.95rem; margin:0;">Line 1: Contact & Social Channels ({{ contactData.line1.length }})</h4>
          <button class="cms-btn cms-btn--secondary" style="padding:3px 10px; font-size:0.8rem;" @click="addLine1Item">+ Add Channel</button>
        </div>

        <div v-if="contactData.line1.length" style="display:flex; flex-direction:column; gap:0.8rem;">
          <div
            v-for="(item, idx) in contactData.line1"
            :key="'line1-' + idx"
            style="background:rgba(15,20,28,0.5); padding:0.85rem; border-radius:8px; border:1px solid rgba(255,255,255,0.06); display:grid; grid-template-columns: 140px 1fr auto; gap:0.8rem; align-items:center;"
          >
            <input v-model="item.description" class="cms-input" placeholder="Label (e.g. Mail)" />
            <input v-model="item.link" class="cms-input" placeholder="URL / mailto: / tel:" />
            <div style="display:flex; gap:5px;">
              <button class="cms-btn cms-btn--secondary" style="padding:3px 8px; font-size:0.75rem;" :disabled="idx === 0" @click="moveLine1Up(idx)">▲</button>
              <button class="cms-btn cms-btn--secondary" style="padding:3px 8px; font-size:0.75rem;" :disabled="idx === contactData.line1.length - 1" @click="moveLine1Down(idx)">▼</button>
              <button class="cms-btn cms-btn--danger" style="padding:3px 8px; font-size:0.75rem;" @click="removeLine1Item(idx)">✕</button>
            </div>
          </div>
        </div>
        <div v-else style="color:#8892b0; font-size:0.85rem; text-align:center; padding:1rem;">
          No channels configured in Line 1.
        </div>
      </div>

      <!-- Line 2: Secondary / Legal Links in Contact -->
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
          <h4 style="color:#fff; font-size:0.95rem; margin:0;">Line 2: Sub-links ({{ contactData.line2.length }})</h4>
          <button class="cms-btn cms-btn--secondary" style="padding:3px 10px; font-size:0.8rem;" @click="addLine2Item">+ Add Sub-link</button>
        </div>

        <div v-if="contactData.line2.length" style="display:flex; flex-direction:column; gap:0.8rem;">
          <div
            v-for="(item, idx) in contactData.line2"
            :key="'line2-' + idx"
            style="background:rgba(15,20,28,0.5); padding:0.85rem; border-radius:8px; border:1px solid rgba(255,255,255,0.06); display:grid; grid-template-columns: 180px 1fr auto; gap:0.8rem; align-items:center;"
          >
            <input v-model="item.description" class="cms-input" placeholder="Label (e.g. Privacy Policy)" />
            <input v-model="item.link" class="cms-input" placeholder="Route (e.g. /privacy-policy)" />
            <div style="display:flex; gap:5px;">
              <button class="cms-btn cms-btn--secondary" style="padding:3px 8px; font-size:0.75rem;" :disabled="idx === 0" @click="moveLine2Up(idx)">▲</button>
              <button class="cms-btn cms-btn--secondary" style="padding:3px 8px; font-size:0.75rem;" :disabled="idx === contactData.line2.length - 1" @click="moveLine2Down(idx)">▼</button>
              <button class="cms-btn cms-btn--danger" style="padding:3px 8px; font-size:0.75rem;" @click="removeLine2Item(idx)">✕</button>
            </div>
          </div>
        </div>
        <div v-else style="color:#8892b0; font-size:0.85rem; text-align:center; padding:1rem;">
          No sub-links in Line 2.
        </div>
      </div>
    </div>

    <!-- Section 2: Awards / Legal Footer Links (components/legal-footer) -->
    <div class="cms-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; flex-wrap:wrap; gap:0.6rem;">
        <div>
          <h3 style="color:#66fcf1; font-size:1.1rem; font-weight:600; margin:0;">
            2. Legal Footer Navigation Links
          </h3>
          <p style="color:#8892b0; font-size:0.85rem; margin:0.2rem 0 0;">
            Corresponds to <code>components/legal-footer</code>. Displayed at the bottom of the awards section and legal pages.
          </p>
        </div>
        <button class="cms-btn cms-btn--secondary" @click="addLegalLink">+ Add Navigation Link</button>
      </div>

      <div v-if="legalFooterLinks.length" style="display:flex; flex-direction:column; gap:0.8rem;">
        <div
          v-for="(item, idx) in legalFooterLinks"
          :key="'legal-' + idx"
          style="background:rgba(15,20,28,0.5); padding:0.85rem; border-radius:8px; border:1px solid rgba(255,255,255,0.06); display:grid; grid-template-columns: 200px 1fr auto; gap:0.8rem; align-items:center;"
        >
          <input v-model="item.page" class="cms-input" placeholder="Page Title (e.g. Terms of Use)" />
          <input v-model="item.link" class="cms-input" placeholder="Link (e.g. /terms-of-use)" />
          <div style="display:flex; gap:5px;">
            <button class="cms-btn cms-btn--secondary" style="padding:3px 8px; font-size:0.75rem;" :disabled="idx === 0" @click="moveLegalUp(idx)">▲</button>
            <button class="cms-btn cms-btn--secondary" style="padding:3px 8px; font-size:0.75rem;" :disabled="idx === legalFooterLinks.length - 1" @click="moveLegalDown(idx)">▼</button>
            <button class="cms-btn cms-btn--danger" style="padding:3px 8px; font-size:0.75rem;" @click="removeLegalLink(idx)">✕</button>
          </div>
        </div>
      </div>
      <div v-else style="color:#8892b0; font-size:0.85rem; text-align:center; padding:1rem;">
        No legal footer links configured.
      </div>
    </div>

    <!-- Section 3: Project Case Studies Footer (components/related) -->
    <div class="cms-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; flex-wrap:wrap; gap:0.6rem;">
        <div>
          <h3 style="color:#66fcf1; font-size:1.1rem; font-weight:600; margin:0;">
            3. Project Case Study Footer & Disclaimer
          </h3>
          <p style="color:#8892b0; font-size:0.85rem; margin:0.2rem 0 0;">
            Corresponds to <code>components/related</code> (shown at the bottom of case study detail pages).
          </p>
        </div>
        <button class="cms-btn cms-btn--secondary" style="font-size:0.82rem;" @click="syncRelatedSocialsToAllLangs" title="Copy case study social links to all 12 languages">
          🔄 Sync Socials to All Languages
        </button>
      </div>

      <div class="cms-field-group" style="max-width:360px; margin-bottom:1rem;">
        <label>Section Title</label>
        <input v-model="relatedData.title" class="cms-input" placeholder="e.g. Related" />
      </div>

      <div class="cms-field-group" style="margin-bottom:1.5rem;">
        <label>Project Media Disclaimer Note (HTML allowed)</label>
        <textarea
          v-model="relatedData.note"
          class="cms-textarea"
          rows="3"
          placeholder="All media on this domain was captured as screenshots..."
        ></textarea>
      </div>

      <!-- Social Links in Related -->
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
          <h4 style="color:#fff; font-size:0.95rem; margin:0;">Case Study Footer Socials ({{ relatedData.socials.length }})</h4>
          <button class="cms-btn cms-btn--secondary" style="padding:3px 10px; font-size:0.8rem;" @click="addRelatedSocial">+ Add Social Link</button>
        </div>

        <div v-if="relatedData.socials.length" style="display:flex; flex-direction:column; gap:0.8rem;">
          <div
            v-for="(item, idx) in relatedData.socials"
            :key="'related-soc-' + idx"
            style="background:rgba(15,20,28,0.5); padding:0.85rem; border-radius:8px; border:1px solid rgba(255,255,255,0.06); display:grid; grid-template-columns: 140px 1fr auto; gap:0.8rem; align-items:center;"
          >
            <input v-model="item.network" class="cms-input" placeholder="Network (e.g. Github)" />
            <input v-model="item.link" class="cms-input" placeholder="URL (e.g. https://github.com/...)" />
            <div style="display:flex; gap:5px;">
              <button class="cms-btn cms-btn--secondary" style="padding:3px 8px; font-size:0.75rem;" :disabled="idx === 0" @click="moveRelatedSocialUp(idx)">▲</button>
              <button class="cms-btn cms-btn--secondary" style="padding:3px 8px; font-size:0.75rem;" :disabled="idx === relatedData.socials.length - 1" @click="moveRelatedSocialDown(idx)">▼</button>
              <button class="cms-btn cms-btn--danger" style="padding:3px 8px; font-size:0.75rem;" @click="removeRelatedSocial(idx)">✕</button>
            </div>
          </div>
        </div>
        <div v-else style="color:#8892b0; font-size:0.85rem; text-align:center; padding:1rem;">
          No socials configured for case studies footer.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDbInstance } from '../../firebase.js'
import { ref, child, get, set } from 'firebase/database'

export default {
  name: 'CmsFooterEditor',
  props: {
    languages: {
      type: Array,
      default: () => ['en', 'br', 'es', 'de', 'hrk', 'cas', 'riv', 'gn', 'it', 'ru', 'fr', 'tln']
    }
  },
  data() {
    return {
      selectedLang: 'en',
      saving: false,
      contactData: {
        title: '',
        line1: [],
        line2: []
      },
      legalFooterLinks: [],
      relatedData: {
        title: '',
        note: '',
        socials: []
      }
    }
  },
  mounted() {
    this.loadFooterData()
  },
  methods: {
    async loadFooterData() {
      try {
        const db = await getDbInstance()
        const [contactSnap, legalSnap, relatedSnap] = await Promise.all([
          get(child(ref(db), `translations/${this.selectedLang}/components/contact`)),
          get(child(ref(db), `translations/${this.selectedLang}/components/legal-footer/links`)),
          get(child(ref(db), `translations/${this.selectedLang}/components/related`))
        ])

        if (contactSnap.exists()) {
          const val = contactSnap.val()
          this.contactData = {
            title: val.title || '',
            line1: Array.isArray(val.line1) ? JSON.parse(JSON.stringify(val.line1)) : (val.line1 ? Object.values(val.line1) : []),
            line2: Array.isArray(val.line2) ? JSON.parse(JSON.stringify(val.line2)) : (val.line2 ? Object.values(val.line2) : [])
          }
        } else {
          this.contactData = { title: 'Contact', line1: [], line2: [] }
        }

        if (legalSnap.exists()) {
          const val = legalSnap.val()
          this.legalFooterLinks = Array.isArray(val) ? JSON.parse(JSON.stringify(val)) : Object.values(val)
        } else {
          this.legalFooterLinks = []
        }

        if (relatedSnap.exists()) {
          const val = relatedSnap.val()
          this.relatedData = {
            title: val.title || '',
            note: val.note || '',
            socials: Array.isArray(val.socials) ? JSON.parse(JSON.stringify(val.socials)) : (val.socials ? Object.values(val.socials) : [])
          }
        } else {
          this.relatedData = { title: 'Related', note: '', socials: [] }
        }
      } catch (err) {
        console.error('Error loading footer data:', err)
      }
    },

    // Line 1 controls
    addLine1Item() {
      this.contactData.line1.push({ description: 'New Channel', link: 'https://' })
    },
    removeLine1Item(idx) {
      this.contactData.line1.splice(idx, 1)
    },
    moveLine1Up(idx) {
      if (idx <= 0) return
      const item = this.contactData.line1.splice(idx, 1)[0]
      this.contactData.line1.splice(idx - 1, 0, item)
    },
    moveLine1Down(idx) {
      if (idx >= this.contactData.line1.length - 1) return
      const item = this.contactData.line1.splice(idx, 1)[0]
      this.contactData.line1.splice(idx + 1, 0, item)
    },

    // Line 2 controls
    addLine2Item() {
      this.contactData.line2.push({ description: 'New Link', link: '/' })
    },
    removeLine2Item(idx) {
      this.contactData.line2.splice(idx, 1)
    },
    moveLine2Up(idx) {
      if (idx <= 0) return
      const item = this.contactData.line2.splice(idx, 1)[0]
      this.contactData.line2.splice(idx - 1, 0, item)
    },
    moveLine2Down(idx) {
      if (idx >= this.contactData.line2.length - 1) return
      const item = this.contactData.line2.splice(idx, 1)[0]
      this.contactData.line2.splice(idx + 1, 0, item)
    },

    // Legal links controls
    addLegalLink() {
      this.legalFooterLinks.push({ page: 'New Page', link: '/' })
    },
    removeLegalLink(idx) {
      this.legalFooterLinks.splice(idx, 1)
    },
    moveLegalUp(idx) {
      if (idx <= 0) return
      const item = this.legalFooterLinks.splice(idx, 1)[0]
      this.legalFooterLinks.splice(idx - 1, 0, item)
    },
    moveLegalDown(idx) {
      if (idx >= this.legalFooterLinks.length - 1) return
      const item = this.legalFooterLinks.splice(idx, 1)[0]
      this.legalFooterLinks.splice(idx + 1, 0, item)
    },

    // Related socials controls
    addRelatedSocial() {
      this.relatedData.socials.push({ network: 'New Network', link: 'https://' })
    },
    removeRelatedSocial(idx) {
      this.relatedData.socials.splice(idx, 1)
    },
    moveRelatedSocialUp(idx) {
      if (idx <= 0) return
      const item = this.relatedData.socials.splice(idx, 1)[0]
      this.relatedData.socials.splice(idx - 1, 0, item)
    },
    moveRelatedSocialDown(idx) {
      if (idx >= this.relatedData.socials.length - 1) return
      const item = this.relatedData.socials.splice(idx, 1)[0]
      this.relatedData.socials.splice(idx + 1, 0, item)
    },

    // Sync helpers
    async syncContactLine1ToAllLangs() {
      if (!confirm(`Apply the ${this.contactData.line1.length} contact channels (Line 1) to ALL ${this.languages.length} languages?`)) {
        return
      }

      this.saving = true
      try {
        const db = await getDbInstance()
        const updates = this.languages.map(lang =>
          set(ref(db, `translations/${lang}/components/contact/line1`), this.contactData.line1)
        )
        await Promise.all(updates)
        this.$emit('notify', `Line 1 contact channels applied to all ${this.languages.length} languages!`)
      } catch (err) {
        console.error('Error syncing contact line 1:', err)
        alert('Failed to sync contact channels: ' + (err.message || err))
      } finally {
        this.saving = false
      }
    },

    async syncRelatedSocialsToAllLangs() {
      if (!confirm(`Apply the ${this.relatedData.socials.length} case study social channels to ALL ${this.languages.length} languages?`)) {
        return
      }

      this.saving = true
      try {
        const db = await getDbInstance()
        const updates = this.languages.map(lang =>
          set(ref(db, `translations/${lang}/components/related/socials`), this.relatedData.socials)
        )
        await Promise.all(updates)
        this.$emit('notify', `Related social channels applied to all ${this.languages.length} languages!`)
      } catch (err) {
        console.error('Error syncing related socials:', err)
        alert('Failed to sync related socials: ' + (err.message || err))
      } finally {
        this.saving = false
      }
    },

    async saveFooterData() {
      this.saving = true
      try {
        const db = await getDbInstance()
        await Promise.all([
          set(ref(db, `translations/${this.selectedLang}/components/contact`), this.contactData),
          set(ref(db, `translations/${this.selectedLang}/components/legal-footer/links`), this.legalFooterLinks),
          set(ref(db, `translations/${this.selectedLang}/components/related/title`), this.relatedData.title),
          set(ref(db, `translations/${this.selectedLang}/components/related/note`), this.relatedData.note),
          set(ref(db, `translations/${this.selectedLang}/components/related/socials`), this.relatedData.socials)
        ])
        this.$emit('notify', `Footers for [${this.selectedLang.toUpperCase()}] saved successfully!`)
      } catch (err) {
        console.error('Error saving footer data:', err)
        alert('Failed to save footers: ' + (err.message || err))
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
