export function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`В ответе API отсутствует строковое поле "${fieldName}"`)
  }

  return value
}

export function nullableString(
  value: unknown,
  fieldName: string,
): string | null {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value !== 'string') {
    throw new Error(`Поле "${fieldName}" должно быть строкой или null`)
  }

  return value
}
