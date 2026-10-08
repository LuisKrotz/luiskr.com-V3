/**
 * @file home/awards/carousel.ts
 * @description Carousel wiring for <awards-mentions>: configures the
 * embedded <awards-carousel> (awards variant, dots, dwell) and binds the
 * auto-advance lifecycle — AUTOPLAY_START shows + restarts the progress
 * arc, SLIDE_CHANGE re-arms it per slide, AUTOPLAY_STOP hides it but
 * only after autoplay has started once (the initial off-screen stop must
 * not hide the bar before it ever showed).
 */

import { AWARDS_CLASSES } from '@core/tokens/classes/awards.js'
import { AWC_VARIANTS } from '@core/tokens/classes/awards-carousel.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { APP_EVENTS } from '@core/tokens/events/app.js'
import type { AwardsMentions } from '../AwardsMentions.js'

interface AwardsCarouselEl extends HTMLElement {
  items?: unknown[] | null
  variant?: string
  duration?: number
  showDots?: boolean
}

/** Builds the auto-advance loop: progress arc + timed slide transitions. */
export function setupAwardsCarousel(el: AwardsMentions): void {
  const awc = el.$<AwardsCarouselEl>(COMPONENT_TAGS.AWARDS_CAROUSEL)

  if (!(awc && el.items)) return

  awc.variant = AWC_VARIANTS.AWARDS
  awc.duration = el._duration
  awc.showDots = true
  awc.items = el.items

  el._autoplayEverStarted = false

  el.addScopedListener(awc, APP_EVENTS.AUTOPLAY_START, () => {
    el._autoplayEverStarted = true
    el._showProgress()
    el._restartProgressAnimation()
  })

  el.addScopedListener(awc, APP_EVENTS.SLIDE_CHANGE, () => {
    el._showProgress()
    el._restartProgressAnimation()
  })

  el.addScopedListener(awc, APP_EVENTS.AUTOPLAY_STOP, () => {
    if (el._autoplayEverStarted) el._hideProgress()
  })

  // Show the bar immediately so the track is visible while the carousel initialises
  el._showProgress()
}

/** Shows the circular progress indicator for the current slide. */
export function showAwardsProgress(el: AwardsMentions): void {
  const bar = el.$(`.${AWARDS_CLASSES.AWARDS_FOOTER_PROGRESS}`)

  if (bar) bar.classList.remove(AWARDS_CLASSES.AWARDS_FOOTER_PROGRESS_HIDDEN)
}

/** Hides the progress arc (paused/hover). */
export function hideAwardsProgress(el: AwardsMentions): void {
  const bar = el.$(`.${AWARDS_CLASSES.AWARDS_FOOTER_PROGRESS}`)

  if (bar) bar.classList.add(AWARDS_CLASSES.AWARDS_FOOTER_PROGRESS_HIDDEN)
}

/** Resets the SVG progress arc so the next slide's timer animates from zero. */
export function restartAwardsProgress(el: AwardsMentions): void {
  const fill = el.$(`.${AWARDS_CLASSES.AWARDS_FOOTER_PROGRESS_FILL}`)

  if (!fill) return

  const runningClass = AWARDS_CLASSES.AWARDS_FOOTER_PROGRESS_FILL_RUNNING

  // Sync animation duration with carousel duration
  fill.style.setProperty('--progress-duration', `${el._duration / 1000}s`)

  // Remove class → force reflow → re-add: CSS @keyframes restarts from 0%
  fill.classList.remove(runningClass)

  void fill.offsetHeight // intentional reflow to reset animation

  fill.classList.add(runningClass)
}
