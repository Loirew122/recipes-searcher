export function normalizeApiUrl(apiUrl: string | undefined): string | undefined {
  return apiUrl?.replace(
    /^https:\/\/www\.themealdb\.com(?=\/|$)/,
    'https://themealdb.com',
  )
}
