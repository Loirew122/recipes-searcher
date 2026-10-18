import axios from 'axios'

export const httpClient = axios.create({
    baseURL : import.meta.env.VITE_API_URL, 
    timeout: 8000, 
    headers: {Accept : 'application/json'}, 
})

httpClient.interceptors.request.use((config)=>{
    console.log(config.method.toUpperCase(), `${config.baseURL}${config.url}`)
    return config
})