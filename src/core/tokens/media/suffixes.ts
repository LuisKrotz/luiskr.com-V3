/**
 * @file tokens/media/suffixes.js
 * @description Media asset filename-suffix tokens. All suffixes match the
 * exact Firebase Storage naming convention used by the Kodak MSSIM blur-up
 * pipeline and mozjpeg encoding passes.
 */

export const MEDIA = Object.freeze({
  /** Base mozjpeg prefix used in all derived filenames */
  MOZ: '-mozjpg',
  /** Thumb quality suffix → kodak MSSIM-tuned q=3 */
  THUMB_SUFFIX: '3-MSSIM-tuned-kodak',
  /** Q50 medium-res suffix */
  Q50: '-50',
  /** Q100 / uncompressed lossless suffix */
  Q100: '-uncompressed',
  /** Static image extension */
  EXT: '.jpg',
  /** Video extension */
  VIDEO_EXT: '.mp4',
  /** Video poster/thumb extension (appended after .mp4) */
  VIDEO_THUMB_EXT: '.mp4.jpg-thumb.jpg',
  /** 2× scale-down video variant suffix */
  VIDEO_SCALE: '.mp4-scaledown-2x',
})
