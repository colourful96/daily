import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server:{
      host: "0.0.0.0",
      port: 3000,
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        },
    },
    optimizeDeps: {
        exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"], // 阻止 Vite 预打包这两个依赖
    },
})
