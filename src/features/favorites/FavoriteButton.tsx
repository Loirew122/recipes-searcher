import { Button } from '@shared/ui/Button'
import { Icon } from '@shared/ui/Icon'
import {
  useAddFavoriteMutation,
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from '@/app/api'
import type { FavoriteRecipe } from '@shared/types/recipe'
import './favorites.css'

interface FavoriteButtonProps extends FavoriteRecipe {
  compact?: boolean
}

export function FavoriteButton({
  id,
  title,
  thumb,
  compact = false,
}: FavoriteButtonProps) {
  const { data: favorites = [], isLoading } = useGetFavoritesQuery()
  const [addFavorite, add] = useAddFavoriteMutation()
  const [removeFavorite, remove] = useRemoveFavoriteMutation()

  const isFavorite = favorites.some((item) => item.id === id)
  const pending = add.isLoading || remove.isLoading
  const error = add.error ?? remove.error
  const label = isFavorite ? 'Убрать из избранного' : 'В избранное'

  function handleClick(): void {
    if (isFavorite) {
      removeFavorite(id)
    } else {
      addFavorite({ id, title, thumb })
    }
  }

  return (
    <div className={`favorite${compact ? ' favorite--compact' : ''}`}>
      {compact ? (
        <Button
          variant="fav"
          onClick={handleClick}
          disabled={pending || isLoading}
          aria-pressed={isFavorite}
          aria-label={label}
          title={label}
        >
          <Icon name="heart" size={20} filled={isFavorite} />
        </Button>
      ) : (
        <Button
          variant="secondary"
          onClick={handleClick}
          disabled={pending || isLoading}
          aria-pressed={isFavorite}
        >
          <Icon name="heart" filled={isFavorite} />
          {pending ? 'Сохраняем...' : label}
        </Button>
      )}

      {error && (
        <p className="favorite__error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}