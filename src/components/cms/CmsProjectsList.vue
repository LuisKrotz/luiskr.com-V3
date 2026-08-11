<template>
  <div class="cms-projects-manager">
    <div class="cms-card" style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;">
      <div>
        <h2 class="cms-card-title">Project Case Studies Manager</h2>
        <p style="color:#8892b0; font-size:0.88rem;">Manage sections, text paragraphs, and image/video carousels for all project case studies.</p>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="cms-btn cms-btn--secondary" @click="createProjectPrompt">+ Create New Project</button>
        <button class="cms-btn cms-btn--danger" :disabled="!selectedProjectKey" @click="deleteProject">🗑️ Delete Project</button>
        <button class="cms-btn" :disabled="saving || !currentProject" @click="saveProjectData">
          {{ saving ? 'Saving...' : '💾 Save Project to Firebase' }}
        </button>
      </div>
    </div>

    <!-- Controls Row: Target Language + Selected Project -->
    <div class="cms-card" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1.2rem;">
      <div class="cms-field-group">
        <label>Target Language</label>
        <select v-model="selectedLang" class="cms-select" @change="onLangOrProjectChange">
          <option v-for="l in languages" :key="l" :value="l">{{ l.toUpperCase() }}</option>
        </select>
      </div>

      <div class="cms-field-group">
        <label>Select Project ({{ projectKeys.length }} total)</label>
        <select v-model="selectedProjectKey" class="cms-select" @change="loadProjectData">
          <option v-for="pk in projectKeys" :key="pk" :value="pk">{{ pk.toUpperCase() }}</option>
        </select>
      </div>
    </div>

    <!-- Project Data Form -->
    <div v-if="currentProject" class="cms-card">
      <h3 style="color:#66fcf1; font-size:1.1rem; font-weight:600; margin-bottom:1.2rem;">
        Editing Project: [{{ selectedProjectKey.toUpperCase() }}] ({{ selectedLang.toUpperCase() }})
      </h3>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1.2rem; margin-bottom:1.5rem;">
        <div class="cms-field-group">
          <label>Project Title</label>
          <input v-model="currentProject.title" class="cms-input" placeholder="e.g. METCHA" />
        </div>

        <div class="cms-field-group">
          <label>Assets Folder</label>
          <input v-model="currentProject.folder" class="cms-input" placeholder="e.g. metcha/" />
        </div>

        <div class="cms-field-group">
          <label>Search Engine Indexing (SEO)</label>
          <select
            :value="currentProject.noindex ? 'noindex' : 'index'"
            @change="currentProject.noindex = $event.target.value === 'noindex'"
            class="cms-select"
          >
            <option value="index">Index (Publicly Indexed)</option>
            <option value="noindex">No-Index (Draft / Block Search Engines)</option>
          </select>
        </div>
      </div>

      <!-- Cover Media Options -->
      <div v-if="currentProject.cover" style="background:rgba(0,0,0,0.25); padding:1.2rem; border-radius:10px; margin-bottom:1.5rem;">
        <h4 style="color:#fff; font-size:0.95rem; margin-bottom:1rem;">Cover Media Metadata</h4>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1.2rem;">
          <div class="cms-field-group">
            <label>Cover Source Path</label>
            <input v-model="currentProject.cover.src" class="cms-input" />
          </div>

          <div class="cms-field-group">
            <label>Cover Accessibility Label</label>
            <input v-model="currentProject.cover.label" class="cms-input" />
          </div>

          <div class="cms-field-group">
            <label>Is Video?</label>
            <select
              :value="currentProject.cover.isVideo ? 'true' : 'false'"
              @change="currentProject.cover.isVideo = $event.target.value === 'true'"
              class="cms-select"
            >
              <option value="true">Yes (Video)</option>
              <option value="false">No (Static Image)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Sections Editor -->
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; flex-wrap:wrap; gap:0.5rem;">
          <h4 style="color:#fff; font-size:1.05rem; margin:0;">Sections, Paragraphs & Carousels</h4>
          <button class="cms-btn cms-btn--secondary" style="padding:5px 12px; font-size:0.85rem;" @click="addSection">+ Add Section</button>
        </div>

        <div v-if="currentProject.sections && currentProject.sections.length">
          <div
            v-for="(sec, sIdx) in currentProject.sections"
            :key="sIdx"
            style="background:rgba(15,20,28,0.6); border:1px solid rgba(255,255,255,0.06); padding:1.2rem; border-radius:10px; margin-bottom:1.5rem;"
          >
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
              <span style="color:#66fcf1; font-size:0.95rem; font-weight:600;">Section #{{ sIdx + 1 }}</span>
              <div style="display:flex; gap:8px;">
                <button class="cms-btn cms-btn--secondary" style="padding:3px 8px; font-size:0.75rem;" @click="addCarouselBlock(sec)">+ Add Carousel Block</button>
                <button class="cms-btn cms-btn--danger" style="padding:3px 8px; font-size:0.75rem;" @click="removeSection(sIdx)">Remove Section</button>
              </div>
            </div>

            <!-- Iterate through blocks inside section -->
            <div v-for="(block, bIdx) in sec" :key="bIdx" style="margin-bottom:1rem;">
              <!-- Block Type A: Text Paragraphs (array of strings) -->
              <div v-if="isTextBlock(block)" style="background:rgba(0,0,0,0.2); padding:1rem; border-radius:8px;">
                <label style="font-size:0.8rem; color:#8892b0; display:block; margin-bottom:0.6rem; font-weight:600;">Text Paragraphs:</label>
                <div v-for="(p, pIdx) in block" :key="pIdx" style="display:flex; gap:10px; margin-bottom:0.8rem; align-items:flex-start;">
                  <textarea v-model="block[pIdx]" class="cms-textarea" rows="2" style="flex:1;"></textarea>
                  <button class="cms-btn cms-btn--danger" style="padding:6px 10px; margin-top:2px;" @click="removeParagraph(block, pIdx)">✕</button>
                </div>
                <button class="cms-btn cms-btn--secondary" style="padding:4px 10px; font-size:0.8rem;" @click="addParagraph(block)">
                  + Add Paragraph
                </button>
              </div>

              <!-- Block Type B: Carousel (array of media objects) -->
              <div v-else style="background:rgba(102, 252, 241, 0.04); border:1px dashed rgba(102, 252, 241, 0.2); padding:1rem; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
                  <span style="color:#66fcf1; font-size:0.85rem; font-weight:600;">🎠 Carousel Block ({{ block.length }} media slides)</span>
                  <div style="display:flex; gap:6px;">
                    <button class="cms-btn cms-btn--secondary" style="padding:3px 8px; font-size:0.75rem;" @click="addCarouselItem(block)">+ Add Slide</button>
                    <button class="cms-btn cms-btn--danger" style="padding:3px 8px; font-size:0.75rem;" @click="removeBlock(sec, bIdx)">Delete Carousel</button>
                  </div>
                </div>

                <!-- Carousel Items List -->
                <div style="display:flex; flex-direction:column; gap:1rem;">
                  <div
                    v-for="(item, itemIdx) in block"
                    :key="itemIdx"
                    style="background:rgba(11, 12, 16, 0.7); padding:1rem; border-radius:8px; border:1px solid rgba(255,255,255,0.08);"
                  >
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
                      <span style="color:#8892b0; font-size:0.8rem; font-weight:600;">Slide #{{ itemIdx + 1 }}</span>
                      <button class="cms-btn cms-btn--danger" style="padding:2px 6px; font-size:0.75rem;" @click="removeCarouselItem(block, itemIdx)">✕ Delete Slide</button>
                    </div>

                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:0.9rem;">
                      <div class="cms-field-group">
                        <label>Media Source Path</label>
                        <input v-model="item.src" class="cms-input" placeholder="e.g. pages/demo-screenshot" />
                      </div>

                      <div class="cms-field-group">
                        <label>Accessibility Label</label>
                        <input v-model="item.label" class="cms-input" placeholder="Image description..." />
                      </div>

                      <div class="cms-field-group">
                        <label>Width (px)</label>
                        <input
                          :value="item.size && item.size[0]"
                          @input="updateSize(item, 0, $event.target.value)"
                          class="cms-input"
                          placeholder="1920"
                        />
                      </div>

                      <div class="cms-field-group">
                        <label>Height (px)</label>
                        <input
                          :value="item.size && item.size[1]"
                          @input="updateSize(item, 1, $event.target.value)"
                          class="cms-input"
                          placeholder="1080"
                        />
                      </div>

                      <div class="cms-field-group">
                        <label>Expandable Modal?</label>
                        <select
                          :value="item.canExpand ? 'true' : 'false'"
                          @change="item.canExpand = $event.target.value === 'true'"
                          class="cms-select"
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>

                      <div class="cms-field-group">
                        <label>Is Video?</label>
                        <select
                          :value="item.isVideo ? 'true' : 'false'"
                          @change="item.isVideo = $event.target.value === 'true'"
                          class="cms-select"
                        >
                          <option value="true">Yes (Video)</option>
                          <option value="false">No (Image)</option>
                        </select>
                      </div>

                      <div class="cms-field-group">
                        <label>Layout Class</label>
                        <select v-model="item.class" class="cms-select">
                          <option value="">Standard (Portrait/Square)</option>
                          <option value="landscape">Landscape (Wide row)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDbInstance } from '../../firebase.js'
