[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [website/components/media/DrawText](../README.md) / DrawText

Defined in: [website/components/media/DrawText.tsx:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L35)

Draws text.

## Extends

- `HTMLElement`

## Constructors

### Constructor

```ts
new DrawText(): DrawText;
```

Defined in: [website/components/media/DrawText.tsx:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L58)

#### Returns

`DrawText`

#### Overrides

```ts
HTMLElement.constructor
```

## Properties

### \_isVisible

```ts
_isVisible: boolean = false;
```

Defined in: [website/components/media/DrawText.tsx:36](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L36)

***

### \_hasAnimated

```ts
_hasAnimated: boolean = false;
```

Defined in: [website/components/media/DrawText.tsx:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L37)

***

### \_observer

```ts
_observer: IntersectionObserver | null = null;
```

Defined in: [website/components/media/DrawText.tsx:38](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L38)

***

### \_animTimer

```ts
_animTimer: DrawTimer | null = null;
```

Defined in: [website/components/media/DrawText.tsx:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L39)

***

### \_isMounted

```ts
_isMounted: boolean = false;
```

Defined in: [website/components/media/DrawText.tsx:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L40)

***

### \_styleEl

```ts
_styleEl: HTMLStyleElement | CSSStyleSheet | null = null;
```

Defined in: [website/components/media/DrawText.tsx:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L41)

***

### \_contentEl

```ts
_contentEl: HTMLSpanElement | null = null;
```

Defined in: [website/components/media/DrawText.tsx:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L42)

***

### \_fitObserver

```ts
_fitObserver: ResizeObserver | null = null;
```

Defined in: [website/components/media/DrawText.tsx:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L43)

***

### \_effectiveOffset

```ts
_effectiveOffset: number | null = null;
```

Defined in: [website/components/media/DrawText.tsx:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L44)

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

```ts
HTMLElement.onbeforexrselect
```

***

### ariaActiveDescendantElement

```ts
ariaActiveDescendantElement: Element | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3242

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaActiveDescendantElement)

#### Inherited from

```ts
HTMLElement.ariaActiveDescendantElement
```

***

### ariaAtomic

```ts
ariaAtomic: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3244

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaAtomic)

#### Inherited from

```ts
HTMLElement.ariaAtomic
```

***

### ariaAutoComplete

```ts
ariaAutoComplete: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3246

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaAutoComplete)

#### Inherited from

```ts
HTMLElement.ariaAutoComplete
```

***

### ariaBrailleLabel

```ts
ariaBrailleLabel: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3248

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaBrailleLabel)

#### Inherited from

```ts
HTMLElement.ariaBrailleLabel
```

***

### ariaBrailleRoleDescription

```ts
ariaBrailleRoleDescription: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3250

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaBrailleRoleDescription)

#### Inherited from

```ts
HTMLElement.ariaBrailleRoleDescription
```

***

### ariaBusy

```ts
ariaBusy: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3252

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaBusy)

#### Inherited from

```ts
HTMLElement.ariaBusy
```

***

### ariaChecked

```ts
ariaChecked: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3254

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaChecked)

#### Inherited from

```ts
HTMLElement.ariaChecked
```

***

### ariaColCount

```ts
ariaColCount: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3256

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaColCount)

#### Inherited from

```ts
HTMLElement.ariaColCount
```

***

### ariaColIndex

```ts
ariaColIndex: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3258

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaColIndex)

#### Inherited from

```ts
HTMLElement.ariaColIndex
```

***

### ariaColIndexText

```ts
ariaColIndexText: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3260

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaColIndexText)

#### Inherited from

```ts
HTMLElement.ariaColIndexText
```

***

### ariaColSpan

```ts
ariaColSpan: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3262

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaColSpan)

#### Inherited from

```ts
HTMLElement.ariaColSpan
```

***

### ariaControlsElements

```ts
ariaControlsElements: readonly Element[] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3264

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaControlsElements)

#### Inherited from

```ts
HTMLElement.ariaControlsElements
```

***

### ariaCurrent

```ts
ariaCurrent: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3266

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaCurrent)

#### Inherited from

```ts
HTMLElement.ariaCurrent
```

***

### ariaDescribedByElements

```ts
ariaDescribedByElements: readonly Element[] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3268

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaDescribedByElements)

#### Inherited from

```ts
HTMLElement.ariaDescribedByElements
```

***

### ariaDescription

```ts
ariaDescription: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3270

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaDescription)

#### Inherited from

```ts
HTMLElement.ariaDescription
```

***

### ariaDetailsElements

```ts
ariaDetailsElements: readonly Element[] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3272

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaDetailsElements)

#### Inherited from

```ts
HTMLElement.ariaDetailsElements
```

***

### ariaDisabled

```ts
ariaDisabled: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3274

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaDisabled)

#### Inherited from

```ts
HTMLElement.ariaDisabled
```

***

### ariaErrorMessageElements

```ts
ariaErrorMessageElements: readonly Element[] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3276

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaErrorMessageElements)

#### Inherited from

```ts
HTMLElement.ariaErrorMessageElements
```

***

### ariaExpanded

```ts
ariaExpanded: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3278

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaExpanded)

#### Inherited from

```ts
HTMLElement.ariaExpanded
```

***

### ariaFlowToElements

```ts
ariaFlowToElements: readonly Element[] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3280

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaFlowToElements)

#### Inherited from

```ts
HTMLElement.ariaFlowToElements
```

***

### ariaHasPopup

```ts
ariaHasPopup: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3282

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaHasPopup)

#### Inherited from

```ts
HTMLElement.ariaHasPopup
```

***

### ariaHidden

```ts
ariaHidden: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3284

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaHidden)

#### Inherited from

```ts
HTMLElement.ariaHidden
```

***

### ariaInvalid

```ts
ariaInvalid: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3286

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaInvalid)

#### Inherited from

```ts
HTMLElement.ariaInvalid
```

***

### ariaKeyShortcuts

```ts
ariaKeyShortcuts: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3288

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaKeyShortcuts)

#### Inherited from

```ts
HTMLElement.ariaKeyShortcuts
```

***

### ariaLabel

```ts
ariaLabel: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3290

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaLabel)

#### Inherited from

```ts
HTMLElement.ariaLabel
```

***

### ariaLabelledByElements

```ts
ariaLabelledByElements: readonly Element[] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3292

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaLabelledByElements)

#### Inherited from

```ts
HTMLElement.ariaLabelledByElements
```

***

### ariaLevel

```ts
ariaLevel: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3294

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaLevel)

#### Inherited from

```ts
HTMLElement.ariaLevel
```

***

### ariaLive

```ts
ariaLive: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3296

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaLive)

#### Inherited from

```ts
HTMLElement.ariaLive
```

***

### ariaModal

```ts
ariaModal: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3298

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaModal)

#### Inherited from

```ts
HTMLElement.ariaModal
```

***

### ariaMultiLine

```ts
ariaMultiLine: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3300

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaMultiLine)

#### Inherited from

```ts
HTMLElement.ariaMultiLine
```

***

### ariaMultiSelectable

```ts
ariaMultiSelectable: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3302

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaMultiSelectable)

#### Inherited from

```ts
HTMLElement.ariaMultiSelectable
```

***

### ariaOrientation

```ts
ariaOrientation: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3304

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaOrientation)

#### Inherited from

```ts
HTMLElement.ariaOrientation
```

***

### ariaOwnsElements

