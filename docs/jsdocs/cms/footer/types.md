# `cms/footer/types.ts`

| | |
|---|---|
| **Source** | `src/cms/footer/types.ts` |
| **UX surface** | Footer + legal links editor card. |

## Members

### (module scope)

One contact/social row in the footer editors — `description` is the
visible label, `page`/`network` categorize it, `link` is the href. The index
signature absorbs extra CMS fields without widening every schema bump.

### (module scope)

The components/contact DB node — `title` plus two channel columns
(`line1`/`line2`) rendered side by side in the footer.

### (module scope)

The components/related DB node — `title`/`note` copy plus the
`socials` channel list the related-projects footer renders.
