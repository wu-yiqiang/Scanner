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
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    VitePWA({
      // injectRegister: 'auto',
      registerType: 'autoUpdate',
      mode: 'production',
      manifest: {
        name: 'Scanner',
        short_name: 'Scanner',
        description: '扫码器',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'fullscreen',
        icons: [
          {
            src: 'logo-48.png',
            sizes: '48x48',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: 'logo-48.png',
            sizes: '48x48',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: 'logo-72.png',
            sizes: '72x72',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'logo-96.png',
            sizes: '96x96',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'logo-114.png',
            sizes: '114x114',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'logo-192.png',
            sizes: '192x192',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'logo-1024.png',
            sizes: '1024x1024',
            type: 'image/png',
            form_factor: 'wide',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,jpeg}'],
        // clientsClaim: true,
        // skipWaiting: true,
        runtimeCaching: [
          getCache({
            pattern: /^https:\/\/192.168.1.107:443/,
            name: 'local-upload',
          }),
          getCache({
            pattern: /^https:\/\/192.168.1.107:443/,
            name: 'webapp',
          }),
        ],
      },
      devOptions: {
        enabled: false,
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
        // api: 'modern-compiler',
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
