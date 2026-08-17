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
            <h2 id="pref-title" class="pref-title">{{ t.title }}</h2>
            <button class="pref-close-btn" @click="close" :aria-label="t.title">&#x2715;</button>
          </header>

          <div class="pref-body">
            <section class="pref-section">
              <h3 class="pref-section-title">{{ t.appearance.title }}</h3>
              <p class="pref-section-desc">{{ t.appearance.desc }}</p>
              <div class="pref-options pref-options--3">
                <button
                  class="pref-option-btn"
                  :class="{ active: currentTheme === 'system' }"
                  @click="setTheme('system')"
                >
                  <span class="pref-option-icon">&#x2699;&#xFE0F;</span>
                  <span class="pref-option-label">{{ t.appearance.system.label }}</span>
                  <span class="pref-option-sub">{{ t.appearance.system.sub }}</span>
                </button>
                <button
                  class="pref-option-btn"
                  :class="{ active: currentTheme === 'dark' }"
                  @click="setTheme('dark')"
                >
                  <span class="pref-option-icon">&#x1F319;</span>
                  <span class="pref-option-label">{{ t.appearance.dark.label }}</span>
                  <span class="pref-option-sub">{{ t.appearance.dark.sub }}</span>
                </button>
                <button
                  class="pref-option-btn"
                  :class="{ active: currentTheme === 'light' }"
                  @click="setTheme('light')"
                >
                  <span class="pref-option-icon">&#x2600;&#xFE0F;</span>
                  <span class="pref-option-label">{{ t.appearance.light.label }}</span>
                  <span class="pref-option-sub">{{ t.appearance.light.sub }}</span>
                </button>
              </div>
            </section>

            <section class="pref-section">
              <h3 class="pref-section-title">{{ t.motion.title }}</h3>
              <p class="pref-section-desc">{{ t.motion.desc }}</p>
              <div class="pref-options pref-options--2">
                <button
                  class="pref-option-btn"
                  :class="{ active: !reducedMotion }"
                  @click="setMotion(false)"
                >
                  <span class="pref-option-icon">&#x26A1;</span>
                  <span class="pref-option-label">{{ t.motion.full.label }}</span>
                  <span class="pref-option-sub">{{ t.motion.full.sub }}</span>
                </button>
                <button
                  class="pref-option-btn"
                  :class="{ active: reducedMotion }"
                  @click="setMotion(true)"
                >
                  <span class="pref-option-icon">&#x23F8;&#xFE0F;</span>
                  <span class="pref-option-label">{{ t.motion.reduced.label }}</span>
                  <span class="pref-option-sub">{{ t.motion.reduced.sub }}</span>
                </button>
              </div>
            </section>
          </div>

          <footer class="pref-footer">
            <button class="pref-done-btn" @click="close">{{ t.done }}</button>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
const DEFAULTS = {
  title: 'Preferences',
  done: 'Done',
  appearance: {
    title: 'Appearance',
    desc: 'Choose how the site looks',
    system: { label: 'System', sub: 'Follow OS' },
    dark: { label: 'Dark', sub: 'Dark mode' },
    light: { label: 'Light', sub: 'Light mode' },
  },
  motion: {
    title: 'Motion',
    desc: 'Control animations and transitions',
    full: { label: 'Normal', sub: 'Full motion' },
    reduced: { label: 'Reduced', sub: 'Less motion' },
  },
}

export default {
  name: 'PreferencesModal',
  props: {
    pref: { type: Object, default: () => ({}) },
  },
  computed: {
    t() {
      const p = this.pref || {}
      return {
        title: p.title ?? DEFAULTS.title,
        done: p.done ?? DEFAULTS.done,
        appearance: { ...DEFAULTS.appearance, ...(p.appearance ?? {}) },
        motion: { ...DEFAULTS.motion, ...(p.motion ?? {}) },
      }
    },
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
      if (val) this.$nextTick(() => this.$refs.backdrop?.focus())
    },
  },
  methods: {
    close() {
      this.$store.commit('togglePreferencesModal', false)
    },
    setTheme(mode) {
      this.$store.commit('setTheme', mode)
    },
    setMotion(flag) {
      if (this.reducedMotion !== flag) this.$store.commit('toggleReducedMotion')
    },
  },
}
</script>
