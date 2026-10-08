[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [website/components/media/MediaExpanded](../README.md) / MediaExpanded

Defined in: [website/components/media/MediaExpanded.tsx:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L24)

The MediaExpanded — expanded class.

## Extends

- [`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md)

## Constructors

### Constructor

```ts
new MediaExpanded(): MediaExpanded;
```

Defined in: [website/components/media/MediaExpanded.tsx:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L40)

#### Returns

`MediaExpanded`

#### Overrides

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`constructor`](../../../../../core/Component/classes/BaseComponent.md#constructor)

## Properties

### \_componentStyles

```ts
protected _componentStyles: string;
```

Defined in: [core/Component.ts:70](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L70)

`?inline` SCSS text injected once per shadow root.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`_componentStyles`](../../../../../core/Component/classes/BaseComponent.md#_componentstyles)

***

### \_eventDisposers

```ts
protected _eventDisposers: () => void[] = [];
```

Defined in: [core/Component.ts:77](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L77)

Disposers for listeners added via addScopedListener(). Drained in
disconnectedCallback so elements never leak listeners across mounts —
critical for elements that move in the DOM (carousel reorder, route swap).

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`_eventDisposers`](../../../../../core/Component/classes/BaseComponent.md#_eventdisposers)

***

### \_storeUnsubscribers

```ts
protected _storeUnsubscribers: () => void[] = [];
```

Defined in: [core/Component.ts:83](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L83)

Unsubscribe callbacks from store.subscribe(). Drained on disconnect so a
detached element stops receiving store pushes and can be GC'd.

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`_storeUnsubscribers`](../../../../../core/Component/classes/BaseComponent.md#_storeunsubscribers)

***

### \_isMounted

```ts
_isMounted: boolean = false;
```

Defined in: [core/Component.ts:90](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L90)

Whether the element is currently connected. Read by the store-subscription
wrapper to skip onStoreUpdate on detached elements (a store push arriving
between disconnect and GC must not re-render into a dead shadow root).

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`_isMounted`](../../../../../core/Component/classes/BaseComponent.md#_ismounted)

***

### \_styleNode

```ts
protected _styleNode: Element | HTMLStyleElement | null = null;
```

Defined in: [core/Component.ts:93](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L93)

The `<style>` fallback node, only populated on engines without constructable stylesheets.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`_styleNode`](../../../../../core/Component/classes/BaseComponent.md#_stylenode)

***

### \_contentNode

```ts
_contentNode: Element | HTMLElement | null = null;
```

Defined in: [core/Component.ts:100](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L100)

Persistent content wrapper inside the shadow root. _updateDom swaps only
this node's children — the style mechanism stays untouched (see file
header for why that split exists).

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`_contentNode`](../../../../../core/Component/classes/BaseComponent.md#_contentnode)

***

### \_skeletonLayer

```ts
_skeletonLayer: 
  | SkeletonWebGL
  | null = null;
```

Defined in: [core/Component.ts:103](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L103)

Live WebGL skeleton layer, owned by syncSkeletonLayer()/destroySkeletonLayer().

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`_skeletonLayer`](../../../../../core/Component/classes/BaseComponent.md#_skeletonlayer)

***

### state

```ts
state: ComponentState = {};
```

Defined in: [core/Component.ts:106](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L106)

Reactive state bag — written only through setState() so updates always re-render.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`state`](../../../../../core/Component/classes/BaseComponent.md#state)

***

### isClosing

```ts
isClosing: boolean = false;
```

Defined in: [website/components/media/MediaExpanded.tsx:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L25)

***

### currentSrc

```ts
currentSrc: string = ATTR_VALUES.EMPTY;
```

Defined in: [website/components/media/MediaExpanded.tsx:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L26)

***

### \_closeBtn

```ts
_closeBtn: 
  | {
  destroy: void;
}
  | null = null;
```

Defined in: [website/components/media/MediaExpanded.tsx:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L27)

***

### onbeforexrselect

```ts
onbeforexrselect: ((this, ev) => any) | null;
```

Defined in: node\_modules/@types/webxr/index.d.ts:1237

An XRSessionEvent of type beforexrselect is dispatched on the DOM overlay
element before generating a WebXR selectstart input event if the -Z axis
of the input source's targetRaySpace intersects the DOM overlay element
at the time the input device's primary action is triggered.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onbeforexrselect`](../../../../../core/Component/classes/BaseComponent.md#onbeforexrselect)

***

### ariaActiveDescendantElement

```ts
ariaActiveDescendantElement: Element | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3242

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaActiveDescendantElement)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaActiveDescendantElement`](../../../../../core/Component/classes/BaseComponent.md#ariaactivedescendantelement)

***

### ariaAtomic

```ts
ariaAtomic: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3244

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaAtomic)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaAtomic`](../../../../../core/Component/classes/BaseComponent.md#ariaatomic)

***

### ariaAutoComplete

```ts
ariaAutoComplete: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3246

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaAutoComplete)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaAutoComplete`](../../../../../core/Component/classes/BaseComponent.md#ariaautocomplete)

***

### ariaBrailleLabel

```ts
ariaBrailleLabel: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3248

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaBrailleLabel)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaBrailleLabel`](../../../../../core/Component/classes/BaseComponent.md#ariabraillelabel)

***

### ariaBrailleRoleDescription

```ts
ariaBrailleRoleDescription: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3250

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaBrailleRoleDescription)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaBrailleRoleDescription`](../../../../../core/Component/classes/BaseComponent.md#ariabrailleroledescription)

***

### ariaBusy

```ts
ariaBusy: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3252

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaBusy)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaBusy`](../../../../../core/Component/classes/BaseComponent.md#ariabusy)

***

### ariaChecked

```ts
ariaChecked: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3254

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaChecked)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaChecked`](../../../../../core/Component/classes/BaseComponent.md#ariachecked)

***

### ariaColCount

```ts
ariaColCount: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3256

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaColCount)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaColCount`](../../../../../core/Component/classes/BaseComponent.md#ariacolcount)

***

### ariaColIndex

```ts
ariaColIndex: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3258

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaColIndex)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaColIndex`](../../../../../core/Component/classes/BaseComponent.md#ariacolindex)

***

### ariaColIndexText

```ts
ariaColIndexText: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3260

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaColIndexText)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaColIndexText`](../../../../../core/Component/classes/BaseComponent.md#ariacolindextext)

***

### ariaColSpan

```ts
ariaColSpan: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3262

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaColSpan)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaColSpan`](../../../../../core/Component/classes/BaseComponent.md#ariacolspan)

***

### ariaControlsElements

```ts
ariaControlsElements: readonly Element[] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3264

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaControlsElements)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaControlsElements`](../../../../../core/Component/classes/BaseComponent.md#ariacontrolselements)

***

### ariaCurrent

```ts
ariaCurrent: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3266

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaCurrent)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaCurrent`](../../../../../core/Component/classes/BaseComponent.md#ariacurrent)

***

### ariaDescribedByElements

```ts
ariaDescribedByElements: readonly Element[] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3268

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaDescribedByElements)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaDescribedByElements`](../../../../../core/Component/classes/BaseComponent.md#ariadescribedbyelements)

***

### ariaDescription

```ts
ariaDescription: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3270

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaDescription)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaDescription`](../../../../../core/Component/classes/BaseComponent.md#ariadescription)

***

### ariaDetailsElements

```ts
ariaDetailsElements: readonly Element[] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3272

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaDetailsElements)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaDetailsElements`](../../../../../core/Component/classes/BaseComponent.md#ariadetailselements)

***

### ariaDisabled

```ts
ariaDisabled: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3274

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaDisabled)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaDisabled`](../../../../../core/Component/classes/BaseComponent.md#ariadisabled)

***

### ariaErrorMessageElements

```ts
ariaErrorMessageElements: readonly Element[] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3276

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaErrorMessageElements)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaErrorMessageElements`](../../../../../core/Component/classes/BaseComponent.md#ariaerrormessageelements)

***

### ariaExpanded

```ts
ariaExpanded: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3278

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaExpanded)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaExpanded`](../../../../../core/Component/classes/BaseComponent.md#ariaexpanded)

***

### ariaFlowToElements

```ts
ariaFlowToElements: readonly Element[] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3280

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaFlowToElements)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaFlowToElements`](../../../../../core/Component/classes/BaseComponent.md#ariaflowtoelements)

***

### ariaHasPopup

```ts
ariaHasPopup: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3282

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaHasPopup)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaHasPopup`](../../../../../core/Component/classes/BaseComponent.md#ariahaspopup)

***

### ariaHidden

```ts
ariaHidden: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3284

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaHidden)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaHidden`](../../../../../core/Component/classes/BaseComponent.md#ariahidden)

***

### ariaInvalid

```ts
ariaInvalid: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3286

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaInvalid)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaInvalid`](../../../../../core/Component/classes/BaseComponent.md#ariainvalid)

***

### ariaKeyShortcuts

```ts
ariaKeyShortcuts: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3288

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaKeyShortcuts)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaKeyShortcuts`](../../../../../core/Component/classes/BaseComponent.md#ariakeyshortcuts)

***

### ariaLabel

```ts
ariaLabel: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3290

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaLabel)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaLabel`](../../../../../core/Component/classes/BaseComponent.md#arialabel)

***

### ariaLabelledByElements

```ts
ariaLabelledByElements: readonly Element[] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3292

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaLabelledByElements)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaLabelledByElements`](../../../../../core/Component/classes/BaseComponent.md#arialabelledbyelements)

***

### ariaLevel

```ts
ariaLevel: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3294

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaLevel)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaLevel`](../../../../../core/Component/classes/BaseComponent.md#arialevel)

***

### ariaLive

```ts
ariaLive: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3296

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaLive)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaLive`](../../../../../core/Component/classes/BaseComponent.md#arialive)

***

### ariaModal

```ts
ariaModal: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3298

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaModal)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaModal`](../../../../../core/Component/classes/BaseComponent.md#ariamodal)

***

### ariaMultiLine

```ts
ariaMultiLine: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3300

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaMultiLine)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaMultiLine`](../../../../../core/Component/classes/BaseComponent.md#ariamultiline)

***

### ariaMultiSelectable

```ts
ariaMultiSelectable: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3302

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaMultiSelectable)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaMultiSelectable`](../../../../../core/Component/classes/BaseComponent.md#ariamultiselectable)

***

### ariaOrientation

```ts
ariaOrientation: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3304

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaOrientation)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaOrientation`](../../../../../core/Component/classes/BaseComponent.md#ariaorientation)

***

### ariaOwnsElements

```ts
ariaOwnsElements: readonly Element[] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3306

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaOwnsElements)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaOwnsElements`](../../../../../core/Component/classes/BaseComponent.md#ariaownselements)

***

### ariaPlaceholder

```ts
ariaPlaceholder: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3308

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaPlaceholder)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaPlaceholder`](../../../../../core/Component/classes/BaseComponent.md#ariaplaceholder)

***

### ariaPosInSet

```ts
ariaPosInSet: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3310

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaPosInSet)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaPosInSet`](../../../../../core/Component/classes/BaseComponent.md#ariaposinset)

***

### ariaPressed

```ts
ariaPressed: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3312

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaPressed)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaPressed`](../../../../../core/Component/classes/BaseComponent.md#ariapressed)

***

### ariaReadOnly

```ts
ariaReadOnly: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3314

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaReadOnly)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaReadOnly`](../../../../../core/Component/classes/BaseComponent.md#ariareadonly)

***

### ariaRelevant

```ts
ariaRelevant: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3316

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRelevant)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaRelevant`](../../../../../core/Component/classes/BaseComponent.md#ariarelevant)

***

### ariaRequired

```ts
ariaRequired: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3318

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRequired)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaRequired`](../../../../../core/Component/classes/BaseComponent.md#ariarequired)

***

### ariaRoleDescription

```ts
ariaRoleDescription: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3320

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRoleDescription)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaRoleDescription`](../../../../../core/Component/classes/BaseComponent.md#ariaroledescription)

***

### ariaRowCount

```ts
ariaRowCount: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3322

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRowCount)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaRowCount`](../../../../../core/Component/classes/BaseComponent.md#ariarowcount)

***

### ariaRowIndex

```ts
ariaRowIndex: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3324

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRowIndex)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaRowIndex`](../../../../../core/Component/classes/BaseComponent.md#ariarowindex)

***

### ariaRowIndexText

```ts
ariaRowIndexText: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3326

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRowIndexText)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaRowIndexText`](../../../../../core/Component/classes/BaseComponent.md#ariarowindextext)

***

### ariaRowSpan

```ts
ariaRowSpan: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3328

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRowSpan)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaRowSpan`](../../../../../core/Component/classes/BaseComponent.md#ariarowspan)

***

### ariaSelected

```ts
ariaSelected: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3330

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaSelected)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaSelected`](../../../../../core/Component/classes/BaseComponent.md#ariaselected)

***

### ariaSetSize

```ts
ariaSetSize: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3332

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaSetSize)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaSetSize`](../../../../../core/Component/classes/BaseComponent.md#ariasetsize)

***

### ariaSort

```ts
ariaSort: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3334

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaSort)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaSort`](../../../../../core/Component/classes/BaseComponent.md#ariasort)

***

### ariaValueMax

```ts
ariaValueMax: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3336

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaValueMax)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaValueMax`](../../../../../core/Component/classes/BaseComponent.md#ariavaluemax)

***

### ariaValueMin

```ts
ariaValueMin: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3338

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaValueMin)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaValueMin`](../../../../../core/Component/classes/BaseComponent.md#ariavaluemin)

***

### ariaValueNow

```ts
ariaValueNow: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3340

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaValueNow)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaValueNow`](../../../../../core/Component/classes/BaseComponent.md#ariavaluenow)

***

### ariaValueText

```ts
ariaValueText: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3342

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaValueText)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ariaValueText`](../../../../../core/Component/classes/BaseComponent.md#ariavaluetext)

***

### role

```ts
role: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3344

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/role)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`role`](../../../../../core/Component/classes/BaseComponent.md#role)

***

### attributes

```ts
readonly attributes: NamedNodeMap;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13514

The **`Element.attributes`** property returns a live collection of all attribute nodes registered to the specified node. It is a NamedNodeMap, not an Array, so it has no Array methods and the Attr nodes' indexes may differ among browsers. To be more specific, attributes is a key/value pair of strings that represents any information regarding that attribute.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/attributes)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`attributes`](../../../../../core/Component/classes/BaseComponent.md#attributes)

***

### className

```ts
className: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13527

The **`className`** property of the Element interface gets and sets the value of the class attribute of the specified element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/className)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`className`](../../../../../core/Component/classes/BaseComponent.md#classname)

***

### clientHeight

```ts
readonly clientHeight: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13533

The **`clientHeight`** read-only property of the Element interface is zero for elements with no CSS or inline layout boxes; otherwise, it's the inner height of an element in pixels. It includes padding but excludes borders, margins, and horizontal scrollbars (if present).

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/clientHeight)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`clientHeight`](../../../../../core/Component/classes/BaseComponent.md#clientheight)

***

### clientLeft

```ts
readonly clientLeft: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13539

The **`clientLeft`** read-only property of the Element interface returns the width of the left border of an element in pixels. It includes the width of the vertical scrollbar if the text direction of the element is right-to-left and if there is an overflow causing a left vertical scrollbar to be rendered. clientLeft does not include the left margin or the left padding.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/clientLeft)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`clientLeft`](../../../../../core/Component/classes/BaseComponent.md#clientleft)

***

### clientTop

```ts
readonly clientTop: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13545

The **`clientTop`** read-only property of the Element interface returns the width of the top border of an element in pixels.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/clientTop)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`clientTop`](../../../../../core/Component/classes/BaseComponent.md#clienttop)

***

### clientWidth

```ts
readonly clientWidth: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13551

The **`clientWidth`** read-only property of the Element interface is zero for inline elements and elements with no CSS; otherwise, it's the inner width of an element in pixels. It includes padding but excludes borders, margins, and vertical scrollbars (if present).

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/clientWidth)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`clientWidth`](../../../../../core/Component/classes/BaseComponent.md#clientwidth)

***

### currentCSSZoom

```ts
readonly currentCSSZoom: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13557

The **`currentCSSZoom`** read-only property of the Element interface provides the "effective" CSS zoom of an element, taking into account the zoom applied to the element and all its parent elements.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/currentCSSZoom)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`currentCSSZoom`](../../../../../core/Component/classes/BaseComponent.md#currentcsszoom)

***

### customElementRegistry

```ts
readonly customElementRegistry: CustomElementRegistry | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13558

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`customElementRegistry`](../../../../../core/Component/classes/BaseComponent.md#customelementregistry)

***

### id

```ts
id: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13564

The **`id`** property of the Element interface represents the element's identifier, reflecting the id global attribute.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/id)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`id`](../../../../../core/Component/classes/BaseComponent.md#id)

***

### innerHTML

```ts
innerHTML: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13570

The **`innerHTML`** property of the Element interface gets or sets the HTML or XML markup contained within the element, omitting any shadow roots in both cases.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/innerHTML)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`innerHTML`](../../../../../core/Component/classes/BaseComponent.md#innerhtml)

***

### localName

```ts
readonly localName: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13576

The **`Element.localName`** read-only property returns the local part of the qualified name of an element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/localName)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`localName`](../../../../../core/Component/classes/BaseComponent.md#localname)

***

### namespaceURI

```ts
readonly namespaceURI: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13582

The **`Element.namespaceURI`** read-only property returns the namespace URI of the element, or null if the element is not in a namespace.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/namespaceURI)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`namespaceURI`](../../../../../core/Component/classes/BaseComponent.md#namespaceuri)

***

### onfullscreenchange

```ts
onfullscreenchange: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13584

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/fullscreenchange_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onfullscreenchange`](../../../../../core/Component/classes/BaseComponent.md#onfullscreenchange)

***

### onfullscreenerror

```ts
onfullscreenerror: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13586

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/fullscreenerror_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onfullscreenerror`](../../../../../core/Component/classes/BaseComponent.md#onfullscreenerror)

***

### outerHTML

```ts
outerHTML: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13592

The **`outerHTML`** attribute of the Element interface gets or sets the HTML or XML markup of the element and its descendants, omitting any shadow roots in both cases.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/outerHTML)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`outerHTML`](../../../../../core/Component/classes/BaseComponent.md#outerhtml)

***

### ownerDocument

```ts
readonly ownerDocument: Document;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13593

The read-only **`ownerDocument`** property of the Node interface returns the top-level document object of the node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/ownerDocument)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ownerDocument`](../../../../../core/Component/classes/BaseComponent.md#ownerdocument)

***

### prefix

```ts
readonly prefix: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13606

The **`Element.prefix`** read-only property returns the namespace prefix of the specified element, or null if no prefix is specified.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/prefix)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`prefix`](../../../../../core/Component/classes/BaseComponent.md#prefix)

***

### scrollHeight

```ts
readonly scrollHeight: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13612

The **`scrollHeight`** read-only property of the Element interface is a measurement of the height of an element's content, including content not visible on the screen due to overflow.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollHeight)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`scrollHeight`](../../../../../core/Component/classes/BaseComponent.md#scrollheight)

***

### scrollLeft

```ts
scrollLeft: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13618

The **`scrollLeft`** property of the Element interface gets or sets the number of pixels by which an element's content is scrolled from its left edge. This value is subpixel precise in modern browsers, meaning that it isn't necessarily a whole number.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollLeft)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`scrollLeft`](../../../../../core/Component/classes/BaseComponent.md#scrollleft)

***

### scrollTop

```ts
scrollTop: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13624

The **`scrollTop`** property of the Element interface gets or sets the number of pixels by which an element's content is scrolled from its top edge. This value is subpixel precise in modern browsers, meaning that it isn't necessarily a whole number.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollTop)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`scrollTop`](../../../../../core/Component/classes/BaseComponent.md#scrolltop)

***

### scrollWidth

```ts
readonly scrollWidth: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13630

The **`scrollWidth`** read-only property of the Element interface is a measurement of the width of an element's content, including content not visible on the screen due to overflow.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollWidth)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`scrollWidth`](../../../../../core/Component/classes/BaseComponent.md#scrollwidth)

***

### shadowRoot

```ts
readonly shadowRoot: ShadowRoot | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13636

The **`Element.shadowRoot`** read-only property represents the shadow root hosted by the element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/shadowRoot)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`shadowRoot`](../../../../../core/Component/classes/BaseComponent.md#shadowroot)

***

### slot

```ts
slot: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13642

The **`slot`** property of the Element interface returns the name of the shadow DOM slot the element is inserted in.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/slot)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`slot`](../../../../../core/Component/classes/BaseComponent.md#slot)

***

### tagName

```ts
readonly tagName: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13648

The **`tagName`** read-only property of the Element interface returns the tag name of the element on which it's called.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/tagName)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`tagName`](../../../../../core/Component/classes/BaseComponent.md#tagname)

***

### attributeStyleMap

```ts
readonly attributeStyleMap: StylePropertyMap;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13928

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/attributeStyleMap)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`attributeStyleMap`](../../../../../core/Component/classes/BaseComponent.md#attributestylemap)

***

### contentEditable

```ts
contentEditable: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13936

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/contentEditable)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`contentEditable`](../../../../../core/Component/classes/BaseComponent.md#contenteditable)

***

### enterKeyHint

```ts
enterKeyHint: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13938

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/enterKeyHint)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`enterKeyHint`](../../../../../core/Component/classes/BaseComponent.md#enterkeyhint)

***

### inputMode

```ts
inputMode: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13940

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/inputMode)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`inputMode`](../../../../../core/Component/classes/BaseComponent.md#inputmode)

***

### isContentEditable

```ts
readonly isContentEditable: boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13942

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/isContentEditable)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`isContentEditable`](../../../../../core/Component/classes/BaseComponent.md#iscontenteditable)

***

### onabort

```ts
onabort: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16764

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/abort_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onabort`](../../../../../core/Component/classes/BaseComponent.md#onabort)

***

### onanimationcancel

```ts
onanimationcancel: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16766

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationcancel_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onanimationcancel`](../../../../../core/Component/classes/BaseComponent.md#onanimationcancel)

***

### onanimationend

```ts
onanimationend: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16768

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationend_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onanimationend`](../../../../../core/Component/classes/BaseComponent.md#onanimationend)

***

### onanimationiteration

```ts
onanimationiteration: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16770

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationiteration_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onanimationiteration`](../../../../../core/Component/classes/BaseComponent.md#onanimationiteration)

***

### onanimationstart

```ts
onanimationstart: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16772

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationstart_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onanimationstart`](../../../../../core/Component/classes/BaseComponent.md#onanimationstart)

***

### onauxclick

```ts
onauxclick: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16774

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/auxclick_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onauxclick`](../../../../../core/Component/classes/BaseComponent.md#onauxclick)

***

### onbeforeinput

```ts
onbeforeinput: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16776

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/beforeinput_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onbeforeinput`](../../../../../core/Component/classes/BaseComponent.md#onbeforeinput)

***

### onbeforematch

```ts
onbeforematch: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16778

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/beforematch_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onbeforematch`](../../../../../core/Component/classes/BaseComponent.md#onbeforematch)

***

### onbeforetoggle

```ts
onbeforetoggle: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16780

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/beforetoggle_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onbeforetoggle`](../../../../../core/Component/classes/BaseComponent.md#onbeforetoggle)

***

### onblur

```ts
onblur: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16782

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/blur_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onblur`](../../../../../core/Component/classes/BaseComponent.md#onblur)

***

### oncancel

```ts
oncancel: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16784

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/cancel_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`oncancel`](../../../../../core/Component/classes/BaseComponent.md#oncancel)

***

### oncanplay

```ts
oncanplay: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16786

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/canplay_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`oncanplay`](../../../../../core/Component/classes/BaseComponent.md#oncanplay)

***

### oncanplaythrough

```ts
oncanplaythrough: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16788

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/canplaythrough_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`oncanplaythrough`](../../../../../core/Component/classes/BaseComponent.md#oncanplaythrough)

***

### onchange

```ts
onchange: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16790

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/change_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onchange`](../../../../../core/Component/classes/BaseComponent.md#onchange)

***

### onclick

```ts
onclick: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16792

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/click_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onclick`](../../../../../core/Component/classes/BaseComponent.md#onclick)

***

### onclose

```ts
onclose: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16794

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/close_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onclose`](../../../../../core/Component/classes/BaseComponent.md#onclose)

***

### oncommand

```ts
oncommand: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16796

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/command_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`oncommand`](../../../../../core/Component/classes/BaseComponent.md#oncommand)

***

### oncontextlost

```ts
oncontextlost: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16798

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/contextlost_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`oncontextlost`](../../../../../core/Component/classes/BaseComponent.md#oncontextlost)

***

### oncontextmenu

```ts
oncontextmenu: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16800

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/contextmenu_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`oncontextmenu`](../../../../../core/Component/classes/BaseComponent.md#oncontextmenu)

***

### oncontextrestored

```ts
oncontextrestored: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16802

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/contextrestored_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`oncontextrestored`](../../../../../core/Component/classes/BaseComponent.md#oncontextrestored)

***

### oncopy

```ts
oncopy: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16804

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/copy_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`oncopy`](../../../../../core/Component/classes/BaseComponent.md#oncopy)

***

### oncuechange

```ts
oncuechange: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16806

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTrackElement/cuechange_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`oncuechange`](../../../../../core/Component/classes/BaseComponent.md#oncuechange)

***

### oncut

```ts
oncut: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16808

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/cut_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`oncut`](../../../../../core/Component/classes/BaseComponent.md#oncut)

***

### ondblclick

```ts
ondblclick: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16810

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/dblclick_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ondblclick`](../../../../../core/Component/classes/BaseComponent.md#ondblclick)

***

### ondrag

```ts
ondrag: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16812

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/drag_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ondrag`](../../../../../core/Component/classes/BaseComponent.md#ondrag)

***

### ondragend

```ts
ondragend: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16814

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragend_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ondragend`](../../../../../core/Component/classes/BaseComponent.md#ondragend)

***

### ondragenter

```ts
ondragenter: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16816

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragenter_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ondragenter`](../../../../../core/Component/classes/BaseComponent.md#ondragenter)

***

### ondragleave

```ts
ondragleave: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16818

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragleave_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ondragleave`](../../../../../core/Component/classes/BaseComponent.md#ondragleave)

***

### ondragover

```ts
ondragover: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16820

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragover_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ondragover`](../../../../../core/Component/classes/BaseComponent.md#ondragover)

***

### ondragstart

```ts
ondragstart: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16822

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragstart_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ondragstart`](../../../../../core/Component/classes/BaseComponent.md#ondragstart)

***

### ondrop

```ts
ondrop: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16824

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/drop_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ondrop`](../../../../../core/Component/classes/BaseComponent.md#ondrop)

***

### ondurationchange

```ts
ondurationchange: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16826

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/durationchange_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ondurationchange`](../../../../../core/Component/classes/BaseComponent.md#ondurationchange)

***

### onemptied

```ts
onemptied: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16828

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/emptied_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onemptied`](../../../../../core/Component/classes/BaseComponent.md#onemptied)

***

### onended

```ts
onended: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16830

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/ended_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onended`](../../../../../core/Component/classes/BaseComponent.md#onended)

***

### onerror

```ts
onerror: OnErrorEventHandler;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16832

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/error_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onerror`](../../../../../core/Component/classes/BaseComponent.md#onerror)

***

### onfocus

```ts
onfocus: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16834

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/focus_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onfocus`](../../../../../core/Component/classes/BaseComponent.md#onfocus)

***

### onformdata

```ts
onformdata: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16836

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/formdata_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onformdata`](../../../../../core/Component/classes/BaseComponent.md#onformdata)

***

### ongotpointercapture

```ts
ongotpointercapture: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16838

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/gotpointercapture_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ongotpointercapture`](../../../../../core/Component/classes/BaseComponent.md#ongotpointercapture)

***

### oninput

```ts
oninput: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16840

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/input_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`oninput`](../../../../../core/Component/classes/BaseComponent.md#oninput)

***

### oninvalid

```ts
oninvalid: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16842

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/invalid_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`oninvalid`](../../../../../core/Component/classes/BaseComponent.md#oninvalid)

***

### onkeydown

```ts
onkeydown: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16844

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/keydown_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onkeydown`](../../../../../core/Component/classes/BaseComponent.md#onkeydown)

***

### ~~onkeypress~~

```ts
onkeypress: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16850

#### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/keypress_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onkeypress`](../../../../../core/Component/classes/BaseComponent.md#onkeypress)

***

### onkeyup

```ts
onkeyup: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16852

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/keyup_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onkeyup`](../../../../../core/Component/classes/BaseComponent.md#onkeyup)

***

### onload

```ts
onload: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16854

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/load_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onload`](../../../../../core/Component/classes/BaseComponent.md#onload)

***

### onloadeddata

```ts
onloadeddata: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16856

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadeddata_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onloadeddata`](../../../../../core/Component/classes/BaseComponent.md#onloadeddata)

***

### onloadedmetadata

```ts
onloadedmetadata: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16858

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadedmetadata_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onloadedmetadata`](../../../../../core/Component/classes/BaseComponent.md#onloadedmetadata)

***

### onloadstart

```ts
onloadstart: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16860

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadstart_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onloadstart`](../../../../../core/Component/classes/BaseComponent.md#onloadstart)

***

### onlostpointercapture

```ts
onlostpointercapture: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16862

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/lostpointercapture_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onlostpointercapture`](../../../../../core/Component/classes/BaseComponent.md#onlostpointercapture)

***

### onmousedown

```ts
onmousedown: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16864

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mousedown_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onmousedown`](../../../../../core/Component/classes/BaseComponent.md#onmousedown)

***

### onmouseenter

```ts
onmouseenter: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16866

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseenter_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onmouseenter`](../../../../../core/Component/classes/BaseComponent.md#onmouseenter)

***

### onmouseleave

```ts
onmouseleave: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16868

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseleave_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onmouseleave`](../../../../../core/Component/classes/BaseComponent.md#onmouseleave)

***

### onmousemove

```ts
onmousemove: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16870

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mousemove_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onmousemove`](../../../../../core/Component/classes/BaseComponent.md#onmousemove)

***

### onmouseout

```ts
onmouseout: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16872

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseout_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onmouseout`](../../../../../core/Component/classes/BaseComponent.md#onmouseout)

***

### onmouseover

```ts
onmouseover: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16874

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseover_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onmouseover`](../../../../../core/Component/classes/BaseComponent.md#onmouseover)

***

### onmouseup

```ts
onmouseup: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16876

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseup_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onmouseup`](../../../../../core/Component/classes/BaseComponent.md#onmouseup)

***

### onpaste

```ts
onpaste: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16878

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/paste_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onpaste`](../../../../../core/Component/classes/BaseComponent.md#onpaste)

***

### onpause

```ts
onpause: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16880

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/pause_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onpause`](../../../../../core/Component/classes/BaseComponent.md#onpause)

***

### onplay

```ts
onplay: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16882

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/play_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onplay`](../../../../../core/Component/classes/BaseComponent.md#onplay)

***

### onplaying

```ts
onplaying: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16884

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/playing_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onplaying`](../../../../../core/Component/classes/BaseComponent.md#onplaying)

***

### onpointercancel

```ts
onpointercancel: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16886

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointercancel_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onpointercancel`](../../../../../core/Component/classes/BaseComponent.md#onpointercancel)

***

### onpointerdown

```ts
onpointerdown: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16888

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerdown_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onpointerdown`](../../../../../core/Component/classes/BaseComponent.md#onpointerdown)

***

### onpointerenter

```ts
onpointerenter: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16890

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerenter_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onpointerenter`](../../../../../core/Component/classes/BaseComponent.md#onpointerenter)

***

### onpointerleave

```ts
onpointerleave: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16892

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerleave_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onpointerleave`](../../../../../core/Component/classes/BaseComponent.md#onpointerleave)

***

### onpointermove

```ts
onpointermove: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16894

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointermove_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onpointermove`](../../../../../core/Component/classes/BaseComponent.md#onpointermove)

***

### onpointerout

```ts
onpointerout: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16896

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerout_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onpointerout`](../../../../../core/Component/classes/BaseComponent.md#onpointerout)

***

### onpointerover

```ts
onpointerover: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16898

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerover_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onpointerover`](../../../../../core/Component/classes/BaseComponent.md#onpointerover)

***

### onpointerrawupdate

```ts
onpointerrawupdate: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16904

Available only in secure contexts.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerrawupdate_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onpointerrawupdate`](../../../../../core/Component/classes/BaseComponent.md#onpointerrawupdate)

***

### onpointerup

```ts
onpointerup: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16906

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerup_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onpointerup`](../../../../../core/Component/classes/BaseComponent.md#onpointerup)

***

### onprogress

```ts
onprogress: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16908

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/progress_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onprogress`](../../../../../core/Component/classes/BaseComponent.md#onprogress)

***

### onratechange

```ts
onratechange: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16910

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/ratechange_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onratechange`](../../../../../core/Component/classes/BaseComponent.md#onratechange)

***

### onreset

```ts
onreset: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16912

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/reset_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onreset`](../../../../../core/Component/classes/BaseComponent.md#onreset)

***

### onresize

```ts
onresize: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16914

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement/resize_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onresize`](../../../../../core/Component/classes/BaseComponent.md#onresize)

***

### onscroll

```ts
onscroll: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16916

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/scroll_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onscroll`](../../../../../core/Component/classes/BaseComponent.md#onscroll)

***

### onscrollend

```ts
onscrollend: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16918

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/scrollend_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onscrollend`](../../../../../core/Component/classes/BaseComponent.md#onscrollend)

***

### onsecuritypolicyviolation

```ts
onsecuritypolicyviolation: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16920

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/securitypolicyviolation_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onsecuritypolicyviolation`](../../../../../core/Component/classes/BaseComponent.md#onsecuritypolicyviolation)

***

### onseeked

```ts
onseeked: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16922

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/seeked_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onseeked`](../../../../../core/Component/classes/BaseComponent.md#onseeked)

***

### onseeking

```ts
onseeking: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16924

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/seeking_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onseeking`](../../../../../core/Component/classes/BaseComponent.md#onseeking)

***

### onselect

```ts
onselect: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16926

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/select_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onselect`](../../../../../core/Component/classes/BaseComponent.md#onselect)

***

### onselectionchange

```ts
onselectionchange: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16928

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/selectionchange_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onselectionchange`](../../../../../core/Component/classes/BaseComponent.md#onselectionchange)

***

### onselectstart

```ts
onselectstart: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16930

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/selectstart_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onselectstart`](../../../../../core/Component/classes/BaseComponent.md#onselectstart)

***

### onslotchange

```ts
onslotchange: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16932

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSlotElement/slotchange_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onslotchange`](../../../../../core/Component/classes/BaseComponent.md#onslotchange)

***

### onstalled

```ts
onstalled: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16934

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/stalled_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onstalled`](../../../../../core/Component/classes/BaseComponent.md#onstalled)

***

### onsubmit

```ts
onsubmit: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16936

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/submit_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onsubmit`](../../../../../core/Component/classes/BaseComponent.md#onsubmit)

***

### onsuspend

```ts
onsuspend: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16938

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/suspend_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onsuspend`](../../../../../core/Component/classes/BaseComponent.md#onsuspend)

***

### ontimeupdate

```ts
ontimeupdate: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16940

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/timeupdate_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ontimeupdate`](../../../../../core/Component/classes/BaseComponent.md#ontimeupdate)

***

### ontoggle

```ts
ontoggle: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16942

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/toggle_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ontoggle`](../../../../../core/Component/classes/BaseComponent.md#ontoggle)

***

### ontouchcancel?

```ts
optional ontouchcancel?: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16944

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchcancel_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ontouchcancel`](../../../../../core/Component/classes/BaseComponent.md#ontouchcancel)

***

### ontouchend?

```ts
optional ontouchend?: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16946

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchend_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ontouchend`](../../../../../core/Component/classes/BaseComponent.md#ontouchend)

***

### ontouchmove?

```ts
optional ontouchmove?: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16948

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchmove_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ontouchmove`](../../../../../core/Component/classes/BaseComponent.md#ontouchmove)

***

### ontouchstart?

```ts
optional ontouchstart?: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16950

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchstart_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ontouchstart`](../../../../../core/Component/classes/BaseComponent.md#ontouchstart)

***

### ontransitioncancel

```ts
ontransitioncancel: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16952

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitioncancel_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ontransitioncancel`](../../../../../core/Component/classes/BaseComponent.md#ontransitioncancel)

***

### ontransitionend

```ts
ontransitionend: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16954

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionend_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ontransitionend`](../../../../../core/Component/classes/BaseComponent.md#ontransitionend)

***

### ontransitionrun

```ts
ontransitionrun: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16956

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionrun_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ontransitionrun`](../../../../../core/Component/classes/BaseComponent.md#ontransitionrun)

***

### ontransitionstart

```ts
ontransitionstart: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16958

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionstart_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ontransitionstart`](../../../../../core/Component/classes/BaseComponent.md#ontransitionstart)

***

### onvolumechange

```ts
onvolumechange: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16960

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/volumechange_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onvolumechange`](../../../../../core/Component/classes/BaseComponent.md#onvolumechange)

***

### onwaiting

```ts
onwaiting: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16962

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/waiting_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onwaiting`](../../../../../core/Component/classes/BaseComponent.md#onwaiting)

***

### ~~onwebkitanimationend~~

```ts
onwebkitanimationend: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16968

#### Deprecated

This is a legacy alias of `onanimationend`.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationend_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onwebkitanimationend`](../../../../../core/Component/classes/BaseComponent.md#onwebkitanimationend)

***

### ~~onwebkitanimationiteration~~

```ts
onwebkitanimationiteration: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16974

#### Deprecated

This is a legacy alias of `onanimationiteration`.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationiteration_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onwebkitanimationiteration`](../../../../../core/Component/classes/BaseComponent.md#onwebkitanimationiteration)

***

### ~~onwebkitanimationstart~~

```ts
onwebkitanimationstart: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16980

#### Deprecated

This is a legacy alias of `onanimationstart`.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationstart_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onwebkitanimationstart`](../../../../../core/Component/classes/BaseComponent.md#onwebkitanimationstart)

***

### ~~onwebkittransitionend~~

```ts
onwebkittransitionend: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16986

#### Deprecated

This is a legacy alias of `ontransitionend`.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionend_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onwebkittransitionend`](../../../../../core/Component/classes/BaseComponent.md#onwebkittransitionend)

***

### onwheel

```ts
onwheel: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16988

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/wheel_event)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onwheel`](../../../../../core/Component/classes/BaseComponent.md#onwheel)

***

### accessKey

```ts
accessKey: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17735

The **`HTMLElement.accessKey`** property sets the keystroke which a user can press to jump to a given element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/accessKey)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`accessKey`](../../../../../core/Component/classes/BaseComponent.md#accesskey)

***

### accessKeyLabel

```ts
readonly accessKeyLabel: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17741

The **`HTMLElement.accessKeyLabel`** read-only property returns a string containing the element's browser-assigned access key (if any); otherwise it returns an empty string.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/accessKeyLabel)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`accessKeyLabel`](../../../../../core/Component/classes/BaseComponent.md#accesskeylabel)

***

### autocapitalize

```ts
autocapitalize: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17747

The **`autocapitalize`** property of the HTMLElement interface represents the element's capitalization behavior for user input. It is available on all HTML elements, though it doesn't affect all of them, including:

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/autocapitalize)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`autocapitalize`](../../../../../core/Component/classes/BaseComponent.md#autocapitalize)

***

### autocorrect

```ts
autocorrect: boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17753

The **`autocorrect`** property of the HTMLElement interface controls whether or not autocorrection of editable text is enabled for spelling and/or punctuation errors.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/autocorrect)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`autocorrect`](../../../../../core/Component/classes/BaseComponent.md#autocorrect)

***

### dir

```ts
dir: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17759

The **`HTMLElement.dir`** property indicates the text writing directionality of the content of the current element. It reflects the element's dir attribute.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dir)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`dir`](../../../../../core/Component/classes/BaseComponent.md#dir)

***

### draggable

```ts
draggable: boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17765

The **`draggable`** property of the HTMLElement interface gets and sets a Boolean primitive indicating if the element is draggable.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/draggable)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`draggable`](../../../../../core/Component/classes/BaseComponent.md#draggable)

***

### hidden

```ts
hidden: boolean | "until-found";
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17771

The HTMLElement property **`hidden`** reflects the value of the element's hidden attribute.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/hidden)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`hidden`](../../../../../core/Component/classes/BaseComponent.md#hidden)

***

### inert

```ts
inert: boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17777

The HTMLElement property **`inert`** reflects the value of the element's inert attribute. It is a boolean value that, when present, makes the browser "ignore" user input events for the element, including focus events and events from assistive technologies. The browser may also ignore page search and text selection in the element. This can be useful when building UIs such as modals where you would want to "trap" the focus inside the modal when it's visible.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/inert)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`inert`](../../../../../core/Component/classes/BaseComponent.md#inert)

***

### innerText

```ts
innerText: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17783

The **`innerText`** property of the HTMLElement interface represents the rendered text content of a node and its descendants.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/innerText)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`innerText`](../../../../../core/Component/classes/BaseComponent.md#innertext)

***

### lang

```ts
lang: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17789

The **`lang`** property of the HTMLElement interface indicates the base language of an element's attribute values and text content, in the form of a BCP 47 language tag. It reflects the element's lang attribute; the xml:lang attribute does not affect this property.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/lang)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`lang`](../../../../../core/Component/classes/BaseComponent.md#lang)

***

### offsetHeight

```ts
readonly offsetHeight: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17795

The **`offsetHeight`** read-only property of the HTMLElement interface returns the height of an element, including vertical padding and borders, as an integer.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/offsetHeight)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`offsetHeight`](../../../../../core/Component/classes/BaseComponent.md#offsetheight)

***

### offsetLeft

```ts
readonly offsetLeft: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17801

The **`offsetLeft`** read-only property of the HTMLElement interface returns the number of pixels that the upper left corner of the current element is offset to the left within the HTMLElement.offsetParent node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/offsetLeft)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`offsetLeft`](../../../../../core/Component/classes/BaseComponent.md#offsetleft)

***

### offsetParent

```ts
readonly offsetParent: Element | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17807

The **`HTMLElement.offsetParent`** read-only property returns a reference to the element which is the closest (nearest in the containment hierarchy) positioned ancestor element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/offsetParent)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`offsetParent`](../../../../../core/Component/classes/BaseComponent.md#offsetparent)

***

### offsetTop

```ts
readonly offsetTop: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17813

The **`offsetTop`** read-only property of the HTMLElement interface returns the distance from the outer border of the current element (including its margin) to the top padding edge of the offsetParent, the closest positioned ancestor element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/offsetTop)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`offsetTop`](../../../../../core/Component/classes/BaseComponent.md#offsettop)

***

### offsetWidth

```ts
readonly offsetWidth: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17819

The **`offsetWidth`** read-only property of the HTMLElement interface returns the layout width of an element as an integer.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/offsetWidth)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`offsetWidth`](../../../../../core/Component/classes/BaseComponent.md#offsetwidth)

***

### outerText

```ts
outerText: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17825

The **`outerText`** property of the HTMLElement interface returns the same value as HTMLElement.innerText. When used as a setter it replaces the whole current node with the given text (this differs from innerText, which replaces the content inside the current node).

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/outerText)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`outerText`](../../../../../core/Component/classes/BaseComponent.md#outertext)

***

### popover

```ts
popover: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17831

The **`popover`** property of the HTMLElement interface gets and sets an element's popover state via JavaScript ("auto", "hint", or "manual"), and can be used for feature detection.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/popover)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`popover`](../../../../../core/Component/classes/BaseComponent.md#popover)

***

### spellcheck

```ts
spellcheck: boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17837

The **`spellcheck`** property of the HTMLElement interface represents a boolean value that controls the spell-checking hint. It is available on all HTML elements, though it doesn't affect all of them.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/spellcheck)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`spellcheck`](../../../../../core/Component/classes/BaseComponent.md#spellcheck)

***

### title

```ts
title: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17843

The **`HTMLElement.title`** property represents the title of the element: the text usually displayed in a 'tooltip' popup when the mouse is over the node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/title)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`title`](../../../../../core/Component/classes/BaseComponent.md#title)

***

### translate

```ts
translate: boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17849

The **`translate`** property of the HTMLElement interface indicates whether an element's attribute values and the values of its Text node children are to be translated when the page is localized, or whether to leave them unchanged.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/translate)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`translate`](../../../../../core/Component/classes/BaseComponent.md#translate)

***

### writingSuggestions

```ts
writingSuggestions: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17855

The **`writingSuggestions`** property of the HTMLElement interface is a string indicating if browser-provided writing suggestions should be enabled under the scope of the element or not.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/writingSuggestions)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`writingSuggestions`](../../../../../core/Component/classes/BaseComponent.md#writingsuggestions)

***

### autofocus

```ts
autofocus: boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:20122

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/autofocus)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`autofocus`](../../../../../core/Component/classes/BaseComponent.md#autofocus)

***

### dataset

```ts
readonly dataset: DOMStringMap;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:20124

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dataset)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`dataset`](../../../../../core/Component/classes/BaseComponent.md#dataset)

***

### nonce

```ts
nonce: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:20126

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/nonce)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`nonce`](../../../../../core/Component/classes/BaseComponent.md#nonce)

***

### tabIndex

```ts
tabIndex: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:20128

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/tabIndex)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`tabIndex`](../../../../../core/Component/classes/BaseComponent.md#tabindex)

***

### baseURI

```ts
readonly baseURI: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26041

The read-only **`baseURI`** property of the Node interface returns the absolute base URL of the document containing the node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/baseURI)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`baseURI`](../../../../../core/Component/classes/BaseComponent.md#baseuri)

***

### childNodes

```ts
readonly childNodes: NodeListOf<ChildNode>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26047

The read-only **`childNodes`** property of the Node interface returns a live NodeList of child nodes of the given element where the first child node is assigned index 0. Child nodes include elements, text and comments.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/childNodes)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`childNodes`](../../../../../core/Component/classes/BaseComponent.md#childnodes)

***

### firstChild

```ts
readonly firstChild: ChildNode | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26053

The read-only **`firstChild`** property of the Node interface returns the node's first child in the tree, or null if the node has no children.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/firstChild)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`firstChild`](../../../../../core/Component/classes/BaseComponent.md#firstchild)

***

### isConnected

```ts
readonly isConnected: boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26059

The read-only **`isConnected`** property of the Node interface returns a boolean indicating whether the node is connected (directly or indirectly) to a Document object.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/isConnected)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`isConnected`](../../../../../core/Component/classes/BaseComponent.md#isconnected)

***

### lastChild

```ts
readonly lastChild: ChildNode | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26065

The read-only **`lastChild`** property of the Node interface returns the last child of the node, or null if there are no child nodes.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/lastChild)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`lastChild`](../../../../../core/Component/classes/BaseComponent.md#lastchild)

***

### nextSibling

```ts
readonly nextSibling: ChildNode | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26071

The read-only **`nextSibling`** property of the Node interface returns the node immediately following the specified one in their parent's childNodes, or returns null if the specified node is the last child in the parent element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`nextSibling`](../../../../../core/Component/classes/BaseComponent.md#nextsibling)

***

### nodeName

```ts
readonly nodeName: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26077

The read-only **`nodeName`** property of Node returns the name of the current node as a string.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/nodeName)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`nodeName`](../../../../../core/Component/classes/BaseComponent.md#nodename)

***

### nodeType

```ts
readonly nodeType: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26083

The read-only **`nodeType`** property of a Node interface is an integer that identifies what the node is. It distinguishes different kinds of nodes from each other, such as elements, text, and comments.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/nodeType)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`nodeType`](../../../../../core/Component/classes/BaseComponent.md#nodetype)

***

### nodeValue

```ts
nodeValue: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26089

The **`nodeValue`** property of the Node interface returns or sets the value of the current node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/nodeValue)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`nodeValue`](../../../../../core/Component/classes/BaseComponent.md#nodevalue)

***

### parentElement

```ts
readonly parentElement: HTMLElement | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26101

The read-only **`parentElement`** property of Node interface returns the DOM node's parent Element, or null if the node either has no parent, or its parent isn't a DOM Element. Node.parentNode on the other hand returns any kind of parent, regardless of its type.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/parentElement)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`parentElement`](../../../../../core/Component/classes/BaseComponent.md#parentelement)

***

### parentNode

```ts
readonly parentNode: ParentNode | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26107

The read-only **`parentNode`** property of the Node interface returns the parent of the specified node in the DOM tree.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/parentNode)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`parentNode`](../../../../../core/Component/classes/BaseComponent.md#parentnode)

***

### previousSibling

```ts
readonly previousSibling: ChildNode | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26113

The read-only **`previousSibling`** property of the Node interface returns the node immediately preceding the specified one in its parent's childNodes list, or null if the specified node is the first in that list.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/previousSibling)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`previousSibling`](../../../../../core/Component/classes/BaseComponent.md#previoussibling)

***

### ELEMENT\_NODE

```ts
readonly ELEMENT_NODE: 1;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26211

node is an element.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ELEMENT_NODE`](../../../../../core/Component/classes/BaseComponent.md#element_node)

***

### ATTRIBUTE\_NODE

```ts
readonly ATTRIBUTE_NODE: 2;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26212

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ATTRIBUTE_NODE`](../../../../../core/Component/classes/BaseComponent.md#attribute_node)

***

### TEXT\_NODE

```ts
readonly TEXT_NODE: 3;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26214

node is a Text node.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`TEXT_NODE`](../../../../../core/Component/classes/BaseComponent.md#text_node)

***

### CDATA\_SECTION\_NODE

```ts
readonly CDATA_SECTION_NODE: 4;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26216

node is a CDATASection node.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`CDATA_SECTION_NODE`](../../../../../core/Component/classes/BaseComponent.md#cdata_section_node)

***

### ENTITY\_REFERENCE\_NODE

```ts
readonly ENTITY_REFERENCE_NODE: 5;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26217

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ENTITY_REFERENCE_NODE`](../../../../../core/Component/classes/BaseComponent.md#entity_reference_node)

***

### ENTITY\_NODE

```ts
readonly ENTITY_NODE: 6;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26218

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`ENTITY_NODE`](../../../../../core/Component/classes/BaseComponent.md#entity_node)

***

### PROCESSING\_INSTRUCTION\_NODE

```ts
readonly PROCESSING_INSTRUCTION_NODE: 7;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26220

node is a ProcessingInstruction node.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`PROCESSING_INSTRUCTION_NODE`](../../../../../core/Component/classes/BaseComponent.md#processing_instruction_node)

***

### COMMENT\_NODE

```ts
readonly COMMENT_NODE: 8;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26222

node is a Comment node.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`COMMENT_NODE`](../../../../../core/Component/classes/BaseComponent.md#comment_node)

***

### DOCUMENT\_NODE

```ts
readonly DOCUMENT_NODE: 9;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26224

node is a document.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`DOCUMENT_NODE`](../../../../../core/Component/classes/BaseComponent.md#document_node)

***

### DOCUMENT\_TYPE\_NODE

```ts
readonly DOCUMENT_TYPE_NODE: 10;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26226

node is a doctype.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`DOCUMENT_TYPE_NODE`](../../../../../core/Component/classes/BaseComponent.md#document_type_node)

***

### DOCUMENT\_FRAGMENT\_NODE

```ts
readonly DOCUMENT_FRAGMENT_NODE: 11;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26228

node is a DocumentFragment node.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`DOCUMENT_FRAGMENT_NODE`](../../../../../core/Component/classes/BaseComponent.md#document_fragment_node)

***

### NOTATION\_NODE

```ts
readonly NOTATION_NODE: 12;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26229

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`NOTATION_NODE`](../../../../../core/Component/classes/BaseComponent.md#notation_node)

***

### DOCUMENT\_POSITION\_DISCONNECTED

```ts
readonly DOCUMENT_POSITION_DISCONNECTED: 1;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26231

Set when node and other are not in the same tree.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`DOCUMENT_POSITION_DISCONNECTED`](../../../../../core/Component/classes/BaseComponent.md#document_position_disconnected)

***

### DOCUMENT\_POSITION\_PRECEDING

```ts
readonly DOCUMENT_POSITION_PRECEDING: 2;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26233

Set when other is preceding node.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`DOCUMENT_POSITION_PRECEDING`](../../../../../core/Component/classes/BaseComponent.md#document_position_preceding)

***

### DOCUMENT\_POSITION\_FOLLOWING

```ts
readonly DOCUMENT_POSITION_FOLLOWING: 4;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26235

Set when other is following node.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`DOCUMENT_POSITION_FOLLOWING`](../../../../../core/Component/classes/BaseComponent.md#document_position_following)

***

### DOCUMENT\_POSITION\_CONTAINS

```ts
readonly DOCUMENT_POSITION_CONTAINS: 8;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26237

Set when other is an ancestor of node.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`DOCUMENT_POSITION_CONTAINS`](../../../../../core/Component/classes/BaseComponent.md#document_position_contains)

***

### DOCUMENT\_POSITION\_CONTAINED\_BY

```ts
readonly DOCUMENT_POSITION_CONTAINED_BY: 16;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26239

Set when other is a descendant of node.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`DOCUMENT_POSITION_CONTAINED_BY`](../../../../../core/Component/classes/BaseComponent.md#document_position_contained_by)

***

### DOCUMENT\_POSITION\_IMPLEMENTATION\_SPECIFIC

```ts
readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26240

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`](../../../../../core/Component/classes/BaseComponent.md#document_position_implementation_specific)

***

### nextElementSibling

```ts
readonly nextElementSibling: Element | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26380

Returns the first following sibling that is an element, and null otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CharacterData/nextElementSibling)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`nextElementSibling`](../../../../../core/Component/classes/BaseComponent.md#nextelementsibling)

***

### previousElementSibling

```ts
readonly previousElementSibling: Element | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26386

Returns the first preceding sibling that is an element, and null otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CharacterData/previousElementSibling)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`previousElementSibling`](../../../../../core/Component/classes/BaseComponent.md#previouselementsibling)

***

### childElementCount

```ts
readonly childElementCount: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27044

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/childElementCount)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`childElementCount`](../../../../../core/Component/classes/BaseComponent.md#childelementcount)

***

### children

```ts
readonly children: HTMLCollection;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27050

Returns the child elements.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/children)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`children`](../../../../../core/Component/classes/BaseComponent.md#children)

***

### firstElementChild

```ts
readonly firstElementChild: Element | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27056

Returns the first child that is an element, and null otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/firstElementChild)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`firstElementChild`](../../../../../core/Component/classes/BaseComponent.md#firstelementchild)

***

### lastElementChild

```ts
readonly lastElementChild: Element | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27062

Returns the last child that is an element, and null otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/lastElementChild)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`lastElementChild`](../../../../../core/Component/classes/BaseComponent.md#lastelementchild)

***

### assignedSlot

```ts
readonly assignedSlot: HTMLSlotElement | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:35365

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/assignedSlot)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`assignedSlot`](../../../../../core/Component/classes/BaseComponent.md#assignedslot)

## Accessors

### observedAttributes

#### Get Signature

```ts
get static observedAttributes(): string[];
```

Defined in: [website/components/media/MediaExpanded.tsx:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L29)

##### Returns

`string`[]

***

### source

#### Get Signature

```ts
get source(): string;
```

Defined in: [website/components/media/MediaExpanded.tsx:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L46)

Full-res media URL (from the source attribute).

##### Returns

`string`

***

### thumb

#### Get Signature

```ts
get thumb(): string;
```

Defined in: [website/components/media/MediaExpanded.tsx:52](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L52)

Low-res thumbnail URL shown while the full asset loads.

##### Returns

`string`

***

### alt

#### Get Signature

```ts
get alt(): string;
```

Defined in: [website/components/media/MediaExpanded.tsx:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L58)

Alt text for the media.

##### Returns

`string`

***

### mediaWidth

#### Get Signature

```ts
get mediaWidth(): number;
```

Defined in: [website/components/media/MediaExpanded.tsx:64](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L64)

Natural media width attribute.

##### Returns

`number`

***

### mediaHeight

#### Get Signature

```ts
get mediaHeight(): number;
```

Defined in: [website/components/media/MediaExpanded.tsx:73](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L73)

Natural media height attribute.

##### Returns

`number`

***

### isVideo

#### Get Signature

```ts
get isVideo(): boolean;
```

Defined in: [website/components/media/MediaExpanded.tsx:82](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L82)

Whether the source is a video.

##### Returns

`boolean`

***

### classList

#### Get Signature

```ts
get classList(): DOMTokenList;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13520

The read-only **`classList`** property of the Element interface contains a live DOMTokenList collection representing the class attribute of the element. This can then be used to manipulate the class list.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/classList)

##### Returns

`DOMTokenList`

#### Set Signature

```ts
set classList(value): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13521

##### Parameters

###### value

`string`

##### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`classList`](../../../../../core/Component/classes/BaseComponent.md#classlist)

***

### part

#### Get Signature

```ts
get part(): DOMTokenList;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13599

The read-only **`part`** property of the Element interface contains a DOMTokenList object representing the part identifier(s) of the element. It reflects the element's part content attribute. These can be used to style parts of a shadow DOM, via the ::part pseudo-element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/part)

##### Returns

`DOMTokenList`

#### Set Signature

```ts
set part(value): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13600

##### Parameters

###### value

`string`

##### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`part`](../../../../../core/Component/classes/BaseComponent.md#part)

***

### textContent

#### Get Signature

```ts
get textContent(): string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13913

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/textContent)

##### Returns

`string`

#### Set Signature

```ts
set textContent(value): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13914

The **`textContent`** property of the Node interface represents the text content of the node and its descendants.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/textContent)

