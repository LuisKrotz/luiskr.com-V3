/**
 * @file cms/footer/types.ts — model shapes for the footer editor's
 * three DB nodes (components/contact, components/legal-footer,
 * components/related).
 */
/* istanbul ignore file */

export interface FooterChannel {
  description?: string
  page?: string
  network?: string
  link?: string
  [key: string]: unknown
}

/**
 * contacts data.
 */
export interface ContactData {
  title: string
  line1: FooterChannel[]
  line2: FooterChannel[]
}

/**
 * Type contract for RelatedFooter — the shape consumers rely on.
 */
export interface RelatedFooter {
  title: string
  note: string
  socials: FooterChannel[]
}
