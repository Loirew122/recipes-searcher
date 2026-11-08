const MIN_RECIPE_LIMIT = 1
const MAX_RECIPE_LIMIT = 20

export function parseRecipeLimit(value: string): number | null {
  if (value.trim() === '') {
    return null
  }

  const limit = Number(value)

  if (!Number.isInteger(limit) || limit < MIN_RECIPE_LIMIT || limit > MAX_RECIPE_LIMIT) {
    return null
  }

  return limit
}
