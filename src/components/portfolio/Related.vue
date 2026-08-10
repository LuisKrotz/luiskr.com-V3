<template>
  <footer class="internal-footer">
    <h2 class="internal-footer-title">
      <span v-if="translations?.title" v-html="translations.title" :key="'ttl1'"></span>
      <span v-else class="skeleton--shimmer" style="display: inline-block; width: 30%; height: 1em; border-radius: 4px" :key="'ttl2'"></span>
    </h2>

    <div class="internal-footer-related">
      <!-- Mosaic Grid of Projects -->
      <div v-if="projectsList.length" class="related-mosaic">
        <router-link
          v-for="(project, projectkey) in projectsList"
          :key="projectkey"
          :to="project.fullPath"
          class="related-mosaic-item"
          :class="{ 'related-mosaic-item--featured': project.featured }"
        >
          <div class="related-mosaic-media">
            <img
              v-if="project.imageSrc"
              :src="project.imageSrc"
              :alt="project.page"
              class="related-mosaic-img"
              loading="lazy"
              decoding="async"
              @error="onImageError($event, project)"
            />
            <div v-else class="skeleton--media"></div>
            <div class="related-mosaic-overlay"></div>
          </div>

          <div class="related-mosaic-info">
            <span class="related-mosaic-title">{{ project.page }}</span>
            <span v-if="project.description" class="related-mosaic-desc" v-html="project.description"></span>
          </div>
        </router-link>
      </div>

      <!-- Skeleton loading while items aren't ready -->
      <div v-else class="related-mosaic">
        <div
          v-for="n in 6"
          :key="n"
          class="related-mosaic-item skeleton--shimmer"
          :class="{ 'related-mosaic-item--featured': n === 1 || n === 4 }"
        ></div>
      </div>
    </div>

    <!-- Social links & notes -->
    <div class="internal-footer-items" v-if="translations?.socials">
      <template v-for="(social, socialkey) in translations.socials" :key="socialkey">
        <a :href="social.link" target="_blank" class="internal-footer-items-link">
          {{ social.network }}
        </a>
        <span
          v-if="socialkey < translations.socials.length - 1"
          class="internal-footer-items-separator"
        >
          •
        </span>
      </template>

      <p class="internal-footer-items-note" v-html="translations.note"></p>
    </div>
    <div class="internal-footer-items" v-else data-nosnippet>
      <span class="internal-footer-items-link skeleton--shimmer" style="display: inline-block; width: 45px; height: 1em; border-radius: 2px"></span>
      <span class="internal-footer-items-separator">•</span>
      <span class="internal-footer-items-link skeleton--shimmer" style="display: inline-block; width: 55px; height: 1em; border-radius: 2px"></span>
      <span class="internal-footer-items-separator">•</span>
      <span class="internal-footer-items-link skeleton--shimmer" style="display: inline-block; width: 70px; height: 1em; border-radius: 2px"></span>
      <span class="internal-footer-items-separator">•</span>
      <span class="internal-footer-items-link skeleton--shimmer" style="display: inline-block; width: 55px; height: 1em; border-radius: 2px"></span>

      <p class="internal-footer-items-note skeleton--shimmer" style="width: 90%; height: 1.2em; border-radius: 4px; margin-top: 16px; margin-bottom: 6px"></p>
      <p class="internal-footer-items-note skeleton--shimmer" style="width: 75%; height: 1.2em; border-radius: 4px"></p>
    </div>
  </footer>
</template>

<script>
import { getDatabase, ref, child, get } from 'firebase/database'

function normalizeSlug(str) {
  if (!str) return ''
  let s = String(str).toLowerCase().trim()
  s = s.replace(/^(\/projects\/|\/portfolio\/|\/)/, '').replace(/\/$/, '')
  
  if (s.includes('sage') || s.includes('genesys')) return 'sage'
  if (s.includes('nathalia') || s.includes('bond') || s.includes('clinica')) return 'nathalia-bond'
  if (s.includes('mini')) return 'mini-melissa'
  if (s.includes('cicb') || s.includes('leather')) return 'cicb'
  if (s.includes('marco')) return 'aboutmarco'
  
  return s.replace(/[^a-z0-9]/g, '')
}

