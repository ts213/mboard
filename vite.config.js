import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API,
          changeOrigin: true,
          secure: false,
        }
      },
      hmr: {
        clientPort: 5173,
      },
      watch: {
        usePolling: true,
        ignored: [
          '**/venv/**'
        ],
      }
    },
    build: {
      cssCodeSplit: false,
    },
  }
})