##### Parameters

###### value

`string` \| `null`

##### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`textContent`](../../../../../core/Component/classes/BaseComponent.md#textcontent)

***

### style

#### Get Signature

```ts
get style(): CSSStyleDeclaration;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13930

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/style)

##### Returns

`CSSStyleDeclaration`

#### Set Signature

```ts
set style(cssText): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13931

##### Parameters

###### cssText

`string`

##### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`style`](../../../../../core/Component/classes/BaseComponent.md#style)

## Methods

### onUpdated()?

```ts
optional onUpdated(): void;
```

Defined in: [core/Component.ts:115](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L115)

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onUpdated`](../../../../../core/Component/classes/BaseComponent.md#onupdated)

***

### onStoreUpdate()?

```ts
optional onStoreUpdate(_store): void;
```

Defined in: [core/Component.ts:116](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L116)

#### Parameters

##### \_store

`ScopedStore`

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onStoreUpdate`](../../../../../core/Component/classes/BaseComponent.md#onstoreupdate)

***

### setState()

```ts
setState(updater): void;
```

Defined in: [core/Component.ts:142](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L142)

Set partial state and re-render content (NOT styles). Accepts either a
patch object or a React-style updater function — the function form is
required when the next state derives from the previous state, since
reads of `this.state` outside the updater can race with queued renders.
The merge is a shallow spread: keys not present in `next` survive, which
lets components update one field without re-sending the whole bag.

#### Parameters

##### updater

  \| [`ComponentState`](../../../../../core/Component/type-aliases/ComponentState.md)
  \| ((`_state`) => [`ComponentState`](../../../../../core/Component/type-aliases/ComponentState.md))

Partial state patch, or (prevState) => patch.

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`setState`](../../../../../core/Component/classes/BaseComponent.md#setstate)

***

### connectedCallback()

```ts
connectedCallback(): void;
```

Defined in: [core/Component.ts:160](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L160)

DOM insertion — runs onInit (data setup), the one-time style/content
build (_renderInitial), then onMounted + onUpdated so a first render is
indistinguishable from an update, and finally registers this element
with the WebGL skeleton scanner (no-op when no skeletons are present).
Per the Custom Elements spec this callback can fire multiple times —
every branch below is written to be idempotent on re-mount.

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`connectedCallback`](../../../../../core/Component/classes/BaseComponent.md#connectedcallback)

***

### disconnectedCallback()

```ts
disconnectedCallback(): void;
```

Defined in: [core/Component.ts:176](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L176)

DOM removal — tears down in reverse order: scoped listeners, store
subscriptions, the WebGL skeleton layer for this element, then the
subclass's onDestroy (engine/audio/observer cleanup). `_isMounted` flips
first so an in-flight store push during teardown hits the guard in
subscribe() rather than rendering into a disconnecting root.

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`disconnectedCallback`](../../../../../core/Component/classes/BaseComponent.md#disconnectedcallback)

***

### $()

```ts
$<T>(selector): T | null;
```

Defined in: [core/Component.ts:192](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L192)

Safe scoped querySelector inside Shadow Root. Returns null instead of
throwing when the shadow root is absent (detached construction in tests).

#### Type Parameters

##### T

`T` *extends* `Element` = `HTMLElement`

#### Parameters

##### selector

`string`

CSS selector evaluated against this.shadowRoot.

#### Returns

`T` \| `null`

First matching element or null.

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`$`](../../../../../core/Component/classes/BaseComponent.md#_)

***

### $$()

```ts
$$<T>(selector): T[];
```

Defined in: [core/Component.ts:203](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L203)

Safe scoped querySelectorAll inside Shadow Root — materialized into a
real Array so callers get .map/.filter/forEach (NodeList lacks some
iteration methods on older engines).

#### Type Parameters

##### T

`T` *extends* `Element` = `HTMLElement`

#### Parameters

##### selector

`string`

CSS selector evaluated against this.shadowRoot.

#### Returns

`T`[]

Array of matching elements (never null).

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`$$`](../../../../../core/Component/classes/BaseComponent.md#_-1)

***

### addScopedListener()

```ts
addScopedListener(
   target, 
   event, 
   handler, 
   options?
): void;
```

Defined in: [core/Component.ts:218](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L218)

Scoped event listener with automatic lifecycle cleanup.
Prevents duplicate listeners: the DOM itself dedupes identical
(type, listener, capture) tuples per MDN addEventListener semantics, and
every registration is mirrored into _eventDisposers so disconnect removes
it even when the listener captured instance state.

#### Parameters

##### target

`EventTarget` \| `null`

EventTarget to listen on (null → no-op).

##### event

`string`

Event type token.

##### handler

`EventListenerOrEventListenerObject`

Listener callback or listener object.

##### options?

`boolean` \| `AddEventListenerOptions`

Passive/capture/once options forwarded verbatim.

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`addScopedListener`](../../../../../core/Component/classes/BaseComponent.md#addscopedlistener)

***

### subscribe()

```ts
subscribe(store): void;
```

Defined in: [core/Component.ts:239](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L239)

Subscribe to store changes with automatic lifecycle cleanup. The wrapper
gates on _isMounted: a store push landing while the element is detached
(mid-move or already removed) is dropped instead of rendering into a
dead shadow root — the next connectedCallback renders fresh state anyway.

#### Parameters

##### store

`ScopedStore` \| `null` \| `undefined`

Store-like object exposing subscribe(); null/invalid → no-op.

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`subscribe`](../../../../../core/Component/classes/BaseComponent.md#subscribe)

***

### \_renderInitial()

```ts
protected _renderInitial(): void;
```

Defined in: [core/Component.ts:257](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L257)

Initial render: injects styles ONCE and creates the content node.
Called exactly once from connectedCallback() — but on re-mount the shadow
root retains children from the previous mount, so both style and content
paths reuse existing nodes instead of duplicating them.

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`_renderInitial`](../../../../../core/Component/classes/BaseComponent.md#_renderinitial)

***

### \_updateDom()

```ts
_updateDom(): void;
```

Defined in: [core/Component.ts:324](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L324)

Update content without touching the style node.
Only the content wrapper is replaced — the <style> node
remains untouched, preventing style re-parsing and IntersectionObserver
destruction that occurred in the previous innerHTML = styleBlock + content
approach (a single string assignment re-parsed all CSS and rebuilt every
tracked element on every state change).

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`_updateDom`](../../../../../core/Component/classes/BaseComponent.md#_updatedom)

***

### \_applyRenderOutput()

```ts
protected _applyRenderOutput(output): void;
```

Defined in: [core/Component.ts:351](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L351)

Applies the render output (DOM Node, DocumentFragment, or HTML string) to the content wrapper.
Three accepted shapes, resolved in priority order:
 - Node → `replaceChildren(node)` — the JSX fast path, keeps DOM identity.
 - Array → `replaceChildren(...filtered)` — fragment-style multi-root
   render; nullish entries are filtered so conditional JSX slots can just
   return null.
 - string/nullish → `innerHTML` — legacy string templates; '' clears.

#### Parameters

##### output

`string` \| `Node` \| (`Node` \| `null` \| `undefined`)[] \| `null` \| `undefined`

Render result from render().

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`_applyRenderOutput`](../../../../../core/Component/classes/BaseComponent.md#_applyrenderoutput)

***

### onInit()

```ts
onInit(): void;
```

Defined in: [website/components/media/MediaExpanded.tsx:89](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L89)

Lifecycle hooks — declared on the base so `?.()` calls are type-safe and
subclasses get a documented override point. Order on first connect:
onInit → _renderInitial → onMounted → onUpdated.

#### Returns

`void`

#### Overrides

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onInit`](../../../../../core/Component/classes/BaseComponent.md#oninit)

***

### onMounted()

```ts
onMounted(): void;
```

Defined in: [website/components/media/MediaExpanded.tsx:93](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L93)

#### Returns

`void`

#### Overrides

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onMounted`](../../../../../core/Component/classes/BaseComponent.md#onmounted)

***

### placeholder()

```ts
placeholder(width, height): string;
```

Defined in: [website/components/media/MediaExpanded.tsx:99](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L99)

Placeholder box style while the full asset loads.

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`string`

***

### startClose()

```ts
startClose(): void;
```

Defined in: [website/components/media/MediaExpanded.tsx:105](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L105)

Dismissal sequence — CSS zoom-out, then URL/dialog/scroll teardown (see expanded-close.ts).

#### Returns

`void`

***

### onDestroy()

```ts
onDestroy(): void;
```

Defined in: [website/components/media/MediaExpanded.tsx:109](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L109)

#### Returns

`void`

#### Overrides

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`onDestroy`](../../../../../core/Component/classes/BaseComponent.md#ondestroy)

***

### render()

```ts
render(): Element;
```

Defined in: [website/components/media/MediaExpanded.tsx:119](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/MediaExpanded.tsx#L119)

JSX template (see expanded-render.tsx).

#### Returns

[`Element`](../../../../../shared/src/globals/namespaces/JSX/type-aliases/Element.md)

#### Overrides

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`render`](../../../../../core/Component/classes/BaseComponent.md#render)

***

### animate()

```ts
animate(keyframes, options?): Animation;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3556

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animate)

#### Parameters

##### keyframes

`Keyframe`[] \| `PropertyIndexedKeyframes` \| `null`

##### options?

`number` \| `KeyframeAnimationOptions`

#### Returns

`Animation`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`animate`](../../../../../core/Component/classes/BaseComponent.md#animate)

***

### getAnimations()

```ts
getAnimations(options?): Animation[];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3558

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getAnimations)

#### Parameters

##### options?

`GetAnimationsOptions`

#### Returns

`Animation`[]

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getAnimations`](../../../../../core/Component/classes/BaseComponent.md#getanimations)

***

### after()

```ts
after(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10657

Inserts nodes just after node, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CharacterData/after)

#### Parameters

##### nodes

...(`string` \| `Node`)[]

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`after`](../../../../../core/Component/classes/BaseComponent.md#after)

***

### before()

```ts
before(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10665

Inserts nodes just before node, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CharacterData/before)

#### Parameters

##### nodes

...(`string` \| `Node`)[]

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`before`](../../../../../core/Component/classes/BaseComponent.md#before)

***

### remove()

```ts
remove(): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10671

Removes node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CharacterData/remove)

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`remove`](../../../../../core/Component/classes/BaseComponent.md#remove)

***

### replaceWith()

```ts
replaceWith(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10679

Replaces node with nodes, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CharacterData/replaceWith)

#### Parameters

##### nodes

...(`string` \| `Node`)[]

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`replaceWith`](../../../../../core/Component/classes/BaseComponent.md#replacewith)

***

### attachShadow()

```ts
attachShadow(init): ShadowRoot;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13654

The **`Element.attachShadow()`** method attaches a shadow DOM tree to the specified element and returns a reference to its ShadowRoot.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/attachShadow)

