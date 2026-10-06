import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { NOT_FOUND_CLASSES } from '../../src/core/tokens/classes/legal.js'
import { ROUTE_PATHS } from '../../src/core/tokens/routes/paths.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

const en = JSON.parse(readFileSync(path.join(root, 'database.json'), 'utf8')).translations.en

export default {
  APP: en.APP,
  components: en.components,
  pages: {
    [NOT_FOUND_CLASSES.NOT_FOUND]: en.pages[NOT_FOUND_CLASSES.NOT_FOUND],
    [ROUTE_PATHS.EARTH_PLAYGROUND_SEGMENT]: en.pages[ROUTE_PATHS.EARTH_PLAYGROUND_SEGMENT],
    HOME: {
      archive: en.pages.HOME.archive,
      explore: en.pages.HOME.explore,
      featured: en.pages.HOME.featured,
      message: en.pages.HOME.message,
    },
    about: { title: en.pages.about.title, mentions: en.pages.about.mentions },
  },
}
