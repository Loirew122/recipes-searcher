import { describe, expect, test } from '@jest/globals'
import { normalizeApiUrl } from '../src/shared/api/apiUrl'

describe('normalizeApiUrl', () => {
  test('заменяет недоступный www-host TheMealDB', () => {
    expect(normalizeApiUrl('https://www.themealdb.com/api/json/v1/1'))
      .toBe('https://themealdb.com/api/json/v1/1')
  })
})
