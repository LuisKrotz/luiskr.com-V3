/**
 * @file utils/media.ts
 * @description Media-URL builders — the single place where CDN filename
 * grammar is assembled. `buildMediaUrls` is the authoritative implementation
 * of the mozjpeg/mp4 suffix convention; the Gravatar helpers rewrite the
 * `size=` query param so avatars arrive at the right resolution for the
 * rendered box (and at 1×/2×/3× for srcset).
 */
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { MEDIA } from '@/core/tokens/media/suffixes.js'
import { NET_STRINGS } from '@/core/tokens/strings/net.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { GRAVATAR_SIZES } from '@/core/tokens/media/dimensions.js'

/**
 * The MediaUrlItem value.
 */
export interface MediaUrlItem {
  src?: string
  isVideo?: boolean
}

/**
 * The MediaUrls value.
 */
export interface MediaUrls {
  source: string
  thumb: string
  isVideo: boolean
}

/**
 * Checks if a given URL belongs to gravatar.com (exact host or any
 * subdomain like `secure.gravatar.com`). Non-Gravatar URLs must not get
 * `size=` rewrites — that param is Gravatar-specific.
 */
export const isGravatarUrl = (urlStr: string): boolean => {
  if (typeof urlStr !== TYPE_STRINGS.STRING) return false

  try {
    const origin =
      typeof window !== TYPE_STRINGS.UNDEFINED ? window.location.origin : NET_STRINGS.HTTP_LOCALHOST

    const parsed = new URL(urlStr, origin)

    return (
      parsed.hostname === NET_STRINGS.GRAVATAR_HOSTNAME ||
      parsed.hostname.endsWith(NET_STRINGS.GRAVATAR_HOSTNAME_SUFFIX)
    )
  } catch {
    return false
  }
}

/**
 * Builds responsive Gravatar srcset with 1x, 2x, 3x density descriptors —
 * 200/300/400 px variants chosen by GRAVATAR_SIZE_*. Any existing `size=`
 * param is stripped first so the rewrite is idempotent; `sep` picks `?` or
 * `&` depending on whether other query params remain.
 */
export const getGravatarSrcset = (urlStr: string): string => {
  if (!isGravatarUrl(urlStr)) return ATTR_VALUES.EMPTY

  const base = urlStr.replace(/(\?|&)size=\d+/, ATTR_VALUES.EMPTY)

  const sep = base.includes('?') ? '&' : '?'

  return `${base}${sep}size=${GRAVATAR_SIZES.GRAVATAR_SIZE_1X} 1x, ${base}${sep}size=${GRAVATAR_SIZES.GRAVATAR_SIZE_2X} 2x, ${base}${sep}size=${GRAVATAR_SIZES.GRAVATAR_SIZE_3X} 3x`
}

/**
 * Replaces size parameter on Gravatar URL.
 */
export const getOptimizedGravatar = (urlStr: string, size = 300): string => {
  if (!urlStr || typeof urlStr !== TYPE_STRINGS.STRING) return ATTR_VALUES.EMPTY

  if (isGravatarUrl(urlStr)) {
    return urlStr.replace(/size=\d+/, `size=${size}`)
  }

  return urlStr
}

/**
 * Constructs media URLs for images and videos following the project's
 * compression pipeline. URL grammar:
 *   image source : storage + folder + src + '-mozjpg-uncompressed.jpg'   (full quality)
 *   image thumb  : storage + folder + src + '-mozjpg3-MSSIM-tuned-kodak.jpg' (blur-up)
 *   video source : storage + folder + src + '.mp4'
 *   video thumb  : storage + folder + src + '.mp4.jpg-thumb.jpg'         (poster frame)
 * `src` in the DB never carries an extension — the pipeline's suffix is
 * appended here, which is why an unsuffixed URL 404s.
 * @param storage - Base storage URL (store.getters.getStorage())
 * @param folder - Project folder prefix, e.g. 'aboutmarco/'
 * @param item - Media item descriptor `{ src, isVideo }`
 */
export const buildMediaUrls = (
  storage: string,
  folder: string,
  item: MediaUrlItem | null
): MediaUrls => {
  if (!item || !storage)
    return { source: ATTR_VALUES.EMPTY, thumb: ATTR_VALUES.EMPTY, isVideo: false }

  const isVideo = item.isVideo ?? false

  const srcPath = (folder || ATTR_VALUES.EMPTY) + (item.src || ATTR_VALUES.EMPTY)

  const source = isVideo
    ? `${storage}${srcPath}${MEDIA.VIDEO_EXT}`
    : `${storage}${srcPath}${MEDIA.MOZ}${MEDIA.Q100}${MEDIA.EXT}`

  const thumb = isVideo
    ? `${storage}${srcPath}${MEDIA.VIDEO_THUMB_EXT}`
    : `${storage}${srcPath}${MEDIA.MOZ}${MEDIA.THUMB_SUFFIX}${MEDIA.EXT}`

  return { source, thumb, isVideo }
}
