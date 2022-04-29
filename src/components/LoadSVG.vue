<template>
    <svg
        :class="classes"  
        :viewBox="svg.viewBox"
        :alt="loading.msg1"
        aria-hidden="true">
            <title>{{ loading.msg1 }}</title>
        <g>
            <polygon v-for="polygon, key in svg.polygonPoints" class="load-svg-triangle-1" :points="polygon" :key="key"/>
            <text v-if="renderText" class="load-svg-text" :transform="svg.textTransform">&lt;{{ loading.msg1 }}/&gt;</text>
        </g>
    </svg>
</template>

<script>
export default {
    name: 'LoadSVG',
    data() {
        return {
            svg:            this.$store.getters.getSVG,
            loading:        this.$store.getters.getlang.loading
        }
    },
    props: {
        classes: {
            required: true,
            type: String
        },
        renderText: {
            required: false,
            default: true
        }
    }
}
</script>