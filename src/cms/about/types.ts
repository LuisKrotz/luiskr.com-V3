/**
 * @file about/types.ts — about-editor model types + gravatar hash helper.
 */

// Gravatar size presets offered by the generator — matching the site's
// 200px render box and its 1x/2x/3x DPR srcset needs.
/**
 * The SIZE_PRESETS constant.
 * @param 200 — the value
 * @param 256 — the value
 * @param 300 — the value
 * @param 400 — the value
 * @param 512 — the value
 */
export const SIZE_PRESETS = Object.freeze([150, 200, 256, 300, 400, 512])

/**
 * Type contract for mention item.
 */
export interface MentionItem {
  description: string
  link: string
  icon: string
}

/**
 * Type contract for AboutData — the shape consumers rely on.
 */
export interface AboutData {
  title: string
  profilePicture: string
  col1: string[]
  col2: string[]
  mentions: string
  mention_items: MentionItem[]
}

/**
 * Type contract for BioColumn — the shape consumers rely on.
 */
export type BioColumn = 'col1' | 'col2'

/**
 * Email → Gravatar hash per Gravatar's spec: trim + lowercase, SHA-256,
 * hex string. crypto.subtle keeps the hash on the browser's crypto
 * engine — no hashing code or dependency needed.
 */
export async function emailToGravatarHash(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase()
  const msgBuf = new TextEncoder().encode(normalized)
  const hashBuf = await crypto.subtle.digest('SHA-256', msgBuf)
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
