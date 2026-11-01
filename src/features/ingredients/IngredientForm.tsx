import { useState } from "react"
import type { FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from "@shared/ui/Button"
import { Icon } from "@shared/ui/Icon"
import { Input } from "@shared/ui/Input"
import { addIngredient, selectIngredients, selectIngredientsError } from "./IngredientsSlice"
import "./ingredients.css"

export function IngredientForm(){
    const dispatch = useAppDispatch()
    const items = useAppSelector(selectIngredients)
    const error = useAppSelector(selectIngredientsError)
    const [draft, setDraft] = useState('')

    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        const name = draft.trim().toLowerCase()
        const isValid = name !== "" && !items.some((i) => i.toLowerCase() === name)
        dispatch(addIngredient(draft))
        if (isValid) setDraft('')
    }
    return(
        <form className="ingredient-form" onSubmit={handleSubmit}>
            <label className="ingredient-form__field">
                <span className="visually-hidden">Продукт</span>
                <Icon name="carrot" />
                <Input value = {draft} placeholder="Например, яйца"
                onChange={setDraft}></Input>
            </label>
            <Button type="submit"><Icon name="plus" />Добавить</Button>
            {error && <p className="form-error" role="alert">{error}</p>}
        </form>
    )
}
