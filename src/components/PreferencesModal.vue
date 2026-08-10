<template>
  <teleport to="body">
    <transition name="pref-fade">
      <div
        v-if="isOpen"
        class="pref-backdrop"
        @click.self="close"
        @keydown.esc="close"
        tabindex="-1"
        ref="backdrop"
      >
        <div class="pref-dialog" role="dialog" aria-modal="true" aria-labelledby="pref-title">
          <header class="pref-header">
            <h2 id="pref-title" class="pref-title">Preferences</h2>
            <button class="pref-close-btn" @click="close" aria-label="Close preferences">
              ✕
            </button>
          </header>

          <div class="pref-body">
            <!-- Theme / Appearance section -->
            <section class="pref-section">
              <h3 class="pref-section-title">Appearance</h3>
              <p class="pref-section-desc">Choose how site themes and colors appear</p>

              <div class="pref-options pref-options--3">
                <button
                  class="pref-option-btn"
                  :class="{ active: currentTheme === 'system' }"
                  @click="setTheme('system')"
                >
                  <span class="pref-option-icon">⚙️</span>
                  <span class="pref-option-label">System</span>
                  <span class="pref-option-sub">Follow OS</span>
                </button>

                <button
                  class="pref-option-btn"
                  :class="{ active: currentTheme === 'dark' }"
                  @click="setTheme('dark')"
                >
                  <span class="pref-option-icon">🌙</span>
                  <span class="pref-option-label">Dark</span>
                  <span class="pref-option-sub">Dark mode</span>
                </button>

                <button
                  class="pref-option-btn"
                  :class="{ active: currentTheme === 'light' }"
                  @click="setTheme('light')"
                >
                  <span class="pref-option-icon">☀️</span>
                  <span class="pref-option-label">Light</span>
                  <span class="pref-option-sub">Light mode</span>
                </button>
              </div>
            </section>

            <!-- Motion & Animations section -->
            <section class="pref-section">
              <h3 class="pref-section-title">Motion & Animations</h3>
              <p class="pref-section-desc">Adjust user interface motion and layout transitions</p>

              <div class="pref-options pref-options--2">
                <button
                  class="pref-option-btn"
                  :class="{ active: !reducedMotion }"
                  @click="setMotion(false)"
                >
                  <span class="pref-option-icon">⚡</span>
                  <span class="pref-option-label">Normal</span>
                  <span class="pref-option-sub">Full motion</span>
                </button>

                <button
                  class="pref-option-btn"
                  :class="{ active: reducedMotion }"
                  @click="setMotion(true)"
                >
                  <span class="pref-option-icon">⏸️</span>
                  <span class="pref-option-label">Reduced</span>
                  <span class="pref-option-sub">Minimal motion</span>
                </button>
              </div>
            </section>
          </div>

          <footer class="pref-footer">
            <button class="pref-done-btn" @click="close">
              Done
            </button>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: 'PreferencesModal',
  computed: {
    isOpen() {
      return this.$store.getters.getPreferencesOpen
    },
    currentTheme() {
      return this.$store.getters.getTheme
    },
    reducedMotion() {
      return this.$store.getters.getReducedMotion
    },
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.backdrop?.focus()
        })
      }
    },
  },
  methods: {
    close() {
      this.$store.commit('togglePreferencesModal', false)
    },
    setTheme(mode) {
      this.$store.commit('setTheme', mode)
    },
    setMotion(enableReduced) {
      if (this.reducedMotion !== enableReduced) {
        this.$store.commit('toggleReducedMotion')
      }
    },
  },
}
</script>
