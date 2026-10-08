[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/utils/schema](../README.md) / updateJsonLd

```ts
function updateJsonLd(graph): void
```

Defined in: [core/utils/schema.ts:194](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/schema.ts#L194)

Dynamically updates the JSON-LD script graph in the document head.
Maintains exactly one `<script type="application/ld+json">` node — an
array payload is wrapped in a `@graph` container so a single script can
carry the whole entity set (the form Google's parsers prefer), and
`textContent` (not innerHTML) writes it since JSON must not go through
the HTML parser.

## Parameters

### graph

\| `Record`\<`string`, `unknown`\>
\| `Record`\<`string`, `unknown`\>[]
\| `null`
\| `undefined`

Entity or entity array; null/undefined leaves the DOM alone.

## Returns

`void`
