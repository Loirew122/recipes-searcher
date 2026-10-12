import { useState } from "react"
import { Button } from "@shared/ui/Button"
import { Input } from "@shared/ui/Input"
import "./ingredients.css"
export function IngredientForm({onAdd, error}){
    const [draft, setDraft] = useState('')
    function handleSubmit(event){
        event.preventDefault()
        const added = onAdd(draft)
        if (added) setDraft('')
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
