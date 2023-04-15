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
          // configure: (proxy, options) => {
          //   const username = 'aaaaaaaaa';
          //   const password = 'bbbbbbbb';
          //   options.auth = `${username}:${password}`;
          // },
        }
      }
    },
    build: {
      cssCodeSplit: false,
    },
  }
})
