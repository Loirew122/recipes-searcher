import axios from 'axios'

export const favoritesClient = axios.create({
    baseURL: import.meta.env.VITE_FAVORITES_URL,
    timeout: 8000,
    headers: { Accept: 'application/json' },
})