#### Parameters

##### init

`ShadowRootInit`

#### Returns

`ShadowRoot`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`attachShadow`](../../../../../core/Component/classes/BaseComponent.md#attachshadow)

***

### checkVisibility()

```ts
checkVisibility(options?): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13660

The **`checkVisibility()`** method of the Element interface checks whether the element is visible.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/checkVisibility)

#### Parameters

##### options?

`CheckVisibilityOptions`

#### Returns

`boolean`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`checkVisibility`](../../../../../core/Component/classes/BaseComponent.md#checkvisibility)

***

### closest()

#### Call Signature

```ts
closest<K>(selector): 
  | HTMLElementTagNameMap[K]
  | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13666

The **`closest()`** method of the Element interface traverses the element and its parents (heading toward the document root) until it finds a node that matches the specified CSS selector.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/closest)

##### Type Parameters

###### K

`K` *extends* keyof [`HTMLElementTagNameMap`](../../../../../shared/src/globals/interfaces/HTMLElementTagNameMap.md)

##### Parameters

###### selector

`K`

##### Returns

  \| [`HTMLElementTagNameMap`](../../../../../shared/src/globals/interfaces/HTMLElementTagNameMap.md)\[`K`\]
  \| `null`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`closest`](../../../../../core/Component/classes/BaseComponent.md#closest)

#### Call Signature

```ts
closest<K>(selector): SVGElementTagNameMap[K] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13667

##### Type Parameters

###### K

`K` *extends* keyof `SVGElementTagNameMap`

##### Parameters

###### selector

`K`

##### Returns

`SVGElementTagNameMap`\[`K`\] \| `null`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`closest`](../../../../../core/Component/classes/BaseComponent.md#closest)

#### Call Signature

```ts
closest<K>(selector): MathMLElementTagNameMap[K] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13668

##### Type Parameters

###### K

`K` *extends* keyof `MathMLElementTagNameMap`

##### Parameters

###### selector

`K`

##### Returns

`MathMLElementTagNameMap`\[`K`\] \| `null`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`closest`](../../../../../core/Component/classes/BaseComponent.md#closest)

#### Call Signature

```ts
closest<E>(selectors): E | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13669

##### Type Parameters

###### E

`E` *extends* `Element` = `Element`

##### Parameters

###### selectors

`string`

##### Returns

`E` \| `null`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`closest`](../../../../../core/Component/classes/BaseComponent.md#closest)

***

### computedStyleMap()

```ts
computedStyleMap(): StylePropertyMapReadOnly;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13675

The **`computedStyleMap()`** method of the Element interface returns a StylePropertyMapReadOnly interface which provides a read-only representation of a CSS declaration block that is an alternative to CSSStyleDeclaration.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/computedStyleMap)

