[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/deploy-info/data](../README.md) / loadReports

```ts
function loadReports(host): Promise<void>
```

Defined in: [src/cms/deploy-info/data.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/deploy-info/data.ts#L37)

Fetches the manifest then all five reports in parallel — the index
is the gate (missing bundle → "run yarn deploy:info" hint), each
report degrades independently so a partial bundle still renders.

## Parameters

### host

[`CmsDeployInfo`](../../CmsDeployInfo/classes/CmsDeployInfo.md)

## Returns

`Promise`\<`void`\>
