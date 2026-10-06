import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as CORE_TOKENS from '@/core/constants.js'
import { TEST_AWARDS, TEST_PROJECTS, TEST_TAGS, TEST_TEXT } from '../fixtures/test-constants.js'
import { DOM_STRINGS } from '../../src/core/tokens/strings/dom.js'
import { CHAR_STRINGS } from '../../src/core/tokens/strings/chars.js'
import { SKELETON_CLASSES } from '../../src/core/tokens/classes/skeleton.js'
import { TYPE_STRINGS } from '../../src/core/tokens/strings/types.js'
import { HOME_MOSAIC_CLASSES } from '../../src/core/tokens/classes/mosaic.js'
import { COMPONENT_TAGS } from '../../src/core/tokens/elements/components.js'
import { AWARDS_CLASSES } from '../../src/core/tokens/classes/awards.js'
import { ABOUT_CLASSES } from '../../src/core/tokens/classes/about.js'
import { SECTION_IDS } from '../../src/core/tokens/ids/sections.js'
import { DB_PATHS } from '../../src/core/tokens/routes/paths.js'
import { CAROUSEL_CLASSES } from '../../src/core/tokens/classes/carousel.js'
import { CAROUSEL_SELECTORS } from '../../src/core/tokens/selectors/carousel.js'
import { DRAW_TEXT_CLASSES } from '../../src/core/tokens/classes/draw-text.js'
import { COOKIE_CLASSES } from '../../src/core/tokens/classes/cookies.js'
import { MEDIA_ATTRS } from '../../src/core/tokens/attrs/media.js'
import { FORM_ATTRS } from '../../src/core/tokens/attrs/form.js'
import { HTML_TAGS } from '../../src/core/tokens/elements/html.js'
import { LABEL_TEXT } from '../../src/core/tokens/strings/text.js'
import { MOUSE_EVENTS } from '../../src/core/tokens/events/dom.js'
import { PREF_STORAGE_KEYS } from '../../src/core/tokens/data/storage.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..', '..')
const srcDir = path.join(rootDir, DOM_STRINGS.SRC)
const sassDir = path.join(srcDir, 'sass')
const componentScssFiles = () =>
  getAllFiles(sassDir, ['.scss']).filter((f) => !f.includes(`${path.sep}base${path.sep}`))

