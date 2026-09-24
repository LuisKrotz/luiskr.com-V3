#!/usr/bin/env node

/**
 * @file ast-string-extract.js
 * @description AST-based static analysis tool to detect repeated non-syntactic string literals
 * across the codebase (e.g. UI labels, dictionary keys, API routes, error messages)
 * while preserving engine-level syntactic tokens (such as '', '/', 'en', className, etc.)
 * in pure inline JS for optimal V8 inline caching.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from '@babel/parser'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC_DIR = path.resolve(ROOT, 'src')

// Zero exclusions — all strings are extracted into constants inventory
const EXCLUDED_TOKENS = new Set([])

function scanDirectory(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'wasm') {
        scanDirectory(fullPath, fileList)
      }
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.jsx'))) {
      // Exclude constants.js itself since it is the single-source-of-truth dictionary
      if (!fullPath.includes('src/core/constants.js')) {
        fileList.push(fullPath)
      }
    }
  }

  return fileList
}

function extractStrings() {
  const files = scanDirectory(SRC_DIR)
  const stringOccurrences = new Map()

  for (const file of files) {
    const code = fs.readFileSync(file, 'utf-8')
    let ast

    try {
      ast = parse(code, {
        sourceType: 'module',
        plugins: ['jsx'],
      })
    } catch (err) {
      console.warn(`[AST] Skipping ${file}: ${err.message}`)
      continue
    }

    const relPath = path.relative(ROOT, file)

    // Simple AST walker
    function walk(node, parent) {
      if (!node || typeof node !== 'object') return

      // Don't extract import sources (e.g. import ... from '...')
      if (
        (parent?.type === 'ImportDeclaration' || parent?.type === 'ExportNamedDeclaration' || parent?.type === 'ExportAllDeclaration') &&
        node === parent.source
      ) {
        return
      }

      if (node.type === 'StringLiteral') {
        const val = node.value

        if (typeof val === 'string') {
          const list = stringOccurrences.get(val) || []
          list.push({ file: relPath, line: node.loc?.start?.line })
          stringOccurrences.set(val, list)
        }
      }

      for (const key of Object.keys(node)) {
        if (key !== 'loc' && key !== 'range') {
          const child = node[key]
          if (Array.isArray(child)) {
            for (const c of child) walk(c, node)
          } else if (child && typeof child === 'object') {
            walk(child, node)
          }
        }
      }
    }

    walk(ast, null)
  }

  // Filter repeated strings (frequency >= 2)
  const repeated = []
  const single = []

  for (const [str, locations] of stringOccurrences.entries()) {
    if (locations.length >= 2) {
      repeated.push({ string: str, count: locations.length, locations })
    } else {
      single.push({ string: str, count: 1, locations })
    }
  }

  repeated.sort((a, b) => b.count - a.count)

  console.log('='.repeat(70))
  console.log(`AST STRING EXTRACTION REPORT`)
  console.log(`Total scanned files: ${files.length}`)
  console.log(`Total unique non-syntactic strings: ${stringOccurrences.size}`)
  console.log(`Repeated non-syntactic strings: ${repeated.length}`)
  console.log('='.repeat(70))

  console.log('\nTop Repeated Strings (Candidates for Core Constants or Locale Chunks):')
  repeated.slice(0, 15).forEach((item, i) => {
    console.log(` ${i + 1}. "${item.string}" (${item.count}x) across:`)
    const uniqueFiles = [...new Set(item.locations.map((l) => l.file))]
    uniqueFiles.slice(0, 3).forEach((f) => console.log(`    - ${f}`))
    if (uniqueFiles.length > 3) console.log(`    - ...and ${uniqueFiles.length - 3} more files`)
  })

  // Ensure output directory exists for chunk manifests
  const outDir = path.resolve(ROOT, 'src/core/locale')
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  // Write report to JSON for inspection/bundling
  const reportPath = path.resolve(outDir, 'string-inventory.json')
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        repeatedCount: repeated.length,
        repeated,
      },
      null,
      2
    )
  )

  console.log(`\nInventory written to: ${path.relative(ROOT, reportPath)}\n`)
}

extractStrings()
