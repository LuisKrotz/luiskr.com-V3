<template>
  <div class="cms-container">
    <!-- Header Bar -->
    <header class="cms-header">
      <div class="cms-brand">
        <span class="cms-logo">LUIS KRÖTZ</span>
        <span class="cms-badge">CMS CONTROL PANEL</span>
      </div>

      <!-- Quick Cloud & AI External Links -->
      <div class="cms-quick-tools">
        <!-- Fast Add Google AI Credits -->
        <div class="cms-dropdown">
          <a
            href="https://one.google.com/u/0/ai/activity?g1_landing_page=0&pageId=none"
            target="_blank"
            rel="noopener noreferrer"
            class="cms-quick-btn cms-quick-btn--ai"
            title="Fast Add A.I Credits"
          >
            <span class="cms-btn-icon">⚡</span>
            <span class="cms-btn-label">Fast Add A.I Credits</span>
            <span class="cms-caret">▾</span>
          </a>
          <div class="cms-dropdown-menu">
            <a
              href="https://one.google.com/u/0/ai/activity?g1_landing_page=0&pageId=none"
              target="_blank"
              rel="noopener noreferrer"
              class="cms-dropdown-item"
            >
              <span class="item-icon">⚡</span>
              Google One AI Credits & Activity
            </a>
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="cms-dropdown-item"
            >
              <span class="item-icon">✨</span>
              Google AI Studio (Gemini)
            </a>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              class="cms-dropdown-item"
            >
              <span class="item-icon">🔑</span>
              Google AI Keys & Plan
            </a>
            <a
              href="https://console.cloud.google.com/billing"
              target="_blank"
              rel="noopener noreferrer"
              class="cms-dropdown-item"
            >
              <span class="item-icon">💳</span>
              Google Cloud AI Billing
            </a>
          </div>
        </div>

        <!-- Access My Bucket -->
        <div class="cms-dropdown">
          <a
            href="https://console.cloud.google.com/storage/browser/luiskr.com;tab=objects?forceOnBucketsSortingFiltering=true&project=zer01-244214"
            target="_blank"
            rel="noopener noreferrer"
            class="cms-quick-btn cms-quick-btn--bucket"
            title="Access Storage Bucket"
          >
            <span class="cms-btn-icon">🪣</span>
            <span class="cms-btn-label">Access Bucket</span>
            <span class="cms-caret">▾</span>
          </a>
          <div class="cms-dropdown-menu">
            <a
              href="https://console.cloud.google.com/storage/browser/luiskr.com;tab=objects?forceOnBucketsSortingFiltering=true&project=zer01-244214"
              target="_blank"
              rel="noopener noreferrer"
              class="cms-dropdown-item"
            >
              <span class="item-icon">🪣</span>
              luiskr.com Cloud Bucket
            </a>
            <a
              href="https://console.firebase.google.com/u/0/project/luiskr-com/storage"
              target="_blank"
              rel="noopener noreferrer"
              class="cms-dropdown-item"
            >
              <span class="item-icon">🔥</span>
              Firebase Storage
            </a>
          </div>
        </div>

        <!-- Access Firebase -->
        <div class="cms-dropdown">
          <a
            href="https://console.firebase.google.com/u/0/project/luiskr-com/overview"
            target="_blank"
            rel="noopener noreferrer"
            class="cms-quick-btn cms-quick-btn--firebase"
            title="Access Firebase Console"
          >
            <span class="cms-btn-icon">🔥</span>
            <span class="cms-btn-label">Firebase</span>
            <span class="cms-caret">▾</span>
          </a>
          <div class="cms-dropdown-menu">
            <a
              href="https://console.firebase.google.com/u/0/project/luiskr-com/overview"
              target="_blank"
              rel="noopener noreferrer"
              class="cms-dropdown-item"
            >
              <span class="item-icon">📊</span>
              Console Overview (luiskr-com)
            </a>
            <a
              href="https://console.firebase.google.com/u/0/project/luiskr-com/database/luiskr-com/data"
              target="_blank"
              rel="noopener noreferrer"
              class="cms-dropdown-item"
            >
              <span class="item-icon">🗄️</span>
              Realtime Database
            </a>
          </div>
        </div>

        <!-- Access Billing -->
        <div class="cms-dropdown">
          <a
            href="https://console.firebase.google.com/u/0/project/luiskr-com/usage/details"
            target="_blank"
            rel="noopener noreferrer"
            class="cms-quick-btn cms-quick-btn--billing"
            title="Access Billing & Usage"
          >
            <span class="cms-btn-icon">💳</span>
            <span class="cms-btn-label">Billing</span>
            <span class="cms-caret">▾</span>
          </a>
          <div class="cms-dropdown-menu">
            <a
              href="https://console.firebase.google.com/u/0/project/luiskr-com/usage/details"
              target="_blank"
              rel="noopener noreferrer"
              class="cms-dropdown-item"
            >
              <span class="item-icon">📈</span>
              Firebase Usage & Billing
            </a>
            <a
              href="https://console.cloud.google.com/billing"
              target="_blank"
              rel="noopener noreferrer"
              class="cms-dropdown-item"
            >
              <span class="item-icon">🏛️</span>
              Google Cloud Billing
            </a>
          </div>
        </div>
      </div>

      <div class="cms-user-info">
        <img v-if="user?.photoURL" :src="user.photoURL" alt="Avatar" class="cms-avatar" />
        <span class="cms-email">{{ user?.email || 'Admin User' }}</span>
        <button class="cms-logout-btn" @click="handleLogout">Logout</button>
      </div>
    </header>

    <!-- Sub-header Navigation Tabs -->
    <nav class="cms-nav-tabs">
      <button
        class="cms-tab-btn"
        :class="{ active: activeTab === 'portfolio' }"
        @click="activeTab = 'portfolio'"
      >
        🖼️ Homepage & Portfolio
      </button>
      <button
        class="cms-tab-btn"
        :class="{ active: activeTab === 'projects' }"
        @click="activeTab = 'projects'"
      >
        📁 Project Case Studies
      </button>
      <button
        class="cms-tab-btn"
        :class="{ active: activeTab === 'languages' }"
        @click="activeTab = 'languages'"
      >
        🌐 Language Dictionary & Keys
      </button>
    </nav>

    <!-- Tab Modules -->
    <main class="cms-main-content">
      <keep-alive>
        <component :is="currentTabComponent" :languages="languages" @notify="showNotification" />
      </keep-alive>
    </main>

    <!-- Notification Toast -->
    <transition name="fade">
      <div v-if="toastMessage" class="cms-toast">
        <span>✨</span>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { logoutUser, onAuthChange } from '../firebase.js'