```ts
ariaOwnsElements: readonly Element[] | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3306

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaOwnsElements)

#### Inherited from

```ts
HTMLElement.ariaOwnsElements
```

***

### ariaPlaceholder

```ts
ariaPlaceholder: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3308

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaPlaceholder)

#### Inherited from

```ts
HTMLElement.ariaPlaceholder
```

***

### ariaPosInSet

```ts
ariaPosInSet: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3310

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaPosInSet)

#### Inherited from

```ts
HTMLElement.ariaPosInSet
```

***

### ariaPressed

```ts
ariaPressed: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3312

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaPressed)

#### Inherited from

```ts
HTMLElement.ariaPressed
```

***

### ariaReadOnly

```ts
ariaReadOnly: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3314

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaReadOnly)

#### Inherited from

```ts
HTMLElement.ariaReadOnly
```

***

### ariaRelevant

```ts
ariaRelevant: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3316

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRelevant)

#### Inherited from

```ts
HTMLElement.ariaRelevant
```

***

### ariaRequired

```ts
ariaRequired: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3318

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRequired)

#### Inherited from

```ts
HTMLElement.ariaRequired
```

***

### ariaRoleDescription

```ts
ariaRoleDescription: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3320

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRoleDescription)

#### Inherited from

```ts
HTMLElement.ariaRoleDescription
```

***

### ariaRowCount

```ts
ariaRowCount: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3322

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRowCount)

#### Inherited from

```ts
HTMLElement.ariaRowCount
```

***

### ariaRowIndex

```ts
ariaRowIndex: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3324

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRowIndex)

#### Inherited from

```ts
HTMLElement.ariaRowIndex
```

***

### ariaRowIndexText

```ts
ariaRowIndexText: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3326

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRowIndexText)

#### Inherited from

```ts
HTMLElement.ariaRowIndexText
```

***

### ariaRowSpan

```ts
ariaRowSpan: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3328

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRowSpan)

#### Inherited from

```ts
HTMLElement.ariaRowSpan
```

***

### ariaSelected

```ts
ariaSelected: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3330

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaSelected)

#### Inherited from

```ts
HTMLElement.ariaSelected
```

***

### ariaSetSize

```ts
ariaSetSize: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3332

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaSetSize)

#### Inherited from

```ts
HTMLElement.ariaSetSize
```

***

### ariaSort

```ts
ariaSort: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3334

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaSort)

#### Inherited from

```ts
HTMLElement.ariaSort
```

***

### ariaValueMax

```ts
ariaValueMax: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3336

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaValueMax)

#### Inherited from

```ts
HTMLElement.ariaValueMax
```

***

### ariaValueMin

```ts
ariaValueMin: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3338

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaValueMin)

#### Inherited from

```ts
HTMLElement.ariaValueMin
```

***

### ariaValueNow

```ts
ariaValueNow: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3340

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaValueNow)

#### Inherited from

```ts
HTMLElement.ariaValueNow
```

***

### ariaValueText

```ts
ariaValueText: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3342

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaValueText)

#### Inherited from

```ts
HTMLElement.ariaValueText
```

***

### role

```ts
role: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3344

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/role)

#### Inherited from

```ts
HTMLElement.role
```

***

### attributes

```ts
readonly attributes: NamedNodeMap;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13514

The **`Element.attributes`** property returns a live collection of all attribute nodes registered to the specified node. It is a NamedNodeMap, not an Array, so it has no Array methods and the Attr nodes' indexes may differ among browsers. To be more specific, attributes is a key/value pair of strings that represents any information regarding that attribute.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/attributes)

#### Inherited from

```ts
HTMLElement.attributes
```

***

### className

```ts
className: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13527

The **`className`** property of the Element interface gets and sets the value of the class attribute of the specified element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/className)

#### Inherited from

```ts
HTMLElement.className
```

***

### clientHeight

```ts
readonly clientHeight: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13533

The **`clientHeight`** read-only property of the Element interface is zero for elements with no CSS or inline layout boxes; otherwise, it's the inner height of an element in pixels. It includes padding but excludes borders, margins, and horizontal scrollbars (if present).

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/clientHeight)

#### Inherited from

```ts
HTMLElement.clientHeight
```

***

### clientLeft

```ts
readonly clientLeft: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13539

The **`clientLeft`** read-only property of the Element interface returns the width of the left border of an element in pixels. It includes the width of the vertical scrollbar if the text direction of the element is right-to-left and if there is an overflow causing a left vertical scrollbar to be rendered. clientLeft does not include the left margin or the left padding.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/clientLeft)

#### Inherited from

```ts
HTMLElement.clientLeft
```

***

### clientTop

```ts
readonly clientTop: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13545

The **`clientTop`** read-only property of the Element interface returns the width of the top border of an element in pixels.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/clientTop)

#### Inherited from

```ts
HTMLElement.clientTop
```

***

### clientWidth

```ts
readonly clientWidth: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13551

The **`clientWidth`** read-only property of the Element interface is zero for inline elements and elements with no CSS; otherwise, it's the inner width of an element in pixels. It includes padding but excludes borders, margins, and vertical scrollbars (if present).

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/clientWidth)

#### Inherited from

```ts
HTMLElement.clientWidth
```

***

### currentCSSZoom

```ts
readonly currentCSSZoom: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13557

The **`currentCSSZoom`** read-only property of the Element interface provides the "effective" CSS zoom of an element, taking into account the zoom applied to the element and all its parent elements.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/currentCSSZoom)

#### Inherited from

```ts
HTMLElement.currentCSSZoom
```

***

### customElementRegistry

```ts
readonly customElementRegistry: CustomElementRegistry | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13558

#### Inherited from

```ts
HTMLElement.customElementRegistry
```

***

### id

```ts
id: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13564

The **`id`** property of the Element interface represents the element's identifier, reflecting the id global attribute.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/id)

#### Inherited from

```ts
HTMLElement.id
```

***

### innerHTML

```ts
innerHTML: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13570

The **`innerHTML`** property of the Element interface gets or sets the HTML or XML markup contained within the element, omitting any shadow roots in both cases.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/innerHTML)

#### Inherited from

```ts
HTMLElement.innerHTML
```

***

### localName

```ts
readonly localName: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13576

The **`Element.localName`** read-only property returns the local part of the qualified name of an element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/localName)

#### Inherited from

```ts
HTMLElement.localName
```

***

### namespaceURI

```ts
readonly namespaceURI: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13582

The **`Element.namespaceURI`** read-only property returns the namespace URI of the element, or null if the element is not in a namespace.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/namespaceURI)

#### Inherited from

```ts
HTMLElement.namespaceURI
```

***

### onfullscreenchange

```ts
onfullscreenchange: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13584

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/fullscreenchange_event)

#### Inherited from

```ts
HTMLElement.onfullscreenchange
```

***

### onfullscreenerror

```ts
onfullscreenerror: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13586

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/fullscreenerror_event)

#### Inherited from

```ts
HTMLElement.onfullscreenerror
```

***

### outerHTML

```ts
outerHTML: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13592

The **`outerHTML`** attribute of the Element interface gets or sets the HTML or XML markup of the element and its descendants, omitting any shadow roots in both cases.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/outerHTML)

#### Inherited from

```ts
HTMLElement.outerHTML
```

***

### ownerDocument

```ts
readonly ownerDocument: Document;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13593

The read-only **`ownerDocument`** property of the Node interface returns the top-level document object of the node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/ownerDocument)

#### Inherited from

```ts
HTMLElement.ownerDocument
```

***

### prefix

