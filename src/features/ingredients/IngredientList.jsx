import { useDispatch, useSelector } from "react-redux"
import { Button } from "@shared/ui/Button"
import { EmptyState } from "@shared/ui/EmptyState"
import { removeIngredient, selectIngredients } from "./IngredientsSlice"
import "./ingredients.css"

export function IngredientList(){
    const dispatch = useDispatch()
    const items = useSelector(selectIngredients)
    if (items.length === 0) return <EmptyState title='Добавьте ингредиент'></EmptyState>
    return (
        <ul className="chips">
            {items.map((item)=>
            (<li className="chip" key={item}>{item}
            <Button variant="icon" onClick={()=>dispatch(removeIngredient(item))} >×</Button>
            </li>)
            )}
        </ul>
    )
}