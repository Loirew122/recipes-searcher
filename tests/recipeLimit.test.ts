import { describe, expect, test } from '@jest/globals'
import { parseRecipeLimit } from '../src/shared/lib/recipeLimit'

describe('parseRecipeLimit', () => {
  test('возвращает число для корректного значения', () => {
    const value = '12'
    const result = parseRecipeLimit(value)

    expect(result).toBe(12)
  })

  test.each([
    { value: '1', expected: 1 },
    { value: '20', expected: 20 },
  ])('возвращает $expected для границы "$value"', ({ value, expected }) => {
    const result = parseRecipeLimit(value)

    expect(result).toBe(expected)
  })

  test.each([
    '', ' ', 'abc', '1.5', '0', '21',
  ])('возвращает null для некорректного значения "%s"', (value) => {
    const result = parseRecipeLimit(value)

    expect(result).toBeNull()
  })
})
