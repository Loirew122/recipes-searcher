import { useEffect, useState } from "react"
import { getRecipeIngredients } from "./recipesApi"

export function useRecipeDetails(id, enabled) {
    const [ingredients, setIngredients] = useState(null)
    const [error, setError] = useState('')
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        if (!enabled || ingredients) return
        const controller = new AbortController()
        getRecipeIngredients(id, controller.signal)
            .then(setIngredients)
            .catch((err) => {
                if (controller.signal.aborted) return
                setError(err.message)
            })
        return () => controller.abort()
    }, [id, enabled, attempt, ingredients])

    function reload() {
        setError('')
        setAttempt((a) => a + 1)
    }

    const status = error ? 'error' : ingredients ? 'success' : enabled ? 'loading' : 'idle'
    return { ingredients, status, reload }
}