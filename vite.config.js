import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import {fileURLToPath} from 'node:url'
import process from 'node:process'
// https://vite.dev/config/
const src = (path) =>fileURLToPath(new URL(path, import.meta.url))
export default defineConfig({
  // base: префикс адреса сайта; на GitHub Pages он равен /имя-репозитория/
  // локально переменной нет, поэтому берётся '/' и dev-сервер работает как раньше
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  resolve: {
    alias:{
      '@' : src('./src'), 
      '@shared' : src('./src/shared'), 
      '@features' :  src('./src/features')
    }, 
  }, 
})
