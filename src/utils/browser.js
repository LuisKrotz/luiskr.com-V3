import { ATTRS, CLASSES } from '../core/constants.js'

export const isSafari = (() => {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false

  const ua = navigator.userAgent || ''

  const vendor = navigator.vendor || ''

  const isApple = vendor.includes('Apple') || /iPad|iPhone|iPod/.test(ua)

  const isSafariUa = /^((?!chrome|android).)*safari/i.test(ua)

  const lacksHostContext = typeof CSS !== 'undefined' && CSS.supports && !CSS.supports('selector(:host-context(*))')

  return (isApple && isSafariUa) || (isApple && lacksHostContext)
})()

export function applySafariClass() {
  if (isSafari && typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute(ATTRS.DATA_SAFARI, ATTRS.TRUE)

    document.documentElement.classList.add(CLASSES.IS_SAFARI)
  }
}
