#!/usr/bin/env node
/**
 * @file i18n-virtual.mjs — shared virtual-module plugins for the i18n data
 * layer. `core/utils/data/db.ts` and `core/locale/fallback.ts` import
 * `virtual:i18n-*` specifiers, so every Vite pipeline that can load the site
 * (the root app config AND each standalone module config via
 * `moduleConfig()`) must resolve them — otherwise module dev servers leave
 * the imports dangling.
 */

import fs from 'node:fs'
import path from 'node:path'

/**
 * Build-time snapshot of the English UI copy (APP + components + not-found)
 * from database.json: the single source of truth for every fallback string
 * in the bundle. CMS edits flow through Firebase at runtime; this snapshot
 * only guarantees the UI never renders an empty label.
 * @param {object} opts Options.
 * @param {string} opts.root Repo root containing database.json.
 * @returns {import('vite').Plugin} The plugin instance.
 */
export const i18nFallbackPlugin = ({ root }) => {
  const virtualId = 'virtual:i18n-fallback'

  const resolvedId = '\0' + virtualId

  return {
    name: 'vite-plugin-i18n-fallback',
    resolveId(id) {
      return id === virtualId ? resolvedId : null
    },
    load(id) {
      if (id !== resolvedId) return null

      const db = JSON.parse(fs.readFileSync(path.resolve(root, 'database.json'), 'utf8'))

      const en = db.translations.en

      const snapshot = {
        APP: en.APP,
        components: en.components,
        pages: {
          'not-found': en.pages['not-found'],
          'earth-playground': en.pages['earth-playground'],
          HOME: {
            archive: en.pages.HOME.archive,
            explore: en.pages.HOME.explore,
            featured: en.pages.HOME.featured,
            message: en.pages.HOME.message,
          },
          about: { title: en.pages.about.title, mentions: en.pages.about.mentions },
        },
      }

      // APP/HOME/GDPR are in terser's property-mangle reserved list so
      // runtime string lookups (TRANSLATION_KEYS.*) resolve correctly
      return `export default ${JSON.stringify(snapshot)}`
    },
  }
}

/**
 * Per-locale snapshots of database.json emitted as lazy chunks:
 *   virtual:i18n-boot/<locale>/core      → APP, components, pages
 *   virtual:i18n-boot/<locale>/projects  → projects
 * The site renders from these immediately (static-first) and revalidates
 * against Firebase in the background (see core/utils/data/db.ts).
 * On the legacy IIFE tier the loader index is stubbed to {} — dynamic
 * import() chunks can't exist in a classic script, so the data layer
 * resolves via REST + localStorage instead (core/utils/data/db.ts).
 * @param {object} opts Options.
 * @param {string} opts.root Repo root containing database.json.
 * @param {boolean} [opts.isLegacy] Legacy IIFE tier — stub the index to {}.
 * @returns {import('vite').Plugin} The plugin instance.
 */
export const i18nBootPlugin = ({ root, isLegacy = false }) => {
  const indexId = 'virtual:i18n-boot-index'

  const prefix = 'virtual:i18n-boot/'

  const readDb = () =>
    JSON.parse(fs.readFileSync(path.resolve(root, 'database.json'), 'utf8')).translations

  return {
    name: 'vite-plugin-i18n-boot',
    resolveId(id) {
      if (id === indexId || id.startsWith(prefix)) return '\0' + id

      return null
    },
    load(id) {
      if (id === '\0' + indexId) {
        if (isLegacy) return 'export default {}'

        const locales = Object.keys(readDb())

        const entries = locales.map(
          (l) =>
            `  ${JSON.stringify(l)}: { core: () => import('${prefix}${l}/core'), projects: () => import('${prefix}${l}/projects') }`
        )

        return `export default {\n${entries.join(',\n')}\n}`
      }

      if (!id.startsWith('\0' + prefix)) return null

      const [locale, part] = id.slice(('\0' + prefix).length).split('/')

      const t = readDb()[locale]

      if (!t) return 'export default null'

      const data =
        part === 'projects'
          ? { projects: t.projects }
          : { APP: t.APP, components: t.components, pages: t.pages }

      return `export default ${JSON.stringify(data)}`
    },
  }
}
