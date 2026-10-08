[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [experiments/docs/mermaid](../README.md) / renderMermaidBlocks

```ts
function renderMermaidBlocks(container): Promise<void>;
```

Defined in: [experiments/docs/mermaid.ts:55](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/docs/mermaid.ts#L55)

Renders every unprocessed `.docs-mermaid` block inside `container`
into an inline SVG diagram. Safe to call repeatedly — mermaid marks
processed nodes (`data-processed`), so later payloads don't re-render
earlier diagrams.

## Parameters

### container

`HTMLElement`

The docs-content box holding rendered payload HTML.

## Returns

`Promise`\<`void`\>
