# `website/components/home/AboutSection.tsx`

&lt;about-section&gt; — the home page's bio block: Gravatar profile

| | |
|---|---|
| **Source** | `src/website/components/home/AboutSection.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `AboutSection`

The AboutSection — section class.

### `aboutTranslations`

Setter/getter — the about-page translation node pushed by the parent view.

### `profilePicture`

Setter/getter — raw Gravatar URL for the profile photo.

### `optimizedProfilePicture`

CDN-resized Gravatar URL for the profile img.

### `profilePictureSrcset`

Responsive srcset candidates for the profile photo.

### `aboutDrawData`

Draw-timing plan for the two bio columns. Both columns share ONE
1500ms animation budget: charDelay = 1500ms ÷ totalChars (both
columns), and each paragraph's offset = cumulative chars before it
× delay — so col2's first paragraph starts exactly when col1's last
ends. The bio reads as a single continuous type-in flowing down the
left column then continuing down the right.

### (module scope)

JSX template for the component's shadow DOM.
