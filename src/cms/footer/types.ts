/**
 * @file cms/footer/types.ts — model shapes for the footer editor's
 * three DB nodes (components/contact, components/legal-footer,
 * components/related).
 */
/* istanbul ignore file */

/**
 * One contact/social row in the footer editors — `description` is the
 * visible label, `page`/`network` categorize it, `link` is the href. The index
 * signature absorbs extra CMS fields without widening every schema bump.
 */
export interface FooterChannel {
  description?: string
  page?: string
  network?: string
  link?: string
  [key: string]: unknown
}

/**
 * The components/contact DB node — `title` plus two channel columns
 * (`line1`/`line2`) rendered side by side in the footer.
 */
export interface ContactData {
  title: string
  line1: FooterChannel[]
  line2: FooterChannel[]
}

/**
 * The components/related DB node — `title`/`note` copy plus the
 * `socials` channel list the related-projects footer renders.
 */
export interface RelatedFooter {
  title: string
  note: string
  socials: FooterChannel[]
}