```ts
readonly prefix: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13606

The **`Element.prefix`** read-only property returns the namespace prefix of the specified element, or null if no prefix is specified.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/prefix)

#### Inherited from

```ts
HTMLElement.prefix
```

***

### scrollHeight

```ts
readonly scrollHeight: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13612

The **`scrollHeight`** read-only property of the Element interface is a measurement of the height of an element's content, including content not visible on the screen due to overflow.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollHeight)

#### Inherited from

```ts
HTMLElement.scrollHeight
```

***

### scrollLeft

```ts
scrollLeft: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13618

The **`scrollLeft`** property of the Element interface gets or sets the number of pixels by which an element's content is scrolled from its left edge. This value is subpixel precise in modern browsers, meaning that it isn't necessarily a whole number.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollLeft)

#### Inherited from

```ts
HTMLElement.scrollLeft
```

***

### scrollTop

```ts
scrollTop: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13624

The **`scrollTop`** property of the Element interface gets or sets the number of pixels by which an element's content is scrolled from its top edge. This value is subpixel precise in modern browsers, meaning that it isn't necessarily a whole number.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollTop)

#### Inherited from

```ts
HTMLElement.scrollTop
```

***

### scrollWidth

```ts
readonly scrollWidth: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13630

The **`scrollWidth`** read-only property of the Element interface is a measurement of the width of an element's content, including content not visible on the screen due to overflow.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollWidth)

#### Inherited from

```ts
HTMLElement.scrollWidth
```

***

### shadowRoot

```ts
readonly shadowRoot: ShadowRoot | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13636

The **`Element.shadowRoot`** read-only property represents the shadow root hosted by the element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/shadowRoot)

#### Inherited from

```ts
HTMLElement.shadowRoot
```

***

### slot

```ts
slot: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13642

The **`slot`** property of the Element interface returns the name of the shadow DOM slot the element is inserted in.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/slot)

#### Inherited from

```ts
HTMLElement.slot
```

***

### tagName

```ts
readonly tagName: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13648

The **`tagName`** read-only property of the Element interface returns the tag name of the element on which it's called.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/tagName)

#### Inherited from

```ts
HTMLElement.tagName
```

***

### attributeStyleMap

```ts
readonly attributeStyleMap: StylePropertyMap;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13928

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/attributeStyleMap)

#### Inherited from

```ts
HTMLElement.attributeStyleMap
```

***

### contentEditable

```ts
contentEditable: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13936

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/contentEditable)

#### Inherited from

```ts
HTMLElement.contentEditable
```

***

### enterKeyHint

```ts
enterKeyHint: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13938

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/enterKeyHint)

#### Inherited from

```ts
HTMLElement.enterKeyHint
```

***

### inputMode

```ts
inputMode: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13940

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/inputMode)

#### Inherited from

```ts
HTMLElement.inputMode
```

***

### isContentEditable

```ts
readonly isContentEditable: boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:13942

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/isContentEditable)

#### Inherited from

```ts
HTMLElement.isContentEditable
```

***

### onabort

```ts
onabort: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16764

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/abort_event)

#### Inherited from

```ts
HTMLElement.onabort
```

***

### onanimationcancel

```ts
onanimationcancel: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16766

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationcancel_event)

#### Inherited from

```ts
HTMLElement.onanimationcancel
```

***

### onanimationend

```ts
onanimationend: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16768

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationend_event)

#### Inherited from

```ts
HTMLElement.onanimationend
```

***

### onanimationiteration

```ts
onanimationiteration: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16770

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationiteration_event)

#### Inherited from

```ts
HTMLElement.onanimationiteration
```

***

### onanimationstart

```ts
onanimationstart: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16772

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationstart_event)

#### Inherited from

```ts
HTMLElement.onanimationstart
```

***

### onauxclick

```ts
onauxclick: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16774

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/auxclick_event)

#### Inherited from

```ts
HTMLElement.onauxclick
```

***

### onbeforeinput

```ts
onbeforeinput: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16776

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/beforeinput_event)

#### Inherited from

```ts
HTMLElement.onbeforeinput
```

***

### onbeforematch

```ts
onbeforematch: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16778

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/beforematch_event)

#### Inherited from

```ts
HTMLElement.onbeforematch
```

***

### onbeforetoggle

```ts
onbeforetoggle: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16780

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/beforetoggle_event)

#### Inherited from

```ts
HTMLElement.onbeforetoggle
```

***

### onblur

```ts
onblur: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16782

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/blur_event)

#### Inherited from

```ts
HTMLElement.onblur
```

***

### oncancel

```ts
oncancel: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16784

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/cancel_event)

#### Inherited from

```ts
HTMLElement.oncancel
```

***

### oncanplay

```ts
oncanplay: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16786

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/canplay_event)

#### Inherited from

```ts
HTMLElement.oncanplay
```

***

### oncanplaythrough

```ts
oncanplaythrough: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16788

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/canplaythrough_event)

#### Inherited from

```ts
HTMLElement.oncanplaythrough
```

***

### onchange

```ts
onchange: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16790

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/change_event)

#### Inherited from

```ts
HTMLElement.onchange
```

***

### onclick

```ts
onclick: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16792

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/click_event)

#### Inherited from

```ts
HTMLElement.onclick
```

***

### onclose

```ts
onclose: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16794

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/close_event)

#### Inherited from

```ts
HTMLElement.onclose
```

***

### oncommand

```ts
oncommand: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16796

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/command_event)

#### Inherited from

```ts
HTMLElement.oncommand
```

***

### oncontextlost

```ts
oncontextlost: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16798

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/contextlost_event)

#### Inherited from

```ts
HTMLElement.oncontextlost
```

***

### oncontextmenu

```ts
oncontextmenu: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16800

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/contextmenu_event)

#### Inherited from

```ts
HTMLElement.oncontextmenu
```

***

### oncontextrestored

```ts
oncontextrestored: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16802

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/contextrestored_event)

#### Inherited from

```ts
HTMLElement.oncontextrestored
```

***

### oncopy

```ts
oncopy: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16804

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/copy_event)

#### Inherited from

```ts
HTMLElement.oncopy
```

***

### oncuechange

```ts
oncuechange: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16806

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTrackElement/cuechange_event)

#### Inherited from

```ts
HTMLElement.oncuechange
```

***

### oncut

```ts
oncut: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16808

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/cut_event)

#### Inherited from

```ts
HTMLElement.oncut
```

***

### ondblclick

```ts
ondblclick: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16810

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/dblclick_event)

#### Inherited from

```ts
HTMLElement.ondblclick
```

***

### ondrag

```ts
ondrag: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16812

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/drag_event)

#### Inherited from

```ts
HTMLElement.ondrag
```

***

### ondragend

```ts
ondragend: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16814

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragend_event)

#### Inherited from

```ts
HTMLElement.ondragend
```

***

### ondragenter

```ts
ondragenter: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16816

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragenter_event)

#### Inherited from

```ts
HTMLElement.ondragenter
```

***

### ondragleave

```ts
ondragleave: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16818

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragleave_event)

#### Inherited from

```ts
HTMLElement.ondragleave
```

***

### ondragover

```ts
ondragover: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16820

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragover_event)

#### Inherited from

```ts
HTMLElement.ondragover
```

***

### ondragstart

```ts
ondragstart: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16822

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragstart_event)

#### Inherited from

```ts
HTMLElement.ondragstart
```

***

### ondrop

```ts
ondrop: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16824

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/drop_event)

#### Inherited from

```ts
HTMLElement.ondrop
```

***

### ondurationchange

