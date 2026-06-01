import { defineConfig, loadEnv } from 'vite'
import type { ProxyOptions } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendApiBaseUrl = env.VITE_BACKEND_API_BASE_URL
  const backendApiTarget = backendApiBaseUrl || 'https://dev.barocloud.com'
  const kakaoRestApiKey = env.KAKAO_REST_API_KEY
  const proxy: Record<string, ProxyOptions> = {
    '/api/auth': {
      target: backendApiTarget,
      changeOrigin: true,
      rewrite: (requestPath: string) => requestPath.replace(/^\/api\/auth/, '/user/auth'),
    },
    '/api/places/search': {
      target: 'https://dapi.kakao.com',
      changeOrigin: true,
      rewrite: (requestPath: string) =>
        requestPath.replace(/^\/api\/places\/search/, '/v2/local/search/keyword.json'),
      configure: (proxyServer) => {
        proxyServer.on('proxyReq', (proxyRequest) => {
          if (kakaoRestApiKey) {
            proxyRequest.setHeader('Authorization', `KakaoAK ${kakaoRestApiKey}`)
          }
        })
      },
    },
    '/api/dispatch': {
      target: backendApiTarget,
      changeOrigin: true,
      rewrite: (requestPath: string) => requestPath.replace(/^\/api/, ''),
    },
  }

  return {
    plugins: [
      figmaAssetResolver(),
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy,
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
