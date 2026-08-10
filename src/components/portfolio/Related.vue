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

function getWords(str) {
  if (!str) return []
  return String(str)
    .toLowerCase()
    .replace(/^(\/projects\/|\/portfolio\/|\/)/, '')
    .replace(/\/$/, '')
    .split(/[-_\s]+/)
    .filter((w) => w.length >= 2)
}

function cleanSlug(str) {
  if (!str) return ''
  return String(str)
    .toLowerCase()
    .replace(/^(\/projects\/|\/portfolio\/|\/)/, '')
    .replace(/\/$/, '')
    .replace(/[^a-z0-9]/g, '')
}

function findDynamicMatch(pLink, homePortfolio) {
  if (!pLink || !Array.isArray(homePortfolio) || !homePortfolio.length) return null

  const pClean = cleanSlug(pLink)
  const pWords = getWords(pLink)

  // 1. Exact match on link or image filename
  let match = homePortfolio.find((h) => {
    if (!h) return false
    const hCleanLink = cleanSlug(h.link)
    const hCleanImg = cleanSlug(h.image)
    return hCleanLink === pClean || hCleanImg === pClean
  })
  if (match) return match

  // 2. Substring containment match
  match = homePortfolio.find((h) => {
    if (!h) return false
    const hCleanLink = cleanSlug(h.link)
    const hCleanImg = cleanSlug(h.image)
    return (
      (hCleanLink && (pClean.includes(hCleanLink) || hCleanLink.includes(pClean))) ||
      (hCleanImg && (pClean.includes(hCleanImg) || hCleanImg.includes(pClean)))
    )
  })
  if (match) return match

  // 3. Dynamic word intersection match
  match = homePortfolio.find((h) => {
    if (!h) return false
    const hWords = getWords(h.link).concat(getWords(h.image))
    return pWords.some((pw) => hWords.includes(pw))
  })

  return match || null
}

function generatePureDynamicCandidates(pLink, pImage, homeMatch, storage) {
  const candidateNames = []

  // 1. Home dataset match cover image filename
  if (homeMatch?.image) candidateNames.push(homeMatch.image)

  // 2. Related project image property
  if (pImage) candidateNames.push(pImage)

  // 3. Dynamic word & sub-phrase permutations (100% computed, zero hardcoding)
  if (pLink) {
    const raw = String(pLink).toLowerCase().replace(/^(\/projects\/|\/portfolio\/|\/)/, '').replace(/\/$/, '')
    candidateNames.push(raw)
    candidateNames.push(cleanSlug(raw))

    const words = getWords(raw)
    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j <= words.length; j++) {
        const sub = words.slice(i, j).join('-')
        const subClean = sub.replace(/[^a-z0-9]/g, '')
        if (!candidateNames.includes(sub)) candidateNames.push(sub)
        if (!candidateNames.includes(subClean)) candidateNames.push(subClean)
      }
    }

    words.slice().reverse().forEach((w) => {
      if (!candidateNames.includes(w)) candidateNames.push(w)
    })
  }

  const uniqueNames = [...new Set(candidateNames.filter(Boolean))]

  const candidateUrls = []
  uniqueNames.forEach((name) => {
    ;['.jpg', '.png', '.webp'].forEach((ext) => {
      const url = `${storage}covers/${name}${ext}`
      if (!candidateUrls.includes(url)) candidateUrls.push(url)
    })
  })

  return candidateUrls
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
      const homeList = this.$store.state.portfoliolist?.length
        ? this.$store.state.portfoliolist
        : this.homePortfolio

      return rawProjects.map((p) => {
        const cleanLink = p.link ? p.link.replace(/^(\/projects\/|\/portfolio\/|\/)/, '').replace(/\/$/, '') : ''

        // Dynamically match project against live Home portfolio dataset
        const homeMatch = findDynamicMatch(cleanLink, homeList)

        // Pure dynamic candidate URL generation with ZERO hardcoding
        const candidates = generatePureDynamicCandidates(cleanLink, p.image, homeMatch, this.storage)

        return {
          page: p.page || homeMatch?.label || homeMatch?.title || cleanLink,
          link: cleanLink,
          fullPath: (basePath.startsWith('/') ? '' : '/') + basePath.replace(/\/$/, '') + '/' + cleanLink,
          featured: p.featured === true || homeMatch?.featured === true,
          imageSrc: candidates[0] || `${this.storage}covers/${cleanLink}.jpg`,
          candidateUrls: candidates,
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
              const list = Array.isArray(data.portfoliolist)
                ? data.portfoliolist
                : Object.values(data.portfoliolist)
              this.homePortfolio = list
              this.$store.commit('setPortfolioList', list)
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

      const candidates = project.candidateUrls || []
      if (step < candidates.length) {
        const nextCandidate = candidates[step]
        if (nextCandidate && nextCandidate !== img.src) {
          img.src = nextCandidate
        }
      }
    },
  },
}
</script>
