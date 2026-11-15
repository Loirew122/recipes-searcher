import { expect, test } from '@playwright/test'

test('пользователь добавляет продукт и получает рецепт', async ({ page }) => {
  await page.route('**/filter.php*', async (route) => {
    const url = new URL(route.request().url())
    const ingredient = url.searchParams.get('i')
    const meals = ingredient === 'egg'
      ? [{
          idMeal: '101',
          strMeal: 'Omelette',
          strMealThumb: '/favicon.svg',
        }]
      : null

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ meals }),
    })
  })

  await page.goto('/')

  const ingredientInput =
    page.getByRole('textbox', { name: 'Продукт' })

  await ingredientInput.fill('яйца')
  await page.getByRole('button', { name: 'Добавить' }).click()
  await page.getByRole('button', { name: 'Найти рецепты' }).click()

  await expect(page.getByRole('heading', { name: 'Подходящие рецепты' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Omelette' })).toBeVisible()
  await expect(page.getByText('1 рецепт', { exact: true })).toBeVisible()
})