#### Returns

`StylePropertyMapReadOnly`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`computedStyleMap`](../../../../../core/Component/classes/BaseComponent.md#computedstylemap)

***

### getAttribute()

```ts
getAttribute(qualifiedName): string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13681

The **`getAttribute()`** method of the Element interface returns the value of a specified attribute on the element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getAttribute)

#### Parameters

##### qualifiedName

`string`

#### Returns

`string` \| `null`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getAttribute`](../../../../../core/Component/classes/BaseComponent.md#getattribute)

***

### getAttributeNS()

```ts
getAttributeNS(namespace, localName): string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13687

The **`getAttributeNS()`** method of the Element interface returns the string value of the attribute with the specified namespace and name. If the named attribute does not exist, the value returned will either be null or "" (the empty string); see Notes for details.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getAttributeNS)

#### Parameters

##### namespace

`string` \| `null`

##### localName

`string`

#### Returns

`string` \| `null`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getAttributeNS`](../../../../../core/Component/classes/BaseComponent.md#getattributens)

***

### getAttributeNames()

```ts
getAttributeNames(): string[];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13693

The **`getAttributeNames()`** method of the Element interface returns the attribute names of the element as an Array of strings. If the element has no attributes it returns an empty array.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getAttributeNames)

#### Returns

`string`[]

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getAttributeNames`](../../../../../core/Component/classes/BaseComponent.md#getattributenames)

***

### getAttributeNode()

```ts
getAttributeNode(qualifiedName): Attr | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13699

Returns the specified attribute of the specified element, as an Attr node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getAttributeNode)

#### Parameters

##### qualifiedName

`string`

#### Returns

`Attr` \| `null`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getAttributeNode`](../../../../../core/Component/classes/BaseComponent.md#getattributenode)

***

### getAttributeNodeNS()

```ts
getAttributeNodeNS(namespace, localName): Attr | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13705

The **`getAttributeNodeNS()`** method of the Element interface returns the namespaced Attr node of an element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getAttributeNodeNS)

#### Parameters

##### namespace

`string` \| `null`

##### localName

`string`

#### Returns

`Attr` \| `null`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getAttributeNodeNS`](../../../../../core/Component/classes/BaseComponent.md#getattributenodens)

***

### getBoundingClientRect()

```ts
getBoundingClientRect(): DOMRect;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13711

The **`Element.getBoundingClientRect()`** method returns a DOMRect object providing information about the size of an element and its position relative to the viewport.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getBoundingClientRect)

#### Returns

`DOMRect`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getBoundingClientRect`](../../../../../core/Component/classes/BaseComponent.md#getboundingclientrect)

***

### getClientRects()

```ts
getClientRects(): DOMRectList;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13717

The **`getClientRects()`** method of the Element interface returns a collection of DOMRect objects that indicate the bounding rectangles for each CSS border box in a client.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getClientRects)

#### Returns

`DOMRectList`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getClientRects`](../../../../../core/Component/classes/BaseComponent.md#getclientrects)

***

### getElementsByClassName()

```ts
getElementsByClassName(classNames): HTMLCollectionOf<Element>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13723

The Element method **`getElementsByClassName()`** returns a live HTMLCollection which contains every descendant element which has the specified class name or names.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getElementsByClassName)

#### Parameters

##### classNames

`string`

#### Returns

`HTMLCollectionOf`\<`Element`\>

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getElementsByClassName`](../../../../../core/Component/classes/BaseComponent.md#getelementsbyclassname)

***

### getElementsByTagName()

#### Call Signature

```ts
getElementsByTagName<K>(qualifiedName): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13729

The **`Element.getElementsByTagName()`** method returns a live HTMLCollection of elements with the given tag name.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getElementsByTagName)

##### Type Parameters

###### K

`K` *extends* keyof [`HTMLElementTagNameMap`](../../../../../shared/src/globals/interfaces/HTMLElementTagNameMap.md)

##### Parameters

###### qualifiedName

`K`

##### Returns

`HTMLCollectionOf`\<[`HTMLElementTagNameMap`](../../../../../shared/src/globals/interfaces/HTMLElementTagNameMap.md)\[`K`\]\>

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getElementsByTagName`](../../../../../core/Component/classes/BaseComponent.md#getelementsbytagname)

#### Call Signature

```ts
getElementsByTagName<K>(qualifiedName): HTMLCollectionOf<SVGElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13730

##### Type Parameters

###### K

`K` *extends* keyof `SVGElementTagNameMap`

##### Parameters

###### qualifiedName

`K`

##### Returns

`HTMLCollectionOf`\<`SVGElementTagNameMap`\[`K`\]\>

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getElementsByTagName`](../../../../../core/Component/classes/BaseComponent.md#getelementsbytagname)

#### Call Signature

```ts
getElementsByTagName<K>(qualifiedName): HTMLCollectionOf<MathMLElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13731

##### Type Parameters

###### K

`K` *extends* keyof `MathMLElementTagNameMap`

##### Parameters

###### qualifiedName

`K`

##### Returns

`HTMLCollectionOf`\<`MathMLElementTagNameMap`\[`K`\]\>

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getElementsByTagName`](../../../../../core/Component/classes/BaseComponent.md#getelementsbytagname)

#### Call Signature

```ts
getElementsByTagName<K>(qualifiedName): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13733

##### Type Parameters

###### K

`K` *extends* keyof `HTMLElementDeprecatedTagNameMap`

##### Parameters

###### qualifiedName

`K`

##### Returns

`HTMLCollectionOf`\<`HTMLElementDeprecatedTagNameMap`\[`K`\]\>

##### Deprecated

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getElementsByTagName`](../../../../../core/Component/classes/BaseComponent.md#getelementsbytagname)

#### Call Signature

```ts
getElementsByTagName(qualifiedName): HTMLCollectionOf<Element>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13734

##### Parameters

###### qualifiedName

`string`

##### Returns

`HTMLCollectionOf`\<`Element`\>

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getElementsByTagName`](../../../../../core/Component/classes/BaseComponent.md#getelementsbytagname)

***

### getElementsByTagNameNS()

#### Call Signature

```ts
getElementsByTagNameNS(namespaceURI, localName): HTMLCollectionOf<HTMLElement>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13740

The **`Element.getElementsByTagNameNS()`** method returns a live HTMLCollection of elements with the given tag name belonging to the given namespace. It is similar to Document.getElementsByTagNameNS, except that its search is restricted to descendants of the specified element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getElementsByTagNameNS)

##### Parameters

###### namespaceURI

`"http://www.w3.org/1999/xhtml"`

###### localName

`string`

##### Returns

`HTMLCollectionOf`\<`HTMLElement`\>

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getElementsByTagNameNS`](../../../../../core/Component/classes/BaseComponent.md#getelementsbytagnamens)

#### Call Signature

```ts
getElementsByTagNameNS(namespaceURI, localName): HTMLCollectionOf<SVGElement>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13741

##### Parameters

###### namespaceURI

`"http://www.w3.org/2000/svg"`

###### localName

`string`

##### Returns

`HTMLCollectionOf`\<`SVGElement`\>

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getElementsByTagNameNS`](../../../../../core/Component/classes/BaseComponent.md#getelementsbytagnamens)

#### Call Signature

```ts
getElementsByTagNameNS(namespaceURI, localName): HTMLCollectionOf<MathMLElement>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13742

##### Parameters

###### namespaceURI

`"http://www.w3.org/1998/Math/MathML"`

###### localName

`string`

##### Returns

`HTMLCollectionOf`\<`MathMLElement`\>

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getElementsByTagNameNS`](../../../../../core/Component/classes/BaseComponent.md#getelementsbytagnamens)

#### Call Signature

```ts
getElementsByTagNameNS(namespace, localName): HTMLCollectionOf<Element>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13743

##### Parameters

###### namespace

`string` \| `null`

###### localName

`string`

##### Returns

`HTMLCollectionOf`\<`Element`\>

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getElementsByTagNameNS`](../../../../../core/Component/classes/BaseComponent.md#getelementsbytagnamens)

***

### getHTML()

```ts
getHTML(options?): string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13749

The **`getHTML()`** method of the Element interface is used to serialize an element's DOM to an HTML string.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getHTML)

#### Parameters

##### options?

`GetHTMLOptions`

#### Returns

`string`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getHTML`](../../../../../core/Component/classes/BaseComponent.md#gethtml)

***

### hasAttribute()

```ts
hasAttribute(qualifiedName): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13755

The **`Element.hasAttribute()`** method returns a Boolean value indicating whether the specified element has the specified attribute or not.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/hasAttribute)

#### Parameters

##### qualifiedName

`string`

#### Returns

`boolean`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`hasAttribute`](../../../../../core/Component/classes/BaseComponent.md#hasattribute)

***

### hasAttributeNS()

```ts
hasAttributeNS(namespace, localName): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13761

The **`hasAttributeNS()`** method of the Element interface returns a boolean value indicating whether the current element has the specified attribute with the specified namespace.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/hasAttributeNS)

