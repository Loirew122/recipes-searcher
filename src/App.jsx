import { NavLink, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectIngredients } from "@features/ingredients/IngredientsSlice.js"
import { useGetFavoritesQuery } from "@/app/api"
import "./App.css"

function App(){
  const ingredients = useSelector(selectIngredients)
  const { data: favorites = [] } = useGetFavoritesQuery()

  return (
    <main className="app">
      <header className="app__header">
        <h1>Придумывалка рецептов</h1>
        <nav className="app__nav">
          <NavLink to="/" end>Поиск</NavLink>
          {" "}
          <NavLink to="/favorites">Избранное ({favorites.length})</NavLink>
        </nav>
        <p className="app__counter">Продуктов: {ingredients.length}</p>
      </header>
      <Outlet />
    </main>
  )
}

export default App
