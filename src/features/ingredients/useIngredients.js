import { useState } from "react"


function ucFirst(str) {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
}
export function useIngredients(){
    const [ingredients, setIngredients] = useState([])
    const [error, setError] = useState('')
    function addIngredienst(name){
    const clearName = name.trim().toLowerCase()
    if (clearName ===""){
      setError("Название не должно быть пустым")
      return false
    } 
    const isDuplicate = ingredients.some((i) => i.toLowerCase() === clearName);
    if (isDuplicate){
      setError("Такой ингридиент уже есть")
      return false
    }
    setIngredients((prev)=>[...prev, ucFirst(clearName)])
    setError('')
    return true
    }

    function removeIngredient(name){
        setIngredients((prev)=>prev.filter((item)=> item !== name))
    } 
    
    return {ingredients, error, addIngredienst, removeIngredient}
}


