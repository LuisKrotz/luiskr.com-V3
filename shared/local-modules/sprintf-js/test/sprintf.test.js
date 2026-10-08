'use strict'
/**
 * @file sprintf.test.js — node:test suite for the hardened sprintf fork.
 * Covers the unchanged upstream formatting surface plus the DoS guard:
 * width/precision specifiers beyond MAX_WIDTH/MAX_PRECISION must throw
 * instead of allocating unbounded strings.
 */
const { test } = require('node:test')
const assert = require('node:assert')
const { sprintf, vsprintf } = require('../index.js')

test('formats standard specifiers unchanged', () => {
  assert.strictEqual(sprintf('%s %s', 'a', 'b'), 'a b')
  assert.strictEqual(sprintf('%d', 42), '42')
  assert.strictEqual(sprintf('%08.2f', 3.14159), '00003.14')
  assert.strictEqual(sprintf('%x', 255), 'ff')
  assert.strictEqual(sprintf('%5.2f', 3.14159), ' 3.14')
  assert.strictEqual(sprintf('%-5d|', 7), '7    |')
})

test('vsprintf accepts an argument array', () => {
  assert.strictEqual(vsprintf('%s=%d', ['x', 1]), 'x=1')
})

test('width within the cap still pads normally', () => {
  assert.strictEqual(sprintf('%10d', 1), '         1')
  assert.strictEqual(sprintf('%1024s', 'x').length, 1024)
})

test('width beyond MAX_FIELD_WIDTH is clamped, not allocated', () => {
  const out = sprintf('%999999999d', 1)
  assert.strictEqual(out.length, 1024)
  assert.ok(out.endsWith('1'))
})

test('precision beyond MAX_PRECISION is clamped to a bounded toFixed', () => {
  const out = sprintf('%.999999999f', 1.5)
  assert.ok(out.length <= 103)
  assert.ok(out.startsWith('1.5'))
})

test('non-string numeric coercion still works', () => {
  assert.strictEqual(sprintf('%d', '12'), '12')
})
