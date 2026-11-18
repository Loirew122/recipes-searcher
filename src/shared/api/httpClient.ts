import axios from 'axios'
import { normalizeApiUrl } from './apiUrl'

export const httpClient = axios.create({
    baseURL : normalizeApiUrl(import.meta.env.VITE_API_URL),
    timeout: 8000, 
    headers: {Accept : 'application/json'}, 
})

httpClient.interceptors.request.use((config)=>{
    console.log(config.method?.toUpperCase() ?? 'GET', `${config.baseURL}${config.url}`)
    return config
})
