/**
 * @file experiments/docs/index.ts
 * @description Barrel for the `docs` experiment module — the in-app
 * documentation portal view plus its manifest contract so consumers can
 * resolve `virtual:docs-manifest` payloads without reaching into internals.
 * Re-export-only file.
 */
/* istanbul ignore file */

export { ViewDocs } from './Docs.js'
export type { DocsNode, DocsRoot, DocsManifest, DocsFilePayload } from './manifest.js'
export {
  getDocsManifest,
  docsGeneratedAt,
  resolveDocsPath,
  crumbsForPath,
  fetchDocsFile,
} from './manifest.js'
