/**
 * @file legacy-polyfills/ro.js
 * @description ResizeObserver polyfill — the mosaic layout, media figures
 * and canvas widgets watch element size. Native since Safari 13.1 /
 * Chrome 64; older engines get this shim only.
 */
import ResizeObserver from 'resize-observer-polyfill'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'

if (typeof window !== TYPE_STRINGS.UNDEFINED && !window.ResizeObserver) {
  window.ResizeObserver = ResizeObserver
}
