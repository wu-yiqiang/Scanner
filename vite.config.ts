import { resolve, dirname } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { VitePWA } from 'vite-plugin-pwa'
import basicSsl from '@vitejs/plugin-basic-ssl'

const pathResolve = (dir: string): string => {
  return resolve(__dirname, '.', dir)
}

const getCache = ({ name, pattern }: any) => ({
  urlPattern: pattern,
  handler: 'CacheFirst' as const,
  options: {
    cacheName: name,
    expiration: {
      maxEntries: 500,
      maxAgeSeconds: 60 * 60 * 24 * 365 * 2 // 2 years
    },
    cacheableResponse: {
      statuses: [200]
    }
  }
})
export default defineConfig({
  // base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Scanner',
        short_name: 'Scanner',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/src/assets/images/logo-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/src/assets/images/logo-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,jpeg}'],
      },
      devOptions: {
        enabled: true,
      },
    }),
    vue(),
    basicSsl(),
    svgLoader(),
    createSvgIconsPlugin({
      iconDirs: [pathResolve('src/assets/svg/')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api', 'color-functions'],
      },
    },
  },
  server: {
    hmr: true,
    host: '0.0.0.0',
    port: 9999,
    https: true,
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    cssCodeSplit: true,
    cssTarget: '',
    emptyOutDir: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name][hash].js',
        chunkFileNames: 'js/[name][hash].js',
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name
          if (fileName?.endsWith('.css')) return 'css/[name]-[hash][extname]'
          return 'assets/[ext]/[name][hash].[ext]'
        },
      },
    },
  },
})
