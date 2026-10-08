# `cms/about/types.ts`

| | |
|---|---|
| **Source** | `src/cms/about/types.ts` |
| **UX surface** | About-section editor card. |

## Members

### (module scope)

One linkable mention entry (press/award link shown on the about page).

### `description`

Visible caption text.

### `link`

Destination URL.

### `icon`

Icon asset key resolved by the renderer.

### (module scope)

The about-page CMS document shape persisted in Firebase.

### `title`

Page heading.

### `profilePicture`

Gravatar/profile image URL.

### `col1`

Left bio column — paragraph strings.

### `col2`

Right bio column — paragraph strings.

### `mentions`

Mentions section intro copy.

### `mention_items`

Structured mention rows.

### (module scope)

Which bio column an editor field addresses — drives per-column updates.

### (module scope)

Email → Gravatar hash per Gravatar's spec: trim + lowercase, SHA-256,
hex string. crypto.subtle keeps the hash on the browser's crypto
engine — no hashing code or dependency needed. Each byte is hex-encoded
and zero-padded so the digest renders as the canonical 64-char string.
- `@param` email Raw email input (any casing/whitespace).
- `@returns` The lowercase 64-char hex SHA-256 digest.
