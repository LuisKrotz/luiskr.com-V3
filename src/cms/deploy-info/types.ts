/**
 * @file cms/deploy-info/types.ts — report shapes for the Deploy Info tab.
 * Mirrors the JSON written into dist/deploy-info/ by deploy-info.mjs.
 */

export interface DeployIndex {
  files?: Record<string, string>
  generatedAt?: string
  commit?: string
}

/**
 * The LighthouseReport value.
 */
export interface LighthouseReport {
  urls?: Array<{ url: string; scores: Record<string, number> }>
}

/**
 * The CoverageReport value.
 */
export interface CoverageReport {
  total?: Record<string, { covered?: number; total?: number; pct?: number }>
}

/**
 * The AxeReport value.
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
 * The SnykReport value.
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
 * The ConsoleScanReport value.
 */
export interface ConsoleScanReport {
  ok?: boolean
  totals?: Record<string, number>
  violations?: Array<{ file?: string; line?: number; method?: string }>
}

/**
 * The DeployFetchState value.
 */
export type DeployFetchState = 'loading' | 'missing' | 'ready'
