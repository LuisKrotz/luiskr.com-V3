<template>
    <div>
        <figure :style="styles">
            <img
                :class="classes"
                :width="width"
                :height="height"
                v-lazy="{
                        src: storage + src + q50,
                        loading: storage + src + thumb
                        }" />
            <label v-if="label !== ''">{{ label }}</label>

            <template v-if="canExpand">
                <button class="expand-modal-open" @click="openModal">Tap to open</button>

                <div v-if="modalOpen" class="expand-modal-content">
                    <button class="expand-modal-close" @click="closeModal">X</button>

                    <img
                        class="expand-modal-image"
                        :width="width"
                        :height="height"
                        v-lazy="{
                                src: storage + src + (!high ? q75 : q100),
                                loading: storage + src + thumb
                                }" />

                    <button v-if="!this.high" class="expand-modal-hq" @click="loadHighQuality">High Quality</button>
                </div>
            </template>
        </figure>
    </div>
</template>

<style>
  /* img[lazy=loading] {
    filter: blur(5px);
  }

  img[lazy=loaded] {
    filter: initial;
  } */
</style>

<script>
const moz = '-mozjpg', extension = '.jpg'

export default {
    name: 'Image',
        data() {
            return {
                storage:            this.$store.getters.getStorage,
                thumb:              moz + '3-MSSIM-tuned-kodak' + extension,
                q50:                moz + '-50' + extension,
                q75:                moz + '-75' + extension,
                q100:               moz + '-uncompressed' + extension,
                high:               false,
                modalOpen:          false,
                maindiv:            undefined,
                styles:             ''
            }
        },
    props: {
        classes: {
            type: String,
            default: '',
            required: false
        },
        src: {
            type: String,
            required: true
        },
        label: {
            type: String,
            default: '',
            required: false
        },
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        canExpand: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    mounted() {
        this.maindiv = document.getElementById("#main");

        if (this.canExpand)
            this.styles = {
                position: 'relative'
            }
    },
    methods: {
        loadHighQuality() {
            this.high = true;
        },
        openModal () {
            this.modalOpen = true,

            this.maindiv.classList.add('modal-open');
        },
        closeModal () {
            this.modalOpen = false;
            this.maindiv.classList.remove('modal-open');
        } 
    }
}
</script>