```ts
ondurationchange: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16826

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/durationchange_event)

#### Inherited from

```ts
HTMLElement.ondurationchange
```

***

### onemptied

```ts
onemptied: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16828

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/emptied_event)

#### Inherited from

```ts
HTMLElement.onemptied
```

***

### onended

```ts
onended: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16830

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/ended_event)

#### Inherited from

```ts
HTMLElement.onended
```

***

### onerror

```ts
onerror: OnErrorEventHandler;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16832

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/error_event)

#### Inherited from

```ts
HTMLElement.onerror
```

***

### onfocus

```ts
onfocus: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16834

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/focus_event)

#### Inherited from

```ts
HTMLElement.onfocus
```

***

### onformdata

```ts
onformdata: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16836

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/formdata_event)

#### Inherited from

```ts
HTMLElement.onformdata
```

***

### ongotpointercapture

```ts
ongotpointercapture: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16838

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/gotpointercapture_event)

#### Inherited from

```ts
HTMLElement.ongotpointercapture
```

***

### oninput

```ts
oninput: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16840

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/input_event)

#### Inherited from

```ts
HTMLElement.oninput
```

***

### oninvalid

```ts
oninvalid: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16842

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/invalid_event)

#### Inherited from

```ts
HTMLElement.oninvalid
```

***

### onkeydown

```ts
onkeydown: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16844

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/keydown_event)

#### Inherited from

```ts
HTMLElement.onkeydown
```

***

### ~~onkeypress~~

```ts
onkeypress: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16850

#### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/keypress_event)

#### Inherited from

```ts
HTMLElement.onkeypress
```

***

### onkeyup

```ts
onkeyup: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16852

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/keyup_event)

#### Inherited from

```ts
HTMLElement.onkeyup
```

***

### onload

```ts
onload: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16854

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/load_event)

#### Inherited from

```ts
HTMLElement.onload
```

***

### onloadeddata

```ts
onloadeddata: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16856

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadeddata_event)

#### Inherited from

```ts
HTMLElement.onloadeddata
```

***

### onloadedmetadata

```ts
onloadedmetadata: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16858

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadedmetadata_event)

#### Inherited from

```ts
HTMLElement.onloadedmetadata
```

***

### onloadstart

```ts
onloadstart: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16860

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadstart_event)

#### Inherited from

```ts
HTMLElement.onloadstart
```

***

### onlostpointercapture

```ts
onlostpointercapture: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16862

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/lostpointercapture_event)

#### Inherited from

```ts
HTMLElement.onlostpointercapture
```

***

### onmousedown

```ts
onmousedown: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16864

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mousedown_event)

#### Inherited from

```ts
HTMLElement.onmousedown
```

***

### onmouseenter

```ts
onmouseenter: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16866

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseenter_event)

#### Inherited from

```ts
HTMLElement.onmouseenter
```

***

### onmouseleave

```ts
onmouseleave: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16868

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseleave_event)

#### Inherited from

```ts
HTMLElement.onmouseleave
```

***

### onmousemove

```ts
onmousemove: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16870

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mousemove_event)

#### Inherited from

```ts
HTMLElement.onmousemove
```

***

### onmouseout

```ts
onmouseout: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16872

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseout_event)

#### Inherited from

```ts
HTMLElement.onmouseout
```

***

### onmouseover

```ts
onmouseover: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16874

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseover_event)

#### Inherited from

```ts
HTMLElement.onmouseover
```

***

### onmouseup

```ts
onmouseup: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16876

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseup_event)

#### Inherited from

```ts
HTMLElement.onmouseup
```

***

### onpaste

```ts
onpaste: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16878

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/paste_event)

#### Inherited from

```ts
HTMLElement.onpaste
```

***

### onpause

```ts
onpause: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16880

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/pause_event)

#### Inherited from

```ts
HTMLElement.onpause
```

***

### onplay

```ts
onplay: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16882

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/play_event)

#### Inherited from

```ts
HTMLElement.onplay
```

***

### onplaying

```ts
onplaying: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16884

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/playing_event)

#### Inherited from

```ts
HTMLElement.onplaying
```

***

### onpointercancel

```ts
onpointercancel: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16886

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointercancel_event)

#### Inherited from

```ts
HTMLElement.onpointercancel
```

***

### onpointerdown

```ts
onpointerdown: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16888

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerdown_event)

#### Inherited from

```ts
HTMLElement.onpointerdown
```

***

### onpointerenter

```ts
onpointerenter: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16890

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerenter_event)

#### Inherited from

```ts
HTMLElement.onpointerenter
```

***

### onpointerleave

```ts
onpointerleave: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16892

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerleave_event)

#### Inherited from

```ts
HTMLElement.onpointerleave
```

***

### onpointermove

```ts
onpointermove: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16894

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointermove_event)

#### Inherited from

```ts
HTMLElement.onpointermove
```

***

### onpointerout

```ts
onpointerout: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16896

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerout_event)

#### Inherited from

```ts
HTMLElement.onpointerout
```

***

### onpointerover

```ts
onpointerover: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16898

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerover_event)

#### Inherited from

```ts
HTMLElement.onpointerover
```

***

### onpointerrawupdate

```ts
onpointerrawupdate: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16904

Available only in secure contexts.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerrawupdate_event)

#### Inherited from

```ts
HTMLElement.onpointerrawupdate
```

***

### onpointerup

```ts
onpointerup: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16906

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerup_event)

#### Inherited from

```ts
HTMLElement.onpointerup
```

***

### onprogress

```ts
onprogress: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16908

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/progress_event)

#### Inherited from

```ts
HTMLElement.onprogress
```

***

### onratechange

```ts
onratechange: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16910

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/ratechange_event)

#### Inherited from

```ts
HTMLElement.onratechange
```

***

### onreset

```ts
onreset: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16912

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/reset_event)

#### Inherited from

```ts
HTMLElement.onreset
```

***

### onresize

```ts
onresize: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16914

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement/resize_event)

#### Inherited from

```ts
HTMLElement.onresize
```

***

### onscroll

```ts
onscroll: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16916

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/scroll_event)

#### Inherited from

```ts
HTMLElement.onscroll
```

***

### onscrollend

```ts
onscrollend: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16918

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/scrollend_event)

#### Inherited from

```ts
HTMLElement.onscrollend
```

***

### onsecuritypolicyviolation

```ts
onsecuritypolicyviolation: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16920

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/securitypolicyviolation_event)

#### Inherited from

```ts
HTMLElement.onsecuritypolicyviolation
```

***

### onseeked

```ts
onseeked: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16922

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/seeked_event)

#### Inherited from

```ts
HTMLElement.onseeked
```

***

### onseeking

```ts
onseeking: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16924

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/seeking_event)

#### Inherited from

```ts
HTMLElement.onseeking
```

***

### onselect

```ts
onselect: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16926

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/select_event)

#### Inherited from

```ts
HTMLElement.onselect
```

***

### onselectionchange

```ts
onselectionchange: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16928

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/selectionchange_event)

#### Inherited from

```ts
HTMLElement.onselectionchange
```

***

### onselectstart

```ts
onselectstart: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16930

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/selectstart_event)

#### Inherited from

```ts
HTMLElement.onselectstart
```

***

### onslotchange

```ts
onslotchange: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16932

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSlotElement/slotchange_event)

#### Inherited from

```ts
HTMLElement.onslotchange
```

***

### onstalled

```ts
onstalled: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16934

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/stalled_event)

#### Inherited from

```ts
HTMLElement.onstalled
```

***

### onsubmit

```ts
onsubmit: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16936

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/submit_event)

