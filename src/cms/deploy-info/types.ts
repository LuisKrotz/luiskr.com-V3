/**
 * @file cms/deploy-info/types.ts — report shapes for the Deploy Info tab.
 * Mirrors the JSON written into dist/deploy-info/ by deploy-info.mjs.
 */
/* istanbul ignore file */

export interface DeployIndex {
  files?: Record<string, string>
  generatedAt?: string
  commit?: string
}

/**
 * Type contract for LighthouseReport — the shape consumers rely on.
 */
export interface LighthouseReport {
  urls?: Array<{ url: string; scores: Record<string, number> }>
}

/**
 * Type contract for CoverageReport — the shape consumers rely on.
 */
export interface CoverageReport {
  total?: Record<string, { covered?: number; total?: number; pct?: number }>
}

/**
 * Type contract for AxeReport — the shape consumers rely on.
 */
export interface AxeReport {
  engine?: string
  totals?: Record<string, number>
  surfaces?: Array<{
    surface: string
    violations?: Array<{ impact?: string; id?: string; help?: string }>
  }>
}

/**
 * Type contract for SnykReport — the shape consumers rely on.
 */
export interface SnykReport {
  scanner?: string
  ok?: boolean
  totals?: Record<string, number>
  vulnerabilities?: Array<{
    packageName?: string
    severity?: string
    title?: string
    acceptedRisk?: boolean
    fixedIn?: string
  }>
}

/**
 * Type contract for ConsoleScanReport — the shape consumers rely on.
 */
export interface ConsoleScanReport {
  ok?: boolean
  totals?: Record<string, number>
  violations?: Array<{ file?: string; line?: number; method?: string }>
}

/**
 * Type contract for DeployFetchState — the shape consumers rely on.
 */
export type DeployFetchState = 'loading' | 'missing' | 'ready'
