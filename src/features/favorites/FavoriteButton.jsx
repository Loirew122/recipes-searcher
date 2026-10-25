import { Button } from "@shared/ui/Button"
import { useAddFavoriteMutation, useGetFavoritesQuery, useRemoveFavoriteMutation } from "@/app/api"

export function FavoriteButton({ id, title, thumb }) {
    const { data: favorites = [], isLoading } = useGetFavoritesQuery()
    const [addFavorite, add] = useAddFavoriteMutation()
    const [removeFavorite, remove] = useRemoveFavoriteMutation()

    const isFavorite = favorites.some((item) => item.id === id)
    const pending = add.isLoading || remove.isLoading
    const error = add.error ?? remove.error

    function handleClick() {
        if (isFavorite) removeFavorite(id)
        else addFavorite({ id, title, thumb })
    }

    return (
        <div>
            <Button variant="secondary" onClick={handleClick} disabled={pending || isLoading}>
                {pending ? "Сохраняем..." : isFavorite ? "Убрать из избранного" : "В избранное"}
            </Button>
            {error && <p className="form-error" role="alert">{error.message}</p>}
        </div>
    )
}
