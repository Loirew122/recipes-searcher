import { createHashRouter } from "react-router-dom"
import App from "@/App"
import { HomePage } from "@/pages/HomePage"
import { RecipePage } from "@/pages/RecipePage"
import { FavoritesPage } from "@/pages/FavoritesPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "recipe/:id", element: <RecipePage /> },
      { path: "favorites", element: <FavoritesPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])