# Recipe AI

React-приложение для поиска рецептов по имеющимся продуктам. Клиент написан на TypeScript, состояние хранится в Redux Toolkit, запросы и кеш управляются RTK Query.

## Ссылки

- [Открыть приложение](https://loirew122.github.io/recipes-searcher/)
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

## Проверка

```bash
npm run typecheck
npm run build
npm run lint
```
