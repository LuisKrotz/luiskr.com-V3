import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import router from '../core/router.js'
import { LAYOUT, CLASSES, SELECTORS, MEDIA_DIMENSIONS, ATTRS, TEXT, EVENTS, STRINGS } from '../core/constants.js'
import { h } from '../core/jsx.js'
import {
  calcColumnWidth,
  calcColsForWidth,
  calcResponsivePadding,
} from '../utils/wasm-layout.js'
import { wasmPool } from '../utils/wasm-pool.js'
import { npuPredict } from '../utils/npu-predict.js'
import { buildCoverUrls } from '../utils/media.js'
import homeMosaicStyles from '../sass/home-mosaic.scss?inline'

const { FEAT_MULT, COMP_MULTS, GAP: GAP_PX } = LAYOUT

export class HomeMosaic extends BaseComponent {
  constructor() {
    super(homeMosaicStyles)
    this._processedItems = []
    this._translations = null
    this.hoveredIdx = null
    this.touchIdx = null
    this.cards = []
    this.containerH = '0px'
    this.bottomHMap = {}
    this.ext = '.jpg'
    this._rafId = null
  }

  set processedItems(val) {
    this._processedItems = Array.isArray(val) ? val : []
    this.quickLayout()
    if (this._isMounted) {
      this._updateDom()
    }
    this.scheduleLayout()
  }


  get processedItems() {
    return this._processedItems
  }

  set translations(val) {
    this._translations = val
    if (this._isMounted) {
      this._updateDom()
      this.scheduleLayout()
    }
  }

  get translations() {
    return this._translations
  }

  get hasTouch() {
    return store.getters.getTouch()
  }

  get storage() {
    return store.getters.getStorage()
  }

  get skeletonH() {
    const vw = typeof window !== STRINGS.UNDEFINED ? window.innerWidth : 375
    const pad = calcResponsivePadding(vw)
    const W = vw - pad * 2
    const N = calcColsForWidth(vw)
    const gap = GAP_PX
    const colW = Math.floor(calcColumnWidth(N, W, gap))
    const ITEMS = 12
    const colH = Array(N).fill(0)
    for (let i = 0; i < ITEMS; i++) {
      const imageH = Math.round(colW * COMP_MULTS[i % COMP_MULTS.length])
      let best = 0
      for (let c = 1; c < N; c++) if (colH[c] < colH[best]) best = c
      colH[best] += imageH + gap
    }
    return Math.max(...colH) - gap + 'px'
  }

  onMounted() {
    this.addScopedListener(this.shadowRoot, EVENTS.CLICK, (e) => {
      const itemEl = e.target.closest(SELECTORS.HOME_MOSAIC_ITEM)

      if (!itemEl) return

      const idx = parseInt(itemEl.getAttribute(ATTRS.DATA_INDEX), 10)

      const item = this.processedItems[idx]

      if (item) this.onClick(item, idx)
    })

    this.addScopedListener(this.shadowRoot, EVENTS.MOUSEOVER, (e) => {
      const itemEl = e.target.closest(SELECTORS.HOME_MOSAIC_ITEM)

      if (!itemEl) return

      const idx = parseInt(itemEl.getAttribute(ATTRS.DATA_INDEX), 10)

      if (this.hoveredIdx !== idx) {
        this.onHover(idx)
      }
    })

    this.addScopedListener(this.shadowRoot, EVENTS.MOUSEOUT, (e) => {
      const itemEl = e.target.closest(SELECTORS.HOME_MOSAIC_ITEM)

      if (!itemEl) return

      const related = e.relatedTarget ? e.relatedTarget.closest?.(SELECTORS.HOME_MOSAIC_ITEM) : null

      if (related === itemEl) return

      this.onLeave()
    })

    if (this.processedItems.length) {
      this._updateDom()
    }

    this.quickLayout()

    this.scheduleLayout()

    this.addScopedListener(window, EVENTS.RESIZE, () => {
      this.quickLayout()

      this.scheduleLayout()
    })
  }


  onDestroy() {
    if (this._rafId) cancelAnimationFrame(this._rafId)
  }