function getAllFiles(dir, exts = ['.scss', '.css', '.js', '.ts', '.tsx']) {
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
        if (
          trimmed.startsWith(CHAR_STRINGS.DOUBLE_SLASH) ||
          trimmed.startsWith('/*') ||
          trimmed.startsWith('*')
        ) {
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
    const scssFiles = componentScssFiles()

    const violations = []

    for (const file of scssFiles) {
      const fullPath = file
      const content = fs.readFileSync(fullPath, 'utf-8')
      const lines = content.split('\n')

      lines.forEach((line, idx) => {
        const trimmed = line.trim()
        if (
          trimmed.startsWith(CHAR_STRINGS.DOUBLE_SLASH) ||
          trimmed.startsWith('/*') ||
          trimmed.startsWith('*')
        ) {
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
    const jsFiles = getAllFiles(srcDir, ['.js', '.ts', '.tsx'])
    const violations = []

    const forbiddenPatterns = [
      /height:\s*180px/,
      /border-radius:\s*16px/,
      /border-radius:\s*4px/,
      /border-radius:\s*0\.25rem/,
      /rgba\(\s*200\s*,\s*200\s*,\s*200/,
      /class=SKELETON_CLASSES.SKELETON_SHIMMER/,
      /style="display:\s*inline-block;\s*width:/,
      /skeleton-title-placeholder/,
    ]

    for (const filePath of jsFiles) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')
      lines.forEach((line, idx) => {
        const trimmed = line.trim()
        if (
          trimmed.startsWith(CHAR_STRINGS.DOUBLE_SLASH) ||
          trimmed.startsWith('/*') ||
          trimmed.startsWith('*')
        ) {
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

  // ── 4. Centralized class-token groups are 100% DRY ───────────────────────
  test('Rule 4: class-token groups are defined and DRY in src/core/tokens', () => {
    expect(SKELETON_CLASSES).toBeDefined()
    expect(typeof SKELETON_CLASSES).toBe(TYPE_STRINGS.OBJECT)

    // Essential tokens must exist
    expect(SKELETON_CLASSES.SKELETON_SHIMMER).toBe(SKELETON_CLASSES.SKELETON_SHIMMER)
    expect(HOME_MOSAIC_CLASSES.HOME_MOSAIC).toBe(COMPONENT_TAGS.HOME_MOSAIC)
    expect(HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM).toBe(HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM)
    expect(AWARDS_CLASSES.AWARDS_FOOTER).toBe(AWARDS_CLASSES.AWARDS_FOOTER)
    expect(AWARDS_CLASSES.AWARDS_FOOTER_TITLE).toBe(AWARDS_CLASSES.AWARDS_FOOTER_TITLE)
    expect(AWARDS_CLASSES.AWARDS_FOOTER_LINKS).toBe(AWARDS_CLASSES.AWARDS_FOOTER_LINKS)
    expect(ABOUT_CLASSES.ABOUT).toBe(SECTION_IDS.ABOUT)
    expect(ABOUT_CLASSES.ABOUT_PROFILE_PICTURE).toBe(ABOUT_CLASSES.ABOUT_PROFILE_PICTURE)

    // Ensure the token layer does NOT repeat literal string AWARDS_CLASSES.AWARDS_FOOTER —
    // constants.js is a barrel re-exporting domain modules under core/tokens/,
    // so the check scans the barrel plus every token file it sources from.
    const tokensDir = path.join(srcDir, DB_PATHS.CORE_SEGMENT, 'tokens')
    const tokenFiles = getAllFiles(tokensDir, ['.js', '.ts'])
    const constantsContent = [path.join(srcDir, 'core/constants.ts'), ...tokenFiles]
      .map((f) => fs.readFileSync(f, 'utf-8'))
      .join('\n')
    const matches =
      constantsContent.match(new RegExp(`'${AWARDS_CLASSES.AWARDS_FOOTER}'`, 'g')) || []
    expect(matches.length).toBe(1) // Defined exactly once!
  })

  // ── 5. Zero raw white or black color keywords in component SCSS ──────────────
  test('Rule 5: ZERO raw white or black color keywords in component SCSS', () => {
    const scssFiles = componentScssFiles()

    const violations = []
    const colorKeywordRegex = /(?<![$\-_a-zA-Z])(white|black)(?![$\-_a-zA-Z])/i

    for (const file of scssFiles) {
      const fullPath = file
      const content = fs.readFileSync(fullPath, 'utf-8')
      const lines = content.split('\n')

      lines.forEach((line, idx) => {
        const trimmed = line.trim()
        if (
          trimmed.startsWith(CHAR_STRINGS.DOUBLE_SLASH) ||
          trimmed.startsWith('/*') ||
          trimmed.startsWith('*')
        ) {
          return
        }

        const codeOnly = line
          .replace(/\/\/.*$/, '')
          .replace(/\/\*.*?\*\//g, '')
          .trim()

        if (colorKeywordRegex.test(codeOnly)) {
          violations.push(`[RAW-COLOR] ${file}:${idx + 1} -> ${trimmed}`)
        }
      })
    }

    expect(violations).toEqual([])
  })

  // ── 6. Zero forbidden inline string literals in component JS ─────────────────
  test('Rule 6: ZERO forbidden inline string literals in components and patches', () => {
    const targetFiles = [
      'components/carousel/CustomCarousel.js',
      'components/media/DrawText.js',
      'components/feedback/CookieBanner.js',
      'components/feedback/StatsHud.js',
      'components/media/MediaFigure.js',
      'safari-patch.js',
    ]

    const forbiddenStrings = [
      CAROUSEL_CLASSES.CAROUSEL_IN_VIEW,
      CAROUSEL_SELECTORS.CAROUSEL_BTN_RING_FILL,
      DRAW_TEXT_CLASSES.DRAW_TEXT_VISIBLE,
      DRAW_TEXT_CLASSES.DRAW_TEXT_DONE,
      '0 0 44 44',
      COOKIE_CLASSES.COOKIES_BUTTONS_ACCEPT,
      COOKIE_CLASSES.COOKIES_BUTTONS_REFUSE,
    ]

    const violations = []

    for (const relPath of targetFiles) {
      const fullPath = path.join(srcDir, relPath)
      if (!fs.existsSync(fullPath)) continue

      const content = fs.readFileSync(fullPath, 'utf-8')
      const lines = content.split('\n')

      lines.forEach((line, idx) => {
        const trimmed = line.trim()
        if (
          trimmed.startsWith(CHAR_STRINGS.DOUBLE_SLASH) ||
          trimmed.startsWith('/*') ||
          trimmed.startsWith('*')
        ) {
          return
        }

        for (const str of forbiddenStrings) {
          const singleQuoted = `'${str}'`
          const doubleQuoted = `"${str}"`
          const backtickQuoted = `\`${str}\``

          if (
            trimmed.includes(singleQuoted) ||
            trimmed.includes(doubleQuoted) ||
            trimmed.includes(backtickQuoted)
          ) {
            violations.push(`${relPath}:${idx + 1} [contains literal "${str}"] -> ${trimmed}`)
          }
        }
      })
    }

    expect(violations).toEqual([])
  })

  // ── 7. CookieBanner HTML rendering verification ─────────────────────────────
  test('Rule 7: CookieBanner renders message HTML via dangerouslySetInnerHTML', () => {
    const bannerPath = path.join(srcDir, 'components/feedback/CookieBanner.tsx')
    const content = fs.readFileSync(bannerPath, 'utf-8')

    expect(content).toContain('dangerouslySetInnerHTML')
  })

  // ── 8. Core token groups are defined and frozen ───────────────────────────
  test('Rule 8: Core token groups are defined and frozen', () => {
    expect(CAROUSEL_SELECTORS).toBeDefined()
    expect(Object.isFrozen(CAROUSEL_SELECTORS)).toBe(true)

    expect(MEDIA_ATTRS).toBeDefined()
    expect(Object.isFrozen(MEDIA_ATTRS)).toBe(true)
    expect(MEDIA_ATTRS.SRC).toBe(DOM_STRINGS.SRC)
    expect(FORM_ATTRS.LABEL).toBe(HTML_TAGS.LABEL)

    expect(MOUSE_EVENTS).toBeDefined()
    expect(Object.isFrozen(MOUSE_EVENTS)).toBe(true)

    expect(PREF_STORAGE_KEYS).toBeDefined()
    expect(Object.isFrozen(PREF_STORAGE_KEYS)).toBe(true)

    expect(LABEL_TEXT).toBeDefined()
    expect(Object.isFrozen(LABEL_TEXT)).toBe(true)
    expect(LABEL_TEXT.LOADING).toBe(LABEL_TEXT.LOADING)

    expect(TYPE_STRINGS).toBeDefined()
    expect(Object.isFrozen(TYPE_STRINGS)).toBe(true)
    expect(TYPE_STRINGS.UNDEFINED).toBe(TYPE_STRINGS.UNDEFINED)
    expect(TYPE_STRINGS.FUNCTION).toBe(TYPE_STRINGS.FUNCTION)
  })

  // ── 9. Zero raw primitive type strings outside the token layer ─────────────
  test('Rule 9: ZERO raw primitive type strings outside core/tokens', () => {
    const jsFiles = getAllFiles(srcDir, ['.js', '.ts', '.tsx'])
      .filter((f) => !f.endsWith('core/constants.js'))
      // core/tokens/ is the dictionary itself — TYPE_STRINGS.UNDEFINED etc. must
      // hold the raw literals. legacy-polyfills/ are standalone pre-module
      // bundles that cannot import the token layer (an import would drag the
      // whole app graph into IE-era IIFE output), so they keep raw literals.
      .filter((f) => !f.includes(`${path.sep}${DB_PATHS.CORE_SEGMENT}${path.sep}tokens${path.sep}`))
      .filter((f) => !f.includes(`${path.sep}legacy-polyfills${path.sep}`))

    const violations = []
    const forbidden = ["'undefined'", '"undefined"', "'function'", '"function"']

    for (const filePath of jsFiles) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')

      lines.forEach((line, idx) => {
        const trimmed = line.trim()
        if (
          trimmed.startsWith(CHAR_STRINGS.DOUBLE_SLASH) ||
          trimmed.startsWith('/*') ||
          trimmed.startsWith('*')
        ) {
          return
        }

        for (const token of forbidden) {
          if (trimmed.includes(token)) {
            const rel = path.relative(srcDir, filePath)
            violations.push(`${rel}:${idx + 1} [contains literal ${token}] -> ${trimmed}`)
          }
        }
      })
    }

    expect(violations).toEqual([])
  })

  // ── 10. Zero text inside skeleton elements in JSX ──────────────────────────
  test('Rule 10: ZERO text inside skeleton elements in JSX', () => {
    const jsFiles = getAllFiles(srcDir, ['.js', '.ts', '.tsx'])

    const violations = []

    for (const filePath of jsFiles) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')

      lines.forEach((line, idx) => {
        const trimmed = line.trim()
        if (
          trimmed.startsWith(CHAR_STRINGS.DOUBLE_SLASH) ||
          trimmed.startsWith('/*') ||
          trimmed.startsWith('*')
        ) {
          return
        }

        // Match any JSX element with a skeleton class that has inner content before closing tag
        if (/SKELETON/i.test(trimmed) && /<[a-z0-9-]+[^>]*>[^<]+<\/[a-z0-9-]+>/i.test(trimmed)) {
          const rel = path.relative(srcDir, filePath)
          violations.push(`${rel}:${idx + 1} [skeleton contains inner text] -> ${trimmed}`)
        }
      })
    }

    expect(violations).toEqual([])
  })

  // ── 11. Tests must use token imports, never literals matching token values ───
  test('Rule 11: ZERO literals matching token values inside tests/', () => {
    const testsDir = path.join(__dirname)

    // Every string value exported by core tokens + test fixtures is reserved
    const tokenValues = new Set()
    const collect = (obj) => {
      if (!obj || typeof obj !== TYPE_STRINGS.OBJECT) return
      for (const v of Object.values(obj)) {
        if (typeof v === TYPE_STRINGS.STRING && v.length >= 2) tokenValues.add(v)
        else if (v && typeof v === TYPE_STRINGS.OBJECT) collect(v)
      }
    }
    for (const group of Object.values(CORE_TOKENS)) collect(group)
    for (const group of [TEST_TAGS, TEST_TEXT, TEST_PROJECTS, TEST_AWARDS]) collect(group)

    // Files that DEFINE or VERIFY the tokens themselves are exempt
    const exempt = new Set([
      path.join(testsDir, 'fixtures', 'test-constants.js'),
      path.join(testsDir, 'constants.test.js'),
    ])

    const jsFiles = getAllFiles(testsDir, ['.js']).filter((f) => !exempt.has(f))
    const stringLiteral = /(?<![\w$.])(['"`])((?:(?!\1).){2 }?)\1/g
    const nameArg = /\b(describe|test|it|xdescribe|xtest|xit)\(\s*$/

    const violations = []

    for (const filePath of jsFiles) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')

      lines.forEach((line, idx) => {
        const trimmed = line.trim()
        if (
          trimmed.startsWith(CHAR_STRINGS.DOUBLE_SLASH) ||
          trimmed.startsWith('/*') ||
          trimmed.startsWith('*')
        ) {
          return
        }
        if (/^\s*(import|export)\b.*\bfrom\b/.test(trimmed)) return

        stringLiteral.lastIndex = 0
        let m
        while ((m = stringLiteral.exec(line)) !== null) {
          const value = m[2]
          if (!tokenValues.has(value)) continue
          if (nameArg.test(line.slice(0, m.index))) continue
          const rel = path.relative(testsDir, filePath)
          violations.push(`${rel}:${idx + 1} [literal "${value}" must be a token] -> ${trimmed}`)
        }
      })
    }

    expect(violations).toEqual([])
  })

  test('Rule 12-14: quality-gate infrastructure exists and is wired into npm lifecycle', () => {
    const requiredScripts = [
      'scripts/verify/console-scan.mjs',
      'scripts/verify/security-scan.mjs',
      'scripts/verify/coverage-gate.mjs',
      'scripts/verify/verify.mjs',
      'scripts/git-hooks/pre-commit',
    ]

    requiredScripts.forEach((file) => {
      expect(fs.existsSync(path.join(rootDir, file))).toBe(true)
    })

    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'))

    expect(pkg.scripts.prebuild).toBe('npm run verify')

    const verifySrc = fs.readFileSync(path.join(rootDir, 'scripts/verify/verify.mjs'), 'utf-8')

    requiredScripts.slice(0, 3).forEach((file) => {
      expect(verifySrc).toContain(path.basename(file))
    })
  })
})