import CmsPortfolioList from '../components/cms/CmsPortfolioList.vue'
import CmsProjectsList from '../components/cms/CmsProjectsList.vue'
import CmsLangEditor from '../components/cms/CmsLangEditor.vue'

export default {
  name: 'CmsDashboard',
  components: {
    CmsPortfolioList,
    CmsProjectsList,
    CmsLangEditor,
  },
  data() {
    return {
      activeTab: 'portfolio',
      user: null,
      toastMessage: '',
      toastTimer: null,
      languages: ['en', 'br', 'es', 'de', 'hrk', 'cas', 'riv', 'gn', 'it', 'ru', 'fr', 'tln'],
    }
  },
  computed: {
    currentTabComponent() {
      if (this.activeTab === 'portfolio') return 'CmsPortfolioList'
      if (this.activeTab === 'projects') return 'CmsProjectsList'
      if (this.activeTab === 'languages') return 'CmsLangEditor'
      return 'CmsPortfolioList'
    },
  },
  async mounted() {
    this.unsubscribe = await onAuthChange((currentUser) => {
      this.user = currentUser
      if (!currentUser) {
        this.$router.push('/admin')
      }
    })
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe()
    if (this.toastTimer) clearTimeout(this.toastTimer)
  },
  methods: {
    async handleLogout() {
      await logoutUser()
      this.$router.push('/admin')
    },

    showNotification(msg) {
      this.toastMessage = msg
      if (this.toastTimer) clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(() => {
        this.toastMessage = ''
      }, 3500)
    },
  },
}
</script>

<style lang="scss">
@import '../sass/cms.scss';
</style>
