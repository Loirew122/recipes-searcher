# Лабораторная 7. Миграция Recipe AI на TypeScript

Проект: `lab4-7/recipe-ai`
Стек: React 19, Redux Toolkit, RTK Query, React Router, Axios, Vite, TypeScript 6.

## 1. Результат

Весь клиентский код из `src` переведён с JavaScript/JSX на TypeScript/TSX без изменения пользовательских сценариев.

- 33 клиентских модуля `.ts` и `.tsx` и один declaration-файл;
- 0 модулей `.js` и `.jsx` внутри `src`;
- включены `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`;
- aliases Vite и TypeScript согласованы;
- Redux state, dispatch и selector hooks получили выводимые типы;
- ответы API принимаются как `unknown` и проверяются до использования;
- RTK Query endpoints типизированы по результату и аргументу;
- props, события форм, route params и CSS custom properties типизированы;
- type-aware lint, `typecheck` и production build проходят.

Express-сервер не мигрировался: он остаётся отдельным JavaScript-приложением в `server`.

---

## 2. Карта реализации: где, почему и как

> Официальное условие ЛР7 восстановлено из предыдущей сессии. Точная проверка уровней «Удовлетворительно / Хорошо / Отлично» находится в заметке `ЛР 7 — TypeScript — защита за 1 день.md`. Все 16 критериев выполнены: добавлено проверяемое числовое поле и native props переведены на `ComponentProps`. Таблица ниже — подробная инженерная карта проекта.

| № | Критерий и статус | Где смотреть | Почему это нужно | Как сделано и доказано |
|---:|---|---|---|---|
| 1 | **TypeScript подключён — выполнено** | `package.json:11`, `tsconfig.json:2-29` | Vite умеет преобразовать TS в JS, но не заменяет полную проверку типов | Добавлена команда `tsc --noEmit`; `npm run typecheck` проходит |
| 2 | **Строгий режим без обходов — выполнено** | `tsconfig.json:10-19`, весь `src` | Иначе миграция может формально иметь расширение `.ts`, но сохранять ошибки JavaScript | Включены `strict`, `noUncheckedIndexedAccess`, проверки unused; поиск не нашёл `any`, `@ts-ignore`, `@ts-expect-error` |
| 3 | **Весь клиент мигрирован — выполнено** | каталог `src`, `index.html` | Смешанная кодовая база оставляет нетипизированные разрывы между модулями | 33 файла `.ts/.tsx`, 0 `.js/.jsx`; entry point — `main.tsx` |
| 4 | **Единая доменная модель — выполнено** | `src/shared/types/recipe.ts:1-30` | Один контракт не даёт API, store и компонентам по-разному понимать рецепт | Общая база `RecipeBase`; детали через `extends`, поиск через `Omit`, избранное через `Pick` |
| 5 | **Безопасная граница API — выполнено** | `apiGuards.ts:1-28`, `recipesApi.ts:10-80`, `favoritesApi.ts:8-25` | TypeScript-типы исчезают в браузере, а внешний сервер может вернуть JSON другой формы | Axios принимает `unknown`; guards и parsers проверяют данные и только затем возвращают доменный тип |
| 6 | **Типизированные async-контракты — выполнено** | `recipesApi.ts:83-150`, `favoritesApi.ts:42-92` | Вызывающий код должен знать результат Promise и допустимые аргументы | API-функции явно возвращают `Promise<RecipeSearchResult[]>`, `Promise<RecipeDetails \| null>`, `Promise<FavoriteRecipe[]>` и другие типы |
| 7 | **RTK Query типизирован — выполнено** | `src/app/api.ts:20-84` | Типы результата и аргумента должны дойти от API до сгенерированного React hook | Для пяти endpoints заданы generics `Result, Argument`; `toResult<T>` сохраняет тип успеха и приводит ошибку к `ApiError` |
| 8 | **Redux store и hooks типизированы — выполнено** | `store.ts:6-17`, `hooks.ts:1-5`, оба slice | Ручное описание всего state может разойтись с реальным reducer map | `RootState` и `AppDispatch` выводятся через `typeof`; компоненты используют `useAppSelector` и `useAppDispatch` |
| 9 | **React-контракты типизированы — выполнено** | `shared/ui/*.tsx`, `IngredientForm.tsx`, `RecipeCard.tsx`, `RecipePage.tsx:15-18` | Props, DOM events и route params — частые источники ошибок на границах компонентов | Использованы interfaces, native attribute types, `FormEvent`, `CSSProperties`, type predicate и `skipToken` |
| 10 | **Все состояния UI описаны — выполнено** | `FavoritesPage.tsx:12-64` | Набор независимых boolean-флагов допускает противоречивые состояния | Discriminated union задаёт `loading/error/empty/ready`, а `never` проверяет полноту `switch` |
| 11 | **Aliases согласованы — выполнено** | `tsconfig.json:22-25`, `vite.config.js:12-17` | Компилятор и bundler разрешают imports независимо друг от друга | Одинаковые `@`, `@shared`, `@features`; production build успешно разрешил все imports |
| 12 | **Функциональность сохранена — подтверждено статически** | `router.tsx`, страницы, features, API-слой | Миграция должна менять проверяемость, а не пользовательское поведение | Маршруты, поиск, карточка и избранное сохранены; typecheck и build проходят. Browser smoke test не выполнен из-за запрета binding порта |
| 13 | **Type-aware ESLint анализирует TS/TSX — выполнено** | `eslint.config.js:22-37`, `package.json:31-32` | `tsc` и lint находят разные классы ошибок | Подключены `typescript-eslint` и `recommendedTypeChecked` с `projectService`; `npm run lint` проходит |

