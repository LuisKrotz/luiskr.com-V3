/**
 * @file mosaic-render.tsx — shadow-DOM template for <home-mosaic>:
 * section title (draw-text or shimmer), the packed card wall, and the
 * skeleton placeholder wall shown while project data loads.
 */

import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { HOME_MOSAIC_CLASSES } from '@core/tokens/classes/mosaic.js'
import { SKELETON_CLASSES } from '@core/tokens/classes/skeleton.js'
import { TRANSLATION_KEYS } from '@core/tokens/routes/translation-keys.js'
import { DB_PATHS } from '@core/tokens/routes/paths.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { IMAGE_SIZES } from '@core/tokens/media/sizes.js'
import { FALLBACK_PAGES } from '@core/locale/fallback.js'
import { h } from '@core/jsx.js'
import type { MosaicItem } from './pack.js'
import type { HomeMosaic } from '../HomeMosaic.js'
import { projectHref } from './interactions.js'
import { SKELETON_MOSAIC } from '@core/tokens/motion/skeleton.js'
import { GENERIC_DIMENSIONS } from '@core/tokens/media/dimensions.js'

interface MosaicTranslations {
  featured?: string
  explore?: string
}

/** Style object for one skeleton placeholder box. */
export function skeletonStyle(box: { top: number; left: number; w: number; h: number }): string {
  return `position: absolute; top: ${box.top}px; left: ${box.left}px; width: ${box.w}px; height: ${box.h}px;`
}

/** One packed card — media, title overlay, and expandable details. */
function renderCard(host: HomeMosaic, item: MosaicItem, i: number, exploreText?: string) {
  const expanded = host.hoveredIdx === i || host.touchIdx === i

  return (
    <a
      key={item.link || i}
      className={`${HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM} ${item.featured ? HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM_FEATURED : ATTR_VALUES.EMPTY}`}
      data-index={i}
      href={projectHref(item)}
      style={host.cards[i]?.card || ATTR_VALUES.EMPTY}
    >
      <div
        className={HOME_MOSAIC_CLASSES.HOME_MOSAIC_MEDIA}
        style={host.cards[i]?.media || ATTR_VALUES.EMPTY}
      >
        <img
          decoding={
            i < SKELETON_MOSAIC.MOSAIC_LCP_TILES
              ? MEDIA_ATTRS.DECODING_SYNC
              : MEDIA_ATTRS.DECODING_ASYNC
          }
          loading={
            i < SKELETON_MOSAIC.MOSAIC_LCP_TILES
              ? MEDIA_ATTRS.LOADING_EAGER
              : MEDIA_ATTRS.LOADING_LAZY
          }
          fetchpriority={
            i < SKELETON_MOSAIC.MOSAIC_LCP_TILES
              ? MEDIA_ATTRS.FETCH_PRIORITY_HIGH
              : MEDIA_ATTRS.FETCH_PRIORITY_LOW
          }
          className={HOME_MOSAIC_CLASSES.HOME_MOSAIC_IMG}
          src={`${host.storage}${DB_PATHS.COVERS}${item.image}${host.ext}`}
          alt={item.label || item.title || ATTR_VALUES.EMPTY}
          width={GENERIC_DIMENSIONS.DEFAULT_WIDTH}
          height={GENERIC_DIMENSIONS.DEFAULT_HEIGHT}
          sizes={IMAGE_SIZES.HOME_MOSAIC}
        />
        <div className={HOME_MOSAIC_CLASSES.HOME_MOSAIC_TITLE_OVERLAY}>
          <h2 className={HOME_MOSAIC_CLASSES.HOME_MOSAIC_TITLE}>
            {item.label || item.title || ATTR_VALUES.EMPTY}
          </h2>
        </div>
      </div>
      <div
        className={HOME_MOSAIC_CLASSES.HOME_MOSAIC_BOTTOM}
        style={host.cards[i]?.bottom || ATTR_VALUES.EMPTY}
      >
        <div className={HOME_MOSAIC_CLASSES.HOME_MOSAIC_DETAILS} data-index={i}>
          {item.description && expanded && (
            <p className={HOME_MOSAIC_CLASSES.HOME_MOSAIC_DESC}>
              <draw-text text={item.description} delay={CHAR_STRINGS.DELAY_8} />
            </p>
          )}
          <span className={HOME_MOSAIC_CLASSES.HOME_MOSAIC_BTN}>{exploreText}</span>
        </div>
      </div>
    </a>
  )
}

/** Skeleton wall shown until processedItems lands. */
function renderSkeletonWall(host: HomeMosaic) {
  const skel = host._packSkeleton()

  return (
    <div
      className={HOME_MOSAIC_CLASSES.HOME_MOSAIC}
      style={{
        position: STATE_STRINGS.RELATIVE,
        width: CHAR_STRINGS.PERCENT_100,
        height: `${skel.height}px`,
      }}
    >
      {skel.boxes.map((box, idx) => (
        <div key={idx} className={SKELETON_CLASSES.SKELETON_SHIMMER} style={skeletonStyle(box)} />
      ))}
    </div>
  )
}

/** JSX template for the component's shadow DOM. */
export function renderMosaic(host: HomeMosaic) {
  const homeFallback = FALLBACK_PAGES[TRANSLATION_KEYS.HOME] as MosaicTranslations | undefined

  const featuredText = host.translations?.featured || ATTR_VALUES.EMPTY

  const exploreText = host.translations?.explore || homeFallback?.explore

  return (
    <section className={HOME_MOSAIC_CLASSES.HOME_PORTFOLIO_SECTION}>
      <h1
        className={HOME_MOSAIC_CLASSES.HOME_SECTION_TITLE}
        aria-label={featuredText || homeFallback?.featured}
      >
        {host.translations ? (
          <draw-text text={featuredText} fit={ATTR_VALUES.EMPTY} />
        ) : (
          <span
            aria-hidden={ATTR_VALUES.TRUE}
            className={`${SKELETON_CLASSES.SKELETON_SHIMMER} ${SKELETON_CLASSES.SKELETON_TITLE_MD}`}
          />
        )}
      </h1>

      {host.processedItems.length ? (
        <div
          className={HOME_MOSAIC_CLASSES.HOME_MOSAIC}
          style={{
            position: STATE_STRINGS.RELATIVE,
            width: CHAR_STRINGS.PERCENT_100,
            height: host.containerH,
          }}
        >
          {host.processedItems.map((item, i) => renderCard(host, item, i, exploreText))}
        </div>
      ) : (
        renderSkeletonWall(host)
      )}
    </section>
  )
}
