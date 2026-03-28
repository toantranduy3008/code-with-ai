import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// Sử dụng callback function để nhận diện môi trường qua biến 'command'
export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  return {
    // 1. Cấu hình Plugins giữ nguyên của bạn
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],

    // 2. Cấu hình Base URL theo môi trường
    // Khi build (Prod): dùng path '/bankdemo/src/'
    // Khi chạy dev: dùng '/' (không có baseUrl)
    base: isBuild ? '/bankdemo/src/' : '/',

    // 3. Cấu hình Proxy cho môi trường Dev
    server: {
      proxy: {
        // Chỉ hoạt động khi chạy 'npm run dev'
        '/bankdemo/api': {
          target: "https://10.2.254.46:8082/",
          changeOrigin: true,
          secure: false,
        }
      }
    },

    // 4. Cấu hình Build (Tùy chỉnh nếu cần)
    build: {
      outDir: 'dist',
      sourcemap: false, // Tắt sourcemap khi build thật để bảo mật code
    }
  }
})