import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Replace with your C# API's local URL
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
