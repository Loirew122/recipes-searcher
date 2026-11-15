# Recipe AI

React-приложение для поиска рецептов по имеющимся продуктам. Клиент написан на TypeScript, состояние хранится в Redux Toolkit, запросы и кеш управляются RTK Query.

## Ссылки

- [Открыть приложение](https://loirew122.github.io/recipes-searcher/)
- [Репозиторий](https://github.com/Loirew122/recipes-searcher)
- [Интерактивный разбор ЛР7](https://loirew122.github.io/recipes-searcher/lab7-review.html)
- [Разбор в Markdown](docs/Разбор_лабораторной_7_TypeScript.md)

На GitHub Pages избранное сохраняется в `localStorage`. При локальном запуске с `VITE_FAVORITES_URL` используется Express backend.

## Локальный запуск

```bash
npm install
cp .env.example .env
npm run dev
```

Backend избранного запускается отдельно:

```bash
cd server
npm install
npm start
```

## Тестирование

После установки зависимостей установите Chromium для Playwright:

```bash
npm install
npx playwright install chromium
```

### Unit-тесты

```bash
npm test
```

Jest-тесты проверяют обработку допустимого и ошибочного ограничения
количества рецептов, перевод названий продуктов, успешный асинхронный поиск и
ошибку сервера. В асинхронных тестах подменяется HTTP-клиент, а настоящая
функция `searchRecipes` выполняется без подмены.

### E2E-тест

```bash
npm run test:e2e
```

Playwright автоматически запускает Vite-сервер и Chromium. Отдельно запускать
`npm run dev` не требуется. Тест добавляет продукт, выполняет поиск и проверяет
появление рецепта на странице. Ответ TheMealDB подменяется через `page.route`,
поэтому тест не зависит от доступности внешнего API.

### Полная проверка проекта

```bash
npm test
npm run test:e2e
npm run typecheck
npm run build
npm run lint
```