  scheduleLayout() {
    if (this._rafId) cancelAnimationFrame(this._rafId)
    this._rafId = requestAnimationFrame(() => this.layout())
  }

  quickLayout() {
    const vw = typeof window !== STRINGS.UNDEFINED ? window.innerWidth : 0
    if (!vw || !this.processedItems.length) return

    const pad = calcResponsivePadding(vw)
    const W = vw - pad * 2
    const gap = GAP_PX
    const N = calcColsForWidth(vw)
    const colW = Math.floor(calcColumnWidth(N, W, gap))
    const colH = Array(N).fill(0)

    this.cards = this.processedItems.map((item, i) => {
      const active = this.hoveredIdx === i || this.touchIdx === i
      const bottomH = active ? (this.bottomHMap[i] ?? 130) : 0

      const span = item.featured && N > 1 ? 2 : 1
      const itemW = span * colW + (span - 1) * gap
      const mult = item.featured ? FEAT_MULT : COMP_MULTS[i % COMP_MULTS.length]
      const imageH = Math.round(itemW * mult)
      const totalH = imageH + bottomH

      let bestCol = 0
      let bestTop = Infinity
      for (let c = 0; c <= N - span; c++) {
        let top = 0
        for (let s = 0; s < span; s++) top = Math.max(top, colH[c + s])
        if (top < bestTop) {
          bestTop = top
          bestCol = c
        }
      }

      const top = bestTop
      const left = bestCol * (colW + gap)
      for (let s = 0; s < span; s++) colH[bestCol + s] = top + totalH + gap

      return {
        bottomH,
        card: {
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
          width: `${itemW}px`,
          height: `${totalH}px`,
          overflow: 'hidden',
        },
        media: {
          position: 'relative',
          width: '100%',
          height: `${imageH}px`,
          overflow: 'hidden',
          flexShrink: '0',
        },
        bottom: {
          width: '100%',
          height: `${bottomH}px`,
          overflow: 'hidden',
        },
      }
    })

    this.containerH = Math.max(...colH) - gap + 'px'
    const mosaicEl = this.$('.home-mosaic')
    if (mosaicEl) {
      mosaicEl.style.height = this.containerH
      this._applyCardStyles()
    }
  }

  layout() {
    const el = this.$('.home-mosaic')
    if (!el || !this.processedItems.length) return
    const W = el.getBoundingClientRect().width
    if (!W) {
      this.quickLayout()
      this.scheduleLayout()
      return
    }

    const gap = GAP_PX
    const vw = window.innerWidth
    const N = calcColsForWidth(vw)
    const colW = Math.floor(calcColumnWidth(N, W, gap))
    const colH = Array(N).fill(0)

    // WASM Worker acceleration (only when no card is expanded)
    if (this.hoveredIdx === null && this.touchIdx === null) {
      wasmPool
        .dispatch('BATCH_LAYOUT', {
          items: this.processedItems.map((item) => ({ featured: !!item.featured })),
          cols: N,
          containerW: W,
          gap,
        })
        .then((res) => {
          if (this.hoveredIdx === null && this.touchIdx === null && res && res.totalHeight) {
            this.containerH = res.totalHeight + 'px'
            if (el) el.style.height = this.containerH
          }
        })
    }

    this.cards = this.processedItems.map((item, i) => {
      const active = this.hoveredIdx === i || this.touchIdx === i
      const bottomH = active ? (this.bottomHMap[i] ?? 130) : 0

      const span = item.featured && N > 1 ? 2 : 1
      const itemW = span * colW + (span - 1) * gap
      const mult = item.featured ? FEAT_MULT : COMP_MULTS[i % COMP_MULTS.length]
      const imageH = Math.round(itemW * mult)
      const totalH = imageH + bottomH

      let bestCol = 0
      let bestTop = Infinity
      for (let c = 0; c <= N - span; c++) {
        let top = 0
        for (let s = 0; s < span; s++) top = Math.max(top, colH[c + s])
        if (top < bestTop) {
          bestTop = top
          bestCol = c
        }
      }

      const top = bestTop
      const left = bestCol * (colW + gap)
      for (let s = 0; s < span; s++) colH[bestCol + s] = top + totalH + gap

      return {
        bottomH,
        card: {
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
          width: `${itemW}px`,
          height: `${totalH}px`,
          overflow: 'hidden',
        },
        media: {
          position: 'relative',
          width: '100%',
          height: `${imageH}px`,
          overflow: 'hidden',
          flexShrink: '0',
        },
        bottom: {
          width: '100%',
          height: `${bottomH}px`,
          overflow: 'hidden',
        },
      }
    })

    this.containerH = Math.max(...colH) - gap + 'px'
    if (el) {
      el.style.height = this.containerH
    }
    this._applyCardStyles()
  }

