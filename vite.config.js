import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.VITE_BASE_PATH || (process.env.VERCEL ? '/' : '/Sykoti-site-web/')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
})
