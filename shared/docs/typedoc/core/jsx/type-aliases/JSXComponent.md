[**luiskr.com**](../../../README.md)

***

[luiskr.com](../../../README.md) / [core/jsx](../README.md) / JSXComponent

```ts
type JSXComponent<P> = (_props) => Node | DocumentFragment | null;
```

Defined in: [core/jsx.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/jsx.ts#L26)

Functional component tag — receives `{...props, children}` and returns a node.

## Type Parameters

### P

`P` = `Record`\<`string`, `unknown`\>

## Parameters

### \_props

`P` & `object`

## Returns

`Node` \| `DocumentFragment` \| `null`
