import { useDispatch, useSelector } from "react-redux"
import { Icon } from "@shared/ui/Icon"
import { addIngredient, selectIngredients } from "./IngredientsSlice"
import "./ingredients.css"

const SUGGESTIONS = ["Курица", "Яйца", "Рис", "Сыр", "Помидоры", "Картофель", "Грибы", "Лосось"]

export function IngredientSuggestions() {
    const dispatch = useDispatch()
    const items = useSelector(selectIngredients)
    const rest = SUGGESTIONS.filter((name) => !items.includes(name)).slice(0, 6)

    if (rest.length === 0) return null
    return (
        <div className="suggestions">
            <span className="suggestions__label">Быстро добавить:</span>
            <ul className="chips">
                {rest.map((name) => (
                    <li key={name}>
                        <button type="button" className="chip chip--ghost" onClick={() => dispatch(addIngredient(name))}>
                            <Icon name="plus" size={14} />{name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
