/**
 * @file docs/redact.mjs
 * @description Secret scrubbing for the public source-code viewer.
 *
 * The docs portal publishes `src/` source verbatim (pre-formatted, never
 * minified). Some source lines still embed sensitive-looking material — the
 * base64-encoded Firebase key fallback, `import.meta.env.VITE_*` lookups are
 * fine to show but literal key-shaped strings must never reach the browser.
 * `redactSource` masks credential-shaped tokens in place; `shouldExcludeFile`
 * drops whole files that can never be published at all (database.json,
 * env files, private key material).
 */

/**
 * Filename allow/deny rules — basename matched, so a file is excluded
 * wherever it sits in the tree. `database.json` is the CMS content store:
 * it may contain draft data and is never published through the portal.
 * @param {string} name Lower-cased basename of the file.
 * @returns {boolean} true when the file must not be listed or served.
 */
export const shouldExcludeFile = (name) =>
  name === 'database.json' ||
  name.startsWith('.env') ||
  name.endsWith('.min.js') ||
  name.endsWith('.min.css') ||
  name === 'firebase-debug.log' ||
  /\.(pem|key|p12|pfx)$/u.test(name)

/**
 * Credential-shaped literal patterns. Each is replaced with a fixed-width
 * redaction marker so displayed line/column structure stays intact.
 */
const SECRET_PATTERNS = [
  // Google API key literal (AIza + 35 chars)
  /AIza[0-9A-Za-z_-]{35}/gu,
  // Base64 payloads inside atob('...') — firebase.ts bakes the API key
  // fallback this way; a ≥16-char base64 blob in atob() is masked.
  /atob\((['"])[A-Za-z0-9+/=]{16,}\1\)/gu,
  // Bearer/JWT-style tokens embedded in source
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}/gu,
]

/** Single redaction token — fixed width keeps alignment legible. */
const REDACTED = '"[redacted]"'

/**
 * Masks credential-shaped literals in a source string.
 * @param {string} code Raw file contents.
 * @returns {string} Contents safe to ship to the browser.
 */
export const redactSource = (code) => {
  let out = code

  for (const pattern of SECRET_PATTERNS) {
    out = out.replace(pattern, REDACTED)
  }

  return out
}
