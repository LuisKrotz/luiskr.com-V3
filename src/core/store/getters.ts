/**
 * @file store/getters.ts
 * @description Getter map factory — read-only accessors so the state
 * shape can evolve without touching every consumer.
 */

import { COMMON_ATTRS } from '@/core/tokens/attrs/common.js'
import type { StoreGetters } from './state.js'
import type { Store } from '../store.js'

/** Builds the getter map bound to `store`. */
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
  getMarqueeAmount: () => 0,
  getModal: () => store.state.modalObject,
  getOnMouseMove: () => store.state.page,
  getStorage: () => store.state.storage,
  getTouch: () => store.state.has_touch,
  getPortfolioList: () => store.state.portfoliolist,
  getPortfoliolist: () => store.state.portfoliolist,
})
