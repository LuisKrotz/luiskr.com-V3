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
 * A media entry's URL-relevant fields as stored in the DB: `src` is the
 * extensionless stem the CDN grammar appends suffixes to, and `isVideo`
 * selects between the image and video suffix sets.
 */
export interface MediaUrlItem {
  src?: string
  isVideo?: boolean
}

/**
 * Resolved media URL triple — the full-quality `source`, the progressive
 * `thumb` (mozjpeg small variant or video poster frame), and the `isVideo`
 * discriminator echoed back so consumers don't re-inspect the item.
 */
export interface MediaUrls {
  source: string
  thumb: string
  isVideo: boolean
}

/**
 * Checks if a given URL belongs to gravatar.com (exact host or any
 * subdomain like `secure.gravatar.com`). Non-Gravatar URLs must not get
 * `size=` rewrites — that param is Gravatar-specific. `new URL` throws on
 * malformed input and relative URLs without a base — the try/catch maps
 * both to `false` (not-Gravatar) since either case is unrewritable anyway.
 * @param urlStr Candidate URL (absolute or relative).
 * @returns Whether the host is gravatar.com or a subdomain.
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
 * `&` depending on whether other query params remain (stripping `size=`
 * may have consumed the `?`).
 * @param urlStr Gravatar URL to expand.
 * @returns srcset string, or '' for non-Gravatar input.
 */
export const getGravatarSrcset = (urlStr: string): string => {
  if (!isGravatarUrl(urlStr)) return ATTR_VALUES.EMPTY

  const base = urlStr.replace(/(\?|&)size=\d+/, ATTR_VALUES.EMPTY)

  const sep = base.includes('?') ? '&' : '?'

  return `${base}${sep}size=${GRAVATAR_SIZES.GRAVATAR_SIZE_1X} 1x, ${base}${sep}size=${GRAVATAR_SIZES.GRAVATAR_SIZE_2X} 2x, ${base}${sep}size=${GRAVATAR_SIZES.GRAVATAR_SIZE_3X} 3x`
}

/**
 * Replaces the `size=` parameter on a Gravatar URL. Non-Gravatar URLs pass
 * through unchanged (the param is meaningless off-domain), and a URL with
 * no `size=` is left alone since the regex finds no match.
 * @param urlStr Candidate Gravatar URL.
 * @param size Pixel edge to request (default 300 — the rendered avatar box).
 * @returns Rewritten URL, original URL, or '' for non-string input.
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

  // `?? false`: a missing flag means image — the DB only marks videos
  // explicitly, so undefined must not flip an image into the mp4 grammar.
  const isVideo = item.isVideo ?? false

  // Missing folder/src collapse to '' so the result is an empty-suffix URL
  // the caller's `|| placeholder` handling can reject — never 'undefined'.
  const srcPath = (folder || ATTR_VALUES.EMPTY) + (item.src || ATTR_VALUES.EMPTY)

  const source = isVideo
    ? `${storage}${srcPath}${MEDIA.VIDEO_EXT}`
    : `${storage}${srcPath}${MEDIA.MOZ}${MEDIA.Q100}${MEDIA.EXT}`

  const thumb = isVideo
    ? `${storage}${srcPath}${MEDIA.VIDEO_THUMB_EXT}`
    : `${storage}${srcPath}${MEDIA.MOZ}${MEDIA.THUMB_SUFFIX}${MEDIA.EXT}`

  return { source, thumb, isVideo }
}
