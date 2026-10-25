import { RecipeCard } from "./RecipeCard";
import { Button } from "@shared/ui/Button";
import { Loader } from "@shared/ui/Loader";
import { EmptyState } from "@shared/ui/EmptyState";
import "./recipes.css";

export function RecipeList({ recipes, isLoading, isError, error, onRetry }) {
    if (isLoading) return <Loader />
    if (isError) {
        return (
            <div className="error-box" role="alert">
                <p>{error?.message}</p>
                <Button variant="secondary" onClick={onRetry}>Повторить</Button>
            </div>
        )
    }
    if (recipes.length === 0) return <EmptyState title='Ничего не нашлось' hint='Попробуйте другие продукты' />
    return (
        <section className="recipes">
            {recipes.map((recipe) =>
                <RecipeCard
                    key={recipe.id}
                    id={recipe.id}
                    title={recipe.title}
                    thumb={recipe.thumb}
                    matched={recipe.matched}
                />
            )}
        </section>
    )
}
