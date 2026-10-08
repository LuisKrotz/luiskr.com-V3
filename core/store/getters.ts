/**
 * @file store/getters.ts
 * @description Getter map factory — read-only accessors so the state
 * shape can evolve without touching every consumer.
 */

import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import type { StoreGetters } from './state.js'
import type { Store } from '../store.js'

/**
 * Builds the getter map bound to `store`. Each entry is a thin arrow over
 * `store.state` — evaluated lazily per call so subscribers always read the
 * post-mutation snapshot, never a captured copy.
 * @param store The Store instance to read from.
 * @returns The StoreGetters facade.
 */
export const createGetters = (store: Store): StoreGetters => ({
  getTheme: () => store.state.theme,
  getEffectiveTheme: () => store.state.effectiveTheme,
  getPreferencesOpen: () => store.state.preferencesOpen,
  getLangDialogOpen: () => store.state.langDialogOpen,
  getModalOrigin: () => store.state.modalOrigin,
  getReducedMotion: () => store.state.reducedMotion,
  getVideoAutoplay: () => store.state.videoAutoplay,
  getStatsForNerds: () => store.state.showStatsForNerds,
  getShowGrid: () => store.state.showGrid,
  getMentions: () => store.state.mentions,
  // Derived getter: resolves the localized verb for the CURRENT input
  // method — 'tap' on touch devices, 'click' otherwise.
  getClickOrTap: () =>
    store.state.inputMethod === COMMON_ATTRS.TOUCH
      ? store.state.actionTextMap.tap
      : store.state.actionTextMap.click,
  getInputMethod: () => store.state.inputMethod,
  getHover: () => store.state.showhover,
  getlang: () => store.state.lang,
  getLang: () => store.state.lang.locale,
  getCarouselLang: () => store.state.lang.carousel,
  getStatsHudLang: () => store.state.lang.statsHud,
  // marqueeamount state is always 0 (marquee is disabled) — the getter stays
  // so legacy consumers don't break, but intentionally returns the constant.
  getMarqueeAmount: () => 0,
  getModal: () => store.state.modalObject,
  getOnMouseMove: () => store.state.page,
  getStorage: () => store.state.storage,
  getTouch: () => store.state.has_touch,
  // Both casings are kept: call sites use each spelling, and removing either
  // would silently break subscribers without a compile error.
  getPortfolioList: () => store.state.portfoliolist,
  getPortfoliolist: () => store.state.portfoliolist,
})