#### Inherited from

```ts
HTMLElement.onsubmit
```

***

### onsuspend

```ts
onsuspend: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16938

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/suspend_event)

#### Inherited from

```ts
HTMLElement.onsuspend
```

***

### ontimeupdate

```ts
ontimeupdate: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16940

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/timeupdate_event)

#### Inherited from

```ts
HTMLElement.ontimeupdate
```

***

### ontoggle

```ts
ontoggle: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16942

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/toggle_event)

#### Inherited from

```ts
HTMLElement.ontoggle
```

***

### ontouchcancel?

```ts
optional ontouchcancel?: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16944

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchcancel_event)

#### Inherited from

```ts
HTMLElement.ontouchcancel
```

***

### ontouchend?

```ts
optional ontouchend?: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16946

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchend_event)

#### Inherited from

```ts
HTMLElement.ontouchend
```

***

### ontouchmove?

```ts
optional ontouchmove?: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16948

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchmove_event)

#### Inherited from

```ts
HTMLElement.ontouchmove
```

***

### ontouchstart?

```ts
optional ontouchstart?: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16950

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchstart_event)

#### Inherited from

```ts
HTMLElement.ontouchstart
```

***

### ontransitioncancel

```ts
ontransitioncancel: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16952

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitioncancel_event)

#### Inherited from

```ts
HTMLElement.ontransitioncancel
```

***

### ontransitionend

```ts
ontransitionend: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16954

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionend_event)

#### Inherited from

```ts
HTMLElement.ontransitionend
```

***

### ontransitionrun

```ts
ontransitionrun: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16956

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionrun_event)

#### Inherited from

```ts
HTMLElement.ontransitionrun
```

***

### ontransitionstart

```ts
ontransitionstart: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16958

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionstart_event)

#### Inherited from

```ts
HTMLElement.ontransitionstart
```

***

### onvolumechange

```ts
onvolumechange: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16960

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/volumechange_event)

#### Inherited from

```ts
HTMLElement.onvolumechange
```

***

### onwaiting

```ts
onwaiting: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16962

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/waiting_event)

#### Inherited from

```ts
HTMLElement.onwaiting
```

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

```ts
HTMLElement.onwebkitanimationend
```

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

```ts
HTMLElement.onwebkitanimationiteration
```

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

```ts
HTMLElement.onwebkitanimationstart
```

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

```ts
HTMLElement.onwebkittransitionend
```

***

### onwheel

```ts
onwheel: ((this, ev) => any) | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:16988

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/wheel_event)

#### Inherited from

```ts
HTMLElement.onwheel
```

***

### accessKey

```ts
accessKey: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17735

The **`HTMLElement.accessKey`** property sets the keystroke which a user can press to jump to a given element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/accessKey)

#### Inherited from

```ts
HTMLElement.accessKey
```

***

### accessKeyLabel

```ts
readonly accessKeyLabel: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17741

The **`HTMLElement.accessKeyLabel`** read-only property returns a string containing the element's browser-assigned access key (if any); otherwise it returns an empty string.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/accessKeyLabel)

#### Inherited from

```ts
HTMLElement.accessKeyLabel
```

***

### autocapitalize

```ts
autocapitalize: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17747

The **`autocapitalize`** property of the HTMLElement interface represents the element's capitalization behavior for user input. It is available on all HTML elements, though it doesn't affect all of them, including:

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/autocapitalize)

#### Inherited from

```ts
HTMLElement.autocapitalize
```

***

### autocorrect

```ts
autocorrect: boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17753

The **`autocorrect`** property of the HTMLElement interface controls whether or not autocorrection of editable text is enabled for spelling and/or punctuation errors.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/autocorrect)

#### Inherited from

```ts
HTMLElement.autocorrect
```

***

### dir

```ts
dir: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17759

The **`HTMLElement.dir`** property indicates the text writing directionality of the content of the current element. It reflects the element's dir attribute.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dir)

#### Inherited from

```ts
HTMLElement.dir
```

***

### draggable

```ts
draggable: boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17765

The **`draggable`** property of the HTMLElement interface gets and sets a Boolean primitive indicating if the element is draggable.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/draggable)

#### Inherited from

```ts
HTMLElement.draggable
```

***

### hidden

```ts
hidden: boolean | "until-found";
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17771

The HTMLElement property **`hidden`** reflects the value of the element's hidden attribute.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/hidden)

#### Inherited from

```ts
HTMLElement.hidden
```

***

### inert

```ts
inert: boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17777

The HTMLElement property **`inert`** reflects the value of the element's inert attribute. It is a boolean value that, when present, makes the browser "ignore" user input events for the element, including focus events and events from assistive technologies. The browser may also ignore page search and text selection in the element. This can be useful when building UIs such as modals where you would want to "trap" the focus inside the modal when it's visible.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/inert)

#### Inherited from

```ts
HTMLElement.inert
```

***

### innerText

```ts
innerText: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17783

The **`innerText`** property of the HTMLElement interface represents the rendered text content of a node and its descendants.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/innerText)

#### Inherited from

```ts
HTMLElement.innerText
```

***

### lang

```ts
lang: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17789

The **`lang`** property of the HTMLElement interface indicates the base language of an element's attribute values and text content, in the form of a BCP 47 language tag. It reflects the element's lang attribute; the xml:lang attribute does not affect this property.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/lang)

#### Inherited from

```ts
HTMLElement.lang
```

***

### offsetHeight

```ts
readonly offsetHeight: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17795

The **`offsetHeight`** read-only property of the HTMLElement interface returns the height of an element, including vertical padding and borders, as an integer.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/offsetHeight)

#### Inherited from

```ts
HTMLElement.offsetHeight
```

***

### offsetLeft

```ts
readonly offsetLeft: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17801

The **`offsetLeft`** read-only property of the HTMLElement interface returns the number of pixels that the upper left corner of the current element is offset to the left within the HTMLElement.offsetParent node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/offsetLeft)

#### Inherited from

```ts
HTMLElement.offsetLeft
```

***

### offsetParent

```ts
readonly offsetParent: Element | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17807

The **`HTMLElement.offsetParent`** read-only property returns a reference to the element which is the closest (nearest in the containment hierarchy) positioned ancestor element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/offsetParent)

#### Inherited from

```ts
HTMLElement.offsetParent
```

***

### offsetTop

```ts
readonly offsetTop: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17813

The **`offsetTop`** read-only property of the HTMLElement interface returns the distance from the outer border of the current element (including its margin) to the top padding edge of the offsetParent, the closest positioned ancestor element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/offsetTop)

#### Inherited from

```ts
HTMLElement.offsetTop
```

***

### offsetWidth

```ts
readonly offsetWidth: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17819

The **`offsetWidth`** read-only property of the HTMLElement interface returns the layout width of an element as an integer.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/offsetWidth)

#### Inherited from

```ts
HTMLElement.offsetWidth
```

***

### outerText

```ts
outerText: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17825

The **`outerText`** property of the HTMLElement interface returns the same value as HTMLElement.innerText. When used as a setter it replaces the whole current node with the given text (this differs from innerText, which replaces the content inside the current node).

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/outerText)

#### Inherited from

```ts
HTMLElement.outerText
```

***

### popover

```ts
popover: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17831

The **`popover`** property of the HTMLElement interface gets and sets an element's popover state via JavaScript ("auto", "hint", or "manual"), and can be used for feature detection.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/popover)

#### Inherited from

```ts
HTMLElement.popover
```

***

### spellcheck

```ts
spellcheck: boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17837

