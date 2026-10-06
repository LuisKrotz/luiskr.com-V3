/**
 * @file media-convert/exts.ts — accepted media extensions, shared between the
 * browser drop handler (which ignores non-media files like desktop.ini,
 * .DS_Store or Thumbs.db before they reach the queue) and the node pipeline
 * (scripts/media-convert/pipeline.js imports this file directly). Keep this
 * module dependency-free — plain node must resolve it without the @/ alias.
 */

/**
 * Image extensions the pipeline converts into the four mozjpeg variants.
 */
export const IMAGE_EXTS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.avif',
  '.tif',
  '.tiff',
  '.bmp',
  '.gif',
  '.heic',
  '.heif',
])

/**
 * Video extensions the pipeline normalizes into h264 mp4 + scaledown + posters.
 */
export const VIDEO_EXTS = new Set([
  '.mov',
  '.mp4',
  '.mkv',
  '.webm',
  '.avi',
  '.m4v',
  '.mpg',
  '.mpeg',
  '.3gp',
  '.mts',
  '.m2ts',
])

/**
 * Union of every accepted extension — the drop-time filter.
 */
export const MEDIA_EXTS = new Set([...IMAGE_EXTS, ...VIDEO_EXTS])

/**
 * Reports whether a file name/path carries a supported media extension.
 * Extension check is case-insensitive; names with no dot, dotfiles
 * (.DS_Store) and unknown extensions all report false so OS litter inside
 * dropped folders never reaches the queue.
 * @param name — file name or relative path
 * @returns true when the extension is a known image or video format
 */
export const isMediaPath = (name: string): boolean =>
  MEDIA_EXTS.has(name.slice(name.lastIndexOf('.')).toLowerCase())