### Type-aware lint

Для `*.ts` и `*.tsx` используется отдельный config с `typescript-eslint`. Опция `projectService: true` даёт правилам сведения о типах из `tsconfig.json`, поэтому lint обнаруживает не только синтаксические ошибки. В проекте используется совместимая связка TypeScript 6.0.3 и `typescript-eslint` 8.64.0.

### Короткий ответ преподавателю о критериях

> Я перевёл весь клиентский `src` на TypeScript, включил строгую проверку и провёл типы через все слои: внешний JSON, parser, API-функции, RTK Query, Redux hooks и React-компоненты. Внешним данным я не доверяю автоматически: они приходят как `unknown` и становятся доменными типами только после runtime-проверки. Миграция подтверждается type-aware lint, отдельным `tsc --noEmit` и production build; пользовательские сценарии при этом сохранены.

### Что считать обязательным минимумом перед сдачей

1. `npm run typecheck` завершается без ошибок.
2. `npm run build` собирает приложение и находит все переименованные modules.
3. В `src` нет оставшихся `.js/.jsx`, если требовалась полная миграция.
4. Нет `any`, non-null assertions и `@ts-ignore`, скрывающих проблему.
5. Данные из сети проходят runtime validation, а не только type assertion.
6. После получения официального задания каждый пункт таблицы сопоставлен с его формулировкой.

---

## 3. Зачем нужен TypeScript

JavaScript находит большинство ошибок только во время выполнения. TypeScript проверяет контракты до запуска.

```ts
type PluralForms = readonly [one: string, few: string, many: string]

function plural(count: number, forms: PluralForms): string {
  // реализация
}
```

Компилятор требует число, ровно три формы и строковый результат. Но TypeScript не заменяет runtime-проверки: типы исчезают после сборки, поэтому сетевые данные всё равно недоверенные.

---

## 4. Конфигурация

Файл: `recipe-ai/tsconfig.json`.

| Параметр | Назначение |
|---|---|
| `target: ES2022` | Современный JavaScript на выходе |
| `module: ESNext` | ES modules для Vite |
| `moduleResolution: Bundler` | Разрешение imports по правилам bundler |
| `jsx: react-jsx` | Современное преобразование JSX |
| `types: ["vite/client"]` | Типы `import.meta.env`, CSS и assets |
| `strict: true` | Полный строгий режим |
| `noUncheckedIndexedAccess: true` | Доступ по индексу может дать `undefined` |
| `noUnusedLocals: true` | Ошибка для неиспользуемых значений |
| `noUnusedParameters: true` | Ошибка для неиспользуемых параметров |
| `allowJs: true` | Возможность постепенной миграции |
| `checkJs: false` | Legacy JS не создаёт лишних диагностик |
| `noEmit: true` | `tsc` проверяет, а сборку выполняет Vite |

Aliases TypeScript совпадают с `vite.config.js`:

```json
"paths": {
  "@/*": ["./src/*"],
  "@shared/*": ["./src/shared/*"],
  "@features/*": ["./src/features/*"]
}
```

Это важно: TypeScript может успешно проверить import, но Vite не соберёт приложение, если не знает тот же alias.

