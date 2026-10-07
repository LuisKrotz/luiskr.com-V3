/**
 * @file about/types.ts — about-editor model types + gravatar hash helper.
 */

/**
 * Gravatar size presets offered by the generator — covering the site's
 * 200px render box and its 1x/2x/3x DPR srcset needs plus favicon-size
 * variants for other consumers.
 */
export const SIZE_PRESETS = Object.freeze([150, 200, 256, 300, 400, 512])

/** One linkable mention entry (press/award link shown on the about page). */
export interface MentionItem {
  /** Visible caption text. */
  description: string
  /** Destination URL. */
  link: string
  /** Icon asset key resolved by the renderer. */
  icon: string
}

/** The about-page CMS document shape persisted in Firebase. */
export interface AboutData {
  /** Page heading. */
  title: string
  /** Gravatar/profile image URL. */
  profilePicture: string
  /** Left bio column — paragraph strings. */
  col1: string[]
  /** Right bio column — paragraph strings. */
  col2: string[]
  /** Mentions section intro copy. */
  mentions: string
  /** Structured mention rows. */
  mention_items: MentionItem[]
}

/** Which bio column an editor field addresses — drives per-column updates. */
export type BioColumn = 'col1' | 'col2'

/**
 * Email → Gravatar hash per Gravatar's spec: trim + lowercase, SHA-256,
 * hex string. crypto.subtle keeps the hash on the browser's crypto
 * engine — no hashing code or dependency needed. Each byte is hex-encoded
 * and zero-padded so the digest renders as the canonical 64-char string.
 * @param email Raw email input (any casing/whitespace).
 * @returns The lowercase 64-char hex SHA-256 digest.
 */
export async function emailToGravatarHash(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase()
  const msgBuf = new TextEncoder().encode(normalized)
  const hashBuf = await crypto.subtle.digest('SHA-256', msgBuf)
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
