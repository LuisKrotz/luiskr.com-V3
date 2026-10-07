# `cms/lang/CmsLangEditor.tsx`

&lt;cms-lang-editor&gt; — raw JSON dictionary editor: any

| | |
|---|---|
| **Source** | `src/cms/lang/CmsLangEditor.tsx` |
| **UX surface** | Raw JSON dictionary editor card. |

## Members

### `CmsLangEditor`

The CmsLangEditor — lang editor class.

### (module scope)

Lifecycle: loads language data.

### `loadData`

Reads the language nodes for all locales.

### `saveData`

Writes the edited JSON back — parse failure aborts before the write
(an invalid blob would crash every consumer of that node), so the
editor surfaces the syntax error and keeps the stored copy intact.

### (module scope)

Wires inputs + save button.

### (module scope)

JSX template.