---

## 5. Доменные типы

Файл: `src/shared/types/recipe.ts`.

`RecipeBase` содержит общие поля `id`, `title`, `thumb`. `RecipeDetails` расширяет его составом, шагами, категорией, страной и ссылкой на видео.

```ts
export interface RecipeDetails extends RecipeBase {
  ingredients: string[]
  measures: string[]
  steps: string[]
  category: string | null
  area: string | null
  youtube: string | null
}
```

`RecipeSearchResult` строится через `Omit`, потому что поиск возвращает сокращённую карточку. `FavoriteRecipe` строится через `Pick`, потому что backend избранного хранит только три базовых поля.

Преимущество: общие поля не дублируются и не могут случайно получить разные типы.

---

## 6. Безопасная граница API

Главное правило миграции: ответ сервера имеет тип `unknown`, пока структура не проверена.

Небезопасный вариант:

```ts
const response = await client.get<RecipeDetails>('/recipe')
return response.data
```

Generic Axios не валидирует JSON. Он только заставляет компилятор поверить обещанию разработчика.

Использованный вариант:

```ts
const response = await httpClient.get<unknown>('/lookup.php', config)
return toRecipeDetails(response.data)
```

`src/shared/lib/apiGuards.ts` содержит:

- `isRecord` — значение является объектом;
- `requireString` — поле является непустой строкой;
- `nullableString` — допустима строка, `null` или `undefined`.

Поток данных:

```text
HTTP JSON
  → unknown
  → readMeals / parseFavorite / toRecipeDetails
  → runtime validation
  → RecipeSearchResult / RecipeDetails / FavoriteRecipe
  → RTK Query cache
  → React components
```

Если внешний сервис вернёт неправильную форму, приложение получит контролируемую ошибку запроса, а не случайное падение внутри JSX.

---

## 7. RTK Query

Каждый endpoint задаёт тип результата и аргумента:

```ts
builder.query<Result, Argument>(...)
builder.mutation<Result, Argument>(...)
```

| Endpoint | Результат | Аргумент |
|---|---|---|
| `searchRecipes` | `RecipeSearchResult[]` | `string[]` |
| `getRecipe` | `RecipeDetails \| null` | `string` |
| `getFavorites` | `FavoriteRecipe[]` | `void` |
| `addFavorite` | `FavoriteRecipe` | `FavoriteRecipe` |
| `removeFavorite` | `string` | `string` |

`toResult<T>` сохраняет generic результата и преобразует rejected Promise в union `{ data: T } | { error: ApiError }`, который ожидает `queryFn`.

В `catch` ошибка имеет тип `unknown`. Код по очереди проверяет Axios error, форму `response.data`, обычный `Error`, затем использует безопасный общий текст.

---

## 8. Store и typed hooks

Типы не дублируют реальную конфигурацию:

```ts
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

Project hooks:

```ts
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

Selector знает форму `RootState`, а dispatch принимает actions и thunks приложения.

Slices используют `PayloadAction<string>` и `PayloadAction<string[]>`. Вызов с payload неправильного типа теперь останавливает компилятор.

---

## 9. Компоненты

### Props и native attributes

`FavoriteButtonProps` расширяет `FavoriteRecipe` и добавляет optional `compact`.

`Button` расширяет `ComponentProps<'button'>`, поэтому поддерживает настоящие `aria-*`, `title`, `disabled`, `onClick` без ручного перечисления.

`Input` берёт native props через `Omit<ComponentProps<'input'>, 'onChange' | 'value'>` и заменяет callback на удобный `(value: string) => void`.

### Событие формы

```ts
function handleSubmit(event: FormEvent<HTMLFormElement>)
```

### Числовое поле

Поле «Максимум рецептов» хранит значение как `string`, потому что `HTMLInputElement.value` возвращает строку даже при `type="number"`.

```ts
const [recipeLimitInput, setRecipeLimitInput] = useState<string>('12')

function handleRecipeLimitChange(event: ChangeEvent<HTMLInputElement>): void {
  setRecipeLimitInput(event.target.value)
}
```

`parseRecipeLimit` преобразует строку и принимает только целые числа от 1 до 20. Пустая строка, текст, дробь и значения вне диапазона возвращают `null`. Поведение закреплено тестом `tests/recipeLimit.test.js`.

### Закрытый набор иконок

`IconName` — union допустимых строк. Опечатка в имени icon становится compile-time ошибкой.

