'use strict'

const stringify = require('./lib/stringify')
const compile = require('./lib/compile')
const expand = require('./lib/expand')
const parse = require('./lib/parse')

/**
 * Security hardening (GHSA braces <=3.0.3): both `parse` and `expand` walk
 * brace nodes recursively, so a pattern like `{{{{…}}}}` nested thousands of
 * levels deep exhausts the call stack before any range/limit check runs.
 * Glob patterns in this dependency's consumers (micromatch, stylelint,
 * fast-glob) never nest braces deeper than a handful of levels, so a small
 * ceiling closes the hole without changing any legitimate behavior.
 */
const MAX_NESTING_DEPTH = 10

/**
 * Scans a pattern for unescaped `{`/`}` nesting depth and throws before the
 * recursive parser/expander can be driven into stack exhaustion. Backslash
 * escapes are honored so `\{` does not count toward the depth.
 *
 * @param {String} input Brace pattern to validate.
 * @param {Number} [depth] Recursion accumulator for the character loop.
 * @return {void}
 */
const assertSafeNesting = (input) => {
  if (typeof input !== 'string') return

  let depth = 0

  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i)

    if (ch === 92 /* \ */) {
      i++
      continue
    }

    if (ch === 123 /* { */) depth++
    if (ch === 125 /* } */) depth = Math.max(0, depth - 1)

    if (depth > MAX_NESTING_DEPTH) {
      throw new RangeError(
        `braces: pattern exceeds maximum nesting depth of ${MAX_NESTING_DEPTH} (possible stack-exhaustion attempt)`
      )
    }
  }
}

const safeParse = (input, options = {}) => {
  assertSafeNesting(input)
  return parse(input, options)
}

/**
 * Expand the given pattern or create a regex-compatible string.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
 * console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

const braces = (input, options = {}) => {
  let output = []

  if (Array.isArray(input)) {
    for (const pattern of input) {
      const result = braces.create(pattern, options)
      if (Array.isArray(result)) {
        output.push(...result)
      } else {
        output.push(result)
      }
    }
  } else {
    output = [].concat(braces.create(input, options))
  }

  if (options && options.expand === true && options.nodupes === true) {
    output = [...new Set(output)]
  }
  return output
}

/**
 * Parse the given `str` with the given `options`.
 *
 * ```js
 * // braces.parse(pattern, [, options]);
 * const ast = braces.parse('a/{b,c}/d');
 * console.log(ast);
 * ```
 * @param {String} pattern Brace pattern to parse
 * @param {Object} options
 * @return {Object} Returns an AST
 * @api public
 */

braces.parse = (input, options = {}) => safeParse(input, options)

/**
 * Creates a braces string from an AST, or an AST node.
 *
 * ```js
 * const braces = require('braces');
 * let ast = braces.parse('foo/{a,b}/bar');
 * console.log(stringify(ast.nodes[2])); //=> '{a,b}'
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.stringify = (input, options = {}) => {
  if (typeof input === 'string') {
    return stringify(braces.parse(input, options), options)
  }
  return stringify(input, options)
}

/**
 * Compiles a brace pattern into a regex-compatible, optimized string.
 * This method is called by the main [braces](#braces) function by default.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.compile('a/{b,c}/d'));
 * //=> ['a/(b|c)/d']
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.compile = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces.parse(input, options)
  }
  return compile(input, options)
}

/**
 * Expands a brace pattern into an array. This method is called by the
 * main [braces](#braces) function when `options.expand` is true. Before
 * using this method it's recommended that you read the [performance notes](#performance))
 * and advantages of using [.compile](#compile) instead.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.expand('a/{b,c}/d'));
 * //=> ['a/b/d', 'a/c/d'];
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.expand = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces.parse(input, options)
  }

  let result = expand(input, options)

  // filter out empty strings if specified
  if (options.noempty === true) {
    result = result.filter(Boolean)
  }

  // filter out duplicates if specified
  if (options.nodupes === true) {
    result = [...new Set(result)]
  }

  return result
}

/**
 * Processes a brace pattern and returns either an expanded array
 * (if `options.expand` is true), a highly optimized regex-compatible string.
 * This method is called by the main [braces](#braces) function.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
 * //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.create = (input, options = {}) => {
  if (input === '' || input.length < 3) {
    return [input]
  }

  return options.expand !== true ? braces.compile(input, options) : braces.expand(input, options)
}

/**
 * Expose "braces"
 */

module.exports = braces
