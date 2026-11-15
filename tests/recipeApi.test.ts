import { beforeEach, describe, expect, jest, test } from '@jest/globals'

const getMock = jest.fn<
  (url: string, config?: unknown) => Promise<{ data: unknown }>
>()

jest.unstable_mockModule('@shared/api/httpClient', () => ({
  httpClient: { get: getMock },
}))

const { searchRecipes } = await import('../src/features/recipes/recipesApi')

describe('searchRecipes', () => {
  beforeEach(() => {
    getMock.mockReset()
  })

  test('возвращает рецепты при успешном ответе сервера', async () => {
    const signal = new AbortController().signal
    getMock.mockResolvedValue({
      data: {
        meals: [{
          idMeal: '101',
          strMeal: 'Omelette',
          strMealThumb: 'https://example.com/omelette.jpg',
        }],
      },
    })

    const result = await searchRecipes(['Яйца'], signal)

    expect(getMock).toHaveBeenCalledWith('/filter.php', {
      params: { i: 'egg' },
      signal,
    })
    expect(result).toEqual([{
      id: '101',
      title: 'Omelette',
      thumb: 'https://example.com/omelette.jpg',
      matched: ['Яйца'],
    }])
  })

  test('передаёт ошибку сервера вызывающему коду', async () => {
    const signal = new AbortController().signal
    getMock.mockRejectedValue(new Error('Сервер недоступен'))

    const resultPromise = searchRecipes(['яйца'], signal)

    await expect(resultPromise).rejects.toThrow('Сервер недоступен')
  })
})
