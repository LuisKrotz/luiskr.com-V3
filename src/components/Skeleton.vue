<template>
  <!-- Skeleton shimmer block. width/height can be passed as inline style via `style` prop -->
  <div
    :class="['skeleton', rounded ? 'skeleton--round' : '', block ? 'skeleton--block' : '']"
    :style="sizeStyle"
    aria-hidden="true"
  ></div>
</template>

<script>
import { calcWasmSkeletonStyle } from '../utils/wasm-css.js'

export default {
  name: 'Skeleton',
  props: {
    // Width as a CSS string, e.g. '100%', '200px'
    width: { type: String, default: '100%' },
    // Height as a CSS string, e.g. '1em', '200px'
    height: { type: String, default: '1em' },
    // True for a perfect circle (profile picture etc.)
    rounded: { type: Boolean, default: false },
    // True to display as block (default is inline-block)
    block: { type: Boolean, default: true },
  },
  computed: {
    sizeStyle() {
      const radius = this.rounded ? '50%' : '4px'
      const baseStyle = calcWasmSkeletonStyle(this.width, this.height, radius)
      return {
        ...baseStyle,
        display: this.block ? 'block' : 'inline-block',
      }
    },
  },
}
</script>
