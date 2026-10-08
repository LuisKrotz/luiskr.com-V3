/**
 * @file routes/views/home/children.ts
 * @description Pushes loaded translations/items from <view-home> into its
 * section children — the mosaic gets the processed portfolio list, the
 * about section its node + profile picture, the awards strip its
 * mentions.
 */

import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import store from '@core/store.js'
import type { ViewHome } from './Home.js'

/** Distributes loaded translations/items to the mosaic, about and contact children. */
export function passDataToChildren(view: ViewHome): void {
  const mosaic = view.$(COMPONENT_TAGS.HOME_MOSAIC) as {
    processedItems?: unknown
    translations?: unknown
  } | null

  if (mosaic) {
    mosaic.processedItems = view.processedItems

    mosaic.translations = view.translations
  }

  const aboutSec = view.$(COMPONENT_TAGS.ABOUT_SECTION) as {
    aboutTranslations?: unknown
    profilePicture?: string | null
  } | null

  if (aboutSec) {
    aboutSec.aboutTranslations = view.aboutTranslations

    aboutSec.profilePicture = view.profilePicture
  }

  const awards = view.$(COMPONENT_TAGS.AWARDS_MENTIONS) as {
    title?: string | null
    items?: unknown[] | null
  } | null

  if (awards) {
    const mentions = store.getters.getMentions()

    awards.title = mentions.title

    awards.items = mentions.items
  }
}
