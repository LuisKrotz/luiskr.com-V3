/**
 * @file app/boot.ts
 * @description App shell bootstrap — preference init, data load, lazy dialog/HUD chunk imports, router subscription with progress bar, scroll/resize/theme listeners, and the intro loader.
 */

import { APP_CLASSES } from '@/core/tokens/classes/app.js'
import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import { APP_EVENTS } from '@/core/tokens/events/app.js'
import { FORM_EVENTS, WINDOW_EVENTS } from '@/core/tokens/events/dom.js'
import { PREF_MUTATIONS } from '@/core/tokens/events/mutations.js'
import { QUERY_STRINGS } from '@/core/tokens/strings/queries.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { THEME } from '@/core/tokens/theme/theme.js'
import store from '@/core/store.js'
import router from '@/routes/router.js'
import type { LangDialogEl, PrefModalEl } from './types.js'
import type { AppRoot } from '../App.js'
import { ANIMATION_DURATIONS } from '@/core/tokens/motion/animation.js'

/**
 * Schedules non-urgent work during idle time; falls back to a short
 * setTimeout on engines without requestIdleCallback. Evaluated per call
 * so the probe always reflects the live environment.
 */
export function deferIdle(cb: () => void): void {
  if (typeof window !== TYPE_STRINGS.UNDEFINED && window.requestIdleCallback) {
    window.requestIdleCallback(cb)
  } else {
    setTimeout(cb, 100)
  }
}

/**
 * Mounts app shell.
 * @param c — the component
 */
export function mountAppShell(c: AppRoot): void {
  store.commit(PREF_MUTATIONS.INIT_THEME)
  store.commit(PREF_MUTATIONS.INIT_REDUCED_MOTION)
  c.initInputListeners()
  c.loadData()

  if (store.getters.getShowGrid()) {
    document.documentElement.classList.add(STATE_CLASSES.SHOW_GRID)
  }

  c.subscribe(store)

  // Lazy-load heavy global components after first paint
  import('@/components/dialogs/PreferencesModal.js')
  import('@/components/dialogs/LangDialog.js')
  import('@/components/feedback/StatsHud.js')

  // Listen to open-preferences-modal from app-nav
  const openPref = () => {
    import('@/components/dialogs/PreferencesModal.js').then(() => {
      const pref = c.$<PrefModalEl>(COMPONENT_TAGS.PREFERENCES_MODAL)
      if (pref) pref.open = true
    })
  }
  c.addScopedListener(c, APP_EVENTS.OPEN_PREFERENCES_MODAL, openPref)
  c.addScopedListener(window, APP_EVENTS.OPEN_PREFERENCES_MODAL, openPref)

  // Listen to open-lang-dialog from app-nav
  const openLang = () => {
    import('@/components/dialogs/LangDialog.js').then(() => {
      const dialog = c.$<LangDialogEl>(COMPONENT_TAGS.LANG_DIALOG)
      if (dialog) dialog.open = true
    })
  }
  c.addScopedListener(c, APP_EVENTS.OPEN_LANG_DIALOG, openLang)
  c.addScopedListener(window, APP_EVENTS.OPEN_LANG_DIALOG, openLang)

  // Subscribe to router
  router.subscribe((to, from) => {
    c.routeLoading = true
    const pBar = c.$(`.${APP_CLASSES.PROGRESS_BAR}`)
    if (pBar) pBar.classList.add(APP_CLASSES.PROGRESS_BAR_ACTIVE)

    c.currentViewTag = to.view
    c._updateViewContent(to, from)
    c.loadData()

    setTimeout(() => {
      c.routeLoading = false
      if (pBar) pBar.classList.remove(APP_CLASSES.PROGRESS_BAR_ACTIVE)
    }, ANIMATION_DURATIONS.ROUTE_DURATION)
  })

  // Initial view
  if (router.currentRoute) {
    c.currentViewTag = router.currentRoute.view
    c._updateViewContent()
  }

  // Scroll listeners
  // Deferred via rIC so first paint isn't blocked by scroll bookkeeping;
  // setTimeout fallback for engines without the API.
  deferIdle(() => {
    c.updateSectionTops()
    c.checkScroll()
  })

  c.addScopedListener(window, WINDOW_EVENTS.SCROLL, () => c.checkScroll(), { passive: true })

  // Async content (images, locale data, late view mounts) grows the
  // document after first paint — without a re-measure the nav's
  // onBottom/activeSection stay stale and the --on-dark ink goes wrong
  // on first load. Observe the body box so any growth re-runs the check.
  if (typeof ResizeObserver !== TYPE_STRINGS.UNDEFINED) {
    c._docObserver = new ResizeObserver(() => {
      c.updateSectionTops()

      c.checkScroll()
    })

    c._docObserver.observe(document.body)
  }

  let resizeTimer: ReturnType<typeof setTimeout> | undefined
  c.addScopedListener(
    window,
    WINDOW_EVENTS.RESIZE,
    () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        c.updateSectionTops()
        c.checkScroll()
      }, 150)
    },
    { passive: true }
  )

  if (window.matchMedia) {
    c.addScopedListener(
      window.matchMedia(QUERY_STRINGS.DARK_SCHEME_QUERY),
      FORM_EVENTS.CHANGE,
      () => {
        if (store.getters.getTheme() === THEME.SYSTEM) {
          store.commit(PREF_MUTATIONS.APPLY_THEME)
        }
      }
    )
  }

  import('@/utils/canvas/loaders/intro-loader.js').then(({ IntroLoader }) => {
    c._introLoader = new IntroLoader(document.body)
  })
}
