import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@shared/ui/Button"
import { Input } from "@shared/ui/Input"
import { addIngredient, selectIngredients, selectIngredientsError } from "./IngredientsSlice"
import "./ingredients.css"

export function IngredientForm(){
    const dispatch = useDispatch()
    const items = useSelector(selectIngredients)
    const error = useSelector(selectIngredientsError)
    const [draft, setDraft] = useState('')

    function handleSubmit(event){
        event.preventDefault()
        const name = draft.trim().toLowerCase()
        const isValid = name !== "" && !items.some((i) => i.toLowerCase() === name)
        dispatch(addIngredient(draft))
        if (isValid) setDraft('')
    }
    return(
        <form className="ingredient-form" onSubmit={handleSubmit}>
            <Input value = {draft} placeholder="Например, яйца"
            onChange={setDraft}></Input>
            <Button type="submit" >Добавить</Button>
            {error && <p className="form-error" role="alert">{error}</p>}
        </form>
    )
}