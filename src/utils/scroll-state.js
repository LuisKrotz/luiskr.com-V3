import { EVENTS, STRINGS } from '../core/constants.js'

let isWindowScrolling = false

let scrollStopTimer = null

const scrollStopCallbacks = new Set()

const handleScrollStop = () => {
  isWindowScrolling = false

  if (scrollStopTimer) {
    clearTimeout(scrollStopTimer)

    scrollStopTimer = null
  }

  const callbacks = Array.from(scrollStopCallbacks)

  scrollStopCallbacks.clear()

  callbacks.forEach((cb) => {
    try {
      cb()
    } catch {}
  })
}

const handleScroll = () => {
  isWindowScrolling = true

  if (scrollStopTimer) {
    clearTimeout(scrollStopTimer)
  }

  scrollStopTimer = setTimeout(handleScrollStop, 120)
}

if (typeof window !== STRINGS.UNDEFINED) {
  window.addEventListener(EVENTS.SCROLL, handleScroll, { passive: true })

  if ('onscrollend' in window) {
    window.addEventListener(EVENTS.SCROLLEND, handleScrollStop, { passive: true })
  }
}

export const isScrolling = () => isWindowScrolling

export const onScrollStop = (callback) => {
  if (typeof callback !== STRINGS.FUNCTION) return

  if (!isWindowScrolling) {
    callback()

    return
  }

  scrollStopCallbacks.add(callback)
}
