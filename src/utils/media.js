import { STRINGS, ATTRS, MEDIA, MEDIA_DIMENSIONS } from '../core/constants.js'

export const isGravatarUrl = (urlStr) => {
  if (typeof urlStr !== STRINGS.STRING) return false

  try {
    const parsed = new URL(urlStr, typeof window !== STRINGS.UNDEFINED ? window.location.origin : 'http://localhost')

    return parsed.hostname === 'gravatar.com' || parsed.hostname.endsWith('.gravatar.com')
  } catch {
    return false
  }
}

export const getGravatarSrcset = (urlStr) => {
  if (!isGravatarUrl(urlStr)) return ATTRS.EMPTY

  const base = urlStr.replace(/(\?|&)size=\d+/, ATTRS.EMPTY)

  const sep = base.includes('?') ? '&' : '?'

  return `${base}${sep}size=200 1x, ${base}${sep}size=300 2x, ${base}${sep}size=400 3x`
}

export const getOptimizedGravatar = (urlStr, size = 300) => {
  if (!urlStr || typeof urlStr !== STRINGS.STRING) return ATTRS.EMPTY

  if (isGravatarUrl(urlStr)) {
    return urlStr.replace(/size=\d+/, `size=${size}`)
  }

  return urlStr
}


export const stripHtml = (str) => {
  if (!str || typeof str !== STRINGS.STRING) return ATTRS.EMPTY

  let prev

  let curr = str

  do {
    prev = curr
    curr = curr.replace(/<[^>]*>/g, ATTRS.EMPTY)
  } while (curr !== prev)

  return curr
}

export const svgPlaceholder = (w = 1920, h = 1080) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"></svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const buildMediaUrls = (storage, folder, item) => {
  if (!item || !storage) return { source: '', thumb: '', isVideo: false }

  const isVideo = item.isVideo ?? false

  const srcPath = (folder || '') + (item.src || '')

  const source = isVideo
    ? `${storage}${srcPath}${MEDIA.VIDEO_EXT}`
    : `${storage}${srcPath}${MEDIA.MOZ}${MEDIA.Q100}${MEDIA.EXT}`

  const thumb = isVideo
    ? `${storage}${srcPath}${MEDIA.VIDEO_THUMB_EXT}`
    : `${storage}${srcPath}${MEDIA.MOZ}${MEDIA.THUMB_SUFFIX}${MEDIA.EXT}`

  return { source, thumb, isVideo }
}
