import { RecipeCard } from "./RecipeCard";
import { Button } from "@shared/ui/Button";
import { Loader } from "@shared/ui/Loader";
import { EmptyState } from "@shared/ui/EmptyState";
// компонент внутри компонента: для каждого объекта из recipes рендерим свою RecipeCard
export function RecipeList({status, recipes, error, onRetry, userIngredients}){
    if (status === 'idle') return <EmptyState title = 'Добавьте продукты и нажмите "Найти рецепты"'></EmptyState>
    if (status === 'loading') return <Loader />
    if (status === 'error'){
        return (
            <div>
                <p>{error}</p>
                <Button onClick={onRetry}>Повторить</Button>
            </div>
        )
    }
    if (recipes.length === 0) return <EmptyState title='Ничего не нашлось' hint='Попробуйте другие продукты' />
    return (
        <section>
            {recipes.map((recipe)=>
            <RecipeCard
            // key должен быть уникальным и не меняться, поэтому берём id, а не индекс
            key = {recipe.id}
            // слева имя props для RecipeCard, справа значение из объекта recipe
            title={recipe.title}
            time={recipe.time}
            description = {recipe.description}
            ingredients={recipe.ingredients}
            userIngredients={userIngredients}
            />
            )}
        </section>
    )
}
