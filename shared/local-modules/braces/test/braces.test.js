'use strict'
/**
 * @file braces.test.js — node:test suite for the hardened braces fork.
 * Verifies the unchanged upstream expansion surface plus the nesting-depth
 * guard: patterns deeper than MAX_NESTING_DEPTH must throw RangeError
 * before the recursive parser is reached (GHSA stack-exhaustion fix).
 */
const { test } = require('node:test')
const assert = require('node:assert')
const braces = require('../index.js')

test('expands numeric ranges', () => {
  assert.deepStrictEqual(braces.expand('a/{1..3}/b'), ['a/1/b', 'a/2/b', 'a/3/b'])
})

test('expands lists and nested ranges within the depth cap', () => {
  assert.deepStrictEqual(braces.expand('{a,b}'), ['a', 'b'])
  assert.deepStrictEqual(braces.expand('{a,{b,c}}'), ['a', 'b', 'c'])
  assert.deepStrictEqual(braces.expand('{a,b{1..2}}'), ['a', 'b1', 'b2'])
})

test('escaped braces do not count toward nesting depth', () => {
  const escaped = '\\{'.repeat(20) + '{a,b}'
  assert.deepStrictEqual(braces.expand(escaped).length, 2)
})

test('patterns nested beyond the cap throw RangeError', () => {
  const deep = '{'.repeat(11) + 'a' + '}'.repeat(11)
  assert.throws(() => braces(deep), RangeError)
  assert.throws(() => braces.expand(deep), RangeError)
})

test('patterns at the cap still expand', () => {
  const atCap = '{'.repeat(10) + 'a' + '}'.repeat(10)
  assert.doesNotThrow(() => braces(atCap))
})

test('unclosed braces fall back to a literal (upstream lenient behavior)', () => {
  assert.deepStrictEqual(braces.expand('{a,{b,c'), ['{a,{b,c'])
})
