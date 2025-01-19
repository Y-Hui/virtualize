import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@are-visual/virtual-table': fileURLToPath(new URL('../virtual-table/src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    define: {
      __DEV__: JSON.stringify(mode === 'development'),
    },
    plugins: [react()],
  }
})
