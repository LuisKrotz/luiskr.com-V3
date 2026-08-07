<template>
    <!-- Skeleton shimmer block. width/height can be passed as inline style via `style` prop -->
    <div :class="['skeleton', rounded ? 'skeleton--round' : '', block ? 'skeleton--block' : '']" :style="sizeStyle" aria-hidden="true"></div>
</template>

<script>
export default {
    name: 'Skeleton',
    props: {
        // Width as a CSS string, e.g. '100%', '200px'
        width:  { type: String, default: '100%' },
        // Height as a CSS string, e.g. '1em', '200px'
        height: { type: String, default: '1em' },
        // True for a perfect circle (profile picture etc.)
        rounded: { type: Boolean, default: false },
        // True to display as block (default is inline-block)
        block:   { type: Boolean, default: true },
    },
    computed: {
        sizeStyle() {
            return { width: this.width, height: this.height };
        },
    },
};
</script>
