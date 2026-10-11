import { useState } from "react";
import { searchRecipes } from "./recipiesApi";
export function useRecipeSearch(){
    // 3 состояния рецепта 
      const [status, setStatus] = useState('idle')
      const [foundRecipes, setFoundRecipes] = useState([])
      const [searchError, setSearchError] = useState('')
    
      
      async function search(ingredients) {
        if (status === 'loading') return 
        setStatus('loading')
        setSearchError('')
        try{
          const result = await searchRecipes(ingredients)
          setFoundRecipes(result)
          setStatus('success')
        } catch (err){
          setSearchError(err.message)
          setStatus('error')
        }
      }
    return { status, foundRecipes, searchError, search }
}