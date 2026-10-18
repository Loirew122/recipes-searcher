import { RecipeCard } from "./RecipeCard";
import { Button } from "@shared/ui/Button";
import { Loader } from "@shared/ui/Loader";
import { EmptyState } from "@shared/ui/EmptyState";
import "./recipes.css";
// компонент внутри компонента: для каждого объекта из recipes рендерим свою RecipeCard
export function RecipeList({status, recipes, error, onRetry, userIngredients}){
    if (status === 'idle') return <EmptyState title = 'Добавьте продукты и нажмите "Найти рецепты"'></EmptyState>
    if (status === 'loading') return <Loader />
    if (status === 'error'){
        return (
            <div className="error-box" role="alert">
                <p>{error}</p>
                <Button variant="secondary" onClick={onRetry}>Повторить</Button>
            </div>
        )
    }
    if (recipes.length === 0) return <EmptyState title='Ничего не нашлось' hint='Попробуйте другие продукты' />
    return (
        <section className="recipes">
            {recipes.map((recipe)=>
            <RecipeCard
            key = {recipe.id}
            id={recipe.id}
            title={recipe.title}
            thumb={recipe.thumb}
            matched={recipe.matched}
            userIngredients={userIngredients}
            />
            )}
        </section>
    )
}
