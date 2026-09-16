<template>
  <div class="cms-about-manager">
    <!-- Top Action Card -->
    <div class="cms-card" style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;">
      <div>
        <h2 class="cms-card-title">About Section & Gravatar Editor</h2>
        <p style="color:#8892b0; font-size:0.88rem;">Manage your bio, Gravatar profile picture, intro text, and awards/mentions.</p>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button
          class="cms-btn cms-btn--secondary"
          :disabled="saving"
          @click="syncAllNonLocalizedToAllLangs"
          title="Copies Gravatar URL/Size and Award Media (paths, sizes, links, icons) to all 12 languages while preserving localized text"
        >
          🔄 Sync All Non-Localized (Gravatar + Awards)
        </button>
        <button class="cms-btn" :disabled="saving" @click="saveAboutData">
          {{ saving ? 'Saving...' : '💾 Save to Firebase' }}
        </button>
      </div>
    </div>

    <!-- Language Selector -->
    <div class="cms-card" style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
      <label style="color:#8892b0; font-weight:500;">Target Language:</label>
      <select v-model="selectedLang" class="cms-select" style="max-width:220px;" @change="loadAboutData">
        <option v-for="l in languages" :key="l" :value="l">{{ l.toUpperCase() }}</option>
      </select>
    </div>

    <!-- Gravatar & Profile Picture Card -->
    <div class="cms-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <h3 style="color:#66fcf1; font-size:1.1rem; font-weight:600; margin:0;">
            Profile Picture & Gravatar
          </h3>
          <span style="font-size:0.8rem; color:#8892b0;">Non-localized image URL and sizing parameter.</span>
        </div>
        <button class="cms-btn cms-btn--secondary" style="font-size:0.82rem;" :disabled="saving" @click="syncGravatarToAllLangs">
          🔄 Apply Picture & Size to All Languages
        </button>
      </div>

      <div style="display:flex; gap:2rem; align-items:flex-start; flex-wrap:wrap;">
        <!-- Avatar Preview -->
        <div style="display:flex; flex-direction:column; align-items:center; gap:0.6rem;">
          <div style="width:110px; height:110px; border-radius:50%; overflow:hidden; border:2px solid #66fcf1; background:#1f2833; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(0,0,0,0.5);">
            <img
              v-if="aboutData.profilePicture && !gravatarError"
              :key="aboutData.profilePicture"
              :src="aboutData.profilePicture"
              alt="Profile Picture"
              style="width:100%; height:100%; object-fit:cover;"
              @error="gravatarError = true"
              @load="gravatarError = false"
            />
            <span v-else style="color:#8892b0; font-size:2.5rem;">👤</span>
          </div>
          <span style="font-size:0.75rem; color:#8892b0;">Live Preview</span>
        </div>

        <!-- Inputs & Controls -->
        <div style="flex:1; min-width:280px; display:flex; flex-direction:column; gap:1rem;">
          <div class="cms-field-group">
            <label>Profile Picture URL</label>
            <div style="display:flex; gap:8px; align-items:center;">
              <input
                v-model="aboutData.profilePicture"
                class="cms-input"
                placeholder="https://1.gravatar.com/userimage/... or https://www.gravatar.com/avatar/..."
                style="flex:1;"
              />
              <a
                v-if="aboutData.profilePicture"
                :href="aboutData.profilePicture"
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

          <!-- Gravatar Size Controls -->
          <div style="background:rgba(0,0,0,0.25); padding:0.8rem 1rem; border-radius:8px; display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
            <div style="display:flex; align-items:center; gap:8px;">
              <label style="color:#8892b0; font-size:0.82rem; font-weight:600; margin:0;">Gravatar Image Size (px):</label>
              <input
                type="number"
                v-model="gravatarSize"
                @input="applyGravatarSize"
                class="cms-input"
                style="width:85px; padding:4px 8px; text-align:center;"
                placeholder="256"
              />
            </div>
            <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
              <span style="font-size:0.75rem; color:#8892b0;">Quick presets:</span>
              <button
                v-for="s in [150, 200, 256, 300, 400, 512]"
                :key="s"
                class="cms-btn cms-btn--secondary"
                style="padding:2px 8px; font-size:0.75rem;"
                :style="gravatarSize == s ? 'border-color:#66fcf1; color:#66fcf1;' : ''"
                @click="setSizePreset(s)"
              >
                {{ s }}px
              </button>
            </div>
          </div>

          <!-- Email Generator Helper -->
          <div style="display:flex; gap:0.8rem; align-items:center; flex-wrap:wrap;">
            <input
              v-model="gravatarEmail"
              class="cms-input"
              style="max-width:280px;"
              placeholder="Enter email to generate Gravatar URL"
            />
            <button class="cms-btn cms-btn--secondary" style="padding:6px 14px;" @click="generateGravatarFromEmail">
              Generate Gravatar URL
            </button>
          </div>
          <p style="font-size:0.78rem; color:#8892b0; margin:0;">
            Changing size updates the <code>?size=</code> query parameter on the URL in real-time. Click <strong>"Apply Picture & Size to All Languages"</strong> to sync it across all languages immediately.
          </p>
        </div>
      </div>
    </div>

    <!-- About General Info -->
    <div class="cms-card">
      <h3 style="color:#66fcf1; font-size:1.1rem; font-weight:600; margin-bottom:1.2rem;">
        Title & Intro Callout [{{ selectedLang.toUpperCase() }}]
      </h3>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1.2rem; margin-bottom:1rem;">
        <div class="cms-field-group">
          <label>Section Title</label>
          <input v-model="aboutData.title" class="cms-input" placeholder="e.g. About me" />
        </div>
      </div>
      <div class="cms-field-group">
        <label>Intro Callout / Frame Text (HTML allowed)</label>
        <textarea
          v-model="aboutData.frame"
          class="cms-textarea"
          rows="3"
          placeholder="Hi, I'm Luis — a Software Engineer..."
        ></textarea>
      </div>
    </div>

    <!-- Bio Columns (col1 & col2) -->
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem;">
      <!-- Column 1 -->
      <div class="cms-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h3 style="color:#66fcf1; font-size:1.05rem; font-weight:600; margin:0;">
            Bio Column 1 Paragraphs ({{ aboutData.col1.length }})
          </h3>
          <button class="cms-btn cms-btn--secondary" style="padding:4px 10px; font-size:0.8rem;" @click="addCol1Paragraph">
            + Add Paragraph
          </button>
        </div>

        <div v-if="aboutData.col1.length" style="display:flex; flex-direction:column; gap:1rem;">
          <div
            v-for="(para, idx) in aboutData.col1"
            :key="'col1-' + idx"
            style="background:rgba(15,20,28,0.5); padding:0.85rem; border-radius:8px; border:1px solid rgba(255,255,255,0.05);"
          >
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
              <span style="color:#8892b0; font-size:0.8rem; font-weight:600;">Paragraph {{ idx + 1 }}</span>
              <div style="display:flex; gap:5px;">
                <button class="cms-btn cms-btn--secondary" style="padding:2px 8px; font-size:0.75rem;" :disabled="idx === 0" @click="moveCol1Up(idx)">▲</button>
                <button class="cms-btn cms-btn--secondary" style="padding:2px 8px; font-size:0.75rem;" :disabled="idx === aboutData.col1.length - 1" @click="moveCol1Down(idx)">▼</button>
                <button class="cms-btn cms-btn--danger" style="padding:2px 8px; font-size:0.75rem;" @click="removeCol1Paragraph(idx)">✕</button>
              </div>
            </div>
            <textarea
              v-model="aboutData.col1[idx]"
              class="cms-textarea"
              rows="3"
              placeholder="Paragraph content (HTML tags like <a>, <br> supported)..."
            ></textarea>
          </div>
        </div>
        <div v-else style="color:#8892b0; font-size:0.85rem; text-align:center; padding:1rem;">
          No paragraphs in column 1.
        </div>
      </div>

      <!-- Column 2 -->
      <div class="cms-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h3 style="color:#66fcf1; font-size:1.05rem; font-weight:600; margin:0;">
            Bio Column 2 Paragraphs ({{ aboutData.col2.length }})
          </h3>
          <button class="cms-btn cms-btn--secondary" style="padding:4px 10px; font-size:0.8rem;" @click="addCol2Paragraph">
            + Add Paragraph
          </button>
        </div>

        <div v-if="aboutData.col2.length" style="display:flex; flex-direction:column; gap:1rem;">
          <div
            v-for="(para, idx) in aboutData.col2"
            :key="'col2-' + idx"
            style="background:rgba(15,20,28,0.5); padding:0.85rem; border-radius:8px; border:1px solid rgba(255,255,255,0.05);"
          >
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
              <span style="color:#8892b0; font-size:0.8rem; font-weight:600;">Paragraph {{ idx + 1 }}</span>
              <div style="display:flex; gap:5px;">
                <button class="cms-btn cms-btn--secondary" style="padding:2px 8px; font-size:0.75rem;" :disabled="idx === 0" @click="moveCol2Up(idx)">▲</button>
                <button class="cms-btn cms-btn--secondary" style="padding:2px 8px; font-size:0.75rem;" :disabled="idx === aboutData.col2.length - 1" @click="moveCol2Down(idx)">▼</button>
                <button class="cms-btn cms-btn--danger" style="padding:2px 8px; font-size:0.75rem;" @click="removeCol2Paragraph(idx)">✕</button>
              </div>
            </div>
            <textarea
              v-model="aboutData.col2[idx]"
              class="cms-textarea"
              rows="3"
              placeholder="Paragraph content (HTML tags like <a>, <br> supported)..."
            ></textarea>
          </div>
        </div>
        <div v-else style="color:#8892b0; font-size:0.85rem; text-align:center; padding:1rem;">
          No paragraphs in column 2.
        </div>
      </div>
    </div>

    <!-- Awards & Mentions Section -->
    <div class="cms-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; flex-wrap:wrap; gap:0.6rem;">
        <div>
          <h3 style="color:#66fcf1; font-size:1.1rem; font-weight:600; margin:0;">
            Awards & Mentions ({{ aboutData.mention_items.length }})
          </h3>
          <p style="color:#8892b0; font-size:0.85rem; margin:0.2rem 0 0;">Certificates and mentions featured in the awards footer.</p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button
            class="cms-btn cms-btn--secondary"
            style="font-size:0.82rem;"
            :disabled="saving"
            @click="syncAwardMediaToAllLangs"
            title="Syncs award paths, dimensions, icons, and links to all languages while preserving descriptions"
          >
            🔄 Sync Award Media & Sizes to All Languages
          </button>
          <button class="cms-btn cms-btn--secondary" @click="addMentionItem">+ Add Mention Item</button>
        </div>
      </div>

      <div class="cms-field-group" style="margin-bottom:1.5rem; max-width:400px;">
        <label>Mentions Section Title</label>
        <input v-model="aboutData.mentions" class="cms-input" placeholder="e.g. Some mentions:" />
      </div>

      <div v-if="aboutData.mention_items.length" style="display:flex; flex-direction:column; gap:1.2rem;">
        <div
          v-for="(item, idx) in aboutData.mention_items"
          :key="'mention-' + idx"
          style="background:rgba(15,20,28,0.5); padding:1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.06);"
        >
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem; flex-wrap:wrap; gap:0.5rem;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.2rem;">{{ item.icon || '🏅' }}</span>
              <span style="color:#e0e6ed; font-weight:600; font-size:0.95rem;">
                Mention #{{ idx + 1 }}
              </span>
            </div>
            <div style="display:flex; gap:6px;">
              <button class="cms-btn cms-btn--secondary" style="padding:3px 9px;" :disabled="idx === 0" @click="moveMentionUp(idx)">▲</button>
              <button class="cms-btn cms-btn--secondary" style="padding:3px 9px;" :disabled="idx === aboutData.mention_items.length - 1" @click="moveMentionDown(idx)">▼</button>
              <button class="cms-btn cms-btn--danger" style="padding:3px 9px;" @click="removeMentionItem(idx)">✕ Delete</button>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; margin-bottom:0.8rem;">
            <div class="cms-field-group">
              <label>Icon / Emoji</label>
              <input v-model="item.icon" class="cms-input" placeholder="e.g. 🏆, 🌐, 📘" />
            </div>

            <div class="cms-field-group">
              <label>External / Project Link</label>
              <input v-model="item.link" class="cms-input" placeholder="https://..." />
            </div>
          </div>

          <div class="cms-field-group" style="margin-bottom:0.8rem;">
            <label>Description (HTML allowed)</label>
            <textarea
              v-model="item.description"
              class="cms-textarea"
              rows="2"
              placeholder="June 14th 2020:<br>CSSDA / UX DESIGN AWARD..."
            ></textarea>
          </div>

          <!-- Optional Media Details (for certificate SVGs/images) -->
          <div style="background:rgba(0,0,0,0.25); padding:0.8rem; border-radius:6px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-size:0.8rem; color:#8892b0; font-weight:600;">Certificate Media & Dimensions (Non-localized)</span>
              <button
                v-if="!item.media"
                class="cms-btn cms-btn--secondary"
                style="padding:2px 8px; font-size:0.75rem;"
                @click="item.media = { path: 'awards/', width: '1000', height: '1000' }"
              >
                + Attach Media
              </button>
              <button
                v-else
                class="cms-btn cms-btn--danger"
                style="padding:2px 8px; font-size:0.75rem;"
                @click="delete item.media"
              >
                Remove Media
              </button>
            </div>

            <!-- Certificate Visual Preview -->
            <div v-if="item.media" style="margin-top:0.8rem; display:flex; gap:1.2rem; align-items:center; background:rgba(15,20,28,0.6); padding:0.8rem; border-radius:8px; border:1px solid rgba(255,255,255,0.06);">
              <div style="width:75px; height:75px; border-radius:6px; overflow:hidden; background:#0b0c10; border:1px solid rgba(102,252,241,0.3); display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 2px 6px rgba(0,0,0,0.5);">
                <img
                  v-if="item.media.path"
                  :key="item.media.path"
                  :src="getAwardMediaPreview(item.media.path)"
                  alt="Award Preview"
                  style="max-width:100%; max-height:100%; object-fit:contain;"
                  @error="onAwardMediaError"
                />
                <span v-else style="font-size:0.7rem; color:#8892b0;">No media</span>
              </div>
              <div style="display:flex; flex-direction:column; gap:4px; overflow:hidden;">
                <span style="color:#66fcf1; font-size:0.85rem; font-weight:600;">Certificate Media Preview</span>
                <span style="color:#8892b0; font-size:0.75rem; font-family:monospace; word-break:break-all;">
                  {{ getAwardMediaPreview(item.media.path) }}
                </span>
                <a
                  v-if="item.media.path"
                  :href="getAwardMediaPreview(item.media.path)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="cms-btn cms-btn--secondary"
                  style="padding:2px 8px; font-size:0.72rem; align-self:flex-start; text-decoration:none; margin-top:2px;"
                >
                  ↗ Open Vector File
                </a>
              </div>
            </div>

            <div v-if="item.media" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:0.8rem; margin-top:0.8rem;">
              <div class="cms-field-group">
                <label>Media Path (e.g. awards/...)</label>
                <input v-model="item.media.path" class="cms-input" placeholder="awards/certificate.svg" />
              </div>
              <div class="cms-field-group">
                <label>Width (px)</label>
                <input v-model="item.media.width" class="cms-input" placeholder="1123" />
              </div>
              <div class="cms-field-group">
                <label>Height (px)</label>
                <input v-model="item.media.height" class="cms-input" placeholder="893" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else style="text-align:center; color:#8892b0; padding:1.5rem;">
        No mentions or awards configured for this language. Click "+ Add Mention Item" to create one.
      </div>
    </div>
  </div>