import { ref, child, get, set, remove } from 'firebase/database'

export default {
  name: 'CmsProjectsList',
  props: {
    languages: {
      type: Array,
      default: () => ['en', 'br', 'es', 'de', 'hrk', 'cas', 'riv', 'gn', 'it', 'ru', 'fr', 'tln']
    }
  },
  data() {
    return {
      selectedLang: 'en',
      selectedProjectKey: 'aboutmarco',
      defaultProjectKeys: ['aboutmarco', 'cecerele', 'cicb', 'coza', 'melissa', 'mini-melissa', 'metcha', 'mor', 'nathalia-bond', 'sage', 'transa', 'vibra'],
      projectKeys: ['aboutmarco', 'cecerele', 'cicb', 'coza', 'melissa', 'mini-melissa', 'metcha', 'mor', 'nathalia-bond', 'sage', 'transa', 'vibra'],
      currentProject: null,
      saving: false,
    }
  },
  mounted() {
    this.initProjects()
  },
  methods: {
    async initProjects() {
      await this.fetchProjectKeys()
      await this.loadProjectData()
    },

    async fetchProjectKeys() {
      try {
        const db = await getDbInstance()
        const snapshot = await get(child(ref(db), `translations/${this.selectedLang}/projects`))
        if (snapshot.exists()) {
          const keys = Object.keys(snapshot.val())
          const allKeys = Array.from(new Set([...this.defaultProjectKeys, ...keys]))
          this.projectKeys = allKeys
        }
      } catch (err) {
        console.error('Error fetching project keys:', err)
      }
    },

    async onLangOrProjectChange() {
      await this.fetchProjectKeys()
      await this.loadProjectData()
    },

    async loadProjectData() {
      try {
        const db = await getDbInstance()
        const path = `translations/${this.selectedLang}/projects/${this.selectedProjectKey}`
        const snapshot = await get(child(ref(db), path))
        if (snapshot.exists()) {
          this.currentProject = snapshot.val()
        } else {
          this.currentProject = {
            title: this.selectedProjectKey.toUpperCase(),
            folder: `${this.selectedProjectKey}/`,
            sections: [
              [["First paragraph description of project."]]
            ],
            cover: {
              src: "cover",
              label: "Project cover",
              isVideo: false,
              size: [1920, 1080]
            }
          }
        }
      } catch (err) {
        console.error('Error loading project data:', err)
      }
    },

    async deleteProject() {
      // 1st Confirmation
      const confirm1 = confirm(`⚠️ [1st CONFIRMATION]: Are you sure you want to delete project [${this.selectedProjectKey.toUpperCase()}] from [${this.selectedLang.toUpperCase()}]?`)
      if (!confirm1) return

      // 2nd Confirmation
      const confirm2 = confirm(`🚨 [2nd CONFIRMATION]: This will PERMANENTLY REMOVE project [${this.selectedProjectKey.toUpperCase()}]. An automatic backup will be created before deletion. Proceed?`)
      if (!confirm2) return

      try {
        const db = await getDbInstance()
        const path = `translations/${this.selectedLang}/projects/${this.selectedProjectKey}`
        const snap = await get(child(ref(db), path))
        
        if (snap.exists()) {
          // Backup project snapshot under admin/backups in Firebase Realtime Database
          const backupTimestamp = Date.now()
          const backupPath = `admin/backups/${backupTimestamp}_${this.selectedLang}_${this.selectedProjectKey}`
          await set(ref(db, backupPath), {
            deletedAt: new Date().toISOString(),
            lang: this.selectedLang,
            projectKey: this.selectedProjectKey,
            data: snap.val()
          })

          // Download JSON backup file automatically in browser
          const blob = new Blob([JSON.stringify(snap.val(), null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `project-backup-${this.selectedProjectKey}-${this.selectedLang}-${backupTimestamp}.json`
          a.click()
          URL.revokeObjectURL(url)
        }

        // Delete project from database
        await remove(ref(db, path))
        this.$emit('notify', `Project [${this.selectedProjectKey.toUpperCase()}] backed up and deleted!`)
        
        await this.fetchProjectKeys()
        if (this.projectKeys.length) {
          this.selectedProjectKey = this.projectKeys[0]
          await this.loadProjectData()
        } else {
          this.currentProject = null
        }
      } catch (err) {
        console.error('Error deleting project:', err)
        alert('Failed to delete project: ' + (err.message || err))
      }
    },

    isTextBlock(block) {
      return Array.isArray(block) && (block.length === 0 || typeof block[0] === 'string')
    },

    addParagraph(pArray) {
      pArray.push('New paragraph text.')
    },

    removeParagraph(pArray, idx) {
      pArray.splice(idx, 1)
    },

    addSection() {
      if (!this.currentProject.sections) this.currentProject.sections = []
      this.currentProject.sections.push([
        ["New section paragraph."]
      ])
    },

    removeSection(idx) {
      if (confirm(`Remove Section #${idx + 1}?`)) {
        this.currentProject.sections.splice(idx, 1)
      }
    },

    addCarouselBlock(sec) {
      sec.push([
        {
          src: `${this.selectedProjectKey}-media-1`,
          label: `${this.currentProject.title || 'Project'} screenshot`,
          canExpand: true,
          isVideo: false,
          size: [1920, 1080],
          class: "landscape"
        }
      ])
    },

    removeBlock(sec, bIdx) {
      if (confirm(`Delete this Carousel Block?`)) {
        sec.splice(bIdx, 1)
      }
    },

    addCarouselItem(block) {
      block.push({
        src: `${this.selectedProjectKey}-slide`,
        label: `${this.currentProject.title || 'Project'} slide`,
        canExpand: true,
        isVideo: false,
        size: [1920, 1080],
        class: ""
      })
    },

    removeCarouselItem(block, itemIdx) {
      block.splice(itemIdx, 1)
    },

    updateSize(item, dimIdx, val) {
      if (!Array.isArray(item.size)) {
        item.size = [1920, 1080]
      }
      item.size[dimIdx] = parseInt(val, 10) || 0
    },

    async createProjectPrompt() {
      const newKey = prompt("Enter new project key slug (e.g. 'my-new-project'):")
      if (newKey && newKey.trim()) {
        const slug = newKey.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
        if (!this.projectKeys.includes(slug)) {
          this.projectKeys.push(slug)
        }
        this.selectedProjectKey = slug
        await this.loadProjectData()
      }
    },

    async saveProjectData() {
      this.saving = true
      try {
        const db = await getDbInstance()
        const path = `translations/${this.selectedLang}/projects/${this.selectedProjectKey}`
        await set(ref(db, path), this.currentProject)
        this.$emit('notify', `Project [${this.selectedProjectKey.toUpperCase()}] saved for [${this.selectedLang.toUpperCase()}]!`)
        await this.fetchProjectKeys()
      } catch (err) {
        console.error('Error saving project data:', err)
        alert('Failed to save project data to Firebase: ' + (err.message || err))
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
