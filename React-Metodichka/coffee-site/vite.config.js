import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Настройки Vite. Плагин react нужен, чтобы понимать JSX.
export default defineConfig({
  plugins: [react()],
})