---

## 10. Особые приёмы

### DOM root guard

`document.getElementById` возвращает `HTMLElement | null`, поэтому перед `createRoot` есть явная проверка.

### `skipToken`

`useParams()` может вернуть `undefined`, а endpoint принимает строку:

```ts
useGetRecipeQuery(id ?? skipToken)
```

Запрос не отправляется без аргумента.

### CSS custom property

```ts
const cardStyle: CSSProperties & { '--i': number } = {
  '--i': index,
}
```

Intersection type расширяет стандартный `CSSProperties` конкретной переменной.

### Discriminated union

`FavoritesPageView` имеет четыре состояния: `loading`, `error`, `empty`, `ready`. Поле `status` сужает union, а `const unreachable: never = view` делает пропущенный case compile-time ошибкой.

### Type predicate

Категория и страна имеют тип `string | null`. Predicate `(tag): tag is string` превращает результат фильтрации в `string[]`.

---

## 11. Как выполнялась миграция

Миграция выполнялась вертикальными срезами. После каждого среза запускался `npm run typecheck`, чтобы ошибка находилась рядом с изменением, которое её вызвало.

### Шаг 1. Зафиксировать исходное состояние

Сначала были проверены `git status`, dependencies, `package.json`, aliases и уже созданные `.ts/.tsx`.

Первый запуск `tsc --noEmit` дал ошибку:

```text
FavoritesPage.tsx: Expected 2 arguments, but got 1
```

`renderContent` принимала `view` и `onRetry`, но вызов передавал только `view`. Вызов дополнен синхронным retry-callback, который явно запускает `refetch` через `void`.

### Шаг 2. Закончить shared-слой

Были переименованы HTTP clients, утилиты и UI primitives. Первый typecheck после rename показал неявные `any` и nullable cases. Затем добавлены:

- `Record<string, string>` для словарей продуктов;
- tuple из трёх словоформ для `plural`;
- `ComponentProps<'button'>` и `ComponentProps<'input'>` для native props;
- union `IconName` для допустимых иконок;
- optional chaining для `config.method` в Axios interceptor.

Shared шёл первым, потому что feature-компоненты зависят от него. После типизации основания ошибки в consumers становятся точнее.

### Шаг 3. Мигрировать feature `ingredients`

Три компонента получили `.tsx`, typed Redux hooks и `FormEvent<HTMLFormElement>`. Reducers уже использовали `PayloadAction<string>`.

Имя `useAllSelector` исправлено на стандартное `useAppSelector`.

### Шаг 4. Закрыть App, router и страницы

После rename `RecipePage` проявил реальную границу: `useParams()` возвращает `string | undefined`, а endpoint принимает `string`. Вместо assertion использован `skipToken`.

Также `App` переведён на typed selector, imports со старыми расширениями удалены, nullable tags сужены type predicate, router и страницы переименованы в `.tsx`.

### Шаг 5. Очистить миграционные хвосты

Проверено, что внутри `src` нет `.js/.jsx`, imports со старыми расширениями отсутствуют, а `index.html` подключает `/src/main.tsx`.

### Шаг 6. Финальный gate

```bash
npm test
npm run typecheck
npm run build
npm run lint
git diff --check
```

Дополнительно выполнен security scan. Он не нашёл hardcoded secrets, dangerous eval, unsafe HTML и TypeScript suppressions.

---

## 12. Разбор кода по слоям и файлам

### 12.1. `tsconfig.json`: правила проверки

`strict` включает строгие проверки. `noUncheckedIndexedAccess` добавляет `undefined` к индексному доступу:

```ts
const matchedIngredient = userIngredients[index]

if (matchedIngredient === undefined) {
  return
}
```

Массивы логически связаны, но компилятор не может доказать равенство их длины, поэтому нужна явная проверка.

### 12.2. `shared/types/recipe.ts`: единая модель

`RecipeBase` задаёт общие поля. Остальные types не переписывают их:

```ts
export type FavoriteRecipe = Pick<
  RecipeDetails,
  'id' | 'title' | 'thumb'
>
```

Если тип `id` изменится в базовой модели, избранное автоматически получит тот же тип.

### 12.3. `shared/lib/apiGuards.ts`: переход от `unknown`

```ts
export function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
```

До проверки нельзя читать `value.id`. После неё keys доступны, но их значения всё ещё `unknown`, поэтому обязательные поля проходят `requireString`.

