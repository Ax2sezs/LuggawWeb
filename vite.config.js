import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// สมมติเอา env.VITE_BUILD_VERSION หรือ timestamp มาใช้กำหนดชื่อโฟลเดอร์
const version = process.env.VITE_BUILD_VERSION || new Date().toISOString().replace(/[:.]/g, '-')

export default defineConfig(({ mode }) => ({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    outDir: mode === 'admin' ? `dist/admin-${version}` : `dist/user-${version}`
  }
}))