#### Parameters

##### namespace

`string` \| `null`

##### localName

`string`

#### Returns

`boolean`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`hasAttributeNS`](../../../../../core/Component/classes/BaseComponent.md#hasattributens)

***

### hasAttributes()

```ts
hasAttributes(): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13767

The **`hasAttributes()`** method of the Element interface returns a boolean value indicating whether the current element has any attributes or not.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/hasAttributes)

#### Returns

`boolean`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`hasAttributes`](../../../../../core/Component/classes/BaseComponent.md#hasattributes)

***

### hasPointerCapture()

```ts
hasPointerCapture(pointerId): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13773

The **`hasPointerCapture()`** method of the Element interface checks whether the element on which it is invoked has pointer capture for the pointer identified by the given pointer ID.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/hasPointerCapture)

#### Parameters

##### pointerId

`number`

#### Returns

`boolean`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`hasPointerCapture`](../../../../../core/Component/classes/BaseComponent.md#haspointercapture)

***

### insertAdjacentElement()

```ts
insertAdjacentElement(where, element): Element | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13779

The **`insertAdjacentElement()`** method of the Element interface inserts a given element node at a given position relative to the element it is invoked upon.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentElement)

#### Parameters

##### where

`InsertPosition`

##### element

`Element`

#### Returns

`Element` \| `null`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`insertAdjacentElement`](../../../../../core/Component/classes/BaseComponent.md#insertadjacentelement)

***

### insertAdjacentHTML()

```ts
insertAdjacentHTML(position, string): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13785

The **`insertAdjacentHTML()`** method of the Element interface parses the specified input as HTML or XML and inserts the resulting nodes into the DOM tree at a specified position.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentHTML)

