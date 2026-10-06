# `components/legal/Footer.tsx`

&lt;legal-footer&gt; — footer strip shared by internals and the

| | |
|---|---|
| **Source** | `src/components/legal/Footer.tsx` |
| **UX surface** | Footer shown on legal pages. |

## Members

### (module scope)

Builds the legal link list for a locale from bundled data: the four
fixed destinations (home, privacy, GDPR, terms) resolve through
LANG_SLUGS so localized paths work offline; labels come from the
components dictionary — index-aligned with slugFor so labels[i]
describes destination i.

### (module scope)

Loads the legal-links node when missing (SWR).

### (module scope)

JSX template for the component's shadow DOM.
