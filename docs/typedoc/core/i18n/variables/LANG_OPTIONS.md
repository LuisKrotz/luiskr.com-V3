[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [core/i18n](../README.md) / LANG\_OPTIONS

```ts
const LANG_OPTIONS: readonly (
  | {
      code: 'en'
      label: string
      cc: string
      flag: string
      cc2?: undefined
      short: string
    }
  | {
      code: 'br'
      label: string
      cc: string
      flag: string
      cc2?: undefined
      short: string
    }
  | {
      code: 'es'
      label: string
      cc: string
      flag: string
      cc2?: undefined
      short: string
    }
  | {
      code: 'de'
      label: string
      cc: string
      cc2: string
      flag: string
      short: string
    }
  | {
      code: 'hrk'
      label: string
      cc: string
      cc2: string
      flag: string
      short: string
    }
  | {
      code: 'cas'
      label: string
      cc: string
      cc2: string
      flag: string
      short: string
    }
  | {
      code: 'riv'
      label: string
      cc: string
      cc2: string
      flag: string
      short: string
    }
  | {
      code: 'gn'
      label: string
      cc: string
      flag: string
      cc2?: undefined
      short: string
    }
  | {
      code: 'it'
      label: string
      cc: string
      flag: string
      cc2?: undefined
      short: string
    }
  | {
      code: 'ru'
      label: string
      cc: string
      flag: string
      cc2?: undefined
      short: string
    }
  | {
      code: 'fr'
      label: string
      cc: string
      flag: string
      cc2?: undefined
      short: string
    }
  | {
      code: 'tln'
      label: string
      cc: string
      cc2: string
      flag: string
      short: string
    }
  | {
      cc2?: undefined
      code: 'gl'
      label: string
      cc: string
      flag: string
      short: string
    }
  | {
      cc2?: undefined
      code: 'ca'
      label: string
      cc: string
      flag: string
      short: string
    }
  | {
      cc2?: undefined
      code: 'nl'
      label: string
      cc: string
      flag: string
      short: string
    }
  | {
      cc2?: undefined
      code: 'ga'
      label: string
      cc: string
      flag: string
      short: string
    }
)[]
```

Defined in: [src/core/i18n.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/i18n.ts#L44)

Language picker rows with `short` defaulted to the uppercased locale
code (PT stays 'PT', EN becomes 'EN').
