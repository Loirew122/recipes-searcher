import { describe, expect, test } from '@jest/globals'
import { toEnglish } from '../src/shared/lib/ingredients'

describe('toEnglish', () => {
  test('переводит известное русское название', () => {
    const value = 'яйца'

    const result = toEnglish(value)

    expect(result).toBe('egg')
  })

  test('удаляет пробелы и приводит строку к нижнему регистру', () => {
    const value = '  МОЛОКО  '

    const result = toEnglish(value)

    expect(result).toBe('milk')
  })

  test('оставляет неизвестное название без перевода', () => {
    const value = 'avocado'

    const result = toEnglish(value)

    expect(result).toBe('avocado')
  })

  test('возвращает пустую строку для пустого значения', () => {
    const value = ''

    const result = toEnglish(value)

    expect(result).toBe('')
  })
})