const CANONICAL_IMAGE_MAP = {
  'sage': 'sage',
  'nathalia-bond': 'nathalia-bond',
  'mini-melissa': 'mini-melissa',
  'cicb': 'cicb',
  'aboutmarco': 'aboutmarco',
  'metcha': 'metcha',
  'transa': 'transa',
  'melissa': 'melissa',
  'mor': 'mor',
  'coza': 'coza',
  'cecerele': 'cecerele',
  'vibra': 'vibra',
}

export default {
  name: 'Related',

  data() {
    return {
      storage: this.$store.getters.getStorage,
      loading: this.$store.getters.getlang.loading,
      translations: {},
      homePortfolio: [],
    }
  },

  computed: {
    projectsList() {
      if (!this.translations?.projects) return []

      const rawProjects = Array.isArray(this.translations.projects)
        ? this.translations.projects
        : Object.values(this.translations.projects)

      const basePath = this.translations.path || '/portfolio/'

      return rawProjects.map((p) => {
        const cleanLink = p.link ? p.link.replace(/^(\/projects\/|\/portfolio\/|\/)/, '').replace(/\/$/, '') : ''
        const pNorm = normalizeSlug(cleanLink)

        const homeMatch = this.homePortfolio.find((h) => {
          if (!h) return false
          const hNorm = normalizeSlug(h.link)
          const hImgNorm = normalizeSlug(h.image)
          return hNorm === pNorm || hImgNorm === pNorm || (hNorm && pNorm.includes(hNorm)) || (pNorm && hNorm.includes(pNorm))
        })

        const resolvedImageName = homeMatch?.image || CANONICAL_IMAGE_MAP[pNorm] || p.image || cleanLink

        return {
          page: p.page || homeMatch?.label || homeMatch?.title || cleanLink,
          link: cleanLink,
          normSlug: pNorm,
          fullPath: (basePath.startsWith('/') ? '' : '/') + basePath.replace(/\/$/, '') + '/' + cleanLink,
          featured: p.featured === true || homeMatch?.featured === true,
          imageName: resolvedImageName,
          imageSrc: resolvedImageName ? `${this.storage}covers/${resolvedImageName}.jpg` : null,
          description: homeMatch?.description || p.description || '',
        }
      })
    },
  },

  watch: {
    '$store.state.lang.components': {
      immediate: true,
      handler() {
        this.translations = this.$store.getters.getlang.components?.related || {}
      },
    },
  },

  mounted() {
    this.fetchHomeData()
  },

  methods: {
    fetchHomeData() {
      const lang = this.$store.getters.getlang
      const dbpath = lang.database + lang.locale + lang.pagesPath + 'home'

      get(child(ref(getDatabase()), dbpath))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val()
            if (data.portfoliolist) {
              this.homePortfolio = Array.isArray(data.portfoliolist)
                ? data.portfoliolist
                : Object.values(data.portfoliolist)
            }
          }
        })
        .catch(console.error)
    },
    onImageError(e, project) {
      const img = e.target
      if (!img) return

      const step = parseInt(img.dataset.errorStep || '0', 10)
      img.dataset.errorStep = (step + 1).toString()

      const pNorm = project.normSlug
      const canonical = CANONICAL_IMAGE_MAP[pNorm] || pNorm

      const candidates = [
        `${this.storage}covers/${canonical}.jpg`,
        `${this.storage}covers/${canonical}.png`,
        `${this.storage}covers/${canonical}.webp`,
        `${this.storage}covers/sage.jpg`,
        `${this.storage}covers/nathalia-bond.jpg`,
        `${this.storage}covers/nathalia.jpg`,
        `${this.storage}covers/mini-melissa.jpg`,
        `${this.storage}covers/minimelissa.jpg`,
        `${this.storage}covers/cicb.jpg`,
        `${this.storage}covers/aboutmarco.jpg`,
        `${this.storage}covers/${project.link}.jpg`,
        `${this.storage}covers/${project.link}.png`,
      ]

      const currentSrc = img.src
      const nextCandidate = candidates.find((c) => c !== currentSrc && !img.dataset[c])

      if (nextCandidate && step < 15) {
        img.dataset[nextCandidate] = 'true'
        img.src = nextCandidate
        return
      }

      img.style.opacity = '0'
    },
  },
}
</script>
