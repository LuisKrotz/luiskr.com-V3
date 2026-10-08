# `local-modules/braces/index.js`

| | |
|---|---|
| **Source** | `src/local-modules/braces/index.js` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `MAX_NESTING_DEPTH`

Security hardening (GHSA braces <=3.0.3): both `parse` and `expand` walk
brace nodes recursively, so a pattern like `{{{{…}}}}` nested thousands of
levels deep exhausts the call stack before any range/limit check runs.
Glob patterns in this dependency's consumers (micromatch, stylelint,
fast-glob) never nest braces deeper than a handful of levels, so a small
ceiling closes the hole without changing any legitimate behavior.

### `assertSafeNesting`

Scans a pattern for unescaped `{`/`}` nesting depth and throws before the
recursive parser/expander can be driven into stack exhaustion. Backslash
escapes are honored so `\{` does not count toward the depth.
- `@param` {String} input Brace pattern to validate.
- `@param` {Number} [depth] Recursion accumulator for the character loop.

### `braces`

Expand the given pattern or create a regex-compatible string.

```js
const braces = require('braces');
console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
```
- `@param` {String} `str`
- `@param` {Object} `options`

### (module scope)

Parse the given `str` with the given `options`.

```js
// braces.parse(pattern, [, options]);
const ast = braces.parse('a/{b,c}/d');
console.log(ast);
```
- `@param` {String} pattern Brace pattern to parse
- `@param` {Object} options

### (module scope)

Creates a braces string from an AST, or an AST node.

```js
const braces = require('braces');
let ast = braces.parse('foo/{a,b}/bar');
console.log(stringify(ast.nodes[2])); //=> '{a,b}'
```
- `@param` {String} `input` Brace pattern or AST.
- `@param` {Object} `options`

### (module scope)

Compiles a brace pattern into a regex-compatible, optimized string.
This method is called by the main [braces](#braces) function by default.

```js
const braces = require('braces');
console.log(braces.compile('a/{b,c}/d'));
//=> ['a/(b|c)/d']
```
- `@param` {String} `input` Brace pattern or AST.
- `@param` {Object} `options`

### (module scope)

Expands a brace pattern into an array. This method is called by the
main [braces](#braces) function when `options.expand` is true. Before
using this method it's recommended that you read the [performance notes](#performance))
and advantages of using [.compile](#compile) instead.

```js
const braces = require('braces');
console.log(braces.expand('a/{b,c}/d'));
//=> ['a/b/d', 'a/c/d'];
```
- `@param` {String} `pattern` Brace pattern
- `@param` {Object} `options`

### (module scope)

Processes a brace pattern and returns either an expanded array
(if `options.expand` is true), a highly optimized regex-compatible string.
This method is called by the main [braces](#braces) function.

```js
const braces = require('braces');
console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
//=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
```
- `@param` {String} `pattern` Brace pattern
- `@param` {Object} `options`

### (module scope)

Expose "braces"
