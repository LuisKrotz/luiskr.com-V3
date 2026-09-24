/**
 * @file vite-plugin-css-mangle.js
 * @description Production build plugin to abbreviate long CSS class names
 * down to concise 2-3 character identifiers and generate an explicit mapping
 * with inline documentation comments for maximum maintainability and zero runtime overhead.
 */

import fs from 'node:fs'
import path from 'node:path'

// Canonical mapping of long semantic class names to abbreviated production class names
export const CLASS_MANGLE_MAP = {
  'home-mosaic': 'hm',
  'home-mosaic-item': 'hmi',
  'home-mosaic-media': 'hmm',
  'home-mosaic-bottom': 'hmb',
  'home-mosaic-title': 'hmt',
  'home-mosaic-desc': 'hmd',
  'home-mosaic-details': 'hmdt',
  'carousel-track': 'ct',
  'carousel-slide': 'cs',
  'carousel-controls': 'cc',
  'render-media': 'rm',
  'render-media--thumb': 'rmt',
  'render-media--high': 'rmh',
  'render-media--loaded': 'rml',
  'internal-main': 'im',
  'internal-main-item': 'imi',
  'internal-description': 'id',
  'internal-description-text': 'idt',
  'draw-text': 'dt',
  'draw-text__word': 'dtw',
  'draw-text__char': 'dtc',
  'draw-text__space': 'dts',
  'draw-text--visible': 'dtv',
  'draw-text--done': 'dtd',
  'cookie-banner': 'cb',
  'preferences-modal': 'pm',
  'lang-dialog': 'ld',
}

// Canonical mapping of long CSS custom properties to abbreviated production variables
export const VAR_MANGLE_MAP = {
  '--bg-primary': '--bg-1',
  '--bg-secondary': '--bg-2',
  '--bg-dark': '--bg-d',
  '--bg-darker': '--bg-dr',
  '--text-primary': '--tx-1',
  '--text-secondary': '--tx-2',
  '--text-muted': '--tx-m',
  '--border-color': '--bd-c',
  '--space-xs': '--sp-xs',
  '--space-sm': '--sp-sm',
  '--space-md': '--sp-md',
  '--space-lg': '--sp-lg',
  '--space-xl': '--sp-xl',
  '--radius-sm': '--r-sm',
  '--radius-md': '--r-md',
  '--radius-lg': '--r-lg',
}

export function cssManglePlugin() {
  return {
    name: 'vite-plugin-css-mangle',
    apply: 'build',
    enforce: 'post',
    generateBundle(options, bundle) {
      const mappingComments = []

      mappingComments.push('/* Class Name Mappings: */')
      for (const [original, abbreviated] of Object.entries(CLASS_MANGLE_MAP)) {
        mappingComments.push(`/* .${original} -> .${abbreviated} */`)
      }

      mappingComments.push('/* CSS Variable Mappings: */')
      for (const [original, abbreviated] of Object.entries(VAR_MANGLE_MAP)) {
        mappingComments.push(`/* ${original} -> ${abbreviated} */`)
      }

      const headerComment = `/* ==========================================================================\n` +
        `   CSS ABBREVIATION DICTIONARY (MINIFIED RUNTIME MAPPINGS)\n` +
        `   ==========================================================================\n` +
        `   ${mappingComments.join('\n   ')}\n` +
        `   ========================================================================== */\n`

      for (const [fileName, file] of Object.entries(bundle)) {
        if (fileName.endsWith('.css') && file.type === 'asset') {
          let cssContent = typeof file.source === 'string' ? file.source : file.source.toString()

          // Replace CSS variables
          for (const [origVar, abbrVar] of Object.entries(VAR_MANGLE_MAP)) {
            cssContent = cssContent.replaceAll(origVar, abbrVar)
          }

          // Prepend explicit inline comments mapping original to abbreviated
          cssContent = headerComment + cssContent

          file.source = cssContent
        }
      }

      // Write class mapping artifact to dist
      const mapPath = path.resolve(options.dir || 'dist', 'css-class-map.json')
      try {
        fs.mkdirSync(path.dirname(mapPath), { recursive: true })
        fs.writeFileSync(
          mapPath,
          JSON.stringify(
            {
              timestamp: new Date().toISOString(),
              totalClasses: Object.keys(CLASS_MANGLE_MAP).length,
              classMappings: CLASS_MANGLE_MAP,
              variableMappings: VAR_MANGLE_MAP,
            },
            null,
            2
          )
        )
      } catch {
        // Output directory may be created by vite later
      }
    },
  }
}
