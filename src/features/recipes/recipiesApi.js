// имитация данных сервера: в приложении этот файл потом заменится запросом к Nest.js
export const recipes = [
  { id: 1, title: 'Омлет', time: 10, description: 'Яйца и молоко на сковороде', ingredients: ['яйца', 'молоко'] },
  { id: 2, title: 'Блины', time: 30, description: 'Тонкие блины на молоке', ingredients: ['мука', 'молоко', 'яйца'] },
  { id: 3, title: 'Яичница', time: 7, description: 'Яйца, обжаренные на сливочном масле', ingredients: ['яйца', 'масло'] },
  { id: 4, title: 'Овсяная каша', time: 15, description: 'Овсянка, сваренная на молоке', ingredients: ['овсянка', 'молоко'] },
  { id: 5, title: 'Сырники', time: 25, description: 'Творожные лепёшки, обжаренные на сковороде', ingredients: ['творог', 'яйца', 'мука'] },
  { id: 6, title: 'Салат из овощей', time: 10, description: 'Нарезанные огурцы и помидоры с маслом', ingredients: ['огурцы', 'помидоры', 'масло'] },
];

function delay(ms){
    return new Promise((resolve) =>setTimeout(resolve, ms));
}
export async function searchRecipes(userIngredients) {
    await delay(700);
    if(Math.random() < 0.2){
        throw new Error ('Сервер временно не доступен');
    }
    const wanted = userIngredients.map((item) => item.toLowerCase())
    return recipes.filter((recipe)=>recipe.ingredients.some((ingredient)=>
    wanted.includes(ingredient)))
}