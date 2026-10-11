// props приходят одним объектом, из него достаём items; массив передаёт родитель
import { Button } from "@shared/ui/Button"
import { EmptyState } from "@shared/ui/EmptyState"

export function IngredientList({items, onRemove}){
   if (items.length === 0) return <EmptyState title='Добавьте ингредиент'></EmptyState>
     // в JSX нет цикла for: map превращает массив строк в массив <li>
    // key — уникальная метка элемента, по ней React различает строки списка между рендерами
    return (

        <ul> 
            
            {items.map((item)=>
            (<li key={item}>{item}
            <Button onClick={()=>onRemove(item)} >×</Button>
            </li>)
            )}
            
        </ul>
    )
}
