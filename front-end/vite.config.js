import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: '10.50.16.226',
    port: 3030,
  },
  preview: {
    host: '10.50.16.226',
    port: 3030,
  },


})
