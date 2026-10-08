# @luiskrotz/braces

Security-hardened drop-in fork of [`braces@3.0.3`](https://github.com/micromatch/braces).

## What it fixes and why

| Advisory | Issue | Fix in this package |
|---|---|---|
| GHSA-grv7-fg5c-xmjg (and related deep-nesting reports) | `parse()` and `expand()` walk brace nodes recursively; a pattern like `{{{{…}}}}` nested thousands of levels deep exhausts the call stack before any range/limit check runs — a remote DoS when user input reaches a glob. | `assertSafeNesting()` scans the raw pattern for unescaped `{`/`}` depth and throws `RangeError` before the recursive parser is invoked. Ceiling is `MAX_NESTING_DEPTH = 10` — orders of magnitude above any legitimate glob. |

Why vendored: upstream braces is effectively unmaintained for these
advisories, and every consumer chain (`micromatch` → `stylelint` /
`jest` / `chokidar` / `fast-glob`) resolves `braces` transitively, so the
fix must be a drop-in for the same package name. This superproject wires
it via a yarn `resolutions` override — `"**/braces": "file:local-modules/braces"`.

## Differences from upstream

- `index.js` gains `assertSafeNesting()`, invoked by `braces()` /
  `braces.expand()` / `braces.compile()` before parsing.
- Everything else is verbatim `braces@3.0.3` — same API, same tests.

## Usage

Identical to upstream:

```js
const braces = require('@luiskrotz/braces')

braces('a/{1..3}/b')          // → ['a/1/b', 'a/2/b', 'a/3/b']
braces('{{{{{…}}}}}', 11 deep) // → RangeError: maximum brace nesting depth
```

## Test

```sh
yarn test   # node --test test/
```

## License

MIT — see [LICENSE](./LICENSE). Original work Copyright © Jon Schlinkert;
hardening patches Copyright © Luis Krötz.