### 12.4. `features/recipes/recipesApi.ts`: parser TheMealDB

`readMeals` проверяет верхний объект и `meals`. `null` становится пустым массивом: так API сообщает об отсутствии результатов.

`toSearchResult` проверяет поля карточки. `toRecipeDetails` проходит по `strIngredient1...20` и `strMeasure1...20`, нормализует строки и собирает `RecipeDetails`.

```ts
for (let n = 1; n <= 20; n++) {
  const name = nullableString(value[`strIngredient${n}`], `strIngredient${n}`)

  if (name && name.trim()) {
    ingredients.push(name.trim().toLowerCase())
  }
}
```

`searchRecipes` делает запрос по каждому продукту, объединяет карточки через `Map<string, RecipeSearchResult>` и заполняет `matched`.

### 12.5. `features/favorites/favoritesApi.ts`: parser backend

Backend тоже внешняя граница. `parseFavorites` требует массив, затем проверяет каждый элемент:

```ts
return value.map((item: unknown) => parseFavorite(item))
```

Тип `FavoriteRecipe[]` появляется только после проверки всех элементов.

Локально при заданном `VITE_FAVORITES_URL` функции используют Express через Axios. На GitHub Pages backend запустить нельзя, поэтому при отсутствии URL те же функции сохраняют избранное в `localStorage`. RTK Query hooks, mutations и cache invalidation при этом не меняются.

```ts
if (!favoritesServerUrl) {
  writeStoredFavorites([...favorites, recipe])
  return recipe
}
```

Это production fallback для статического hosting, а не второй UI-код: компоненты по-прежнему вызывают только RTK Query mutations.

### 12.6. `app/api.ts`: Promise и RTK Query

`getErrorMessage` сначала проверяет Axios error и payload сервера, затем обычный `Error`.

```ts
async function toResult<T>(promise: Promise<T>): Promise<QueryResult<T>> {
  try {
    return { data: await promise }
  } catch (error: unknown) {
    return { error: { message: getErrorMessage(error) } }
  }
}
```

`builder.query<RecipeDetails | null, string>` связывает тип аргумента hook и тип `data`.

### 12.7. `app/store.ts` и `app/hooks.ts`: вывод типов

```ts
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

Store остаётся источником истины. `import type { RootState }` в slices удаляется из итогового JavaScript, поэтому runtime cycle не создаётся.

### 12.8. Slices: payload и selectors

`IngredientsState` и `SearchState` описывают ветки. `PayloadAction<string>` защищает reducer от неверного payload, а selectors принимают `RootState`.

`ucFirst` использует `charAt(0)`: он всегда возвращает строку, а `value[0]` при строгом индексном доступе может быть `undefined`.

### 12.9. `shared/ui`: primitives

| Файл | Что типизировано | Зачем |
|---|---|---|
| `Button.tsx` | native attributes + `ButtonVariant` | events, aria и допустимые варианты |
| `Input.tsx` | native attributes без исходных `value/onChange` | callback отдаёт строку, а не DOM event |
| `Icon.tsx` | `IconName`, `size`, `filled` | неизвестная иконка не компилируется |
| `EmptyState.tsx` | optional content и `ReactNode` | children может быть ссылкой или JSX |
| `ErrorBox.tsx` | optional retry callback | кнопка есть только когда повтор возможен |
| `Loader.tsx` | optional text | сохраняется значение по умолчанию |

### 12.10. `RecipeCard.tsx`: CSS custom property

```ts
const cardStyle: CSSProperties & { '--i': number } = {
  '--i': index,
}
```

Intersection type добавляет `--i` к стандартному `CSSProperties`.

### 12.11. `RecipePage.tsx`: route param

```ts
const { id } = useParams()
const query = useGetRecipeQuery(id ?? skipToken)
```

`skipToken` лучше `id!`: assertion лишь скрывает `undefined`, а sentinel предотвращает запрос.

### 12.12. `FavoritesPage.tsx`: discriminated union

`FavoritesPageView` задаёт `loading`, `error`, `empty`, `ready`. У `ready` обязательно есть массив, у `error` — message. `never` в конце `switch` требует обработать новый status.

### 12.13. Верхний уровень

- `main.tsx` проверяет `#root`, подключает Redux Provider и RouterProvider;
- `router.tsx` сохраняет `/`, `/recipe/:id`, `/favorites` и `*`;
- `App.tsx` читает typed selector и показывает layout, navigation и Outlet.

