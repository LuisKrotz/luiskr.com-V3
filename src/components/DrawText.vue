<template>
  <span class="draw-text" :class="{ 'draw-text--visible': isVisible }" ref="root" :aria-label="plainText">
    <template v-for="(token, i) in tokens" :key="i">
      <br v-if="token.type === 'br'" aria-hidden="true" />

      <!-- Word: all its chars wrapped in a nowrap container → never breaks mid-word -->
      <span v-else-if="token.type === 'word'" class="draw-text__word" aria-hidden="true">
        <span
          v-for="(ch, j) in token.chars" :key="j"
          class="draw-text__char"
          :style="{ '--i': ch.ci, '--char-delay': delay + 'ms', '--offset': offset + 'ms' }"
        >{{ ch.value }}</span>
      </span>

      <!-- Space between words: breakable word boundary, rendered as visible gap -->
      <span v-else-if="token.type === 'space'" class="draw-text__space" aria-hidden="true"/>

      <!-- Tagged content (strong, em, a, etc.) — words inside also nowrap -->
      <component
        v-else-if="token.type === 'tag'"
        :is="token.tag"
        v-bind="token.attrs"
        aria-hidden="true"
      >
        <template v-for="(chunk, ci) in token.chunks" :key="ci">
          <span v-if="chunk.type === 'word'" class="draw-text__word">
            <span
              v-for="(ch, j) in chunk.chars" :key="j"
              class="draw-text__char"
              :style="{ '--i': ch.ci, '--char-delay': delay + 'ms', '--offset': offset + 'ms' }"
            >{{ ch.value }}</span>
          </span>
          <span v-else aria-hidden="true"> </span>
        </template>
      </component>
    </template>
  </span>
</template>

<script>
export default {
  name: 'DrawText',

  props: {
    text:    { type: String, required: true },
    delay:   { type: Number, default: 100 },
    offset:  { type: Number, default: 0 },
    trigger: { type: String, default: 'auto' },  // 'auto' | 'viewport' | 'prop'
    visible: { type: Boolean, default: false },   // used when trigger='prop'
  },

  data() {
    return { isVisible: false, observer: null }
  },

  watch: {
    // Only trigger the animation once (false → true).
    // Once isVisible is true, keep it — the parent panel hides text via overflow:hidden,
    // so the animation never needs to replay on subsequent hovers.
    visible(v) {
      if (this.trigger === 'prop' && v && !this.isVisible) this.isVisible = true
    },
  },

  computed: {
    plainText() {
      return this.text.replace(/<[^>]+>/g, ' ')
    },

    tokens() {
      let ci = 0   // global char index for animation delay

      // Parse a plain-text segment into word/space chunks.
      // Words are sequences of non-space characters (hyphens stay inside the word).
      // Each word is wrapped in display:inline-block so it never splits mid-character.
      const parseText = (text) => {
        const chunks = []
        // Split on spaces — hyphens stay attached to words
        const parts = text.split(' ')
        parts.forEach((part, idx) => {
          if (part.length) {
            const chars = []
            for (const ch of part) chars.push({ ci: ci++, value: ch })
            chunks.push({ type: 'word', chars })
          }
          // Add a space after every part except the last
          if (idx < parts.length - 1) {
            ci++ // count space in animation index
            chunks.push({ type: 'space' })
          }
        })
        return chunks
      }

      const result = []
      const regex = /(<br\s*\/?>)|(<(\w+)([^>]*)>(.*?)<\/\3>)|([^<]+)/gi
      let match

      while ((match = regex.exec(this.text)) !== null) {
        if (match[1]) {
          // <br>
          result.push({ type: 'br' })
        } else if (match[2]) {
          // Paired tag: <strong>…</strong>, <a href>…</a> etc.
          const tag     = match[3]
          const attrStr = match[4] || ''
          const inner   = match[5] || ''

          const attrs = {}
          const attrRx = /(\w[\w-]*)(?:=(?:"([^"]*)"|'([^']*)'))?/g
          let a
          while ((a = attrRx.exec(attrStr)) !== null) {
            attrs[a[1]] = a[2] ?? a[3] ?? true
          }

          result.push({ type: 'tag', tag, attrs, chunks: parseText(inner) })
        } else if (match[6]) {
          // Plain text
          result.push(...parseText(match[6]))
        }
      }

      return result
    },
  },

  mounted() {
    if (this.trigger === 'viewport') {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) { this.isVisible = true; this.observer.disconnect() }
        },
        { threshold: 0.2 }
      )
      this.observer.observe(this.$refs.root)
    } else if (this.trigger === 'prop') {
      this.isVisible = this.visible   // sync initial state
    } else {
      this.isVisible = true           // 'auto': start immediately on mount
    }
  },

  beforeUnmount() {
    if (this.observer) this.observer.disconnect()
  },
}
</script>

<style lang="scss">
@import '../sass/draw-text';
</style>
