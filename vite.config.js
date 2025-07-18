import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()],
     server: {
    host: '0.0.0.0',     // ให้สามารถเข้าจาก IP ภายนอกได้
    port: 5173,          // พอร์ตที่เปิดใช้
  },

})
