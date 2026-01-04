import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  ],
  build: {
    chunkSizeWarningLimit: 2000, // Limit 500 se badha kar 1600 KB kar di
  },
})
