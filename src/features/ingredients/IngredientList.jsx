import { Button } from "@shared/ui/Button"
import { EmptyState } from "@shared/ui/EmptyState"
import "./ingredients.css"

export function IngredientList({items, onRemove}){
   if (items.length === 0) return <EmptyState title='Добавьте ингредиент'></EmptyState>
    return (

        <ul className="chips">
            {items.map((item)=>
            (<li className="chip" key={item}>{item}
            <Button variant="icon" onClick={()=>onRemove(item)} >×</Button>
            </li>)
            )}
        </ul>
    )
}
