import { useState } from "react"
import { Button } from "@shared/ui/Button"
import { Input } from "@shared/ui/Input"
// onAdd — callback из props: форма не меняет список сама, а просит об этом родителя
export function IngredientForm({onAdd, error}){
    // draft — набираемый текст, хранится в state формы, потому что нужен только ей
    // setDraft меняет draft и просит React перерисовать компонент
    const [draft, setDraft] = useState('')
    // вызывается по клику на submit-кнопку и по Enter
    function handleSubmit(event){
        // отменяем перезагрузку страницы, которую браузер делает при отправке формы
        event.preventDefault()
        // передаём введённый текст родителю
        const added = onAdd(draft)
        // value поля берётся из draft, поэтому для очистки поля достаточно обнулить state
        if (added) setDraft('')
    }
    // controlled input: value показывает draft, onChange кладёт набранный текст обратно в draft
    // event.target.value — текущий текст поля
    return(
        <form onSubmit={handleSubmit}>
            <Input value = {draft}
            onChange={setDraft}></Input>
            <Button type="submit" >Добавить</Button>
            {error && <p>{error}</p>}
        </form>
    )
}