The **`spellcheck`** property of the HTMLElement interface represents a boolean value that controls the spell-checking hint. It is available on all HTML elements, though it doesn't affect all of them.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/spellcheck)

#### Inherited from

```ts
HTMLElement.spellcheck
```

***

### title

```ts
title: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17843

The **`HTMLElement.title`** property represents the title of the element: the text usually displayed in a 'tooltip' popup when the mouse is over the node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/title)

#### Inherited from

```ts
HTMLElement.title
```

***

### translate

```ts
translate: boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17849

The **`translate`** property of the HTMLElement interface indicates whether an element's attribute values and the values of its Text node children are to be translated when the page is localized, or whether to leave them unchanged.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/translate)

#### Inherited from

```ts
HTMLElement.translate
```

***

### writingSuggestions

```ts
writingSuggestions: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:17855

The **`writingSuggestions`** property of the HTMLElement interface is a string indicating if browser-provided writing suggestions should be enabled under the scope of the element or not.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/writingSuggestions)

#### Inherited from

```ts
HTMLElement.writingSuggestions
```

***

### autofocus

```ts
autofocus: boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:20122

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/autofocus)

#### Inherited from

```ts
HTMLElement.autofocus
```

***

### dataset

```ts
readonly dataset: DOMStringMap;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:20124

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dataset)

#### Inherited from

```ts
HTMLElement.dataset
```

***

### nonce

```ts
nonce: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:20126

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/nonce)

#### Inherited from

```ts
HTMLElement.nonce
```

***

### tabIndex

```ts
tabIndex: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:20128

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/tabIndex)

#### Inherited from

```ts
HTMLElement.tabIndex
```

***

### baseURI

```ts
readonly baseURI: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26041

The read-only **`baseURI`** property of the Node interface returns the absolute base URL of the document containing the node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/baseURI)

#### Inherited from

```ts
HTMLElement.baseURI
```

***

### childNodes

```ts
readonly childNodes: NodeListOf<ChildNode>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26047

The read-only **`childNodes`** property of the Node interface returns a live NodeList of child nodes of the given element where the first child node is assigned index 0. Child nodes include elements, text and comments.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/childNodes)

#### Inherited from

```ts
HTMLElement.childNodes
```

***

### firstChild

```ts
readonly firstChild: ChildNode | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26053

The read-only **`firstChild`** property of the Node interface returns the node's first child in the tree, or null if the node has no children.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/firstChild)

#### Inherited from

```ts
HTMLElement.firstChild
```

***

### isConnected

```ts
readonly isConnected: boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26059

The read-only **`isConnected`** property of the Node interface returns a boolean indicating whether the node is connected (directly or indirectly) to a Document object.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/isConnected)

#### Inherited from

```ts
HTMLElement.isConnected
```

***

### lastChild

```ts
readonly lastChild: ChildNode | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26065

The read-only **`lastChild`** property of the Node interface returns the last child of the node, or null if there are no child nodes.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/lastChild)

#### Inherited from

```ts
HTMLElement.lastChild
```

***

### nextSibling

```ts
readonly nextSibling: ChildNode | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26071

The read-only **`nextSibling`** property of the Node interface returns the node immediately following the specified one in their parent's childNodes, or returns null if the specified node is the last child in the parent element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)

#### Inherited from

```ts
HTMLElement.nextSibling
```

***

### nodeName

```ts
readonly nodeName: string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26077

The read-only **`nodeName`** property of Node returns the name of the current node as a string.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/nodeName)

#### Inherited from

```ts
HTMLElement.nodeName
```

***

### nodeType

```ts
readonly nodeType: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26083

The read-only **`nodeType`** property of a Node interface is an integer that identifies what the node is. It distinguishes different kinds of nodes from each other, such as elements, text, and comments.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/nodeType)

#### Inherited from

```ts
HTMLElement.nodeType
```

***

### nodeValue

```ts
nodeValue: string | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26089

The **`nodeValue`** property of the Node interface returns or sets the value of the current node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/nodeValue)

#### Inherited from

```ts
HTMLElement.nodeValue
```

***

### parentElement

```ts
readonly parentElement: HTMLElement | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26101

The read-only **`parentElement`** property of Node interface returns the DOM node's parent Element, or null if the node either has no parent, or its parent isn't a DOM Element. Node.parentNode on the other hand returns any kind of parent, regardless of its type.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/parentElement)

#### Inherited from

```ts
HTMLElement.parentElement
```

***

### parentNode

```ts
readonly parentNode: ParentNode | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26107

The read-only **`parentNode`** property of the Node interface returns the parent of the specified node in the DOM tree.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/parentNode)

#### Inherited from

```ts
HTMLElement.parentNode
```

***

### previousSibling

```ts
readonly previousSibling: ChildNode | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26113

The read-only **`previousSibling`** property of the Node interface returns the node immediately preceding the specified one in its parent's childNodes list, or null if the specified node is the first in that list.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/previousSibling)

#### Inherited from

```ts
HTMLElement.previousSibling
```

***

### ELEMENT\_NODE

```ts
readonly ELEMENT_NODE: 1;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26211

node is an element.

#### Inherited from

```ts
HTMLElement.ELEMENT_NODE
```

***

### ATTRIBUTE\_NODE

```ts
readonly ATTRIBUTE_NODE: 2;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26212

#### Inherited from

```ts
HTMLElement.ATTRIBUTE_NODE
```

***

### TEXT\_NODE

```ts
readonly TEXT_NODE: 3;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26214

node is a Text node.

#### Inherited from

```ts
HTMLElement.TEXT_NODE
```

***

### CDATA\_SECTION\_NODE

```ts
readonly CDATA_SECTION_NODE: 4;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26216

node is a CDATASection node.

#### Inherited from

```ts
HTMLElement.CDATA_SECTION_NODE
```

***

### ENTITY\_REFERENCE\_NODE

```ts
readonly ENTITY_REFERENCE_NODE: 5;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26217

#### Inherited from

```ts
HTMLElement.ENTITY_REFERENCE_NODE
```

***

### ENTITY\_NODE

```ts
readonly ENTITY_NODE: 6;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26218

#### Inherited from

```ts
HTMLElement.ENTITY_NODE
```

***

### PROCESSING\_INSTRUCTION\_NODE

```ts
readonly PROCESSING_INSTRUCTION_NODE: 7;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26220

node is a ProcessingInstruction node.

#### Inherited from

```ts
HTMLElement.PROCESSING_INSTRUCTION_NODE
```

***

### COMMENT\_NODE

```ts
readonly COMMENT_NODE: 8;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26222

node is a Comment node.

#### Inherited from

```ts
HTMLElement.COMMENT_NODE
```

***

### DOCUMENT\_NODE

```ts
readonly DOCUMENT_NODE: 9;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26224

node is a document.

#### Inherited from

```ts
HTMLElement.DOCUMENT_NODE
```

***

### DOCUMENT\_TYPE\_NODE

```ts
readonly DOCUMENT_TYPE_NODE: 10;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26226

node is a doctype.

#### Inherited from

```ts
HTMLElement.DOCUMENT_TYPE_NODE
```

***

### DOCUMENT\_FRAGMENT\_NODE

```ts
readonly DOCUMENT_FRAGMENT_NODE: 11;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26228

node is a DocumentFragment node.

#### Inherited from

```ts
HTMLElement.DOCUMENT_FRAGMENT_NODE
```

***

### NOTATION\_NODE