#### Parameters

##### position

`InsertPosition`

##### string

`string`

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`insertAdjacentHTML`](../../../../../core/Component/classes/BaseComponent.md#insertadjacenthtml)

***

### insertAdjacentText()

```ts
insertAdjacentText(where, data): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13791

The **`insertAdjacentText()`** method of the Element interface, given a relative position and a string, inserts a new text node at the given position relative to the element it is called from.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentText)

#### Parameters

##### where

`InsertPosition`

##### data

`string`

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`insertAdjacentText`](../../../../../core/Component/classes/BaseComponent.md#insertadjacenttext)

***

### matches()

#### Call Signature

```ts
matches<K>(selectors): this is HTMLElementTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13797

The **`matches()`** method of the Element interface tests whether the element would be selected by the specified CSS selector.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/matches)

##### Type Parameters

###### K

`K` *extends* keyof [`HTMLElementTagNameMap`](../../../../../shared/src/globals/interfaces/HTMLElementTagNameMap.md)

##### Parameters

###### selectors

`K`

##### Returns

`this is HTMLElementTagNameMap[K]`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`matches`](../../../../../core/Component/classes/BaseComponent.md#matches)

#### Call Signature

```ts
matches<K>(selectors): this is SVGElementTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13798

##### Type Parameters

###### K

`K` *extends* keyof `SVGElementTagNameMap`

##### Parameters

###### selectors

`K`

##### Returns

`this is SVGElementTagNameMap[K]`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`matches`](../../../../../core/Component/classes/BaseComponent.md#matches)

#### Call Signature

```ts
matches<K>(selectors): this is MathMLElementTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13799

##### Type Parameters

###### K

`K` *extends* keyof `MathMLElementTagNameMap`

##### Parameters

###### selectors

`K`

##### Returns

`this is MathMLElementTagNameMap[K]`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`matches`](../../../../../core/Component/classes/BaseComponent.md#matches)

#### Call Signature

```ts
matches(selectors): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13800

##### Parameters

###### selectors

`string`

##### Returns

`boolean`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`matches`](../../../../../core/Component/classes/BaseComponent.md#matches)

***

### releasePointerCapture()

```ts
releasePointerCapture(pointerId): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13806

The **`releasePointerCapture()`** method of the Element interface releases (stops) pointer capture that was previously set for a specific (PointerEvent) pointer.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/releasePointerCapture)

