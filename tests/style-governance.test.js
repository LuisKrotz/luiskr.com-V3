import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { CLASSES } from '../src/core/constants.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.join(__dirname, '../src')
const sassDir = path.join(srcDir, 'sass')

function getAllFiles(dir, exts = ['.scss', '.css', '.js']) {
  const results = []
  const list = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of list) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...getAllFiles(full, exts))
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      results.push(full)
    }
  }
  return results
}

describe('Style Governance & Zero-Hardcoding Enforcement', () => {

  // ── 1. Zero !important across all src files ─────────────────────────────────
  test('Rule 1: ZERO !important across any stylesheet or JS style block in src/', () => {
    const allFiles = getAllFiles(srcDir)
    const violations = []

    for (const filePath of allFiles) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')
      lines.forEach((line, idx) => {
        const trimmed = line.trim()
        // Ignore single-line or multi-line comment blocks
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
          return
        }
        if (trimmed.includes('!important')) {
          const rel = path.relative(srcDir, filePath)
          violations.push(`${rel}:${idx + 1} -> ${trimmed}`)
        }
      })
    }

    expect(violations).toEqual([])
  })

  // ── 2. Zero raw hex values or var fallbacks in component SCSS ───────────────
  test('Rule 2: ZERO hardcoded hex colors or var(#...) fallbacks in component SCSS', () => {
    const scssFiles = fs.readdirSync(sassDir)
      .filter((f) => f.endsWith('.scss'))
      // Exclude variable and root design system definitions
      .filter((f) => !['_variables.scss', '_structure.scss'].includes(f))

    const violations = []

    for (const file of scssFiles) {
      const fullPath = path.join(sassDir, file)
      const content = fs.readFileSync(fullPath, 'utf-8')
      const lines = content.split('\n')

      lines.forEach((line, idx) => {
        const trimmed = line.trim()
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
          return
        }
        // Disallow hex colors in component styles (e.g. #ffffff, #262626)
        if (/#[0-9a-fA-F]{3,8}/.test(trimmed)) {
          violations.push(`[HEX] ${file}:${idx + 1} -> ${trimmed}`)
        }
        // Disallow var() fallbacks with hex (e.g. var(--bg-dark, #262626))
        if (/var\([^)]+,.*#[0-9a-fA-F]{3,8}\)/.test(trimmed)) {
          violations.push(`[VAR-FALLBACK] ${file}:${idx + 1} -> ${trimmed}`)
        }
      })
    }

    expect(violations).toEqual([])
  })

  // ── 3. Zero hardcoded inline pixels (e.g. 180px) in JS files ────────────────
  test('Rule 3: ZERO hardcoded layout dimensions (height: 180px, border-radius: 16px) in JS', () => {
    const jsFiles = getAllFiles(srcDir, ['.js'])
    const violations = []

    const forbiddenPatterns = [
      /height:\s*180px/,
      /border-radius:\s*16px/,
      /border-radius:\s*4px/,
      /border-radius:\s*0\.25rem/,
      /rgba\(\s*200\s*,\s*200\s*,\s*200/,
      /class="skeleton--shimmer"/,
      /style="display:\s*inline-block;\s*width:/,
      /skeleton-title-placeholder/,
    ]

    for (const filePath of jsFiles) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')
      lines.forEach((line, idx) => {
        const trimmed = line.trim()
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
          return
        }
        for (const pattern of forbiddenPatterns) {
          if (pattern.test(trimmed)) {
            const rel = path.relative(srcDir, filePath)
            violations.push(`${rel}:${idx + 1} [matches ${pattern}] -> ${trimmed}`)
          }
        }
      })
    }

    expect(violations).toEqual([])
  })

  // ── 4. Centralized CLASSES dictionary is 100% DRY ───────────────────────────
  test('Rule 4: Centralized CLASSES dictionary is defined and DRY in src/core/constants.js', () => {
    expect(CLASSES).toBeDefined()
    expect(typeof CLASSES).toBe('object')

    // Essential tokens must exist
    expect(CLASSES.SKELETON_SHIMMER).toBe('skeleton--shimmer')
    expect(CLASSES.HOME_MOSAIC).toBe('home-mosaic')
    expect(CLASSES.HOME_MOSAIC_ITEM).toBe('home-mosaic-item')
    expect(CLASSES.AWARDS_FOOTER).toBe('awards-footer')
    expect(CLASSES.AWARDS_FOOTER_TITLE).toBe('awards-footer-title')
    expect(CLASSES.AWARDS_FOOTER_LINKS).toBe('awards-footer-links')
    expect(CLASSES.ABOUT).toBe('about')
    expect(CLASSES.ABOUT_PROFILE_PICTURE).toBe('about-profile-picture')

    // Ensure constants.js does NOT repeat literal string 'awards-footer' repeatedly
    const constantsContent = fs.readFileSync(path.join(srcDir, 'core/constants.js'), 'utf-8')
    const matches = constantsContent.match(/'awards-footer'/g) || []
    expect(matches.length).toBe(1) // Defined exactly once!
  })

})