```ts
readonly NOTATION_NODE: 12;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26229

#### Inherited from

```ts
HTMLElement.NOTATION_NODE
```

***

### DOCUMENT\_POSITION\_DISCONNECTED

```ts
readonly DOCUMENT_POSITION_DISCONNECTED: 1;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26231

Set when node and other are not in the same tree.

#### Inherited from

```ts
HTMLElement.DOCUMENT_POSITION_DISCONNECTED
```

***

### DOCUMENT\_POSITION\_PRECEDING

```ts
readonly DOCUMENT_POSITION_PRECEDING: 2;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26233

Set when other is preceding node.

#### Inherited from

```ts
HTMLElement.DOCUMENT_POSITION_PRECEDING
```

***

### DOCUMENT\_POSITION\_FOLLOWING

```ts
readonly DOCUMENT_POSITION_FOLLOWING: 4;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26235

Set when other is following node.

#### Inherited from

```ts
HTMLElement.DOCUMENT_POSITION_FOLLOWING
```

***

### DOCUMENT\_POSITION\_CONTAINS

```ts
readonly DOCUMENT_POSITION_CONTAINS: 8;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26237

Set when other is an ancestor of node.

#### Inherited from

```ts
HTMLElement.DOCUMENT_POSITION_CONTAINS
```

***

### DOCUMENT\_POSITION\_CONTAINED\_BY

```ts
readonly DOCUMENT_POSITION_CONTAINED_BY: 16;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26239

Set when other is a descendant of node.

#### Inherited from

```ts
HTMLElement.DOCUMENT_POSITION_CONTAINED_BY
```

***

### DOCUMENT\_POSITION\_IMPLEMENTATION\_SPECIFIC

```ts
readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26240

#### Inherited from

```ts
HTMLElement.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
```

***

### nextElementSibling

```ts
readonly nextElementSibling: Element | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26380

Returns the first following sibling that is an element, and null otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CharacterData/nextElementSibling)

#### Inherited from

```ts
HTMLElement.nextElementSibling
```

***

### previousElementSibling

```ts
readonly previousElementSibling: Element | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:26386

Returns the first preceding sibling that is an element, and null otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CharacterData/previousElementSibling)

#### Inherited from

```ts
HTMLElement.previousElementSibling
```

***

### childElementCount

```ts
readonly childElementCount: number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27044

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/childElementCount)

#### Inherited from

```ts
HTMLElement.childElementCount
```

***

### children

```ts
readonly children: HTMLCollection;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27050

Returns the child elements.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/children)

#### Inherited from

```ts
HTMLElement.children
```

***

### firstElementChild

```ts
readonly firstElementChild: Element | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27056

Returns the first child that is an element, and null otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/firstElementChild)

#### Inherited from

```ts
HTMLElement.firstElementChild
```

***

### lastElementChild

```ts
readonly lastElementChild: Element | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:27062

Returns the last child that is an element, and null otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/lastElementChild)

#### Inherited from

```ts
HTMLElement.lastElementChild
```

***

### assignedSlot

```ts
readonly assignedSlot: HTMLSlotElement | null;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:35365

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/assignedSlot)

#### Inherited from

```ts
HTMLElement.assignedSlot
```

## Accessors

### observedAttributes

#### Get Signature

```ts
get static observedAttributes(): ("visible" | "delay" | "offset" | "trigger" | "ordered" | "fit" | "text")[];
```

Defined in: [website/components/media/DrawText.tsx:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L46)

##### Returns

(`"visible"` \| `"delay"` \| `"offset"` \| `"trigger"` \| `"ordered"` \| `"fit"` \| `"text"`)[]

***

### text

#### Get Signature

```ts
get text(): string;
```

Defined in: [website/components/media/DrawText.tsx:66](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L66)

Setter/getter — the text content to animate.

##### Returns

`string`

#### Set Signature

```ts
set text(val): void;
```

Defined in: [website/components/media/DrawText.tsx:70](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L70)

##### Parameters

###### val

`string`

##### Returns

`void`

***

### delay

#### Get Signature

```ts
get delay(): number;
```

Defined in: [website/components/media/DrawText.tsx:76](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L76)

Setter/getter — per-character animation delay in ms.

##### Returns

`number`

#### Set Signature

```ts
set delay(val): void;
```

Defined in: [website/components/media/DrawText.tsx:83](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L83)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### offset

#### Get Signature

```ts
get offset(): number;
```

Defined in: [website/components/media/DrawText.tsx:89](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L89)

Setter/getter — start-time offset before the first character.

##### Returns

`number`

#### Set Signature

```ts
set offset(val): void;
```

Defined in: [website/components/media/DrawText.tsx:93](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L93)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### triggerMode

#### Get Signature

```ts
get triggerMode(): string;
```

Defined in: [website/components/media/DrawText.tsx:99](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L99)

Setter/getter — how the animation starts (visible/manual/hover).

##### Returns

`string`

#### Set Signature

```ts
set triggerMode(val): void;
```

Defined in: [website/components/media/DrawText.tsx:103](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L103)

##### Parameters

###### val

`string`

##### Returns

`void`

***

### ordered

#### Get Signature

```ts
get ordered(): boolean;
```

Defined in: [website/components/media/DrawText.tsx:113](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L113)

Ordered-queue flag — when set, `offset` is a scheduled start on the
shared session clock (document-order cascade) rather than a delay
after this element's own trigger.

##### Returns

`boolean`

***

### visible

#### Get Signature

```ts
get visible(): boolean;
```

Defined in: [website/components/media/DrawText.tsx:119](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L119)

Setter/getter — visibility flag used by the auto trigger.

##### Returns

`boolean`

#### Set Signature

```ts
set visible(val): void;
```

Defined in: [website/components/media/DrawText.tsx:126](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L126)

##### Parameters

###### val

`boolean`

##### Returns

`void`

***

### \_needsCharSpans

#### Get Signature

```ts
get _needsCharSpans(): boolean;
```

Defined in: [website/components/media/DrawText.tsx:200](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L200)

Per-character spans only exist while the animation runs. Before the
element enters the viewport and after the animation has finished the
words are rendered as single nodes: same line breaking, a fraction of
the DOM — long project pages would otherwise mount thousands of char
spans permanently.

##### Returns

`boolean`

***

### \_rootEl

#### Get Signature

```ts
get _rootEl(): HTMLSpanElement | null;
```

Defined in: [website/components/media/DrawText.tsx:213](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L213)

The animated content element inside the shadow root — cached by _applyContent so repeated queries are free.

##### Returns

`HTMLSpanElement` \| `null`

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

```ts
HTMLElement.classList
```

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

```ts
HTMLElement.part
```

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

```ts
HTMLElement.textContent
```

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

```ts
HTMLElement.style
```

## Methods

### connectedCallback()

```ts
connectedCallback(): void;
```

Defined in: [website/components/media/DrawText.tsx:131](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L131)

#### Returns

`void`

***

### disconnectedCallback()

```ts
disconnectedCallback(): void;
```

Defined in: [website/components/media/DrawText.tsx:141](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L141)

#### Returns

`void`

***

### attributeChangedCallback()

```ts
attributeChangedCallback(
   name, 
   oldValue, 
   newValue
): void;
```

Defined in: [website/components/media/DrawText.tsx:161](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L161)

#### Parameters

##### name

`string`

##### oldValue

`string` \| `null`

##### newValue

`string` \| `null`

#### Returns

`void`

***

### \_updateDom()

```ts
_updateDom(): void;
```

Defined in: [website/components/media/DrawText.tsx:206](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L206)

Re-renders the shadow DOM for current props.

#### Returns

