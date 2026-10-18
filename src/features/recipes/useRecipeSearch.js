import { useEffect, useState } from "react";
import { searchRecipes } from "./recipesApi";
export function useRecipeSearch(){
      const [status, setStatus] = useState('loading')
      const [foundRecipes, setFoundRecipes] = useState([])
      const [searchError, setSearchError] = useState('')

      const [queryKey, setQueryKey] = useState('')
      const [attempt, setAttempt] = useState(0)

      useEffect(()=>{
        const controller = new AbortController()
        async function load() {
          try{
            const ingredients = queryKey ? queryKey.split(',') : []
            const result = await searchRecipes(ingredients, controller.signal)
            setFoundRecipes(result)
            setStatus("success")
          } catch(err){
            if (controller.signal.aborted) return
            setSearchError(err.message)
            setStatus("error")
          }
        }
        load()
        return ()=>controller.abort()
      }, [queryKey, attempt])
    
      
       function search(ingredients) {
        setStatus("loading")
        setSearchError("")
        setQueryKey(ingredients.join(','))
        setAttempt((a)=>a+1)
      }
      function reload(){
        setStatus("loading")
        setSearchError("")
        setAttempt((a)=>a+1)
      }
      return { status, foundRecipes, searchError, search, reload }
}