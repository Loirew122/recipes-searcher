import { Link, NavLink, Outlet } from "react-router-dom"
import { useAppSelector } from '@/app/hooks'
import { selectIngredients } from "@features/ingredients/IngredientsSlice"
import { useGetFavoritesQuery } from "@/app/api"
import { Icon } from "@shared/ui/Icon"
import { plural } from "@shared/lib/plural"
import "./App.css"

function App(){
  const ingredients = useAppSelector(selectIngredients)
  const { data: favorites = [] } = useGetFavoritesQuery()

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__inner">
          <Link to="/" className="brand">
            <span className="brand__logo"><Icon name="chef" size={22} /></span>
            Придумывалка рецептов
          </Link>
          <nav className="app__nav">
            <NavLink to="/" end><Icon name="search" />Поиск</NavLink>
            <NavLink to="/favorites">
              <Icon name="heart" />Избранное
              {favorites.length > 0 && <span className="app__badge">{favorites.length}</span>}
            </NavLink>
            <span className="app__counter" title="Продуктов в списке">
              <Icon name="carrot" size={16} />
              {ingredients.length} {plural(ingredients.length, ["продукт", "продукта", "продуктов"])}
            </span>
          </nav>
        </div>
      </header>
      <main className="app__main">
        <Outlet />
      </main>
      <footer className="app__footer">
        Рецепты и фотографии — <a href="https://www.themealdb.com" target="_blank" rel="noreferrer">TheMealDB</a>
        {' · '}
        <a href={`${import.meta.env.BASE_URL}lab7-review.html`}>Разбор ЛР7</a>
      </footer>
    </div>
  )
}

export default App