  _applyCardStyles() {
    const cardEls = this.$$(`.${CLASSES.HOME_MOSAIC_ITEM}`)
    cardEls.forEach((cardEl, i) => {
      const c = this.cards[i]
      if (c && c.card) {
        Object.assign(cardEl.style, c.card)
        const media = cardEl.querySelector(`.${CLASSES.HOME_MOSAIC_MEDIA}`)
        if (media && c.media) Object.assign(media.style, c.media)
        const bottom = cardEl.querySelector(`.${CLASSES.HOME_MOSAIC_BOTTOM}`)
        if (bottom && c.bottom) Object.assign(bottom.style, c.bottom)
      }
    })
  }

  onHover(i) {
    if (this.hasTouch) return
    this.hoveredIdx = i
    this.layout()
    npuPredict.predictTargetLikelihood('mosaic_card', this.processedItems[i]?.link, 150)

    const item = this.processedItems[i]
    const detail = this.$(`.${CLASSES.HOME_MOSAIC_DETAILS}[data-index="${i}"]`)
    if (detail && item?.description) {
      let descEl = detail.querySelector(`.${CLASSES.HOME_MOSAIC_DESC}`)
      if (!descEl) {
        descEl = document.createElement('p')
        descEl.className = CLASSES.HOME_MOSAIC_DESC
        descEl.innerHTML = `<draw-text text="${item.description.replace(/"/g, '&quot;')}" delay="8"></draw-text>`
        const btn = detail.querySelector(`.${CLASSES.HOME_MOSAIC_BTN}`)
        if (btn) detail.insertBefore(descEl, btn)
        else detail.appendChild(descEl)
      }
    }

    requestAnimationFrame(() => {
      const detail = this.$(`.home-mosaic-details[data-index="${i}"]`)
      if (detail) {
        this.bottomHMap[i] = Math.max(detail.scrollHeight + 24, 130)
      }
      this.layout()
    })
  }

  onLeave() {
    if (this.hasTouch) return
    const prevIdx = this.hoveredIdx
    this.hoveredIdx = null
    if (prevIdx !== null) {
      const detail = this.$(`.${CLASSES.HOME_MOSAIC_DETAILS}[data-index="${prevIdx}"]`)
      if (detail) {
        const descEl = detail.querySelector(`.${CLASSES.HOME_MOSAIC_DESC}`)
        if (descEl) descEl.remove()
      }
    }
    this.layout()
  }

  onClick(item, i) {
    // Match Vue: detect touch via store hasTouch OR ontouchstart OR coarse pointer
    const isTouch =
      Boolean(this.hasTouch) ||
      'ontouchstart' in window ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)

    if (!item.link) return
    const lang = store.getters.getLang()
    const prefix = lang === 'en' ? '' : '/' + lang
    const dest = `${prefix}/portfolio/${item.link}`