</template>

<script>
import { getDbInstance } from '../../firebase.js'
import { ref, child, get, set } from 'firebase/database'

export default {
  name: 'CmsAboutEditor',
  props: {
    languages: {
      type: Array,
      default: () => ['en', 'br', 'es', 'de', 'hrk', 'cas', 'riv', 'gn', 'it', 'ru', 'fr', 'tln']
    }
  },
  data() {
    return {
      selectedLang: 'en',
      gravatarEmail: '',
      gravatarSize: 256,
      gravatarError: false,
      saving: false,
      aboutData: {
        title: '',
        profilePicture: '',
        frame: '',
        col1: [],
        col2: [],
        mentions: '',
        mention_items: []
      }
    }
  },
  watch: {
    'aboutData.profilePicture'(val) {
      this.gravatarError = false
      if (typeof val === 'string') {
        const m = val.match(/[?&]size=(\d+)/)
        if (m && m[1]) {
          this.gravatarSize = parseInt(m[1], 10)
        }
      }
    }
  },
  mounted() {
    this.loadAboutData()
  },
  methods: {
    async loadAboutData() {
      try {
        const db = await getDbInstance()
        const snap = await get(child(ref(db), `translations/${this.selectedLang}/pages/about`))
        if (snap.exists()) {
          const val = snap.val()
          this.aboutData = {
            title: val.title || '',
            profilePicture: val.profilePicture || '',
            frame: val.frame || '',
            col1: Array.isArray(val.col1) ? [...val.col1] : (val.col1 ? Object.values(val.col1) : []),
            col2: Array.isArray(val.col2) ? [...val.col2] : (val.col2 ? Object.values(val.col2) : []),
            mentions: val.mentions || '',
            mention_items: Array.isArray(val.mention_items)
              ? JSON.parse(JSON.stringify(val.mention_items))
              : (val.mention_items ? Object.values(val.mention_items) : [])
          }
        } else {
          this.aboutData = {
            title: 'About me',
            profilePicture: '',
            frame: '',
            col1: [],
            col2: [],
            mentions: 'Some mentions:',
            mention_items: []
          }
        }
      } catch (err) {
        console.error('Error loading about data:', err)
      }
    },

    onImgError() {
      this.gravatarError = true
    },

    getAwardMediaPreview(path) {
      if (!path) return ''
      if (path.startsWith('http')) return path
      return `https://storage.googleapis.com/luiskr.com/public/_v3/${path}`
    },

    onAwardMediaError(e) {
      e.target.style.opacity = '0.3'
    },

    setSizePreset(s) {
      this.gravatarSize = s
      this.applyGravatarSize()
    },

    applyGravatarSize() {
      if (!this.aboutData.profilePicture) return
      const s = parseInt(this.gravatarSize, 10) || 256
      let url = this.aboutData.profilePicture
      if (/[?&]size=\d+/.test(url)) {
        url = url.replace(/([?&]size=)\d+/, `$1${s}`)
      } else {
        url += (url.includes('?') ? '&' : '?') + `size=${s}`
      }
      this.aboutData.profilePicture = url
    },

    async generateGravatarFromEmail() {
      const email = this.gravatarEmail.trim().toLowerCase()
      if (!email) {
        alert('Please enter an email address first.')
        return
      }

      const s = parseInt(this.gravatarSize, 10) || 256
      try {
        const msgBuffer = new TextEncoder().encode(email)
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        this.aboutData.profilePicture = `https://www.gravatar.com/avatar/${hashHex}?size=${s}`
      } catch (e) {
        console.warn('Crypto subtle SHA-256 error:', e)
        this.aboutData.profilePicture = `https://www.gravatar.com/avatar/${encodeURIComponent(email)}?size=${s}`
      }
    },

    async syncGravatarToAllLangs() {
      if (!this.aboutData.profilePicture) {
        alert('Please enter or set a profile picture URL first.')
        return
      }

      if (!confirm(`Apply "${this.aboutData.profilePicture}" as the profile picture for ALL ${this.languages.length} languages?`)) {
        return
      }

      this.saving = true
      try {
        const db = await getDbInstance()
        const updates = this.languages.map(lang =>
          set(ref(db, `translations/${lang}/pages/about/profilePicture`), this.aboutData.profilePicture)
        )
        await Promise.all(updates)
        this.$emit('notify', `Profile picture & size applied to all ${this.languages.length} languages!`)
      } catch (err) {
        console.error('Error syncing profile picture:', err)
        alert('Failed to sync profile picture: ' + (err.message || err))
      } finally {
        this.saving = false
      }
    },

    async syncAwardMediaToAllLangs() {
      if (!confirm(`Apply award media paths, dimensions, icons, and links to ALL ${this.languages.length} languages? (Localized text descriptions will be preserved)`)) {
        return
      }

      this.saving = true
      try {
        const db = await getDbInstance()
        const currentAwards = this.aboutData.mention_items

        for (const lang of this.languages) {
          if (lang === this.selectedLang) continue

          const snap = await get(child(ref(db), `translations/${lang}/pages/about/mention_items`))
          let targetAwards = []
          if (snap.exists()) {
            const v = snap.val()
            targetAwards = Array.isArray(v) ? JSON.parse(JSON.stringify(v)) : Object.values(v)
          }

          const merged = currentAwards.map((srcItem, idx) => {
            const existing = targetAwards[idx] || {}
            return {
              description: existing.description || srcItem.description,
              icon: srcItem.icon || '',
              link: srcItem.link || '',
              ...(srcItem.media ? { media: JSON.parse(JSON.stringify(srcItem.media)) } : {})
            }
          })

          await set(ref(db, `translations/${lang}/pages/about/mention_items`), merged)
        }

        this.$emit('notify', `Award media and links synced to all ${this.languages.length} languages!`)
      } catch (err) {
        console.error('Error syncing award media:', err)
        alert('Failed to sync award media: ' + (err.message || err))
      } finally {
        this.saving = false
      }
    },

    async syncAllNonLocalizedToAllLangs() {
      if (!confirm(`Sync ALL non-localized info (Gravatar URL/size AND Award media paths/sizes/links) across all ${this.languages.length} languages?`)) {
        return
      }

      this.saving = true
      try {
        await this.syncGravatarToAllLangs()
        await this.syncAwardMediaToAllLangs()
        this.$emit('notify', `All non-localized info synced across all languages!`)
      } catch (err) {
        console.error('Error in batch sync:', err)
      } finally {
        this.saving = false
      }
    },

    addCol1Paragraph() {
      this.aboutData.col1.push('New paragraph text.')
    },

    removeCol1Paragraph(idx) {
      this.aboutData.col1.splice(idx, 1)
    },

    moveCol1Up(idx) {
      if (idx <= 0) return
      const p = this.aboutData.col1.splice(idx, 1)[0]
      this.aboutData.col1.splice(idx - 1, 0, p)
    },

    moveCol1Down(idx) {
      if (idx >= this.aboutData.col1.length - 1) return
      const p = this.aboutData.col1.splice(idx, 1)[0]
      this.aboutData.col1.splice(idx + 1, 0, p)
    },

    addCol2Paragraph() {
      this.aboutData.col2.push('New paragraph text.')
    },

    removeCol2Paragraph(idx) {
      this.aboutData.col2.splice(idx, 1)
    },

    moveCol2Up(idx) {
      if (idx <= 0) return
      const p = this.aboutData.col2.splice(idx, 1)[0]
      this.aboutData.col2.splice(idx - 1, 0, p)
    },

    moveCol2Down(idx) {
      if (idx >= this.aboutData.col2.length - 1) return
      const p = this.aboutData.col2.splice(idx, 1)[0]
      this.aboutData.col2.splice(idx + 1, 0, p)
    },

    addMentionItem() {
      this.aboutData.mention_items.push({
        description: 'New mention description',
        link: 'https://',
        icon: '🏆'
      })
    },

    removeMentionItem(idx) {
      if (confirm('Delete this mention item?')) {
        this.aboutData.mention_items.splice(idx, 1)
      }
    },

    moveMentionUp(idx) {
      if (idx <= 0) return
      const m = this.aboutData.mention_items.splice(idx, 1)[0]
      this.aboutData.mention_items.splice(idx - 1, 0, m)
    },

    moveMentionDown(idx) {
      if (idx >= this.aboutData.mention_items.length - 1) return
      const m = this.aboutData.mention_items.splice(idx, 1)[0]
      this.aboutData.mention_items.splice(idx + 1, 0, m)
    },

    async saveAboutData() {
      this.saving = true
      try {
        const db = await getDbInstance()
        const path = `translations/${this.selectedLang}/pages/about`
        await set(ref(db, path), this.aboutData)
        this.$emit('notify', `About section for [${this.selectedLang.toUpperCase()}] saved successfully!`)
      } catch (err) {
        console.error('Error saving about data:', err)
        alert('Failed to save about section: ' + (err.message || err))
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
