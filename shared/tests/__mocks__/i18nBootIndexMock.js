/**
 * @file i18nBootIndexMock.js
 * @description Jest module mock for the locale boot index — reads the real
 * database.json once and returns per-locale lazy loaders ({core,
 * projects}) so i18n tests exercise the genuine translation payloads
 * without touching the network or dynamic-import graph.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

const translations = JSON.parse(readFileSync(path.join(root, 'database.json'), 'utf8')).translations

const loaders = {}

for (const [locale, t] of Object.entries(translations)) {
  loaders[locale] = {
    core: () =>
      Promise.resolve({ default: { APP: t.APP, components: t.components, pages: t.pages } }),
    projects: () => Promise.resolve({ default: { projects: t.projects } }),
  }
}

export default loaders
