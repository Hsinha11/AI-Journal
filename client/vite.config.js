import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This forwards any request starting with /api to your backend
      '/api': 'http://localhost:8000'
    }
  }
})