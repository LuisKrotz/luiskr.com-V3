<template>
  <div class="cms-container">
    <!-- Header Bar -->
    <header class="cms-header">
      <div class="cms-brand">
        <span class="cms-logo">LUIS KRÖTZ</span>
        <span class="cms-badge">CMS CONTROL PANEL</span>
      </div>

      <div class="cms-user-info">
        <img
          v-if="user?.photoURL"
          :src="user.photoURL"
          alt="Avatar"
          class="cms-avatar"
        />
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
        <component
          :is="currentTabComponent"
          :languages="languages"
          @notify="showNotification"
        />
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
import { auth, logoutUser, onAuthChange } from '../firebase.js'
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
  mounted() {
    this.unsubscribe = onAuthChange((currentUser) => {
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