#### Parameters

##### pointerId

`number`

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`releasePointerCapture`](../../../../../core/Component/classes/BaseComponent.md#releasepointercapture)

***

### removeAttribute()

```ts
removeAttribute(qualifiedName): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13812

The Element method **`removeAttribute()`** removes the attribute with the specified name from the element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/removeAttribute)

#### Parameters

##### qualifiedName

`string`

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`removeAttribute`](../../../../../core/Component/classes/BaseComponent.md#removeattribute)

***

### removeAttributeNS()

```ts
removeAttributeNS(namespace, localName): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13818

The **`removeAttributeNS()`** method of the Element interface removes the specified attribute with the specified namespace from an element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/removeAttributeNS)

#### Parameters

##### namespace

`string` \| `null`

##### localName

`string`

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`removeAttributeNS`](../../../../../core/Component/classes/BaseComponent.md#removeattributens)

***

### removeAttributeNode()

```ts
removeAttributeNode(attr): Attr;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13824

The **`removeAttributeNode()`** method of the Element interface removes the specified Attr node from the element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/removeAttributeNode)

#### Parameters

##### attr

`Attr`

#### Returns

`Attr`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`removeAttributeNode`](../../../../../core/Component/classes/BaseComponent.md#removeattributenode)

***

### requestFullscreen()

```ts
requestFullscreen(options?): Promise<void>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13830

The **`Element.requestFullscreen()`** method issues an asynchronous request to make the element be displayed in fullscreen mode.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/requestFullscreen)

#### Parameters

##### options?

`FullscreenOptions`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`requestFullscreen`](../../../../../core/Component/classes/BaseComponent.md#requestfullscreen)

***

### requestPointerLock()

```ts
requestPointerLock(options?): Promise<void>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13836

The **`requestPointerLock()`** method of the Element interface lets you asynchronously ask for the pointer to be locked on the given element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/requestPointerLock)

#### Parameters

##### options?

`PointerLockOptions`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`requestPointerLock`](../../../../../core/Component/classes/BaseComponent.md#requestpointerlock)

***

### scroll()

#### Call Signature

```ts
scroll(options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13842

The **`scroll()`** method of the Element interface scrolls the element to a particular set of coordinates inside a given element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scroll)

##### Parameters

###### options?

`ScrollToOptions`

##### Returns

`void`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`scroll`](../../../../../core/Component/classes/BaseComponent.md#scroll)

#### Call Signature

```ts
scroll(x, y): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13843

##### Parameters

###### x

`number`

###### y

`number`

##### Returns

`void`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`scroll`](../../../../../core/Component/classes/BaseComponent.md#scroll)

***

### scrollBy()

#### Call Signature

```ts
scrollBy(options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13849

The **`scrollBy()`** method of the Element interface scrolls an element by the given amount.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollBy)

##### Parameters

###### options?

`ScrollToOptions`

##### Returns

`void`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`scrollBy`](../../../../../core/Component/classes/BaseComponent.md#scrollby)

#### Call Signature

```ts
scrollBy(x, y): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13850

##### Parameters

###### x

`number`

###### y

`number`

##### Returns

`void`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`scrollBy`](../../../../../core/Component/classes/BaseComponent.md#scrollby)

***

### scrollIntoView()

```ts
scrollIntoView(arg?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13856

The Element interface's **`scrollIntoView()`** method scrolls the element's ancestor containers such that the element on which scrollIntoView() is called is visible to the user.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollIntoView)

#### Parameters

##### arg?

`boolean` \| `ScrollIntoViewOptions`

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`scrollIntoView`](../../../../../core/Component/classes/BaseComponent.md#scrollintoview)

***

### scrollTo()

#### Call Signature

```ts
scrollTo(options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13862

The **`scrollTo()`** method of the Element interface scrolls to a particular set of coordinates inside a given element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollTo)

##### Parameters

###### options?

`ScrollToOptions`

##### Returns

`void`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`scrollTo`](../../../../../core/Component/classes/BaseComponent.md#scrollto)

#### Call Signature

```ts
scrollTo(x, y): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13863

##### Parameters

###### x

`number`

###### y

`number`

##### Returns

`void`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`scrollTo`](../../../../../core/Component/classes/BaseComponent.md#scrollto)

***

### setAttribute()

```ts
setAttribute(qualifiedName, value): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13869

The **`setAttribute()`** method of the Element interface sets the value of an attribute on the specified element. If the attribute already exists, the value is updated; otherwise a new attribute is added with the specified name and value.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setAttribute)

#### Parameters

##### qualifiedName

`string`

##### value

`string`

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`setAttribute`](../../../../../core/Component/classes/BaseComponent.md#setattribute)

***

### setAttributeNS()

```ts
setAttributeNS(
   namespace, 
   qualifiedName, 
   value
): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13875

The **`setAttributeNS()`** method of the Element interface adds a new attribute or changes the value of an attribute with the given namespace and name.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setAttributeNS)

#### Parameters

##### namespace

`string` \| `null`

##### qualifiedName

`string`

##### value

`string`

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`setAttributeNS`](../../../../../core/Component/classes/BaseComponent.md#setattributens)

***

### setAttributeNode()

```ts
setAttributeNode(attr): Attr | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13881

The **`setAttributeNode()`** method of the Element interface adds a new Attr node to the specified element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setAttributeNode)

#### Parameters

##### attr

`Attr`

#### Returns

`Attr` \| `null`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`setAttributeNode`](../../../../../core/Component/classes/BaseComponent.md#setattributenode)

***

### setAttributeNodeNS()

```ts
setAttributeNodeNS(attr): Attr | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13887

The **`setAttributeNodeNS()`** method of the Element interface adds a new namespaced Attr node to an element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setAttributeNodeNS)

#### Parameters

##### attr

`Attr`

#### Returns

`Attr` \| `null`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`setAttributeNodeNS`](../../../../../core/Component/classes/BaseComponent.md#setattributenodens)

***

### setHTMLUnsafe()

```ts
setHTMLUnsafe(html): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13893

The **`setHTMLUnsafe()`** method of the Element interface is used to parse HTML input into a DocumentFragment, optionally filtering out unwanted elements and attributes, and those that don't belong in the context, and then using it to replace the element's subtree in the DOM.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setHTMLUnsafe)

#### Parameters

##### html

`string`

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`setHTMLUnsafe`](../../../../../core/Component/classes/BaseComponent.md#sethtmlunsafe)

***

### setPointerCapture()

```ts
setPointerCapture(pointerId): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13899

The **`setPointerCapture()`** method of the Element interface is used to designate a specific element as the capture target of future pointer events. Subsequent events for the pointer will be targeted at the capture element until capture is released (via Element.releasePointerCapture() or the pointerup event is fired).

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setPointerCapture)

#### Parameters

##### pointerId

`number`

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`setPointerCapture`](../../../../../core/Component/classes/BaseComponent.md#setpointercapture)

***

### toggleAttribute()

```ts
toggleAttribute(qualifiedName, force?): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13905

The **`toggleAttribute()`** method of the Element interface toggles a Boolean attribute (removing it if it is present and adding it if it is not present) on the given element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/toggleAttribute)

#### Parameters

##### qualifiedName

`string`

##### force?

`boolean`

#### Returns

`boolean`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`toggleAttribute`](../../../../../core/Component/classes/BaseComponent.md#toggleattribute)

***

### ~~webkitMatchesSelector()~~

```ts
webkitMatchesSelector(selectors): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13911

#### Parameters

##### selectors

`string`

#### Returns

`boolean`

#### Deprecated

This is a legacy alias of `matches`.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/matches)

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`webkitMatchesSelector`](../../../../../core/Component/classes/BaseComponent.md#webkitmatchesselector)

***

### dispatchEvent()

#### Call Signature

```ts
dispatchEvent(event): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:14386

The **`dispatchEvent()`** method of the EventTarget sends an Event to the object, (synchronously) invoking the affected event listeners in the appropriate order. The normal event processing rules (including the capturing and optional bubbling phase) also apply to events dispatched manually with dispatchEvent().

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/dispatchEvent)

##### Parameters

###### event

`Event`

##### Returns

`boolean`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`dispatchEvent`](../../../../../core/Component/classes/BaseComponent.md#dispatchevent)

#### Call Signature

```ts
dispatchEvent(event): boolean;
```

Defined in: node\_modules/typescript/lib/lib.webworker.d.ts:4505

The **`dispatchEvent()`** method of the EventTarget sends an Event to the object, (synchronously) invoking the affected event listeners in the appropriate order. The normal event processing rules (including the capturing and optional bubbling phase) also apply to events dispatched manually with dispatchEvent().

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/dispatchEvent)

##### Parameters

###### event

`Event`

##### Returns

`boolean`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`dispatchEvent`](../../../../../core/Component/classes/BaseComponent.md#dispatchevent)

***

### attachInternals()

```ts
attachInternals(): ElementInternals;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17861

The **`HTMLElement.attachInternals()`** method returns an ElementInternals object. This method allows a custom element to participate in HTML forms. The ElementInternals interface provides utilities for working with these elements in the same way you would work with any standard HTML form element, and also exposes the Accessibility Object Model to the element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/attachInternals)

#### Returns

`ElementInternals`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`attachInternals`](../../../../../core/Component/classes/BaseComponent.md#attachinternals)

***

### click()

```ts
click(): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17867

The **`HTMLElement.click()`** method simulates a mouse click on an element. When called on an element, the element's click event is fired (unless its disabled attribute is set).

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/click)

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`click`](../../../../../core/Component/classes/BaseComponent.md#click)

***

### hidePopover()

```ts
hidePopover(): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17873

The **`hidePopover()`** method of the HTMLElement interface hides a popover element (i.e., one that has a valid popover attribute) by removing it from the top layer and styling it with display: none.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/hidePopover)

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`hidePopover`](../../../../../core/Component/classes/BaseComponent.md#hidepopover)

***

### showPopover()

```ts
showPopover(options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17879

The **`showPopover()`** method of the HTMLElement interface shows a popover element (i.e., one that has a valid popover attribute) by adding it to the top layer.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/showPopover)

#### Parameters

##### options?

`ShowPopoverOptions`

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`showPopover`](../../../../../core/Component/classes/BaseComponent.md#showpopover)

***

### togglePopover()

```ts
togglePopover(options?): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17885

The **`togglePopover()`** method of the HTMLElement interface toggles a popover element (i.e., one that has a valid popover attribute) between the hidden and showing states.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/togglePopover)

#### Parameters

##### options?

`boolean` \| `TogglePopoverOptions`

#### Returns