    if (isTouch) {
      if (this.touchIdx !== i) {
        const prevIdx = this.touchIdx
        this.touchIdx = i
        if (prevIdx !== null && prevIdx !== i) {
          const prevDetail = this.$(`.home-mosaic-details[data-index="${prevIdx}"]`)
          if (prevDetail) {
            const descEl = prevDetail.querySelector('.home-mosaic-desc')
            if (descEl) descEl.remove()
          }
          delete this.bottomHMap[prevIdx]
        }
        this._updateDom()
        requestAnimationFrame(() => {
          const d = this.$(`.home-mosaic-details[data-index="${i}"]`)
          if (d) {
            const detailH = d.scrollHeight
            if (detailH > 0) this.bottomHMap[i] = detailH + 24
          }
          this.layout()
        })
      } else {
        router.push(dest)
      }
    } else {
      router.push(dest)
    }
  }

  skeletonStyle(n) {
    const vw = typeof window !== STRINGS.UNDEFINED ? window.innerWidth : 375
    const pad = calcResponsivePadding(vw)
    const W = vw - pad * 2
    const N = calcColsForWidth(vw)
    const gap = GAP_PX
    const colW = Math.floor(calcColumnWidth(N, W, gap))
    const col = (n - 1) % N
    const row = Math.floor((n - 1) / N)
    const imageH = Math.round(colW * COMP_MULTS[(n - 1) % COMP_MULTS.length])
    return `position: absolute; top: ${row * (imageH + gap)}px; left: ${col * (colW + gap)}px; width: ${colW}px; height: ${imageH}px;`
  }

  render() {
    const featuredText = this.translations?.featured || ''
    const exploreText = this.translations?.explore || 'Check out'

    return (
      <section className={CLASSES.HOME_PORTFOLIO_SECTION}>
        <h2 className={CLASSES.HOME_SECTION_TITLE} aria-label={featuredText || TEXT.FEATURED}>
          {this.translations ? (
            <draw-text text={featuredText} />
          ) : (
            <span aria-hidden={ATTRS.TRUE} className={`${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_TITLE_MD}`} />
          )}
        </h2>

        {this.processedItems.length ? (
          <div
            className={CLASSES.HOME_MOSAIC}
            style={{ position: 'relative', width: '100%', height: this.containerH }}
          >
            {this.processedItems.map((item, i) => (
              <div
                key={item.link || i}
                className={`${CLASSES.HOME_MOSAIC_ITEM} ${item.featured ? CLASSES.HOME_MOSAIC_ITEM_FEATURED : ''}`}
                data-index={i}
                style={this.cards[i]?.card || ''}
              >
                <div className={CLASSES.HOME_MOSAIC_MEDIA} style={this.cards[i]?.media || ''}>
                  <img
                    decoding={i < 1 ? ATTRS.DECODING_SYNC : ATTRS.DECODING_ASYNC}
                    loading={i < 1 ? ATTRS.LOADING_EAGER : ATTRS.LOADING_LAZY}
                    fetchpriority={i < 1 ? ATTRS.FETCH_PRIORITY_HIGH : ATTRS.FETCH_PRIORITY_LOW}
                    className={CLASSES.HOME_MOSAIC_IMG}
                    src={buildCoverUrls(this.storage, item.image).src}
                    onError={(e) => {
                      const fallback = `${this.storage}covers/${item.image}${this.ext}`
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback
                      }
                    }}
                    alt={item.label}
                    width={MEDIA_DIMENSIONS.DEFAULT_WIDTH}
                    height={MEDIA_DIMENSIONS.DEFAULT_HEIGHT}
                  />
                  <div className={CLASSES.HOME_MOSAIC_TITLE_OVERLAY}>
                    <h3 className={CLASSES.HOME_MOSAIC_TITLE}>{item.label}</h3>
                  </div>
                </div>
                <div className={CLASSES.HOME_MOSAIC_BOTTOM} style={this.cards[i]?.bottom || ''}>
                  <div className={CLASSES.HOME_MOSAIC_DETAILS} data-index={i}>
                    {item.description && (this.hoveredIdx === i || this.touchIdx === i) && (
                      <p className={CLASSES.HOME_MOSAIC_DESC}>
                        <draw-text text={item.description} delay="8" />
                      </p>
                    )}
                    <button className={CLASSES.HOME_MOSAIC_BTN} type="button">
                      {exploreText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={CLASSES.HOME_MOSAIC} style={{ position: 'relative', width: '100%', height: this.skeletonH }}>
            {Array.from({ length: 7 }, (_, idx) => idx + 1).map((n) => (
              <div key={n} className={CLASSES.SKELETON_SHIMMER} style={this.skeletonStyle(n)} />
            ))}
          </div>
        )}
      </section>
    )
  }

  onUpdated() {
    this._applyCardStyles()
  }

}

if (!customElements.get('home-mosaic')) {
  customElements.define('home-mosaic', HomeMosaic)
}
