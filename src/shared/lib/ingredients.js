const RU_TO_EN = {
  'яйца': 'egg', 'яйцо': 'egg',
  'молоко': 'milk',
  'мука': 'flour',
  'масло': 'butter', 'сливочное масло': 'butter',
  'подсолнечное масло': 'sunflower oil', 'оливковое масло': 'olive oil',
  'курица': 'chicken', 'говядина': 'beef', 'свинина': 'pork', 'баранина': 'lamb',
  'лосось': 'salmon', 'креветки': 'shrimp', 'бекон': 'bacon',
  'помидоры': 'tomatoes', 'томаты': 'tomatoes', 'огурцы': 'cucumber',
  'картофель': 'potatoes', 'картошка': 'potatoes',
  'морковь': 'carrots', 'лук': 'onion', 'чеснок': 'garlic',
  'грибы': 'mushrooms', 'капуста': 'cabbage', 'свёкла': 'beetroot',
  'яблоки': 'apples', 'лимон': 'lemon', 'бананы': 'banana',
  'сыр': 'cheese', 'сметана': 'sour cream', 'сливки': 'cream',
  'йогурт': 'yogurt', 'творог': 'cottage cheese',
  'рис': 'rice', 'спагетти': 'spaghetti', 'хлеб': 'bread', 'овсянка': 'oats',
  'сахар': 'sugar', 'соль': 'salt', 'перец': 'pepper', 'мёд': 'honey', 'вода': 'water',
}

const EN_TO_RU = {}
for (const [ru, en] of Object.entries(RU_TO_EN)) {
  if (!(en in EN_TO_RU)) EN_TO_RU[en] = ru
}

export function toEnglish(name) {
  const key = name.trim().toLowerCase()
  // ?? берёт правую часть, только если слева undefined или null
  return RU_TO_EN[key] ?? key
}

export function toRussian(name) {
  const key = name.trim().toLowerCase()
  return EN_TO_RU[key] ?? name
}
