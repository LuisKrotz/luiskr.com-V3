<template>
  <span class="draw-text" :class="{ 'draw-text--visible': isVisible }" ref="root" :aria-label="plainText">
    <template v-for="(token, i) in tokens" :key="i">
      <br v-if="token.type === 'br'" aria-hidden="true" />
      <component
        v-else-if="token.type === 'tag-open'"
        :is="token.tag"
        v-bind="token.attrs"
        aria-hidden="true"
      >
        <template v-for="(child, ci) in token.children" :key="ci">
          <span
            v-if="child.type === 'char'"
            class="draw-text__char"
            :style="{ '--i': child.ci, '--char-delay': delay + 'ms', '--offset': offset + 'ms' }"
          >{{ child.value === ' ' ? '\u00A0' : child.value }}</span>
        </template>
      </component>
      <span
        v-else
        class="draw-text__char"
        :style="{ '--i': token.ci, '--char-delay': delay + 'ms', '--offset': offset + 'ms' }"
        aria-hidden="true"
      >{{ token.value === ' ' ? '\u00A0' : token.value }}</span>
    </template>
  </span>
</template>

<script>
export default {
  name: 'DrawText',

  props: {
    text: { type: String, required: true },
    delay: { type: Number, default: 100 },
    offset: { type: Number, default: 0 },
    trigger: { type: String, default: 'auto' },
  },

  data() {
    return {
      isVisible: false,
      observer: null,
    }
  },

  computed: {
    plainText() {
      return this.text.replace(/<[^>]+>/g, ' ')
    },

    tokens() {
      const result = []
      let charIndex = 0

      // Regex to match: self-closing tags like <br/>, opening tags like <a href="...">, closing tags like </a>, and text
      const regex = /(<br\s*\/?>)|(<(\w+)([^>]*)>(.*?)<\/\3>)|([^<]+)/gi
      let match

      while ((match = regex.exec(this.text)) !== null) {
        if (match[1]) {
          // Self-closing tag like <br>
          result.push({ type: 'br' })
        } else if (match[2]) {
          // Paired tag like <strong>text</strong> or <a href="...">text</a>
          const tag = match[3]
          const attrStr = match[4] || ''
          const innerText = match[5] || ''

          // Parse attributes
          const attrs = {}
          const attrRegex = /(\w[\w-]*)(?:=(?:"([^"]*)"|'([^']*)'))?/g
          let attrMatch
          while ((attrMatch = attrRegex.exec(attrStr)) !== null) {
            attrs[attrMatch[1]] = attrMatch[2] ?? attrMatch[3] ?? true
          }

          // Split inner text into characters
          const children = []
          for (const char of innerText) {
            children.push({ type: 'char', value: char, ci: charIndex++ })
          }

          result.push({ type: 'tag-open', tag, attrs, children })
        } else if (match[6]) {
          // Plain text
          for (const char of match[6]) {
            result.push({ type: 'char', value: char, ci: charIndex++ })
          }
        }
      }

      return result
    },
  },

  mounted() {
    if (this.trigger === 'viewport') {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.isVisible = true
            this.observer.disconnect()
          }
        },
        { threshold: 0.2 }
      )
      this.observer.observe(this.$refs.root)
    } else {
      this.isVisible = true
    }
  },

  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect()
    }
  },
}
</script>

<style lang="scss">
@import '../sass/draw-text';
</style>
