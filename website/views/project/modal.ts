/**
 * @file routes/views/project/modal.ts
 * @description Auto-open logic for ViewProject — when the route slug matches a media item label, commits the expand-modal payload (source/thumb/size) to the store.
 */

import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { MODAL_CLASSES } from '@core/tokens/classes/modal.js'
import { MODAL_MUTATIONS } from '@core/tokens/events/mutations.js'
import { MEDIA } from '@core/tokens/media/suffixes.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import store from '@core/store.js'
import { slugify } from '@core/utils/index.js'
import router from '@core/router/router.js'
import type { ViewProject } from './Project.js'
import type { ProjectMediaItem } from './types.js'

/**
 * Checks auto open modal.
 * @param c — the component
 */
export function checkAutoOpenModal(c: ViewProject): void {
  const route = router.currentRoute

  const slug = route?.params?.slug

  if (!slug || !c.translations) return

  const storage = store.getters.getStorage()

  const folder = c.translations.folder || ATTR_VALUES.EMPTY

  for (const section of c.translations.sections || []) {
    for (const group of section) {
      if (!Array.isArray(group) || typeof group[0] === TYPE_STRINGS.STRING) continue

      for (const item of group as ProjectMediaItem[]) {
        if (slugify(item.label || ATTR_VALUES.EMPTY) === slug) {
          const isVideo = item.isVideo ?? false
          const source = isVideo
            ? `${storage}${folder}${item.src}${MEDIA.VIDEO_EXT}`
            : `${storage}${folder}${item.src}${MEDIA.MOZ}${MEDIA.Q100}${MEDIA.EXT}`
          const thumb = isVideo
            ? `${storage}${folder}${item.src}${MEDIA.VIDEO_THUMB_EXT}`
            : `${storage}${folder}${item.src}${MEDIA.MOZ}${MEDIA.THUMB_SUFFIX}${MEDIA.EXT}`

          store.commit(MODAL_MUTATIONS.SET_MODAL, {
            transform: window.scrollY,
            class: MODAL_CLASSES.MODAL_OPEN,
            open: true,
            media: {
              source,
              thumb,
              alt: item.label,
              width: item.size[0],
              height: item.size[1],
              isVideo,
            },
          })
          return
        }
      }
    }
  }
}
