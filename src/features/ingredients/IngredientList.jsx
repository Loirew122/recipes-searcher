import { useDispatch, useSelector } from "react-redux"
import { Button } from "@shared/ui/Button"
import { Icon } from "@shared/ui/Icon"
import { removeIngredient, selectIngredients } from "./IngredientsSlice"
import "./ingredients.css"

export function IngredientList(){
    const dispatch = useDispatch()
    const items = useSelector(selectIngredients)
    if (items.length === 0) {
        return <p className="chips__empty">Пока пусто — впишите продукт или выберите из подсказок</p>
    }
    return (
        <ul className="chips">
            {items.map((item)=>
            (<li className="chip" key={item}>{item}
            <Button variant="icon" onClick={()=>dispatch(removeIngredient(item))} aria-label={`Убрать ${item}`}>
                <Icon name="close" size={14} />
            </Button>
            </li>)
            )}
        </ul>
    )
}
