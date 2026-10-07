[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [playground/space/panel-render](../README.md) / renderSpControl

```ts
function renderSpControl(ctrl, t, savedVal): Element
```

Defined in: [src/playground/space/panel-render.tsx:22](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/space/panel-render.tsx#L22)

One control row. Checkboxes render a WebGL check canvas + SVG check icon;
ranges render a slider with the range-fill CSS var + a value readout.
`savedVal` (persisted user value) wins over the control's shipped default.

## Parameters

### ctrl

[`SpControl`](../../controls/interfaces/SpControl.md)

### t

`Record`\<`string`, `unknown`\>

### savedVal

\| [`SpParamValue`](../../controls/type-aliases/SpParamValue.md)
\| `undefined`

## Returns

[`Element`](../../../../globals/namespaces/JSX/type-aliases/Element.md)
