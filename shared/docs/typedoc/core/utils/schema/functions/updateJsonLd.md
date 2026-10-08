[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/utils/schema](../README.md) / updateJsonLd

```ts
function updateJsonLd(graph): void;
```

Defined in: [core/utils/schema.ts:271](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/schema.ts#L271)

Dynamically updates the JSON-LD script graph in the document head.
Maintains exactly one `<script type="application/ld+json">` node — an
array payload is wrapped in a `@graph` container so a single script can
carry the whole entity set (the form Google's parsers prefer), and
`textContent` (not innerHTML) writes it since JSON must not go through
the HTML parser. Passing `null`/`undefined` REMOVES the node — routes
that own a page-scoped graph (docs TechArticle, project Article) clear
it on teardown so the entity never leaks onto the next route.

## Parameters

### graph

  \| `Record`\<`string`, `unknown`\>
  \| `Record`\<`string`, `unknown`\>[]
  \| `null`
  \| `undefined`

Entity or entity array; null/undefined removes the node.

## Returns

`void`