`boolean`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`togglePopover`](../../../../../core/Component/classes/BaseComponent.md#togglepopover)

***

### addEventListener()

#### Call Signature

```ts
addEventListener<K>(
   type, 
   listener, 
   options?
): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17886

##### Type Parameters

###### K

`K` *extends* keyof `HTMLElementEventMap`

##### Parameters

###### type

`K`

###### listener

(`this`, `ev`) => `any`

###### options?

`boolean` \| `AddEventListenerOptions`

##### Returns

`void`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`addEventListener`](../../../../../core/Component/classes/BaseComponent.md#addeventlistener)

#### Call Signature

```ts
addEventListener(
   type, 
   listener, 
   options?
): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17887

##### Parameters

###### type

`string`

###### listener

`EventListenerOrEventListenerObject`

###### options?

`boolean` \| `AddEventListenerOptions`

##### Returns

`void`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`addEventListener`](../../../../../core/Component/classes/BaseComponent.md#addeventlistener)

***

### removeEventListener()

#### Call Signature

```ts
removeEventListener<K>(
   type, 
   listener, 
   options?
): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17888

##### Type Parameters

###### K

`K` *extends* keyof `HTMLElementEventMap`

##### Parameters

###### type

`K`

###### listener

(`this`, `ev`) => `any`

###### options?

`boolean` \| `EventListenerOptions`

##### Returns

`void`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`removeEventListener`](../../../../../core/Component/classes/BaseComponent.md#removeeventlistener)

#### Call Signature

```ts
removeEventListener(
   type, 
   listener, 
   options?
): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17889

##### Parameters

###### type

`string`

###### listener

`EventListenerOrEventListenerObject`

###### options?

`boolean` \| `EventListenerOptions`

##### Returns

`void`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`removeEventListener`](../../../../../core/Component/classes/BaseComponent.md#removeeventlistener)

***

### blur()

```ts
blur(): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:20130

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/blur)

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`blur`](../../../../../core/Component/classes/BaseComponent.md#blur)

***

### focus()

```ts
focus(options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:20132

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/focus)

#### Parameters

##### options?

`FocusOptions`

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`focus`](../../../../../core/Component/classes/BaseComponent.md#focus)

***

### appendChild()

```ts
appendChild<T>(node): T;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26125

The **`appendChild()`** method of the Node interface adds a node to the end of the list of children of a specified parent node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/appendChild)

#### Type Parameters

##### T

`T` *extends* `Node`

#### Parameters

##### node

`T`

#### Returns

`T`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`appendChild`](../../../../../core/Component/classes/BaseComponent.md#appendchild)

***

### cloneNode()

```ts
cloneNode(subtree?): Node;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26131

The **`cloneNode()`** method of the Node interface returns a duplicate of the node on which this method was called. Its parameter controls if the subtree contained in the node is also cloned or not.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/cloneNode)

#### Parameters

##### subtree?

`boolean`

#### Returns

`Node`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`cloneNode`](../../../../../core/Component/classes/BaseComponent.md#clonenode)

***

### compareDocumentPosition()

```ts
compareDocumentPosition(other): number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26137

The **`compareDocumentPosition()`** method of the Node interface reports the position of its argument node relative to the node on which it is called.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/compareDocumentPosition)

#### Parameters

##### other

`Node`

#### Returns

`number`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`compareDocumentPosition`](../../../../../core/Component/classes/BaseComponent.md#comparedocumentposition)

***

### contains()

```ts
contains(other): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26143

The **`contains()`** method of the Node interface returns a boolean value indicating whether a node is a descendant of a given node, that is the node itself, one of its direct children (childNodes), one of the children's direct children, and so on.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/contains)

#### Parameters

##### other

`Node` \| `null`

#### Returns

`boolean`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`contains`](../../../../../core/Component/classes/BaseComponent.md#contains)

***

### getRootNode()

```ts
getRootNode(options?): Node;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26149

The **`getRootNode()`** method of the Node interface returns the context object's root, which optionally includes the shadow root if it is available.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/getRootNode)

#### Parameters

##### options?

`GetRootNodeOptions`

#### Returns

`Node`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`getRootNode`](../../../../../core/Component/classes/BaseComponent.md#getrootnode)

***

### hasChildNodes()

```ts
hasChildNodes(): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26155

The **`hasChildNodes()`** method of the Node interface returns a boolean value indicating whether the given Node has child nodes or not.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/hasChildNodes)

#### Returns

`boolean`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`hasChildNodes`](../../../../../core/Component/classes/BaseComponent.md#haschildnodes)

***

### insertBefore()

```ts
insertBefore<T>(node, child): T;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26161

The **`insertBefore()`** method of the Node interface inserts a node before a reference node as a child of a specified parent node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/insertBefore)

#### Type Parameters

##### T

`T` *extends* `Node`

#### Parameters

##### node

`T`

##### child

`Node` \| `null`

#### Returns

`T`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`insertBefore`](../../../../../core/Component/classes/BaseComponent.md#insertbefore)

***

### isDefaultNamespace()

```ts
isDefaultNamespace(namespace): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26167

The **`isDefaultNamespace()`** method of the Node interface accepts a namespace URI as an argument. It returns a boolean value that is true if the namespace is the default namespace on the given node and false if not. The default namespace can be retrieved with Node.lookupNamespaceURI() by passing null as the argument.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/isDefaultNamespace)

#### Parameters

##### namespace

`string` \| `null`

#### Returns

`boolean`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`isDefaultNamespace`](../../../../../core/Component/classes/BaseComponent.md#isdefaultnamespace)

***

### isEqualNode()

```ts
isEqualNode(otherNode): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26173

The **`isEqualNode()`** method of the Node interface tests whether two nodes are equal. Two nodes are equal when they have the same type, defining characteristics (for elements, this would be their ID, number of children, and so forth), its attributes match, and so on. The specific set of data points that must match varies depending on the types of the nodes.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/isEqualNode)

#### Parameters

##### otherNode

`Node` \| `null`

#### Returns

`boolean`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`isEqualNode`](../../../../../core/Component/classes/BaseComponent.md#isequalnode)

***

### isSameNode()

```ts
isSameNode(otherNode): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26179

The **`isSameNode()`** method of the Node interface is a legacy alias the for the === strict equality operator. That is, it tests whether two nodes are the same (in other words, whether they reference the same object).

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/isSameNode)

#### Parameters

##### otherNode

`Node` \| `null`

#### Returns

`boolean`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`isSameNode`](../../../../../core/Component/classes/BaseComponent.md#issamenode)

***

### lookupNamespaceURI()

```ts
lookupNamespaceURI(prefix): string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26185

The **`lookupNamespaceURI()`** method of the Node interface takes a prefix as parameter and returns the namespace URI associated with it on the given node if found (and null if not). This method's existence allows Node objects to be passed as a namespace resolver to XPathEvaluator.createExpression() and XPathEvaluator.evaluate().

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/lookupNamespaceURI)

#### Parameters

##### prefix

`string` \| `null`

#### Returns

`string` \| `null`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`lookupNamespaceURI`](../../../../../core/Component/classes/BaseComponent.md#lookupnamespaceuri)

***

### lookupPrefix()

```ts
lookupPrefix(namespace): string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26191

The **`lookupPrefix()`** method of the Node interface returns a string containing the prefix for a given namespace URI, if present, and null if not. When multiple prefixes are possible, the first prefix is returned.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/lookupPrefix)

#### Parameters

##### namespace

`string` \| `null`

#### Returns

`string` \| `null`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`lookupPrefix`](../../../../../core/Component/classes/BaseComponent.md#lookupprefix)

***

### normalize()

```ts
normalize(): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26197

The **`normalize()`** method of the Node interface puts the specified node and all of its sub-tree into a normalized form. In a normalized sub-tree, no text nodes in the sub-tree are empty and there are no adjacent text nodes.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/normalize)

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`normalize`](../../../../../core/Component/classes/BaseComponent.md#normalize)

***

### removeChild()

```ts
removeChild<T>(child): T;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26203

The **`removeChild()`** method of the Node interface removes a child node from the DOM and returns the removed node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/removeChild)

#### Type Parameters

##### T

`T` *extends* `Node`

#### Parameters

##### child

`T`

#### Returns

`T`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`removeChild`](../../../../../core/Component/classes/BaseComponent.md#removechild)

***

### replaceChild()

```ts
replaceChild<T>(node, child): T;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26209

The **`replaceChild()`** method of the Node interface replaces a child node within the given (parent) node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/replaceChild)

#### Type Parameters

##### T

`T` *extends* `Node`

#### Parameters

##### node

`Node`

##### child

`T`

#### Returns

`T`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`replaceChild`](../../../../../core/Component/classes/BaseComponent.md#replacechild)

***

### append()

```ts
append(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27070

Inserts nodes after the last child of node, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/append)

#### Parameters

##### nodes

...(`string` \| `Node`)[]

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`append`](../../../../../core/Component/classes/BaseComponent.md#append)

***

### moveBefore()

```ts
moveBefore(node, child): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27072

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/moveBefore)

#### Parameters

##### node

`Node`

##### child

`Node` \| `null`

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`moveBefore`](../../../../../core/Component/classes/BaseComponent.md#movebefore)

***

### prepend()

```ts
prepend(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27080

Inserts nodes before the first child of node, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/prepend)

#### Parameters

##### nodes

...(`string` \| `Node`)[]

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`prepend`](../../../../../core/Component/classes/BaseComponent.md#prepend)

***

### querySelector()

#### Call Signature

```ts
querySelector<K>(selectors): 
  | HTMLElementTagNameMap[K]
  | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27086

Returns the first element that is a descendant of node that matches selectors.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/querySelector)

##### Type Parameters

###### K

`K` *extends* keyof [`HTMLElementTagNameMap`](../../../../../shared/src/globals/interfaces/HTMLElementTagNameMap.md)

##### Parameters

###### selectors

`K`

##### Returns

  \| [`HTMLElementTagNameMap`](../../../../../shared/src/globals/interfaces/HTMLElementTagNameMap.md)\[`K`\]
  \| `null`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`querySelector`](../../../../../core/Component/classes/BaseComponent.md#queryselector)

#### Call Signature

```ts
querySelector<K>(selectors): SVGElementTagNameMap[K] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27087

##### Type Parameters

###### K

`K` *extends* keyof `SVGElementTagNameMap`

##### Parameters

###### selectors

`K`

##### Returns

`SVGElementTagNameMap`\[`K`\] \| `null`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`querySelector`](../../../../../core/Component/classes/BaseComponent.md#queryselector)

#### Call Signature

```ts
querySelector<K>(selectors): MathMLElementTagNameMap[K] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27088

##### Type Parameters

###### K

`K` *extends* keyof `MathMLElementTagNameMap`

##### Parameters

###### selectors

`K`

##### Returns

`MathMLElementTagNameMap`\[`K`\] \| `null`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`querySelector`](../../../../../core/Component/classes/BaseComponent.md#queryselector)

#### Call Signature

```ts
querySelector<K>(selectors): HTMLElementDeprecatedTagNameMap[K] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27090

##### Type Parameters

###### K

`K` *extends* keyof `HTMLElementDeprecatedTagNameMap`

##### Parameters

###### selectors

`K`

##### Returns

`HTMLElementDeprecatedTagNameMap`\[`K`\] \| `null`

##### Deprecated

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`querySelector`](../../../../../core/Component/classes/BaseComponent.md#queryselector)

#### Call Signature

```ts
querySelector<E>(selectors): E | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27091

##### Type Parameters

###### E

`E` *extends* `Element` = `Element`

##### Parameters

###### selectors

`string`

##### Returns

`E` \| `null`

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`querySelector`](../../../../../core/Component/classes/BaseComponent.md#queryselector)

***

### querySelectorAll()

#### Call Signature

```ts
querySelectorAll<K>(selectors): NodeListOf<HTMLElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27097

Returns all element descendants of node that match selectors.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/querySelectorAll)

##### Type Parameters

###### K

`K` *extends* keyof [`HTMLElementTagNameMap`](../../../../../shared/src/globals/interfaces/HTMLElementTagNameMap.md)

##### Parameters

###### selectors

`K`

##### Returns

`NodeListOf`\<[`HTMLElementTagNameMap`](../../../../../shared/src/globals/interfaces/HTMLElementTagNameMap.md)\[`K`\]\>

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`querySelectorAll`](../../../../../core/Component/classes/BaseComponent.md#queryselectorall)

#### Call Signature

```ts
querySelectorAll<K>(selectors): NodeListOf<SVGElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27098

##### Type Parameters

###### K

`K` *extends* keyof `SVGElementTagNameMap`

##### Parameters

###### selectors

`K`

##### Returns

`NodeListOf`\<`SVGElementTagNameMap`\[`K`\]\>

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`querySelectorAll`](../../../../../core/Component/classes/BaseComponent.md#queryselectorall)

#### Call Signature

```ts
querySelectorAll<K>(selectors): NodeListOf<MathMLElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27099

##### Type Parameters

###### K

`K` *extends* keyof `MathMLElementTagNameMap`

##### Parameters

###### selectors

`K`

##### Returns

`NodeListOf`\<`MathMLElementTagNameMap`\[`K`\]\>

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`querySelectorAll`](../../../../../core/Component/classes/BaseComponent.md#queryselectorall)

#### Call Signature

```ts
querySelectorAll<K>(selectors): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27101

##### Type Parameters

###### K

`K` *extends* keyof `HTMLElementDeprecatedTagNameMap`

##### Parameters

###### selectors

`K`

##### Returns

`NodeListOf`\<`HTMLElementDeprecatedTagNameMap`\[`K`\]\>

##### Deprecated

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`querySelectorAll`](../../../../../core/Component/classes/BaseComponent.md#queryselectorall)

#### Call Signature

```ts
querySelectorAll<E>(selectors): NodeListOf<E>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27102

##### Type Parameters

###### E

`E` *extends* `Element` = `Element`

##### Parameters

###### selectors

`string`

##### Returns

`NodeListOf`\<`E`\>

##### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`querySelectorAll`](../../../../../core/Component/classes/BaseComponent.md#queryselectorall)

***

### replaceChildren()

```ts
replaceChildren(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27110

Replace all children of node with nodes, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/replaceChildren)

#### Parameters

##### nodes

...(`string` \| `Node`)[]

#### Returns

`void`

#### Inherited from

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md).[`replaceChildren`](../../../../../core/Component/classes/BaseComponent.md#replacechildren)
