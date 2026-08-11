<template>
  <div class="cms-projects-manager">
    <div class="cms-card" style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h2 class="cms-card-title">Project Case Studies Manager</h2>
        <p style="color:#8892b0; font-size:0.88rem;">Manage sections, paragraphs, and media for all project case studies.</p>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="cms-btn cms-btn--secondary" @click="createProjectPrompt">+ Create New Project</button>
        <button class="cms-btn" :disabled="saving || !currentProject" @click="saveProjectData">
          {{ saving ? 'Saving...' : '💾 Save Project to Firebase' }}
        </button>
      </div>
    </div>

    <!-- Controls Row: Target Language + Selected Project -->
    <div class="cms-card" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1.2rem;">
      <div>
        <label style="font-size:0.8rem; color:#8892b0;">Target Language</label>
        <select v-model="selectedLang" class="cms-select" @change="loadProjectData">
          <option v-for="l in languages" :key="l" :value="l">{{ l.toUpperCase() }}</option>
        </select>
      </div>

      <div>
        <label style="font-size:0.8rem; color:#8892b0;">Select Project</label>
        <select v-model="selectedProjectKey" class="cms-select" @change="loadProjectData">
          <option v-for="pk in projectKeys" :key="pk" :value="pk">{{ pk.toUpperCase() }}</option>
        </select>
      </div>
    </div>

    <!-- Project Data Form -->
    <div v-if="currentProject" class="cms-card">
      <h3 style="color:#66fcf1; font-size:1.1rem; font-weight:600; margin-bottom:1rem;">
        Editing Project: [{{ selectedProjectKey.toUpperCase() }}] ({{ selectedLang.toUpperCase() }})
      </h3>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
        <div>
          <label style="font-size:0.8rem; color:#8892b0;">Project Title</label>
          <input v-model="currentProject.title" class="cms-input" placeholder="e.g. METCHA" />
        </div>
        <div>
          <label style="font-size:0.8rem; color:#8892b0;">Assets Folder</label>
          <input v-model="currentProject.folder" class="cms-input" placeholder="e.g. metcha/" />
        </div>
      </div>

      <!-- Cover Media Options -->
      <div v-if="currentProject.cover" style="background:rgba(0,0,0,0.2); padding:1rem; border-radius:8px; margin-bottom:1.5rem;">
        <h4 style="color:#fff; font-size:0.95rem; margin-bottom:0.8rem;">Cover Media Metadata</h4>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
          <div>
            <label style="font-size:0.75rem; color:#8892b0;">Cover Source Path</label>
            <input v-model="currentProject.cover.src" class="cms-input" />
          </div>
          <div>
            <label style="font-size:0.75rem; color:#8892b0;">Cover Accessibility Label</label>
            <input v-model="currentProject.cover.label" class="cms-input" />
          </div>
          <div>
            <label style="font-size:0.75rem; color:#8892b0;">Is Video?</label>
            <select v-model="currentProject.cover.isVideo" class="cms-select">
              <option :value="true">Yes (Video)</option>
              <option :value="false">No (Static Image)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Sections Editor -->
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h4 style="color:#fff; font-size:1.05rem;">Sections & Paragraphs</h4>
          <button class="cms-btn cms-btn--secondary" style="padding:4px 10px; font-size:0.85rem;" @click="addSection">+ Add Section</button>
        </div>

        <div v-if="currentProject.sections && currentProject.sections.length">
          <div
            v-for="(sec, sIdx) in currentProject.sections"
            :key="sIdx"
            style="background:rgba(15,20,28,0.6); border:1px solid rgba(255,255,255,0.06); padding:1.2rem; border-radius:8px; margin-bottom:1rem;"
          >
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
              <span style="color:#66fcf1; font-size:0.9rem; font-weight:600;">Section #{{ sIdx + 1 }}</span>
              <button class="cms-btn cms-btn--danger" style="padding:3px 8px; font-size:0.75rem;" @click="removeSection(sIdx)">Remove Section</button>
            </div>

            <!-- Text Paragraphs array (sec[0]) -->
            <div v-if="Array.isArray(sec[0])">
              <label style="font-size:0.75rem; color:#8892b0; display:block; margin-bottom:0.5rem;">Paragraphs:</label>
              <div v-for="(p, pIdx) in sec[0]" :key="pIdx" style="display:flex; gap:8px; margin-bottom:0.5rem;">
                <textarea v-model="sec[0][pIdx]" class="cms-textarea" rows="2"></textarea>
                <button class="cms-btn cms-btn--danger" style="padding:4px 8px;" @click="removeParagraph(sec[0], pIdx)">✕</button>
              </div>
              <button class="cms-btn cms-btn--secondary" style="padding:3px 8px; font-size:0.75rem; margin-top:0.3rem;" @click="addParagraph(sec[0])">
                + Add Paragraph
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../../firebase.js'
import { ref, child, get, set } from 'firebase/database'

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
      projectKeys: ['aboutmarco', 'cecerele', 'cicb', 'coza', 'melissa', 'mini-melissa', 'metcha', 'mor', 'nathalia-bond', 'sage', 'transa', 'vibra'],
      currentProject: null,
      saving: false,
    }
  },
  mounted() {
    this.loadProjectData()
  },
  methods: {
    async loadProjectData() {
      try {
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

    createProjectPrompt() {
      const newKey = prompt("Enter new project key slug (e.g. 'my-new-project'):")
      if (newKey && newKey.trim()) {
        const slug = newKey.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
        if (!this.projectKeys.includes(slug)) {
          this.projectKeys.push(slug)
        }
        this.selectedProjectKey = slug
        this.loadProjectData()
      }
    },

    async saveProjectData() {
      this.saving = true
      try {
        const path = `translations/${this.selectedLang}/projects/${this.selectedProjectKey}`
        await set(ref(db, path), this.currentProject)
        this.$emit('notify', `Project [${this.selectedProjectKey.toUpperCase()}] saved for [${this.selectedLang.toUpperCase()}]!`)
      } catch (err) {
        console.error('Error saving project data:', err)
        alert('Failed to save project data to Firebase.')
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
