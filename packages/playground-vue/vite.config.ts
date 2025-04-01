import vue from '@vitejs/plugin-vue'

import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@are-visual/virtual-table-vue': fileURLToPath(new URL('../virtual-table-vue/src', import.meta.url)),
      },
    },
    define: {
      __DEV__: JSON.stringify(mode === 'development'),
    },
  }
})
