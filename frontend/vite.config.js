import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const backendUrl = env.VITE_API_URL ? env.VITE_API_URL.replace(/\/api\/v1\/?$/, '') : 'https://realestate-backend-jauj.onrender.com'

  return defineConfig({
    plugins: [react()],
    server: {
      port: 5508,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  })
}