`void`

***

### trigger()

```ts
trigger(): void;
```

Defined in: [website/components/media/DrawText.tsx:219](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L219)

Starts the animation externally (manual trigger mode).

#### Returns

`void`

***

### reset()

```ts
reset(): void;
```

Defined in: [website/components/media/DrawText.tsx:225](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L225)

Returns characters to the hidden start state so the animation can replay.

#### Returns

`void`

***

### \_setupTrigger()

```ts
_setupTrigger(): void;
```

Defined in: [website/components/media/DrawText.tsx:247](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L247)

Wires the active trigger mode (delegate — ./draw-text/trigger.ts).

#### Returns

`void`

***

### \_setupFit()

```ts
_setupFit(): void;
```

Defined in: [website/components/media/DrawText.tsx:253](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L253)

Installs the fit-to-width pipeline (delegate — ./draw-text/fit.ts).

#### Returns

`void`

***

### \_startAnimation()

```ts
_startAnimation(): void;
```

Defined in: [website/components/media/DrawText.tsx:259](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L259)

Runs the reveal sequence (delegate — ./draw-text/trigger.ts).

#### Returns

`void`

***

### \_parseTokens()

```ts
_parseTokens(text): DrawToken[];
```

Defined in: [website/components/media/DrawText.tsx:265](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L265)

Tokenizes the text into word/space/br/inline-tag chunks (delegate).

#### Parameters

##### text

`string`

#### Returns

[`DrawToken`](../../draw-text/types/interfaces/DrawToken.md)[]

***

### \_renderContent()

```ts
_renderContent(withChars?): string;
```

Defined in: [website/components/media/DrawText.tsx:271](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/DrawText.tsx#L271)

Builds the animated span tree (delegate — ./draw-text/render.ts).

#### Parameters

##### withChars?

`boolean` = `true`

#### Returns

`string`

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

```ts
HTMLElement.animate
```

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

```ts
HTMLElement.getAnimations
```

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

```ts
HTMLElement.after
```

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

```ts
HTMLElement.before
```

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

```ts
HTMLElement.remove
```

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

```ts
HTMLElement.replaceWith
```

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

```ts
HTMLElement.attachShadow
```

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

```ts
HTMLElement.checkVisibility
```

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

```ts
HTMLElement.closest
```

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

```ts
HTMLElement.closest
```

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

```ts
HTMLElement.closest
```

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

```ts
HTMLElement.closest
```

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

```ts
HTMLElement.computedStyleMap
```

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

```ts
HTMLElement.getAttribute
```

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

```ts
HTMLElement.getAttributeNS
```

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

```ts
HTMLElement.getAttributeNames
```

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

```ts
HTMLElement.getAttributeNode
```

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

```ts
HTMLElement.getAttributeNodeNS
```

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

```ts
HTMLElement.getBoundingClientRect
```

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

```ts
HTMLElement.getClientRects
```

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

```ts
HTMLElement.getElementsByClassName
```

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

```ts
HTMLElement.getElementsByTagName
```

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

```ts
HTMLElement.getElementsByTagName
```

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

```ts
HTMLElement.getElementsByTagName
```

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

```ts
HTMLElement.getElementsByTagName
```

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

```ts
HTMLElement.getElementsByTagName
```

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

```ts
HTMLElement.getElementsByTagNameNS
```

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

```ts
HTMLElement.getElementsByTagNameNS
```

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

```ts
HTMLElement.getElementsByTagNameNS
```

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

```ts
HTMLElement.getElementsByTagNameNS
```

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

```ts
HTMLElement.getHTML
```

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

```ts
HTMLElement.hasAttribute
```

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

```ts
HTMLElement.hasAttributeNS
```

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

```ts
HTMLElement.hasAttributes
```

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

```ts
HTMLElement.hasPointerCapture
```

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

```ts
HTMLElement.insertAdjacentElement
```

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

```ts
HTMLElement.insertAdjacentHTML
```

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

```ts
HTMLElement.insertAdjacentText
```

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

```ts
HTMLElement.matches
```

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

```ts
HTMLElement.matches
```

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

```ts
HTMLElement.matches
```

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

```ts
HTMLElement.matches
```

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

```ts
HTMLElement.releasePointerCapture
```

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

```ts
HTMLElement.removeAttribute
```

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

```ts
HTMLElement.removeAttributeNS
```

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

```ts
HTMLElement.removeAttributeNode
```

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

```ts
HTMLElement.requestFullscreen
```

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

```ts
HTMLElement.requestPointerLock
```

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

```ts
HTMLElement.scroll
```

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

```ts
HTMLElement.scroll
```

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

```ts
HTMLElement.scrollBy
```

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

```ts
HTMLElement.scrollBy
```

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

```ts
HTMLElement.scrollIntoView
```

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

```ts
HTMLElement.scrollTo
```

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

```ts
HTMLElement.scrollTo
```

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

```ts
HTMLElement.setAttribute
```

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

```ts
HTMLElement.setAttributeNS
```

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

```ts
HTMLElement.setAttributeNode
```

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

```ts
HTMLElement.setAttributeNodeNS
```

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

```ts
HTMLElement.setHTMLUnsafe
```

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

```ts
HTMLElement.setPointerCapture
```

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

```ts
HTMLElement.toggleAttribute
```

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

```ts
HTMLElement.webkitMatchesSelector
```

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

```ts
HTMLElement.dispatchEvent
```

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

```ts
HTMLElement.dispatchEvent
```

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

```ts
HTMLElement.attachInternals
```

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

```ts
HTMLElement.click
```

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

```ts
HTMLElement.hidePopover
```

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

```ts
HTMLElement.showPopover
```

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

```ts
HTMLElement.togglePopover
```

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

```ts
HTMLElement.addEventListener
```

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

```ts
HTMLElement.addEventListener
```

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

```ts
HTMLElement.removeEventListener
```

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

```ts
HTMLElement.removeEventListener
```

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

```ts
HTMLElement.blur
```

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

```ts
HTMLElement.focus
```

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

```ts
HTMLElement.appendChild
```

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

```ts
HTMLElement.cloneNode
```

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

```ts
HTMLElement.compareDocumentPosition
```

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

```ts
HTMLElement.contains
```

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

```ts
HTMLElement.getRootNode
```

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

```ts
HTMLElement.hasChildNodes
```

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

```ts
HTMLElement.insertBefore
```

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

```ts
HTMLElement.isDefaultNamespace
```

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

```ts
HTMLElement.isEqualNode
```

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

```ts
HTMLElement.isSameNode
```

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

```ts
HTMLElement.lookupNamespaceURI
```

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

```ts
HTMLElement.lookupPrefix
```

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

```ts
HTMLElement.normalize
```

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

```ts
HTMLElement.removeChild
```

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

```ts
HTMLElement.replaceChild
```

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

```ts
HTMLElement.append
```

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

```ts
HTMLElement.moveBefore
```

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

```ts
HTMLElement.prepend
```

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

```ts
HTMLElement.querySelector
```

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

```ts
HTMLElement.querySelector
```

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

```ts
HTMLElement.querySelector
```

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

```ts
HTMLElement.querySelector
```

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

```ts
HTMLElement.querySelector
```

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

```ts
HTMLElement.querySelectorAll
```

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

```ts
HTMLElement.querySelectorAll
```

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

```ts
HTMLElement.querySelectorAll
```

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

```ts
HTMLElement.querySelectorAll
```

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

```ts
HTMLElement.querySelectorAll
```

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

```ts
HTMLElement.replaceChildren
```
