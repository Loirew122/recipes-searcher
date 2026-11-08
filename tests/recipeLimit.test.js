import assert from 'node:assert/strict'
import test from 'node:test'
import { parseRecipeLimit } from '../src/shared/lib/recipeLimit.ts'

test('принимает целое число от 1 до 20', () => {
  assert.equal(parseRecipeLimit('1'), 1)
  assert.equal(parseRecipeLimit('20'), 20)
})

test('отклоняет пустое и нечисловое значение', () => {
  assert.equal(parseRecipeLimit(''), null)
  assert.equal(parseRecipeLimit('abc'), null)
})

test('отклоняет дроби и числа вне диапазона', () => {
  assert.equal(parseRecipeLimit('1.5'), null)
  assert.equal(parseRecipeLimit('0'), null)
  assert.equal(parseRecipeLimit('21'), null)
})
