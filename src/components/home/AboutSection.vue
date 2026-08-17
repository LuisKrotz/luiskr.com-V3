<template>
  <section id="about" class="about">
    <h2 class="about-title">
      <DrawText v-if="aboutTranslations" :text="aboutTranslations.title" trigger="viewport" />
      <span
        v-else
        class="skeleton--shimmer"
        style="display: inline-block; width: 40%; height: 1em; border-radius: 4px"
      ></span>
    </h2>
    <div class="about-profile-section">
      <div class="about-profile-picture">
        <img
          v-if="aboutTranslations && profilePicture"
          decoding="async"
          loading="lazy"
          class="about-profile-picture-img"
          :src="optimizedProfilePicture"
          :srcset="profilePictureSrcset"
          sizes="200px"
          :alt="aboutTranslations.title"
          width="200"
          height="200"
        />
        <div v-else class="about-profile-picture-placeholder"></div>
      </div>
      <div class="about-profile-text">
        <div class="about-profile-text-col">
          <template v-if="aboutTranslations">
            <p class="about-item-text" v-for="item in aboutDrawData.col1" :key="item.key">
              <DrawText
                :text="item.text"
                :delay="aboutDrawData.charDelay"
                :offset="item.offset"
                trigger="viewport"
              />
            </p>
          </template>
          <div v-else>
            <p
              class="about-item-text skeleton--shimmer"
              style="width: 100%; height: 1.4em; border-radius: 4px; margin-bottom: 0.6em"
            ></p>
            <p
              class="about-item-text skeleton--shimmer"
              style="width: 88%; height: 1.4em; border-radius: 4px; margin-bottom: 0.6em"
            ></p>
            <p
              class="about-item-text skeleton--shimmer"
              style="width: 70%; height: 1.4em; border-radius: 4px"
            ></p>
          </div>
        </div>
        <div class="about-profile-text-col">
          <template v-if="aboutTranslations">
            <p class="about-item-text" v-for="item in aboutDrawData.col2" :key="item.key">
              <DrawText
                :text="item.text"
                :delay="aboutDrawData.charDelay"
                :offset="item.offset"
                trigger="viewport"
              />
            </p>
          </template>
          <div v-else>
            <p
              class="about-item-text skeleton--shimmer"
              style="width: 95%; height: 1.4em; border-radius: 4px; margin-bottom: 0.6em"
            ></p>
            <p
              class="about-item-text skeleton--shimmer"
              style="width: 80%; height: 1.4em; border-radius: 4px"
            ></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import DrawText from '../DrawText.vue'

export default {
  name: 'AboutSection',
  components: { DrawText },

  props: {
    aboutTranslations: {
      type: [Object, Boolean],
      default: false,
    },
    profilePicture: {
      type: [String, Object, null],
      default: null,
    },
  },

  computed: {
    optimizedProfilePicture() {
      if (!this.profilePicture) return ''
      if (typeof this.profilePicture === 'string' && this.profilePicture.includes('gravatar.com')) {
        return this.profilePicture.replace(/size=\d+/, 'size=300')
      }
      return this.profilePicture
    },

    profilePictureSrcset() {
      if (typeof this.profilePicture === 'string' && this.profilePicture.includes('gravatar.com')) {
        const base = this.profilePicture.replace(/(\?|&)size=\d+/, '')
        const sep = base.includes('?') ? '&' : '?'
        return `${base}${sep}size=200 1x, ${base}${sep}size=300 2x, ${base}${sep}size=400 3x`
      }
      return undefined
    },

    aboutDrawData() {
      const col1 = this.aboutTranslations?.col1 || []
      const col2 = this.aboutTranslations?.col2 || []
      const all = [...col1, ...col2]

      const strip = (s) => s.replace(/<[^>]+>/g, '')
      const totalChars = all.reduce((s, t) => s + strip(t).length, 0)
      const charDelay =
        totalChars > 0 ? Math.max(3, Math.min(20, Math.round(2000 / totalChars))) : 8

      let offset = 0
      const withOffsets = all.map((text, idx) => {
        const item = { key: idx, text, offset }
        offset += strip(text).length * charDelay
        return item
      })

      return {
        charDelay,
        col1: withOffsets.slice(0, col1.length),
        col2: withOffsets.slice(col1.length),
      }
    },
  },
}
</script>

<style lang="scss">
@import '../../sass/about';
</style>