Миграция меняет контракты и проверяемость, но не архитектуру и пользовательские сценарии.

---

## 13. Найденные и исправленные проблемы

1. **Пропущенный аргумент.** `renderContent` ожидал `view` и `onRetry`, но вызывался только с `view`. Добавлен синхронный retry-callback с явным `void refetch()`.
2. **Optional route param.** `useGetRecipeQuery(id)` заменён на безопасный вызов со `skipToken`.
3. **Нетипизированные Redux hooks.** Оставшиеся `useDispatch`/`useSelector` заменены на project hooks.
4. **Неудачное имя hook.** `useAllSelector` переименован в стандартное `useAppSelector`.
5. **Старые import extensions.** Удалены ссылки на `.js/.jsx`; production build подтвердил разрешение модулей.
6. **Орфография.** `ингридиент` исправлено на `ингредиент`.
7. **Неохваченный TS lint.** Изначально ESLint config охватывал только JS/JSX. Подключён type-aware config для TS/TSX; он нашёл необработанные Promise в UI callbacks и `any` из `import.meta.env`.
8. **Необработанные Promise.** RTK Query callbacks обёрнуты синхронными обработчиками с явным `void`, поэтому React получает `() => void`, а намеренное игнорирование результата видно анализатору.
9. **Нетипизированные env-переменные.** Добавлен строгий `ImportMetaEnv` для `VITE_API_URL` и `VITE_FAVORITES_URL`; значения больше не протекают в приложение как `any`.

---

## 14. Code review

### Security

Проверены hardcoded secrets, `eval`, `exec`, небезопасная вставка HTML, shell execution, `any`, `@ts-ignore` и `@ts-expect-error`. Совпадений нет.

API data не приводятся через `as` к доверенному типу: используются `unknown` и runtime validation.

### Correctness

- `typecheck` проходит;
- type-aware ESLint для TS/TSX проходит;
- production build проходит;
- `git diff --check` не находит whitespace errors;
- imports со старыми `.js/.jsx` отсутствуют;
- JS/JSX внутри `src` отсутствуют;
- RTK Query, Redux state и component props согласованы.

### Осознанное исключение

В `httpClient.ts` оставлен `console.log` request interceptor. Это функциональность предыдущей лабораторной, а не забытый debug print.

### Ограничение проверки

Vite dev server не запустился в sandbox: binding порта завершился `EPERM`, а разрешение на запуск вне sandbox было отклонено. Browser smoke test не выполнен. Клиентский граф модулей подтверждён production build.

---

## 15. Команды проверки

```bash
npm run typecheck
npm run build
npm run lint
git diff --check
```

Фактический результат:

- `tsc --noEmit` — успешно;
- Vite — 131 modules transformed, build создан;
- ESLint — успешно, включая type-aware правила для TS/TSX;
- `git diff --check` — успешно.

---

## 16. Вопросы к защите

1. **Почему Axios response имеет тип `unknown`?** Generic не валидирует JSON; нужны runtime guards.
2. **Зачем выводить `RootState`?** Ручной тип может разойтись с настоящим store.
3. **Зачем typed hooks?** Один раз связывают React Redux с `RootState` и `AppDispatch`.
4. **Почему route `id` может быть `undefined`?** Hook не гарантирует конкретный route context.
5. **Что даёт `noUncheckedIndexedAccess`?** Индекс может отсутствовать, и это нужно обработать.
6. **Зачем `never` после switch?** Он делает пропущенное состояние ошибкой компиляции.
7. **Почему Vite build недостаточен?** Vite transpiles TS, но не заменяет полный `tsc --noEmit`.
8. **Почему aliases настраиваются дважды?** TypeScript проверяет imports, Vite реально собирает их.
9. **Что происходит с типами в браузере?** Они удаляются, остаётся JavaScript.
10. **Чем `interface` и `type` полезны здесь?** Interface описывает object shape, type удобен для unions, tuples, `Pick` и `Omit`.

---

## 17. Архитектура после миграции

```text
React pages/components
        ↓ typed hooks
Redux slices ←→ RTK Query cache
                  ↓ typed endpoints
API functions: Promise<DomainType>
                  ↓ parsers/guards
Axios response: unknown
                  ↓
TheMealDB / Favorites backend
```

Главный итог: типы проходят через всё приложение, но доверие к внешним данным появляется только после runtime validation.
