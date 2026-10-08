# @luiskrotz/sprintf-js

Security-hardened drop-in fork of
[`sprintf-js@1.0.3`](https://github.com/alexei/sprintf.js).

## What it fixes and why

| Advisory | Issue | Fix in this package |
|---|---|---|
| GHSA sprintf-js <=1.1.3 — Regular Expression / Allocation DoS | `%999999999d`-style field widths and `.999999999` precisions feed unbounded `str_repeat()` allocations and `Number.toFixed()` calls, hanging the process on a few bytes of input. | Field width and precision are clamped to `MAX_FIELD_WIDTH = 1024` / `MAX_PRECISION = 100` before any allocation. Oversized specifiers produce a bounded 1024-char field instead of an unbounded allocation. |

Why vendored: upstream is unmaintained and the advisory has no fix release.
The consumer chain here is `js-yaml` → `argparse` → `sprintf-js` (used by
jest/istanbul reporting and yaml tooling), wired via
`"**/sprintf-js": "file:local-modules/sprintf-js"`.

## Differences from upstream

- `sprintf()`/`vsprintf()` clamp `match[6]` (width) and `match[8]`
  (precision) to bounded integers before `str_repeat` / `toFixed`.
- `MAX_WIDTH`/`MAX_PRECISION` constants are documented at the top of
  `index.js`.
- Everything else is verbatim upstream — identical formatting semantics.

## Usage

```js
const { sprintf, vsprintf } = require('@luiskrotz/sprintf-js')

sprintf('%08.2f', 3.14159)        // → '00003.14'
sprintf('%999999999d', 1)         // → '1' padded to 1024 chars (clamped)
```

## Test

```sh
yarn test   # node --test test/
```

## License

MIT for the hardening changes — see [LICENSE](./LICENSE). The original
implementation is BSD-3-Clause, Copyright © Alexandru Mărășteanu; the BSD
notice is retained in [LICENSE](./LICENSE) per its redistribution terms.
