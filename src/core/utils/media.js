import { STRINGS, ATTRS, MEDIA, MEDIA_DIMENSIONS } from '../constants.js'

/**
 * Checks if a given URL belongs to gravatar.com.
 * @param {string} urlStr - Target URL
 * @returns {boolean}
 */
export const isGravatarUrl = (urlStr) => {
  if (typeof urlStr !== STRINGS.STRING) return false

  try {
    const origin = typeof window !== STRINGS.UNDEFINED ? window.location.origin : STRINGS.HTTP_LOCALHOST

    const parsed = new URL(urlStr, origin)

    return parsed.hostname === STRINGS.GRAVATAR_HOSTNAME || parsed.hostname.endsWith(STRINGS.GRAVATAR_HOSTNAME_SUFFIX)
  } catch {
    return false
  }
}

/**
 * Builds responsive Gravatar srcset with 1x, 2x, 3x density descriptors.
 * @param {string} urlStr - Gravatar avatar URL
 * @returns {string} srcset string
 */
export const getGravatarSrcset = (urlStr) => {
  if (!isGravatarUrl(urlStr)) return ATTRS.EMPTY

  const base = urlStr.replace(/(\?|&)size=\d+/, ATTRS.EMPTY)

  const sep = base.includes('?') ? '&' : '?'

  return `${base}${sep}size=${MEDIA_DIMENSIONS.GRAVATAR_SIZE_1X} 1x, ${base}${sep}size=${MEDIA_DIMENSIONS.GRAVATAR_SIZE_2X} 2x, ${base}${sep}size=${MEDIA_DIMENSIONS.GRAVATAR_SIZE_3X} 3x`
}

/**
 * Replaces size parameter on Gravatar URL.
 * @param {string} urlStr - Gravatar avatar URL
 * @param {number} size - Desired pixel size
 * @returns {string}
 */
export const getOptimizedGravatar = (urlStr, size = 300) => {
  if (!urlStr || typeof urlStr !== STRINGS.STRING) return ATTRS.EMPTY

  if (isGravatarUrl(urlStr)) {
    return urlStr.replace(/size=\d+/, `size=${size}`)
  }

  return urlStr
}

/**
 * Constructs media URLs for images and videos following project compression rules.
 * @param {string} storage - Base storage URL
 * @param {string} folder - Project folder prefix
 * @param {Object} item - Media item descriptor
 * @returns {{ source: string, thumb: string, isVideo: boolean }}
 */
export const buildMediaUrls = (storage, folder, item) => {
  if (!item || !storage) return { source: ATTRS.EMPTY, thumb: ATTRS.EMPTY, isVideo: false }

  const isVideo = item.isVideo ?? false

  const srcPath = (folder || ATTRS.EMPTY) + (item.src || ATTRS.EMPTY)

  const source = isVideo
    ? `${storage}${srcPath}${MEDIA.VIDEO_EXT}`
    : `${storage}${srcPath}${MEDIA.MOZ}${MEDIA.Q100}${MEDIA.EXT}`

  const thumb = isVideo
    ? `${storage}${srcPath}${MEDIA.VIDEO_THUMB_EXT}`
    : `${storage}${srcPath}${MEDIA.MOZ}${MEDIA.THUMB_SUFFIX}${MEDIA.EXT}`

  return { source, thumb, isVideo }
}
