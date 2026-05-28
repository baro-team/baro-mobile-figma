import { defineConfig, loadEnv } from 'vite'
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
  const dispatchApiBaseUrl = env.VITE_DISPATCH_API_BASE_URL
  const authApiBaseUrl =
    env.VITE_AUTH_API_BASE_URL ||
    'http://baro-dev-1701378146.ap-northeast-2.elb.amazonaws.com'
  const proxy = {
    '/api/auth': {
      target: authApiBaseUrl,
      changeOrigin: true,
      rewrite: (requestPath: string) => requestPath.replace(/^\/api/, ''),
    },
    ...(dispatchApiBaseUrl
      ? {
          '/api/dispatch': {
            target: dispatchApiBaseUrl,
            changeOrigin: true,
            rewrite: (requestPath: string) => requestPath.replace(/^\/api/, ''),
          },
        }
      : {}),
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
